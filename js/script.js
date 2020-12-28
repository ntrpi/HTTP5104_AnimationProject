/********************************** Borrowed code ********************************/
// I got most of the code to generate the maze from here:
// https://codepen.io/sebastianomorando/pen/bJwVWG
// I understand all of it and could write it myself with enough time.

var numberOfCells = 0;
var visitedCells = 0;
const numRows = 8;
const numColumns = 8;

class Wall
{
    constructor( options = {} )
    {
        this.leftCell = options.leftCell || null;
        this.rightCell = options.rightCell || null;
        this.topCell = options.topCell || null;
        this.bottomCell = options.bottomCell || null;
        this.removed = false;
    }

    remove()
    {
        this.removed = true;
    }
}

class Cell
{
    constructor( options = {} )
    {
        this.leftWall = options.leftWall || null;
        this.rightWall = options.rightWall || null;
        this.topWall = options.topWall || null;
        this.bottomWall = options.bottomWall || null;
        this.visited = false;
        numberOfCells++;
    }

    visit()
    {
        this.visited = true;
        visitedCells++;
    }

    hasUnvisitedNeighbours()
    {
        if( this.leftWall && this.leftWall.leftCell && !this.leftWall.leftCell.visited ) return true;
        if( this.rightWall && this.rightWall.rightCell && !this.rightWall.rightCell.visited ) return true;
        if( this.topWall && this.topWall.topCell && !this.topWall.topCell.visited ) return true;
        if( this.bottomWall && this.bottomWall.bottomCell && !this.bottomWall.bottomCell.visited ) return true;
        return false;
    }

    getUnvisitedNeighbours()
    {
        let result = [];
        if( this.leftWall && this.leftWall.leftCell && !this.leftWall.leftCell.visited ) {
            result.push( { cell: this.leftWall.leftCell, wall: this.leftWall } );
        }
        if( this.rightWall && this.rightWall.rightCell && !this.rightWall.rightCell.visited ) {
            result.push( { cell: this.rightWall.rightCell, wall: this.rightWall } );
        }
        if( this.topWall && this.topWall.topCell && !this.topWall.topCell.visited ) {
            result.push( { cell: this.topWall.topCell, wall: this.topWall } );
        }
        if( this.bottomWall && this.bottomWall.bottomCell && !this.bottomWall.bottomCell.visited ) {
            result.push( { cell: this.bottomWall.bottomCell, wall: this.bottomWall } );
        }
        return result;
    }

    getRandomUnvisitedNeighbour()
    {
        let unvisitedNeighbours = this.getUnvisitedNeighbours();
        return unvisitedNeighbours[ Math.floor( Math.random() * unvisitedNeighbours.length ) ];
    }
}

var cellMatrix = [];

function initMaze( horizontalCells, verticalCells )
{
    // build cells
    for( let i = 0; i < verticalCells; i++ ) {
        cellMatrix[ i ] = [];
        for( let j = 0; j < horizontalCells; j++ ) {
            cellMatrix[ i ][ j ] = new Cell();
        }
    }

    //build horizontal walls
    for( let i = 0; i < verticalCells; i++ ) {
        for( let j = 0; j < ( horizontalCells - 1 ); j++ ) {
            let wall = new Wall();
            wall.leftCell = cellMatrix[ i ][ j ];
            wall.rightCell = cellMatrix[ i ][ j + 1 ];
            cellMatrix[ i ][ j ].rightWall = wall;
            cellMatrix[ i ][ j + 1 ].leftWall = wall;

            if( j === 0 ) {
                cellMatrix[ i ][ j ].leftWall = new Wall();
                cellMatrix[ i ][ j ].leftWall.rightCell = cellMatrix[ i ][ j ];
            }

            if( i === verticalCells - 1 ) {
                cellMatrix[ i ][ j ].bottomWall = new Wall();
                cellMatrix[ i ][ j ].bottomWall.topCell = cellMatrix[ i ][ j ];
            }

        }
    }

    // build vertical walls
    for( let i = 0; i < ( verticalCells - 1 ); i++ ) {
        for( let j = 0; j < horizontalCells; j++ ) {
            let wall = new Wall();
            wall.topCell = cellMatrix[ i ][ j ];
            wall.bottomCell = cellMatrix[ i + 1 ][ j ];
            cellMatrix[ i ][ j ].bottomWall = wall;
            cellMatrix[ i + 1 ][ j ].topWall = wall;

            if( i === 0 ) {
                cellMatrix[ i ][ j ].topWall = new Wall();
                cellMatrix[ i ][ j ].topWall.bottomCell = cellMatrix[ i ][ j ];
                if( j === 0 ) cellMatrix[ i ][ j ].topWall.remove();
            }

            if( j === horizontalCells - 1 ) {
                cellMatrix[ i ][ j ].rightWall = new Wall();
                cellMatrix[ i ][ j ].rightWall.leftCell = cellMatrix[ i ][ j ];
            }

        }
    }

}

