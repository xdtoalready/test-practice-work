import React, { useState } from 'react';
import styles from './Report.module.sass';
import Button from '../../../../../../shared/Button';
import Icon from '../../../../../../shared/Icon';
import CardField from '../CardField';
import Basis from '../../../../../../shared/Basis';
import CreateReportModal from './components/CreateReportModal';
import ConfirmationModal from '../../../../../../components/ConfirmationModal';
import { handleInfo, handleError } from '../../../../../../utils/snackbar';
import { http, handleHttpError } from '../../../../../../shared/http';

const Report = ({ stage, onReportGenerated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const report = stage?.report;

  const handleOpenPdf = () => {
    if (report?.view) {
      window.open(report.view, '_blank');
    }
  };

  const handleDeleteReport = async () => {
    try {
      await http.delete(`/api/reports/${report.id}`);
      handleInfo('Отчет удален');
      setIsDeleteModalOpen(false);
      if (onReportGenerated) {
        onReportGenerated();
      }
    } catch (error) {
      console.error('Ошибка при удалении отчета:', error);
      handleHttpError(error);
      handleError('Ошибка при удалении отчета');
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <CardField label={'Отчет'}>
        <Basis className={styles.report_container}>
          {report ? (
            <div className={styles.report_buttons}>
              <Button
                isSmallButton={true}
                adaptiveIcon={<Icon size={16} viewBox={'0 0 20 20'} name={'download'} />}
                classname={styles.button}
                name={'Просмотр отчета'}
                onClick={handleOpenPdf}
              />
              <Button
                isSmallButton={true}
                adaptiveIcon={<Icon size={16} viewBox={'0 0 20 20'} name={'trash'} />}
                classname={styles.button}
                name={'Удалить отчет'}
                onClick={() => setIsDeleteModalOpen(true)}
              />
            </div>
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

      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteReport}
          label="Вы уверены, что хотите удалить отчет?"
        />
      )}
    </div>
  );
};

export default Report;