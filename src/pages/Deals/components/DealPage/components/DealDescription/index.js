import React, { useState } from 'react';
import cn from 'classnames';
import Card from '../../../../../../shared/Card';
import styles from './styles.module.sass';
import DealEditModal from '../../../DealEditModal';
import useStore from '../../../../../../hooks/useStore';
import useDealsApi from '../../../../deals.api';
import Icon from '../../../../../../shared/Icon';
import EditorRendered from '../../../../../../shared/Editor/Rendered/EditorRendered';

const DealDescription = ({
  description,
  onChange,
  onSubmit,
  onReset,
  dealId,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const { dealsStore } = useStore();
  const api = useDealsApi();
  const handleSubmit = () => {
    onSubmit('description', 'Описание сделки обновлено');
    setIsEdit(false);
  };

  const handleCancel = () => {
    onReset('description');
    setIsEdit(false);
  };

  return (
    <Card
      classTitle={styles.title}
      classCardHead={'h4'}
      className={cn(styles.card)}
      title={
        <div className={styles.title}>
          <p>Описание сделки</p>
          <div onClick={() => !isEdit && setIsEdit(true)}>
            {!isEdit && <Icon className={cn(styles.edit)} name={'edit'} />}
            {isEdit && (
              <div className={styles.edit_container}>
                <Icon
                  fill={'#FF6A55'}
                  size={24}
                  onClick={handleSubmit}
                  name={'check-circle'}
                />
                <Icon size={24} onClick={handleCancel} name={'close'} />
              </div>
            )}
          </div>
        </div>
      }
    >
      {isEdit ? (
        <DealEditModal
          data={{ id: dealId }}
          handleClose={() => setIsEdit(false)}
          dealStore={dealsStore}
          dealApi={api}
        />
      ) : (
        // <div className={styles.description_text}>{description}</div>
        <EditorRendered maxHeight={200} content={description} />
      )}
    </Card>
  );
};

export default DealDescription;
