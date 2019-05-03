/*----- constants -----*/
const PLAYERS = {
    "1": "black",       // black moves first
    "-1": "white",
    "0": "#065241"      // set empty squares to color of background
};

/*----- app's state (variables) -----*/
var board, winner, turn;   
// we always want to have a handle on our game board (array), whether or
// not there's a winner, and which player's turn it is; see methods below for more

/*----- cached element references -----*/

/*----- event listeners -----*/
document.getElementById("board").addEventListener('click', handleClick);
document.querySelector("button").addEventListener('click', init);


/*----- functions -----*/
init(); // call the init function so the game starts upon loading

function init() {
    board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, -1, 1, 0, 0, 0],      // the 4 indices in the center are
        [0, 0, 0, 1, -1, 0, 0, 0],      // the starting positions every game
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    winner = null;
    turn = 1;
    render();
}

function render() {
    board.forEach(function (colArr, colIdx) {
        colArr.forEach(function (content, rowIdx) {
            const div = document.getElementById(`c${colIdx}r${rowIdx}`);
            div.style.backgroundColor = PLAYERS[content];
        });
    });
}

function handleClick(evt) {

    const tile = evt.target;
    const colIdx = parseInt(tile.id.charAt(1));
    const rowIdx = parseInt(tile.id.charAt(3));
    console.log(`colIdx: ${colIdx} rowIdx: ${rowIdx}`);
    if (isNaN(colIdx)) return;
    if((board[colIdx][rowIdx])||winner) return;
    board[colIdx][rowIdx] = turn;
    turn *= -1;
    render();
}