"use script"

const domElements = (() => {
  const board = document.querySelector(".board-grid");
  
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
  const playerToMakeMove = document.querySelector(".player-turn");
  const player1Stats = document.querySelector(".player1-stats");
  const player2Stats = document.querySelector(".player2-stats");
  const stats = {gameStats, player1Stats, player2Stats, playerToMakeMove};

  const gameReset = document.getElementById("resetGame");
  
  const winMessageBox = document.querySelector(".winMessageBox");
  const playAgainBtn = document.querySelector(".play-again");
  const noPlayAgainBtn = document.querySelector(".no-play-again");
  const winMessageElements = { winMessageBox, playAgainBtn, noPlayAgainBtn };
  

  return { board, player1, player2, stats, gameReset, winMessageElements };
})();


const Player = function(name, marker, gamesWon=0) {
  return { name, marker, gamesWon };            
}


// check if a move is winning move
const gameBoard = (() => {
  
  const markerArray = [["", "", ""],
                 ["", "", ""],
                 ["", "", ""]];

  let totalMarker = 0;

  const updateMarkerArray = (marker, rowPos, colPos) => {
    markerArray[rowPos][colPos] = marker;
    totalMarker += 1;
  };
  
  const resetMarkerArray = () => {
    markerArray.forEach((subArr, index) => {
      subArr.forEach((item, i) => markerArray[index][i] = "");
    });
    totalMarker = 0;
  };

  const winnerMarker = (playerTotalMarks, marker) => {
    const totalMarksValue = Object.values(playerTotalMarks);
    if (totalMarksValue.includes(3)) {
      resetMarkerArray();
      return marker
    } else if (totalMarker === 9) {
      resetMarkerArray();
      return "draw";
    }
  };

  const winningMove = (marker, rowPos, colPos) => {
    const totalMarks = { row: 0, col: 0, diag: 0, reverseDiag: 0 };
    updateMarkerArray(marker, rowPos, colPos);
    if (totalMarker > 4) {
      for (let i= 0; i< 3; i+= 1) {
        if (markerArray[i][colPos] === marker) totalMarks.row += 1;
        
        if (markerArray[rowPos][i] === marker) totalMarks.col += 1;

        if (rowPos === colPos) {
          if (markerArray[i][i] === marker) totalMarks.diag += 1;
        };

        // 2 = 3 - 1; 3 = boardSize
        if (+rowPos + +colPos === 2 ) {
          if (markerArray[i][2 - i] === marker) totalMarks.reverseDiag += 1;  
        };
      };
      const whoWon = winnerMarker(totalMarks, marker);
      return whoWon;
    };
  };

  return { winningMove }
})();


