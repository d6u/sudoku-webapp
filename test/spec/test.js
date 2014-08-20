/* global describe, it */

(function (window, expect, undefined) {
'use strict';

describe('generateSudokuMatrix()', function () {

  it('should provide a resolved sudoku', function () {

  	var FULL_NUMBERS = [1,2,3,4,5,6,7,8,9];

  	var matrix = window.generateSudokuMatrix();

  	for (var i = 0; i < 9; i++) {
  	  var results = [];
  	  for (var j = 0; j < 9; j++) {
  	    results.push(matrix[i][j]);
  	  }
  	  expect(results).members(FULL_NUMBERS);
  	}

  	for (var i = 0; i < 9; i++) {
  	  var results = [];
  	  for (var j = 0; j < 9; j++) {
  	  	results.push(matrix[j][i]);
  	  }
  	  expect(results).members(FULL_NUMBERS);
  	}

  	for (var i = 0; i < 3; i++) {
  	  for (var j = 0; j < 3; j++) {
  	    var results = [];
  	    for (var x = 0; x < 3; x++) {
  	      for (var y = 0; y < 3; y++) {
  	      	results.push(matrix[i * 3 + x][j * 3 + y]);
  	      }
  	    }
  	    expect(results).members(FULL_NUMBERS);
  	  }
  	}

  });

});

})(window, expect);
