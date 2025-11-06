import React from 'react';
import TextField from "@mui/material/TextField";
import './GuessInput.css';

function GuessInput({ 
  gameStarted, 
  currentGuess, 
  onGuessChange, 
  onGuessSubmit, 
  message,
  foundWordsCount 
}) {
  if (!gameStarted) {
    return null;
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onGuessSubmit();
    }
  };

  const labelText = message || `Words found: ${foundWordsCount}`;

  return (
    <div className="Guess-input">
      <div className="label-text">
        {labelText}
      </div>
      <TextField 
        value={currentGuess}
        onChange={(e) => onGuessChange(e.target.value.toUpperCase())}
        onKeyPress={handleKeyPress}
        placeholder="Enter your guess"
        variant="outlined"
        fullWidth
        autoFocus
      />
    </div>
  );
}

export default GuessInput;