// filter method, creating `makeUppercase` a globally
// available filter in our `app` module
app.filter('floatStatus', function (ptoManager, $rootScope) {
  // function that's invoked each time Angular runs $digest()
  // pass in `item` which is the single Object we'll manipulate
  return function (item) {
    var floatsList = ptoManager.getFloats();
    //if used good job
    if( floatsList[item].used === true ){
       return '=)';
    }
    var q = item.split('q')[1];
    //if unused and quarter passed
    if( q < $rootScope.curQuarter ){
      return '=(';
    }
    //if unused and quarter is not yet
    if( q > $rootScope.curQuarter ){
      return '=|';
    }
    return '=/';

  };
});
