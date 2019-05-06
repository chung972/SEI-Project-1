/*----- constants -----*/
const PLAYERS = {
    "1": "black",       // black moves first
    "-1": "white",
    "0": "#065241"      // set empty squares to color of background
};

/*----- app's state (variables) -----*/
var board, tempBoard, winner, turn;
// we always want to have a handle on our game board (array), whether or
// not there's a winner, and which player's turn it is; see methods below for more

// no need to have actual vars holding each player's chip count because we can compute it


/**
 *   TODO need a boolean var to track whether a move is legal? would need
     an accompanying function; would we need to keep it global if it 
     would only live in handleClick? maybe need an entirely new function
     handleHover? might be easier just to set borderstyle based on whether or not
     PLAYERS[content] === 0 (plus other conditions)
     in fact, it's looking more and more likely that we WILL need a separate eventListener
     (it's called mouseENTER not hover; hover is css); when you ENTER, check if that move is
     legal depending on CURRENT turn

     maybe need to make checkCol/Row/Fwd-BckDiags more general? maybe just return true?, then
     depending on that we can perform whatever action. i say this so we can stay DRY; 
     well you wouldn't be able to click at all in the first place if a move was illegal
     when you CLICK (which, again, can ONLY HAPPEN if a move is LEGAL), you are firstly,
     setting that div/tile to hold a value of the CURRENT TURN; you are also calling on render
     to reflect that update in the app state; the click should then call on a function to convert
     whatever 

     OH BITCH. LISTEN. so. we have a board array, right? and we have a handle on that fucker.
     so. just have an array holding other arrays? or maybe just the coordinates? when we call on 
     checkCol/Row/Diags, we will KNOW what turn value the tiles we iterate through will have.
     so while we're iterating through them, store the enemy chips while we search for one of our own
     (you get what i'm saying. until we find another of the current turn's player's color)
     and so, depending on whether certain conditions are met, we can simply update the BOARD VAR ITSELF;
     that is, change the values at whichever positions we were holding in that array; then call render on that
     bitch. qed? remember, RENDER() IS RESPONSIBLE FOR ALL(?) FRONT END SHIT. WE DON'T NEED A SPECIFIC RENDER
     FUCNTION FOR CONVERTING TILES. we WILL, however, need a specific function to change the app state of the 
     board var (converting them, that is)
     


     you necessarily have to ENTER the div you're about to click in order to click it. so
     on mouseENTER, you'll be calling on isLegal(), this will check whether there is an aligning tile on
     the vert/horiz/diag axes  
     have the 

     maybe, while you're storing the positions of the enemy tiles while you're checking for your own,
     store the positions of the enemy tiles with the same naming convention as their div counterpart ids,
     that is, like c(col#)r(row#), that way, we can use these two lines to parse them back after we've stored
     them. 
        const colIdx = parseInt(tile.id.charAt(1));
        const rowIdx = parseInt(tile.id.charAt(3));
    we JUST learned about an iterator that might help us here (would also help with the current js challenge);
    something that ONLY adds properties (and updates existing ones)

    maybe it's too ambitious to have a check function search BOTH directions. might need checkLeft, checkRight, checkUp,
    checkDown, etc. 

    so getting back to it, as soon as you enter a div, you immediately call on all the check functions. as you're checking
    you are storing the positions of enemy tiles in c#r# convention (so you can unpack later; remember to store as STRINg).
    once you actually CLICK, call a separate function to CONVERT enemy tiles into your own (in the board var); we already
    call render() in handleClick, so don't worry about that. 

    looking more and more like we're going to need a global array variable to store (.push) the coordinates of potentially
    convertible enemy chips. actually, maybe we could recreate an entire board and call it tempBoard. have the same values
    as the initial board, but whenever you call check, maybe convert along the way, and keep track of a potentially ready-to-go
    converted board that all you would need to do is render(). 

    so as you're CHECKING, conver the tempBoard as you're iterating through, changing their content (turn) based on their
    current turn value. maybe something like if(board[colIdx][rowidx] === turn*-1) [colIdx][rowIdx] = turn*-1
    in words, that jsut means, if the current nested index is OPPOSITE your color, make that tile YOUR COLOR

    need to be able to handle while iterating
    IF it's yoru tile, return   also check here if there are enemy tiles between mouseEnter div and this other yourTile
        if yes, return the tempBoard that holds those potential converted enemy tiles
        if NO, then return regular var board
    IF it's enemy tile, convert on tempBoard
    IF it's empty, return legal


    maybe have a scores OBJECT with the same keys as PLAYERS
    that way when you iterate through, if you DO happen to


    LATEST COMMENTS [1526]

    recursion STOPS once you return a value
    when you call on check, it is built in with inc/decrement
    e.g.  - 
    checkDown(colIdx, rowIdx) {
        do something
        checkDown(colIdx, --rowIdx)
            for checkDOWN, we DECREMENT rowIdx here because of how the board is generated (since it builds from index of 0 to max)
            and colIdx stays the same, obviously
    }

    if board[colIdx][--rowIdx] === YOUR TURN, checkLegal()
    if board[colIdx][--rowIdx] === ENEMY TURN, turn *= -1, check(--colIdx, rowIdx)  <--(we'll still use checkDown for this example)
    if board[colIdx][--rowIdx] === 0 OR out of bounds, just return; you've already handled the other cases
        maybe just do } else { return } (since outside of the case that the tile is yours or the enemy, you're just going to return)

    create a convert() function that will swap the values of board and tempBoard

    going to need a checkLegal() function. should accept CURRENT colIdx and rowIdx

    again, using the checkDown() example, we would have something like this:
        checkDown(colIdx, rowIdx) {
            // check down will always look BELOW its current position; it WILL NOT EVALUATE the current position
            if(board[colIdx][--rowIdx] === PLAYERS[turn]){    means if it is your chip
                if(checkLegal(colIdx, rowIdx)){
                    return tempBoard;
                } else{
                    return board;
                }
            } else if (board[colIdx][--rowIdx] === PLAYERS[turn*-1]){     means if it is an ENEMY chip
                tempBoard[colIdx][--rowIdx] *= -1;
                checkDown(colIdx, --rowIdx);
            } else{
                return;
            }
        }
             
        function checkLegal(colIdx, rowIdx){
            return (board[++colIdx][rowIdx] !== board[colIdx][rowIdx]);
                this just means that if the turn (aka PLAYER) ABOVE the current tile is DIFFERENT (!==), then return true
                if they are the SAME return false - meaning you're trying to place a chip right next to your own 
        }

    
        i think you're going to have to end up doing check every cardinal direction as have isLegal() methods for each direction as well
 *  */



