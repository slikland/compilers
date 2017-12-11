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


var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("core/TypeImport", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Student = /** @class */ (function () {
        function Student(firstName, middleInitial, lastName) {
            this.firstName = firstName;
            this.middleInitial = middleInitial;
            this.lastName = lastName;
            this.fullName = firstName + " " + middleInitial + " " + lastName;
        }
        return Student;
    }());
    exports.Student = Student;
    var Professor = /** @class */ (function (_super) {
        __extends(Professor, _super);
        function Professor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Professor.prototype.setOrientation = function (value) {
            this._orientation = value;
        };
        Object.defineProperty(Professor.prototype, "orientation", {
            get: function () {
                return this._orientation;
            },
            enumerable: true,
            configurable: true
        });
        return Professor;
    }(Student));
    exports.Professor = Professor;
});
define("TypeTest", ["require", "exports", "core/TypeImport"], function (require, exports, TypeImport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function greeter(person) {
        return "Hello, " + person.firstName + " " + person.lastName;
    }
    exports.greeter = greeter;
    var user = new TypeImport_1.Student('Raphael', 'Magalhaes', 'Lus');
    var prof = new TypeImport_1.Professor('Helena', 'V', 'Caxias');
    prof.setOrientation('nothing');
    console.log(greeter(user));
});


return collect(); 
})();