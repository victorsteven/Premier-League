const Utility = {
  stripNull(obj) {
    let strippedObj = {};

    Object.keys(obj).forEach(val => {
      const newVal = obj[val];
      strippedObj = newVal ? {...strippedObj, [val]: newVal } : strippedObj
    });
    return strippedObj
  }
}