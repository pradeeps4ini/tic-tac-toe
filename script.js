"use script"

const domElements = (() => {
  const boardCells = document.querySelector(".board-grid");
  
  const userDetailsModal = document.querySelector(".user-details");
  const userName = document.getElementById("user-name");
  const userMark = document.getElementById("user-mark");
  const userTurn = document.getElementById("turn-choice");
  const userFormSubmit = document.getElementById("user-submit");
  const userPlayer1 = {userDetailsModal, userFormSubmit, userName, userMark, userTurn};
 
  const player2Modal = document.querySelector(".player2-modal");
  const player2Human = document.querySelector(".human");
  const player2Bot = document.querySelector(".bot");
  const player2Form = document.querySelector(".player2-form");
  const player2Name= document.getElementById("player2-name");
  const player2NameSubmit = document.querySelector(".player2-submit");
  const player2 = { player2Modal, player2Human, player2Bot, player2Form, player2Name, player2NameSubmit };

  return { boardCells, userPlayer1, player2};
})();


const Player = function(name, marker, playerTurn) {
  const updateTurnStatus = function() {
    this.playerTurn = !this.playerTurn;
  }
  return { name, marker, playerTurn, updateTurnStatus };            
}


const gameBoard = (() => {
  const array = [[1, 0, 1],
                 [0, 1, 0],
                 [1, 0, 1]];

  const isCellMarked = function(boardCell) {
    return (boardCell.textContent != "") ? false : true;
  }

  const updatePlayerMark = function(boardCell, marker) {
    const marked = isCellMarked(boardCell);
    if (marked) boardCell.textContent = marker; 
  }

  return { updatePlayerMark };
})();


const gameController = (() => {
  
  const players = {}; 
  
  const createPlayers = function(name, marker="null", turn="null") {
    if (Object.keys(players).length === 0) {
      playerTurn = (turn === "yes") ? true : false;
      const player1 = Player(name, marker, playerTurn);
      players["player1"] = player1;
    } else {
      playerTurn = !players.player1.playerTurn;
      playerMark = (players.player1.marker === "X") ? "O" : "X";
      const player2 = Player(name, playerMark, playerTurn);
      players["player2"] = player2;
    }

    console.log(players)
  }

  const makeMove = () => {
    const boardCell = event.target.classList[0];
    const [cellPositionX, cellPositionY] = [...boardCell.split("")];
    gameBoard.updatePlayerMark(event.target, [cellPositionX, cellPositionY]);
  };

  return { makeMove, createPlayers }

})();


const domInteractions = (() => {
  
  const { boardCells, userPlayer1, player2 } = domElements;
  const { makeMove, createPlayers } = gameController;
 
  const { userDetailsModal, userFormSubmit, userName, userMark, userTurn } = {...userPlayer1};
  const { player2Modal, player2Form, player2NameSubmit, player2Bot, player2Name } = {...player2}

  userPlayer1.userFormSubmit.addEventListener("click", () => {
    createPlayers(userName.value, userMark.value, userTurn.value);
    userPlayer1.userDetailsModal.classList.add("hide");
    player2Modal.classList.remove("hide");
  })
  
  player2.player2Human.addEventListener("click", () => {
    player2Form.classList.remove("hide");
  });

  player2.player2Bot.addEventListener("click", () => {
    player2Modal.classList.add("hide");    
    createPlayers("AIBot");
    boardCells.classList.remove("hide");
  });

  player2NameSubmit.addEventListener("click", () => {
    createPlayers(player2Name.value);
    player2Modal.classList.add("hide");
    boardCells.classList.remove("hide");
  });

  
  const cells = boardCells.childNodes;
  cells.forEach((cell, index) => {
    (index % 2 === 1) ? cell.addEventListener("click", makeMove) : null;
  });

})();
