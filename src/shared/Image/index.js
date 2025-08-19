import React from "react";
import useStore from "../../hooks/useStore";
import {observer} from "mobx-react";

const Image = observer(({ className, src, srcDark, srcSet, srcSetDark, alt }) => {
    const {themeStore} = useStore()
    const isDark = themeStore.isDark()
    return (
        <img
            className={className}
            srcSet={isDark ? srcSetDark : srcSet}
            src={isDark ? srcDark : src}
            alt={alt}
        />
    );
});

export default Image;
