const board = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart-button");

const boardSize = 400;
const cellSize = 20;

let score = 0; // 점수를 저장하는 변수
let snake = [
  { x: 160, y: 200 },
  { x: 140, y: 200 },
  { x: 120, y: 200 },
];
let direction = { x: cellSize, y: 0 };
let food = { x: 300, y: 200 };
let gameInterval;

function startGame() {
  gameInterval = setInterval(moveSnake, 200);
  placeFood();
}

function placeFood() {
  // 음식의 위치를 무작위로 설정
  food.x = Math.floor(Math.random() * (boardSize / cellSize)) * cellSize;
  food.y = Math.floor(Math.random() * (boardSize / cellSize)) * cellSize;
}

function moveSnake() {
  const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (checkGameOver()) {
    endGame();
  }

  // 보드 경계를 넘어가는지 확인
  if (
    newHead.x < 0 ||
    newHead.x >= boardSize ||
    newHead.y < 0 ||
    newHead.y >= boardSize
  ) {
    // 보드 경계를 넘어갔다면 반대 쪽으로 이동
    if (newHead.x < 0) {
      newHead.x = boardSize - cellSize;
    } else if (newHead.x >= boardSize) {
      newHead.x = 0;
    } else if (newHead.y < 0) {
      newHead.y = boardSize - cellSize;
    } else if (newHead.y >= boardSize) {
      newHead.y = 0;
    }
  }

  snake.unshift(newHead);
  if (snake[0].x === food.x && snake[0].y === food.y) {
    score += 100; // 음식을 먹을 때마다 점수 증가
    updateScore();
    placeFood(); // 푸드를 다시 배치
  } else {
    snake.pop(); // 뱀의 꼬리를 제거
  }
  updateBoard();
}

function endGame() {
  clearInterval(gameInterval);
  alert(`Game Over! Your score is: ${score}`);
  restartButton.style.display = "block"; // 재시작 버튼 표시
}

function checkGameOver() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true; // 뱀이 자신의 몸에 닿았는지 확인
    }
  }
  return false;
}

function updateScore() {
  scoreElement.textContent = score;
}

function updateBoard() {
  board.innerHTML = "";
  snake.forEach((segment, index) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.left = `${segment.x}px`;
    snakeElement.style.top = `${segment.y}px`;
    snakeElement.classList.add("snake");
    if (index === 0) {
      // 첫 번째 세그먼트에는 'snake-head' 클래스 추가
      snakeElement.classList.add("snake-head");
    }
    board.appendChild(snakeElement);
  });

  const foodElement = document.createElement("div");
  foodElement.style.left = `${food.x}px`;
  foodElement.style.top = `${food.y}px`;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

function changeDirection(event) {
  switch (event.keyCode) {
    case 37: // 왼쪽
      direction = { x: -cellSize, y: 0 };
      break;
    case 38: // 위쪽
      direction = { x: 0, y: -cellSize };
      break;
    case 39: // 오른쪽
      direction = { x: cellSize, y: 0 };
      break;
    case 40: // 아래쪽
      direction = { x: 0, y: cellSize };
      break;
  }
}

restartButton.addEventListener("click", function () {
  score = 0;
  updateScore();
  snake = [
    { x: 160, y: 200 },
    { x: 140, y: 200 },
    { x: 120, y: 200 },
  ];
  direction = { x: cellSize, y: 0 };
  startGame();
  restartButton.style.display = "none"; // 재시작 버튼 숨기기
});

document.addEventListener("keydown", changeDirection);
startGame();
