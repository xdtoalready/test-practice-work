import React, { useState } from 'react';
import Card from '../../../../../shared/Card';
import styles from './Persons.module.sass';
import CardDropdown from '../../../../../shared/Dropdown/Card';
import Title from '../../../../../shared/Title';
import CardInput from '../../../../../shared/Input/Card';
import {
  handleError,
  handleInfo,
  handleSubmit,
} from '../../../../../utils/snackbar';
import { motion } from 'framer-motion';
import { TranslateYTransition } from '../../../../../utils/motion.variants';
import Image from '../../../../../shared/Image';
import { Link } from 'react-router-dom';
import { createBaseMessengerLinksByName } from '../../../../../utils/create.utils';
import useMappedObj from '../../../../../hooks/useMappedObj';
import CreateClientsModal from './Modals/CreateClientsModal';
import useClientsApi from "../../../clients.api";
import useStore from "../../../../../hooks/useStore";
import {useCallsContext} from "../../../../../providers/CallsProvider";

const ClientPersons = ({
  persons,
  onChange,
  onSubmit,
  onReset,
  onAdd,
                         setClientModalData
}) => {
  const mappedPersons = useMappedObj(persons);
  // const [isEditClientModalData, setClientModalData] = useState(null);
  // const api = useClientsApi()
  // const {clientsStore} = useStore()
  const { setSelectedPhone,openCallModal } = useCallsContext();
  const defaultActions = (
    path,
    success,
    info,
    clientId,
    copy = 'Элемент скопирован',
  ) => ({
    copy: (text) => {
      navigator.clipboard.writeText(text).then((r) => handleInfo(copy));
    },
    // delete: ({ name, value }) => onChange(name, ''),
    edit: ({ name, value }) => onChange(name, value),
    submit: () => {
      onSubmit(clientId, success, path);
      // handleSubmit(success);
    },
    reset: () => {
      onReset(path, info);
    },
  });
  const handlePhoneClick = (phone) => {
    openCallModal(phone);
  };

  return (
    <>
      <Card classTitle={styles.title} className={styles.card}>
        <Title
          smallTable={true}
          actions={{
            add: {
              action: () => onAdd(),
              title: 'Добавить клиента',
            },
          }}
          title={'Контактные лица'}
        />
        {mappedPersons?.map(([key, el]) => {
          const values = el;
          return (
            <CardDropdown
                classNameContainer={styles.contaianer_divide}
              inputComponent={() => (
                <CardInput
                  name={`contactPersons.${values.id}.fio`}
                  // class
                  onEdit={() => setClientModalData(values.id)}
                  placeholder={'ФИО...'}
                  classInput={styles.fioInput}
                  type={'text'}
                  value={`${values?.last_name ?? ''} ${values?.name ?? ''} ${values?.middle_name ? values.middle_name : ''} `}
                  actions={{
                    ...defaultActions(
                      `contactPersons.${values.id}.fio`,
                      'ФИО сохранено',
                      'ФИО восстановлено',
                      values.id,
                    ),
                  }}
                />
              )}
              className={styles.dropdown}
              text={<b>{values.fio}</b>}
            >
              <motion.div>
                {values.role && <CardInput
                  placeholder={'Роль...'}
                  name={`contactPersons.${values.id}.role`}
                  type={'text'}
                  value={values.role}
                  actions={defaultActions(
                    `contactPersons.${values.id}.role`,
                    'Роль сохранена',
                    'Роль восстановлена',
                    values.id,
                  )}
                />}
                {values.tel && <CardInput
                  placeholder={'Телефон...'}
                  label={'Телефон'}
                  name={`contactPersons.${values.id}.tel`}
                  type={'tel'}
                  value={values.tel}
                  actions={{call:handlePhoneClick,...defaultActions(
                        `contactPersons.${values.id}.tel`,
                        'Телефон сохранен',
                        'Телефон восстановлен',
                        values.id,
                    )}}
                />}
                {values.comment && <CardInput
                    placeholder={'Комментарий к телефону...'}
                    label={'Комментарий...'}
                    name={`contactPersons.${values.id}.comment`}
                    type={'comment'}
                    value={values.comment}
                    actions={defaultActions(
                        `contactPersons.${values.id}.comment`,
                        'Комментарий сохранен',
                        'Комментарий восстановлен',
                        values.id,
                    )}
                />}
                {values.email && <CardInput
                  placeholder={'Почта...'}
                  label={'Почта'}
                  name={`contactPersons.${values.id}.email`}
                  type={'email'}
                  value={values.email}
                  actions={defaultActions(
                    `contactPersons.${values.id}.email`,
                    'Почта сохранена',
                    'Почта восстановлена',
                    values.id,
                  )}
                />}
                {/*{values.site && <CardInput*/}
                {/*  placeholder={'Сайт...'}*/}
                {/*  label={'Сайт'}*/}
                {/*  name={`contactPersons.${values.id}.site`}*/}
                {/*  type={'site'}*/}
                {/*  value={values.site}*/}
                {/*  actions={defaultActions(*/}
                {/*    `contactPersons.${values.id}.site`,*/}
                {/*    'Сайт сохранен',*/}
                {/*    'Сайт восстановлен',*/}
                {/*    values.id,*/}
                {/*  )}*/}
                {/*/>}*/}
                {Object.values(values.messengers).some((el) => el.value) && (
                  <div className={styles.messengers_container}>
                    <p>Мессенджеры</p>
                    <div className={styles.messengers}>
                      {Object.entries(values?.messengers)
                        .filter(([_, { value }]) => Boolean(value))
                        .map(([key, messenger], index) => {
                          console.log(messenger, 'messenger');

                          return (
                            <Link target="_blank" to={messenger.link}>
                              <Image
                                className={styles.messengers_icon}
                                src={`/leadbro/${key}.svg`}
                                alt={`${key}`}
                              />
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                )}
              </motion.div>
              {/*<CardInput label={'Почта'} name={`contactPersons.${values.id}.email`} type={'email'} value={values.email} actions={defaultActions(`contactPersons.${values.id}.email`,'Почта сохранена','Почта восстановлена')}/>*/}
            </CardDropdown>
          );
        })}
      </Card>
      {/*{isEditClientModalData !== null && (*/}
      {/*  <CreateClientsModal*/}
      {/*      store={clientsStore}*/}
      {/*      api={api}*/}
      {/*    onClose={() => setClientModalData(null)}*/}
      {/*    clientId={isEditClientModalData}*/}
      {/*    companyId={companyId}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};

export default ClientPersons;
