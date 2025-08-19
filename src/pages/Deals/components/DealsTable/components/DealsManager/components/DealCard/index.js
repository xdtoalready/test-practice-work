import React from 'react';
import { useDrag } from 'react-dnd';
import styles from '../DealsList/List.module.sass';
import Card from '../../../../../../../../shared/Card';
import Avatar from '../../../../../../../../shared/Avatar';
import { loadAvatar } from '../../../../../../../../utils/create.utils';
import { sourceTypeRu } from '../../../../../../deals.types';
import {serviceTypeEnum, serviceTypeEnumRu} from "../../../../../../../Services/services.types";

const DealCard = ({ deal }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'DEAL',
    item: { id: deal.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatName = (person) => {
    if (!person) return 'Не указано';

    const lastName = person.lastName || '';
    const firstInitial = person.name ? person.name.charAt(0) + '.' : '';
    const middleInitial = person.middleName
      ? person.middleName.charAt(0) + '.'
      : '';

    const formattedName = `${lastName} ${firstInitial}${middleInitial}`.trim();

    return formattedName || 'Не указано';
  };

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card className={styles.deal}>
        <div className={styles.deal_source}>
          {serviceTypeEnumRu[deal?.serviceType] ?? 'Тип услуги не указан'}
        </div>
        <div className={styles.deal_name}>{deal.name}</div>
        <div className={styles.deal_price}>{formatPrice(deal.price)}</div>
        <div className={styles.deal_note}>{deal?.note}</div>
        <div className={styles.deal_footer}>
          <div className={styles.deal_assignee}>
            {
              <>
                <Avatar
                  className={styles.avatar}
                  imageSrc={deal?.manager?.image ?? loadAvatar()}
                  size={24}
                />
                <span className={styles.deal_assignee_name}>
                  {formatName(deal?.manager)}
                </span>
              </>
            }
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DealCard;
