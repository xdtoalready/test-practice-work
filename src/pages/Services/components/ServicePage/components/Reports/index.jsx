import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Table from '../../../../../../shared/Table';
import Button from '../../../../../../shared/Button';
import Icon from '../../../../../../shared/Icon';
import Badge, { statusTypes } from '../../../../../../shared/Badge';
import cn from 'classnames';
import styles from '../Bills/Bills.module.sass'; // Переиспользую стили Bills
import CreateReportModal from '../Report/components/CreateReportModal';
import ConfirmationModal from '../../../../../../components/ConfirmationModal';
import { handleInfo, handleError } from '../../../../../../utils/snackbar';
import { http, handleHttpError } from '../../../../../../shared/http';

const Reports = observer(({ company, service, stage, reports = [], onReportGenerated }) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRefreshModalOpen, setIsRefreshModalOpen] = useState(false);
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

  const handleRefreshReport = async () => {
    try {
      await http.get(`/api/reports/${selectedReport.id}/refresh`);
      handleInfo('Отчет обновлен');
      setIsRefreshModalOpen(false);
      setSelectedReport(null);
      if (onReportGenerated) {
        onReportGenerated();
      }
    } catch (error) {
      console.error('Ошибка при обновлении отчета:', error);
      handleHttpError(error);
      handleError('Ошибка при обновлении отчета');
      setIsRefreshModalOpen(false);
    }
  };

  const handleAgreeReport = async (report) => {
    try {
      await http.get(`/api/reports/${report.id}/set_agreed`);
      handleInfo('Отчет согласован');
      if (onReportGenerated) {
        onReportGenerated();
      }
    } catch (error) {
      console.error('Ошибка при согласовании отчета:', error);
      handleHttpError(error);
      handleError('Ошибка при согласовании отчета');
    }
  };

  const cols = useMemo(
    () => [
      {
        Header: 'Номер',
        id: 'number',
        width: '10%',
        Cell: ({ row }) => {
          const data = row?.original;
          return <p>{data.number || `Отчет #${data.id}`}</p>;
        },
      },
      {
        Header: 'Статус',
        id: 'status',
        width: '10%',
        Cell: ({ row }) => {
          const data = row?.original;
          return (
            <Badge
              status={data.status}
              statusType={statusTypes.reports}
            />
          );
        },
      },
      {
        Header: 'Скачать',
        width: '20%',
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
        width: '20%',
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
      {
        Header: 'Согласовать',
        width: '20%',
        id: 'agree',
        Cell: ({ row }) => {
          const data = row?.original;
          if (!data.canBeAgreed) {
            return null;
          }
          return (
            <Button
              onClick={() => handleAgreeReport(data)}
              type={'secondary'}
              after={<Icon size={24} name={'check'} />}
              classname={cn(styles.button, styles.button_bills)}
              name={'Согласовать'}
            />
          );
        },
      },
      {
        Header: 'Обновить',
        width: '20%',
        id: 'refresh',
        Cell: ({ row }) => {
          const data = row?.original;
          return (
            <Button
              onClick={() => {
                setSelectedReport(data);
                setIsRefreshModalOpen(true);
              }}
              type={'secondary'}
              after={<Icon size={24} name={'refresh'} />}
              classname={cn(styles.button, styles.button_bills)}
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
      {isRefreshModalOpen && (
        <ConfirmationModal
          isOpen={isRefreshModalOpen}
          onClose={() => {
            setIsRefreshModalOpen(false);
            setSelectedReport(null);
          }}
          onConfirm={handleRefreshReport}
          label="Вы действительно хотите обновить отчет?"
        />
      )}
    </div>
  );
});

export default Reports;