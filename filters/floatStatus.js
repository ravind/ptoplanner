// filter method, creating `makeUppercase` a globally
// available filter in our `app` module
app.filter('floatStatus', function (ptoManager, $rootScope) {
  // function that's invoked each time Angular runs $digest()
  // pass in `item` which is the single Object we'll manipulate
  return function (item) {
    var q = item.split('q')[1];
    var floatsList = ptoManager.getFloats();
    //no data
    if( !floatsList && q < $rootScope.curQuarter){
       return '=(';
    }
      //no data
    if( !floatsList){
       return '=|';
    }
    //no data for quarters passed
    if( !floatsList[item] && q < $rootScope.curQuarter){
       return '=(';
    }

    //if used good job
    if( floatsList[item].used === true ){
       return '=)';
    }
    //if unused and quarter passed
    if( q < $rootScope.curQuarter ){
      return '=(';
    }
    //if unused and quarter is not yet
    if( q > $rootScope.curQuarter ){
      return '=|';
    }
    //current quarter unused
    return '=/';

  };
});
