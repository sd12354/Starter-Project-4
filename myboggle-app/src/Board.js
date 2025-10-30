import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import React from 'react';
import './Board.css';

function Board({ grid, gameStarted }) {
  if (!gameStarted || !grid || grid.length === 0) {
    return null;
  }

  const gridSize = grid.length;

  return (
    <div className="Board-div">
      <Grid container justify="center">
        {grid.map((row, rowIndex) => (
          <Grid item xs={12} key={rowIndex}>
            <Grid container spacing={1} justify="space-around">
              {row.map((letter, colIndex) => (
                <Grid 
                  item 
                  xs={Math.floor(12 / gridSize)} 
                  className="Tile" 
                  key={`${rowIndex}-${colIndex}`}
                >
                  <Paper elevation={4}>
                    {letter.toUpperCase()}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Board;