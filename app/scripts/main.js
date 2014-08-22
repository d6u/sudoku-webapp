/* global _: false */

(function(window, _, $, undefined) {
'use strict';

var FULL_NUMBERS = [1,2,3,4,5,6,7,8,9];

function nextCell(x, y, numbers, matrix) {
  if (y > 8) return true;
  if (x === 0) numbers = FULL_NUMBERS;

  var nx = x + 1;
  var ny = y;
  if (nx > 8) {
    nx = 0;
    ny = y + 1;
  }

  var usedNumbers = [];

  for (var i = 0; i < y; i++) {
    usedNumbers.push(matrix[x][i]);
  }

  var xbase = Math.floor(x / 3);
  var ybase = Math.floor(y / 3);

  for (var i = ybase * 3; i < ybase * 3 + 3; i++) {
    var _break = false;
    for (var j = xbase * 3; j < xbase * 3 + 3; j++) {
      var value = matrix[j][i];
      if (value) {
        usedNumbers.push(value);
      } else {
        _break = true;
        break;
      }
    }
    if (_break) break;
  }

  var selectableNumbers = _.difference(numbers, usedNumbers);

  var n, nextNumbers;
  do {
    selectableNumbers = _.without(selectableNumbers, n);
    if (!selectableNumbers.length) {
      matrix[x][y] = undefined;
      return false;
    }
    n = _.sample(selectableNumbers);
    matrix[x][y] = n;
    nextNumbers = _.without(numbers, n);
  } while (!nextCell(nx, ny, nextNumbers, matrix));

  return true;
}

var generateSudokuMatrix = window.generateSudokuMatrix = function() {
  var matrix = new Array(9);
  for (var i = 0; i < 9; i++) {
    matrix[i] = new Array(9);
  }

  nextCell(0, 0, FULL_NUMBERS, matrix);

  return matrix;
};

var getRandomCoords = window.getRandomCoords = function () {
  var emptyNum = _.random(20, 40);
  var coords   = [];
  for (var i = 0; i < emptyNum; i++) {
    var invalid = true;
    while (invalid) {
      var x = _.random(0, 8);
      var y = _.random(0, 8);
      if (!_.find(coords, [x, y])) {
        coords.push([x, y]);
        invalid = false;
      }
    }
  }
  return coords;
};

var generateSudokuPuzzel = window.generateSudokuPuzzel = function() {
  var matrix = generateSudokuMatrix();
  var coords = getRandomCoords();
  for (var i = 0; i < coords.length; i++) {
    var x = coords[i][0];
    var y = coords[i][1];
    matrix[y][x] = null;
  }
  return matrix;
};

var fillBoard = window.fillBoard = function() {
  var matrix = generateSudokuPuzzel();
  for (var x = 0; x < 9; x++) {
    for (var y = 0; y < 9; y++) {
      var n = matrix[y][x];
      var $number = $('.number.row-'+y+'.column-'+x);
      if (n != null) {
        $number.html(n);
      } else {
        $number.attr('class', $number.attr('class')+' empty');
      }
    }
  }
};

fillBoard();

})(window, _, jQuery);
