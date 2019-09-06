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
    var speedinit = 80;
    var speed = speedinit;
    var square = 40;
    var score = 0;
    let bestScore = Array();

    // Create grille
    const Height = (Math.round(window.innerHeight / square) % 2 == 0) ? Math.round(window.innerHeight / square) : Math.round(window.innerHeight / square) - 1;
    const Width = (Math.round(document.querySelector('body').clientWidth / square) % 2 == 0) ? Math.round(document.querySelector('body').clientWidth / square) : Math.round(document.querySelector('body').clientWidth / square) - 1;

    // Initialise Object
    var snake = new Snake();
    var circleBleu = new Circle();
    var circleWhite = new Circle();
    var circleRed = new Circle();

    // Initialise Move
    var move;

    // pseudo gamer
    var pseudo;

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

        this.subSnake = function () {
            if (position.length > 1) {
                position.pop();
            }
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
            position.push(new Array(randNumberHeight(), randNumberWidth()));
        }

        this.eatCircle = function () {
            position = new Array();
            position.push(new Array(-1, -1));
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

    // Test the connection
    var connection = false;
    window.addEventListener('load', function () {
        function updateOnlineStatus(event) {
            if (navigator.onLine) {
                // handle online status
                console.log('Your are online !');
                // Get Score BDD
                syncBDD();
                connection = true;
            } else {
                // handle offline status
                console.log('Your are offline !');
                connection = false;
            }
        }

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        updateOnlineStatus();

        // Get the bestScore
        getScore();
    });

    // Rang Score
    function sortScore() {

        if (bestScore.length >= 5) {
            for (var i = 0; i < 5; i++) {

                if (bestScore[i]["score"] < score) {

                    bestScore.push({ "name": pseudo, "score": score });

                    bestScore.sort(function (a, b) {
                        return a.score - b.score;
                    });
                    bestScore.shift();

                    return true;
                }

            }

            return false;

        } else {

            bestScore.push({ "name": pseudo, "score": score });

            bestScore.sort(function (a, b) {
                return a.score - b.score;
            });

            return true;
        }
    }

    // Synchronise BDD
    function syncBDD() {

        // A voir
        getScore();
    }

    // Set cookie
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    // Get cookie
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // Get score 
    function getScore() {

        if (connection) {

            var ref = firebase.database().ref('score');

            ref.once("value", function (snapshot) {

                var scoreOnline = snapshot.val();

                if (scoreOnline != null) {
                    scoreOnline = Object.entries(scoreOnline);

                    //console.log(scoreOnline);
                    scoreOnline.forEach(element => {
                        bestScore.push({ "name": element[1]['name'], "score": element[1]['score'] });
                    });

                    bestScore.sort(function (a, b) {
                        return a.score - b.score;
                    });

                    bestScore = bestScore.slice(-5);
                }
                //console.log(bestScore);

            });

            console.log("BestScore downloaded !");

        } else {

            // Web Storage 
            try {
                //console.log("Web Storage work !");
                bestScore = JSON.parse(localStorage.getItem('bestScore'));
            } catch (error) {
                //console.log("Web Storage don't work !");
                bestScore = (getCookie("bestScore") == "") ? Array() : JSON.parse(getCookie("bestScore"));
            }
        }
    }

    // Save Score
    function saveScore() {

        if (connection) {
            // Get a reference to the database service
            var database = firebase.database();

            function writeUserData(score) {
                firebase.database().ref('score/' + Date.now()).set({
                    name: pseudo,
                    score: score
                });
            }

            writeUserData(score);

            console.log("Score Saved in BDD !")
        }

        // Web Storage 
        try {
            //console.log("Web Storage work !");
            localStorage.setItem("bestScore", JSON.stringify(bestScore));
        } catch (error) {
            //console.log("Web Storage don't work !");
            setCookie("bestScore", JSON.stringify(bestScore), 10);
        }
    }

    // Game Over
    function gameOver() {

        visibilityMenu("gameOver");

        // Stop the move
        clearInterval(move);
        snake = new Snake();
        circleBleu = new Circle();
        circleWhite = new Circle();
        circleRed = new Circle();
        speed = speedinit;

        console.log("Your score : " + score);

        // Function sort bestScore
        if (sortScore()) {
            // if new high score
            // Save the score
            saveScore();
        }

        document.querySelector('#score').innerHTML = '<h1> Score : ' + score + '</h1>';

        var bestScoreRev = [].concat(bestScore).reverse();
        for (var i in bestScoreRev) {
            document.querySelector('#score').innerHTML = document.querySelector('#score').innerHTML + '<h4> ' + parseFloat(parseFloat(i) + parseFloat(1)) + '.  ' + bestScoreRev[i]["name"] + ' - ' + bestScoreRev[i]["score"] + '</h4>';
        }

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
        // Snake eat Bleu
        if (snake.getPosition()[0][0] == circleBleu.getPosition()[0][0] && snake.getPosition()[0][1] == circleBleu.getPosition()[0][1]) {
            circleBleu.eatCircle();
            snake.addSnake();
            score = score + 10;
        }

        // Snake eat White
        if (snake.getPosition()[0][0] == circleWhite.getPosition()[0][0] && snake.getPosition()[0][1] == circleWhite.getPosition()[0][1]) {
            circleWhite.eatCircle();
            if (circleBleu.getPosition()[0][0] != -1) {
                circleBleu.eatCircle();
                snake.subSnake();
                score = score - 20;
            } else {
                snake.addSnake();
                score = score + 10;
            }
        }

        // Snake eat Red
        if (snake.getPosition()[0][0] == circleRed.getPosition()[0][0] && snake.getPosition()[0][1] == circleRed.getPosition()[0][1]) {
            if (circleWhite.getPosition()[0][0] != -1 || circleBleu.getPosition()[0][0] != -1) {
                score = score - 20;
                snake.addSnake();
                snake.subSnake();
                snake.subSnake();
            } else {
                score = score + 10;
                if (speed > 60) {
                    speed = speed - 2;
                }
            }
            circleBleu.newCircle();
            circleWhite.newCircle();
            circleRed.newCircle();
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

        circleBleu.getPosition().forEach(element => {
            document.querySelector('#grille').innerHTML = document.querySelector('#grille').innerHTML + '<div class="circle" style="background:blue;height:' + square + 'px;width:' + square + 'px;top:' + element[0] * square + 'px;left:' + element[1] * square + 'px;"></div>';
        });

        circleWhite.getPosition().forEach(element => {
            document.querySelector('#grille').innerHTML = document.querySelector('#grille').innerHTML + '<div class="circle" style="background:white;height:' + square + 'px;width:' + square + 'px;top:' + element[0] * square + 'px;left:' + element[1] * square + 'px;"></div>';
        });

        circleRed.getPosition().forEach(element => {
            document.querySelector('#grille').innerHTML = document.querySelector('#grille').innerHTML + '<div class="circle" style="background:red;height:' + square + 'px;width:' + square + 'px;top:' + element[0] * square + 'px;left:' + element[1] * square + 'px;"></div>';
        });

        document.querySelector('#grille').innerHTML = document.querySelector('#grille').innerHTML + "<div id='grilleScore'> Score : " + score + "</div>";
    }

    // Run game
    function game() {

        visibilityMenu("game");

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

    // Choose the pseudo
    function choosePseudo() {

        visibilityMenu("pseudo");

        document.querySelector('body').onclick = function () {
            document.querySelector('.pseudo').focus();
        }

        document.onkeydown = function () {
            switch (window.event.keyCode) {
                case KEY_ENTER:
                    document.querySelector('.pseudo').focus();
                    pseudo = document.querySelector('.pseudo').value;
                    if (pseudo.length < 3) {
                        console.log("Choose a pseudo (minumum 3 caracters) !")
                    } else {
                        console.log("Your pseudo : " + pseudo);
                        game();
                    }
                    break;
                default:
                    document.querySelector('.pseudo').focus();
                    break;
            }
        }
    }

    // Menu game
    function menu() {

        visibilityMenu("menu");

        document.onkeydown = function () {
            switch (window.event.keyCode) {
                case KEY_ENTER:
                    if (pseudo == null) {
                        choosePseudo();
                    } else {
                        game();
                    }
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

    // View the correct page
    function visibilityMenu(page) {
        if (page == "menu") {
            document.querySelector('#menu').style.opacity = "1";
            document.querySelector('#menu').style.display = "block";
            document.querySelector('#score').style.display = "none";
            document.querySelector('#pseudo').style.display = "none";
            document.querySelector('#grille').style.display = "none";
        }

        if (page == "pseudo") {
            document.querySelector('#pseudo').style.display = "block";
            document.querySelector('#pseudo').style.opacity = "1";
            document.querySelector('#menu').style.display = "none";
        }

        if (page == "game") {
            document.querySelector('#pseudo').style.opacity = "0";
            document.querySelector('#pseudo').style.display = "none";
            document.querySelector('#menu').style.opacity = "0";
            document.querySelector('#menu').style.display = "none";
            document.querySelector('#grille').style.display = "block";
            document.querySelector('#grille').style.opacity = "1";

        }

        if (page == "gameOver") {
            document.querySelector('#score').style.opacity = "1";
            document.querySelector('#score').style.display = "block";
            document.querySelector('#grille').style.opacity = "0";
        }
    }

    // Lancement du Menu
    menu();

    // Disebale Click right
    document.oncontextmenu = new Function("return false");

})()