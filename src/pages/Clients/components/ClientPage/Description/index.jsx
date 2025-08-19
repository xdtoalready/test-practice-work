import React, { useState } from 'react';
import Card from '../../../../../shared/Card';
import styles from './Description.module.sass';
import Icon from '../../../../../shared/Icon';
import cn from 'classnames';
import TextInput from '../../../../../shared/TextInput';
import Button from '../../../../../shared/Button';
import CreateModal from '../../ClientsTable/CreateModal';
import EditorRendered from '../../../../../shared/Editor/Rendered/EditorRendered';

const ClientDescription = ({
  description,
  onChange,
  onSubmit,
  onReset,
  clientId,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  return (
    <Card
      classTitle={styles.title}
      classCardHead={'h4'}
      className={cn(styles.card)}
      title={
        <div className={styles.title}>
          <p>Описание клиента</p>
          <div onClick={() => setIsEdit(!isEdit)}>
            {!isEdit && <Icon className={cn(styles.edit)} name={'edit'} />}
            {isEdit && (
              <div className={styles.edit_container}>
                <Icon
                  fill={'#FF6A55'}
                  size={24}
                  onClick={onSubmit}
                  name={'check-circle'}
                />
                <Icon
                  size={24}
                  onClick={() => onReset('description')}
                  name={'close'}
                />
              </div>
            )}
          </div>
        </div>
      }
    >
      {/*{isEdit ? <TextInput*/}
      {/*    edited={true}*/}
      {/*    makeFocused={true}*/}
      {/*    type={'textarea'}*/}
      {/*    data-name={'Описание'}*/}
      {/*    // label="New password"*/}
      {/*    onChange={(e) => onChange(e.target.name, e.target.value)}*/}
      {/*    value={description}*/}
      {/*    name="description"*/}
      {/*    // type="password"*/}
      {/*    // tooltip="Maximum 100 characters. No HTML or emoji allowed"*/}
      {/*    // required*/}
      {/*/> : <div>{description}</div>}*/}
      {isEdit ? (
        <CreateModal
          onSubmit={onSubmit}
          clientId={clientId}
          onClose={() => setIsEdit(false)}
        />
      ) : (
        <EditorRendered content={description} maxHeight={200} />
      )}
    </Card>
  );
};

export default ClientDescription;
