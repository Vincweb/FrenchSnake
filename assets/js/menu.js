/**
 * JS Menu Snake
 */

function menu() {

    console.log("Menu snake");

    const KEY_ENTER = 13;

    var game;

    document.onkeydown = function () {
        switch (window.event.keyCode) {

            case KEY_ENTER:
                document.querySelector('#menu').style.display = "none";
                try{
                    game = frenshsnake();
                }
                catch (error){
                    delete game;
                    document.querySelector('#grille').style.display = "none";
                    document.querySelector('#menu').style.display = "block";
                    console.log(error);
                }
                break;
        }
    }

}

menu();