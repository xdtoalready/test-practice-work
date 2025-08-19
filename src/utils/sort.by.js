export const sortByDate = (propA,propB) =>{
    const dateA = propA instanceof Date ? propA : new Date(propA);
    const dateB = propB instanceof Date ? propB : new Date(propB);
    return dateB - dateA;
}