function generateMaze( startingCell )
{
    const cellStack = [];
    let currentCell = startingCell;
    let neighbour = null;
    startingCell.visit();

    for( let i = 0; visitedCells <= numberOfCells; i++ ) {
        if( i > 10000 ) break;
        if( currentCell.hasUnvisitedNeighbours() ) {
            neighbour = currentCell.getRandomUnvisitedNeighbour();
            cellStack.push( currentCell );
            neighbour.wall.remove();
            currentCell = neighbour.cell;
            currentCell.visit();
        } else {
            if( cellStack.length ) currentCell = cellStack.pop();
        }
    }
}

/********************************** End of borrowed maze code ************************************/

function renderTable( cellMatrix, parent )
{
    for( let i = 0; i < cellMatrix.length; i++ ) {

        let row = parent.insertRow( i );

        for( let j = 0; j < cellMatrix[ i ].length; j++ ) {

            // Create a new cell.
            let cell = row.insertCell( j );

            // Add some cell styling.
            var cellStyle = document.createAttribute( "class" );
            cellStyle.value = "cellStyle ";

            if( cellMatrix[ i ][ j ].leftWall ) {
                cellStyle.value += cellMatrix[ i ][ j ].leftWall.removed ? "" : " wallLeft ";
            }
            if( cellMatrix[ i ][ j ].rightWall ) {
                cellStyle.value += cellMatrix[ i ][ j ].rightWall.removed ? "" : " wallRight ";
            }
            if( cellMatrix[ i ][ j ].topWall ) {
                cellStyle.value += cellMatrix[ i ][ j ].topWall.removed ? "" : " wallTop ";
            }
            if( cellMatrix[ i ][ j ].bottomWall ) {
                cellStyle.value += cellMatrix[ i ][ j ].bottomWall.removed ? "" : " wallBottom ";
            }
            cell.setAttributeNode( cellStyle );
        }
    }
}

var cheeseMatrix;
var mazeOffsetLeft;
var mazeOffsetTop;

var totalCheeses = 0;

function isCheese( i, j ) 
{
    return cheeseMatrix[j][i] != null;
}

function removeCheese( i, j )
{
    cheeseMatrix[j][i].style.display = "none";
    cheeseMatrix[j][i] = null;
    totalCheeses--;
    if( totalCheeses === 0 ) {
        setMessage( "Good work! Now finish the maze!", "1.2em" );
    }
}

