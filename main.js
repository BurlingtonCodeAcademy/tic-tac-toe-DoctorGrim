let player = {
  player1: {
    name: "player1",
    letter: "X",
    winVal: 1 //when the abs(sum) of a row/col or diagonal is 3 the win condition is triggered
  },
  player2: {
    name: "player2",
    letter: "O",
    winVal: -1
  },
  curentPlayer: "player1",
  nextPlayer: "player2"
};

let start = document.getElementById("start1Player");
let AIstart = document.getElementById("AIstart");
let status = document.getElementById("turnIdentifier");
let cells = document.getElementsByClassName("cell");
let timer = document.getElementById("timer");
let time = 0;

AIstart.addEventListener("click", () => {
  player.AI = true;
  time = 0;
  startGame();
});

start.addEventListener("click", () => {
  time = 0;
  startGame();
});

setInterval(gameTimer, 1000);
function gameTimer() {
  time += 1;
  document.getElementById("timer").innerHTML = time;
}

function startGame() {
  //resets the game
  start.disabled = true;
  start.hidden = true;
  AIstart.hidden = true;
  AIstart.disabled = true;
  status.hidden = false;
  timer.hidden = false;
  player.curentPlayer = "player1";
  player.nextPlayer = "player2";
  player.player1.name = document.getElementById("player1Name").value;
  player.player2.name = document.getElementById("player2Name").value;
  status.innerHTML = player[player.curentPlayer].name + "'s turn";
  for (let cell of cells) {
    cell.onclick = () => turn(cell); //onClick better than EventListener in this case as i only want one event
    cell.ticTacToe = 0;
    cell.innerHTML = "";
  }
}

function resetGame(){ //TODO is there a better way? looks fugly
  start.disabled = false;
  AIstart.disabled = false;
  start.hidden = false;
  AIstart.hidden = false;
  status.hidden = true;
  timer.hidden = true;
  player.AI = false;
}

function switchPlayer() {
  [player.curentPlayer, player.nextPlayer] = [
    player.nextPlayer,
    player.curentPlayer
  ];
}

function turn(cell) {
  if (cell.innerHTML == "") {
    cell.innerHTML = player[player.curentPlayer].letter;
    cell.ticTacToe = player[player.curentPlayer].winVal;
    checkWin();
    switchPlayer();
    status.innerHTML = player[player.curentPlayer].name + "'s turn";
    if (player.AI == true) {
      let played = false;
      let count = 0;
      while (played == false && count < 50) {
        count += 1;
        let atempt = Math.floor(Math.random() * 9);
        if (cells[atempt].innerHTML == "") {
          cells[atempt].innerHTML = player[player.curentPlayer].letter;
          cells[atempt].ticTacToe = player[player.curentPlayer].winVal;
          checkWin();
          switchPlayer();
          played = true;
          status.innerHTML = player[player.curentPlayer].name + "'s turn";
        }
      }
    }
  } else if (cell.innerHTML == "X" || cell.innerHTML == "O") {
    alert("you can't go there");
  }
}

function checkWin() {
  let winArr = [];
  Object.keys(cells).forEach(cell => winArr.push(cells[cell].ticTacToe));
  let ticTacToe = [winArr.slice(0, 3), winArr.slice(3, 6), winArr.slice(6, 9)]; //converts the values in the array into a tic tac toe board
  let sum = (total, newValue) => total + newValue;
  let rowSum = ticTacToe.map(row => row.reduce(sum)); //maps the sum of each row if one is 3 then there is abs(3) then there are 3 X's or O's
  let colSum = ticTacToe.reduce((total, newRow) =>
    total.map((cellValue, index) => cellValue + newRow[index])
  );
  let rowColSum = rowSum.concat(colSum);

  let leftDiagnal = 0,
    rightDiagnal = 0;
  for (let row = 0; row < ticTacToe.length; row++) {
    leftDiagnal += ticTacToe[row][row];          //tree rows takes arr[0][0] arr[1][1] and arr[2][2] can expand into 4x4 tic tac toe
    rightDiagnal += ticTacToe[row][ticTacToe.length - row - 1];
  }
  rowColSum.push(leftDiagnal);
  rowColSum.push(rightDiagnal);
  let win = rowColSum.find(three => three == 3 || three == -3);
  if (win) {
    Object.keys(cells).forEach(cell => {
      if (cells[cell].ticTacToe == player[player.curentPlayer].winVal) { //TODO explodes all wining players cells, improve to only explode wining three
        cells[cell].innerHTML =
          '<img src="media/explosions-transparent-pixelated-2.gif" class="explosion"></img>';
        var explosion = new Audio("media/SFX_Explosion_14.wav");
        explosion.play();
      }
    });
    resetGame();
    alert(player[player.curentPlayer].name+" win's!");
  } else if (!winArr.includes(0)) {
    resetGame();
    alert("Tie!");
  }
}