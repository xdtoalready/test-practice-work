import React from 'react';
import styles from './ServiceItems.module.sass';
import cn from 'classnames';
import Icon from '../../../../../../../../shared/Icon';
import TextInput from '../../../../../../../../shared/TextInput';
import Dropdown from '../../../../../../../../shared/Dropdown/Default';
import { measurementUnitTypesRu } from '../../../../../../types/bills.types';
import Button from '../../../../../../../../shared/Button';

const ServiceItems = ({ items = [], onChange }) => {
  const [forceUpdate, setForceUpdate] = React.useState(0);
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    onChange(newItems);
  };

  // Функция для получения часов и минут из quantity
  const getHoursAndMinutes = (quantity) => {
    if (!quantity || quantity === '') return { hours: '', minutes: '' };
    
    const totalHours = parseFloat(quantity);
    if (isNaN(totalHours)) return { hours: '', minutes: '' };
    
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    
    return { 
      hours: hours.toString(), 
      minutes: minutes.toString() 
    };
  };

  // Функция для обновления количества на основе часов и минут
  const updateQuantityFromTime = (index, hours, minutes) => {
    const hoursNum = parseInt(hours) || 0;
    const minutesNum = parseInt(minutes) || 0;
    
    // Если и часы и минуты пустые, устанавливаем пустое значение
    if (!hours && !minutes) {
      handleItemChange(index, 'quantity', '');
      return;
    }
    
    const totalHours = hoursNum + (minutesNum / 60);
    handleItemChange(index, 'quantity', totalHours);
  };

  // Валидация и обновление часов
  const validateAndUpdateHours = (index, { target }) => {
    const value = target.value;
    if (value === '' || /^\d*$/.test(value)) {
      const item = items[index];
      const { minutes } = getHoursAndMinutes(item.quantity);
      updateQuantityFromTime(index, value, minutes);
    }
  };

  // Валидация и обновление минут
  const validateAndUpdateMinutes = (index, { target }) => {
    const value = target.value;
    if (value === '' || (/^\d*$/.test(value) && parseInt(value) <= 59)) {
      const item = items[index];
      const { hours } = getHoursAndMinutes(item.quantity);
      updateQuantityFromTime(index, hours, value);
    }
  };

  // Функция для обработки изменения количества с учетом единицы измерения
  const handleQuantityChange = (index, value, measurementUnit) => {
    let parsedValue;
    if (measurementUnit === 'hours') {
      parsedValue = parseFloat(value);
    } else {
      parsedValue = parseInt(value);
    }
    if (isNaN(parsedValue)) {
      parsedValue = '';
    }
    
    handleItemChange(index, 'quantity', parsedValue);
  };

  console.log(items);

  const addItem = () => {
    const newItems = [
      ...items,
      {
        id: items.length + 1,
        isNew: true,
        name: '',
        price: '',
        quantity: '',
        measurementUnit: 'pcs',
      },
    ];
    onChange(newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, idx) => idx !== index);
    onChange(newItems);
  };

  return (
    <div className={styles.services_container}>
      {items.map((item, index) => {
        const { hours, minutes } = item.measurementUnit === 'hours' ? getHoursAndMinutes(item.quantity) : { hours: '', minutes: '' };
        
        return (
          <div key={`${index}-${item.measurementUnit}-${forceUpdate}`} className={styles.service_item}>
            <div className={styles.service_header}>
              <h3 className={styles.service_title}>Услуга {index + 1}</h3>
              <button
                className={styles.delete_button}
                onClick={() => removeItem(index)}
              >
                <span>Удалить услугу</span>
                <Icon name="trash" />
              </button>
            </div>

            <div className={styles.service_grid}>
              <div className={styles.input_group}>
                <TextInput
                  label="Название"
                  placeholder="Введите услугу"
                  name={'name'}
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, 'name', e.target.value)
                  }
                  edited={true}
                />

                <TextInput
                  label="Цена без НДС"
                  placeholder="Цена услуги"
                  name={'price'}
                  value={item.price}
                  type="number"
                  onChange={(e) =>
                    handleItemChange(index, 'price', parseFloat(e.target.value))
                  }
                  edited={true}
                />
              </div>

              <div className={styles.input_group}>
                {/* Условный рендеринг для поля количества */}
                {item.measurementUnit === 'hours' ? (
                  <div className={styles.time_inputs_container}>
                    <div className={styles.time_inputs}>
                      <TextInput
                        type={'hours'}
                        name={`hours-${index}`}
                        value={hours}
                        onChange={(e) => validateAndUpdateHours(index, e)}
                        label="Часы"
                        edited={true}
                        className={styles.time_input}
                      />
                      <TextInput
                        type={'minutes'}
                        name={`minutes-${index}`}
                        value={minutes}
                        onChange={(e) => validateAndUpdateMinutes(index, e)}
                        label="Минуты"
                        edited={true}
                        className={styles.time_input}
                      />
                    </div>
                  </div>
                ) : (
                  <TextInput
                    label="Количество"
                    placeholder="Кол-во услуг"
                    value={item.quantity}
                    type="number"
                    step="1"
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value, item.measurementUnit)
                    }
                    edited={true}
                  />
                )}
                
                <Dropdown
                  label="Единица измерения"
                  value={measurementUnitTypesRu[item.measurementUnit]}
                  setValue={(value) => {
                    const newMeasurementUnit = Object.keys(measurementUnitTypesRu).find(
                      (key) => measurementUnitTypesRu[key] === value,
                    );
                    
                    console.log('Переключение единицы измерения:', {
                      from: item.measurementUnit,
                      to: newMeasurementUnit,
                      currentQuantity: item.quantity,
                      index
                    });
                    if (newMeasurementUnit === item.measurementUnit) return;
                    const newItems = items.map((existingItem, idx) => {
                      if (idx !== index) return existingItem;
                      let updatedQuantity = existingItem.quantity;
                      if (newMeasurementUnit === 'pcs') {
                        const currentQuantity = parseFloat(existingItem.quantity) || 0;
                        updatedQuantity = Math.round(currentQuantity);
                        console.log(`Смена на штуки: ${existingItem.quantity} -> ${updatedQuantity}`);
                      } else if (newMeasurementUnit === 'hours') {
                        const currentQuantity = parseFloat(existingItem.quantity) || 0;
                        updatedQuantity = currentQuantity;
                        console.log(`Смена на часы: ${existingItem.quantity} -> ${updatedQuantity}`);
                      }
                      
                      return {
                        ...existingItem,
                        measurementUnit: newMeasurementUnit,
                        quantity: updatedQuantity,
                      };
                    });
                    console.log('Обновленные данные:', newItems[index]);
                    onChange(newItems);
                    setTimeout(() => setForceUpdate(prev => prev + 1), 0);
                  }}
                  options={Object.values(measurementUnitTypesRu)}
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className={styles.add_service_button} onClick={addItem}>
        <span>Добавить услугу</span>
        <Button
          isSmallButton={true}
          adaptiveIcon={<Icon size={16} viewBox={'0 0 16 16'} name={'add'} />}
          classname={cn(styles.add_button)}
          name={'Создать отчет'}
        />
      </div>
    </div>
  );
};

export default ServiceItems;