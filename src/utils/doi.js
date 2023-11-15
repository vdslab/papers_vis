export const escapeDoi = (doi) => {
    return doi.replaceAll('.', '_').replaceAll('/', '~');
}

export const deescapeDoi = (doi) => {
    return doi.replaceAll("_", ".").replaceAll("~", "/");
}
