import React, { useState } from 'react';
import styles from './ServicesCell.module.sass';
import { Link } from 'react-router-dom';
import HiddenCount from '../../../../../../components/HiddenCount';
import NoContentCell from '../../../../../../components/NoContentCell';

const ServicesCell = ({ services }) => {
  const [showAll, setShowAll] = useState(false);

  // Вычисляем количество скрытых услуг
  const hiddenCount = Number(services?.total) - 1; // Учитываем, что одна услуга всегда видна

  const toggleShowAll = () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };

  // Определяем отображаемые сервисы
  const visibleServices = showAll ? [services?.value] : [services?.value];

  return (
    <NoContentCell value={services.value}>
      <div className={styles.servicesCell}>
        {/* Отображаем видимые услуги */}
        {visibleServices.map((service, index) => (
          <div key={index} className={styles.services}>
            <div className={styles.name}>
              <Link className={styles.link} to={`/services/${service?.id}`}>
                {service?.description}
              </Link>
              <HiddenCount
                hiddenCount={hiddenCount}
                show={hiddenCount > 0 && !showAll}
                // onClick={toggleShowAll}
              />
            </div>
          </div>
        ))}
      </div>
    </NoContentCell>
  );
};

export default ServicesCell;
