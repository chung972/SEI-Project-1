/*----- constants -----*/
const PLAYERS = {
    "1": { "color": "black", "forfeitStatus": false },       // black moves first
    "-1": { "color": "white", "forfeitStatus": false },
    "0": { "color": "#065241" }      // set empty squares to color of background
};

/*----- app's state (variables) -----*/
var board, winner, turn, blackChipCount, whiteChipCount, zeroCount, globalCol, globalRow;
// we always want to have a handle on our game board (array), whether or
// not there's a winner, and which player's turn it is; see methods below for more

/*----- cached element references -----*/
// this'll be where we want to reference a html element to reflect a player's score/current number of chips
const p1Score = document.getElementById("p1Score");
const p2Score = document.getElementById("p2Score");
const p1Turn = document.querySelector("#colL p.status");
const p2Turn = document.querySelector("#colR p.status");
const winBanner = document.getElementById("banner");

/*----- event listeners -----*/
document.getElementById("board").addEventListener('click', handleClick);
// take advantage of event delegation; have the parent for all the div (tile) elements
// listen for mouse clicks
document.getElementById("reset").addEventListener('click', init);
// added a listener for our reset button; calls init on press; very elegant solution;
// idea taken from tictactoe code-along w/Daniel
document.getElementById("rules").addEventListener('click', function () {
    alert(`The Rules:
    1. Black has the first move
    2. To make a LEGAL move, you MUST capture an enemy piece 
        (will also be referred to as chip)
    3. To CAPTURE an enemy piece, you must place your OWN 
        chip between an ENEMY chip and ANOTHER of YOUR chips;
        this can be done in any direction: N, NE, E, SE, S, SW, W, NW;
        a single placement can also capture in multiple directions 
        concurrently;
        capturing an enemy chip will CONVERT that piece to the 
        captor's color
    4. As long as you are UNABLE to make a LEGAL MOVE (i.e. 
        capture an enemy chip), your turn will be **FORFEITED**
    5. If BOTH players are unable to make a legal move, then the 
        game ends
    6. If there are no empty tiles, the game also ends
    7. The winner is determined by whichever player has the most 
        chips at the end of the game`);
});

/*----- functions -----*/
init(); // call the init function so the game starts upon loading

// CHECK functions below
// all CHECK functions share similar code with the obvious caveat being the offset that each direction demands;
// e.g. checkUp will leave the colIdx alone, but will INCREMENT the rowIdx value

// NOTE THAT CHECKUP() IS INTENTIONALLY KEPT VERBOSE SO THAT READERS CAN FOLLOW THE THOUGHT PROCESS; ALL OTHER CHECK
// FUNCTIONS ARE TRIMMED DOWN

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

    winner = false;  // set winner to false at the beginning of the game
    turn = 1;   // black moves first, so turn is set to 1; look at PLAYERS{} for more info
    globalCol = null;
    globalRow = null;
    resetGlobalIdx();
    winBanner.style.visibility = "hidden";
    countChips();

    board.forEach(function (colArr, colIdx) {
        colArr.forEach(function (content, rowIdx) {
            const div = document.getElementById(`c${colIdx}r${rowIdx}`);
            div.addEventListener('mouseenter', handleEnter);
            div.addEventListener('mouseleave', handleLeave);
        });
    });
    // because mouseENTER/LEAVE doesn't bubble, we have to addEventListners to each div
    // can read more here: https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event

    render();   // call render to have the front-end reflect app state
}

function handleEnter(evt) {
    const div = evt.target;
    div.style.border = `5px solid ${PLAYERS[turn].color}`;
}

function handleLeave(evt) {
    const div = evt.target;
    div.style.border = `5px solid gray`;
}

function render() {
    // since our board is a nested array, we use nested forEach iterators
    board.forEach(function (colArr, colIdx) {
        colArr.forEach(function (content, rowIdx) {
            const div = document.getElementById(`c${colIdx}r${rowIdx}`);
            // use template literal notation to procedurely set the background
            // color of each div element that represents a tile/chip
            div.style.backgroundColor = PLAYERS[content].color;
            // use square bracket notation because input can vary; 
            // note that the VALUE of PLAYERS[content] will depend on
            // the KEY that is passed in (the actual 'content' arg); 
            // refer to const PLAYERS objecgt above for more
        });
    });
    changeTurnBorder();
}

