function generatePassword(length) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+"№;:?';
  
    const allChars = lowercase + uppercase + numbers + symbols;
  
    let password = [
        lowercase[Math.floor(Math.random() * lowercase.length)],
        uppercase[Math.floor(Math.random() * uppercase.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];
  
    for (let i = 4; i < length; i++) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
  
    // Перемешиваем символы
    password = password.sort(() => Math.random() - 0.5).join('');
  
    return password;
  }
  
// Примеры использования
console.log(generatePassword(12));
console.log(generatePassword(8));