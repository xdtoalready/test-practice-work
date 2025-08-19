import React from 'react';
import styles from '../../../../../Stages/components/StagesPage/components/ClientInfo/Info.module.sass';
import Card from '../../../../../../shared/Card';
import LabeledParagraph from '../../../../../../shared/LabeledParagraph';
import { formatDateWithDateAndYear } from '../../../../../../utils/formate.date';
import HoursComponent from '../../../../../../components/HoursComponent';
import { convertToHours } from '../../../../../../utils/format.time';
import cn from 'classnames';
import { compareTime } from '../../../../../../utils/compare';
import mainStyles from './DealInfo.module.sass';
import {sourceTypeRu} from "../../../../deals.types";

const DealInfo = ({ source, serviceType, price }) => {
  return (
    <div className={cn(styles.container, mainStyles.container)}>
      <Card
        className={styles.card}
        classCardHead={styles.header}
        title={'Информация'}
      >
        {source && (
          <LabeledParagraph label={'Рекламный источник'} text={sourceTypeRu[source]} />
        )}
        {serviceType && (
          <LabeledParagraph label={'Тип услуги'} text={serviceType} />
        )}

        {price && <LabeledParagraph label={'Стоимость сделки'} text={price} />}
      </Card>
    </div>
  );
};

export default DealInfo;
