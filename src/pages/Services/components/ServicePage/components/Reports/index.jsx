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
import { splitHtmlIntoPages } from '../../../../../../utils/pdf-report.utils';

const Reports = observer(({ company, service, stage, reports = [], onReportGenerated }) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRefreshModalOpen, setIsRefreshModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      setIsRefreshing(true);

      console.log('[Reports] Начало обновления отчёта:', selectedReport.id);
      console.log('[Reports] Stage ID:', stage?.id);

      // Шаг 1: Получаем контент через prepare_tasks для stage
      console.log('[Reports] Получаем контент через prepare_tasks...');
      const prepareResponse = await http.get(`/api/reports/${stage?.id}/prepare_tasks`);

      const htmlContent = prepareResponse.data?.data || prepareResponse.data || '';
      console.log('[Reports] Получен HTML контент:', htmlContent);

      // Шаг 2: Разбиваем контент на страницы (с предзагрузкой изображений)
      console.log('[Reports] Разбиваем контент на страницы...');
      const splitContent = await splitHtmlIntoPages(htmlContent);
      console.log('[Reports] Разбитый контент:', splitContent);

      // Шаг 3: Отправляем на refresh (теперь POST с телом)
      console.log('[Reports] Отправляем на refresh для report:', selectedReport.id);
      await http.post(`/api/reports/${selectedReport.id}/refresh`, {
        tasks: splitContent,
      });

      console.log('[Reports] Отчёт обновлён');
      handleInfo('Отчет обновлен');
      setIsRefreshModalOpen(false);
      setSelectedReport(null);
      if (onReportGenerated) {
        onReportGenerated();
      }
    } catch (error) {
      console.error('[Reports] Ошибка при обновлении отчета:', error);
      handleHttpError(error);
      handleError('Ошибка при обновлении отчета');
      setIsRefreshModalOpen(false);
    } finally {
      setIsRefreshing(false);
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
        width: '20%',
        Cell: ({ row }) => {
          return (
            <Badge
              status={row?.original.status}
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
          return (
            <Button
              onClick={() => window.open(`/documents/reports/${row?.original.id}`, '_blank')}
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
          return (
            <Button
              onClick={() => {
                setSelectedReport(row?.original);
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
        width: '10%',
        id: 'refresh',
        Cell: ({ row }) => {
          const data = row?.original;
          const isDisabled = isRefreshing && selectedReport?.id === data.id;
          return (
            <div
              onClick={() => {
                if (!isRefreshing) {
                  setSelectedReport(data);
                  setIsRefreshModalOpen(true);
                }
              }}
              style={{
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                backgroundColor: isDisabled ? '#ccc' : '#FF6A55',
                color: 'white',
                padding: '0',
                borderRadius: '50%',
                opacity: isDisabled ? 0.6 : 1,
                pointerEvents: isRefreshing ? 'none' : 'auto',
              }}
            >
              <Icon size={12} name={'refresh'} fill={'#FFF'} />
            </div>
          );
        },
      },
    ],
    [isRefreshing, selectedReport],
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
            if (!isRefreshing) {
              setIsRefreshModalOpen(false);
              setSelectedReport(null);
            }
          }}
          onConfirm={handleRefreshReport}
          label={isRefreshing ? 'Разбиваем на страницы...' : 'Вы действительно хотите обновить отчет?'}
          disabled={isRefreshing}
        />
      )}
    </div>
  );
});

export default Reports;