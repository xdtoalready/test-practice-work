import {useMemo} from 'react';

const useMappedObj = (object,deps=[]) => {
    return useMemo(() => Array.isArray(object) ? [object.map((el,index)=>[index,el])] : Object.entries(object??{}),[object,...deps])
};

export default useMappedObj;