"use script"

const domElements = (() => {
  const boardCells = document.querySelector(".board-grid");
  
  const player1DetailsModal = document.querySelector(".player1-details");
  const player1Name = document.getElementById("player1-name");
  const player1Mark = document.getElementById("player1-mark");
  const player1Turn = document.getElementById("turn-choice");
  const player1FormSubmit = document.getElementById("player1-submit");
  const player1 = {player1DetailsModal, player1FormSubmit, player1Name, player1Mark, player1Turn};
 
  const player2Modal = document.querySelector(".player2-modal");
  const player2Human = document.querySelector(".human");
  const player2Bot = document.querySelector(".bot");
  const player2Form = document.querySelector(".player2-form");
  const player2Name= document.getElementById("player2-name");
  const player2NameSubmit = document.querySelector(".player2-submit");
  const player2 = { player2Modal, player2Human, player2Bot, player2Form, player2Name, player2NameSubmit };


  const gameStats = document.querySelector(".game-stats");
  const player1Stats = document.querySelector(".player1-stats");
  const player2Stats = document.querySelector(".player2-stats");

  const stats = {gameStats, player1Stats, player2Stats};

  return { boardCells, player1, player2, stats};
})();


const Player = function(name, marker, gamesWon=0) {
  return { name, marker, gamesWon };            
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

  
  // display player name, marker, score on the page
  const displayPlayer = (player1Div, player2Div) => {
    const player1 = playersPlaying.player1;
    const player2 = playersPlaying.player2;

    player1Div.children[0].textContent = `${player1.name} (${player1.marker})`;
    player1Div.children[1].textContent = `${player1.gamesWon}`;

    player2Div.children[0].textContent = `${player2.name} (${player2.marker})`;
    player2Div.children[1].textContent = `${player2.gamesWon}`;
  }
  
  const updateScore = (player)  => {
    player.gamesWon += 1;  
  }

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
        const { stats } = domElements;
        const players = Object.values(playersPlaying);
  
        for (let player of players) {
          if (player.marker === winnerMarker) {
            updateScore(player);
            displayPlayer(stats.player1Stats, stats.player2Stats);
            break;
          };
        };
      }; 
    };
  };

  return { makeMove, createPlayers, displayPlayer };

})();


const domInteractions = (() => {
  
  const { boardCells, player1, player2, stats } = domElements;
  const { makeMove, createPlayers, displayPlayer } = gameController;
 
  const { player1DetailsModal, player1FormSubmit, player1Name, player1Mark, player1Turn } = {...player1};
  const { player2Modal, player2Form, player2NameSubmit, player2Bot, player2Name } = {...player2};
  const {gameStats, player1Stats, player2Stats} = {...stats};

  const hidePlayer2Form = () => {
    player2Modal.classList.toggle("hide");
    boardCells.classList.toggle("hide");
    gameStats.classList.toggle("hide");
    displayPlayer(player1Stats, player2Stats);
  };
   
  player1FormSubmit.addEventListener("click", () => {
    createPlayers(player1Name.value, player1Mark.value, player1Turn.value);
    player1DetailsModal.classList.add("hide");
    player2Modal.classList.toggle("hide");
  });
  
  player2.player2Human.addEventListener("click", () => {
    player2Form.classList.toggle("hide");
  });

  player2.player2Bot.addEventListener("click", () => {
    createPlayers("AIBot");
    hidePlayer2Form();
  });

  player2NameSubmit.addEventListener("click", () => {
    createPlayers(player2Name.value);
    hidePlayer2Form();
  });

  
  const cells = boardCells.childNodes;
  cells.forEach((cell, index) => {
    (index % 2 === 1) ? cell.addEventListener("click", makeMove) : null;
  });

})();
