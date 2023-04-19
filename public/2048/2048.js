// 2048 게임 보드판을 생성합니다.
const board = new Array();
const boardSize = 4;
let score = 0;
let touchStartX = null;
let touchStartY = null;

// 상수 정의
const TILE_INFO = {
    2: { val: Math.pow(2, 1), emoji: "🪵" },
    4: { val: Math.pow(2, 2), emoji: "🏠" },
    8: { val: Math.pow(2, 3), emoji: "🏢" },
    16: { val: Math.pow(2, 4), emoji: "🛖" },
    32: { val: Math.pow(2, 5), emoji: "🏣" },
    64: { val: Math.pow(2, 6), emoji: "🏬" },
    128: { val: Math.pow(2, 7), emoji: "🏭" },
    256: { val: Math.pow(2, 8), emoji: "🏯" },
    512: { val: Math.pow(2, 9), emoji: "🏰" },
    1024: { val: Math.pow(2, 10), emoji: "🌇" },
    2048: { val: Math.pow(2, 11), emoji: "🚀" },
    4096: { val: Math.pow(2, 12), emoji: "🏙️" }
};

// HTML에서 생성한 타일 요소에 대한 참조를 가져옵니다.
const tiles = new Array();
for (let i = 0; i < boardSize; i++) {
    tiles[i] = new Array();
    for (let j = 0; j < boardSize; j++) {
        tiles[i][j] = document.getElementById("tile-" + i + "-" + j);
    }
}

// 보드판을 초기화하는 함수입니다.
function createBoard() {
    for (let i = 0; i < boardSize; i++) {
        board[i] = new Array();
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = 0;
        }
    }
}

function tileName(number) {
    if (number > 0) {
        return Object.values(TILE_INFO).find(info => info.val === number).emoji;
    } return "";
}

// 보드판을 출력하는 함수입니다.
function printBoard() {
    const tileMargin = 10;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const value = Math.abs(board[i][j]);
            tiles[i][j].innerText = tileName(value);
            tiles[i][j].className = "tile";
            if (value != 0) {
                tiles[i][j].classList.add("tile-" + value);
                if (board[i][j] < 0) {
                    tiles[i][j].classList.add('appear');
                    board[i][j] *= -1;
                }
            }

            const previousValue = tiles[i][j].dataset.value;
            if (previousValue < value && previousValue != 0) {
                tiles[i][j].classList.add('merged');
            }
            tiles[i][j].dataset.value = value;

            // 타일의 위치를 업데이트합니다.
            const row = tiles[i][j].dataset.row;
            const col = tiles[i][j].dataset.col;
            const top = row * (tiles[i][j].offsetHeight + tileMargin);
            const left = col * (tiles[i][j].offsetWidth + tileMargin);
            tiles[i][j].style.top = `${top}px`;
            tiles[i][j].style.left = `${left}px`;
        }
    }
}

// 새로운 블록을 생성하는 함수입니다.
function createBlock() {
    const i = Math.floor(Math.random() * boardSize);
    const j = Math.floor(Math.random() * boardSize);
    // var num = Math.random() < 0.5 ? 2 : 4;
    const num = 2;
    if (board[i][j] == 0) {
        board[i][j] = -num;
    } else {
        createBlock();
    }
}

