'use strict'

function onCellClicked(elCell, i, j) {
    if (elCell.classList.contains('mosquito')) {
        renderCell({i: i, j: j}, MOSQUITO_IMG)
        // console.log('Ouch! I hate mosquitoes!!!')
    }
    else {
        elCell.innerHTML = countNegMosqs(gBoard, i, j)
    }

    gBoard[i][j].isShown = true

    checkGameOver()
}

function onCellMarked(elCell) {
    elCell.innerHTML = REPELLENT_IMG

    console.log(elCell)
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