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
var globalCol = null;
var globalRow = null;
var blackChipCount = 0;
var whiteChipCount = 0;

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
document.querySelector("button").addEventListener('click', init);
// added a listener for our reset button; calls init on press; very elegant solution;
// idea taken from tictactoe code-along w/Daniel

/*----- functions -----*/
init(); // call the init function so the game starts upon loading


// CHECK functions below
function checkUp(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKUP: CURRENT tile is: board[${colIdx}][${rowIdx}] w/ value of ${board[colIdx][rowIdx]};  CURRENT turn value is: ${turn}`);
    if (board[colIdx][++rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkDownLegal(colIdx, rowIdx);
        if (bool1) {
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol is now: ${globalCol}, globalRow is now: ${globalRow}`);
        } else {
            return;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkUp(colIdx, rowIdx);
    } else {
        return;
    }
}

function checkDown(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKDOWN: CURRENT tile is: board[${colIdx}][${rowIdx}] w/ value of ${board[colIdx][rowIdx]}; CURRENT turn value is: ${turn}`);
    if (board[colIdx][--rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkUpLegal(colIdx, rowIdx);
        if (bool1) {
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol is now: ${globalCol}, globalRow is now: ${globalRow}`);
        } else {
            return;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkDown(colIdx, rowIdx);
        // since that first IF didn't return true, we skip that block, then we go to the next, HOWEVER, since we DID run
        // the if statement, the value of rowIdx will remain decremented; that's why we don't have to dec it again here
        // also, we don't have to worry about running into the same inc/dec issue with turn because we haven't re-assigned it
        // to anything (which would require an '=')
        // by the fact that we're at this line of code means that the (else) if condition above is true; therefore, the
        // turn value of the CURRENT tile is the opposite of the turn (i.e. this tile belongs to the opponent); now we
        // set the tempBoard at this nested index to hold the converted tile value 
    } else {
        return;
    }

}

function checkLeft(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKLEFT: CURRENT tile is: board[${colIdx}][${rowIdx}] w/ value of ${board[colIdx][rowIdx]}; CURRENT turn value is: ${turn}`);
    if (--colIdx < 0) return;
    colIdx++;
    if (board[--colIdx][rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkRightLegal(colIdx, rowIdx);
        if (bool1) {
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol is now: ${globalCol}, globalRow is now: ${globalRow}`);
        } else {
            return;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkLeft(colIdx, rowIdx);
    } else {
        return;
    }
}

function checkRight(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKLEFT: CURRENT tile is: board[${colIdx}][${rowIdx} w/ value of ${board[colIdx][rowIdx]}; CURRENT turn value is: ${turn}`);
    if (++colIdx === board.length) return;
    colIdx--;
    if (board[++colIdx][rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkLeftLegal(colIdx, rowIdx);
        if (bool1) {
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol is now: ${globalCol}, globalRow is now: ${globalRow}`);
        } else {
            return;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkRight(colIdx, rowIdx);
    } else {
        return;
    }
}

function checkTopLeft(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKTOPLEFT: CURRENT tile is: board[${colIdx}][${rowIdx}] w/ value of ${board[colIdx][rowIdx]};  CURRENT turn value is: ${turn}`);
    if (--colIdx < 0) return;
    colIdx++;
    if (board[--colIdx][++rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkBotRightLegal(colIdx, rowIdx);
        if (bool1) {
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol is now: ${globalCol}, globalRow is now: ${globalRow}`);
        } else {
            return;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkTopLeft(colIdx, rowIdx);
    } else {
        return;
    }
}

function checkTopRight(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKTOPRIGHT: CURRENT tile is: board[${colIdx}][${rowIdx}] w/ value of ${board[colIdx][rowIdx]};  CURRENT turn value is: ${turn}`);
    if (++colIdx === board.length) return false;
    colIdx--;
    if (board[++colIdx][++rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkBotLeftLegal(colIdx, rowIdx);
        if (bool1) {
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol is now: ${globalCol}, globalRow is now: ${globalRow}`);
        } else {
            return;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkTopRight(colIdx, rowIdx);
    } else {
        return;
    }
}

function checkBotLeft(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKBOTLEFT: CURRENT tile is: board[${colIdx}][${rowIdx}] w/ value of ${board[colIdx][rowIdx]};  CURRENT turn value is: ${turn}`);
    if (--colIdx < 0) return;
    colIdx++;
    if (board[--colIdx][--rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkTopRightLegal(colIdx, rowIdx);
        if (bool1) {
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol is now: ${globalCol}, globalRow is now: ${globalRow}`);
        } else {
            return;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkBotLeft(colIdx, rowIdx);
    } else {
        return;
    }
}

