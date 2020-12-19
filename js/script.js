// Maze generator: https://codepen.io/sebastianomorando/pen/bJwVWG

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
    cheeseMatrix[J][i] = null;
    totalCheeses--;
}

function setCheese( element )
{
    var cheeseI = Math.floor( Math.random() * numRows );
    var cheeseJ = Math.floor( Math.random() * numColumns );
    if( isCheese( cheeseI, cheeseJ ) ) {
        setCheese();
    }
    cheeseMatrix[cheeseI][cheeseJ] = element;
    element.style.transition = `-webkit-transform 1s`;
    var cheeseX = -( getOffsetLeft( element ) ) + mazeOffsetLeft + 10;
    var cheeseY = -( getOffsetTop( element ) ) + mazeOffsetTop + 10;
    cheeseX += cheeseI * 50;
    cheeseY += cheeseJ * 50
    element.style.transform = `translate( ${ cheeseX }px, ${ cheeseY }px )`;
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
        setCheese( cheeses[i]);
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

function getDegrees( newDirection )
{
    var diff = currentDirection - newDirection;
    if( diff % 2 === 0 ) {
        return diff * 90;
    }
    if( Math.abs( diff ) === 1 ) {
        return diff * -90;
    }
    return ( diff % 2 ) * 90;
}

function getI( direction ) 
{
    if( direction === upDir ) {
        return currentI - 1;
    }
    if( direction === downDir ) {
        return currentI + 1;
    }
    return currentI;
}

function getJ( direction ) 
{
    if( direction === rightDir ) {
        return currentJ + 1;
    }
    if( direction === leftDir ) {
        return currentJ - 1;
    }
    return currentJ;
}

function transUp( isScale )
{
    currentI--;
    transMouse( 0, -50, getDegrees( 0 ), 1, isScale );
}

function transDown( isScale )
{
    currentI++;
    transMouse( 0, 50, getDegrees( 2 ), 1, isScale );
}

function transLeft( isScale )
{
    currentJ--;
    transMouse( -50, 0, getDegrees( 3 ), 1, isScale );
}

function transRight( isScale )
{
    currentJ++;
    transMouse( 50, 0, getDegrees( 1 ), 1, isScale );
}

function rotateMouse( degrees, secs )
{
    transMouse( 0, 0, degrees, secs );
}

function transMouse( x, y, degrees, secs, isScale ) 
{
    currentX += x;
    currentY += y;
    currentDegrees += degrees;
    currentDegrees %= 360;
    currentDirection = currentDegrees / 90;
    mouse.style.transition = `-webkit-transform ${ secs }s`;
    if( isScale ) {
        mouse.style.transform = `translate( ${ currentX }px, ${ currentY }px ) rotate( ${ currentDegrees }deg ), scale( 5, 5 )`;
    } else {
        mouse.style.transform = `translate( ${ currentX }px, ${ currentY }px ) rotate( ${ currentDegrees }deg )`;
    }
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
    rotateMouse(  10, .1 );
    sleep(150).then(() => { rotateMouse( -20, .1 ) });
    sleep(200).then(() => { rotateMouse( 20, .1 ) });
    sleep(250).then(() => { rotateMouse( -20, .1 ) });
    sleep(300).then(() => { rotateMouse(  10,  .2 ) });
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
var restart;

function doWin()
{
    messageDiv.innerHTML = "You win!"
}

function doLose()
{
    messageDiv.innerHTML = "You lose!"
}

function doMove( direction, isCheeseDir )
{
    switch( direction ) {
        case 0: transUp( isCheeseDir ); break;
        case 1: transRight( isCheeseDir ); break;
        case 2: transDown( isCheeseDir ); break;
        case 3: transLeft( isCheeseDir ); break;
    }
}

var pauseLength = 0;

function moveMouse( direction, isRecurse )
{
    pauseLength += 100;
    var isValidMove = validateMove( direction );
    if( isValidMove ) {
        var nextI = getI( direction);
        var nextJ = getJ( direction );
        if( nextI === numRows || nextJ === numColumns ) {
            if( totalCheeses === 0 ) {
                doWin();
            } else {
                doLose();
            }
            doMove( direction, false );
            return;
        }
        var isCheeseDir = isCheese( nextI, nextJ );
        doMove( direction, isCheeseDir );
        if( isCheeseDir ) {
            sleep(100).then(() => { removeCheese( nextI, nextJ ) });
            wiggleMouse()
        }
        if( isRecurse ) {
            sleep(pauseLength).then(() => { moveMouse( direction, isRecurse ) }); 
        }
        return;

    } else {
        rotateMouse( getDegrees( direction), 1 );
        bounceMouse( direction );
        wiggleMouse();
        pauseLength = 0;
        isRecurse = false;
    }
}

function log( s )
{
    console.log( s );
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

function setArrowOnclick( elements, direction, isRecursive )
{
    for( var i = 0; i < elements.length; i++ ) {
        elements[i].onclick = function() {
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

window.onload = function() 
{
    var mouse = document.getElementById( "mouse" );
    var maze = document.getElementById( "maze" );
    mazeOffsetLeft = getOffsetLeft( maze );
    mazeOffsetTop = getOffsetTop( maze );
    makeMaze();

    messageDiv = document.getElementById( "message" );

    restart = document.getElementById( "restart" );
    restart.onclick = function()
    {
        location.reload();
    };

    var spinBtn = document.getElementById( "spin" );
    spinBtn.onclick = function()
    {
        wiggleMouse();
    };

    var upBtns = document.getElementsByClassName( "upBtn" );
    setArrowOnclick( upBtns, 0, false );
    upBtns = document.getElementsByClassName( "upBtn2" );
    setArrowOnclick( upBtns, 0, true );

    var rightBtns = document.getElementsByClassName( "rightBtn" );
    setArrowOnclick( rightBtns, 1, false );
    rightBtns = document.getElementsByClassName( "rightBtn2" );
    setArrowOnclick( rightBtns, 1, true );

    var downBtns = document.getElementsByClassName( "downBtn" );
    setArrowOnclick( downBtns, 2, false );
    downBtns = document.getElementsByClassName( "downBtn2" );
    setArrowOnclick( downBtns, 2, true );

    var leftBtns = document.getElementsByClassName( "leftBtn" );
    setArrowOnclick( leftBtns, 3, false );
    leftBtns = document.getElementsByClassName( "leftBtn2" );
    setArrowOnclick( leftBtns, 3, true );

};

