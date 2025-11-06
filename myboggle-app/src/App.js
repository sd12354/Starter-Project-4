import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { api } from './api';
import Board from './Board.js';
import GuessInput from './GuessInput.js';
import FoundSolutions from './FoundSolutions.js';
import SummaryResults from './SummaryResults.js';
import ToggleGameState from './ToggleGameState.js';
import ChallengeLoader from './ChallengeLoader.js';
import Auth from './Auth.js';
import './App.css';

// Simple Boggle Solver (JavaScript version)
class BoggleSolver {
  constructor(grid, dictionary) {
    this.grid = grid || [];
    this.dictionary = dictionary || [];
  }

  expandTile(tile) {
    const tileUpper = tile.toUpperCase();
    if (tileUpper === "QU" || tileUpper === "ST") {
      return tileUpper;
    }
    return tileUpper;
  }

  getSolution() {
    const solutions = [];
    
    if (!this.grid || !this.dictionary || this.grid.length === 0) {
      return [];
    }

    const rows = this.grid.length;
    const cols = this.grid[0]?.length || 0;

    if (rows === 0 || cols === 0) {
      return [];
    }

    const dictSet = new Set(this.dictionary.map(w => w.toUpperCase()));
    
    const prefixes = new Set();
    for (const word of dictSet) {
      for (let i = 1; i <= word.length; i++) {
        prefixes.add(word.substring(0, i));
      }
    }

    const dfs = (row, col, visited, currentWord) => {
      if (!prefixes.has(currentWord)) {
        return;
      }

      if (currentWord.length >= 3 && dictSet.has(currentWord)) {
        if (!solutions.includes(currentWord)) {
          solutions.push(currentWord);
        }
      }

      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];

      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        const key = `${newRow},${newCol}`;

        if (newRow >= 0 && newRow < rows && 
            newCol >= 0 && newCol < cols && 
            !visited.has(key)) {
          
          const tileValue = this.expandTile(this.grid[newRow][newCol]);
          visited.add(key);
          dfs(newRow, newCol, visited, currentWord + tileValue);
          visited.delete(key);
        }
      }
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const startingTile = this.expandTile(this.grid[r][c]);
        const visited = new Set([`${r},${c}`]);
        dfs(r, c, visited, startingTile);
      }
    }

    return solutions.sort();
  }
}

// Utility function to generate random grid
const generateRandomGrid = (size) => {
  const letters = "ABCDEFGHIJKLMNOPRSTUVWY";
  const grid = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    grid.push(row);
  }
  return grid;
};

