import React, { useState } from 'react';
import styles from './Card.module.sass';
import Badge, { statusTypes } from '../../../../../../shared/Badge';
import Card from '../../../../../../shared/Card';
import Icon from '../../../../../../shared/Icon';
import TableMenu from '../../../../../../components/TableMenu';

const ActsAdaptiveCard = ({ data, actions }) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);

  const handleMenuClick = (e, index) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };

  return (
    <div className={styles.container}>
      {data.map((act, index) => {
        return (
          <Card key={act.id} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.name}>
                {act.company ? act.company.name : 'Без клиента'}
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
                    actions={actions(act)}
                    isVisible={true}
                    onClose={() => setActiveMenuIndex(null)}
                  />
                )}
              </div>
            </div>
            <div className={styles.subtitle}>
              Дата создания: {new Date(act.creationDate).toLocaleDateString()}
            </div>
            <div className={styles.footer}>
              <div className={styles.left}>
                <Badge
                  status={act.status}
                  statusType={statusTypes.acts}
                />
              </div>
              <div className={styles.right}>
                <span className={styles.sum}>{act.sum.toLocaleString()} руб.</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ActsAdaptiveCard;
