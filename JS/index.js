import { GameBoard } from './board.js';
document.addEventListener('DOMContentLoaded', () => {
  let score = 0;
  let timeLeft = 170;
  let timerInterval;

  const scoreDisplay = document.getElementById('score');
  const timerDisplay = document.getElementById('timer');
  const gameOverModal = document.getElementById('game-over-modal');
  const gameOverMessage = document.getElementById('game-over-message');
  const restartButton = document.getElementById('restart-button');

  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time left: 2:50`;

  function startGame() {
    clearInterval(timerInterval);
    
    const gameBoard = document.getElementById('game-match');
    const numColumns = 6;
    const numRows = 5;
    const board = new GameBoard(gameBoard, numColumns, numRows, updateScore);

    gameBoard.addEventListener('click', (event) => {
      const clickedTile = event.target;
      if (clickedTile.classList.contains('game-item')) {
        board.handleTileClick(clickedTile);
      }
    });

    board.render();
    startTimer();
  }

  function updateScore(points) {
    score += points;
    scoreDisplay.textContent = `Score: ${score}`;
    if (score >= 5) {
      gameOver("You won!");
    }
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      if (timeLeft < 0) {
        clearInterval(timerInterval);
        gameOver("Time's up! You lost.");
      } else {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = `Time left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timeLeft--;
      }
    }, 1000);
  }

  function gameOver(message) {
    clearInterval(timerInterval);
    gameOverMessage.textContent = message;
    gameOverModal.classList.remove('hidden');
    gameOverModal.style.display=''
  }

  restartButton.addEventListener('click', () => {
    gameOverModal.style.display= 'none'
    gameOverModal.classList.add('hidden');
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    timeLeft = 170;
    startGame();
  });

  // Iniciar el juego una vez que todo esté listo
  startGame();
});

