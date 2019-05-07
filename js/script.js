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

// no need to have actual vars holding each player's chip count because we can compute it


/**



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
    console.log("-------------------------------------------");
    console.log(`IN CHECKDOWN: CURRENT tile is: board[${colIdx}][${rowIdx}]; CURRENT turn value is: ${turn}`);
    console.log(`the value of the tile BELOW (c[${colIdx}]r[${--rowIdx}])is: ${board[colIdx][rowIdx]}`);
    //note how after we PREfix (--rowIdx), we can just call board[cIdx][rIdx] and we get the correct value of turn
    rowIdx++; // compensating for console.log above; 
    // just as a rule of thumb, make sure to compensate after inc/decrementing in a template literal
    console.log(`value of rowIdx w/compensation: ${rowIdx}`);

    if (board[colIdx][--rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkUpLegal(colIdx, rowIdx);
        if (bool1) {
            // because we decremented in the if statement above, don't need to dec again
            let tempArr = [colIdx, rowIdx];
            console.log(`checkUpLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);
            // HEY. This is chekcUP!!!, NOT checkDOWN
            globalCol = colIdx;
            globalRow = rowIdx;
        } else {
            console.log(`checkUpLegal returned ${bool1}`);
            resetGlobalIdx();
            return;
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) {
        console.log("in else if; you are about to recurse");
        // since that first IF didn't return true, we skip that block, then we go to the next, HOWEVER, since we DID run
        // the if statement, the value of rowIdx will remain decremented; that's why we don't have to dec it again here
        // also, we don't have to worry about running into the same inc/dec issue with turn because we haven't re-assigned it
        // to anything (which would require an '=')
        // by the fact that we're at this line of code means that the (else) if condition above is true; therefore, the
        // turn value of the CURRENT tile is the opposite of the turn (i.e. this tile belongs to the opponent); now we
        // set the tempBoard at this nested index to hold the converted tile value 
        checkDown(colIdx, rowIdx);
    } else {
        resetGlobalIdx();
        console.log("do nothing");
        return;
    }

}

function checkDownLegal(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log("In checkDownLegal()");
    console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    console.log(`checking - board[${colIdx}][${--rowIdx}]: ${board[colIdx][rowIdx]}`);
    rowIdx++; // compensating for console.log above; 

    let bool1 = --rowIdx > -1;  // catches cases where the rowIdx you are checking is out of bounds (i.e. undefined)
    // also, because there are only 8 (0-7)rows, we won't have to worry about a player clicking on row 9 (index 8)
    // NOTE: the cases where clicking on row 0 is legal will be caught by the checkUpLegal function
    console.log(`bool1: --rowIdx (${rowIdx}) > -1: ${bool1}`);
    rowIdx++;

    let bool2 = board[colIdx][--rowIdx] === (turn * -1);
    // checks that the chip BELOW you belongs to the opponent; i.e.  should have a DIFFERENT turn value in order to be true
    console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    rowIdx++; //compensating for console.log above;
    
    let bool3 = board[colIdx][--rowIdx] !== 0;  // catches cases where the tile DIRECTLY BELOW (the clicked tile) is blank
    // NOTE: the cases where there is a blank tile directly below will be caught by the checkUpLegal function
    
    console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
}

function checkLeftLegal(colIdx, rowIdx){
    console.log("-------------------------------------------");
    console.log("In checkLeftLegal()");
    console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    console.log(`checking - board[${--colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    colIdx++;
    
    let bool1 = --colIdx > -1;
    console.log(`bool1: --colIdx (${colIdx}) > -1: ${bool1}`);
    colIdx++;
    
    let bool2 = board[--colIdx][rowIdx] === (turn * -1);
    console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    colIdx++;

    let bool3 = board[--colIdx][rowIdx] !== 0;
    console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
}

function checkRightLegal(colIdx, rowIdx){
    console.log("-------------------------------------------");
    console.log("In checkRightLegal()");
    console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    console.log(`checking - board[${++colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    colIdx--;
    
    let bool1 = ++colIdx < board.length;
    console.log(`bool1: ++colIdx (${colIdx}) < board.length (${board.length}): ${bool1}`);
    colIdx--;
    
    let bool2 = board[++colIdx][rowIdx] === (turn * -1);
    console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    colIdx--;

    let bool3 = board[++colIdx][rowIdx] !== 0;
    console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
}

function checkUpLegal(colIdx, rowIdx) { // checks tile/chip DIRECTLY ABOVE clicked tile 
    console.log("-------------------------------------------");
    console.log("In checkUpLegal()");
    console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    console.log(`checking - board[${colIdx}][${++rowIdx}]: ${board[colIdx][rowIdx]}`);
    rowIdx--; // compensating for console.log above; 

    let bool1 = ++rowIdx < board[colIdx].length; // catches cases where the rowIdx checked is higher than the ceiling (index 7);
    // NOTE: the cases where clicking on row 7 is legal will be caught by the checkDownLegal function
    console.log(`bool1: ++rowIdx (${rowIdx}) < board[${colIdx}].length (${board[colIdx].length}): ${bool1}`);
    rowIdx--;

    let bool2 = board[colIdx][++rowIdx] === (turn * -1);
    // checks that the chip ABOVE you belongs to the opponent; i.e. should have a DIFFERENT turn value in order to be true
    console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    rowIdx--; //compensating for console.log above;

    let bool3 = board[colIdx][++rowIdx] !== 0; // catches cases where the tile DIRECTLY ABOVE (the clicked tile) is blank
    // NOTE: the cases where there is a blank tile directly above will be caught by the checkDownLegal function
    // also, don't have to worry about dec'ing this ++rowIdx because this is the last boolean that uses it for logic

    console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
    // so long as the value of turn for the tile ABOVE you is NOT the same AND is NOT 0, AND is within the bounds
}

function resetGlobalIdx() {
    globalCol = null;
    globalRow = null;
    console.log(`globals reset; gCol: ${globalCol}, gRow: ${globalRow}`);
}

function checkUp(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKUP: CURRENT tile is: board[${colIdx}][${rowIdx}];  CURRENT turn value is: ${turn}`);
    console.log(`the value of the tile ABOVE (c[${colIdx}]r[${++rowIdx}])is: ${board[colIdx][rowIdx]}`);
    rowIdx--; // compensating for console.log above; 
    console.log(`value of rowIdx w/compensation: ${rowIdx}`);

    if (board[colIdx][++rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkDownLegal(colIdx, rowIdx);
        if (bool1) {
            let tempArr = [colIdx, rowIdx]; // TRACK DOWN ARR
            console.log(`checkDownLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);    // HEY. This is checkDOWN!!!, NOT checkUP
            // return tempArr;   // if checkDown is TRUE, then return the current values of col/rowIdx
            globalCol = colIdx;
            globalRow = rowIdx;
        } else {
            resetGlobalIdx();
            console.log(`checkDownLegal returned ${bool1}`);
            return;   // if checkDown returns FALSE, do nothing; just return
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) { // again, don't need to inc rowIdx because you already did in the first if
        console.log("in else if; you are about to recurse");
        checkUp(colIdx, rowIdx);    // RECURSION OVER HERE

    } else {
        resetGlobalIdx();
        console.log("do nothing");
        return;
    }
}

function checkTopLeft(colIdx, rowIdx){
    console.log("-------------------------------------------");
    console.log(`IN CHECKTOPLEFT: CURRENT tile is: board[${colIdx}][${rowIdx}];  CURRENT turn value is: ${turn}`);
    console.log(`the value of the tile ABOVE and LEFT (c[${--colIdx}]r[${++rowIdx}])is: ${board[colIdx][rowIdx]}`);
    rowIdx--; // compensating for console.log above; 
    colIdx++;
    console.log(`value of rowIdx w/compensation: ${rowIdx}; value of colIdx w/comp ${colIdx}`);

    if (board[--colIdx][++rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkBotRightLegal(colIdx, rowIdx);
        if (bool1) {
            let tempArr = [colIdx, rowIdx]; // TRACK DOWN ARR
            console.log(`checkBotRightLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);    // HEY. This is checkDOWN!!!, NOT checkUP
            // return tempArr;   // if checkDown is TRUE, then return the current values of col/rowIdx
            globalCol = colIdx;
            globalRow = rowIdx;
        } else {
            resetGlobalIdx();
            console.log(`checkBotRightLegal returned ${bool1}`);
            return;   // if checkDown returns FALSE, do nothing; just return
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) { // again, don't need to inc rowIdx because you already did in the first if
        console.log("in else if; you are about to recurse");
        checkTopLeft(colIdx, rowIdx);    // RECURSION OVER HERE

    } else {
        resetGlobalIdx();
        console.log("do nothing");
        return;
    }
}

function checkTopRight(colIdx, rowIdx){
    console.log("-------------------------------------------");
    console.log(`IN CHECKTOPRIGHT: CURRENT tile is: board[${colIdx}][${rowIdx}];  CURRENT turn value is: ${turn}`);
    console.log(`the value of the tile ABOVE and RIGHT (c[${++colIdx}]r[${++rowIdx}])is: ${board[colIdx][rowIdx]}`);
    rowIdx--; // compensating for console.log above; 
    colIdx--;
    console.log(`value of rowIdx w/compensation: ${rowIdx}; value of colIdx w/comp ${colIdx}`);

    if (board[++colIdx][++rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkBotLeftLegal(colIdx, rowIdx);
        if (bool1) {
            let tempArr = [colIdx, rowIdx]; // TRACK DOWN ARR
            console.log(`checkBotLeftLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);    // HEY. This is checkDOWN!!!, NOT checkUP
            // return tempArr;   // if checkDown is TRUE, then return the current values of col/rowIdx
            globalCol = colIdx;
            globalRow = rowIdx;
        } else {
            resetGlobalIdx();
            console.log(`checkBotLeftLegal returned ${bool1}`);
            return;   // if checkDown returns FALSE, do nothing; just return
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) { // again, don't need to inc rowIdx because you already did in the first if
        console.log("in else if; you are about to recurse");
        checkTopLeft(colIdx, rowIdx);    // RECURSION OVER HERE

    } else {
        resetGlobalIdx();
        console.log("do nothing");
        return;
    }
}

function checkBotLeftLegal(colIdx, rowIdx){

}

function checkTopRightLegal(colIdx, rowIdx){
    
}

function checkBotRight(colIdx, rowIdx) {
    console.log("-------------------------------------------");
    console.log(`IN CHECKBOTRIGHT: CURRENT tile is: board[${colIdx}][${rowIdx}];  CURRENT turn value is: ${turn}`);
    console.log(`the value of the tile BELOW and RIGHT (c[${++colIdx}]r[${--rowIdx}])is: ${board[colIdx][rowIdx]}`);
    rowIdx++;
    colIdx--;
    console.log(`value of rowIdx w/compensation: ${rowIdx}; value of colIdx w/comp ${colIdx}`);

    if (board[++colIdx][--rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkTopLeftLegal(colIdx, rowIdx);
        if (bool1) {
            let tempArr = [colIdx, rowIdx]; // TRACK DOWN ARR
            console.log(`checkTopLeftLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);    // HEY. This is checkDOWN!!!, NOT checkUP
            // return tempArr;   // if checkDown is TRUE, then return the current values of col/rowIdx
            globalCol = colIdx;
            globalRow = rowIdx;
        } else {
            resetGlobalIdx();
            console.log(`checkTopLeftLegal returned ${bool1}`);
            return;   // if checkDown returns FALSE, do nothing; just return
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) { // again, don't need to inc rowIdx because you already did in the first if
        console.log("in else if; you are about to recurse");
        checkBotRight(colIdx, rowIdx);    // RECURSION OVER HERE

    } else {
        resetGlobalIdx();
        console.log("do nothing");
        return;
    }
}

function checkTopLeftLegal(colIdx, rowIdx){
    console.log("-------------------------------------------");
    console.log("In checkDownLegal()");
    console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    console.log(`checking - board[${--colIdx}][${++rowIdx}]: ${board[colIdx][rowIdx]}`);
    rowIdx--;
    colIdx++;

    let bool1 = (++rowIdx < board[colIdx].length)&&(--colIdx > -1);  
    console.log(`bool1: (++rowIdx (${rowIdx}) < board[${colIdx}].length ${bool1}) AND (--colIdx (${colIdx}) > -1: ${bool1})`);
    rowIdx--;
    colIdx++;

    let bool2 = board[--colIdx][++rowIdx] === (turn * -1);
    console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    rowIdx--;
    colIdx++;
    
    let bool3 = board[--colIdx][++rowIdx] !== 0; 
    
    console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
}
function checkBotRightLegal(colIdx, rowIdx){
    console.log("-------------------------------------------");
    console.log("In checkDownLegal()");
    console.log(`passed in - board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}`);
    console.log(`checking - board[${++colIdx}][${--rowIdx}]: ${board[colIdx][rowIdx]}`);
    rowIdx++; // compensating for console.log above; 
    colIdx--;

    let bool1 = (--rowIdx > -1)&&(++colIdx < board.length);  
    console.log(`bool1: (--rowIdx (${rowIdx}) > -1: ${bool1}) AND (++colIdx (${colIdx}) < board.length (${board.length}): ${bool1})`);
    rowIdx++;
    colIdx--;

    let bool2 = board[++colIdx][--rowIdx] === (turn * -1);
    console.log(`bool2: turn (board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]}) === (turn (${turn}) * -1): ${bool2}`);
    rowIdx++; //compensating for console.log above;
    colIdx--;
    
    let bool3 = board[++colIdx][--rowIdx] !== 0; 
    
    console.log(`bool3: board[${colIdx}][${rowIdx}] (${board[colIdx][rowIdx]})!== 0: ${bool3}`);
    console.log("-------------------------------------------");
    return bool1 && bool2 && bool3;
}

function checkLeft(colIdx, rowIdx){
    console.log("-------------------------------------------");
    console.log(`IN CHECKLEFT: CURRENT tile is: board[${colIdx}][${rowIdx}]; CURRENT turn value is: ${turn}`);
    console.log(`the value of the tile LEFT (c[${--colIdx}]r[${rowIdx}])is: ${board[colIdx][rowIdx]}`);
    colIdx++; // compensating for console.log above; 
    console.log(`value of colIdx w/compensation: ${colIdx}`);

    if (board[--colIdx][rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkRightLegal(colIdx, rowIdx);
        if (bool1) {
            let tempArr = [colIdx, rowIdx]; // TRACK DOWN ARR
            console.log(`checkRightLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);    // HEY. This is checkDOWN!!!, NOT checkUP
            // return tempArr;   // if checkDown is TRUE, then return the current values of col/rowIdx
            globalCol = colIdx;
            globalRow = rowIdx;
        } else {
            resetGlobalIdx();
            console.log(`checkRightLegal returned ${bool1}`);
            return;   // if checkDown returns FALSE, do nothing; just return
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) { // again, don't need to inc rowIdx because you already did in the first if
        console.log("in else if; you are about to recurse");
        checkLeft(colIdx, rowIdx);    // RECURSION OVER HERE

    } else {
        resetGlobalIdx();
        console.log("do nothing");
        return;
    }
}

function checkRight(colIdx, rowIdx){
    console.log("-------------------------------------------");
    console.log(`IN CHECKLEFT: CURRENT tile is: board[${colIdx}][${rowIdx}]; CURRENT turn value is: ${turn}`);
    console.log(`the value of the tile LEFT (c[${++colIdx}]r[${rowIdx}])is: ${board[colIdx][rowIdx]}`);
    colIdx--; // compensating for console.log above; 
    console.log(`value of colIdx w/compensation: ${colIdx}`);

    if (board[++colIdx][rowIdx] === turn) {
        console.log(`in if; value of board[${colIdx}][${rowIdx}]: ${board[colIdx][rowIdx]}, value of turn is: ${turn}`);
        let bool1 = checkLeftLegal(colIdx, rowIdx);
        if (bool1) {
            let tempArr = [colIdx, rowIdx]; // TRACK DOWN ARR
            console.log(`checkRightLegal returned ${bool1}; (tempArr) is: ${tempArr}; tempArr[0]: ${tempArr[0]} is a typeof ${typeof tempArr[0]}`);    // HEY. This is checkDOWN!!!, NOT checkUP
            // return tempArr;   // if checkDown is TRUE, then return the current values of col/rowIdx
            globalCol = colIdx;
            globalRow = rowIdx;
        } else {
            resetGlobalIdx();
            console.log(`checkRightLegal returned ${bool1}`);
            return;   // if checkDown returns FALSE, do nothing; just return
        }
    } else if (board[colIdx][rowIdx] === (turn * -1)) { // again, don't need to inc rowIdx because you already did in the first if
        console.log("in else if; you are about to recurse");
        checkRight(colIdx, rowIdx);    // RECURSION OVER HERE

    } else {
        resetGlobalIdx();
        console.log("do nothing");
        return;
    }
}

/**
     * So, what's going on here is that by RE-ASSIGNING board to tempBoard, we then LOSE the original reference to board; this is bad in cases where (for example) we are looking UP from the click point and realize it would be an ILLEGAL move
     * let's stick to JUST mutating the regular board, so we don't lose the reference
     * another potential solution would be assigning board to be a CONST, which would protect it from us losing the original reference
     * however, we would be unable to re-assign board to point to tempboard (and thereby reflect all the conversions);
     * on the topic of making board a CONST, if we made it a CONST OBJECT (of nested objects?), we could still mutate its keys 
     * https://zellwk.com/blog/looping-through-js-objects/
     * 
     * FUCK IT. LET'S TRY JUST USING ONE BOARD OBJECT jfc
     * 
     * 
     * YOOOOOOOOOO. alright, so what about this. we totally remove any element of touching board/tempBoard from the check methods
     * and instead, all we do is return a value. to be more specific, we return the coordinates of a legal move i.e. the nested index
     * of one of your own chips. we already have checkLegal methods, so that'll take care of the cases where the player is trying to
     * place one of their chips DIRECTLY adjacent to another of their pieces.then what we can do from there is 
     * 
     * keep recursively searching UNTIL you run into a false; or maybe until ALL are false'
     * i think we already have a pretty good system in place with calling checkOppositeDirectionLegal whenever the next target tile 
     * has the same turn value as the current global turn 
     */

