import React, { useState } from 'react';
import Card from '../../../../../../../../shared/Card';
import StageBadge from '../StagesBadge';
import Tooltip from '../../../../../../../../shared/Tooltip';
import Avatar from '../../../../../../../../shared/Avatar';
import {
  formatDateWithDateAndYear,
  formatDateWithoutHours,
} from '../../../../../../../../utils/formate.date';
import styles from './Adpative.module.sass';
import Icon from '../../../../../../../../shared/Icon';
import EditModal from '../EditModal';

const Index = ({ data, statusType }) => {
  const [opened, setOpened] = useState(false);

  return (
    <div className={styles.container}>
      {data.map((original) => {
        return (
          <>
            <Card className={styles.card}>
              <div className={styles.header}>
                <div className={styles.name}>{original.title}</div>
                <Icon
                  size={20}
                  name="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setOpened(!opened);
                  }}
                />
              </div>
              <div>
                <div className={styles.deadline}>
                  Дедлайн: {formatDateWithDateAndYear(original.deadline)}
                </div>
              </div>
              <div className={styles.footer}>
                <div className={styles.status}>
                  <StageBadge
                    classname={styles.status_adaptiveStatus}
                    status={original.status}
                    statusType={statusType}
                  />
                </div>
                {original?.responsibles?.map((el) => (
                  <Tooltip title={`${el.fio}`}>
                    <div className={styles.avatar}>
                      <Avatar imageSrc={el.image} />
                    </div>
                  </Tooltip>
                ))}
              </div>
            </Card>
            {/*{opened && <EditModal data={original} />}*/}
          </>
        );
      })}
    </div>
  );
};

export default Index;
