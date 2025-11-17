import React, { useState } from 'react';
import styles from './Card.module.sass';
import Badge, { statusTypes } from '../../../../../../shared/Badge';
import Card from '../../../../../../shared/Card';
import Icon from '../../../../../../shared/Icon';
import TableMenu from '../../../../../../components/TableMenu';

const ReportsAdaptiveCard = ({ data, actions }) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);

  const handleMenuClick = (e, index) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };

  return (
    <div className={styles.container}>
      {data.map((report, index) => {
        return (
          <Card key={report.id} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.name}>
                {report.title || 'Без названия'}
              </div>
              <div className={styles.menuButton}>
                <Icon
                  fill={'#6F767E'}
                  name={'more-horizontal'}
                  size={24}
                  onClick={(e) => handleMenuClick(e, index)}
                />
                {activeMenuIndex === index && (
                  <TableMenu
                    actions={actions(report)}
                    isVisible={true}
                    onClose={() => setActiveMenuIndex(null)}
                  />
                )}
              </div>
            </div>
            <div className={styles.subtitle}>
              Дата создания: {report.creationDate ? new Date(report.creationDate).toLocaleDateString() : '—'}
            </div>
            <div className={styles.footer}>
              <div className={styles.left}>
                <Badge
                  status={report.status}
                  statusType={statusTypes.reports}
                />
                {report.company && (
                  <span className={styles.client}>{report.company.name}</span>
                )}
              </div>
              <div className={styles.right}>
                <div className={styles.dates}>
                  {report.viewedAt && (
                    <div className={styles.date}>
                      <span className={styles.dateLabel}>Просмотр:</span>
                      <span>{new Date(report.viewedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {report.agreedAt && (
                    <div className={styles.date}>
                      <span className={styles.dateLabel}>Согласование:</span>
                      <span>{new Date(report.agreedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ReportsAdaptiveCard;
