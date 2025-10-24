import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Table from '../../../../../../shared/Table';
import Button from '../../../../../../shared/Button';
import Icon from '../../../../../../shared/Icon';
import cn from 'classnames';
import styles from '../Bills/Bills.module.sass'; // Переиспользую стили Bills
import CreateReportModal from '../Report/components/CreateReportModal';
import ConfirmationModal from '../../../../../../components/ConfirmationModal';
import { handleInfo, handleError } from '../../../../../../utils/snackbar';
import { http, handleHttpError } from '../../../../../../shared/http';

const Reports = observer(({ company, service, stage, reports = [], onReportGenerated }) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleDeleteReport = async () => {
    try {
      await http.delete(`/api/reports/${selectedReport.id}`);
      handleInfo('Отчет удален');
      setIsDeleteModalOpen(false);
      setSelectedReport(null);
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

  const cols = useMemo(
    () => [
      {
        Header: 'Номер',
        id: 'number',
        width: '15%',
        Cell: ({ row }) => {
          const data = row?.original;
          return <p>{data.number || `Отчет #${data.id}`}</p>;
        },
      },
      {
        Header: 'Период',
        id: 'period',
        width: '20%',
        Cell: ({ row }) => {
          const data = row?.original;
          return <p>{data.period || '-'}</p>;
        },
      },
      {
        Header: 'Скачать',
        width: '30%',
        id: 'download',
        Cell: ({ row }) => {
          const data = row?.original;
          return (
            <Button
              onClick={() => {
                if (data.view) {
                  window.open(data.view, '_blank');
                }
              }}
              type={'secondary'}
              after={<Icon size={24} name={'download'} />}
              classname={cn(styles.button, styles.button_bills)}
              name={'Просмотр отчета'}
            />
          );
        },
      },
      {
        Header: 'Удалить',
        width: '35%',
        id: 'delete',
        Cell: ({ row }) => {
          const data = row?.original;
          return (
            <Button
              onClick={() => {
                setSelectedReport(data);
                setIsDeleteModalOpen(true);
              }}
              type={'secondary'}
              after={<Icon size={24} name={'trash'} />}
              classname={cn(styles.button, styles.button_bills)}
              name={'Удалить отчет'}
            />
          );
        },
      },
    ],
    [],
  );

  const data = useMemo(() => reports ?? [], [reports]);

  return (
    <div className={styles.table_container}>
      <Table
        withHeaderWhenEmpty={false}
        smallTable={true}
        headerActions={{
          add: {
            action: () => setReportModalOpen(true),
            isSmall: true,
            cls: `${styles.button} ${styles.button_title}`,
            type: 'primary',
            title: 'Создать отчет',
          },
        }}
        title={'Отчеты'}
        data={data}
        columns={cols}
      />
      {reportModalOpen && (
        <CreateReportModal
          stageId={stage?.id}
          onClose={() => setReportModalOpen(false)}
          onSuccess={() => {
            setReportModalOpen(false);
            if (onReportGenerated) {
              onReportGenerated();
            }
          }}
        />
      )}
      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedReport(null);
          }}
          onConfirm={handleDeleteReport}
          label="Вы уверены, что хотите удалить отчет?"
        />
      )}
    </div>
  );
});

export default Reports;