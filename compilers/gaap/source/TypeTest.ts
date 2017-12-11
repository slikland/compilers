import { Person, Student, Professor } from "./core/TypeImport";

export function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student('Raphael', 'Magalhaes', 'Lus')
let prof = new Professor('Helena', 'V', 'Caxias')
prof.setOrientation('nothing');

console.log(greeter(user))