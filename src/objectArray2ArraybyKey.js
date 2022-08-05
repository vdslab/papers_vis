const objectArray2ArrayByKey = (object, key) => {
    
    const array = [];
    if(object === undefined) {
        return array;
    }
    
    for(const element of object) {
        array.push(element[key]);
    }

    return array;
}

export default objectArray2ArrayByKey;

