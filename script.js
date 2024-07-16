const gameBoard = function () {
    const gameState = [null, null, null,
                       null, null, null,
                       null, null, null]
    
    const readState = function(coordinate) {
        return gameState[coordinate]
    }

    //change input to read the currect game token.
    const writeState = function(coordinate) {
        if (Number.isInteger(coordinate) && coordinate < 9) {
            gameState[coordinate] = gamePlay.currentTurn();
        }
    }

    const readWinState = function() {
        const possibleWinStates = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
        const checkWinState = (a,b,c) => {
            if (gameState[a] && gameState[a] === gameState[b] && gameState[b] === gameState[c]){
                screenController.highlightWin([a,b,c])
                return true;
            }
        }

        if (possibleWinStates.filter((state) => checkWinState(...state)).length) {
                return "WIN";
            } else if (!gameState.includes(null)) {
                return "DRAW";
            } else {
                return false;
            }
    }

    const resetGameState = function () {
        for (let i = 0; i < 9; i++) {
            gameState[i] = null;
        }
    }

    return {readState, writeState, readWinState, resetGameState}
}();


const player = function (name, symbol) {
    let totalWins = 0;
    const increaseWins = () => totalWins++
    const readWins = () => totalWins;

    return {name, symbol, increaseWins, readWins}
}

const playerOne = player("Player One", "X")
const playerTwo = player("Player Two", "O")


const gamePlay = function () {
    let playerTurn = playerOne.symbol;
    let gameHasBeenWon = false;

    const changeTurn = function () {
        playerTurn = playerTurn === playerOne.symbol ? playerTwo.symbol : playerOne.symbol
    }

    const currentTurn = () => playerTurn;

    const takeTurn = function(coordinate) {
        if (!gameBoard.readState(coordinate) && !gameHasBeenWon) {
            gameBoard.writeState(coordinate, playerTurn)
            screenController.drawTiles()
            handleWin();
            changeTurn();
        }
    }

    const handleReset = function () {
        gameHasBeenWon = false;
        playerTurn = playerOne.symbol;
    }

    const handleWin = function () {
        if (gameBoard.readWinState() === "WIN"){
            gameHasBeenWon = true;
            playerTurn === playerOne.symbol ? playerOne.increaseWins() : playerTwo.increaseWins();
            screenController.gameWinDialog();
        } else if (gameBoard.readWinState() === "DRAW") {
            screenController.gameDrawDialog();
            gameHasBeenWon = true;
        }
    }

    return {takeTurn, currentTurn, handleReset}
}();


const screenController = function() {
    const boardTiles = document.querySelectorAll(".gametile")
    const playerOneOutput = document.querySelector("#player-one")
    const playerTwoOutput = document.querySelector("#player-two")
    const messageOutput = document.querySelector("#announcements")
    const dialog = document.querySelector('dialog')
    const dialogPlayerOne = document.querySelector("#player-one-name")
    const dialogPlayerTwo = document.querySelector("#player-two-name")
    const dialogButton = document.querySelector("dialog>form>button")
   

    const resetButton = document.createElement("button")
    resetButton.append(document.createTextNode("Reset Game"));
    resetButton.addEventListener("click", () => gameReset())

    boardTiles.forEach((tile, index) => {
        tile.addEventListener("click", () => {
            tile.classList.add("disabled")
            gamePlay.takeTurn(index);
        })
    })

    const drawTiles = function () {
        boardTiles.forEach((tile, index) => {
            tile.innerHTML = gameBoard.readState(index)
        })
    }

    const highlightWin = function (array) {
        boardTiles.forEach((tile, index) => {
            tile.classList.add("disabled")
            if (array.includes(index)) {
                tile.classList.add("highlight")
            }
        })
    }

    const gameWinDialog = function () {
        const playerName = gamePlay.currentTurn() === playerOne.symbol ? playerOne.name : playerTwo.name
        messageOutput.innerHTML= "The game has been won by " + playerName + "."
        messageOutput.append(resetButton)
        updatePlayers();
    }

    const gameDrawDialog = function () {
        messageOutput.innerHTML= "The game is a draw!"
        messageOutput.append(resetButton)
    }

    const gameReset = function () {
        gameBoard.resetGameState();
        gamePlay.handleReset();
        boardTiles.forEach((tile) => {
            tile.classList.remove("highlight", "disabled")
        }
        )
        messageOutput.innerHTML = "";
        drawTiles();
    }

    const updatePlayers = function () {
        playerOneOutput.innerHTML = playerOne.name + "<br/> Score: " + playerOne.readWins();
        playerTwoOutput.innerHTML = playerTwo.name + "<br/> Score: " + playerTwo.readWins();
    }

    dialog.showModal();
    dialogButton.addEventListener("click", (e) => {
        e.preventDefault();
        dialog.close();
        playerOne.name = dialogPlayerOne.value || "Player One"
        playerTwo.name = dialogPlayerTwo.value || "Player Two"
        updatePlayers();
    })


    return {drawTiles, gameWinDialog, gameDrawDialog, highlightWin}
}();

