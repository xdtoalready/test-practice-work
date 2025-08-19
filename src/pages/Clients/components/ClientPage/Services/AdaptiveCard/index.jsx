import React from 'react';
import styles from './Card.module.sass';
import Card from '../../../../../../shared/Card';
import Badge from '../../../../../../shared/Badge';
import Avatar from '../../../../../../shared/Avatar';
import cn from 'classnames';
import {
  formatDate,
  formatDateWithoutHours,
} from '../../../../../../utils/formate.date';
import Button from '../../../../../../shared/Button';
import Tooltip from '../../../../../../shared/Tooltip';

const AdaptiveCard = ({ data, className, onPagination }) => {
  return (
    <div className={cn(styles.container, className)}>
      <Card className={styles.card}>
        {data?.map((original) => {
          return (
            <div className={styles.body}>
              <div className={styles.header}>
                <div className={styles.name}>{original?.description}</div>
                <div className={styles.deadline}>
                  {formatDate(original?.deadline)}
                </div>
              </div>
              <div className={styles.footer}>
                <Tooltip title={original?.creator?.name}>
                  <div className={cn(styles.avatar)}>
                    <Avatar imageSrc={original?.creator?.image} />
                  </div>
                </Tooltip>
                <Tooltip title={original?.responsible?.name}>
                  <div className={cn(styles.avatar, styles.posLeft)}>
                    <Avatar imageSrc={original?.responsible?.image} />
                  </div>
                </Tooltip>
              </div>
            </div>
          );
        })}

        {onPagination && (
          <Button
            classname={styles.button}
            isSmallButton={false}
            name={'Показать еще(10)'}
          />
        )}
      </Card>
    </div>
  );
};

export default AdaptiveCard;
