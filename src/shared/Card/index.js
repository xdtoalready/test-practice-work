import React from "react";
import cn from "classnames";
import styles from "./Card.module.sass";
import {Link} from "react-router-dom";

const Card = ({
                  className,
                  title,
                  classTitle,
                  classCardHead,
                  head,
                  children,
                  ...rest
              }) => {
    const card = (
        <div  className={cn(styles.card, className)}>
            {title && (
                <div className={cn(styles.head, classCardHead)}>
                    <div className={cn(classTitle, styles.title)}>{title}</div>
                    {head && head}
                </div>
            )}
            {children}
        </div>
    )
    return (
        rest?.onLink ?
            <Link to={rest.onLink()}>
                {card}
            </Link>
            : card
    );
};

export default Card;