/*----- cached element references -----*/
// this'll be where we want to reference a html element to reflect a player's score/current number of chips

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


function checkDown(colIdx, rowIdx) {
    console.log(`CURRENT tile is: board[${colIdx}][${rowIdx}]`);
    console.log(`the value of the tile BELOW (c[${colIdx}]r[${--rowIdx}])is: ${board[colIdx][rowIdx]}`);
    //note how after we PREfix (--rowIdx), we can just call board[cIdx][rIdx] and we get the correct value of turn
    rowIdx++; // compensating for console.log above; 
    // just as a rule of thumb, make sure to compensate after inc/decrementing in a template literal
    console.log(`value of rowIdx w/compensation: ${rowIdx}`);

    if (board[colIdx][--rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        if (checkDownLegal(colIdx, rowIdx)) {   // because we decremented in the if statement above, don't need to dec again
            console.log(`checkDownLegal returned ${checkDownLegal(colIdx, rowIdx)}`);
            return tempBoard;
        } else {
            console.log(`checkDownLegal returned ${checkDownLegal(colIdx, rowIdx)}`);
            return board;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        // since that first IF didn't return true, we skip that block, then we go to the next, HOWEVER, since we DID run
        // the if statement, the value of rowIdx will remain decremented; that's why we don't have to dec it again here
        // also, we don't have to worry about running into the same inc/dec issue with turn because we haven't re-assigned it
        // to anything (which would require an '=')
        console.log(`in else if; board[${colIdx}][${rowIdx}] === ${turn} is ${board[colIdx][rowIdx] === turn}`);
        tempBoard[colIdx][rowIdx] = turn;
        // by the fact that we're at this line of code means that the (else) if condition above is true; therefore, the
        // turn value of the CURRENT tile is the opposite of the turn (i.e. this tile belongs to the opponent); now we
        // set the tempBoard at this nested index to hold the converted tile value 
        // console.log(`board: ${board}; tempBoard ${tempBoard}`);
        checkDown(colIdx, rowIdx);
    } else {
        console.log("do nothing");
        return;
    }

}

function checkDownLegal(colIdx, rowIdx) {
    // console.log(`passed in pos - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    // console.log(`checking - board[${colIdx}][${++rowIdx}]: ${board[colIdx][rowIdx]}`);
    // rowIdx--; // compensating for console.log above; 
    // console.log(`value of rowIdx w/compensation: ${rowIdx}`);
    return (board[colIdx][rowIdx] !== board[colIdx][--rowIdx] && (board[colIdx][rowIdx]!==0) && (rowIdx < board[colIdx].length));
}

function checkUp(colIdx, rowIdx) {
    console.log(`CURRENT tile is: board[${colIdx}][${rowIdx}]`);
    console.log(`the value of the tile ABOVE (c[${colIdx}]r[${++rowIdx}])is: ${board[colIdx][rowIdx]}`);
    rowIdx--; // compensating for console.log above; 
    console.log(`value of rowIdx w/compensation: ${rowIdx}`);

    if (board[colIdx][++rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        if (checkUpLegal(colIdx, rowIdx)) {
            console.log(`checkUpLegal returned ${checkUpLegal(colIdx, rowIdx)}`);
            return tempBoard;
        } else {
            console.log(`checkUpLegal returned ${checkUpLegal(colIdx, rowIdx)}`);
            return board;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        console.log(`in else if; board[${colIdx}][${rowIdx}] === ${turn} is ${board[colIdx][rowIdx] === turn}`);
        tempBoard[colIdx][rowIdx] = turn;
        // console.log(`board: ${board}; tempBoard ${tempBoard}`);
        checkUp(colIdx, rowIdx);
    } else {
        console.log("do nothing");
        return;
    }

}

function checkUpLegal(colIdx, rowIdx) {
    return (board[colIdx][rowIdx] !== board[colIdx][++rowIdx] && (board[colIdx][rowIdx]!==0) && (rowIdx < board[colIdx].length));
    // so long as the value of turn for the tile ABOVE you is NOT the same AND is NOT 0, AND is within the bounds
}


function init() {
    board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, -1, 0, 0, 0],      // the 4 indices in the center are
        [0, 0, 0, -1, 1, 0, 0, 0],      // the starting positions every game
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    tempBoard = board;
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

            /** FOR CSS STYLING PURPOSES
             *      consider wrapping each div with another div, that way we can create an actual grid
             *      have the outer/wrapper div display a border; and we won't have to worry about trying
             *      to access the tile pieces because we have ids (that's how powerful they are)
             */

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
    if ((board[colIdx][rowIdx]) || winner) return;
    // handles cases where there is an existing value in a tile or if winner is found
    // (i.e. winner === true); line taken from tictactoe code along w/Daniel
   
    console.log(`checkDownLegal(colIdx,rowIdx): ${checkDownLegal(colIdx,rowIdx)}
    \ncheckUpLegal(colIdx,rowIdx): ${checkUpLegal(colIdx,rowIdx)}`);

    if(checkDownLegal(colIdx,rowIdx)||checkUpLegal(colIdx,rowIdx)){
        board[colIdx][rowIdx] = turn;
        turn *= -1; // necessarily need this here, because so long as the player hasn't clicked, it is STILL that player's turn
    } 
    // this if statement above will need to include the checkLegals for all directions; also, we want to use
    // the OR gates because so long as ONE of checks are legal, we can let the user click there
    // TODO worry about changing the border to dashed and hover/mouseEnter logic
    console.log(`board[${colIdx}][${rowIdx}]'s value (turn) is now: ${turn}`)
    // set the nested index to be whichever player's turn it is 
    if (checkDownLegal(colIdx, rowIdx)) checkDown(colIdx, rowIdx);
    if (checkUpLegal(colIdx, rowIdx)) checkUp(colIdx, rowIdx);



    // hands the turn back over to the other player; look at init() for initial turn value

    render();
    // calls render() to have the front-end reflect the newly updated app state

}