import React from 'react';
import './FoundSolutions.css';

function FoundSolutions({ gameEnded, missedWords, foundWords, showMissed }) {
  // During game - show found words
  if (!gameEnded && foundWords && foundWords.length > 0) {
    return (
      <div className="Found-solutions-list">
        <h4>Found Words: {foundWords.length}</h4>
        <ul>
          {foundWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>
    );
  }

  // After game ended - show missed words
  if (gameEnded && showMissed && missedWords && missedWords.length > 0) {
    return (
      <div className="Found-solutions-list">
        <h4>Missed Words: {missedWords.length}</h4>
        <ul>
          {missedWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}

export default FoundSolutions;