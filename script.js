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
    const boardTiles = document.querySelectorAll(".gametile")
    boardTiles.forEach((tile, index) => {
        tile.addEventListener("click", () => {
            gamePlay.takeTurn(index);
        })
    })

    const drawTiles = function () {
        boardTiles.forEach((tile, index) => {
            tile.innerHTML = gameBoard.readState(index)
        })
    }

    return {drawTiles}
}();

screenController.drawTiles();