function checkBotRight(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKBOTRIGHT: CURRENT tile is: board[${colIdx}][${rowIdx}] w/ value of ${board[colIdx][rowIdx]};  CURRENT turn value is: ${turn}`);
    if (++colIdx === board.length) return;
    colIdx--;
    if (board[++colIdx][--rowIdx] === turn) {
        let bool1 = checkTopLeftLegal(colIdx, rowIdx);
        if (bool1) {
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol is now: ${globalCol}, globalRow is now: ${globalRow}`);
        } else {
            return;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        checkBotRight(colIdx, rowIdx);
    } else {
        return;
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


function resetGlobalIdx() {
    globalCol = null;
    globalRow = null;
}

function convert(sourceColIdx, sourceRowIdx, targetColIdx, targetRowIdx) {
    let colCounter = (Math.sign(sourceColIdx - targetColIdx) === 1) ? -1 : 1;       // CATCH CASE OF 0
    let rowCounter = (Math.sign(sourceRowIdx - targetRowIdx) === 1) ? -1 : 1;
    // ternary operators that will set col/rowCounter to be -1 or 1 depending on the result of Math.sign(); for example, if Math.sign()
    // returns 1, that means that the source index is GREATER than the target index; therefore, we want to be decrementing (or adding
    // a negative)
    let colArr = [];
    let rowArr = [];

    console.log("-------------------------------------------");
    console.log("In CONVERSION");
    for (let i = 0; i < Math.abs(sourceColIdx - targetColIdx); i++) {
        let tempNo = sourceColIdx + (colCounter * (i + 1));
        colArr.push(tempNo);
        console.log(`colArr just pushed  ${tempNo}; colArr now holds: ${colArr}`)
    }

    for (let i = 0; i < Math.abs(sourceRowIdx - targetRowIdx); i++) {
        let tempNo = sourceRowIdx + (rowCounter * (i + 1));
        rowArr.push(tempNo);
        console.log(`rowArr just pushed  ${tempNo}; rowArr now holds: ${rowArr}`)
    }
    console.log("-------------------------------------------");

    // you won't ever have a case where col and row "steps" (think about the diagonal cases) are off by more than one. 
    if (colArr.length === 0) {  // catches cases where only the ROW changes; set the colIdx to be source
        console.log("colArr.length === 0");
        let limit = rowArr.length;
        for (let i = 0; i < limit; i++) {
            let holder = rowArr.pop();
            board[sourceColIdx][holder] = turn;
            console.log(`board[${sourceColIdx}][${holder}] now holds: ${turn}`);
        }
        resetGlobalIdx();
    } else if (rowArr.length === 0) {   // catches cases where only the COLUMN changes; set the rowIdx to source
        console.log("rowArr.length === 0");
        let limit = colArr.length;
        for (let i = 0; i < limit; i++) {
            let holder = colArr.pop();
            board[holder][sourceRowIdx] = turn;
            console.log(`board[${holder}][${sourceRowIdx}] now holds: ${turn}`)
        }
        resetGlobalIdx();
    } else {
        console.log("rowArr.length !== 0 and colArr.length !== 0");
        let limit = colArr.length;
        for (let i = 0; i < limit; i++) {
            let holder1 = colArr.pop();
            let holder2 = rowArr.pop();
            board[holder1][holder2] = turn;
            console.log(`board[${holder1}][${holder2}] now holds: ${turn}`);
        }
        resetGlobalIdx();
    }
    console.log("-------------------------------------------");
    // just have to make sure that the coordinates you feed in to convert() stop BEFORE your own tile (i guess it wouldn't)
    // technically matter if you color over your own tile, but still; also, this method will NOT color the clicked tile
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

    winner = false;  // set winner to false at the beginning of the game
    turn = 1;   // black moves first, so turn is set to 1; look at PLAYERS{} for more info
    resetGlobalIdx();
    blackChipCount = 2;
    whiteChipCount = 2;

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
    div.style.border = `5px solid ${PLAYERS[turn]}`;
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
            div.style.backgroundColor = PLAYERS[content];
            // use square bracket notation because input can vary; 
            // note that the VALUE of PLAYERS[content] will depend on
            // the KEY that is passed in (the actual 'content' arg); 
            // refer to const PLAYERS objecgt above for more
        });
    });
    (turn === 1) ? p1Turn.style.borderColor = "white" : p1Turn.style.borderColor = "black";
    (turn === -1) ? p2Turn.style.borderColor = "black" : p2Turn.style.borderColor = "white";
}

function handleClick(evt) {
    let ffs = checkForfeit();
    console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
    console.log(`ffs is: ${ffs}`);
    handleClickDo(evt);
}

