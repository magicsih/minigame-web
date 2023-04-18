const mazeContainer = document.getElementById("maze-container");

const ROWS = 15;
const COLS = 15;

let maze = [];

function generateMaze() {
    // 미로를 전부 벽으로 채웁니다.
    for (let i = 0; i < ROWS; i++) {
        let row = [];
        for (let j = 0; j < COLS; j++) {
            row.push(0);
        }
        maze.push(row);
    }

    // DFS 알고리즘을 사용하여 미로를 생성합니다.
    let startRow = Math.floor(Math.random() * ROWS);
    let startCol = Math.floor(Math.random() * COLS);

    dfs(startRow, startCol);

    // 시작점과 도착점을 지정합니다.
    maze[startRow][startCol] = 2;
    let endRow, endCol;
    do {
        endRow = Math.floor(Math.random() * ROWS);
        endCol = Math.floor(Math.random() * COLS);
    } while (maze[endRow][endCol] === 1 || maze[endRow][endCol] === 2);

    maze[endRow][endCol] = 3;
}

function dfs(row, col) {
    // 현재 위치를 방문한 것으로 표시합니다.
    maze[row][col] = 1;

    // 상하좌우 방향 중에서 이동 가능한 곳을 선택합니다.
    let directions = shuffleDirections(["top", "right", "bottom", "left"]);

    for (let i = 0; i < directions.length; i++) {
        let nextRow, nextCol;

        switch (directions[i]) {
            case "top":
                if (row - 2 < 0) continue;
                nextRow = row - 2;
                nextCol = col;
                break;
            case "right":
                if (col + 2 >= COLS) continue;
                nextRow = row;
                nextCol = col + 2;
                break;
            case "bottom":
                if (row + 2 >= ROWS) continue;
                nextRow = row + 2;
                nextCol = col;
                break;
            case "left":
                if (col - 2 < 0) continue;
                nextRow = row;
                nextCol = col - 2;
                break;
        }

        // 이동 가능한 곳으로 이동합니다.
        if (maze[nextRow][nextCol] === 0) {
            maze[(row + nextRow) / 2][(col + nextCol) / 2] = 1;
            dfs(nextRow, nextCol);
        }
    }
}

function shuffleDirections(directions) {
    // Fisher-Yates shuffle 알고리즘을 사용하여
    // 방향을 무작위로 섞습니다.
    for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
    }
    return directions;
}

function drawMaze() {
    let mazeHTML = "";

    for (let i = 0; i < ROWS; i++) {
        mazeHTML += "<div class='maze-row'>";
        for (let j = 0; j < COLS; j++) {
            if (maze[i][j] === 0) {
                mazeHTML += "<div class='maze-wall'></div>";
            } else if (maze[i][j] === 1) {
                mazeHTML += "<div class='maze-path' id='path-" + i + "-" + j + "'></div>";
            } else if (maze[i][j] === 2) {
                mazeHTML += "<div class='maze-start' id='path-" + i + "-" + j + "'></div>";
            } else if (maze[i][j] === 3) {
                mazeHTML += "<div class='maze-end' id='path-" + i + "-" + j + "'></div>";
            }
        }
        mazeHTML += "</div>";
    }

    mazeContainer.innerHTML = mazeHTML;

    // 시작점의 위치를 찾습니다.
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (maze[i][j] === 2) {
                playerRow = i;
                playerCol = j;
                break;
            }
        }
    }

    // 플레이어 요소를 생성하여 추가합니다.
    let playerElement = document.createElement("div");
    playerElement.id = "player";
    document.getElementById("path-" + playerRow + "-" + playerCol).appendChild(playerElement);
}

let playerRow, playerCol;

function movePlayer(event) {
    let keyCode = event.keyCode;

    // 위로 이동
    if (keyCode === 38) {
        if (playerRow - 1 >= 0 && maze[playerRow - 1][playerCol] !== 0) {
            playerRow--;
        }
    }
    // 오른쪽으로 이동
    else if (keyCode === 39) {
        if (playerCol + 1 < COLS && maze[playerRow][playerCol + 1] !== 0) {
            playerCol++;
        }
    }
    // 아래로 이동
    else if (keyCode === 40) {
        if (playerRow + 1 < ROWS && maze[playerRow + 1][playerCol] !== 0) {
            playerRow++;
        }
    }
    // 왼쪽으로 이동
    else if (keyCode === 37) {
        if (playerCol - 1 >= 0 && maze[playerRow][playerCol - 1] !== 0) {
            playerCol--;
        }
    }

    // 플레이어 위치를 변경합니다.
    let playerElement = document.getElementById("player");
    let pathElement = document.getElementById("path-" + playerRow + "-" + playerCol);
    pathElement.appendChild(playerElement);

    // 도착점에 도달한 경우 알림을 표시합니다.
    if (maze[playerRow][playerCol] === 3) {
        alert("도착!");
        location.reload();
    }
}

generateMaze();

drawMaze();

document.addEventListener("keydown", movePlayer);