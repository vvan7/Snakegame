const Game = () => {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "style.css";
    document.getElementsByTagName("head")[0].appendChild(link);

    const gameboard = document.createElement("div");
    gameboard.className = "gameboard";
    gameboard.id = "snakegame";
    gameboard.tabIndex = "0";
    document.getElementsByTagName("body")[0].appendChild(gameboard);

    const grid = document.createElement("div");
    grid.className = "grid-container";
    gameboard.appendChild(grid);

    const scoreboard = document.createElement("div");
    scoreboard.className = "scoreboard";
    gameboard.appendChild(scoreboard);

    const tileColor = "rgb(100, 100, 100)";
    const appleColor = "rgb(200, 180, 80)";
    const snakeColor = "rgb(100, 169, 100)";

    let scores = [];
    let highscores = [0,0,0,0,0,0,0,0];
    let score = 0;
    let board = [];
    let tileSet = new Set();
    let snake = [];
    let head = {};
    let tail = {};
    let snakeSet = new Set();
    let dy = 0;
    let dx = 1;
    let newDY = 0;
    let newDX = 1;
    let apple = {};
    createTiles();
    createScores();
    gameOver();

    gameboard.addEventListener("keydown", change_direction);

    main();

    function main() {
        setTimeout(function onTick() {
            moveSnake();
            if(isGameOver()) gameOver();
            drawSnakeHeadTailApple();
            main();
        }, 250)
    }

    function change_direction(event) {
        const LEFT_KEY = 37;
        const UP_KEY = 38;
        const RIGHT_KEY = 39;
        const DOWN_KEY = 40;

        const key = event.keyCode;
        if(key === LEFT_KEY && dx <= 0) {
            newDY = 0;
            newDX = -1;
        }
        else if(key === UP_KEY && dy <= 0) {
            newDY = -1;
            newDX = 0;
        }
        else if(key === RIGHT_KEY && dx >= 0) {
            newDY = 0;
            newDX = 1;
        }
        else if(key === DOWN_KEY && dy >= 0) {
            newDY = 1;
            newDX = 0;
        }
    }

    function moveSnake() {
        dx = newDX;
        dy = newDY;
        head = {y: head.y + dy, x: head.x + dx, key: 0};
        head.key = head.y * 10 + head.x;
        snakeSet.add(head.key);
        snake.unshift(head);
        tileSet.delete(head.key);
        
        if(head.key === apple.key) {
            addScore();
            createApple();
            return;
        }

        tail = snake.pop();
        tileSet.add(tail.key);
        snakeSet.delete(tail.key);
    }

    function addScore() {
        score += 10;
        scores[9].innerHTML = "Score: " + score;
    }

    function createApple() {
        let keys = Array.from(tileSet);
        let rng = Math.floor(Math.random() * keys.length);
        apple = {y: Math.floor(keys[rng] / 10), x: keys[rng] % 10, key: keys[rng]};
    }

    function isGameOver() {
        if(snakeSet.size < snake.length) return true;
        return head.y < 0 || head.x < 0 || head.y >= 10 || head.x >= 10;
    }

    function gameOver() {
        clearTiles();
        updateScores();
        createSnake();
        createApple();
    }

    function drawSnakeHeadTailApple() {
        board[head.y][head.x].style.backgroundColor = snakeColor;
        board[tail.y][tail.x].style.backgroundColor = tileColor;
        board[apple.y][apple.x].style.backgroundColor = appleColor;
    }

    function createScores() {
        let text = document.createElement("div");
        text.className = "scores";
        text.style.textDecoration = "underline";
        text.innerHTML = "High Scores";
        scores[0] = text;
        scoreboard.appendChild(text);
        for(let i = 0; i < 8; i++) {
            text = document.createElement("div");
            text.className = "scores";
            text.innerHTML = highscores[i];
            scores[i + 1] = text;
            scoreboard.appendChild(text);
        }
        text = document.createElement("div");
        text.className = "scores";
        text.innerHTML = "Score: " + score;
        scores[9] = text;
        scoreboard.appendChild(text);
    }

    function updateScores() {
        highscores.push(score);
        highscores.sort((a, b) => b - a);
        highscores.pop();
        for(let i = 0; i < 8; i++) scores[i + 1].innerHTML = highscores[i];
        score = 0;
        scores[9].innerHTML = "Score: " + score;
    }

    function createTiles() {
        for(let i = 0; i < 10; i++) {
            board[i] = [];
            for(let j = 0; j < 10; j++) {
                let tile = document.createElement("div");
                tile.className = "grid-item";
                board[i][j] = tile;
                grid.appendChild(tile);
            }
        }
    }

    function clearTiles() {
        tileSet = new Set();
        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 10; j++) {
                board[i][j].style.backgroundColor = tileColor;
                tileSet.add(i * 10 + j);
            }
        }
    }

    function createSnake() {
        snake = [{y: 5, x: 4, key: 54}, {y: 5, x: 3, key: 53}, {y: 5, x: 2, key: 52}];
        head = snake[0];
        tail = {y: 5, x: 1, key: 51};
        snakeSet = new Set();
        for(let i in snake) snakeSet.add(snake[i].key);
        snakeSet.forEach(tile => {tileSet.delete(tile);});
        dy = 0;
        dx = 1;
        newDY = 0;
        newDX = 1;
    }
}
const snakegame = Game();