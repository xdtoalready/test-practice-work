import React, { useState } from 'react';
import styles from './Report.module.sass';
import Button from '../../../../../../shared/Button';
import Icon from '../../../../../../shared/Icon';
import CardField from '../CardField';
import Basis from '../../../../../../shared/Basis';
import CreateReportModal from './components/CreateReportModal';

const Report = ({ stage, onReportGenerated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const report = stage?.report;

  const handleOpenPdf = () => {
    if (report?.path) {
      window.open(report.path, '_blank');
    }
  };

  return (
    <div>
      <CardField label={'Отчет'}>
        <Basis className={styles.report_container}>
          {report?.path ? (
            <Button
              isSmallButton={true}
              adaptiveIcon={<Icon size={16} viewBox={'0 0 20 20'} name={'download'} />}
              classname={styles.button}
              name={'Открыть отчет'}
              onClick={handleOpenPdf}
            />
          ) : (
            <Button
              isSmallButton={true}
              adaptiveIcon={<Icon size={16} viewBox={'0 0 20 20'} name={'add'} />}
              classname={styles.button}
              name={'Создать отчет'}
              onClick={() => setIsModalOpen(true)}
            />
          )}
        </Basis>
      </CardField>

      {isModalOpen && (
        <CreateReportModal
          stageId={stage?.id}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            if (onReportGenerated) {
              onReportGenerated();
            }
          }}
        />
      )}
    </div>
  );
};

export default Report;