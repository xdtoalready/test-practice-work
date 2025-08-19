import React, {useState} from 'react';

const OutsideClickLayout = ({children,state=false, onClick}) => {
    const [isOpen, setIsOpen] = useState(state);
    console.log(children)
    const toggle = () => {
        setIsOpen(old => !old);
        onClick()
    }
    return <>
        {children}

        {isOpen
            ?
            <div
                style={{zIndex:900}}
                className="fixed top-0 right-0 bottom-0 left-0 z-20"
                onClick={toggle}
            ></div>
            :
            <></>
        }
    </>

};

export default OutsideClickLayout;