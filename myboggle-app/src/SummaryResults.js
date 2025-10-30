import React from 'react';
import './SummaryResults.css';

function SummaryResults({ gameEnded, foundWordsCount, totalTime }) {
  if (!gameEnded) {
    return null;
  }

  return (
    <div className="Summary">
      <h2>SUMMARY</h2>     
      <div>
        <li>Total Words Found: {foundWordsCount}</li>
      </div>
      
      <div>
        <li>Total Time: {totalTime.toFixed(2)} secs</li>
      </div>
    </div>
  );
}

export default SummaryResults;