function setCheese( element )
{
    if( element === undefined ) {
        return false;
    }
    var cheeseI = Math.floor( Math.random() * numRows );
    var cheeseJ = Math.floor( Math.random() * numColumns );
    if( isCheese( cheeseI, cheeseJ ) ) {
        setCheese();
    }
    cheeseMatrix[cheeseI][cheeseJ] = element;
    element.style.transition = `-webkit-transform 1s`;
    var cheeseX = -( getOffsetLeft( element ) ) + mazeOffsetLeft + 10;
    var cheeseY = -( getOffsetTop( element ) ) + mazeOffsetTop + 10;
    cheeseX += cheeseI * unit;
    cheeseY += cheeseJ * unit
    element.style.transform = `translate( ${ cheeseX }px, ${ cheeseY }px )`;
    return true;
}

function initCheese()
{
    totalCheeses = 0;
    cheeseMatrix = new Array( numRows );
    for( var i = 0; i < numRows; i++ ) {
        cheeseMatrix[i] = [];
        for( var j = 0; j < numColumns; j++ ) {
            cheeseMatrix[i].push( null );
        }
    }

    var cheeses = document.getElementsByClassName( "cheese" );
    for( var i = 0; i < cheeses.length; i++ ) {
        var result = setCheese( cheeses[i]);
        if( !result ) {
            console.log( "Trying to set cheese again." );
        }
        totalCheeses++;
    }
}

const unit = 50;
const upDir = 0;
const rightDir = 1;
const downDir = 2;
const leftDir = 3;

var currentI = -1;
var currentJ = 0;
var currentX = 0;
var currentY = 0;
var currentDegrees = 0;
var currentDirection = 0;

function getDegrees( direction )
{
    if( currentDirection < 0 ) {
        currentDirection = 4 + currentDirection;
    }
    var diff = currentDirection - direction;
    if( diff === 0 || diff === 2 ) { // Could use % here but this is more efficient.
        return diff * 90;
    }
    if( diff === 1 || diff === -1 ) { // Could use Math.abs here but this is more efficient.
        return diff * -90;
    }
    return ( diff % 2 ) * 90;
}

function getDirection( i, j )
{
    var diffI = currentI - i;
    var diffJ = currentJ - j;
    if( diffI === 0 ) {
        return 2 + diffJ;
    } else {
        return 1 - diffI;
    }
}

function getIJ( direction ) 
{
    var ij = new Array(2);
    ij[0] = direction === 0 || direction === 2 ? currentI + direction - 1 : currentI;
    ij[1] = direction === 1 || direction === 3 ? currentJ - direction + 2 : currentJ;
    return ij;
}

var transLength = 0.75;

function transUp()
{
    currentI--;
    transMouse( 0, -unit, getDegrees( 0 ), transLength );
}

function transDown()
{
    currentI++;
    transMouse( 0, unit, getDegrees( 2 ), transLength );
}

function transLeft()
{
    currentJ--;
    transMouse( -unit, 0, getDegrees( 3 ), transLength );
}

function transRight()
{
    currentJ++;
    transMouse( unit, 0, getDegrees( 1 ), transLength );
}

function rotateMouse( direction, secs )
{
    transMouse( 0, 0, getDegrees( direction ), secs );
}

function rotateMouseDegrees( degrees, secs )
{
    transMouse( 0, 0, degrees, secs );
}

function transMouse( x, y, degrees, secs ) 
{
    currentX += x;
    currentY += y;
    currentDegrees += degrees;
    currentDegrees %= 360;
    currentDirection = currentDegrees / 90;
    mouse.style.transition = `-webkit-transform ${ secs }s`;
    mouse.style.transform = `translate( ${ currentX }px, ${ currentY }px ) rotate( ${ currentDegrees }deg )`;
}

function resetRotation()
{
    mouse.style.transform = `translate( ${ currentX }px, ${ currentY }px )`;
    currentDirection = 0;
    currentDegrees = 0;
}

function validateMove( direction )
{
    // This is where we start. We can only go down.
    if( currentI === -1 ) {
        if( direction === downDir ) {
            return true;
        }
        return false;
    } 

    var cell = cellMatrix[currentI][currentJ];
    switch( direction ) {
        case upDir: return !cell.topWall || cell.topWall.removed; 
        case rightDir: return !cell.rightWall || cell.rightWall.removed;
        case downDir: return !cell.bottomWall || cell.bottomWall.removed; 
        case leftDir: return !cell.leftWall || cell.leftWall.removed; 
    }
}

