import React, {useLayoutEffect, useRef} from 'react';

const UseScrollAfterDelete = (sourceArr) => {
    const prevSourceArrLength = useRef(Object.keys(sourceArr).length);

    const ref = useRef()
    const isRendered = useRef(false)
    const isDeleting = useRef(false);
    useLayoutEffect(() => {
        const currSourceArrLength = Object.keys(sourceArr).length;

        if (currSourceArrLength > prevSourceArrLength.current && !isDeleting.current) {
            ref.current?.scrollTo({
                top: ref.current?.scrollHeight,
                behavior: 'smooth'
            });
        }
        isDeleting.current = false;
        prevSourceArrLength.current = currSourceArrLength;
    }, [sourceArr]);

    useLayoutEffect(() => {
        if(!isRendered.current && ref.current){
            isRendered.current = true
            ref.current?.scrollTo({
                bottom: ref.current?.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [ref.current]);
    return {isDeleting,isRendered}
};

export default UseScrollAfterDelete;