let gridSize = 50;

// Create grid on html
// Outerloop for rows
for (let row = 0; row < gridSize; row++) {
  const gridRow = document.createElement('div');
  gridRow.id = `grid-row${row + 1}`;
  gridRow.style.marginBottom = '-7px';
  const gridMain = document.getElementById('gameContainer');
  gridMain.appendChild(gridRow);
  // Inner loop to set columns
  for (col = 0; col < gridSize; col++) {
    const gridBox = document.createElement('div');
    gridBox.className = 'grid-box';
    gridBox.id = `boxR${row + 1}C${col + 1}`;
    gridBox.style.display = 'inline-block';
    const boxRow = document.getElementById(`grid-row${row + 1}`);
    boxRow.appendChild(gridBox);
  }
}

// Set grid to false
const grid = [];
for (let row = 0; row < gridSize; row++) {
  const rowOfBooleans = [];
  for (let col = 0; col < gridSize; col++) {
    rowOfBooleans.push(false);
  }
  grid.push(rowOfBooleans);
}
