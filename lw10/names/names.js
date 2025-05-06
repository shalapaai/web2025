const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 3}
];
  
const names = users.map(function(user) {
    return user.name;
});

console.log(names);  