function mergeObjects(obj1, obj2) {
    const result = {};
    
    for (const key1 in obj1) {
        for (const key2 in obj2) {
            obj1[key] = obj2[key];
        }
    }
    
    for (const key in obj2) {
        result[key] = obj2[key];
    }
    
    return result;
  }

console.log(mergeObjects({ a: 1, b: 2 }, { b: 3, c: 4 }));