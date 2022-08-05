const objectArray2ArrayByKey = (object, key) => {
    
    const array = [];
    if(object === undefined || object === false) {
        return array;
    }
    
    for(const element of object) {
        array.push(element[key]);
    }

    return array;
}

export default objectArray2ArrayByKey;

