// Player Variables
const start = Math.round(gridSize / 2);
let locationX = start;
let locationY = start;
let tickSpeed = 150;
let gameState = 0;
let tickSpeedSet;
// Wall Variables
let WallMoveTickSpeedSet;
let generateWallTickSpeedSet;
const wallTickSpeed = 300;
const generateWallTickSpeed = 2000;
let gapBoundaries = Math.round(gridSize / 3);
let gapSize;
let gapStart;
// Win Lose Variables
let winLoseCheckTickSpeedSet;
let scoreUpdateTickSpeedSet;
const losingMessage = document.getElementById('message');
const losingMessage2 = document.getElementById('message2');
const scoreMessage = document.getElementById('score-block');
let score = 0;

// Set grid as secondary 2d array for walls and collision detection
const walls = [];
for (let row = 0; row < gridSize; row++) {
  const rowOfBooleansWalls = [];
  for (let col = 0; col < gridSize; col++) {
    rowOfBooleansWalls.push(false);
  }
  walls.push(rowOfBooleansWalls);
}

// Set gravity
function gravity() {
  if (locationY === gridSize - 1) {
    onFloor = true;
  } else {
    boxSwap(locationY, locationX);
    boxSwap(locationY + 1, locationX);
    locationY += 1;
  }
}

// Function to set false value to true depending on what row and column has been worked with.
function boxSwap(row, column) {
  grid[row][column] = !grid[row][column];
  const boxToChange = document.getElementById(`boxR${row + 1}C${column + 1}`);
  boxToChange.style.backgroundColor = grid[row][column]
    ? 'lightgreen'
    : 'rgb(6, 6, 6)';
  boxToChange.style.borderRadius = grid[row][column] ? '50%' : '0%';
}

// Stating position in middle of the grid
boxSwap(start, start);

// Movement function
function keypressValidationMovement() {
  inputKey = event.key;
  switch (inputKey) {
    case 'w':
      if (locationY === 0) {
        break;
      } else {
        boxSwap(locationY, locationX);
        boxSwap(locationY - 1, locationX);
        locationY -= 1;
        break;
      }
    case 's':
      if (locationY === gridSize - 1) {
        break;
      } else {
        boxSwap(locationY, locationX);
        boxSwap(locationY + 1, locationX);
        locationY += 1;
        break;
      }
    case 'a':
      if (locationX === 0) {
        break;
      } else {
        boxSwap(locationY, locationX);
        boxSwap(locationY, locationX - 1);
        locationX -= 1;
        break;
      }
    case 'd':
      if (locationX === gridSize - 1) {
        break;
      } else {
        boxSwap(locationY, locationX);
        boxSwap(locationY, locationX + 1);
        locationX += 1;
        break;
      }
    case ' ': // Jump and start game
      if (gameState === 0) {
        tickSpeedSet = setInterval(gravity, tickSpeed);
        WallMoveTickSpeedSet = setInterval(moveWalls, wallTickSpeed, walls);
        scoreUpdateTickSpeedSet = setInterval(scoreUpdate, wallTickSpeed);
        winLoseCheckTickSpeedSet = setInterval(winLoseCheck, tickSpeed);
        generateWallTickSpeedSet = setInterval(
          createWall,
          generateWallTickSpeed
        );
        gameState = 1;
        break;
      }
      if (locationY === 0) {
        break;
      } else {
        boxSwap(locationY, locationX);
        if (locationY < 5) {
          boxSwap(0, locationX);
          locationY = 0;
          break;
        } else {
          boxSwap(locationY - 5, locationX);
          locationY -= 5;
          break;
        }
      }
    case 'Escape': // Pause game
      if (gameState === 1) {
        clearInterval(tickSpeedSet);
        clearInterval(WallMoveTickSpeedSet);
        clearInterval(winLoseCheckTickSpeedSet);
        clearInterval(generateWallTickSpeedSet);
        clearInterval(scoreUpdateTickSpeedSet);
        gameState = 0;
        break;
      }
    case 'Enter': // Restart Game
      if (gameState === 3) {
        losingMessage.innerHTML = '';
        losingMessage2.innerHTML = '';

        for (let r = 0; r < gridSize; r++) {
          for (let c = 0; c < gridSize; c++) {
            if (walls[r][c] === true) {
              wallSwap(r, c);
            }
            if (grid[r][c] === true) {
              boxSwap(r, c);
            }
          }
        }
        locationX = start;
        locationY = start;
        boxSwap(locationY, locationX);
        score = 0;
        scoreMessage.innerHTML = `Score: ${score}`;
        gameState = 0;
        break;
      }
    case 't':
      scoreUpdate();
      break;
  }
}

// Swap wall blocks for movement
function wallSwap(row, column) {
  walls[row][column] = !walls[row][column];
  const boxToChange = document.getElementById(`boxR${row + 1}C${column + 1}`);
  boxToChange.style.backgroundColor = walls[row][column]
    ? 'white'
    : 'rgb(6, 6, 6)';
}

// Create wall with gap using random generated numbers
function createWall() {
  gapSize = Math.round(Math.random() * (15 - 7) + 7);
  gapStart =
    Math.round(
      Math.random() * (gridSize - gapBoundaries - gapBoundaries) + gapBoundaries
    ) - 5;
  for (let i = 0; i < gridSize; i++) {
    wallSwap(i, gridSize - 1);
  }
  for (let x = gapStart - 1; x < gapStart + gapSize - 1; x++) {
    wallSwap(x, gridSize - 1);
  }
}

// Function to move walls
function moveWalls(walls) {
  const tempWallArr = JSON.parse(JSON.stringify(walls));
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (walls[r][0] === true) {
        wallSwap(r, 0);
      } else if (tempWallArr[r][c] === true) {
        wallSwap(r, c - 1);
        wallSwap(r, c);
      }
    }
  }
}

// Checking win/lose criteria

function winLoseCheck() {
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (walls[r][c] === true && grid[r][c] === true) {
        losingMessage.innerHTML = 'You Lose';
        losingMessage2.innerHTML = 'Press enter to try again...';
        clearInterval(tickSpeedSet);
        clearInterval(WallMoveTickSpeedSet);
        clearInterval(winLoseCheckTickSpeedSet);
        clearInterval(generateWallTickSpeedSet);
        clearInterval(scoreUpdateTickSpeedSet);
        gameState = 3;
      }
    }
  }
}

// Update score after passing through gate
function scoreUpdate() {
  const wallColumns = [];
  for (let c = 0; c < gridSize; c++) {
    if (walls[0][c] === true) {
      wallColumns.push(c);
    }
  }
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === true) {
        for (let i = 0; i < wallColumns.length; i++) {
          if (c - 1 === wallColumns[i]) {
            score++;
          }
        }
      }
    }
  }
  scoreMessage.innerHTML = `Score: ${score}`;
}
