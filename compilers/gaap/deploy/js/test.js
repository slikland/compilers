(function() {
alert(1)
var Test;

Test = (function() {
  function Test() {
    console.log(1);
  }

  return Test;

})();

}).call(this);