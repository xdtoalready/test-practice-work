import React, { useMemo } from 'react';
import Dropdown from '../../../../../../shared/Dropdown/Default';
import styles from './filter.module.sass';

const Index = ({
  data,
  selectedService,
  selectedManager,
  onServiceChange,
  onManagerChange,
}) => {
  const serviceOptions = useMemo(() => {
    const services = ['Все'];
    data?.forEach((item) => {
      services.push(item.title);
    });
    return services;
  }, [data]);

  const managerOptions = useMemo(() => {
    const managers = [{ id: 'all', name: 'Все' }];
    data?.forEach((item) => {
      managers.push({
        id: item.manager.id,
        name: `${item.manager.name} ${item.manager.surname}`,
      });
    });
    return managers;
  }, [data]);

  console.log(
    selectedService,
    selectedManager,
    serviceOptions,
    managerOptions,
    'opt',
  );

  const handleServiceChange = (service) => {
    onServiceChange(service);
  };

  const handleManagerChange = (manager) => {
    onManagerChange(manager);
  };
  return (
    <div>
      <div className={styles.item}>
        <Dropdown
          value={selectedService}
          setValue={handleServiceChange}
          options={serviceOptions}
          label="Услуга"
          // renderOption={(option) => option?.name}
          // renderValue={(value) => value?.name}
        />
      </div>
      <div>
        <Dropdown
          value={selectedManager}
          setValue={handleManagerChange}
          options={managerOptions}
          label="Ответственный"
          renderOption={(option) => option?.name}
          renderValue={(value) => value?.name}
        />
      </div>
    </div>
  );
};

export default Index;
