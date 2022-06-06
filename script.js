"use script"

const domElements = (() => {
  const board = document.querySelector(".board-grid");
  
  const player1DetailsForm = document.querySelector(".player1-details");
  const player1Name = document.getElementById("player1-name");
  const player1Mark = document.getElementById("player1-mark");
  const player1Turn = document.getElementById("turn-choice");
  const player1FormSubmit = document.getElementById("player1-submit");
  const player1 = { player1DetailsForm, player1FormSubmit, player1Name, player1Mark, player1Turn };
 
  const player2Info = document.querySelector(".player2-info");
  const player2HumanBtn = document.querySelector(".humanBtn");
  const player2BotBtn = document.querySelector(".botBtn");
  const player2Form = document.querySelector(".player2-form");
  const player2Name= document.getElementById("player2-name");
  const player2NameSubmit = document.querySelector(".player2-submit");
  const choseAiOrHuman = document.querySelector(".AiorHuman");
  const player2 = { choseAiOrHuman, player2Info, player2HumanBtn, player2BotBtn, player2Form, player2Name, player2NameSubmit };


  const gameStats = document.querySelector(".game-stats");
  const playerToMakeMove = document.querySelector(".player-turn");
  const player1Stats = document.querySelector(".player1-stats");
  const player2Stats = document.querySelector(".player2-stats");
  const stats = { gameStats, player1Stats, player2Stats, playerToMakeMove };

  const resetGame = document.querySelector(".resetGame");
  const resetGameBtn = document.getElementById("resetGameBtn"); 
  const reset = { resetGame, resetGameBtn };

  const winMessageBox = document.querySelector(".winMessageBox");
  const playAgainBtn = document.querySelector(".play-again");
  const noPlayAgainBtn = document.querySelector(".no-play-again");
  const winMessageElements = { winMessageBox, playAgainBtn, noPlayAgainBtn };
  

  return { board, player1, player2, stats, reset, winMessageElements };
})();


/* creating player objects
 *
 *@param name: name of the player
 *@param marker: marker of the player. Either O or X.
 *@param gamesWon: games won by the marker
 *
 * return an object with { name, marker, gamesWon }
 */
const players = (() => {

  let playersPlaying = {};

  // factory function
  const Player = (name, marker, playerTurn, gamesWon=0) => {
    return { name, marker, playerTurn, gamesWon };
  };


  const setPlayers = (name, marker="O", playerTurn=undefined) => {

    if (Object.keys(playersPlaying).length === 0) {
      const playerOne = Player(name, marker, playerTurn);
      playersPlaying[0] = playerOne;
    } else {
      const playerOne = playersPlaying[0];
      const player2Mark = (playerOne.marker === "X") ? marker : "X";
      const aiTurn = !playerOne.playerTurn;
      const playerTwo = Player(name, player2Mark, aiTurn);
      playersPlaying[1] = playerTwo;
    }
  };

  
  const getPlayers = (index) => {
    return playersPlaying[index];
  };

  
  const getPlayerTurn = () => {
    const player1Turn = playersPlaying[0].playerTurn;
    return (player1Turn) ? playersPlaying[0] : playersPlaying[1];
  };


  const changePlayerTurn = () => {
    playersPlaying[0].playerTurn = !playersPlaying[0].playerTurn;
    playersPlaying[1].playerTurn = !playersPlaying[1].playerTurn;
  };


  const updateGameScore = (marker) => {
    if (playersPlaying[0].marker === marker) playersPlaying[0].gamesWon += 1;
    else playersPlaying[1].gamesWon += 1;
  };
  
  const resetPlayers = () => {
    playersPlaying = {};
  };  

  return { setPlayers, getPlayers, getPlayerTurn, changePlayerTurn, resetPlayers, updateGameScore };
})();


