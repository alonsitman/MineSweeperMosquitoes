'use strict'

function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomInt(min, max) { 
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getClassName(location) {
	const cellClass = '' + location.i + '-' + location.j
	return cellClass
}

// for these to work need css class .hide or different solution
function showElement(selector) {
    const element = document.querySelector(selector)
    element.classList.remove('hide')
}

function hideElement(selector) {
    const element = document.querySelector(selector)
    element.classList.add('hide')
}
///////////////////////////////////////////////////////////////


