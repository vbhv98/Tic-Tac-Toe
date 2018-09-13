let tiles
let state
let game
let visible
let HUMAN
let COMPUTER
let HUMVAL
let COMVAL
let currentPlayer
let winMatrix
let difficulty

function init() {
	tiles = document.getElementsByClassName("block");
	state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	game = true;
	visible = false;
	HUMAN = false;
	COMPUTER = true;
	HUMVAL = -1;
	COMVAL = 1;
	currentPlayer = HUMAN;
	winMatrix = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
	difficulty = document.querySelector('#difficulty-selector').value
}
function reset() {
	for (let x = 0; x < 9; x++) {
		tiles[x].style.background = "#fff";
		tiles[x].innerHTML = "";
		state[x] = 0;
	}
	game = true;
	document.getElementById("r").innerHTML = "Match Result : NULL";
	init()
}

function claim(clicked) {
	if (!game)
		return;
	for (let x = 0; x < 9; x++) {
		if (tiles[x] == clicked && state[x] == 0) {
			set(x, currentPlayer);
			aiturn(state, 0, currentPlayer, true);
		}
	}
	console.log(difficulty)
}
function set(index, player) {
	if (!game)
		return;
	if (state[index] == 0) {
		tiles[index].style.background = player == HUMAN ? "#33a" : "#a33";
		state[index] = player == HUMAN ? HUMVAL : COMVAL;
		currentPlayer = !currentPlayer;
		aiturn(state, 0, currentPlayer, false);
		if (checkWin(state, player) || checkFull(state)) {
			for (let x = 0; x < 9; x++)
				tiles[x].innerHTML = "";
			game = false;
			isGame();
		}
	}
}
function checkWin(board, player) {
	let value = player == HUMAN ? HUMVAL : COMVAL;
	for (let x = 0; x < 8; x++) {
		let win = true;
		for (let y = 0; y < 3; y++) {
			if (board[winMatrix[x][y]] != value) {
				win = false; break;
			}
		}
		if (win)
			return true;
	}
	return false;
}
function checkFull(board) {
	for (let x = 0; x < 9; x++)
		if (board[x] == 0)
			return false;
	return true;
}
function aiturn(board, depth, player, turn) {
	if (depth >= difficulty) return 0;
	if (checkWin(board, !player))
		return -10 + depth;
	if (checkFull(board))
		return 0;
	let value = player == HUMAN ? HUMVAL : COMVAL;
	let max = -Infinity;
	let index = 0;
	for (let x = 0; x < 9; x++) {
		if (depth == 0) {
			tiles[x].innerHTML = "";
		}
		if (board[x] == 0) {
			let newboard = board.slice();
			newboard[x] = value;
			let moveval = -aiturn(newboard, depth + 1, !player, false);
			if (depth == 0)
				tiles[x].innerHTML = moveval;
			if (moveval > max) {
				max = moveval;
				index = x;
			}
		}
	}
	if (turn) {
		set(index, player);
	}

	return max;
}
function isGame() {
	if (!game) {

		let result;
		if (checkWin(state, !HUMAN)) {
			result = "won by computer.";
		} else if (checkWin(state, HUMAN)) {
			result = "won by You.";
		} else {
			result = "Draw.";
		}
		//alert("Match is "+result);
		document.getElementById("r").innerHTML = "Match is " + result;
	}
}

init()
document.querySelector('#difficulty-selector').addEventListener('click', (e) => {
	difficulty = e.target.value
})