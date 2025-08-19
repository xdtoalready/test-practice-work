import React from "react";
import cn from "classnames";
import styles from "./Checkbox.module.sass";

const Checkbox = ({
                      className,
                      classCheckboxTick,
                      content,
                      value,
                      onChange,
                      reverse,
                      name
                  }) => {
    const handleChange = (e) => {
        onChange(name, e.target.checked);
    };

    return (
        <label
            className={cn(styles.checkbox, className, { [styles.reverse]: reverse })}
        >
            <input
                className={styles.input}
                type="checkbox"
                onChange={handleChange}
                checked={value}
            />
            <span className={styles.inner}>
        <span className={cn(styles.tick, classCheckboxTick)}></span>
                {content && (
                    <>
            <span
                className={styles.text}

            >{content}</span>
                    </>
                )}
      </span>
        </label>
    );
};

export default Checkbox;
