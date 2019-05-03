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

// TODO need variables that will hold/count each player's chips
//      maybe just use a nested forEach combined with .includes(turn)?

/*----- cached element references -----*/

/*----- event listeners -----*/
document.getElementById("board").addEventListener('click', handleClick);
// take advantage of event delegation; have the parent for all the div (tile) elements
// listen for mouse clicks
document.querySelector("button").addEventListener('click', init);
// added a listener for our reset button; calls init on press; very elegant solution;
// idea taken from tictactoe code-along w/Daniel

// TODO maybe create a button or some other element that will popup (alert) user with 
//      instructions? great idea taken from Yolie


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
    winner = false;  // set winner to false at the beginning of the game
    turn = 1;   // black moves first, so turn is set to 1; look at PLAYERS{} for more info
    render();   // call render to have the front-end reflect app state
}

function render() {
    // since our board is a nested array, we use nested forEach iterators
    board.forEach(function (colArr, colIdx) {
        colArr.forEach(function (content, rowIdx) {
            const div = document.getElementById(`c${colIdx}r${rowIdx}`);
            // use template literal notation to procedurely set the background
            // color of each div element that represents a tile/chip
            div.style.backgroundColor = PLAYERS[content];
            // use square bracket notation because input can vary; 
            // note that the VALUE of PLAYERS[content] will depend on
            // the KEY that is passed in (the actual 'content' arg); 
            // refer to const PLAYERS objecgt above for more
        });
    });

    // TODO need to render chip stack OR just render the score
    // TODO will need an element to declare who the winner is or if there's a tie
    //      consider just using the ample space in colL or colR?
}

function handleClick(evt) {
    const tile = evt.target;    
    // create a function scoped constant on the element that fired the event
    const colIdx = parseInt(tile.id.charAt(1));
    const rowIdx = parseInt(tile.id.charAt(3));
    // because of the naming convention for the id's of each div html element
    // representing a space on the board (c'col#'r'row#'), we can specifically
    // target them with hardcoded indices; note that this is NOT ROBUST
    // console.log(`colIdx: ${colIdx} rowIdx: ${rowIdx}`);
    if (isNaN(colIdx)) return;  
    // handles cases where users click inbetween divs
    if((board[colIdx][rowIdx])||winner) return; 
    // handles cases where there is an existing value in a tile or if winner is found
    // (i.e. winner === true); line taken from tictactoe code along w/Daniel
    board[colIdx][rowIdx] = turn;
    // set the nested index to be whichever player's turn it is 
    turn *= -1;
    // hands the turn back over to the other player; look at init() for initial turn value
    render();
    // calls render() to have the front-end reflect the newly updated app state
}