function generatePassword(length){
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specials = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const randomLower = lowercase[Math.floor(Math.random() * lowercase.length)];
    const randomUpper = uppercase[Math.floor(Math.random() * uppercase.length)];
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    const randomSpecial = specials[Math.floor(Math.random() * specials.length)];

    let password = randomLower + randomUpper + randomNumber + randomSpecial;
    const allChars = lowercase + uppercase + numbers + specials;

    for (let i = 4; i < length; i++) {
        password = password + allChars[Math.floor(Math.random() * allChars.length)];
    }    
    return password;
}

console.log(generatePassword(8)); 
console.log(generatePassword(12));
console.log(generatePassword(20));