// something is going on here; for some reason, board is taking on the value of tempBoard
// May 7 0728; so instead of touching either board/tempBoard, let's try and return JUST the nested index of where we stopped
// this position will ONLY be returned if the move is legal, otherwise, we are either in recursion or we return and do nothing
// like what would be the case if the next tile is 0 or out of bounds
// this would also mean we would need a CONVERSION method to run within handleClick (so that we know where we're starting from;
// or perhaps we could run it from within the if statement if checkDownLegal (within checkUp() returns true)
// what would a CONVERSION() function do? would need to accept 4 args? a col/rowIdx from source and a target col/rowIdx
// maybe we could make Conversion() robust and incorporate Math.sign(); what we can do to determine whether we will be 
// incrementing or decrementing the source indices (which won't necessarily both be the same; e.g. NE, NW, SE, SW) is to
// subtract the source index from the target; then let the sign that's returned decide; so for example, let's say
// we're trying to convert from (3,1) to (3,7). 3-3===0 so, don't inc/dec; 1-7 = -6. if call Math.sign(1-7), it will return -1
// which we can set up to execute a code block within an if statement; so in this case, we would add
// then once we've figured out exactly how many indices apart the source col/row are from the target, you can use a nested
// for loop (which i think is more appropriate than forEach here) to set the board[col][row] as you traverse

