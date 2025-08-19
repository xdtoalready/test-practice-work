import React, { useEffect, useState } from 'react';
import StageBadge, { StageStatuses } from '../../../StagesBadge';
import Button from '../../../../../../../../../../shared/Button';
import TextInput from '../../../../../../../../../../shared/TextInput';
import Dropdown from '../../../../../../../../../../shared/Dropdown/Default';
import TextLink from '../../../../../../../../../../shared/Table/TextLink';
import CommentsList from '../../../../../../../../../../components/CommentsList';
import useTemplatesTypes from '../../../../../../../../hooks/useTemplatesTypes';
import useServiceTypes from '../../../../../../../../../Services/hooks/useServiceTypes';
import useServices from '../../../../../../../../../Services/hooks/useServices';
import styles from './Description.module.sass';
import cn from 'classnames';
import { observer } from 'mobx-react';
import ValuesSelector from '../../../../../../../../../../shared/Selector';
import { colorStatusTypes } from '../../../../../../../../../Clients/clients.types';
import StatusDropdown from '../../../../../../../../../../components/StatusDropdown';
import { colorTasksTypes } from '../../../../../../../../../Tasks/tasks.types';
import {
  colorStatusTaskTypes,
  colorStatusTaskTypesForTaskList,
} from '../../../../../../../../stages.types';
import Loader from "../../../../../../../../../../shared/Loader";
import useAppApi from '../../../../../../../../../../api';
import useTasksApi from '../../../../../../../../../Tasks/tasks.api';
const Index = ({
  data: {
    comments,
    description,
    id,
    comment,
    template,
    service,
    title,
    status,
    related_entity:relatedEntity
  },
  selectedStatus,
  prefix,
  mode,
  handleChange,
  handleSave,
  handleDecline,
  className,
                 isEditMode,
    isLoading
}) => {
  const taskApi = useTasksApi();

  return (
    <div className={cn(styles.border_container, className)}>
      <div className={styles.buttons}>
        <div className={styles.buttons_actions}>

          <StatusDropdown
            name={`${prefix}taskStatus`}
            required={true}
            statuses={colorStatusTaskTypes}
            value={colorStatusTaskTypes[selectedStatus]}
            onChange={(option) =>
              handleChange(`${prefix}taskStatus`, option.key)
            }
          />
        </div>
        <div></div>
      </div>

      <TextInput
        required={true}
        classLabel={styles.input_label}
        onChange={({ target }) => handleChange(target.name, target.value)}
        name={`${prefix}title`}
        value={title}
        edited={true}
        className={styles.input}
        label={'Задача'}
      />

      {/*/>*/}
      { isLoading ? <Loader className={styles.loader}/> : description && (
        <TextInput
          onChange={({ target }) => {
            handleChange(target.name, target.value === '' ? ' ' : target.value);
          }}
          name={`${prefix}description`}
          value={description === '' || description == null ? ' ' : description}
          edited={true}
          type={'editor'}
          className={cn(styles.input, styles.textarea)}
          label={'Описание'}
        />
      )}
      {(mode === 'task' || (mode ==='stage' && isEditMode))  && ( <ValuesSelector
          name={`${prefix}related_entity`}
          placeholder={'Привязать к...'}
          onChange={(e) => {
            if (e.length) {
              const selected = e[0];
              const r = {
                id: selected.value,
                name: selected.name,
                title: selected.name,
                type: selected.type,
              ...(isEditMode && {all_related:relatedEntity?.all_related?.filter(el=>el.id !== selected.id)}),
              };
              if (r.type==='stage' && isEditMode){
                handleChange(`${prefix}stage`,r);
              }
              handleChange(`${prefix}related_entity`, r);
            } else {
              handleChange(`${prefix}related_entity`, null);
            }
          }}
          isMulti={false}
          label="Привязать к: "
          isAsync={!isEditMode || (isEditMode && !relatedEntity?.all_related)}
          options={isEditMode && relatedEntity?.all_related?.map((el)=>({value:el.id,name:el.name,label:el.name, type: 'stage',}))}
          isSearchable={true}
          asyncSearch={async (query) => {
            if (query.length < 4) return [];
            const response = await taskApi.searchTaskable(query);
            const results = [];

            // if (response?.deals) {
            //   results.push(
            //     ...response.deals.map((item) => ({
            //       value: item.id,
            //       label: `Сделка: ${item.name}`,
            //       type: 'deal',
            //       name: item.name,
            //     })),
            //   );
            // }
            if (response?.stages) {
              results.push(
                ...response.stages.map((item) => ({
                  value: item.id,
                  label: `"Этап": ${item.name}`,
                  type: 'stage',
                  name: item.name,
                })),
              );
            }

            return results;
          }}
          value={
           relatedEntity
              ? {
                value: relatedEntity.id,
                label: ` ${relatedEntity.name}`,
                type: relatedEntity.type,
              }
              : null
          }
        />
      ) }
    </div>
  );
};

export default Index;
