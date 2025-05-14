function mapObject(obj, callback) {
    const result = {};
    for (const key in obj) {
        result[key] = callback(obj[key]);
    }
    return result;
}
  
const nums1 = { a: 1, b: 2, c: 3 };
console.log(mapObject(nums1, x => x * 2)); 

const nums2 = { a: 1, b: 2, c: 3 };
console.log(mapObject(nums2, x => x + 1)); 