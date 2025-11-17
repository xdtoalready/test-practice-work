import React from 'react';
import styles from './Card.module.sass';
import Card from '../../../../../../shared/Card';
import ManagerCell from '../../../../../../components/ManagerCell';
import TableLink from '../../../../../../shared/Table/Row/Link';

const TimeTrackingAdaptiveCard = ({ data }) => {
  const formatDuration = (timeSpent) => {
    if (!timeSpent) return '-';
    return `${timeSpent.hours} ч ${timeSpent.minutes} мин`;
  };

  return (
    <div className={styles.container}>
      {data.map((item, index) => {
        const manager = item.employee;
        const employee = {
          ...manager,
          fio: `${manager.lastName ?? ''} ${manager.name ?? ''} ${manager.middleName ?? ''}`,
        };

        return (
          <Card key={index} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.name}>
                <ManagerCell manager={employee} />
              </div>
            </div>
            <div className={styles.subtitle}>
              Дата: {new Date(item.date).toLocaleDateString()}
            </div>
            <div className={styles.footer}>
              <div className={styles.left}>
                {item.link && (
                  <TableLink to={item.link} name={<span className={styles.activity}>{item.link_title}</span>} />
                )}
              </div>
              <div className={styles.right}>
                <div className={styles.info}>
                  <span className={styles.time}>{formatDuration(item.timeSpent)}</span>
                  <span className={styles.cost}>
                    {item.cost ? `${item.cost.toLocaleString()} ₽` : '-'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TimeTrackingAdaptiveCard;
