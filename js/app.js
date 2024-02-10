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
    secsPassed: 0,
    livesLeft: 3
}

const MOSQUITO_IMG = '<img src="img/mosquito2.png">'
const REPELLENT_IMG = '<img src="img/repellent.png">'
const COWBOY_EMOJI = '&#129312'
const SUNGLASSES_EMOJI = '&#128526'
const SKULL_EMOJI = '&#128128'
const HEART_EMOJI = '💙'

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
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    elBoard.addEventListener("contextmenu", e => e.preventDefault())

    const elHearts = document.querySelector('[data-lives-left]')
    elHearts.innerHTML = HEART_EMOJI + HEART_EMOJI +HEART_EMOJI
}

//////////////////////////////////// Event Handling ////////////////////////////////////

function onInit() {
    gGame.isOn = true
    resetMosqsCount()
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function onCellClicked(elCell, i, j) {
    if(gGame.isOn && !gGame.secsPassed) {
        startGame()
    }
    
    if(gGame.isOn) {
        const cell = gBoard[i][j]    
    
        if (cell.isMarked || cell.isShown) return
    
        cell.isShown = true
        gGame.shownCount++

        if (elCell.classList.contains('mosquito')) {
            sting(elCell)
        }
        else if (elCell.classList.contains('zero')){
            expandShown(elCell, i, j)
        }
        else {
            elCell.innerHTML = cell.mosquitoesAroundCount
        }

        checkGameOver()
    }
}

function onCellMarked(elCell, i, j) {
    if(!gGame.secsPassed) {
        startGame()
    }
    
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
        checkGameOver()
    }
}

function onRestart(elBtn) {
    restart()
    elBtn.innerHTML = COWBOY_EMOJI
}

function onSetLevel(elBtn) {
    if (elBtn.innerHTML === 'Beginner') gLevel = gLevels[0]
    else if (elBtn.innerHTML === 'Medium')  gLevel = gLevels[1]
    else if (elBtn.innerHTML === 'Expert')  gLevel = gLevels[2]
    
    restart()
}

//////////////////////////////// Further Logic & Display ////////////////////////////////

function checkGameOver() {
    const numCells = gLevel.SIZE ** 2    
    
    if (!gGame.livesLeft) gameOver('Lose')
    else if (gGame.markedCount === gLevel.MOSQUITO) {
        if (gGame.shownCount === numCells - gLevel.MOSQUITO) gameOver('Win')
        else gameOver('Lose')
    }
}

function gameOver(status) {
    var elSmileyBtn = document.querySelector('.state button')
    
    if (status === 'Lose') {
        const elMosquitoes = document.querySelectorAll('.mosquito')
        for (let i = 0; i < elMosquitoes.length; i++) {
            elMosquitoes[i].innerHTML = MOSQUITO_IMG
        }
        elSmileyBtn.innerHTML = SKULL_EMOJI
        console.log('Ouch! I hate mosquitoes!!!')
    }
    else if (status === 'Win') {
        elSmileyBtn.innerHTML = SUNGLASSES_EMOJI
        console.log('You Win!')
    }

    gGame.isOn = false
}

function sting(elCell) {
    elCell.classList.add('sting')
    elCell.innerHTML = MOSQUITO_IMG

    gGame.livesLeft--
    gGame.markedCount++
    displayMosqsLeft()

    const elHearts = document.querySelector('[data-lives-left]')
    elHearts.innerHTML = ''
    for (let j = 0; j < gGame.livesLeft; j++) {
        elHearts.innerHTML += HEART_EMOJI
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
            if(!currCell.isShown && !currCell.isMarked){
                currCell.isShown = true
                gGame.shownCount++
    
                const cellSelector = '.cell-' + getClassName({i: x, j: y})
                var elCurrCell = document.querySelector(cellSelector)
                if (!elCurrCell.classList.contains('mosquito')) elCurrCell.classList.add('expand')
                if (elCurrCell.classList.contains('number')) elCurrCell.innerHTML = currCell.mosquitoesAroundCount
                else if (elCurrCell.classList.contains('zero')) expandShown(elCurrCell, x, y)
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

function restart() {
    var elCounter = document.querySelector('.seconds-counter')
    elCounter.innerHTML = 0
    
    gGame.isOn = true
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.livesLeft = 3
    gGame.secsPassed = 0

    onInit()
}

function startGame() {
    gGame.isOn = true
    setTimeout(startTimer, 1000)
    countSeconds()
}

function startTimer() {
    gGame.secsPassed = 1
}

function countSeconds() { 
    var elCounter = document.querySelector('.seconds-counter')

    function incrementSeconds() {
        if (gGame.isOn && gGame.secsPassed) {
            elCounter.innerText = gGame.secsPassed
            gGame.secsPassed++
        }
        else {
            clearInterval(cancel)
        }
    }

    var cancel = setInterval(incrementSeconds, 1000)
}
