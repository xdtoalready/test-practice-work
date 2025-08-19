import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import styles from "./Radio.module.sass";

const Radio = ({ className, content, name, value, onChange }) => (
    <label className={cn(styles.radio, className)}>
        <input
            className={styles.input}
            type="radio"
            name={name}
            onChange={onChange}
            checked={value}
        />
        <span className={styles.inner}>
      {typeof content === 'string' ? (
          <span className={styles.text} dangerouslySetInnerHTML={{ __html: content }}></span>
      ) : (
          <span className={styles.text}>{content}</span>
      )}
            <span className={styles.tick}></span>
    </span>
    </label>
);

Radio.propTypes = {
    className: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

Radio.defaultProps = {
    className: '',
};

export default Radio;
