import Card from '../../../../../shared/Card';
import Title from '../../../../../shared/Title';
import MultiInputContacts from '../Contacts/Inputs/MultiInput.component';
import { handleError, handleInfo } from '../../../../../utils/snackbar';
import CardInput from '../../../../../shared/Input/Card';
import React from 'react';
import styles from './Tokens.module.sass';
import personStyles from '../Persons/Persons.module.sass'
import useMappedObj from '../../../../../hooks/useMappedObj';
import CardDropdown from '../../../../../shared/Dropdown/Card';
import { motion } from 'framer-motion';

const ClientTokens = ({
  sites,
  onRemove,
  onChange,
  onSubmit,
  onReset,
  onAdd,
                        setSiteModalData
}) => {
  const mappedSites = useMappedObj(sites);
  const defaultActions = (path, success, info,siteId, copy = 'Элемент скопирован') => {
    // console.log(properties,'smile')
    return {
      copy: (text) => {
        navigator.clipboard.writeText(text).then((r) => handleInfo(copy));
      },
      // delete: ({ name }) => {
      //   onRemove(name);
      //   // setLength((prev) => ({...prev,[middleProp]:prev[middleProp]-1}))
      //   handleError('Элемент удален');
      // },
      edit: ({ name, value }) => onChange(name, value),
      submit: () => {
        onSubmit(path,siteId,success);
      },
      reset: () => {
        onReset(path);
        handleInfo(info);
      },
    };
  };

  return (
    <Card classTitle={styles.title} className={styles.card}>
      <Title smallTable={true}
             actions={{
               add: {
                 action: () => onAdd(),
                 title: 'Добавить сайт',
               },
             }}
             title={'Доступы к сайтам'} />
      {mappedSites?.map(([key, site]) => {
        return (
          <CardDropdown
            classNameContainer={styles.contaianer_divide}

            inputComponent={() => (
              <CardInput
                name={`sites.${site.id}.url`}
                onEdit={() => setSiteModalData(site.id)}
                placeholder={'URL сайта...'}
                classInput={styles.urlInput}
                type={'text'}
                value={site.url}
                actions={{
                  ...defaultActions(
                    `sites.${site.id}.url`,
                    'URL сохранен',
                    '',
                    site.id,
                  ),
                }}
              />
            )}
            className={styles.dropdown}
            text={<b>{site.url}</b>}
          >
            <motion.div>
              <CardInput
                placeholder={'Id проекта Topvisor...'}
                label={'Topvisor ID'}
                name={`sites.${site.id}.topvisor_token`}
                type={'text'}
                value={site.topvisor_token}
                actions={defaultActions(
                  `sites.${site.id}.topvisor_token`,
                  'Topvisor ID сохранен',
                  '',
                  site.id,
                )}
              />
              <CardInput
                placeholder={'Id Яндекс метрики...'}
                label={'Яндекс Метрика ID'}
                name={`sites.${site.id}.ymetrics_token`}
                type={'text'}
                value={site.ymetrics_token}
                actions={defaultActions(
                  `sites.${site.id}.ymetrics_token`,
                  'Яндекс Метрика ID сохранен',
                  '',
                  site.id,
                )}
              />
            </motion.div>
          </CardDropdown>
        );
      })}
    </Card>
  );
};

export default ClientTokens;
