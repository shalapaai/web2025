function countVowels(str) {
    let charAwailable = ['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'ю', 'я', 'э'];
    let charFound = [];
    let cnt = 0;
    if (typeof str == 'string') {
        for (let i = 0; i < str.length; i++) {
            if (charAwailable.includes(str[i])) {
                cnt++;
                charFound.push(str[i]);
            }
        }
        console.log(cnt, ': ', charFound);
    }
}

countVowels('Привет, мир!')