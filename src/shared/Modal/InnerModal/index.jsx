import React, {useRef} from 'react';
import Modal from "../index";
import uuid from "draft-js/lib/uuid";
import cn from "classnames";
import styles from "./styles.module.sass";
import useOutsideClick from "../../../hooks/useOutsideClick";
const Index = ({
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
                    isOpen
               }) => {

    const confirmRef = useRef();
    useOutsideClick(confirmRef, handleClose,id);
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
         size={size}
         handleClose={handleClose}
         handleSubmit={handleSubmit}
         isSubmitClicked={isSubmitClicked}
         children={children}
         cls={cls}
         appCls={cn(appCls,styles.innerModal)}
         modalRef={modalRef}
         closeButton={closeButton}
         customButtons={customButtons}
         withPortal={withPortal}
         id={id}
        />
    );
};

export default Index;