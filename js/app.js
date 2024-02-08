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

    randPositionMosquitoes(board)    
    setMosquitoesNegsCount(board)

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

    return count
}

function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    
    var strHTML = ''
    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        
        for (let j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            
            var cellClass
            if (currCell.isMosquito === true) cellClass = 'mosquito'
            else if (currCell.mosquitoesAroundCount) cellClass = 'number'
            else cellClass = 'zero'

            strHTML += '\t<td class="cell cell-' + i + '-' + j + ' ' + cellClass + '" ' +
                        'onclick="onCellClicked(this, ' + i + ', ' + j + ')" ' +
                        'oncontextmenu="onCellMarked(this, ' + i + ', ' + j + ')">\n' +
                        '\t</td>\n'
        }

        strHTML += '</tr>\n'
    }

    console.log('strHTML:\n', strHTML)
    elBoard.innerHTML = strHTML
    elBoard.addEventListener("contextmenu", e => e.preventDefault())
}

//////////////////////////////////// Event Handling ////////////////////////////////////

function onInit() {
    gGame.isOn = true
    resetMosqsCount()
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function onCellClicked(elCell, i, j) {
    if(gGame.isOn) {
        const cell = gBoard[i][j]    
    
        if (cell.isMarked || cell.isShown) return
    
        if (cell.mosquitoesAroundCount) {
            elCell.innerHTML = cell.mosquitoesAroundCount
        }
        else if (elCell.classList.contains('zero')){
            expandShown(elCell, i, j)
        }
    
        cell.isShown = true
        gGame.shownCount++
        checkGameOver(elCell)
    }
}

function onCellMarked(elCell, i, j) {
    if (gGame.isOn) {
        const cell = gBoard[i][j] 
    
        if (cell.isShown) return
        else if (cell.isMarked) {
            elCell.innerHTML = ''
            cell.isMarked = false
            gGame.markedCount--
        }
        else {
            elCell.innerHTML = REPELLENT_IMG
            cell.isMarked = true
            gGame.markedCount++
        }
    
        displayMosqsLeft()
    }
}

//////////////////////////////// Further Logic & Display ////////////////////////////////

function checkGameOver(elCell) {
    var status = 'In play'
    const numCells = gLevel.SIZE ** 2
    
    console.log('shown count:', gGame.shownCount)
    console.log('marked count:', gGame.markedCount)

    if (elCell.classList.contains('mosquito')) {
        status = 'Lose'
        elCell.innerHTML = MOSQUITO_IMG
        elCell.classList.add('sting')

    }
    else if (gGame.shownCount === numCells - gLevel.MOSQUITO && gGame.markedCount === gLevel.MOSQUITO) {
        status = 'Win'
    }

    gameOver(status)
}

function gameOver(status) {
    if (status === 'Lose') {
        gGame.isOn = false
        console.log('Ouch! I hate mosquitoes!!!')
    }
    else if (status === 'Win') {
        console.log('You Win!')
    }
}

function expandShown(elCell, i, j) {
    const rowIdx = i
    const colIdx = j

    elCell.classList.add('expand')
    
    for (var x = rowIdx - 1; x <= rowIdx + 1; x++) {
        if (x < 0 || x >= gBoard.length) continue
        for (var y = colIdx - 1; y <= colIdx + 1; y++) {
            if (x === rowIdx && y === colIdx) continue
            if (y < 0 || y >= gBoard[0].length) continue
            
            const currCell = gBoard[x][y]
            if(!currCell.isShown){
                currCell.isShown = true
                gGame.shownCount++
    
                const cellSelector = '.cell-' + getClassName({i: x, j: y})
                var elCurrCell = document.querySelector(cellSelector)
                elCurrCell.classList.add('expand')
                if (!elCurrCell.classList.contains('zero')) elCurrCell.innerHTML = currCell.mosquitoesAroundCount
            }
        }
    }
}

function resetMosqsCount() {
    const elMosqsLeft = document.querySelector('[data-mosqs-left]')
    elMosqsLeft.innerHTML = gLevel.MOSQUITO
}

function displayMosqsLeft() {
    const elMosqsLeft = document.querySelector('[data-mosqs-left]')
    elMosqsLeft.innerHTML = gLevel.MOSQUITO - gGame.markedCount
}

function setLevel(elBtn) {
    if (elBtn.innerHTML === 'Beginner') gLevel = gLevels[0]
    else if (elBtn.innerHTML === 'Medium')  gLevel = gLevels[1]
    else if (elBtn.innerHTML === 'Expert')  gLevel = gLevels[2]
    
    restart()
}

function restart() {
    gGame.isOn = true
    gGame.markedCount = 0
    gGame.shownCount = 0

    onInit()
}
