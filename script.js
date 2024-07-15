const gameBoard = function () {
    const gameState = [null, null, null,
                       "O", "X", null,
                       "X", null, null]
    
    const readState = function(coordinate) {
        return gameState[coordinate]
    }

    const writeState = function(coordinate, input) {
        if (Number.isInteger(coordinate) && coordinate < 9) {
            gameState[coordinate] = input;
        }
    }

    const readWinState = function() {
        if ((gameState[0] && gameState[0] === gameState[1] && gameState[1] === gameState[2]) ||
            (gameState[3] && gameState[3] === gameState[4] && gameState[4] === gameState[5]) ||
            (gameState[6] && gameState[6] === gameState[7] && gameState[7] === gameState[8]) ||
            (gameState[0] && gameState[0] === gameState[3] && gameState[3] === gameState[6]) ||
            (gameState[1] && gameState[1] === gameState[4] && gameState[4] === gameState[7]) ||
            (gameState[2] && gameState[2] === gameState[5] && gameState[5] === gameState[8]) ||
            (gameState[0] && gameState[0] === gameState[4] && gameState[4] === gameState[8]) ||
            (gameState[2] && gameState[2] === gameState[4] && gameState[4] === gameState[6])) {
                return "WIN";
            } else if (!gameState.includes(null)) {
                return "DRAW";
            } else {
                return false;
            }
    }

    return {readState, writeState, readWinState}
}();

const gamePlay = function () {
    let playerTurn = "X"

    const changeTurn = function () {
        playerTurn = playerTurn === "X" ? "O" : "X"
    }

    const takeTurn = function(coordinate) {
        if (!gameBoard.readState(coordinate)) {
            gameBoard.writeState(coordinate, playerTurn)
            changeTurn()
            screenController.drawTiles();
        }
    }
    return {takeTurn}
}();


const screenController = function() {
    const boardContainer = document.querySelector(".gameboard")


    return {drawTiles}
}();

screenController.drawTiles();