function uniqueElements(arr) {
    const result = {};
    
    for (const key of arr) {
        const keyStr = String(key);
        (!result[keyStr])
        ? result[keyStr] = 1
        : result[keyStr] += 1;
    }
    
    return result;
}

console.log(uniqueElements(['привет', 'hello', 'hello', 1, '1', 2, 2, '2']));