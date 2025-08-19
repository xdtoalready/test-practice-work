import React, { useRef, useState } from 'react';
import Icon from '../../Icon';
import styles from './CardDropdown.module.sass';
import cn from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { AnimatePresence, motion } from 'framer-motion';
import { TranslateYTransition } from '../../../utils/motion.variants';
import Edit from "../../TextInput/Actions/Edit";
import CardInput from "../../Input/Card";

const CardDropdown = ({
  children,
  text,
    inputComponent,
    actions,
  className,
  classNameContainer,
  size = 10,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const bodyRef = useRef(null);
  // if(!bodyRef.current && rest?.onClick){
  //     setIsOpen(true)
  // }
  return (
    <div className={cn(styles.container, classNameContainer)}>
      <div

        className={cn(styles.header, className)}
      >
          {inputComponent ?inputComponent() : <div>{text}</div>}
        <div onClick={() => {
            setIsOpen(!isOpen);
            if (rest?.onClick) rest?.onClick();
        }}>
          <Icon
            viewBox={`0 0 ${size} ${size}`}
            size={size}
            name={'chevron'}
            className={cn(styles.chevron, { [styles.chevron_active]: isOpen })}
          />
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={'show'}
            initial={'hidden'}
            exit={'hidden'}
            variants={TranslateYTransition}
            ref={bodyRef}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardDropdown;
