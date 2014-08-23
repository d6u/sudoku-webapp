/* global _: false */

(function(window, _, $, undefined) {
'use strict';

$.fn.extend({
  svgAddClass: function(classNames) {
    _.forEach(classNames.split(' '), function(className) {
      this.each(function() {
        var $this = $(this);
        var classList = $this.attr('class').split(' ');
        if (_.indexOf(classList, className) === -1) {
          classList.push(className);
          $this.attr('class', classList.join(' '));
        }
      });
    }, this);
    return this;
  },
  svgRemoveClass: function(classNames) {
    _.forEach(classNames.split(' '), function(className) {
      this.each(function() {
        var $this = $(this);
        var classList = $this.attr('class').split(' ');
        if (_.indexOf(classList, className) > -1) {
          classList = _.without(classList, className);
          $this.attr('class', classList.join(' '));
        }
      });
    }, this);
    return this;
  }
});

var FULL_NUMBERS = [1,2,3,4,5,6,7,8,9];
var CLICK_EVENT  = 'click';
var $groups      = $('.cell-num-g');

var nextCell = window.nextCell = function(x, y, numbers, matrix) {
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
  $groups.svgRemoveClass('empty invalid valid').each(function() {
    $(this).data({x: null, y: null, n: null}).find('.number').empty();
  });
  for (var x = 0; x < 9; x++) {
    for (var y = 0; y < 9; y++) {
      var n = matrix[y][x];
      var $g = $('.cell-num-g.row-'+y+'.column-'+x);
      $g.data({x: x, y: y});
      if (n != null) {
        $g.data({n: n}).children('.number').html(n);
      } else {
        $g.svgAddClass('empty');
      }
    }
  }
};

var NumPad = window.NumPad = function() {
  var $numPad = this.$numPad = $('.num-pad');
  var $backplate = this.$backplate = $('.num-pad-backplate');

  $numPad.on(CLICK_EVENT, '.num-pad-cell', function() {
    $numPad.trigger('numSelect', Number($(this).attr('data-num')));
  });

  $backplate.on(CLICK_EVENT, function() {
    $numPad.off('numSelect');
    $backplate.svgAddClass('hide');
    $numPad.svgAddClass('hide');
    $backplate.trigger('backplateClicked');
  });

  this.showNumPad = function(x, y, callback, cancel) {
    $backplate.svgRemoveClass('hide');
    $numPad.attr('class', 'num-pad').svgRemoveClass('hide').svgAddClass('pos-'+x+'-'+y);
    $numPad.off('numSelect').one('numSelect', function(event, n) {
      callback(n);
      $backplate.svgAddClass('hide');
      $numPad.svgAddClass('hide');
    });
    $backplate.off('backplateClicked').one('backplateClicked', cancel);
  };
};

var numPad = new NumPad();

var validateSolution = window.validateSolution = function() {

  $groups.svgRemoveClass('invalid');

  var count = 0;

  for (var x = 0; x < 9; x++) {
    var array = [], filled = true, $eles = $();
    for (var y = 0; y < 9; y++) {
      var $el = $groups.filter('.row-'+y+'.column-'+x);
      var n   = $el.data('n');
      if (n != null) {
        array.push(n);
        $eles = $eles.add($el);
      } else {
        filled = false;
        break;
      }
    }
    if (filled) {
      var rest = _.difference(FULL_NUMBERS, array);
      if (!rest.length) {
        count++;
      } else {
        $eles.svgAddClass('invalid');
      }
    }
  }

  for (var y = 0; y < 9; y++) {
    var array = [], filled = true, $eles = $();
    for (var x = 0; x < 9; x++) {
      var $el = $groups.filter('.row-'+y+'.column-'+x);
      var n   = $el.data('n');
      if (n != null) {
        array.push(n);
        $eles = $eles.add($el);
      } else {
        filled = false;
        break;
      }
    }
    if (filled) {
      var rest = _.difference(FULL_NUMBERS, array);
      if (!rest.length) {
        count++;
      } else {
        $eles.svgAddClass('invalid');
      }
    }
  }

  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      var array = [], filled = true;
      var $eles = $groups.filter('.square-'+x+'-'+y);
      for (var i = 0; i < $eles.length; i++) {
        var $el = $eles.eq(i);
        var n   = $el.data('n');
        if (n != null) {
          array.push(n);
        } else {
          filled = false;
          break;
        }
      }
      if (filled) {
        var rest = _.difference(FULL_NUMBERS, array);
        if (!rest.length) {
          count++;
        } else {
          $eles.svgAddClass('invalid');
        }
      }
    }
  }

  if (count === 27) {
    $groups.svgAddClass('valid');
  }
};

$('.paper').on(CLICK_EVENT, '.cell-num-g.empty', function(event) {
  var $g = $(this);
  var x = $g.data('x');
  var y = $g.data('y');
  $groups.svgRemoveClass('selected');
  $g.svgAddClass('selected');
  numPad.showNumPad(x, y, function(n) {
    $g.svgRemoveClass('selected');
    $g.data({n: n});
    $g.find('.number').html(n);
    validateSolution();
  }, function() {
    $g.svgRemoveClass('selected');
  });
});

fillBoard();

$('.new-game-btn').on(CLICK_EVENT, function() {
  if (confirm('Sure to start a new game?')) {
    fillBoard();
  }
});

$('.reset-btn').on(CLICK_EVENT, function() {
  if (confirm('Remove all your answers?')) {
    $groups.svgRemoveClass('invalid valid').filter('.empty').each(function() {
      $(this).data({n: null}).find('.number').empty();
    });
  }
});

})(window, _, jQuery);
