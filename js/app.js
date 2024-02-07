'use strict'

var gBoard

var gLevel = {
    SIZE: 4,
    MOSQUITO: 2
}

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
    gBoard = buildBoard()
    renderBoard(gBoard)
    
    

    // for (let i = 0; i < gBoard.length; i++) {
    //     for (let j = 0; j < gBoard[0].length; j++) {
    //         renderCell({i: i, j: j}, setMosquitoesNegsCount(gBoard, i, j))
    //     }
    // }
}

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
    randSpreadMosquitoes(board)
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
			const numMosqNegs = setMosquitoesNegsCount(board, i, j)
        }
    }

    // console.log(board)
    return board
}
    
function setMosquitoesNegsCount(board, rowIdx, colIdx) {
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

    board[rowIdx][colIdx].mosquitoesAroundCount = count
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
                        'oncontextmenu="onCellMarked(this)">\n' +
                        '\t</td>\n'
                        
        }

        strHTML += '</tr>\n'
    }

    console.log('strHTML:\n', strHTML)
    elBoard.innerHTML = strHTML
    elBoard.addEventListener("contextmenu", e => e.preventDefault())
}

function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location)
    // console.log('cellSelector:', cellSelector)
	const elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
    // console.log('elCell:', elCell)
}

function onCellClicked(elCell, i, j) {
    if (elCell.classList.contains('mosquito')) {
        renderCell({i: i, j: j}, MOSQUITO_IMG)
        // console.log('Ouch! I hate mosquitoes!!!')
    }
    else {
        elCell.innerHTML = setMosquitoesNegsCount(gBoard, i, j)
    }

    gBoard[i][j].isShown = true
}

function onCellMarked(elCell) {
    elCell.innerHTML = REPELLENT_IMG

    console.log(elCell)
}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}

function randSpreadMosquitoes(board) {
    const rows = board.length
    const cols = board[0].length
    
    var numMosquitoes = 0
    while (numMosquitoes !== gLevel.MOSQUITO) {
        for (let i = 0; i < gLevel.MOSQUITO; i++) {
            var randI = getRandomInt(0, rows - 1)
            var randJ = getRandomInt(0, cols - 1)

            if (board[randI][randJ].isMosquito === false) {
                board[randI][randJ].isMosquito = true
                numMosquitoes++
            }
        }

        if (numMosquitoes !== gLevel.MOSQUITO) {
            numMosquitoes = 0
            board[randI][randJ].isMosquito = false
        }
    }
}

