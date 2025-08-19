import React, {useRef} from 'react';
import Modal from "../../shared/Modal";
import EditorRendered from "../../shared/Editor/Rendered/EditorRendered";
import useOutsideClick from "../../hooks/useOutsideClick";
import styles from './Description.module.sass'

const Index = ({description, onClose,label}) => {
    const ref = useRef(null)
    useOutsideClick(ref,onClose)
    return (
        <Modal cls={styles.modal} modalRef={ref} closeButton={'Закрыть'} handleClose={onClose} size={'md'}>
            <div className={styles.name}>
                {label}
            </div>
            <EditorRendered className={styles.content} content={description}/>
        </Modal>
    );
};

export default Index;