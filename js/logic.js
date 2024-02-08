'use strict'

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

    board[rowIdx][colIdx].mosquitoesAroundCount = count
    // console.log('neighboring mosquitoes count: ' + rowIdx + ' ' + colIdx + ' - ' + count)
    return count
}

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

function checkGameOver() {
    
}