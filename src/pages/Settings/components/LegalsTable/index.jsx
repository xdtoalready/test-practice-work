import { observer } from 'mobx-react';
import useStore from '../../../../hooks/useStore';
import { useCallback, useState } from 'react';
import usePagingData from '../../../../hooks/usePagingData';
import Table from '../../../../shared/Table';
import useLegalsApi from '../../api/legals.api';
import styles from './Table.module.sass';
import React from 'react';
import { LoadingProvider } from '../../../../providers/LoadingProvider';
import EditModal from './components/EditModal';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { handleError, handleInfo } from '../../../../utils/snackbar';

const LegalsTable = observer(({ currentSwitcher }) => {
  const { legalsStore } = useStore();
  const api = useLegalsApi();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEntity, setCurrentEntity] = useState(null);
  const [legalToDelete, setLegalToDelete] = useState(null);
  const fetchLegalEntities = useCallback((page) => {
    api.getLegals(page);
  }, []);

  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedData,
    itemsPerPage,
    handlePageChange,
  } = usePagingData(legalsStore, fetchLegalEntities, () =>
    legalsStore?.getLegals(),
  );

  const handleEdit = (entity) => {
    setCurrentEntity(entity);
    setEditModalOpen(true);
  };

  const cols = React.useMemo(
    () => [
      {
        Header: 'ID',
        id: 'id',
        accessor: 'id',
        width: '10%',
        Cell: ({ row }) => <span>{row.original.id}</span>,
      },
      {
        Header: 'Название компании',
        id: 'companyName',
        accessor: 'companyName',
        width: '40%',
        Cell: ({ row }) => <span>{row.original.companyName}</span>,
      },
      {
        Header: 'Основное юр. лицо',
        id: 'isMainLegalEntity',
        accessor: 'isMainLegalEntity',
        width: '25%',
        Cell: ({ row }) => (
          <span>{row.original.isMainLegalEntity ? 'Да' : 'Нет'}</span>
        ),
      },
      {
        Header: 'Дата создания',
        id: 'createdAt',
        accessor: 'createdAt',
        width: '25%',
        Cell: ({ row }) => (
          <span>{row.original.createdAt.toLocaleDateString()}</span>
        ),
      },
    ],
    [],
  );

  const handleDeleteLegal = async (id) => {
    try {
      await api.deleteLegal(id, currentPage);
      handleInfo('Юр. лицо удалено');
    } catch (error) {
      handleError('Ошибка при удалении:', error);
    }
  };

  const getActions = (data) => [
    { label: 'Редактировать', onClick: () => handleEdit(data) },
    {
      label: 'Удалить',
      onClick: () => setLegalToDelete(data.id),
      disabled: data.id === 0, // Можно добавить дополнительные условия для деактивации
    },
  ];

  return (
    <LoadingProvider isLoading={api.isLoading}>
      <div className={styles.table}>
        <Table
          headerActions={{
            sorting: true,
            add: {
              action: () => setEditModalOpen(true),
              title: 'Добавить юр. лицо',
            },
          }}
          title="Юридические лица"
          settingsSwithcerValue={currentSwitcher}
          switchers={[
            {key:'legals',to:'?filter=legals',name:'Юр. лица'},
            {key:'employers',to:'?filter=employers',name:'Сотрудники'},
          ]}
          data={paginatedData}
          actions={getActions}
          columns={cols}
          paging={{
            current: currentPage,
            all: totalItems,
            offset: itemsPerPage,
            onPageChange: handlePageChange,
          }}
        />
      </div>
      {editModalOpen && (
        <EditModal
          legalId={currentEntity?.id ?? null}
          onClose={() => {
            setEditModalOpen(false);
            setCurrentEntity(null);
          }}
        />
      )}
      {legalToDelete !== null && (
        <ConfirmationModal
          isOpen={legalToDelete !== null}
          onClose={() => setLegalToDelete(null)}
          onConfirm={() => {
            handleDeleteLegal(legalToDelete).then(() => {
              setLegalToDelete(null);
            });
          }}
          label="Вы уверены, что хотите удалить юр. лицо?"
        />
      )}
    </LoadingProvider>
  );
});

export default LegalsTable;
