// ====================================================================
// 1. TIC-TAC-TOE GAME LOGIC
// ====================================================================

const tttBoard = document.getElementById('tictactoe-board');
const tttStatus = document.getElementById('tictactoe-status');
const tttResetBtn = document.getElementById('tictactoe-reset-btn');

let tttGameActive = true;
let tttCurrentPlayer = 'X';
let tttGameState = Array(9).fill(''); // Stores the X or O for each tile

const tttWinningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Function to initialize the board tiles
function tttInitializeBoard() {
    tttBoard.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-index', i);
        tile.addEventListener('click', tttHandleTileClick);
        tttBoard.appendChild(tile);
    }
}

// Check for a win or draw
function tttCheckResult() {
    let roundWon = false;
    for (let i = 0; i < tttWinningConditions.length; i++) {
        const winCondition = tttWinningConditions[i];
        let a = tttGameState[winCondition[0]];
        let b = tttGameState[winCondition[1]];
        let c = tttGameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        tttStatus.innerHTML = `Player ${tttCurrentPlayer} Wins! 🎉`;
        tttGameActive = false;
        return;
    }

    let roundDraw = !tttGameState.includes("");
    if (roundDraw) {
        tttStatus.innerHTML = `It's a Draw! 🤝`;
        tttGameActive = false;
        return;
    }

    tttHandlePlayerChange();
}

function tttHandleTileClick(event) {
    const clickedTile = event.target;
    const clickedTileIndex = parseInt(clickedTile.getAttribute('data-index'));

    if (tttGameState[clickedTileIndex] !== '' || !tttGameActive) {
        return;
    }

    tttGameState[clickedTileIndex] = tttCurrentPlayer;
    clickedTile.innerHTML = tttCurrentPlayer;
    clickedTile.classList.add(tttCurrentPlayer.toLowerCase());

    tttCheckResult();
}

function tttHandlePlayerChange() {
    tttCurrentPlayer = tttCurrentPlayer === 'X' ? 'O' : 'X';
    tttStatus.innerHTML = `Player ${tttCurrentPlayer}'s Turn`;
}

function tttRestartGame() {
    tttGameActive = true;
    tttCurrentPlayer = 'X';
    tttGameState = Array(9).fill('');
    tttStatus.innerHTML = `Player ${tttCurrentPlayer}'s Turn`;
    document.querySelectorAll('#tictactoe-board .tile').forEach(tile => {
        tile.innerHTML = '';
        tile.classList.remove('x', 'o');
    });
}

tttResetBtn.addEventListener('click', tttRestartGame);
tttInitializeBoard();


// ====================================================================
// 2. SLIDING PUZZLE LOGIC (Integrated from your code)
// ====================================================================

const puzzleBoard = document.getElementById('puzzle-board');
const puzzleMessage = document.getElementById('puzzle-message');
const puzzleShuffleBtn = document.getElementById('puzzle-shuffle-btn');
let puzzleTiles = [];

function puzzleCreateTiles() {
    puzzleTiles = [...Array(8).keys()].map(i => i + 1); // [1,2,...8]
    puzzleTiles.push(""); // blank tile
    puzzleShuffleTiles();
    puzzleRenderTiles();
}

function puzzleIsSolved() {
    const target = [...Array(8).keys()].map(i => i + 1).concat([""]);
    return puzzleTiles.every((val, i) => val === target[i]);
}

function puzzleShuffleTiles() {
    do {
        for (let i = puzzleTiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [puzzleTiles[i], puzzleTiles[j]] = [puzzleTiles[j], puzzleTiles[i]];
        }
    } while (puzzleIsSolved()); // avoid starting solved
}

function puzzleRenderTiles() {
    puzzleBoard.innerHTML = "";
    puzzleTiles.forEach((val, idx) => {
        const tile = document.createElement("div");
        // Use puzzle-tile class to match the main stylesheet
        tile.className = "puzzle-tile" + (val === "" ? " blank" : ""); 
        tile.textContent = val;
        tile.addEventListener("click", () => puzzleHandleClick(idx));
        puzzleBoard.appendChild(tile);
    });
}

function puzzleHandleClick(index) {
    const blankIndex = puzzleTiles.indexOf("");
    const row = Math.floor(index / 3);
    const col = index % 3;
    const blankRow = Math.floor(blankIndex / 3);
    const blankCol = blankIndex % 3;

    // Check if the tile is adjacent (manhattan distance of 1)
    const isAdjacent = (Math.abs(row - blankRow) + Math.abs(col - blankCol)) === 1;

    if (isAdjacent) {
        // Swap tiles
        [puzzleTiles[index], puzzleTiles[blankIndex]] = [puzzleTiles[blankIndex], puzzleTiles[index]];
        puzzleRenderTiles();
        puzzleCheckWin();
    }
}

function puzzleCheckWin() {
    if (puzzleIsSolved()) {
        puzzleMessage.textContent = "🎉 You solved it!";
    } else {
        puzzleMessage.textContent = "";
    }
}

function puzzleResetPuzzle() {
    puzzleMessage.textContent = "";
    puzzleShuffleTiles();
    puzzleRenderTiles();
}

puzzleShuffleBtn.addEventListener('click', puzzleResetPuzzle);
puzzleCreateTiles(); // Initial setup


// ====================================================================
// 3. ROCK, PAPER, SCISSORS GAME LOGIC
// ====================================================================

const rpsChoices = document.querySelectorAll('#rps-game .choices button');
const rpsResultDisplay = document.getElementById('result');
const rpsPlayerScoreDisplay = document.getElementById('player-score');
const rpsComputerScoreDisplay = document.getElementById('computer-score');

let rpsPlayerScore = 0;
let rpsComputerScore = 0;

function rpsGetComputerChoice() {
    const rps = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * rps.length);
    return rps[randomIndex];
}

function rpsDetermineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return "It's a tie!";
    }
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        rpsPlayerScore++;
        return 'You Win!';
    } else {
        rpsComputerScore++;
        return 'Computer Wins!';
    }
}

rpsChoices.forEach(button => {
    button.addEventListener('click', () => {
        const playerChoice = button.getAttribute('data-choice');
        const computerChoice = rpsGetComputerChoice();
        
        const winnerMessage = rpsDetermineWinner(playerChoice, computerChoice);
        
        rpsResultDisplay.textContent = `You chose ${playerChoice}. Computer chose ${computerChoice}. ${winnerMessage}`;
        rpsPlayerScoreDisplay.textContent = rpsPlayerScore;
        rpsComputerScoreDisplay.textContent = rpsComputerScore;
    });
});
