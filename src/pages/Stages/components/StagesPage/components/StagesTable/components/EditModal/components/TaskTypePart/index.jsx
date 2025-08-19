import React, { useEffect, useState } from 'react';
import ResponsibleInput from '../../../../../../../../../../shared/Input/ResponsibleInput';
import TextInput from '../../../../../../../../../../shared/TextInput';
import styles from '../../../../../../../../../Services/components/ServicesTable/components/EditModal/Modal.module.sass';
import {
  formatDate,
  formatDateWithOnlyDigits,
} from '../../../../../../../../../../utils/formate.date';
import { convertToHours } from '../../../../../../../../../../utils/format.time';
import Switch from '../../../../../../../../../../shared/Switch';
import Dropdown from '../../../../../../../../../../shared/Dropdown/Default';
import Calendar from '../../../../../../../../../../shared/Datepicker';
import ValuesSelector from '../../../../../../../../../../shared/Selector';
import useMembers from '../../../../../../../../../Members/hooks/useMembers';
import { tasksTypesRu } from '../../../../../../../../../Tasks/tasks.types';
import LabeledParagraph from '../../../../../../../../../../shared/LabeledParagraph';
import cn from 'classnames';

const Index = ({
  data: {
    auditors: initialAuditors,
    executors: initialExecutors,
    responsibles: initialResponsibles,
    creator,
    type,
    taskLinked,
    deadline,
    deadlineTime,
    actualTime,
    cost,
  },
                 showInLk,
  isEditMode,
  types,
  handleChange,
  handleAdd,
  className,
}) => {
  const [mappedAuditors, setMappedAuditors] = useState([]);
  const [mappedExecutors, setMappedExecutors] = useState([]);
  const [mappedResponsibles, setMappedResponsibles] = useState([]);
  const { members } = useMembers();
  console.log(creator, 'creator');
  console.log(showInLk, 'showInLk');
  const renderLabelForSelector = (source) =>
    `${source?.surname ?? ''} ${source?.name ?? ''} ${source?.middleName ?? ''}`;

  return (
    <div className={className}>
      <TextInput
        disabled={false}
        label={'Связанная задача'}
        name={'taskLinked'}
        value={taskLinked}
        onChange={({ target }) => handleChange(target.name, target.value)}
        className={styles.input}
      />
      <Dropdown
        required={true}
        name={'type'}
        // value={selectedService}
        // setValue={handleServiceChange}
        // options={serviceOptions}
        // label="Услуга"
        renderOption={(opt) => tasksTypesRu[opt]}
        label={'Тип задачи'}
        options={types}
        setValue={(e) => handleChange('type', e)}
        value={type}
        renderValue={(value) => tasksTypesRu[value]}
        className={styles.dropdown}
      />
        <div className={` ${styles.addZIndex} ${styles.relative}`}>
        <Calendar
          onChange={(data) => handleChange('deadline', data)}
          label={'Дедлайн'}
          name={'deadline'}
          value={deadline}
          // value={formatDateWithOnlyDigits(deadline)}
          readonly={true}
          className={cn(styles.input,styles.addZIndex)}
        />
        </div>
        {/*{creator && (*/}
        {/*    <div className={styles.lowZIndex} >*/}
        {/*        <Dropdown*/}
        {/*            className={cn(styles.input)}*/}
        {/*            label={'Создатель'}*/}
        {/*            value={renderLabelForSelector(creator)}*/}
        {/*            disabled={true}*/}
        {/*        />*/}
        {/*    </div>*/}
        {/*)}*/}


      <ValuesSelector
        onChange={(e) => {
          handleChange(
            'responsibles',
            e.length
              ? members.filter((member) =>
                  e.some((option) => option.value === member.id),
                )
              : [],
          );
        }}
        isMulti={false}
        label="Ответственный"
        options={members.map((el) => ({
          value: el.id,
          label: renderLabelForSelector(el),
        }))}
        value={
          initialResponsibles && initialResponsibles[0]
            ? initialResponsibles.map((el) => ({
                value: el?.id ?? null,
                label: renderLabelForSelector(el),
              }))
            : []
        }
      />
      <ValuesSelector
        onChange={(e) =>
          handleChange(
            'auditors',
            e.length
              ? members.filter((member) =>
                  e.some((option) => option.value === member.id),
                )
              : [],
          )
        }
        isMulti={true}
        label="Аудиторы"
        options={members.map((el) => ({
          value: el.id,
          label: renderLabelForSelector(el),
        }))}
        value={
          initialAuditors
            ? initialAuditors.map((el) => ({
                value: el.id,
                label: renderLabelForSelector(el),
              }))
            : []
        }
      />
      <TextInput
        label={'Плановое время, ч'}
        name={'deadlineTime'}
        type={'number'}
        value={convertToHours(deadlineTime)}
        // disabled={isEditMode}
        onChange={({ target }) => handleChange(target.name, target.value)}
        className={styles.input}
      />

      <LabeledParagraph
        labelClass={styles.label}
        label={'Фактическое время, ч'}
        text={convertToHours(actualTime) || 'Не указано'}
      />
      {/*<TextInput*/}
      {/*    disabled={true}*/}

      {/*    label={'Стоимость задачи'}*/}
      {/*    name={'actualTime'}*/}
      {/*    // onChange={({ target }) => handleChange(target.name, target.value)}*/}
      {/*    value={cost}*/}
      {/*    className={styles.input}*/}
      {/*/>*/}
      <LabeledParagraph
        labelClass={styles.label}
        label={'Стоимость задачи'}
        text={cost ?? 'Не указано'}
      />

      <ValuesSelector
        onChange={(e) =>
          handleChange(
            'executors',
            e.length
              ? members.filter((member) =>
                  e.some((option) => option.value === member.id),
                )
              : [],
          )
        }
        required={true}
        name={'executors'}
        isMulti={false}
        label="Исполнитель"
        options={members.map((el) => ({
          value: el.id,
          label: `${el?.surname ?? ''} ${el?.name ?? ''} ${el?.middleName ?? ''}`,
        }))}
        value={
          initialExecutors
            ? initialExecutors.map((el) => ({
                value: el.id,
                label: `${el?.surname ?? ''} ${el?.name ?? ''} ${el?.middleName ?? ''}`,
              }))
            : []
        }
      />
      <Switch
        className={styles.switch}
        name={'showInLk'}
        label={'Показать в личном кабинете'}
        value={showInLk}
        onChange={(name, value) => handleChange(name, value)}
      />
    </div>
  );
};

export default Index;
