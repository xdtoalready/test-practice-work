import React from 'react';
import Card from '../../../../../../shared/Card';
import CardInput from '../../../../../../shared/Input/Card';
import styles from './Requisites.module.sass';

const RequisitesCard = ({ contactData, client, onActions }) => {
  const requisites = contactData?.requisites?.[0] || {};

  return (
    <Card className={styles.card}>
      {/* 1️⃣ Основные реквизиты компании */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Основные реквизиты компании</div>

        <CardInput
          label="Наименование компании"
          name="contactData.requisites.0.LEGAL_NAME"
          value={requisites.LEGAL_NAME || ''}
          readOnly={true}
          placeholder="Автоматически заполняется при вводе ИНН"
          className={styles.readOnlyField}
        />

        <CardInput
          label="ИНН"
          name="contactData.requisites.0.INN"
          value={requisites.INN || ''}
          actions={onActions(
            'contactData.requisites.0.INN',
            'ИНН сохранен',
            'ИНН восстановлен'
          )}
        />

        <CardInput
          label="КПП"
          name="contactData.requisites.0.KPP"
          value={requisites.KPP || ''}
          readOnly={true}
          placeholder="Автоматически заполняется при вводе ИНН"
          className={styles.readOnlyField}
        />

        <CardInput
          label="ОГРН"
          name="contactData.requisites.0.OGRN"
          value={requisites.OGRN || ''}
          readOnly={true}
          placeholder="Автоматически заполняется при вводе ИНН"
          className={styles.readOnlyField}
        />

        <CardInput
          label="Юр. адрес"
          name="contactData.requisites.0.LEGAL_ADDRESS"
          value={requisites.LEGAL_ADDRESS || ''}
          type="textarea"
          readOnly={true}
          placeholder="Автоматически заполняется при вводе ИНН"
          className={styles.readOnlyField}
        />

        <CardInput
          label="Факт. адрес"
          name="contactData.requisites.0.REAL_ADDRESS"
          value={requisites.REAL_ADDRESS || ''}
          type="textarea"
          actions={onActions(
            'contactData.requisites.0.REAL_ADDRESS',
            'Факт. адрес сохранен',
            'Факт. адрес восстановлен'
          )}
        />
      </div>

      {/* 2️⃣ Банковские реквизиты */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Банковские реквизиты</div>
        
        <CardInput
          label="БИК банка"
          name="contactData.requisites.0.BIK"
          value={requisites.BIK || ''}
          actions={onActions(
            'contactData.requisites.0.BIK',
            'БИК сохранен',
            'БИК восстановлен'
          )}
        />
        
        <CardInput
          label="Банк"
          name="contactData.requisites.0.BankName"
          value={requisites.BankName || ''}
          readOnly={true}
          placeholder="Автоматически заполняется при вводе БИК"
          className={styles.readOnlyField}
        />
        
        <CardInput
          label="Корр. счёт"
          name="contactData.requisites.0.CORR_RS"
          value={requisites.CORR_RS || ''}
          readOnly={true}
          placeholder="Автоматически заполняется при вводе БИК"
          className={styles.readOnlyField}
        />
      </div>

      {/* 3️⃣ Расчетный счет */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Расчетный счет</div>
        
        <CardInput
          label="Р/с №"
          name="contactData.requisites.0.RS"
          value={requisites.RS || ''}
          actions={onActions(
            'contactData.requisites.0.RS',
            'Расчетный счет сохранен',
            'Расчетный счет восстановлен'
          )}
        />
      </div>
    </Card>
  );
};

export default RequisitesCard;