function convert(sourceColIdx, sourceRowIdx, targetColIdx, targetRowIdx) {
    let colCounter = (Math.sign(sourceColIdx - targetColIdx) === 1) ? -1 : 1;
    let rowCounter = (Math.sign(sourceRowIdx - targetRowIdx) === 1) ? -1 : 1;
    let colArr = [];
    let rowArr = [];

    console.log(`Math.abs(srcColIdx(${sourceColIdx})-trgtColIdx(${targetColIdx}) ) is: ${Math.abs(sourceColIdx - targetColIdx)}`)
    for (let i = 0; i < Math.abs(sourceColIdx - targetColIdx); i++) {
        colArr.push(sourceColIdx + (colCounter * (i + 1)));
        console.log(`colArr just pushed  ${i}; colArr now holds: ${colArr}`)
    }

    console.log("-------------------------------------------");

    console.log(`Math.abs(srcRowIdx(${sourceRowIdx})-trgtRowIdx(${targetRowIdx}) ) is: ${Math.abs(sourceRowIdx - targetRowIdx)}`)
    for (let i = 0; i < Math.abs(sourceRowIdx - targetRowIdx); i++) {
        rowArr.push(sourceRowIdx + (rowCounter * (i + 1)));
        console.log(`rowArr just pushed  ${i}; rowArr now holds: ${rowArr}`)
    }
    console.log("-------------------------------------------");

    // you won't ever have a case where col and row "steps" (think about the diagonal cases) are off by more than one. 
    if (colArr.length === 0) {  // catches cases where only the ROW changes; set the colIdx to be source
        console.log("colArr.length === 0");
        let limit = rowArr.length;
        for (let i = 0; i < limit; i++) {
            board[sourceColIdx][rowArr.pop()] = turn;
        }
        console.log("-------------------------------------------");
    } else if (rowArr.length === 0) {   // catches cases where only the COLUMN changes; set the rowIdx to source
        console.log("rowArr.length === 0");
        let limit = colArr.length;
        for (let i = 0; i < limit; i++) {
            board[colArr.pop()][sourceRowIdx] = turn;
        }
        console.log("-------------------------------------------");
    } else {
        console.log("rowArr.length !== 0 and colArr.length !== 0");
        let limit = colArr.length;
        for (let i = 0; i < limit; i++) {
            board[colArr.pop()][rowArr.pop()] = turn;
        }
        console.log("-------------------------------------------");
    }
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

    // console.log(`checkDownLegal(colIdx,rowIdx): ${checkDownLegal(colIdx,rowIdx)}
    // \ncheckUpLegal(colIdx,rowIdx): ${checkUpLegal(colIdx,rowIdx)}`);
    console.log(`CLICKED ON board[${colIdx}][${rowIdx}]`);

    // if (checkDownLegal(colIdx, rowIdx) || checkUpLegal(colIdx, rowIdx)) {
        let booly = false;
        // console.log("One OR more checkLegals is TRUE")
        // the tile above 

        // you have to assign the value of this nested index inside of this comprehensive if statement; otherwise,
        // you could have a case where you assign a turn value without making sure the move is legal in the first place
        // set the nested index to be whichever player's turn it is 
        if (checkDownLegal(colIdx, rowIdx)) {
            checkDown(colIdx, rowIdx);
            if (!(globalCol === null || globalRow === null)) {
                convert(colIdx, rowIdx, globalCol, globalRow);
                booly = true;      // we create a function scoped boolean that's ONLY assigned to true if a checkDir
            }
        }
        if (checkUpLegal(colIdx, rowIdx)) {
            checkUp(colIdx, rowIdx);
            if (!(globalCol === null || globalRow === null)) {
                convert(colIdx, rowIdx, globalCol, globalRow);
                booly = true;
            }
        }

        if (checkLeftLegal(colIdx, rowIdx)) {
            checkLeft(colIdx, rowIdx);
            if (!(globalCol === null || globalRow === null)) {
                convert(colIdx, rowIdx, globalCol, globalRow);
                booly = true;
            }
        }
        if (checkRightLegal(colIdx, rowIdx)) {
            checkRight(colIdx, rowIdx);
            if (!(globalCol === null || globalRow === null)) {
                convert(colIdx, rowIdx, globalCol, globalRow);
                booly = true;
            }
        }
        if (checkTopLeftLegal(colIdx, rowIdx)) {
            checkTopLeft(colIdx, rowIdx);
            if (!(globalCol === null || globalRow === null)) {
                convert(colIdx, rowIdx, globalCol, globalRow);
                booly = true;
            }
        }
        

        if (checkBotRightLegal(colIdx, rowIdx)) {
            checkBotRight(colIdx, rowIdx);
            if (!(globalCol === null || globalRow === null)) {
                convert(colIdx, rowIdx, globalCol, globalRow);
                booly = true;
            }
        }


        if (booly) {
            board[colIdx][rowIdx] = turn;   // need to be careful with this; JUST because a move is legal, that ONLY means the
            console.log(`board[${colIdx}][${rowIdx}]'s value (turn) is now: ${turn}`)
            turn *= -1; // necessarily need this here, because so long as the player hasn't clicked, it is STILL that player's turn
            // hands the turn back over to the other player; look at init() for initial turn value
            console.log(`turn just changed to: ${turn}`)
        }
    // }
    // this if statement above will need to include the checkLegals for all directions; also, we want to use
    // the OR gates because so long as ONE of checks are legal, we can let the user click there
    // TODO worry about changing the border to dashed and hover/mouseEnter logic



    console.log("calling render() from handleClick()");
    console.log("-------------------------------------------");

    render();
    // calls render() to have the front-end reflect the newly updated app state

}