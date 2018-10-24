(function () {
var main = null;
var modules = {
	"require": {
		factory: undefined,
		dependencies: [],
		exports: function (args, callback) { return require(args, callback); },
		resolved: true
	}
};
function define(id, dependencies, factory) {
	return main = modules[id] = {
		dependencies: dependencies,
		factory: factory,
		exports: {},
		resolved: false
	};
}
function resolve(definition) {
	if (definition.resolved === true)
			return;
	definition.resolved = true;
	var dependencies = definition.dependencies.map(function (id) {
		return (id === "exports")
			? definition.exports
			: (function () {
				if(modules[id] !== undefined) {
					resolve(modules[id]);
					return modules[id].exports;
				} else {
					try {
						return require(id);
					} catch(e) {
						throw Error("module '" + id + "' not found.");
					}
				}
			})();
	});
	definition.factory.apply(null, dependencies);
}
function collect() {
	Object.keys(modules).map(function (key) { return modules[key]; }).forEach(resolve);
	return (main !== null) 
		? main.exports
		: undefined
}


define("VersionTest", ["require", "exports"], function (require, exports) {
    "use strict";
    "SL_PROJECT_VERSION:0.0.0";
    "SL_PROJECT_DATE:0000000000000";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = /** @class */ (function () {
        function Main() {
        }
        return Main;
    }());
    exports.default = Main;
});


return collect(); 
})();