import React, {useMemo, useState} from 'react';
import CardInput from '../../../../../../shared/Input/Card';
import MultiInputLabeled from '../../../../../../shared/Input/MultiLabeled/MultiLabeledInputs';
import { createRequisites } from '../../../../clients.mocks';
import Modal from "../../../../../../shared/Modal";
import {handleSubmit} from "../../../../../../utils/snackbar";
import FormValidatedModal from "../../../../../../shared/Modal/FormModal";
import TextInput from "../../../../../../shared/TextInput";
import styles from "../Contacts.module.sass";

const RequisitesToValues = {
  INN: 'ИНН',
  BankName: 'Банк',
  KPP: 'КПП',
  OGRN: 'ОГРН',
  RS: 'Р/с №',
  CORR_RS: 'Корр/с №',
  BIK: 'БИК банка',
  LEGAL_ADDRESS: 'Юр. адрес',
  REAL_ADDRESS: 'Факт. адрес',
};
const RequisitesOnSave = {
  INN: 'ИНН сохранен',
  BankName: 'Наименование банка сохранено',
  KPP: 'КПП сохранен ',
  OGRN: 'ОГРН/ОГРНИП сохранено',
  RS: 'Расчетный счет сохранен',
  CORR_RS: 'Корреспондентский счет сохранен',
  BIK: 'БИК сохранен',
  LEGAL_ADDRESS: 'Юр. адрес сохранен',
  REAL_ADDRESS: 'Факт. адрес сохранен',
};

const RequisitesOnClose = {
  INN: 'ИНН восстановлен',
  BankName: 'Наименование банка восстановлено',
  KPP: 'КПП восстановлен',
  OGRN: 'ОГРН/ОГРНИП восстановлено',
  RS: 'Расчетный счет восстановлен',
  CORR_RS: 'Корреспондентский счет восстановлен',
  BIK: 'БИК восстановлен',
  LEGAL_ADDRESS: 'Юр. адрес восстановлен',
  REAL_ADDRESS: 'Факт. адрес восстановлен',
};
const RequisitesComponent = ({ label, contactData, onActions, onAdd }) => {
  const length = useMemo(
    () => Object.keys(contactData?.requisites ?? {}).length,
    [contactData.requisites],
  );
  const [clientDataEdit,setClientDataEdit] = useState(false)

  return (
      <>
    <MultiInputLabeled isInput={true}
                       label={label}
                       actions={{onEdit:(e)=>{
                         setClientDataEdit(true)}}}

    >
      {Object.entries(contactData?.requisites ?? {}).map(
        ([key, value], index) => {
          return Object.entries(value).map(
            ([keyRequisites, valueRequisites], index) => {
              const actions = onActions(
                `contactData.requisites.${key}.${keyRequisites}`,
                RequisitesOnSave[keyRequisites],
                RequisitesOnClose[keyRequisites],
              );
              return (
                <CardInput
                  placeholder={`${RequisitesToValues[keyRequisites]}...`}
                  multiple={true}
                  labeled={true}
                  label={RequisitesToValues[keyRequisites]}
                  name={`contactData.requisites.${key}.${keyRequisites}`}
                  type={'textarea'}
                  value={valueRequisites}
                  actions={actions}
                />
              );
            },
          );
        },
      )}
    </MultiInputLabeled>
        {clientDataEdit && <RequisitesModalEdit actions={onActions} requisites={contactData.requisites} handleClose={()=>setClientDataEdit(false)}/>}
      </>
  );
};


const RequisitesModalEdit = ({handleClose,requisites,actions}) => {
  const actionsReq = useMemo(()=>actions('contactData.requisites.0','Сохранено',''),[])
  const handleChange = (name,value) =>{
    return actionsReq.edit({name,value})
  }

  const handleSubmit = () => {
    return actionsReq.submit()
  }

  return <FormValidatedModal
      handleClose={() => handleClose && handleClose(null)}
      handleSubmit={() => handleSubmit()}
      size={'md'}
      // stageId={stageId}
  >
    <div className={styles.name}>
      <div>Редактирование Юр. реквизитов</div>
      <span/>
    </div>
      {Object.entries(requisites ?? {}).map(
          ([key, value], index) => (
              <>
      <div className={styles.flex}>
        <TextInput
            onChange={({target}) => handleChange(`contactData.requisites.${key}.INN`, target.value)}
            name={`contactData.requisites.${key}.INN`}
            value={value?.INN || ''}
            edited={true}
            className={styles.inputModal}
            label="ИНН"
        />
        <TextInput
            onChange={({target}) => handleChange(`contactData.requisites.${key}.KPP`, target.value)}
            name={`contactData.requisites.${key}.KPP`}
            value={value?.KPP || ''}
            edited={true}
            className={styles.inputModal}
            label="КПП"
        />
        <TextInput
            onChange={({target}) => handleChange(`contactData.requisites.${key}.OGRN`, target.value)}
            name={`contactData.requisites.${key}.KPP`}
            value={value?.OGRN || ''}
            edited={true}
            className={styles.inputModal}
            label="ОГРН/ОГРНИП"
        />
      </div>
      <div className={styles.flex}>
        <TextInput
            onChange={({target}) => handleChange(`contactData.requisites.${key}.RS`, target.value)}
            name={`contactData.requisites.${key}.RS`}
            value={value?.RS || ''}
            edited={true}
            className={styles.inputModal}
            label="Р/с №"
        />
        <TextInput
            onChange={({target}) => handleChange(`contactData.requisites.${key}.CORR_RS`, target.value)}
            name={`contactData.requisites.${key}.CORR_RS`}
            value={value?.CORR_RS || ''}
            edited={true}
            className={styles.inputModal}
            label="Корр/с №"
        />
      </div>
      <div className={styles.flex}>
        <TextInput
            onChange={({target}) => handleChange(`contactData.requisites.${key}.BIK`, target.value)}
            name={`contactData.requisites.${key}.BIK`}
            value={value?.BIK || ''}
            edited={true}
            className={styles.inputModal}
            label="БИК банка"
        />
        <TextInput
            onChange={({target}) => handleChange(`contactData.requisites.${key}.BankName`, target.value)}
            name={`contactData.requisites.${key}.BankName`}
            value={value?.BankName || ''}
            edited={true}
            className={styles.inputModal}
            label="Наименование банка"
        />
      </div>
      <div className={styles.flex}>
        <TextInput
            onChange={({target}) => handleChange(`contactData.requisites.${key}.LEGAL_ADDRESS`, target.value)}
            name={`contactData.requisites.${key}.LEGAL_ADDRESS`}
            value={value?.LEGAL_ADDRESS || ''}
            edited={true}
            type={'textarea'}
            className={styles.inputModal}
            label="Почтовый адрес"
        />
        <TextInput
            onChange={({target}) => handleChange(`contactData.requisites.${key}.REAL_ADDRESS`, target.value)}
            name={`contactData.requisites.${key}.REAL_ADDRESS`}
            value={value?.REAL_ADDRESS || ''}
            edited={true}
            type={'textarea'}
            className={styles.inputModal}
            label="Фактический адрес"
        />
      </div>
              </>))}

  </FormValidatedModal>
}

export default RequisitesComponent;

