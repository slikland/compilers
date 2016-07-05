(function() {
function __addNamespace(scope, obj){for(k in obj){if(!scope[k]) scope[k] = {};__addNamespace(scope[k], obj[k])}};
__addNamespace(this, {"slikland":{"test":{}}});
slikland.test.Test2 = (function() {
  function Test2() {
    this.a = 1;
    console.log(slikland.test.Test2);
  }

  return Test2;

})();

var Test, Test2;

Test = (function() {
  function Test() {
    var a;
    new sl.display.BaseDOM();
    a = new slikland.test.Test2();
  }

  return Test;

})();

Test2 = (function() {
  function Test2() {
    this.a = 2;
  }

  return Test2;

})();

new Test();

}).call(this);