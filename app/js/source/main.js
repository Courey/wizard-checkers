(function(){
  'use strict';
  $(document).ready(init);
  function init(){
    $('#start').click(start);
    $('#board').on('click', 'td.current.occupied', select);
    $('#board').on('click', 'td.valid:not(.occupied)', move);
  }

  var initialSelection;
  var targetSelection;
  var continueTurn = false;


  function start(){
      var validSpaces = $('.valid');
      validSpaces.removeClass().addClass('valid');
      for(var i = 0; i < 12; i++){
        $(validSpaces[i]).addClass('player1 current occupied');
      }
      for(var j = 20; j < 32; j++){
        $(validSpaces[j]).addClass('player2 occupied');
      }
   }// end start

  //selects initial piece to move
  function select(){
    if(initialSelection){
      initialSelection.removeClass('selected');
   }
    var target = $(this).addClass('selected');
    initialSelection = target;
  }//end select

  //gets the coordinates of initialSelection
  function getLocation(){
    var initialx = initialSelection.data('positionx');
    var initialy = initialSelection.data('positiony');

    var targetx = targetSelection.data('positionx');
    var targety = targetSelection.data('positiony');

    var vector =[];

    vector.push(targetx-initialx);
    vector.push(targety-initialy);

    return vector;
  }//end getLocation

  function move(){
    targetSelection = $(this);
    var vector = getLocation();

        if(Math.abs(vector[0]) + Math.abs(vector[1]) === 4){
          if(direction(initialSelection, targetSelection)){
            var $deadPiece = generateDead(initialSelection, targetSelection);

            if(checkDead($deadPiece)){
              $deadPiece.removeClass().addClass('valid');
              movePiece();

              if(checkPotential() < 4){
                continueTurn = true;
              }else{
                continueTurn = false;
              }

              endTurn();
            }
          }
        }else if(Math.abs(vector[0]) + Math.abs(vector[1]) === 2){
          if(direction(initialSelection, targetSelection)){

            movePiece();
            continueTurn = false;
            endTurn();
          }
        }
  }//end possibleMoves

  function direction(jQueryInitialSelection, jQueryTargetSelection){
    if(jQueryInitialSelection.hasClass('king')){
      return true;
    }

    if(jQueryInitialSelection.hasClass('player1')){
      if(jQueryTargetSelection.data('positiony') > jQueryInitialSelection.data('positiony')){
        return true;
      }else{
      return false;
      }
    }else{
      if(jQueryTargetSelection.data('positiony') < jQueryInitialSelection.data('positiony')){
        return true;
      }
      return false;
    }
  }

// this may not work as is.
  function generateDead(jQueryInitialSelection, jQueryTargetSelection){
    var avgX = average(jQueryInitialSelection.data('positionx'), jQueryTargetSelection.data('positionx'));
    var avgY = average(jQueryInitialSelection.data('positiony'), jQueryTargetSelection.data('positiony'));
    return $('td[data-positionx=' + avgX + '][data-positiony=' + avgY +']');

  }

  function average(x,y){
    return (x+y)/ 2;
  }

  function movePiece(){
    if(!targetSelection.hasClass('occupied')){
      if(initialSelection.hasClass('player1')){
        swapPiece();

        if(targetSelection.data('positiony') === 7){
          targetSelection.addClass('king');
        }
      } else{
        swapPiece();
        if(targetSelection.data('positiony') === 0){
          targetSelection.addClass('king');
        }
      }

      if(initialSelection.hasClass('king')){
        initialSelection.removeClass('king');
        targetSelection.addClass('king');
      }
    }
  }

  function endTurn(){
    if(!continueTurn){
      removeCurrent();
    }
  }

  function checkDead(deadPiece){
    return deadPiece.hasClass('occupied') && !deadPiece.hasClass('current');
  }

  function checkPotential(){
    var potentialTargets = [];
    var translatedX = [];
    var translatedY = [];

    translatedX.push(targetSelection.data('positionx') + 2);
    translatedY.push(targetSelection.data('positiony') + 2);
    translatedX.push(targetSelection.data('positionx') - 2);
    translatedY.push(targetSelection.data('positiony') - 2);


    for(var j=0; j<2; j++){
      for(var k=0; k<2; k++){
        potentialTargets.push($('td[data-positionx=' + translatedX[j] + '][data-positiony=' +translatedY[k] +']'));
      }
    }

    var spliceIndeces = [];
    for(var i=0; i<potentialTargets.length; i++){
      var $dead = generateDead(targetSelection, potentialTargets[i]);
      if(potentialTargets[i].hasClass('occupied') || !checkDead($dead) || !direction(targetSelection, potentialTargets[i])){
        spliceIndeces.push(i);
      }
    }
    return spliceIndeces.length;
  }

//returns playerClass
  function getPlayerClass(){
    var classes = $('.valid.current').attr('class');
    var classArray = classes.split(' ');
    var playerClass = classArray[1];
    return playerClass;
  }//end getPlayerClass

//call this when pieces are to be swapped to new space
  function swapPiece(){
    var playerClass = getPlayerClass();
    if(targetSelection.hasClass('valid')){
      //targetSelection.addClass('valid');
      targetSelection.addClass(playerClass);
      targetSelection.addClass('current occupied');
      initialSelection.removeClass(playerClass);
      initialSelection.removeClass('current occupied');
      $('td.valid.possible').removeClass('possible');
      //removeCurrent();
    }// end swapPiece
  }

  function removeCurrent(){
    var playerClass = getPlayerClass();
      if(playerClass === 'player1'){
        $('td.player1').removeClass('current');
        $('td.player2').addClass('current');
      }
      if(playerClass === 'player2'){
        $('td.player2').removeClass('current');
        $('td.player1').addClass('current');
      }
  }// end removeCurrent

})();
