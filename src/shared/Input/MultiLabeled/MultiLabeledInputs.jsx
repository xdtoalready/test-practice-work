import React from 'react';
import Icon from '../../Icon';
import styles from '../Card/CardInput.module.sass';
import CardInput from '../Card';
import cn from 'classnames';

const MultiInputLabeled = ({ label, onAdd, children,cls, ...props }) => {
  return (
    <>
      <div
        className={cn(styles.label_multiple, {
          [styles.label_multiple_override]: props?.isInput,
        })}
      >
        <div style={{ display: props.isInput ? 'flex' : 'block' }}>
          {!props?.isInput && <div>{label}</div>}
          {props.isInput && (
            <CardInput
              classInput={cn(styles.classInput_override, styles.input)}
              className={styles.flex}
              name={props.name}
              placeholder={'Название...'}
              value={label}
              actions={{ ...props.actions, add: onAdd }}
            />
          )}
        </div>
      </div>
      {children}
    </>
  );
};

export default MultiInputLabeled;
