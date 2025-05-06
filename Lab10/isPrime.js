function checkPrime(n) {
    let isPrime;
    isPrime = true;
    for (let i = 2; i < n; i++) {
        if (n % i == 0) {
            isPrime = false;
            break;
        }
    }
    if (isPrime) {
        return true;
    }
}

function checkPrimeNumber(input) {
    if (checkPrime(input)) {
        console.log(`${input} простое число`);
    } else {
        console.log(`${input} не простое число`);
    }
}

function isPrimeNumber(input) {
    if (typeof input === 'number') {
        checkPrimeNumber(input);
     } else if (Array.isArray(input)) {
        for (let i = 0; i < input.length; i++) {
            checkPrimeNumber(input[i])
        }
     } else {
        console.log('Incorrent input')
     }
}

isPrimeNumber(5);
isPrimeNumber('5');
isPrimeNumber(10);
isPrimeNumber([2, 3, 4, 5]);