function changeTurnBorder(){
    (turn === 1) ? p1Turn.style.borderColor = "white" : p1Turn.style.borderColor = "black";
    (turn === -1) ? p2Turn.style.borderColor = "black" : p2Turn.style.borderColor = "white";
}

function setGlobals(colIdx, rowIdx) {
    globalCol = colIdx;
    globalRow = rowIdx;
}

function resetGlobalIdx() {
    globalCol = null;
    globalRow = null;
}

// check functions below

// NOTE: checkUP is INTENTIONALLY VERBOSE so that readers can step through the thought process behind each line
//       the other checkDirection functions are trimmed down
function checkUp(colIdx, rowIdx) {
    if (board[colIdx][++rowIdx] === turn) {
        // check if tile DIRECTLY ABOVE the nested index that was passed in has the SAME TURN VALUE as the current global turn variable
        let bool1 = checkDownLegal(colIdx, rowIdx);
        // if true, then proceed to check if that this is a legal move; note how we are calling checkDOWNLegal here and NOT checkUP;
        // the reasoning for this becomes clear when you consider that this function will recursively call upon itself UNTIL it finds
        // that the tile above shares the same turn value as the global turn variable; once this condition is met, we checkDOWN to make
        // sure that the tile directly BELOW holds a DIFFERENT turn value
        if (bool1) {
            //if the tile below DOES meet this condition (along with a few others; go to checkDown() for more info), then we will assign
            // the globalCol/Row variables to hold the board location; these values are critical for the convert() function
            setGlobals(colIdx, rowIdx);
            return;
        } else {
            // if the tile below does NOT pass checkDownLegal(), we simply break out of the function
            return;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        // if we find that the tile directly above holds a turn value different from the global turn variable, then we recursively call on
        // checkUp, passing in board location of the tile above; note how we do not have to mutate rowIdx, since we PREFIXED it(i.e. ++rowIdx);
        // recall that PREFIXING will return a new value, in this case rowIdx + 1; as opposed to rowIdx++ which would return the original rowIdx value
        checkUp(colIdx, rowIdx);
        // since that first IF didn't return true, we skip that block, which brings us to this else if, HOWEVER, since we DID run
        // the if statement, the value of rowIdx will remain decremented; that's why we don't have to decrement it again here;
        // also, we don't have to worry about running into the same inc/dec issue with turn because we haven't re-assigned it
        // to anything (which would require an '=')
        // by the fact that we're at this line of code means that the else if condition above is true; therefore, the
        // turn value of the CURRENT tile is the opposite of the turn (i.e. this tile belongs to the opponent) and we are safe
        // to recursively call on checkDown();
    } else {
        // this last else statement catches the case where the above tile is empty or out of bounds; if such is the case, simply break out 
        return;
    }
    // TLDR; if a move is legal, then setGlobals
}

function checkDown(colIdx, rowIdx) {
    if ((board[colIdx][--rowIdx] === turn) && (checkUpLegal(colIdx, rowIdx))) {
        setGlobals(colIdx, rowIdx);
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkDown(colIdx, rowIdx);
    }
}

function checkLeft(colIdx, rowIdx) {
    if (--colIdx < 0) return;
    colIdx++;
    if ((board[--colIdx][rowIdx] === turn) && (checkRightLegal(colIdx, rowIdx))) {
        setGlobals(colIdx, rowIdx);
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkLeft(colIdx, rowIdx);
    }
}

function checkRight(colIdx, rowIdx) {
    if (++colIdx === board.length) return;
    colIdx--;
    if ((board[++colIdx][rowIdx] === turn) && (checkLeftLegal(colIdx, rowIdx))) {
        setGlobals(colIdx, rowIdx);
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkRight(colIdx, rowIdx);
    }
}

function checkTopLeft(colIdx, rowIdx) {
    if (--colIdx < 0) return;
    colIdx++;
    if ((board[--colIdx][++rowIdx] === turn) && (checkBotRightLegal(colIdx, rowIdx))) {
        setGlobals(colIdx, rowIdx);
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkTopLeft(colIdx, rowIdx);
    }
}

function checkTopRight(colIdx, rowIdx) {
    if (++colIdx === board.length) return false;
    colIdx--;
    if ((board[++colIdx][++rowIdx] === turn) && (checkBotLeftLegal(colIdx, rowIdx))) {
        setGlobals(colIdx, rowIdx);
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkTopRight(colIdx, rowIdx);
    }
}

function checkBotLeft(colIdx, rowIdx) {
    if (--colIdx < 0) return;
    colIdx++;
    if ((board[--colIdx][--rowIdx] === turn) && (checkTopRightLegal(colIdx, rowIdx))) {
        setGlobals(colIdx, rowIdx);
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkBotLeft(colIdx, rowIdx);
    }
}

function checkBotRight(colIdx, rowIdx) {
    if (++colIdx === board.length) return;
    colIdx--;
    if ((board[++colIdx][--rowIdx] === turn) && (checkTopLeftLegal(colIdx, rowIdx))) {
        setGlobals(colIdx, rowIdx);
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkBotRight(colIdx, rowIdx);
    }
}

// check LEGAL functions below
function checkUpLegal(colIdx, rowIdx) {
    let bool1 = ++rowIdx < board[colIdx].length; // catches cases where the rowIdx checked is higher than the ceiling (index 7);
    // NOTE: the cases where clicking on row 7 is legal will be caught by the checkDownLegal function
    rowIdx--;
    let bool2 = board[colIdx][++rowIdx] === (turn * -1);
    // checks that the chip ABOVE you belongs to the opponent; i.e. should have a DIFFERENT turn value in order to be true
    rowIdx--;
    let bool3 = board[colIdx][++rowIdx] !== 0; // catches cases where the tile DIRECTLY ABOVE (the clicked tile) is blank
    // NOTE: the cases where there is a blank tile directly above will be caught by the checkDownLegal function
    // also, don't have to worry about dec'ing this ++rowIdx because this is the last boolean that uses it for logic
    return bool1 && bool2 && bool3;
    // so long as the value of turn for the tile ABOVE you is NOT the same AND is NOT 0, AND is within the bounds
}

function checkDownLegal(colIdx, rowIdx) {
    let bool1 = --rowIdx > -1;  // catches cases where the rowIdx you are checking is out of bounds (i.e. undefined)
    // also, because there are only 8 (0-7)rows, we won't have to worry about a player clicking on row 9 (index 8)
    // NOTE: the cases where clicking on row 0 is legal will be caught by the checkUpLegal function
    rowIdx++;
    let bool2 = board[colIdx][--rowIdx] === (turn * -1);
    // checks that the chip BELOW you belongs to the opponent; i.e. should have a DIFFERENT turn value in order to be true
    rowIdx++;
    let bool3 = board[colIdx][--rowIdx] !== 0;
    return bool1 && bool2 && bool3;
}

function checkLeftLegal(colIdx, rowIdx) {
    // for all functions that check Left, we add this if statement below to immediately catch if
    // the colIdx is out of bounds; if we do not break out of the function and then attempt to
    // call on said out of bounds index, an error will be thrown  
    if (--colIdx < 0) return false;
    colIdx++;
    let bool1 = --colIdx > -1;
    colIdx++;
    let bool2 = board[--colIdx][rowIdx] === (turn * -1);
    colIdx++;
    let bool3 = board[--colIdx][rowIdx] !== 0;
    return bool1 && bool2 && bool3;
}

function checkRightLegal(colIdx, rowIdx) {
    // similar to the Left checking functions, all Right checking functions also have an if condition
    // that will immediately return and break out of the function if the colIdx is out of bounds
    if (++colIdx === board.length) return false;
    colIdx--;
    let bool1 = ++colIdx < board.length;
    colIdx--;
    let bool2 = board[++colIdx][rowIdx] === (turn * -1);
    colIdx--;
    let bool3 = board[++colIdx][rowIdx] !== 0;
    return bool1 && bool2 && bool3;
}

function checkTopLeftLegal(colIdx, rowIdx) {
    if (--colIdx < 0) return false;
    colIdx++;
    let bool1 = (++rowIdx < board[colIdx].length) && (--colIdx > -1);
    rowIdx--;
    colIdx++;
    let bool2 = board[--colIdx][++rowIdx] === (turn * -1);
    rowIdx--;
    colIdx++;
    let bool3 = board[--colIdx][++rowIdx] !== 0;
    return bool1 && bool2 && bool3;
}

function checkTopRightLegal(colIdx, rowIdx) {
    if (++colIdx === board.length) return false;
    colIdx--;
    let bool1 = (++rowIdx < board[colIdx].length) && (++colIdx < board.length);
    rowIdx--;
    colIdx--;
    let bool2 = board[++colIdx][++rowIdx] === (turn * -1);
    rowIdx--;
    colIdx--;
    let bool3 = board[++colIdx][++rowIdx] !== 0;
    return bool1 && bool2 && bool3;
}

function checkBotLeftLegal(colIdx, rowIdx) {
    if (--colIdx < 0) return false;
    colIdx++;
    let bool1 = (--rowIdx > -1) && (--colIdx > -1);
    rowIdx++;
    colIdx++;
    let bool2 = board[--colIdx][--rowIdx] === (turn * -1);
    rowIdx++;
    colIdx++;
    let bool3 = board[--colIdx][--rowIdx] !== 0;
    return bool1 && bool2 && bool3;
}

function checkBotRightLegal(colIdx, rowIdx) {
    if (++colIdx === board.length) return false;
    colIdx--;
    let withinBounds = (--rowIdx > -1) && (++colIdx < board.length);
    rowIdx++;
    colIdx--;
    let nextChipIsEnemy = board[++colIdx][--rowIdx] === (turn * -1);
    rowIdx++;
    colIdx--;
    let nextChipNotZero = board[++colIdx][--rowIdx] !== 0;
    return withinBounds && nextChipIsEnemy && nextChipNotZero;
}

function convert(sourceColIdx, sourceRowIdx, targetColIdx, targetRowIdx) {
    let colCounter = (Math.sign(sourceColIdx - targetColIdx) === 1) ? -1 : 1;       // CATCH CASE OF 0
    let rowCounter = (Math.sign(sourceRowIdx - targetRowIdx) === 1) ? -1 : 1;
    // ternary operators that will set col/rowCounter to be -1 or 1 depending on the result of Math.sign(); for example, if Math.sign()
    // returns 1, that means that the source index is GREATER than the target index; therefore, we want to be decrementing (or adding
    // a negative)
    let colArr = [];
    let rowArr = [];
    for (let i = 0; i < Math.abs(sourceColIdx - targetColIdx); i++) {
        let tempNo = sourceColIdx + (colCounter * (i + 1));
        colArr.push(tempNo);
    }
    for (let i = 0; i < Math.abs(sourceRowIdx - targetRowIdx); i++) {
        let tempNo = sourceRowIdx + (rowCounter * (i + 1));
        rowArr.push(tempNo);
    }
    // you won't ever have a case where col and row "steps" (think about the diagonal cases) are off by more than one. 
    if (colArr.length === 0) {  // catches cases where only the ROW changes; set the colIdx to be source
        let limit = rowArr.length;
        for (let i = 0; i < limit; i++) {
            let holder = rowArr.pop();
            board[sourceColIdx][holder] = turn;
        }
        resetGlobalIdx();
        // we reset the globalCol/RowIdx variables so that they do not retain anything after convert() is invoked
    } else if (rowArr.length === 0) {   // catches cases where only the COLUMN changes; set the rowIdx to source
        let limit = colArr.length;
        for (let i = 0; i < limit; i++) {
            let holder = colArr.pop();
            board[holder][sourceRowIdx] = turn;
        }
        resetGlobalIdx();
    } else {
        let limit = colArr.length;
        for (let i = 0; i < limit; i++) {
            let holder1 = colArr.pop();
            let holder2 = rowArr.pop();
            board[holder1][holder2] = turn;
        }
        resetGlobalIdx();
    }
}

function handleClick(evt) {
    if((winner === 1)||(winner === -1)) return;
    let ffs = checkForfeit();

    if ((PLAYERS[turn].forfeitStatus === true) && (PLAYERS[turn * -1].forfeitStatus === true)) {
        getWinner(blackChipCount, whiteChipCount);
        // if there are still empty tiles, then check the forfeitStatus property of each player;
        // if they are BOTH set to true, then end the game
    }
    if (ffs) {
        PLAYERS[turn].forfeitStatus = ffs;
        // set the player's forfeitStatus to ffs; if it's true, this if statement is accessed, and
        turn *= -1;
        render();
        return;
        // the turn is handed to the other player
    } else {
        PLAYERS[turn].forfeitStatus = ffs;
        // otherwise, set the forfeitStatus to ffs anyway; this IS important, because w/o this else
        // statement, we'd have no way to change a player's forfeitStatus back to false, causing that
        // player to indefinitely forfeit their turn
    }
    handleClickDo(evt);
    if (zeroCount === 0) getWinner(blackChipCount, whiteChipCount);
    // check if there are any empty tiles left; if there aren't, end the game (i.e. run getWinner())
}

function handleClickDo(evt) {
    const tile = evt.target;
    // create a function scoped constant on the element that fired the event
    const colIdx = parseInt(tile.id.charAt(1));
    const rowIdx = parseInt(tile.id.charAt(3));
    // because of the naming convention for the id's of each div html element
    // representing a space on the board (c'col#'r'row#'), we can specifically
    // target them with hardcoded indices; note that this is NOT ROBUST
    let convertKey = true;
    let booly = checkAll(colIdx, rowIdx, convertKey);
    // checkAll returns true ONLY if AT LEAST one direction (from the click point) is deemed a LEGAL MOVE;
    // see checkAll() for more info
    if (isNaN(colIdx)) return;
    // handles cases where users click inbetween divs
    if (!!(board[colIdx][rowIdx]) || !!(winner)) return;
    // handles cases where there is an existing value in a tile or if winner is truthy
    // line inspired by tictactoe code along w/Daniel
    if (booly) {
        board[colIdx][rowIdx] = turn;
        // assigning the board location to the current turn INSIDE of this if statement makes sure that
        // a player is unable to place his/her chip on an ILLEGAL tile
        turn *= -1;
        // necessarily need this here (inside the if), because so long as the player is unable to click, 
        // it is STILL that player's turn hands the turn back over to the other player; 
        // look at init() for initial turn value
    }
    countChips();
    render();
    // calls render() to have the front-end reflect the newly updated app state
}

function countChips() {
    zeroCount = 0;
    blackChipCount = 0;
    whiteChipCount = 0;
    // because of how dynamic the chip counts can be for either color, we reset them BOTH to 0 before counting
    // them; this is to ensure that we do not count more chips than are present on the board
    board.forEach(function (colArr, colIdx) {
        colArr.forEach(function (content, rowIdx) {
            if (content === 1) {
                ++blackChipCount;
                p1Score.textContent = `${blackChipCount}`;
            } else if (content === -1) {
                ++whiteChipCount;
                p2Score.textContent = `${whiteChipCount}`;
            } else {
                ++zeroCount;
            }
        });
    });
}

function checkAll(colIdx, rowIdx, key) {
    let isLegal = false;
    // function scoped variable; set to true IF a SINGLE one of the nested if statements below is true
    // by default, ASSUME that you all directions from the click point (whose col/row indices are passed in) 
    // are ILLEGAL moves; then, IF you manage to access the codeblock within the nested if statements, we can 
    // change isLegal to be true. you only need to access the inside of ONE nested if statement to turn isLegal true
    // (because we ONLY reassign isLegal inside the nested ifs)

    // first checks to make sure a move is legal (i.e. you are not clicking right next to a blank tile or
    // your own chip); IF that condition is met, then proceed to check through that direction; IF the move
    // is deemed to be legal (look at specific methods for more info), then globalCol/Row will have assigned
    // values; lastly, IF the correct key (typeof boolean) is passed in, then convert() will execute;
    // and the function scoped variable (booly) will be assigned true;

    // it may seem to appear unnecessary to check EACH direction, but it is better to SEPARATE OUR CONCERNS
    // and have SINGLE POINTS OF FAILURE
    if (checkUpLegal(colIdx, rowIdx)) {
        checkUp(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // UP
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            isLegal = true;
            // we can only reach the inside of this nested if statment IF a direction is legal at the location
            // passed in by the parameters
            // also, note the if(key) statement. we pass in a boolean as the third parameter for checkAll()
            // checkAll() is only ever invoked in two methods, checkForfeit() and handleClickDo(); in the case of
            // the former, we ONLY to be checking whether a move would be legal (we DON'T want to make any
            // conversions if a move IS legal); however, the case of the latter, we DO want to convert tiles
            // if our conditions are met
        }
        resetGlobalIdx();
        // it is CRITICAL that we call resetGlobalIdx() within the FIRST of the three nested if statements;
        // because of the nature of forEach(), we are unable to break out of the function until EVERY element
        // has been iterated through; therefore, if a certain direction is able to meet the condition for
        // the THIRD if statement, then globalCol and globalRow will be 
    }
    if (checkDownLegal(colIdx, rowIdx)) {
        checkDown(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // DOWN
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            isLegal = true;
        }
        resetGlobalIdx();
    }
    if (checkLeftLegal(colIdx, rowIdx)) {
        checkLeft(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // LEFT
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            isLegal = true;
        }
        resetGlobalIdx();
    }
    if (checkRightLegal(colIdx, rowIdx)) {
        checkRight(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // RIGHT
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            isLegal = true;
        }
        resetGlobalIdx();
    }
    if (checkTopLeftLegal(colIdx, rowIdx)) {
        checkTopLeft(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // TOP LEFT
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            isLegal = true;
        }
        resetGlobalIdx();
    }
    if (checkTopRightLegal(colIdx, rowIdx)) {
        checkTopRight(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // TOP RIGHT
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            isLegal = true;
        }
        resetGlobalIdx();
    }
    if (checkBotLeftLegal(colIdx, rowIdx)) {
        checkBotLeft(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // BOT LEFT
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            isLegal = true;
        }
        resetGlobalIdx();
    }
    if (checkBotRightLegal(colIdx, rowIdx)) {
        checkBotRight(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // BOT RIGHT
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            isLegal = true;
        }
        resetGlobalIdx();
    }
    return isLegal;
}

function getWinner(blackChips, whiteChips) {
    if (blackChips === whiteChips) {
        // if the number of black and white chips are the SAME, then change css to display "tie game" 
        winBanner.style.visibility = "visible";
        winBanner.textContent = "TIE GAME";
        winBanner.style.color = "#065241";
        winBanner.style.backgroundColor = "rgb(204, 204, 204)";
    } else {
        // otherwise, use square bracket notation (which is super awesome and cool) to take in a variable value
        // and display the colors of whichever player won
        winner = (blackChips > whiteChips) ? 1 : -1;
        winBanner.style.visibility = "visible";
        winBanner.style.color = `${PLAYERS[winner * -1].color}`;
        winBanner.style.backgroundColor = `${PLAYERS[winner].color}`;
    }
}

function checkForfeit() {
    let forfeitKey = false;
    let forfeit = true;
    board.forEach(function (colArr, colIdx) {
        colArr.forEach(function (content, rowIdx) {
            /**
             * so, while iterating through the ENTIRE board, we are looking SPECIFICALLY for tiles whose content === 0;
             * note that you can only ever place a chip on an empty tile;
             */
            if ((content === 0) && (!checkAll(colIdx, rowIdx, forfeitKey)===false)) forfeit = false;
            // on each element of board, check to see if forfeit is FALSE; recall that by default, checkAll() assumes
            // that isLegal is FALSE and seeks to find a SINGLE CASE that will assign it to TRUE; therefore, by 
            // prefixing the return value of checkAll with a !, we can mutate that boolean for the purpose of forfeit,
            // where we want precisely the opposite; we want assume that forfeit is TRUE and want to find a single
            // case where it is FALSE
        });
    });
    return forfeit;
}