/* Storing the state of tic tac toe board  */
const boardState = (() => {
  
  let totalTurns = 0; // in tic-tac-toe a winner is decided only after 4 moves.

  let boardMarkerArray = []; 

  const resetMarkerArray = (n) => {
    boardMarkerArray = [];
    totalTurns = 0;
    for (let i= 0; i< n; i+= 1) {
      let row = [];
      for (let j= 0; j< n; j+= 1) {
        row.push("");  
      }
      boardMarkerArray.push(row);
    }
  };


  const updateMarkerArray = (rowPos, colPos, marker) => {
    boardMarkerArray[rowPos][colPos] = marker;  
    totalTurns += 1;
  };


  const getMarkerArray = () => {
    return boardMarkerArray;
  }
  

  const getEmptyCells = () => {
    let emptyCells = [];
    let length = boardMarkerArray.length;
    for (let i= 0; i< length; i+= 1) {
      boardMarkerArray[i].forEach((item, index) => {
        (item === "") ? emptyCells.push([i, index]) : null;
      });
    };

    return emptyCells;
  };


  const isArrayMarked = (rowPos, colPos) => {
    return (boardMarkerArray[rowPos][colPos] === "") ? true : false;
    };
  

  const winnerMarker = (playerTotalMarks, marker) => {
    const totalMarksValue = Object.values(playerTotalMarks);
    if (totalMarksValue.includes(3)) {
      resetMarkerArray(3);
      return marker
    } else if (totalTurns === 9) {
      resetMarkerArray(3);
      return "draw";
    } else {
      return null;
    }   
  };  


  const winningMove = (rowPos, colPos, marker) => {
    const totalMarks = { row: 0, col: 0, diag: 0, reverseDiag: 0 };
    if (totalTurns > 4) {
      for (let i= 0; i< 3; i+= 1) {
        if (boardMarkerArray[i][colPos] === marker) totalMarks.row += 1;
            
        if (boardMarkerArray[rowPos][i] === marker) totalMarks.col += 1;

        if (rowPos === colPos) {
          if (boardMarkerArray[i][i] === marker) totalMarks.diag += 1;
        };  

        // 2 = 3 - 1; 3 = boardSize
        if (+rowPos + +colPos === 2 ) { 
          if (boardMarkerArray[i][2 - i] === marker) totalMarks.reverseDiag += 1;  
        };  
      };  
    };
    const win = winnerMarker(totalMarks, marker);
    return win;  
  };

  resetMarkerArray(3);
  return { resetMarkerArray, getMarkerArray, updateMarkerArray, getEmptyCells, isArrayMarked, winningMove };
})();


const gameStats = (() => {

  const displayPlayerMakingMove = () => {
    const { playerToMakeMove } = { ...domElements.stats };
    const player = players.getPlayerTurn();
    playerToMakeMove.textContent = `${player.name} (${player.marker}) turn`;
  };


  const displayPlayerStats = (player1Stats, player2Stats) => {
    const player1 = players.getPlayers(0);
    const player2 = players.getPlayers(1);

    player1Stats.children[0].textContent = `${player1.name} (${player1.marker})`;
    player1Stats.children[1].textContent = `     ${player1.gamesWon}`;

    player2Stats.children[0].textContent = `${player2.name} (${player2.marker})`;
    player2Stats.children[1].textContent = `     ${player2.gamesWon}`;
  }; 

  return { displayPlayerMakingMove, displayPlayerStats };
})();



// ai methods and move finder
const ai = (() => {

  const aiMove = (emptyCells) => {
    const move = parseInt(Math.random() * emptyCells.length);
    return emptyCells[move];
  };


  const aiCellCoordinates = () => {
    const emptyCells = boardState.getEmptyCells();
    return aiMove(emptyCells);
  };

 
  const aiMakeMove = (board) => {
    const aiPlayer = players.getPlayers(1);
    const cellToMark = aiCellCoordinates();
    const boardCells = [...board.children]
    const cell = cellToMark[0].toString() + cellToMark[1].toString();
    const [rowPos, colPos] = [...cellToMark];
    console.log(aiPlayer.marker);
    gameStats.displayPlayerMakingMove();

    boardCells.forEach((item) => {
      if (item.classList[0] === cell) item.textContent = aiPlayer.marker; 
    });

    boardState.updateMarkerArray(cellToMark[0], cellToMark[1], aiPlayer.marker);

    const winningMove = boardState.winningMove(rowPos, colPos, aiPlayer.marker);
    
    if (winningMove === aiPlayer.marker) { 
      players.updateGameScore(aiPlayer.marker);
      boardController.declareWinner(winningMove, aiPlayer, board); 
    } else if (winningMove === "draw") {
      boardController.declareWinner(winningMove, aiPlayer, board);
    }
    
    players.changePlayerTurn();
  };

  return { aiMakeMove }
})();



