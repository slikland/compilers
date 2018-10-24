export interface Person {
	firstName: string;
	lastName: string;
}

export class Student implements Person {
	fullName: string;
	constructor(public firstName: string, public middleInitial: string, public lastName: string) {
		this.fullName = firstName + " " + middleInitial + " " + lastName;
	}
}

export class Professor extends Student {
	private _orientation: string;
	setOrientation(value: string) {
		this._orientation = value;
	}
	get orientation(): string {
		return this._orientation;
	}
}