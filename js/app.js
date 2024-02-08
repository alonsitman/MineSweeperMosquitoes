'use strict'

var gBoard

var gLevels = [
    { SIZE: 4, MOSQUITO: 2 },
    { SIZE: 8, MOSQUITO: 14},
    { SIZE: 12, MOSQUITO: 32}
]

var gLevel = gLevels[0]

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

const MOSQUITO_IMG = '<img src="img/mosquito2.png">'
const REPELLENT_IMG = '<img src="img/repellent.png">'

function onInit() {
    gGame.isOn = true
    resetMosqsCount()
    gBoard = buildBoard()
    renderBoard(gBoard)
}


//////////////////////////////// Create & Populate Board ////////////////////////////////

function buildBoard() {
    const rows = gLevel.SIZE
    const cols = gLevel.SIZE
    const board = createMat(rows, cols)
    

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            board[i][j] = {mosquitoesAroundCount: 0,
                            isShown: false,
                            isMosquito: false,
                            isMarked: false
                        }
        }
    }

    // board[0][2].isMosquito = true
    // board[1][1].isMosquito = true
    randPositionMosquitoes(board)    
    setMosquitoesNegsCount(board)

    // console.log(board)
    return board
}

function randPositionMosquitoes(board) {    
    var numMosquitoes = 0
    while (numMosquitoes < gLevel.MOSQUITO) {
        for (let i = 0; i < gLevel.MOSQUITO; i++) {
            const randI = getRandomInt(0, board.length - 1)
            const randJ = getRandomInt(0, board[0].length - 1)

            if (board[randI][randJ].isMosquito === false && numMosquitoes < gLevel.MOSQUITO) {
                board[randI][randJ].isMosquito = true
                numMosquitoes++
            }
        }
    }
}

function setMosquitoesNegsCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            board[i][j].mosquitoesAroundCount = countNegMosqs(board, i, j)
        }
    }
}
    
function countNegMosqs(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMosquito === true) count++
        }
    }

    // board[rowIdx][colIdx].mosquitoesAroundCount = count
    // console.log('neighboring mosquitoes count: ' + rowIdx + ' ' + colIdx + ' - ' + count)
    return count
}

function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    
    var strHTML = ''
    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        
        for (let j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var cellClass = getClassName({i: i, j: j})

            if (currCell.isMosquito === true) cellClass += ' mosquito'

            strHTML += '\t<td class="cell ' + cellClass +
                        '" onclick="onCellClicked(this, ' + i + ', ' + j + ')" ' +
                        'oncontextmenu="onCellMarked(this, ' + i + ', ' + j + ')">\n' +
                        '\t</td>\n'
                        
        }

        strHTML += '</tr>\n'
    }

    console.log('strHTML:\n', strHTML)
    elBoard.innerHTML = strHTML
    elBoard.addEventListener("contextmenu", e => e.preventDefault())
}

/////////////////////////////////////////////////////////////////////////////////////////

// function renderCell(location, value) {
//     const cellSelector = '.' + getClassName(location)
//     // console.log('cellSelector:', cellSelector)
// 	const elCell = document.querySelector(cellSelector)
// 	elCell.innerHTML = value
//     // console.log('elCell:', elCell)
// }

function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]    
    
    if (cell.isMarked) return

    if (cell.mosquitoesAroundCount) {
        elCell.innerHTML = cell.mosquitoesAroundCount
    }
    else {
        elCell.innerHTML = 'expanded'
    }

    cell.isShown = true
    checkGameOver(elCell)
}

function onCellMarked(elCell, i, j) {
    const cell = gBoard[i][j] 
    
    if (cell.isShown) return
    else if (cell.isMarked) {
        elCell.innerHTML = ''
        cell.isMarked = false
    }
    else {
        elCell.innerHTML = REPELLENT_IMG
        cell.isMarked = true
    }

    console.log(elCell)
}

function checkGameOver(elCell) {
    const numCells = gLevel.SIZE ** 2
    
    // Lose: clicked cell is mosquito
    if (elCell.classList.contains('mosquito')) {
    elCell.innerHTML = MOSQUITO_IMG
    // game over - call function lose()
    console.log('Ouch! I hate mosquitoes!!!')
    }
    // Win: all not mosquito cells shown and all mosquito cells marked 
    else if (gGame.shownCount === numCells - gLevel.MOSQUITO && gGame.markedCount === gLevel.MOSQUITO) {
    
        console.log('You Win!')
    }
}

function expandShown(board, elCell, i, j) {

}


function resetMosqsCount() {
    const elMosqsLeft = document.querySelector('[data-mosqs-left]')
    elMosqsLeft.innerHTML = gLevel.MOSQUITO
}

function setLevel(elBtn) {
    if (elBtn.innerHTML === 'Beginner') gLevel = gLevels[0]
    else if (elBtn.innerHTML === 'Medium')  gLevel = gLevels[1]
    else if (elBtn.innerHTML === 'Expert')  gLevel = gLevels[2]
    console.log(gLevel)
    
    onInit()
}