function sleep( ms )
{
    return new Promise( resolve => setTimeout( resolve, ms ) );
}

function wiggleMouse()
{
    rotateMouseDegrees(  10, .1 );
    sleep(150).then(() => { rotateMouseDegrees( -20, .05 ) });
    sleep(200).then(() => { rotateMouseDegrees( 20, .05 ) });
    sleep(250).then(() => { rotateMouseDegrees( -20, .05 ) });
    sleep(300).then(() => { rotateMouseDegrees(  10,  .1 ) });
}

function bounceMouse( direction )
{
    switch( direction ) {
        case 0: 
                                    transMouse(  0, -5,  0, .2 );
            sleep(200).then(() => { transMouse(  0, 10,  0, .1 ) });
            sleep(100).then(() => { transMouse(  0, -5,  0, .2 ) });
            break;
        case 1: 
                                    transMouse(  5,   0,  0, .2 );
            sleep(200).then(() => { transMouse(  -10, 0,  0, .1 ) });
            sleep(100).then(() => { transMouse(  5,   0,  0, .2 ) });
            break;
        case 2: 
                                    transMouse(  0,  5,  0, .2 );
            sleep(200).then(() => { transMouse(  0, -10, 0, .1 ) });
            sleep(100).then(() => { transMouse(  0,  5,  0, .2 ) });
            break;
        case 3: 
                                    transMouse(  -5,  0,  0, .2 );
            sleep(200).then(() => { transMouse(  10,  0,  0, .1 ) });
            sleep(100).then(() => { transMouse(  -5,  0,  0, .2 ) });
            break;
    }
}

var messageDiv;
var backgroundColour = "#251d29";
var orange = "rgb(253, 176, 87)";

var restart;

function setMessage( msg, size )
{
    messageDiv.innerHTML = msg;
    messageDiv.style.color = orange;
    messageDiv.style.fontSize = size;
}

function removeMessage()
{
    messageDiv.style.color = backgroundColour;
}

function doWin()
{
    transLength = 0.5;
    setMessage( "You win!", "2.5em" );
    var cells = document.getElementsByClassName( "cellStyle" );
    for( var i = 0; i < cells.length; i++ ) {
        cells[i].style.border = "none";
    }
    var pLength = 1000;
    for( var i = 0; i < 5; i++ ) {
        sleep(pLength).then(() => { doMove( 0 ) });
        pLength += 300;
        sleep(pLength).then(() => { doMove( 3 ) });
        pLength += 300;
    }
    for( var i = 0; i < 40; i++ ) {
        sleep(pLength).then(() => { doMove( Math.floor( Math.random() * 4 ) ) });
        pLength += 300;
    }
}

function doLose()
{
    setMessage( "You didn't get all the cheese!", "1.5em" );
    var pLength = 1000;
    sleep(pLength).then(() => { doMove( 2 ) });
    pLength += 300;
    for( var i = 0; i < 20; i++ ) {
        sleep(pLength).then(() => { doMove( 3 ) });
        pLength += 300;
    }
}

function doMove( direction )
{
    switch( direction ) {
        case 0: transUp(); break;
        case 1: transRight(); break;
        case 2: transDown(); break;
        case 3: transLeft(); break;
    }
}

var pauseLength = 0;
var maxPauseLength = 0;

