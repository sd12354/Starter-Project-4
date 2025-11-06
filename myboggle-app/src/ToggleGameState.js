import React from 'react';
import Button from "@mui/material/Button";
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import './ToggleGameState.css';

function ToggleGameState({ 
  gameStarted, 
  onStartStop, 
  gridSize, 
  onGridSizeChange, 
  puzzles, 
  selectedPuzzle, 
  onPuzzleSelect,
  onLoadChallenge
}) {
  const buttonText = gameStarted ? "END GAME" : "START";

  const handleChange = (event) => {
    onGridSizeChange(event.target.value);
  };

  const handlePuzzleChange = (event) => {
    const value = event.target.value;
    onPuzzleSelect(value === 'random' ? null : value);
  };

  return (
    <div className="Toggle-game-state">
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={onStartStop}
        >
          {buttonText}
        </Button>
        
        {!gameStarted && (
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={onLoadChallenge}
          >
            Load Challenge
          </Button>
        )}
      </div>

      {!gameStarted && (
        <div className="Input-select-size">
          <FormControl>
            <Select
              labelId="sizelabel"
              id="sizemenu"
              value={gridSize}
              onChange={handleChange}
            >
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
            </Select>
            <FormHelperText>Set Grid Size</FormHelperText>
          </FormControl>

          <FormControl>
            <Select
              labelId="puzzlelabel"
              id="puzzlemenu"
              value={selectedPuzzle || 'random'}
              onChange={handlePuzzleChange}
            >
              <MenuItem value="random">Random</MenuItem>
              {Object.keys(puzzles).map((key) => (
                <MenuItem key={key} value={key}>
                  Puzzle {key}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select Puzzle</FormHelperText>
          </FormControl>
        </div>
      )}
    </div>
  );
}

export default ToggleGameState;