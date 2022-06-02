"use script"

const domElements = (() => {
  const boardCells = document.querySelector(".board-grid");
  
  const userDetailsModal = document.querySelector(".user-details");
  const userName = document.getElementById("user-name");
  const userMark = document.getElementById("user-mark");
  const userTurn = document.getElementById("turn-choice");
  const userFormSubmit = document.getElementById("user-submit");
  const user = {userDetailsModal, userFormSubmit, userName, userMark, userTurn};
 
  const player2Modal = document.querySelector(".player2-modal");
  const player2Human = document.querySelector(".human");
  const player2Bot = document.querySelector(".bot");
  const player2Form = document.querySelector(".player2-form");
  const player2Name= document.getElementById("player2-name");
  const player2NameSubmit = document.querySelector(".player2-submit");
  const player2 = { player2Modal, player2Human, player2Bot, player2Form, player2Name, player2NameSubmit };

  return { boardCells, user, player2};
})();


const Player = function(name, marker) {
  return { name, marker };            
}


const gameBoard = (() => {
  
  const markerArray = [["", "", ""],
                 ["", "", ""],
                 ["", "", ""]];

  let totalMarker = 0;

  const markerArrayReset = () => {
    markerArray.forEach((subArray, index) => {
      subArray.forEach((item, i) => {
        markerArray[index][i] = "";
      })
    })
  };

  const updateArray = (rowIndex, columnIndex, playerMarker) => {
    markerArray[rowIndex][columnIndex] = playerMarker;
    totalMarker += 1;
  };

  const didPlayerWon = (marker, rowPos, colPos) => {
    let rowMarks = 0;
    let colMarks = 0;
    let diagonalMarks = 0;
    let reverseDiagonalMarks = 0;

    for (let i= 0; i< 3; i+= 1) {
      
      if (markerArray[rowPos][i] === marker) colMarks += 1;

      if (markerArray[i][colPos] === marker) rowMarks += 1;

      if (rowPos === colPos) {
        if (markerArray[i][i] === marker) diagonalMarks += 1;
      }

      if (rowPos + colPos === 2) {
        if (markerArray[i][(2) - i] === marker) reverseDiagonalMarks += 1;
      }
    };
    
    if (rowMarks === 3 || colMarks === 3 || diagonalMarks === 3 || reverseDiagonalMarks === 3) {
      markerArrayReset();
      return marker;
    } else {
      return null;
    };
  };  
  
  
  return { updateArray, didPlayerWon };
})();


const gameController = (() => {
  
  const playersPlaying = {}; 
  let player1Turn = true;

  // create the player and push to players object.
  const createPlayers = function(name, marker="null", turn="null") {
    if (Object.keys(playersPlaying).length === 0) {
      player1Turn = (turn === "yes") ? true : false;
      const player1 = Player(name, marker);
      playersPlaying["player1"] = player1;
    } else {
      playerTurn = !playersPlaying.player1.playerTurn;
      playerMark = (playersPlaying.player1.marker === "X") ? "O" : "X";
      const player2 = Player(name, playerMark);
      playersPlaying["player2"] = player2;
    }
  };

  const resetBoard = (board) => {
    board.childNodes.forEach((cell, index) => {
      (index % 2 === 1) ? cell.textContent = "" : null;
    })
  };

  const updatePlayerMark = (boardCell, rowPos, colPos, marker) => {

    boardCell.textContent = marker;
  };

  const isCellMarked = function(boardCell) {
    return (boardCell.textContent != "") ? false : true;
  };

  const whichPlayerTurn = () => {
    const playerMove = (player1Turn) ? playersPlaying.player1 : playersPlaying.player2;
    player1Turn = !player1Turn;

    return playerMove;
  }; 

  const makeMove = () => {
    const e = event.target;
    const boardCell = e.classList[0];
    const [rowPos, colPos] = [...boardCell.split("")];

    const cellMarked = isCellMarked(e);

    if (cellMarked) {
      const playerMoved = whichPlayerTurn();
      const {name, marker} = {...playerMoved};

      updatePlayerMark(e, rowPos, colPos, marker);
      gameBoard.updateArray(rowPos, colPos, marker); 
      const winnerMarker = gameBoard.didPlayerWon(marker, +rowPos, +colPos);

      if (winnerMarker != null) {
        resetBoard(e.parentNode);
      } 
   }
  };

  return { makeMove, createPlayers };

})();


const domInteractions = (() => {
  
  const { boardCells, user, player2 } = domElements;
  const { makeMove, createPlayers } = gameController;
 
  const { userDetailsModal, userFormSubmit, userName, userMark, userTurn } = {...user};

  const { player2Modal, player2Form, player2NameSubmit, player2Bot, player2Name } = {...player2}

  user.userFormSubmit.addEventListener("click", () => {
    createPlayers(userName.value, userMark.value, userTurn.value);
    user.userDetailsModal.classList.add("hide");
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
