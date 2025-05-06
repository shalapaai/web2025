let usersArr = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
];
// Результат: ["Alice", "Bob", "Charlie"]

let names = usersArr.map(user => user.name);

console.log(names);