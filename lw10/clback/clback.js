function mapObject(obj, callback) {
    const result = {};
    
    for (const key in obj) {
        result[key] = callback(obj[key]);
    }
    return result;
}
  
const nums = { a: 1, b: 2, c: 3 };
console.log(mapObject(nums, x => x * 2)); 

const nums2 = { d: 1, x: 2, z: 3 };
console.log(mapObject(nums2, x => x * 10)); 