const boardController = (() => {

  const whichPlayerTurn = () => {
    
    const player =  players.getPlayerTurn();  
    return player;
  };


  const isCellMarked = (rowPos, colPos) => {
    
    return  boardState.isArrayMarked(rowPos, colPos); 
  };

 
  const extractCellCoordinates = (boardCell) => {
    const coordinate = boardCell.classList[0];
    const [rowPos, colPos] = [...coordinate.split("")];
    return { rowPos, colPos };
  };


  const declareWinner = (winner, player, board) => {
    const { winMessageElements } = {...domElements};
    const { winMessageBox } = {...winMessageElements};
    winMessageBox.classList.toggle("hide");
    board.classList.toggle("hide");

    const player1 = players.getPlayers(0);
    const player2 = players.getPlayers(1);

    if (winner === "draw") {
      winMessageBox.children[0].textContent = `This round was draw.`;
    } else {
      winMessageBox.children[0].textContent = `${player.name} has won this round`;;
    }
    
    winMessageBox.children[1].textContent = `${player1.name} won ${player1.gamesWon} rounds`;
    winMessageBox.children[2].textContent = `${player2.name} won ${player2.gamesWon} rounds`;
  };

  
  const actionsAfterValidMove = (rowPos, colPos, boardCell, marker) => {
    boardState.updateMarkerArray(rowPos, colPos, marker);
    boardCell.textContent = marker;
    const winningMove = boardState.winningMove(rowPos, colPos, marker);
    if (winningMove === "X" || winningMove === "O") {
      players.updateGameScore(winningMove);
      return winningMove;
    };

    return winningMove;
  };


  const makeMove = () => {
    let boardCell = event.target;     
    const { rowPos, colPos } = extractCellCoordinates(boardCell);
    const player = whichPlayerTurn();
    const isNotMarked = isCellMarked(rowPos, colPos);
  
    gameStats.displayPlayerMakingMove();

    if (isNotMarked) {
      const winner = actionsAfterValidMove(rowPos, colPos, boardCell, player.marker);
      console.log({winner});
      if (winner == "draw" || winner === player.marker) {
        players.changePlayerTurn();
        declareWinner(winner, player, boardCell.parentNode);
      }
      
      players.changePlayerTurn();
      
      if (winner === null) {
        if (players.getPlayers(1).name === "bot") ai.aiMakeMove(boardCell.parentNode);
      };
    };
  };

  
  return { makeMove, declareWinner };
})();


const domInteractions = (() => {
  
  const { board, player1, player2, stats, reset, winMessageElements } = { ...domElements };
  const { winMessageBox, playAgainBtn, noPlayAgainBtn } = { ...winMessageElements };

  // player information
  const { player1DetailsForm, player1FormSubmit, player1Name, player1Mark, player1Turn } = { ...player1 };
  const { player2Info, player2HumanBtn, player2BotBtn, player2Form, player2Name, player2NameSubmit, choseAiOrHuman } = { ...player2 };

  // display tic tac toe board
  const toggleBoard = () => {
    player2Info.classList.toggle("hide");
    board.classList.toggle("hide");
    stats.gameStats.classList.toggle("hide");  
    reset.resetGame.classList.toggle("hide");
    gameStats.displayPlayerStats(stats.player1Stats, stats.player2Stats);
    gameStats.displayPlayerMakingMove();
  }

  
  const resetBoard = () => {
    cells.forEach((cell) => cell.textContent = "");
  }

  // listeners to toggle player forms and get their info
  player2BotBtn.addEventListener("click", () => {
    players.setPlayers(name="bot");
    const isAiTurn = players.getPlayerTurn();
    if (isAiTurn.name === "bot") ai.aiMakeMove(board);
    toggleBoard();
  });

  player2HumanBtn.addEventListener("click", () => {
    player2Form.classList.toggle("hide");
    choseAiOrHuman.classList.toggle("hide");
  });

  player2NameSubmit.addEventListener("click", () => {
    const name = player2Name.value;
    players.setPlayers(name);
    toggleBoard();
  }); 
  
  player1FormSubmit.addEventListener("click", () => {
    player1DetailsForm.classList.toggle("hide");
    player2Info.classList.toggle("hide");
    const name = player1Name.value;
    const mark = player1Mark.value;
    const turn = player1Turn.value;
    const turnTrue = (turn === "no") ? false : true;
    
    players.setPlayers(name, mark, turnTrue);    
    gameStats.displayPlayerMakingMove();
  });

  reset.resetGameBtn.addEventListener("click", () => {
    board.classList.toggle("hide");
    player1DetailsForm.classList.toggle("hide");
    stats.gameStats.classList.toggle("hide");
    reset.resetGame.classList.toggle("hide");
    players.resetPlayers();
    boardState.resetMarkerArray(3);
    resetBoard();
  });

  
  // Once a player has won, play the game again or close the game  
  playAgainBtn.addEventListener("click", () => {
    winMessageBox.classList.toggle("hide");
    board.classList.toggle("hide");
    resetBoard();
    boardState.resetMarkerArray(3);
  });

  // tic tac toe board cell
  const cells = [...board.children];
  cells.forEach((cell) => cell.addEventListener("click", () => {
    boardController.makeMove();    
  }));
})();

