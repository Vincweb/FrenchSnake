/**
 * JS Game Snake
 */
console.log("Lancement du jeu Snake");

var KEY_DOWN = 40;
var KEY_UP = 38;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;

var speed = 100;

// Create grille
var grilleHeight = (Math.round(window.innerHeight / 10) % 2 == 0) ? Math.round(window.innerHeight / 10) : Math.round(window.innerHeight / 10) - 1;
var grilleWidth = (Math.round(document.querySelector('body').clientWidth / 10) % 2 == 0) ? Math.round(document.querySelector('body').clientWidth / 10) : Math.round(document.querySelector('body').clientWidth / 10) - 1;

console.log("Grille de jeu "+grilleHeight+"x"+grilleWidth);

var grille = new Array(grilleHeight);
for (i = 0; i < grille.length; i++) {
    grille[i] = new Array(grilleWidth);
}
/*
Legende :
0 or null : empty
1: circle
2: square
*/

//Add square
grille[grilleHeight / 2][grilleWidth / 2] = 2;

function addCircle(top, left) {
    //controlFullGrille();
    if (grille[top][left] != 0) {
        //addCircle(Math.floor((Math.random() * grilleHeight)), Math.floor((Math.random() * grilleWidth)));
    } else {
        grille[top][left] = 1;
        document.querySelector('#grille').innerHTML = document.querySelector('#grille').innerHTML + '<div class="circle" style="top:' + top * 10 + 'px;left:' + left * 10 + 'px;"></div>';
    }
}

function controlFullGrille() {
    for (i = 0; i < grilleHeight; i++) {
        for (j = 0; j < grilleWidth; j++) {
            if (grille[i][j] == 0 || grille[i][j] == null) return false;
        }
    }
    return true;
}

addCircle(Math.floor((Math.random() * grilleHeight)), Math.floor((Math.random() * grilleWidth)));

function moveSquare(top, left) {
    if (grille[top][left] == 1) {
        console.log("On l'a mangé !!");
        addCircle(Math.floor((Math.random() * grilleHeight)), Math.floor((Math.random() * grilleWidth)));
    }

    document.querySelector('#square').style.top = 0
}

var move;

document.onkeydown = function () {
    switch (window.event.keyCode) {
        case KEY_DOWN:
            clearInterval(move);
            move = setInterval(function () {
                if (document.querySelector('#square').offsetTop > window.innerHeight) {
                    document.querySelector('#square').style.top = 0;
                }
                else {
                    document.querySelector('#square').style.top = (document.querySelector('#square').offsetTop + document.querySelector('#square').clientWidth) + 'px';
                }
            }, speed);
            break;
        case KEY_UP:
            clearInterval(move);
            move = setInterval(function () {
                if (document.querySelector('#square').offsetTop < 0) {
                    document.querySelector('#square').style.top = window.innerHeight + 'px';
                }
                else {
                    document.querySelector('#square').style.top = (document.querySelector('#square').offsetTop - document.querySelector('#square').clientWidth) + 'px';
                }
            }, speed);
            break;
        case KEY_LEFT:
            clearInterval(move);
            move = setInterval(function () {
                if (document.querySelector('#square').offsetLeft < 0) {
                    document.querySelector('#square').style.left = document.querySelector('body').clientWidth + 'px';
                }
                else {
                    document.querySelector('#square').style.left = (document.querySelector('#square').offsetLeft - document.querySelector('#square').clientWidth) + 'px';
                }
            }, speed);
            break;
        case KEY_RIGHT:
            clearInterval(move);
            move = setInterval(function () {
                if (document.querySelector('#square').offsetLeft > document.querySelector('body').clientWidth) {
                    document.querySelector('#square').style.left = 0;
                }
                else {
                    document.querySelector('#square').style.left = (document.querySelector('#square').offsetLeft + document.querySelector('#square').clientWidth) + 'px';
                }
            }, speed);
            break;
    }
}