import React, { useState, useEffect } from 'react';
import Board from './Board.js';
import GuessInput from './GuessInput.js';
import FoundSolutions from './FoundSolutions.js';
import SummaryResults from './SummaryResults.js';
import ToggleGameState from './ToggleGameState.js';
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

  // Load dictionary and puzzles on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load dictionary
        const dictResponse = await fetch('/full-wordlist.json');
        const dictData = await dictResponse.json();
        setDictionary(dictData.words || []);

        // Load puzzles
        const puzzlesResponse = await fetch('/Boggle_Solutions_Endpoint.json');
        const puzzlesData = await puzzlesResponse.json();
        setPuzzles(puzzlesData || {});

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

  const handleStartGame = () => {
    setLoading(true);
    let newGrid;
    let solutions;

    try {
      if (selectedPuzzle !== null && puzzles[selectedPuzzle]) {
        // Use pre-made puzzle
        const puzzle = puzzles[selectedPuzzle];
        newGrid = puzzle.grid;
        solutions = puzzle.solutions.map(w => w.toUpperCase());
      } else {
        // Generate random puzzle
        newGrid = generateRandomGrid(gridSize);
        const solver = new BoggleSolver(newGrid, dictionary);
        solutions = solver.getSolution();
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

  const handleEndGame = () => {
    const endTime = Date.now();
    const timeElapsed = (endTime - startTime) / 1000;
    setTotalTime(timeElapsed);
    setGameEnded(true);
    setGameStarted(false);
  };

  // Handle grid size change
  const handleGridSizeChange = (size) => {
    setGridSize(size);
  };

  // Handle puzzle selection
  const handlePuzzleSelect = (puzzleKey) => {
    setSelectedPuzzle(puzzleKey);
    if (puzzleKey !== null && puzzles[puzzleKey]) {
      setGridSize(puzzles[puzzleKey].size);
    }
  };

  // Handle guess submission
  const handleGuessSubmit = () => {
    const guess = currentGuess.trim().toUpperCase();
    
    if (!guess) return;

    if (foundWords.includes(guess)) {
      setMessage(`Already found "${guess}"!`);
      setTimeout(() => setMessage(''), 2000);
    } else if (allValidWords.includes(guess)) {
      setFoundWords([...foundWords, guess]);
      setMessage(`Correct! Words found: ${foundWords.length + 1}`);
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage(`"${guess}" is not a valid word`);
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
      <h1>Boggle Solver</h1>

      <ToggleGameState
        gameStarted={gameStarted}
        onStartStop={handleStartStop}
        gridSize={gridSize}
        onGridSizeChange={handleGridSizeChange}
        puzzles={puzzles}
        selectedPuzzle={selectedPuzzle}
        onPuzzleSelect={handlePuzzleSelect}
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