const numbers = [2, 5, 8, 10, 3];
const result = numbers
    .map(function(number){
        return number * 3
    })
    .filter(num => num > 10)

console.log(result);