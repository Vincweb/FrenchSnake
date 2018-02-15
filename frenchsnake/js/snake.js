/**
 * JS Game Snake
 * Created By Vincweb 
 * <vincent.caudron@hotmail.fr>
 */

(function frenshsnake() {

    console.log("Welcome to the French Snake !");

    // Keytouch code
    const KEY_DOWN = 40;
    const KEY_UP = 38;
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;
    const KEY_ENTER = 13;

    // Level Game
    var speed = 80;
    var square = 40;
    var score = 0;

    // Create grille
    const Height = (Math.round(window.innerHeight / square) % 2 == 0) ? Math.round(window.innerHeight / square) : Math.round(window.innerHeight / square) - 1;
    const Width = (Math.round(document.querySelector('body').clientWidth / square) % 2 == 0) ? Math.round(document.querySelector('body').clientWidth / square) : Math.round(document.querySelector('body').clientWidth / square) - 1;

    // Initialise Object
    var snake = new Snake();
    var circle = new Circle();

    // Initialise Move
    var move;

    // pseudo gamer
    var pseudo = "vincent";

    // Object Snake
    function Snake() {
        var position = [];
        position.push(new Array((Height / 2), (Width / 2)));

        this.getPosition = function () {
            return position;
        };

        this.moveUP = function () {
            position.unshift([position[0][0] - 1, position[0][1]]);
            position.pop();
        }

        this.moveDOWN = function () {
            position.unshift([position[0][0] + 1, position[0][1]]);
            position.pop();
        }

        this.moveLEFT = function () {
            position.unshift([position[0][0], position[0][1] - 1]);
            position.pop();
        }

        this.moveRIGHT = function () {
            position.unshift([position[0][0], position[0][1] + 1]);
            position.pop();
        }

        this.addSnake = function () {
            position.push([position[position.length - 1][0], position[position.length - 1][1]]);
        }
    }

    // Object Circle
    function Circle() {
        var position = new Array();

        this.getPosition = function () {
            return position;
        }

        this.newCircle = function () {
            position = new Array();
            var freeCase = [Height];
            //debugger;
            position.push(new Array(randNumberHeight(), randNumberWidth()));
        }

        randNumberHeight = function () {
            var i = Math.round(Math.floor((Math.random() * Height)));
            var j = Math.round(Math.floor((Math.random() * Width)));
            snake.getPosition().forEach(element => {
                if (element[0] == i && element[1] == j) randNumberHeight();
            });
            return i;
        }

        randNumberWidth = function () {
            var i = Math.round(Math.floor((Math.random() * Width)));
            var j = Math.round(Math.floor((Math.random() * Width)));
            snake.getPosition().forEach(element => {
                if (element[0] == i && element[1] == j) randNumberWidth();
            });
            return j;
        }

        this.newCircle();
    }

    // Get score 
    function getScore() {
        var ref = firebase.database().ref('score');

        ref.on("value", function (snapshot) {
            console.log(snapshot.val());
        });
    }

    // Save Score
    function saveScore() {
        // Get a reference to the database service
        var database = firebase.database();

        function writeUserData(score) {
            firebase.database().ref('score/'+ Date.now()).set({
                Username: pseudo,
                Score: score
            });
        }

        writeUserData(score);
    }

    // Game Over
    function gameOver() {

        // Stop the move
        clearInterval(move);
        snake = new Snake();
        circle = new Circle();

        document.querySelector('#menu').style.display = "none";
        document.querySelector('#score').style.display = "block";
        document.querySelector('#grille').style.display = "none";

        document.querySelector('#score').innerHTML = '<h1> Score : ' + score + '</h1>';

        // Save the score
        saveScore();

        document.onkeydown = function () {
            switch (window.event.keyCode) {
                case KEY_ENTER:
                    menu();
                    break;
            }
        }
    }

    // Detection collision
    function collision() {
        // Snake eat
        if (snake.getPosition()[0][0] == circle.getPosition()[0][0] && snake.getPosition()[0][1] == circle.getPosition()[0][1]) {
            circle.newCircle();
            snake.addSnake();
            score = score + 10;
        }

        // Snake touch wall
        if (snake.getPosition()[0][0] > Height || snake.getPosition()[0][0] < 0 || snake.getPosition()[0][1] > Width || snake.getPosition()[0][1] < 0) {
            gameOver();
        }

        // Snake bit himself
        if (snake.getPosition().length > 4) {
            var snakeHead = snake.getPosition()[0];
            var snakeOutHead = [...snake.getPosition()];
            snakeOutHead.shift();
            snakeOutHead.forEach(element => {
                if (element[0] == snakeHead[0] && element[1] == snakeHead[1]) {
                    gameOver();
                }
            });
        }
    }

    // Render screen
    function render() {
        document.querySelector('#grille').innerHTML = "";
        snake.getPosition().forEach(element => {
            document.querySelector('#grille').innerHTML = document.querySelector('#grille').innerHTML + '<div class="square" style="height:' + square + 'px;width:' + square + 'px;top:' + element[0] * square + 'px;left:' + element[1] * square + 'px;"></div>';
        });

        circle.getPosition().forEach(element => {
            document.querySelector('#grille').innerHTML = document.querySelector('#grille').innerHTML + '<div class="circle" style="height:' + square + 'px;width:' + square + 'px;top:' + element[0] * square + 'px;left:' + element[1] * square + 'px;"></div>';
        });
    }


    // Run game
    function game() {
        document.querySelector('#menu').style.display = "none";
        document.querySelector('#score').style.display = "none";
        document.querySelector('#grille').style.display = "block";

        // Initialise Score Game
        score = 0;

        // First view
        render();

        // Move Game
        var runKeyPress = true;
        var lastKeyPress;

        document.onkeydown = function () {
            switch (window.event.keyCode) {
                case KEY_DOWN:
                    if (!runKeyPress) break;
                    runKeyPress = false;
                    if (lastKeyPress == KEY_UP) break;
                    lastKeyPress = KEY_DOWN;
                    clearInterval(move);
                    move = setInterval(function () {
                        snake.moveDOWN();
                        collision();
                        render();
                        runKeyPress = true;
                    }, speed);
                    break;
                case KEY_UP:
                    if (!runKeyPress) break;
                    runKeyPress = false;
                    if (lastKeyPress == KEY_DOWN) break;
                    lastKeyPress = KEY_UP;
                    clearInterval(move);
                    move = setInterval(function () {
                        snake.moveUP();
                        collision();
                        render();
                        runKeyPress = true;
                    }, speed);
                    break;
                case KEY_LEFT:
                    if (!runKeyPress) break;
                    runKeyPress = false;
                    if (lastKeyPress == KEY_RIGHT) break;
                    lastKeyPress = KEY_LEFT;
                    clearInterval(move);
                    move = setInterval(function () {
                        snake.moveLEFT();
                        collision();
                        render();
                        runKeyPress = true;
                    }, speed);
                    break;
                case KEY_RIGHT:
                    if (!runKeyPress) break;
                    runKeyPress = false;
                    if (lastKeyPress == KEY_LEFT) break;
                    lastKeyPress = KEY_RIGHT;
                    clearInterval(move);
                    move = setInterval(function () {
                        snake.moveRIGHT();
                        collision();
                        render();
                        runKeyPress = true;
                    }, speed);
                    break;
            }
        }
    }

    // Menu game
    function menu() {
        document.querySelector('#menu').style.display = "block";
        document.querySelector('#score').style.display = "none";
        document.querySelector('#grille').style.display = "none";

        document.onkeydown = function () {
            switch (window.event.keyCode) {
                case KEY_ENTER:
                    game();
                    break;
                case KEY_DOWN:
                    // Menu
                    break;
                case KEY_UP:
                    // Menu
                    break;
            }
        }
    }

    // Lancement du Menu
    menu();

})()