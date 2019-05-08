/*----- constants -----*/
const PLAYERS = {
    "1": "black",       // black moves first
    "-1": "white",
    "0": "#065241"      // set empty squares to color of background
};

/*----- app's state (variables) -----*/
var board, winner, turn;

var globalCol = null;
var globalRow = null;



// we always want to have a handle on our game board (array), whether or
// not there's a winner, and which player's turn it is; see methods below for more





/*----- cached element references -----*/
// this'll be where we want to reference a html element to reflect a player's score/current number of chips
const p1Score = document.getElementById("p1Score");
const p2Score = document.getElementById("p2Score");
const p1Turn = document.querySelector("#colL p.status");
const p2Turn = document.querySelector("#colR p.status");

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

// CHECK functions below
function checkUp(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKUP: CURRENT tile is: board[${colIdx}][${rowIdx}];  CURRENT turn value is: ${turn}`);
    // console.log(`the value of the tile ABOVE (c[${colIdx}]r[${++rowIdx}])is: ${board[colIdx][rowIdx]}`);
    // rowIdx--; // compensating for console.log above; 
    // console.log(`value of rowIdx w/compensation: ${rowIdx}`);

    if (board[colIdx][++rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkDownLegal(colIdx, rowIdx);
        if (bool1) {
            let tempArr = [colIdx, rowIdx]; // TRACK DOWN ARR
            // console.log(`checkDownLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);    // HEY. This is checkDOWN!!!, NOT checkUP
            // return tempArr;   // if checkDown is TRUE, then return the current values of col/rowIdx
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol has been set to ${globalCol}, globalRow has been set to ${globalRow}`);
        } else {
            // console.log(`checkDownLegal returned ${bool1}`);
            return;   // if checkDown returns FALSE, do nothing; just return
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) { // again, don't need to inc rowIdx because you already did in the first if
        // console.log("in else if; you are about to recurse");
        checkUp(colIdx, rowIdx);    // RECURSION OVER HERE

    } else {
        // console.log("do nothing");
        return;
    }
}

function checkDown(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKDOWN: CURRENT tile is: board[${colIdx}][${rowIdx}]; CURRENT turn value is: ${turn}`);
    // console.log(`the value of the tile BELOW (c[${colIdx}]r[${--rowIdx}])is: ${board[colIdx][rowIdx]}`);
    // //note how after we PREfix (--rowIdx), we can just call board[cIdx][rIdx] and we get the correct value of turn
    // rowIdx++; // compensating for console.log above; 
    // // just as a rule of thumb, make sure to compensate after inc/decrementing in a template literal
    // console.log(`value of rowIdx w/compensation: ${rowIdx}`);

    if (board[colIdx][--rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkUpLegal(colIdx, rowIdx);
        if (bool1) {
            // because we decremented in the if statement above, don't need to dec again
            let tempArr = [colIdx, rowIdx];
            // console.log(`checkUpLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);
            // HEY. This is chekcUP!!!, NOT checkDOWN
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol has been set to ${globalCol}, globalRow has been set to ${globalRow}`);
        } else {
            // console.log(`checkUpLegal returned ${bool1}`);
            return;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        // console.log("in else if; you are about to recurse");
        // since that first IF didn't return true, we skip that block, then we go to the next, HOWEVER, since we DID run
        // the if statement, the value of rowIdx will remain decremented; that's why we don't have to dec it again here
        // also, we don't have to worry about running into the same inc/dec issue with turn because we haven't re-assigned it
        // to anything (which would require an '=')
        // by the fact that we're at this line of code means that the (else) if condition above is true; therefore, the
        // turn value of the CURRENT tile is the opposite of the turn (i.e. this tile belongs to the opponent); now we
        // set the tempBoard at this nested index to hold the converted tile value 
        checkDown(colIdx, rowIdx);
    } else {
        // console.log("do nothing");
        return;
    }

}

function checkLeft(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKLEFT: CURRENT tile is: board[${colIdx}][${rowIdx}]; CURRENT turn value is: ${turn}`);

    // console.log(`--colIdx (${--colIdx}) < 0: ${colIdx < 0}`)
    // colIdx++;
    if (--colIdx < 0) return;
    colIdx++;

    // console.log(`the value of the tile LEFT (c[${--colIdx}]r[${rowIdx}])is: ${board[colIdx][rowIdx]}`);
    // colIdx++; // compensating for console.log above; 
    // console.log(`value of colIdx w/compensation: ${colIdx}`);

    if (board[--colIdx][rowIdx] === turn) {
        // console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkRightLegal(colIdx, rowIdx);
        if (bool1) {
            let tempArr = [colIdx, rowIdx]; // TRACK DOWN ARR
            // console.log(`checkRightLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);    // HEY. This is checkDOWN!!!, NOT checkUP
            // return tempArr;   // if checkDown is TRUE, then return the current values of col/rowIdx
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol has been set to ${globalCol}, globalRow has been set to ${globalRow}`);
        } else {
            // console.log(`checkRightLegal returned ${bool1}`);
            return;   // if checkDown returns FALSE, do nothing; just return
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) { // again, don't need to inc rowIdx because you already did in the first if
        // console.log("in else if; you are about to recurse");
        checkLeft(colIdx, rowIdx);    // RECURSION OVER HERE

    } else {
        // console.log("do nothing");
        return;
    }
}

function checkRight(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKLEFT: CURRENT tile is: board[${colIdx}][${rowIdx}]; CURRENT turn value is: ${turn}`);

    // console.log(`++colIdx (${++colIdx}) === board.length (${board.length}): ${colIdx === board.length}`);
    // colIdx--;
    if (++colIdx === board.length) return;
    colIdx--;

    // console.log(`the value of the tile LEFT (c[${++colIdx}]r[${rowIdx}])is: ${board[colIdx][rowIdx]}`);
    // colIdx--;
    // console.log(`value of colIdx w/compensation: ${colIdx}`);

    if (board[++colIdx][rowIdx] === turn) {
        // console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkLeftLegal(colIdx, rowIdx);
        if (bool1) {
            let tempArr = [colIdx, rowIdx];
            // console.log(`checkLeftLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);    // HEY. This is checkDOWN!!!, NOT checkUP
            // return tempArr;   // if checkDown is TRUE, then return the current values of col/rowIdx
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol has been set to ${globalCol}, globalRow has been set to ${globalRow}`);
        } else {
            // console.log(`checkLeftLegal returned ${bool1}`);
            return;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        // console.log("in else if; you are about to recurse");
        checkRight(colIdx, rowIdx);    // RECURSION OVER HERE
    } else {
        // console.log("do nothing");
        return;
    }
}

function checkTopLeft(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKTOPLEFT: CURRENT tile is: board[${colIdx}][${rowIdx}];  CURRENT turn value is: ${turn}`);

    // console.log(`--colIdx (${--colIdx}) < 0: ${colIdx < 0}`)
    // colIdx++;
    if (--colIdx < 0) return;
    colIdx++;

    // console.log(`the value of the tile ABOVE and LEFT (c[${--colIdx}]r[${++rowIdx}])is: ${board[colIdx][rowIdx]}`);
    // rowIdx--; // compensating for console.log above; 
    // colIdx++;
    // console.log(`value of rowIdx w/compensation: ${rowIdx}; value of colIdx w/comp ${colIdx}`);

    if (board[--colIdx][++rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkBotRightLegal(colIdx, rowIdx);
        if (bool1) {
            let tempArr = [colIdx, rowIdx]; // TRACK DOWN ARR
            // console.log(`checkBotRightLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);    // HEY. This is checkDOWN!!!, NOT checkUP
            // return tempArr;   // if checkDown is TRUE, then return the current values of col/rowIdx
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol has been set to ${globalCol}, globalRow has been set to ${globalRow}`);
        } else {
            // console.log(`checkBotRightLegal returned ${bool1}`);
            return;   // if checkDown returns FALSE, do nothing; just return
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) { // again, don't need to inc rowIdx because you already did in the first if
        // console.log("in else if; you are about to recurse");
        checkTopLeft(colIdx, rowIdx);    // RECURSION OVER HERE

    } else {
        // console.log("do nothing");
        return;
    }
}

function checkTopRight(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKTOPRIGHT: CURRENT tile is: board[${colIdx}][${rowIdx}];  CURRENT turn value is: ${turn}`);

    // console.log(`++colIdx (${++colIdx}) === board.length (${board.length}): ${colIdx === board.length}`);
    // colIdx--;
    if (++colIdx === board.length) return false;
    colIdx--;

    // console.log(`the value of the tile ABOVE and RIGHT (c[${++colIdx}]r[${++rowIdx}])is: ${board[colIdx][rowIdx]}`);
    // rowIdx--; // compensating for console.log above; 
    // colIdx--;
    // console.log(`value of rowIdx w/compensation: ${rowIdx}; value of colIdx w/comp ${colIdx}`);

    if (board[++colIdx][++rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkBotLeftLegal(colIdx, rowIdx);
        if (bool1) {
            let tempArr = [colIdx, rowIdx]; // TRACK DOWN ARR
            // console.log(`checkBotLeftLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);    // HEY. This is checkDOWN!!!, NOT checkUP
            // return tempArr;   // if checkDown is TRUE, then return the current values of col/rowIdx
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol has been set to ${globalCol}, globalRow has been set to ${globalRow}`);
        } else {
            // console.log(`checkBotLeftLegal returned ${bool1}`);
            return;   // if checkDown returns FALSE, do nothing; just return
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) { // again, don't need to inc rowIdx because you already did in the first if
        // console.log("in else if; you are about to recurse");
        checkTopRight(colIdx, rowIdx);    // RECURSION OVER HERE

    } else {
        // console.log("do nothing");
        return;
    }
}

function checkBotLeft(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKBOTLEFT: CURRENT tile is: board[${colIdx}][${rowIdx}];  CURRENT turn value is: ${turn}`);

    // console.log(`--colIdx (${--colIdx}) < 0: ${colIdx < 0}`)
    // colIdx++;
    if (--colIdx < 0) return;
    colIdx++;

    // console.log(`the value of the tile BELOW and RIGHT (c[${--colIdx}]r[${--rowIdx}])is: ${board[colIdx][rowIdx]}`);        // error thrown here
    // rowIdx++;
    // colIdx++;
    // console.log(`value of rowIdx w/compensation: ${rowIdx}; value of colIdx w/comp ${colIdx}`);

    if (board[--colIdx][--rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkTopRightLegal(colIdx, rowIdx);
        if (bool1) {
            let tempArr = [colIdx, rowIdx]; // TRACK DOWN ARR
            // console.log(`checkTopRightLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);    // HEY. This is checkDOWN!!!, NOT checkUP
            // return tempArr;   // if checkDown is TRUE, then return the current values of col/rowIdx
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol has been set to ${globalCol}, globalRow has been set to ${globalRow}`);
        } else {
            // console.log(`checkTopRightLegal returned ${bool1}`);
            return;   // if checkDown returns FALSE, do nothing; just return
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) { // again, don't need to inc rowIdx because you already did in the first if
        // console.log("in else if; you are about to recurse");
        checkBotLeft(colIdx, rowIdx);    // RECURSION OVER HERE

    } else {
        // console.log("do nothing");
        return;
    }
}

function checkBotRight(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKBOTRIGHT: CURRENT tile is: board[${colIdx}][${rowIdx}];  CURRENT turn value is: ${turn}`);

    // console.log(`++colIdx (${++colIdx}) === board.length (${board.length}): ${colIdx === board.length}`);
    // colIdx--;
    if (++colIdx === board.length) return;
    colIdx--;

    // console.log(`the value of the tile BELOW and RIGHT (c[${++colIdx}]r[${--rowIdx}])is: ${board[colIdx][rowIdx]}`);
    // rowIdx++;
    // colIdx--;
    // console.log(`value of rowIdx w/compensation: ${rowIdx}; value of colIdx w/comp ${colIdx}`);

    if (board[++colIdx][--rowIdx] === turn) {
        // console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkTopLeftLegal(colIdx, rowIdx);
        if (bool1) {
            let tempArr = [colIdx, rowIdx]; // TRACK DOWN ARR
            // console.log(`checkTopLeftLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);    // HEY. This is checkDOWN!!!, NOT checkUP
            // return tempArr;   // if checkDown is TRUE, then return the current values of col/rowIdx
            globalCol = colIdx;
            globalRow = rowIdx;
            console.log(`globalCol has been set to ${globalCol}, globalRow has been set to ${globalRow}`);
        } else {
            // console.log(`checkTopLeftLegal returned ${bool1}`);
            return;   // if checkDown returns FALSE, do nothing; just return
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) { // again, don't need to inc rowIdx because you already did in the first if
        // console.log("in else if; you are about to recurse");
        checkBotRight(colIdx, rowIdx);    // RECURSION OVER HERE

    } else {
        // console.log("do nothing");
        return;
    }
}


// check LEGAL functions below
function checkUpLegal(colIdx, rowIdx) { // checks tile/chip DIRECTLY ABOVE clicked tile 
    // console.log("-------------------------------------------");
    // console.log("In checkUpLegal()");
    // console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    // console.log(`checking - board[${colIdx}][${++rowIdx}]: ${board[colIdx][rowIdx]}`);
    // rowIdx--; // compensating for console.log above; 

    let bool1 = ++rowIdx < board[colIdx].length; // catches cases where the rowIdx checked is higher than the ceiling (index 7);
    // NOTE: the cases where clicking on row 7 is legal will be caught by the checkDownLegal function
    // console.log(`bool1: ++rowIdx (${rowIdx}) < board[${colIdx}].length (${board[colIdx].length}): ${bool1}`);
    rowIdx--;

    let bool2 = board[colIdx][++rowIdx] === (turn * -1);
    // checks that the chip ABOVE you belongs to the opponent; i.e. should have a DIFFERENT turn value in order to be true
    // console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    rowIdx--; //compensating for console.log above;

    let bool3 = board[colIdx][++rowIdx] !== 0; // catches cases where the tile DIRECTLY ABOVE (the clicked tile) is blank
    // NOTE: the cases where there is a blank tile directly above will be caught by the checkDownLegal function
    // also, don't have to worry about dec'ing this ++rowIdx because this is the last boolean that uses it for logic

    // console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    // console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
    // so long as the value of turn for the tile ABOVE you is NOT the same AND is NOT 0, AND is within the bounds
}

function checkDownLegal(colIdx, rowIdx) {
    // console.log("-------------------------------------------");
    // console.log("In checkDownLegal()");
    // console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    // console.log(`checking - board[${colIdx}][${--rowIdx}]: ${board[colIdx][rowIdx]}`);
    // rowIdx++; // compensating for console.log above; 

    let bool1 = --rowIdx > -1;  // catches cases where the rowIdx you are checking is out of bounds (i.e. undefined)
    // also, because there are only 8 (0-7)rows, we won't have to worry about a player clicking on row 9 (index 8)
    // NOTE: the cases where clicking on row 0 is legal will be caught by the checkUpLegal function
    // console.log(`bool1: --rowIdx (${rowIdx}) > -1: ${bool1}`);
    rowIdx++;

    let bool2 = board[colIdx][--rowIdx] === (turn * -1);
    // checks that the chip BELOW you belongs to the opponent; i.e.  should have a DIFFERENT turn value in order to be true
    // console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    rowIdx++; //compensating for console.log above;

    let bool3 = board[colIdx][--rowIdx] !== 0;  // catches cases where the tile DIRECTLY BELOW (the clicked tile) is blank
    // NOTE: the cases where there is a blank tile directly below will be caught by the checkUpLegal function

    // console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    // console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
}

function checkLeftLegal(colIdx, rowIdx) {
    // console.log("-------------------------------------------");
    // console.log("In checkLeftLegal()");

    // console.log(`--colIdx (${--colIdx}) < 0: ${colIdx < 0}`)
    // colIdx++;
    if (--colIdx < 0) return false;
    colIdx++;

    // console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    // console.log(`checking - board[${--colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    // colIdx++;

    let bool1 = --colIdx > -1;
    // console.log(`bool1: --colIdx (${colIdx}) > -1: ${bool1}`);
    colIdx++;

    let bool2 = board[--colIdx][rowIdx] === (turn * -1);
    // console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    colIdx++;

    let bool3 = board[--colIdx][rowIdx] !== 0;
    // console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    // console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
}

function checkRightLegal(colIdx, rowIdx) {

    // console.log("-------------------------------------------");
    // console.log("In checkRightLegal()");

    // console.log(`++colIdx (${++colIdx}) === board.length (${board.length}): ${colIdx === board.length}`);
    // colIdx--;
    if (++colIdx === board.length) return false;
    colIdx--;

    // console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    // console.log(`checking - board[${++colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    // colIdx--;

    let bool1 = ++colIdx < board.length;
    // console.log(`bool1: ++colIdx (${colIdx}) < board.length (${board.length}): ${bool1}`);
    colIdx--;

    let bool2 = board[++colIdx][rowIdx] === (turn * -1);
    // console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    colIdx--;

    let bool3 = board[++colIdx][rowIdx] !== 0;
    // console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    // console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
}

function checkTopLeftLegal(colIdx, rowIdx) {
    // console.log("-------------------------------------------");
    // console.log("In checkTopLeftLegal()");

    // console.log(`--colIdx (${--colIdx}) < 0: ${colIdx < 0}`)
    // colIdx++;
    if (--colIdx < 0) return false;
    colIdx++;

    // console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    // console.log(`checking - board[${--colIdx}][${++rowIdx}]: ${board[colIdx][rowIdx]}`);
    // rowIdx--;
    // colIdx++;

    let bool1 = (++rowIdx < board[colIdx].length) && (--colIdx > -1);
    // console.log(`bool1: (++rowIdx (${rowIdx}) < board[${colIdx}].length ${bool1}) AND (--colIdx (${colIdx}) > -1): ${bool1}`);
    rowIdx--;
    colIdx++;

    let bool2 = board[--colIdx][++rowIdx] === (turn * -1);
    // console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    rowIdx--;
    colIdx++;

    let bool3 = board[--colIdx][++rowIdx] !== 0;

    // console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    // console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
}

function checkTopRightLegal(colIdx, rowIdx) {
    // console.log("-------------------------------------------");
    // console.log("In checkTopRightLegal()");

    // console.log(`++colIdx (${colIdx++}) === board.length (${board.length}): ${colIdx === board.length}`);
    // colIdx--;
    if (++colIdx === board.length) return false;
    colIdx--;

    // console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    // console.log(`checking - board[${++colIdx}][${++rowIdx}]: ${board[colIdx][rowIdx]}`);
    // rowIdx--;
    // colIdx--;

    //              top if condition                   right if condition
    let bool1 = (++rowIdx < board[colIdx].length) && (++colIdx < board.length);
    // console.log(`bool1: (++rowIdx (${rowIdx}) < board[${colIdx}].length: ${bool1}) AND (++colIdx (${colIdx}) < board.length (${board.length}): ${bool1})`);
    rowIdx--;
    colIdx--;

    let bool2 = board[++colIdx][++rowIdx] === (turn * -1);
    // console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    rowIdx--;
    colIdx--;

    let bool3 = board[++colIdx][++rowIdx] !== 0;

    // console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    // console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
}

function checkBotLeftLegal(colIdx, rowIdx) {
    // console.log("-------------------------------------------");
    // console.log("In checkBotLeftLegal()");

    // console.log(`--colIdx (${--colIdx}) < 0: ${colIdx < 0}`)
    // colIdx++;
    if (--colIdx < 0) return false;
    colIdx++;

    // console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    // console.log(`checking - board[${--colIdx}][${--rowIdx}]: ${board[colIdx][rowIdx]}`);
    // rowIdx++;
    // colIdx++;

    let bool1 = (--rowIdx > -1) && (--colIdx > -1);
    // console.log(`bool1: (--rowIdx (${rowIdx}) > -1: ${bool1}) AND (--colIdx (${colIdx}) > -1): ${bool1}`);
    rowIdx++;
    colIdx++;

    let bool2 = board[--colIdx][--rowIdx] === (turn * -1);
    // console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    rowIdx++;
    colIdx++;

    let bool3 = board[--colIdx][--rowIdx] !== 0;

    // console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    // console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
}

function checkBotRightLegal(colIdx, rowIdx) {
    // console.log("-------------------------------------------");
    // console.log(`IN CHECKBOTRIGHT: CURRENT tile is: board[${colIdx}][${rowIdx}]; CURRENT turn value is: ${turn}`);

    // console.log(`++colIdx (${++colIdx}) === board.length (${board.length}) is: ${colIdx === board.length}`);
    // colIdx--;
    if (++colIdx === board.length) return false;
    colIdx--;

    // console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    // console.log(`checking - board[${++colIdx}][${--rowIdx}]: ${board[colIdx][rowIdx]}`);
    // rowIdx++; // compensating for console.log above; 
    // colIdx--;

    let bool1 = (--rowIdx > -1) && (++colIdx < board.length);
    // console.log(`bool1: (--rowIdx (${rowIdx}) > -1: ${bool1}) AND (++colIdx (${colIdx}) < board.length (${board.length}): ${bool1})`);
    rowIdx++;
    colIdx--;

    let bool2 = board[++colIdx][--rowIdx] === (turn * -1);
    // console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    rowIdx++; //compensating for console.log above;
    colIdx--;

    let bool3 = board[++colIdx][--rowIdx] !== 0;

    // console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    // console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
}


function resetGlobalIdx() {
    globalCol = null;
    globalRow = null;
    // console.log(`globals reset; gCol: ${globalCol}, gRow: ${globalRow}`);
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
    // console.log(`Math.abs(srcColIdx(${sourceColIdx})-trgtColIdx(${targetColIdx}) ) is: ${Math.abs(sourceColIdx - targetColIdx)}`)
    // the two for loops below 
    for (let i = 0; i < Math.abs(sourceColIdx - targetColIdx); i++) {
        let tempNo = sourceColIdx + (colCounter * (i + 1));
        colArr.push(tempNo);
        console.log(`colArr just pushed  ${tempNo}; colArr now holds: ${colArr}`)
    }

    // console.log(`Math.abs(srcRowIdx(${sourceRowIdx})-trgtRowIdx(${targetRowIdx}) ) is: ${Math.abs(sourceRowIdx - targetRowIdx)}`)
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
    (turn === 1) ? p1Turn.style.borderColor="white" : p1Turn.style.borderColor="black";
    (turn === -1) ? p2Turn.style.borderColor="black" : p2Turn.style.borderColor="white";
}

function handleClick(evt) {
    let blackChipCount = 0;
    let whiteChipCount = 0;
    const tile = evt.target;
    // create a function scoped constant on the element that fired the event
    const colIdx = parseInt(tile.id.charAt(1));
    const rowIdx = parseInt(tile.id.charAt(3));
    // because of the naming convention for the id's of each div html element
    // representing a space on the board (c'col#'r'row#'), we can specifically
    // target them with hardcoded indices; note that this is NOT ROBUST
    if (isNaN(colIdx)) return; // handles cases where users click inbetween divs
    if ((board[colIdx][rowIdx]) || winner) return;
    // handles cases where there is an existing value in a tile or if winner is found
    // (i.e. winner === true); line taken from tictactoe code along w/Daniel

    console.log(`CLICKED ON board[${colIdx}][${rowIdx}]`);

    let zeroCount = 0;
    let booly = false;
    // function scoped variable; set to true IF a SINGLE one of the nested if statements below is true

    // first checks to make sure a move is legal (i.e. you are not clicking right next to a blank tile or
    // your own chip); IF that condition is met, then proceed to check through that direction; IF the move
    // is deemed to be legal (look at specific methods for more info), then globalCol/Row will have assigned
    // values, and the nested if statement will return true
    // it may seem to appear unnecessary to check EACH direction, but it is better to SEPARATE OUR CONCERNS
    // and have SINGLE POINTS OF FAILURE
    if (checkUpLegal(colIdx, rowIdx)) {
        checkUp(colIdx, rowIdx);
        if (!(globalCol === null || globalRow === null)) {              // UP
            convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }

    if (checkDownLegal(colIdx, rowIdx)) {
        checkDown(colIdx, rowIdx);
        if (!(globalCol === null || globalRow === null)) {              // DOWN
            convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }

    if (checkLeftLegal(colIdx, rowIdx)) {
        checkLeft(colIdx, rowIdx);
        if (!(globalCol === null || globalRow === null)) {              // LEFT
            convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }

    if (checkRightLegal(colIdx, rowIdx)) {
        checkRight(colIdx, rowIdx);
        if (!(globalCol === null || globalRow === null)) {              // RIGHT
            convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }

    if (checkTopLeftLegal(colIdx, rowIdx)) {
        checkTopLeft(colIdx, rowIdx);
        if (!(globalCol === null || globalRow === null)) {              // TOP LEFT
            convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }

    if (checkTopRightLegal(colIdx, rowIdx)) {
        checkTopRight(colIdx, rowIdx);
        if (!(globalCol === null || globalRow === null)) {              // TOP RIGHT
            convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }

    if (checkBotLeftLegal(colIdx, rowIdx)) {
        checkBotLeft(colIdx, rowIdx);
        if (!(globalCol === null || globalRow === null)) {              // BOT LEFT
            convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }

    if (checkBotRightLegal(colIdx, rowIdx)) {
        checkBotRight(colIdx, rowIdx);
        if (!(globalCol === null || globalRow === null)) {              // BOT RIGHT
            convert(colIdx, rowIdx, globalCol, globalRow);
            booly = true;
        }
    }


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

    // TODO worry about changing the border to dashed and hover/mouseEnter logic

    console.log("calling render() from handleClick()");
    
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
    let forfeitBool = null;
    if(zeroCount < 32) forfeitBool = checkForfeit();    // we are HARD CODING an ARBITRARY limit to start invoking checkForfeit()
    console.log(`forfeit returned: ${forfeitBool}; zeroCount is: ${zeroCount}`);
    // will need to flesh out win logic after this
    console.log(`checking forfeit status of Player ${(turn === 1) ? 1 : 2}'s turn; CURRENT turn is ${turn}`);
    console.log("----------NEXT TURN STARTS BELOW----------");
    if(forfeitBool || (zeroCount==0)) {
        getWinner(blackChipCount, whiteChipCount);
    }

    render();
    // calls render() to have the front-end reflect the newly updated app state
}

function getWinner(blackChips, whiteChips){
    winner = (blackChips > whiteChips) ? 1 : -1;
    alert(`Player ${(winner === 1) ? 1 : 2} wins!!!`);
    return winner;
}

function checkForfeit() {
    let forfeit = true;

    board.forEach(function (colArr, colIdx) {
        colArr.forEach(function (content, rowIdx) {
            if (content === 0) {
                if (checkUpLegal(colIdx, rowIdx)) {
                    checkUp(colIdx, rowIdx);
                    if (!(globalCol === null || globalRow === null)) {              // UP
                        return forfeit = false;
                    }
                }

                if (checkDownLegal(colIdx, rowIdx)) {
                    checkDown(colIdx, rowIdx);
                    if (!(globalCol === null || globalRow === null)) {              // DOWN
                        return forfeit = false;
                    }
                }

                if (checkLeftLegal(colIdx, rowIdx)) {
                    checkLeft(colIdx, rowIdx);
                    if (!(globalCol === null || globalRow === null)) {              // LEFT
                        return forfeit = false;
                    }
                }

                if (checkRightLegal(colIdx, rowIdx)) {
                    checkRight(colIdx, rowIdx);
                    if (!(globalCol === null || globalRow === null)) {              // RIGHT
                        return forfeit = false;
                    }
                }

                if (checkTopLeftLegal(colIdx, rowIdx)) {
                    checkTopLeft(colIdx, rowIdx);
                    if (!(globalCol === null || globalRow === null)) {              // TOP LEFT
                        return forfeit = false;
                    }
                }
                if (checkTopRightLegal(colIdx, rowIdx)) {
                    checkTopRight(colIdx, rowIdx);
                    if (!(globalCol === null || globalRow === null)) {              // TOP RIGHT
                        return forfeit = false;
                    }
                }

                if (checkBotLeftLegal(colIdx, rowIdx)) {
                    checkBotLeft(colIdx, rowIdx);
                    if (!(globalCol === null || globalRow === null)) {              // BOT LEFT
                        return forfeit = false;
                    }
                }

                if (checkBotRightLegal(colIdx, rowIdx)) {
                    checkBotRight(colIdx, rowIdx);
                    if (!(globalCol === null || globalRow === null)) {              // BOT RIGHT
                        return forfeit = false;
                    }
                }

            }
        });
    });
    return forfeit;
}
/**
 * so, while iterating through the ENTIRE board, we are looking SPECIFICALLY for those whose content === 0;
 * because you can only ever place a chip on an empty tile;
 */