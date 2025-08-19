import {useEffect, useRef, useState} from "react";

const useTooltip = (content, delay = 300) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef(null);
    const timeoutRef = useRef(null);

    const showTooltip = () => {

        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);

        }, delay);
    };

    const hideTooltip = () => {
        clearTimeout(timeoutRef.current);
        setIsVisible(false);
    };

    const handleMouseEnter = () => {
        showTooltip();
    };

    const handleMouseLeave = () => {
        hideTooltip();
    };

    useEffect(() => {
        if (isVisible) {
            document.body.addEventListener('mouseenter', hideTooltip);
        }

        return () => {
            document.body.removeEventListener('mouseleave', hideTooltip);
        };
    }, [isVisible]);

    return {
        isVisible,
        tooltipRef,
        content,
        handleMouseEnter,
        handleMouseLeave,
    };
};

export default useTooltip;