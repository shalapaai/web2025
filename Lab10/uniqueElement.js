function uniqueElements(arr) {
    const result = {};
    
    for (const key of arr) {
        const item = String(key);
        (result[item] === undefined)
        ? result[item] = 1
        : result[item] += 1;
    }
    
    return result;
}

console.log(uniqueElements(['привет', 'hello', 'hello', 1, '1', 2, 2, '2']));