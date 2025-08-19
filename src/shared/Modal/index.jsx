import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './Module.module.sass';
import Icon from '../Icon';
import cn from 'classnames';
import useOutsideClick from '../../hooks/useOutsideClick';
import { motion } from 'framer-motion';
import Button from '../Button';
import { opacityTransition } from '../../utils/motion.variants';

const Modal = ({
  size = 'sm',
  handleClose,
  handleSubmit,
  isSubmitClicked = false,
  children,
  cls,
  appCls,
  modalRef,
  closeButton,
  customButtons,
  withPortal = true,
  id,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const ref = useRef(null);
  const innerRef = useRef(modalRef ?? null);
  const isFirstRender = useRef(true);
  const refSubmitClicked = useRef(false);

  const handleCloseModal = useCallback(() => {
    // // setIsVisible(false);
    handleClose && handleClose();
    document.body.style.overflow = 'auto';
  }, [handleClose]);

  const handleSubmitModal = useCallback(() => {
    // setIsVisible(false);


    handleSubmit && handleSubmit();
    document.body.style.overflow = 'auto';
    // setSubmitClicked(false);
  }, [handleSubmit]);

  // const escFunction = useCallback(
  //     (e) => {
  //         if (e.keyCode === 27) {
  //             handleCloseModal();
  //         }
  //     },
  //     [handleCloseModal]
  // );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      // handleSubmitModal();
    }
  }, [handleSubmitModal, handleSubmit]);

  useLayoutEffect(() => {
    const modalNode = ref.current;
    if (modalNode) {
      document.body.appendChild(modalNode);
      document.addEventListener('keydown', () => null, false);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', () => null, false);
      if (modalNode && modalNode.parentNode) {
        // modalNode.parentNode.removeChild(modalNode);
      }
      document.body.style.overflow = 'auto';
    };
  }, []);

  useOutsideClick(innerRef, handleCloseModal, id);

  if (!isVisible) {
    return null;
  }

  return withPortal ? (
    createPortal(
      <ModalBase
        isSubmitted={isSubmitClicked}
        id={id}
        handleClose={handleClose}
        handleCloseModal={handleCloseModal}
        ref={ref}
        innerRef={innerRef}
        handleSubmit={handleSubmit}
        handleSubmitModal={handleSubmitModal}
        customButtons={customButtons}
        closeButton={closeButton}
        size={size}
        children={children}
        cls={cls}
        appCls={appCls}
      />,
      document.body,
    )
  ) : (
    <ModalBase
      id={id}
      isSubmitted={isSubmitClicked}
      handleClose={handleClose}
      handleCloseModal={handleCloseModal}
      ref={ref}
      innerRef={innerRef}
      handleSubmit={handleSubmit}
      handleSubmitModal={handleSubmitModal}
      customButtons={customButtons}
      closeButton={closeButton}
      size={size}
      children={children}
      cls={cls}
      appCls={appCls}
    />
  );
};

export default Modal;

const ModalBase = ({
  id,
  isSubmitted,
  ref,
  size,
  innerRef,
  handleCloseModal,
  handleSubmit,
  children,
  closeButton,
  handleSubmitModal,
  handleClose,
  customButtons,
  cls,
  appCls,
}) => {
  return (
    <motion.div
      id={id ?? ''}
      ref={ref}
      animate={'show'}
      initial={'hidden'}
      exit={'hidden'}
      className={cn(styles.appModal, appCls)}
      style={
        size === 'sm'
          ? undefined
          : { maxHeight: '100%', display: 'flex', flexDirection: 'column' }
      }
      variants={opacityTransition}
    >
      <div
        id={'innerModal'}
        ref={innerRef}
        className={cn(
          styles.appModal__inner,
          { [styles.appModal__inner__sm]: size === 'sm' },
          { [styles.appModal__inner__md]: size === 'md' },
          { [styles.appModal__inner__lg]: size === 'lg' },
          { [styles.appModal__inner__xl]: size === 'xl' },
          { [styles.appModal__inner__md_up]: size === 'md_up' },
          cls,
        )}
      >
        <div className={styles.appModal__closeIcon} onClick={handleCloseModal}>
          <Icon fill={'#6F767E'} name={'close'} size={20} />
        </div>
        {children}
        <div className={styles.buttons}>
          <div className={styles.left}>
            {handleSubmit && (
              <Button
                disabled={isSubmitted}
                isSmall={false}
                onClick={() => handleSubmitModal()}
                classname={styles.button}
                name={'Сохранить'}
                type={'primary'}
              />
            )}
            {handleClose && closeButton && (
              <Button
                isSmall={false}
                onClick={() => handleCloseModal()}
                classname={styles.button}
                name={closeButton ?? 'Удалить'}
                type={'secondary'}
              />
            )}
          </div>
          {customButtons && (
            <div className={styles.addButtons}>{customButtons}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