function handleClickDo(evt) {
    const tile = evt.target;
    // create a function scoped constant on the element that fired the event
    const colIdx = parseInt(tile.id.charAt(1));
    const rowIdx = parseInt(tile.id.charAt(3));
    // because of the naming convention for the id's of each div html element
    // representing a space on the board (c'col#'r'row#'), we can specifically
    // target them with hardcoded indices; note that this is NOT ROBUST
    if (isNaN(colIdx)) return;
    // handles cases where users click inbetween divs
    if ((board[colIdx][rowIdx]) || winner) return;
    // handles cases where there is an existing value in a tile or if winner is found
    // (i.e. winner === true); line taken from tictactoe code along w/Daniel

    console.log(`CLICKED ON board[${colIdx}][${rowIdx}]`);
    let zeroCount = 0;
    blackChipCount = 0;
    whiteChipCount = 0;
    // nested forEach()s to sum up all the white and black ships that are currently in the board app state
    board.forEach(function (colArr, colIdx) {
        colArr.forEach(function (content, rowIdx) {
            if (content === 1) {
                ++blackChipCount;
                p1Score.textContent = `${blackChipCount}`;
            } else if (content === -1) {
                ++whiteChipCount;
                p2Score.textContent = `${whiteChipCount}`;
            } else {
                zeroCount++;
            }
        });
    });

    if (booly) {
        board[colIdx][rowIdx] = turn;
        // assigning the nested index to the CURRENT TURN inside of this if statement makes sure that
        // a player is unable to place his/her chip on an ILLEGAL tile
        console.log(`board[${colIdx}][${rowIdx}]'s value (turn) is now: ${turn}`)
        turn *= -1;
        // necessarily need this here (inside the if), because so long as the player is unable to click, 
        // it is STILL that player's turn hands the turn back over to the other player; 
        // look at init() for initial turn value
        console.log(`turn just changed to: ${turn}`)
    }

    // if (zeroCount < 32) forfeitBool = checkForfeit();    // we are HARD CODING an ARBITRARY LIMIT to start invoking checkForfeit()
    console.log(`forfeitStatus returned: ${forfeitStatus}; zeroCount is: ${zeroCount}`);
    console.log(`checking forfeit status of Player ${(turn === 1) ? 1 : 2}'s turn; CURRENT turn is ${turn}`);
    if (forfeitStatus) {
        turn *= -1;
        return;
    }
    if (forfeitStatus && (zeroCount == 0)) {
        getWinner(blackChipCount, whiteChipCount);
    }

    console.log("calling render() from handleClick()");
    render();
    console.log("----------NEXT TURN STARTS BELOW----------");
    // calls render() to have the front-end reflect the newly updated app state
}

function checkAll(colIdx, rowIdx, key) {
    let booly = false;
    // function scoped variable; set to true IF a SINGLE one of the nested if statements below is true

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
            booly = true;
            // we can only reach the inside of this nested if statment IF a direction is legal at the location
            // passed in by the parameters
        }
    }
    if (checkDownLegal(colIdx, rowIdx)) {
        checkDown(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // DOWN
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }
    if (checkLeftLegal(colIdx, rowIdx)) {
        checkLeft(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // LEFT
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }
    if (checkRightLegal(colIdx, rowIdx)) {
        checkRight(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // RIGHT
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }
    if (checkTopLeftLegal(colIdx, rowIdx)) {
        checkTopLeft(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // TOP LEFT
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }
    if (checkTopRightLegal(colIdx, rowIdx)) {
        checkTopRight(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // TOP RIGHT
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }
    if (checkBotLeftLegal(colIdx, rowIdx)) {
        checkBotLeft(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // BOT LEFT
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }
    if (checkBotRightLegal(colIdx, rowIdx)) {
        checkBotRight(colIdx, rowIdx);
        if (globalCol !== null && globalRow !== null) {              // BOT RIGHT
            if (key) convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }
    return booly;
}


function getWinner(blackChips, whiteChips) {
    if (blackChips === whiteChips) {
        winBanner.style.visibility = "visible";
        winBanner.textContent = "TIE GAME";
        winBanner.style.color = "#065241";
        winBanner.style.backgroundColor = "rgb(204, 204, 204)";
    } else {
        winner = (blackChips > whiteChips) ? 1 : -1;
        winBanner.style.visibility = "visible";
        winBanner.style.color = `${PLAYERS[winner * -1]}`;
        winBanner.style.backgroundColor = `${PLAYERS[winner]}`;
    }
}

function checkForfeit() {
    let forfeitKey = false;
    let forfeit = true;

    board.forEach(function (colArr, colIdx) {
        colArr.forEach(function (content, rowIdx) {
            if (content === 0) {
                forfeit = !(checkAll(colIdx, rowIdx, forfeitKey));
            }
        });
    });
    return forfeit;
}
/**
 * so, while iterating through the ENTIRE board, we are looking SPECIFICALLY for those whose content === 0;
 * because you can only ever place a chip on an empty tile;
 */