function move(direction) {
    let moved = false;
    switch (direction) {
        case "left":
            moved = moveLeft();
            break;
        case "right":
            moved = moveRight();
            break;
        case "up":
            moved = moveUp();
            break;
        case "down":
            moved = moveDown();
            break;
    }

    const gameOver = isGameOver();
    // 블록을 생성하고 보드판을 출력합니다.
    if (moved && !gameOver) {
        createBlock();
        printBoard();
        updateScore();
    }

    if (gameOver) {
        console.log(`게임 오버! 스코어: ${score}`);
        alert('게임오버! 스코어: ' + score);
    }

    function moveDown() {
        let moved = false;
        for (let j = 0; j < boardSize; j++) {
            let lastMergedIndex = boardSize;
            for (let i = boardSize - 2; i >= 0; i--) {
                if (board[i][j] != 0) {
                    let k = i + 1;
                    while (k < lastMergedIndex && board[k][j] == 0) {
                        k++;
                    }
                    if (k < lastMergedIndex && board[k][j] == board[i][j]) {
                        board[k][j] *= 2;
                        score += board[k][j];
                        board[i][j] = 0;
                        moved = true;
                        lastMergedIndex = k;
                    } else {
                        board[k - 1][j] = board[i][j];
                        if (i != k - 1) {
                            board[i][j] = 0;
                            moved = true;
                        }
                    }
                }
            }
        }

        return moved;
    }

    function moveUp() {
        let moved = false;
        for (let j = 0; j < boardSize; j++) {
            let lastMergedIndex = -1;
            for (let i = 1; i < boardSize; i++) {
                if (board[i][j] != 0) {
                    let k = i - 1;
                    while (k > lastMergedIndex && board[k][j] == 0) {
                        k--;
                    }
                    if (k > lastMergedIndex && board[k][j] == board[i][j]) {
                        board[k][j] *= 2;
                        score += board[k][j];
                        board[i][j] = 0;
                        moved = true;
                        lastMergedIndex = k;
                    } else {
                        board[k + 1][j] = board[i][j];
                        if (i != k + 1) {
                            board[i][j] = 0;
                            moved = true;
                        }
                    }
                }
            }
        }
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let i = 0; i < boardSize; i++) {
            let lastMergedIndex = boardSize;
            for (let j = boardSize - 2; j >= 0; j--) {
                if (board[i][j] != 0) {
                    let k = j + 1;
                    while (k < lastMergedIndex && board[i][k] == 0) {
                        k++;
                    }
                    if (k < lastMergedIndex && board[i][k] == board[i][j]) {
                        board[i][k] *= 2;
                        score += board[i][k];
                        board[i][j] = 0;
                        moved = true;
                        lastMergedIndex = k;
                    } else {
                        board[i][k - 1] = board[i][j];
                        if (j != k - 1) {
                            board[i][j] = 0;
                            moved = true;
                        }
                    }
                }
            }
        }
        return moved;
    }

    function moveLeft() {
        let moved = false;
        for (let i = 0; i < boardSize; i++) {
            let lastMergedIndex = -1;
            for (let j = 1; j < boardSize; j++) {
                if (board[i][j] != 0) {
                    let k = j - 1;
                    while (k > lastMergedIndex && board[i][k] == 0) {
                        k--;
                    }
                    if (k > lastMergedIndex && board[i][k] == board[i][j]) {
                        board[i][k] *= 2;
                        score += board[i][k];
                        board[i][j] = 0;
                        moved = true;
                        lastMergedIndex = k;
                    } else {
                        board[i][k + 1] = board[i][j];
                        if (j != k + 1) {
                            board[i][j] = 0;
                            moved = true;
                        }
                    }
                }
            }
        }
        return moved;
    }
}

// 스코어를 업데이트하는 함수입니다.
function updateScore() {
    document.getElementById("score").innerText = score;
}

// 게임 오버를 판별하는 함수입니다.
function isGameOver() {
    let gameOver = true;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] == 0) {
                gameOver = false;
                break;
            }
            if (i < boardSize - 1 && board[i][j] == board[i + 1][j]) {
                gameOver = false;
                break;
            }
            if (j < boardSize - 1 && board[i][j] == board[i][j + 1]) {
                gameOver = false;
                break;
            }
        }
        if (!gameOver) { break; }
    }
    return gameOver;
}

// 게임을 초기화하는 함수입니다.
function restartGame() {
    score = 0;
    createBoard();
    createBlock();
    createBlock();
    printBoard();
    updateScore();
}

// 게임을 시작합니다.
restartGame();

// 키보드 이벤트를 처리합니다.
document.addEventListener("keydown", function (event) {
    event.preventDefault();
    switch (event.key) {
        case "ArrowLeft":
            move("left");
            break;
        case "ArrowUp":
            move("up");
            break;
        case "ArrowRight":
            move("right");
            break;
        case "ArrowDown":
            move("down");
            break;
        default:
            break;
    }
});

function handleTouchStart(event) {
    event.preventDefault();
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            move("right");
        } else {
            move("left");
        }
    } else {
        if (deltaY > 0) {
            move("down");
        } else {
            move("up");
        }
    }
}

document.addEventListener("touchstart", handleTouchStart, { passive: false });
document.addEventListener("touchend", handleTouchEnd);

const emojiContainer = document.querySelector(".emoji-container");

Object.values(TILE_INFO).forEach((emoji) => {
    console.log(emoji.val);
    const emojiInfo = document.createElement("div");
    emojiInfo.classList.add("emoji-info");

    const emojiElem = document.createElement("div");
    emojiElem.classList.add("emoji");
    emojiElem.textContent = emoji.emoji;

    const infoElem = document.createElement("div");
    infoElem.classList.add("info");
    infoElem.textContent = emoji.val;

    emojiInfo.appendChild(emojiElem);
    emojiInfo.appendChild(infoElem);
    emojiContainer.appendChild(emojiInfo);
});