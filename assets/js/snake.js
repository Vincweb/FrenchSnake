/**
 * JS Game Snake
 */

function frenshsnake() {

    console.log("Lancement du jeu Snake");

    const KEY_DOWN = 40;
    const KEY_UP = 38;
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;

    var speed = 100;
    var square = 10;

    // Create grille
    const Height = (Math.round(window.innerHeight / square) % 2 == 0) ? Math.round(window.innerHeight / square) : Math.round(window.innerHeight / square) - 1;
    const Width = (Math.round(document.querySelector('body').clientWidth / square) % 2 == 0) ? Math.round(document.querySelector('body').clientWidth / square) : Math.round(document.querySelector('body').clientWidth / square) - 1;

    console.log("Grille de jeu " + Height + "x" + Width);


    function Snake() {
        var position = [];
        position.push(new Array((Height / 2), (Width / 2)));

        this.getPosition = function () {
            return position;
        };

        this.moveUP = function () {
            position.unshift([position[0][0]-1,position[0][1]]);
            position.pop();
        }

        this.moveDOWN = function () {
            position.unshift([position[0][0]+1, position[0][1]]);
            position.pop();
        }

        this.moveLEFT = function () {
            position.unshift([position[0][0], position[0][1]-1]);
            position.pop();
        }

        this.moveRIGHT = function () {
            position.unshift([position[0][0], position[0][1]+1]);
            position.pop();
        }

        this.addSnake = function () {
            position.push([position[position.length-1][0], position[position.length-1][1]]);
        }
    }

    var snake = new Snake();

    function Circle() {
        var position = new Array();

        this.getPosition = function () {
            return position;
        }

        this.newCircle = function () {
            position = new Array();
            position.push(new Array(Math.round(Math.floor((Math.random() * Height))), Math.round(Math.floor((Math.random() * Width)))));
        }
    }

    var circle = new Circle();
    circle.newCircle();

    render();

    function collision() {
        if (snake.getPosition()[0][0] == circle.getPosition()[0][0] && snake.getPosition()[0][1] == circle.getPosition()[0][1]) {
            console.log("On mange !!");
            circle.newCircle();
            snake.addSnake();
        }

        if (snake.getPosition()[0][0] > Height || snake.getPosition()[0][0] < 0) {
            console.log("Touche le mur !!");
            return true;
        }

        if (snake.getPosition()[0][1] > Width || snake.getPosition()[0][1] < 0) {
            console.log("Touche le mur !!");
            return true;
        }

        if (snake.getPosition().length > 4) {
            var snakeHead = snake.getPosition()[0];
            var snakeOutHead = [... snake.getPosition()];
            snakeOutHead.shift();
            snakeOutHead.forEach(element => {
                if(element[0] == snakeHead[0] && element[1] == snakeHead[1]){
                    console.log("Aieee !!");
                    return true;
                }
            });
        }
    }

    function render() {
        collision();

        document.querySelector('#grille').innerHTML = "";
        snake.getPosition().forEach(element => {
            document.querySelector('#grille').innerHTML = document.querySelector('#grille').innerHTML + '<div class="square" style="top:' + element[0] * square + 'px;left:' + element[1] * square + 'px;"></div>';
        });

        circle.getPosition().forEach(element => {
            document.querySelector('#grille').innerHTML = document.querySelector('#grille').innerHTML + '<div class="circle" style="top:' + element[0] * square + 'px;left:' + element[1] * square + 'px;"></div>';
        });
    }

    var move;
    var lastKeyPress;

    document.onkeydown = function () {
        switch (window.event.keyCode) {
            case KEY_DOWN:
                if (lastKeyPress == KEY_UP) break;
                lastKeyPress = KEY_DOWN;
                clearInterval(move);
                move = setInterval(function () {
                    snake.moveDOWN();
                    render();
                }, speed);
                break;
            case KEY_UP:
                if (lastKeyPress == KEY_DOWN) break;
                lastKeyPress = KEY_UP;
                clearInterval(move);
                move = setInterval(function () {
                    snake.moveUP();
                    render();
                }, speed);
                break;
            case KEY_LEFT:
                if (lastKeyPress == KEY_RIGHT) break;
                lastKeyPress = KEY_LEFT;
                clearInterval(move);
                move = setInterval(function () {
                    snake.moveLEFT();
                    render();
                }, speed);
                break;
            case KEY_RIGHT:
                if (lastKeyPress == KEY_LEFT) break;
                lastKeyPress = KEY_RIGHT;
                clearInterval(move);
                move = setInterval(function () {
                    snake.moveRIGHT();
                    render();
                }, speed);
                break;
            default:
                clearInterval(move);
                break;
        }
    }

}