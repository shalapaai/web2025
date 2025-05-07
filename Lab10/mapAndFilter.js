const numbers = [2, 5, 8, 10, 3];

const result1 = numbers
    .map(function(number) {
        return number * 3;
    })
    .filter(function(num){
        return num > 10;
    })

console.log(result1);