function moveMouse( direction, isRecurse )
{
    pauseLength += 75;
    maxPauseLength = maxPauseLength < pauseLength ? pauseLength : maxPauseLength;
    if( validateMove( direction ) ) {
        var nextIJ = getIJ( direction);

        // Exiting the maze.
        if( nextIJ[0] === numRows || nextIJ[1] === numColumns ) {
            doMove( direction );
            if( totalCheeses === 0 ) {
                doWin();
            } else {
                doLose();
            }
            return;
        }

        // Still in the maze.
        doMove( direction );

        // If we come to a cheese remove it and wiggle the mouse.
        if( isCheese( nextIJ[0], nextIJ[1] ) ) {
            sleep( 100 ).then(() => { removeCheese( nextIJ[0], nextIJ[1] ) });
            wiggleMouse();
        }

        // If we're recursing, wait for the last animation to finish and go again.
        if( isRecurse ) {
            sleep( pauseLength ).then(() => { moveMouse( direction, isRecurse ) }); 
        }

        // Correct rotation if necessary.
        var currentDir = Math.floor( ( currentDegrees < 0 ? 360 + currentDegrees : currentDegrees ) / 90 );
        if( direction > currentDir + 1 || direction < currentDir - 1 ) {
            resetRotation();
            rotateMouse( direction );
        }

    } else {

        // We're gonna hit a wall.
        rotateMouse( direction, 1 );
        bounceMouse( direction );
        wiggleMouse();

        // Stop the recursion.
        pauseLength = 0;
        isRecurse = false;
    }
}

function getOffsetLeft( element )
{
    var rect = element.getBoundingClientRect();
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    return rect.left + scrollLeft;
}

function getOffsetTop( element )
{
    var rect = element.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + scrollTop
}

function setArrowOnclick( elements, direction )
{
    for( var i = 0; i < elements.length; i++ ) {
        var element = elements[i];
        let isRecursive = element.classList.contains( "recurse" );
        element.onclick = function() {
            let dir = direction;
            let isRec = isRecursive;
            moveMouse( dir, isRec );
        }
    }
}

function makeMaze()
{
    numberOfCells = 0;
    visitedCells = 0;
    cellMatrix = [];

    initMaze( numRows, numColumns );
    generateMaze( cellMatrix[ 0 ][ 0 ] );

    maze.innerHTML = "";
    renderTable( cellMatrix, maze );

    transMouse( -( getOffsetLeft( mouse ) ) + mazeOffsetLeft + 15, -( getOffsetTop( mouse ) ) + mazeOffsetTop -45, 180, .1 );
    initCheese();
}

function checkKey(e) 
{    
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
        moveMouse( 0 );
    }
    else if (e.keyCode == '40') {
        // down arrow
        moveMouse( 2 );
    }
    else if (e.keyCode == '37') {
       // left arrow
        moveMouse( 3 );
    }
    else if (e.keyCode == '39') {
       // right arrow
        moveMouse( 1 );
    }
};

var mouse;

window.onload = function() 
{
    mouse = document.getElementById( "mouse" );
    var maze = document.getElementById( "maze" );
    mazeOffsetLeft = getOffsetLeft( maze );
    mazeOffsetTop = getOffsetTop( maze );
    makeMaze();

    messageDiv = document.getElementById( "message" );
    messageDiv.style.color = backgroundColour;

    restart = document.getElementById( "restart" );
    restart.onclick = function()
    {
        location.reload();
    };

    var upBtns = document.getElementsByClassName( "upBtn" );
    setArrowOnclick( upBtns, 0 );

    var rightBtns = document.getElementsByClassName( "rightBtn" );
    setArrowOnclick( rightBtns, 1 );

    var downBtns = document.getElementsByClassName( "downBtn" );
    setArrowOnclick( downBtns, 2 );

    var leftBtns = document.getElementsByClassName( "leftBtn" );
    setArrowOnclick( leftBtns, 3 );

    document.onkeyup = checkKey;

    // document.getElementById( "utilitity" ).onclick = function() {
    //     for( var i = 0; i < 9; i++ ) {
    //         transDown();
    //         transRight()
    //     }
    //         doWin();
    // }
};

window.addEventListener( "resize", function() {
    location.reload();
} );