// changing player turns, score, winner message 
const gameController = (() => {
    
  const playersPlaying = {}; 
  let player1Turn = true;

  const updateScore = (player)  => {
    player.gamesWon += 1;  
  }

  const resetDomBoard = (board) => {
    board.childNodes.forEach((cell, index) => {
      (index % 2 === 1) ? cell.textContent = "" : null;
    })
  };
 
  const changePlayerTurn = () => {
    player1Turn = !player1Turn;
  };

  // display player name, marker, score on the page

  const playerToMove = (playerToMakeMove) => {
    const player = (player1Turn) ? playersPlaying.player1 : playersPlaying.player2;
    playerToMakeMove.textContent = `${player.name} (${player.marker}) turn`;
  };

  const displayPlayerStats = (player1Stats, player2Stats) => {
    const player1 = playersPlaying.player1;
    const player2 = playersPlaying.player2;

    player1Stats.children[0].textContent = `${player1.name} (${player1.marker})`;
    player1Stats.children[1].textContent = `${player1.gamesWon}`;

    player2Stats.children[0].textContent = `${player2.name} (${player2.marker})`;
    player2Stats.children[1].textContent = `${player2.gamesWon}`;
  };

  // create the player objects and push to playersPlaying dictionary.
  const createPlayers = function(name="Human", marker="null", turn="null") {
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
  

  const putMarkOnBoardCell = (boardCell, rowPos, colPos, marker) => {
    boardCell.textContent = marker;
  };


  const isCellMarked = (boardCell) => {
    return (boardCell.textContent != "") ? false : true;
  };

  
  const whichPlayerTurn = () => {
    const playerMove = (player1Turn) ? playersPlaying.player1 : playersPlaying.player2;
    changePlayerTurn();
   
    return playerMove;
  }; 


  const hideBoard = (boardCell) => {
    boardCell.parentNode.classList.toggle("hide");
  };

  const displayScore = (messageBox) => {
    messageBox.children[1].textContent = `${playersPlaying.player1.name} won ${playersPlaying.player1.gamesWon}`;
    messageBox.children[2].textContent = `${playersPlaying.player2.name} won ${playersPlaying.player2.gamesWon}`;
  };

  const displayDrawMessage = (messageBox) => {
    messageBox.children[0].textContent = "This round is draw!" 
  };  

  const displayWinnerMessage = (messageBox, player) => {
    messageBox.children[0].textContent = `${player.name} won this round!`;
  };

  const displayGameResult = (boardCell, gameDecision, player, winMessageBox) => {
    resetDomBoard(boardCell.parentNode);
    winMessageBox.classList.toggle("hide");
    if (gameDecision === "draw") {
      displayDrawMessage(winMessageBox);
      displayScore(winMessageBox);
    } else {
      updateScore(player);
      displayWinnerMessage(winMessageBox, player);
      displayScore(winMessageBox);
    }
    hideBoard(boardCell);
    changePlayerTurn();
  };

  const makeMove = () => {
    const boardCell = event.target;
    const cellCoordinates = boardCell.classList[0];
    const [rowPos, colPos] = [...cellCoordinates];
    const cellMarkedOrNot = isCellMarked(boardCell);

    if (cellMarkedOrNot) {
      const { stats, winMessageElements } = {...domElements};
      const { playerToMakeMove } = {...stats};
      const player = whichPlayerTurn();
      const { name, marker } = { ...player };
      playerToMove(playerToMakeMove);

      putMarkOnBoardCell(boardCell, rowPos, colPos, marker);
      const gameDecision = gameBoard.winningMove(marker, rowPos, colPos);
      if (gameDecision != undefined) {
        const { player1Stats, player2Stats } = {...stats};
        const { winMessageBox } = {...winMessageElements};

        displayGameResult(boardCell, gameDecision, player, winMessageBox)
        displayPlayerStats(player1Stats, player2Stats);      
        playerToMove(playerToMakeMove);
      };
    };
  };

  return { playerToMove, makeMove, createPlayers, displayPlayerStats };

})();


const domInteractions = (() => {
  
  const { board, player1, player2, stats, gameReset, winMessageElements } = domElements;
  const { playerToMove, makeMove, createPlayers, displayPlayerStats } = gameController;
 
  const { player1DetailsModal, player1FormSubmit, player1Name, player1Mark, player1Turn } = { ...player1 };
  const { player2Modal, player2Form, player2NameSubmit, player2Bot, player2Name } = { ...player2 };
  const { gameStats, player1Stats, player2Stats, playerToMakeMove } = { ...stats };
  const { winMessageBox, playAgainBtn, noPlayAgainBtn } = { ...winMessageElements }; 

  const hidePlayer2Form = () => {
    player2Modal.classList.toggle("hide");
    board.classList.toggle("hide");
    gameStats.classList.toggle("hide");
    displayPlayerStats(player1Stats, player2Stats);
    playerToMove(playerToMakeMove);
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

  
  const cells = board.childNodes;
  cells.forEach((cell, index) => {
    (index % 2 === 1) ? cell.addEventListener("click", makeMove) : null;
  });

   gameReset.addEventListener("click", () => window.location.reload());

   noPlayAgainBtn.addEventListener("click", () => window.close());
   playAgainBtn.addEventListener("click", () => {
     winMessageBox.classList.add("hide");
     board.classList.toggle("hide");
   });

})();
