function countVowels(str) {
    const vowels = 'аеёиоуыэюяАЕЁИОУЫЭЮЯ';
    let count = 0;

    for (let char of str) {
        if (vowels.includes(char)) {
            count++;
        }
    }

    return count;
}

console.log(countVowels("Привет, мир!"));
console.log(countVowels("Работаем с ДжаваСкрипт!"));
