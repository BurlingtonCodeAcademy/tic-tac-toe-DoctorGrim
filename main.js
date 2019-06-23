// click start and grey out button
let start = document.getElementById("start");
let status = document.getElementById("turnIdentifier");
let cells = document.getElementsByClassName("cell");
console.log(cells);

let player = {
  player1: {
    name: "player1",
    letter: "X",
    winVal: 1
  },
  player2: {
    name: "player2",
    letter: "O",
    winVal: -1
  },
  curentPlayer: "player1",
  nextPlayer: "player2"
};

start.addEventListener("click", () => {
  start.disabled = true;
  start.hidden = true;
  status.hidden = false;
  status.innerHTML = "Player X's turn";
  for (let cell of cells) {
    cell.onclick = () => turn(cell); //onclick better than EventListener in this case as i only want one event
    cell.ticTacToe = 0;
    cell.innerHTML="";
    console.log(cell)
  }
});

function turn(cell) {
  if (cell.innerHTML == "") {
    cell.innerHTML = player[player.curentPlayer].letter;
    cell.ticTacToe = player[player.curentPlayer].winVal;
    checkWin();
    [player.curentPlayer, player.nextPlayer] = [
      player.nextPlayer,
      player.curentPlayer
    ];
  } else if (cell.innerHTML == "X" || cell.innerHTML=="O"){
    alert("you can't go there");
  }
}

function checkWin() {
  let winArr = [];
  Object.keys(cells).forEach(cell => winArr.push(cells[cell].ticTacToe));

  let ticTacToe = [winArr.slice(0, 3), winArr.slice(3, 6), winArr.slice(6, 9)];

  let sum = (total, newValue) => total + newValue;

  let rowSum = ticTacToe.map(row => row.reduce(sum)); //maps the sum of each row

  let colSum = ticTacToe.reduce((total, newRow) =>
    total.map((cellValue, index) => cellValue + newRow[index])
  );

  let rowColSum = rowSum.concat(colSum);

  let leftDiagnal = 0,
    rightDiagnal = 0;
  for (let row = 0; row < ticTacToe.length; row++) {
    leftDiagnal += ticTacToe[row][row];
    rightDiagnal += ticTacToe[row][ticTacToe.length - row - 1];
  }
  rowColSum.push(leftDiagnal);
  rowColSum.push(rightDiagnal);

  let win = rowColSum.find(three => three == 3 || three == -3);
  if (win) {
    alert(player.curentPlayer + " you win!");
    Object.keys(cells).forEach(cell => {
      if (cells[cell].ticTacToe == player[player.curentPlayer].winVal) {
        cells[cell].innerHTML =
          '<img src="media/explosions-transparent-pixelated-2.gif" class="explosion"></img>';
        start.disabled = false;
        start.hidden = false;
        status.hidden = true;
      }
    });
  }
}