function App() {
  // State management
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [grid, setGrid] = useState([]);
  const [gridSize, setGridSize] = useState(4);
  const [puzzles, setPuzzles] = useState({});
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [allValidWords, setAllValidWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [message, setMessage] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState([]);
  const [dictionarySet, setDictionarySet] = useState(new Set());
  const [showChallengeLoader, setShowChallengeLoader] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [user, setUser] = useState(null);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Load dictionary and puzzles on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load dictionary
        const dictResponse = await fetch('/full-wordlist.json');
        const dictData = await dictResponse.json();
        const words = dictData.words || [];
        setDictionary(words);
        
        // Create a Set for fast dictionary lookups
        const dictSet = new Set(words.map(word => word.toUpperCase()));
        setDictionarySet(dictSet);
        
        console.log(`Full word list loaded: ${words.length} words from dictionary`);

        // Load puzzles (optional - for backward compatibility)
        try {
          const puzzlesResponse = await fetch('/Boggle_Solutions_Endpoint.json');
          const puzzlesData = await puzzlesResponse.json();
          setPuzzles(puzzlesData || {});
        } catch (error) {
          console.warn('Puzzles file not found, skipping');
          setPuzzles({});
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle Start/Stop button
  const handleStartStop = () => {
    if (gameStarted) {
      handleEndGame();
    } else {
      handleStartGame();
    }
  };

  const handleStartGame = async () => {
    setLoading(true);
    let newGrid;
    let solutions;

    try {
      // Ensure dictionary is loaded
      if (!dictionary || dictionary.length === 0) {
        setMessage('Dictionary not loaded yet. Please wait...');
        setLoading(false);
        return;
      }

      if (selectedChallenge) {
        // Use challenge from Django API
        newGrid = selectedChallenge.grid;
        setGridSize(selectedChallenge.size);
        // Use full dictionary to find all possible words
        const solver = new BoggleSolver(newGrid, dictionary);
        solutions = solver.getSolution();
        console.log(`Using full dictionary (${dictionary.length} words) to solve challenge "${selectedChallenge.name}". Found ${solutions.length} valid words.`);
      } else if (selectedPuzzle !== null && puzzles[selectedPuzzle]) {
        // Use pre-made puzzle
        setSelectedChallenge(null);
        const puzzle = puzzles[selectedPuzzle];
        newGrid = puzzle.grid;
        const solver = new BoggleSolver(newGrid, dictionary);
        solutions = solver.getSolution();
        console.log(`Using full dictionary (${dictionary.length} words) to solve puzzle. Found ${solutions.length} valid words.`);
      } else {
        // Generate random puzzle
        setSelectedChallenge(null);
        newGrid = generateRandomGrid(gridSize);
        const solver = new BoggleSolver(newGrid, dictionary);
        solutions = solver.getSolution();
        console.log(`Using full dictionary (${dictionary.length} words) to solve random grid. Found ${solutions.length} valid words.`);
      }

      setGrid(newGrid);
      setAllValidWords(solutions);
      setGameStarted(true);
      setGameEnded(false);
      setFoundWords([]);
      setCurrentGuess('');
      setMessage('');
      setStartTime(Date.now());
    } catch (error) {
      console.error('Error starting game:', error);
      setMessage('Error starting game');
    } finally {
      setLoading(false);
    }
  };

  const handleEndGame = async () => {
    const endTime = Date.now();
    const timeElapsed = (endTime - startTime) / 1000;
    setTotalTime(timeElapsed);
    setGameEnded(true);
    setGameStarted(false);

    // Automatically save score to Django API if playing a challenge and user is signed in
    if (selectedChallenge && user) {
      try {
        const scoreData = {
          challengeId: selectedChallenge.id,
          challengeName: selectedChallenge.name,
          userId: user.uid,
          userName: user.displayName || user.email,
          userEmail: user.email,
          userPhotoURL: user.photoURL || null,
          score: foundWords.length,
          foundWordsCount: foundWords.length,
          totalWords: allValidWords.length,
          timeElapsed: timeElapsed,
        };

        await api.submitScore(scoreData);
        console.log('Score saved to leaderboard:', scoreData);
        setMessage(`Score saved! Found ${foundWords.length} words.`);
      } catch (error) {
        console.error('Error saving score to leaderboard:', error);
        // Don't show error to user as it's automatic
      }
    } else if (selectedChallenge && !user) {
      console.log('Score not saved: User not signed in');
    }
  };

  // Handle grid size change
  const handleGridSizeChange = (size) => {
    setGridSize(size);
  };

  // Handle puzzle selection
  const handlePuzzleSelect = (puzzleKey) => {
    setSelectedPuzzle(puzzleKey);
    setSelectedChallenge(null); // Clear challenge when selecting puzzle
    if (puzzleKey !== null && puzzles[puzzleKey]) {
      setGridSize(puzzles[puzzleKey].size);
    }
  };

  // Handle challenge loading from Django API
  const handleLoadChallenge = () => {
    setShowChallengeLoader(true);
  };

  const handleChallengeSelect = (challenge) => {
    setSelectedChallenge(challenge);
    setSelectedPuzzle(null); // Clear puzzle selection when selecting challenge
    setGridSize(challenge.size);
    // Auto-start the game with the selected challenge
    setTimeout(() => {
      handleStartGame();
    }, 100);
  };

  // Handle guess submission
  const handleGuessSubmit = () => {
    const guess = currentGuess.trim().toUpperCase();
    
    if (!guess) return;

    // Check minimum word length (Boggle rules: at least 3 letters)
    if (guess.length < 3) {
      setMessage(`Words must be at least 3 letters long`);
      setTimeout(() => setMessage(''), 2000);
      setCurrentGuess('');
      return;
    }

    if (foundWords.includes(guess)) {
      setMessage(`Already found "${guess}"!`);
      setTimeout(() => setMessage(''), 2000);
    } else if (!dictionarySet.has(guess)) {
      // First check if word exists in full dictionary
      setMessage(`"${guess}" is not a valid word in the dictionary`);
      setTimeout(() => setMessage(''), 2000);
    } else if (!allValidWords.includes(guess)) {
      // Word is in dictionary but can't be formed from current grid
      setMessage(`"${guess}" is a valid word but cannot be formed from this grid`);
      setTimeout(() => setMessage(''), 2000);
    } else {
      // Word is valid and can be formed from grid
      setFoundWords([...foundWords, guess]);
      setMessage(`Correct! Words found: ${foundWords.length + 1}`);
      setTimeout(() => setMessage(''), 2000);
    }
    
    setCurrentGuess('');
  };

  // Calculate missed words
  const missedWords = allValidWords.filter(word => !foundWords.includes(word));

  if (loading) {
    return (
      <div className="App">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Boggle Solver</h1>
        <Auth user={user} onAuthChange={setUser} />
      </div>

      <ToggleGameState
        gameStarted={gameStarted}
        onStartStop={handleStartStop}
        gridSize={gridSize}
        onGridSizeChange={handleGridSizeChange}
        puzzles={puzzles}
        selectedPuzzle={selectedPuzzle}
        onPuzzleSelect={handlePuzzleSelect}
        onLoadChallenge={handleLoadChallenge}
      />

      <ChallengeLoader
        open={showChallengeLoader}
        onClose={() => setShowChallengeLoader(false)}
        onSelectChallenge={handleChallengeSelect}
      />

      <Board 
        grid={grid} 
        gameStarted={gameStarted}
      />

      <GuessInput
        gameStarted={gameStarted}
        currentGuess={currentGuess}
        onGuessChange={setCurrentGuess}
        onGuessSubmit={handleGuessSubmit}
        message={message}
        foundWordsCount={foundWords.length}
      />

      <FoundSolutions
        gameEnded={false}
        foundWords={foundWords}
        showMissed={false}
      />

      <SummaryResults
        gameEnded={gameEnded}
        foundWordsCount={foundWords.length}
        totalTime={totalTime}
      />

      <FoundSolutions
        gameEnded={gameEnded}
        missedWords={missedWords}
        showMissed={true}
      />
    </div>
  );
}

export default App;