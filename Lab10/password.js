function createSecurePassword(length) {
    const charSets = {
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        digits: '0123456789',
        symbols: '!@#$%^&*()_"№;:'
    };

    // Гарантируем минимум по одному символу из каждой категории
    let password = [
        ...Object.values(charSets).map(set => set[Math.floor(Math.random() * set.length)])            
    ];

    // Добавляем остальные случайные символы
    const allChars = Object.values(charSets).join('');
    while (password.length < length) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    return password.join('');
}

console.log(createSecurePassword(12));
console.log(createSecurePassword(16));