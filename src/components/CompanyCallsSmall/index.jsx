import React, { useCallback, useMemo } from 'react';
import styles from './styles.module.sass';
import { useCallsContext } from '../../providers/CallsProvider';
import { usePermissions } from '../../providers/PermissionProvider';
import TextLink from '../../shared/Table/TextLink';
import ManagerCell from '../ManagerCell';
import {
  colorDirectionTypes,
  colorStatusTypes,
} from '../../pages/Calls/calls.types';
import { formatDate } from '../../utils/formate.date';
import { formatSeconds } from '../../utils/format.time';
import Badge from '../../shared/Badge';
import Table from '../../shared/Table';
import { UserPermissions } from '../../shared/userPermissions';

const CompanyCallsSmall = ({ calls, title = 'Звонки' }) => {
  const { hasPermission, permissions } = usePermissions();
  const { openCallModal } = useCallsContext();
  const canMakeCalls = useMemo(
    () => hasPermission(UserPermissions.ACCESS_ALL_CALLS),
    [permissions],
  );

  const handlePhoneClick = (phone) => {
    if (canMakeCalls && phone) {
      openCallModal(phone);
    }
  };

  const renderPhone = useCallback(
    (phone) => {
      if (!phone) return <span>-</span>;

      return (
        <span
          className={canMakeCalls ? styles.phoneLink : styles.phone}
          onClick={() => canMakeCalls && handlePhoneClick(phone)}
        >
          {phone}
        </span>
      );
    },
    [canMakeCalls],
  );

  const renderContactInfo = useCallback(
    (entity) => {
      if (!entity) return <span>-</span>;

      return (
        <div className={styles.contactInfo}>
          {entity.name && (
            <TextLink to={`/clients/${entity.id}`}>{entity.name}</TextLink>
          )}
          {entity.phone && renderPhone(entity.phone)}
        </div>
      );
    },
    [renderPhone],
  );

  const renderManagerContactInfo = useCallback(
    (entity, phone) => {
      if (!entity) return <span>-</span>;

      return (
        <div className={styles.contactInfo}>
          <ManagerCell disableRole={true} manager={entity}>
            {phone && renderPhone(phone)}
          </ManagerCell>
        </div>
      );
    },
    [renderPhone],
  );

  const renderWhoCallWithPhone = useCallback(
    (entity, phone) => {
      if (!entity || !entity.client) return <span>-</span>;

      const { client, company } = entity;

      return (
        <div className={styles.contactInfo}>
          <ManagerCell
            fioContainerClass={styles.fioContainer}
            companyName={company?.name}
            companyLink={company ? `/clients/${company.id}` : undefined}
            disableAvatar={true}
            disableRole={true}
            manager={client}
          >
            {phone && renderPhone(phone)}
          </ManagerCell>
        </div>
      );
    },
    [renderPhone],
  );

  const renderWhoCallInfo = useCallback(
    (entity) => {
      if (!entity) return <span>-</span>;

      if (entity.client) {
        return renderWhoCallWithPhone(entity, entity.phoneClient);
      } else if (entity.company) {
        return renderContactInfo(entity.company);
      } else {
        return renderPhone(entity.phoneClient);
      }
    },
    [renderContactInfo, renderWhoCallWithPhone, renderPhone],
  );

  const cols = useMemo(
    () => [
      {
        Header: 'Тип/Дата',
        width: '10%',

        accessor: 'type',
        Cell: ({ row }) => {
          return (
            <div className={styles.typeCell}>
              <Badge
                statusType={colorDirectionTypes}
                status={row.original.type}
              />
              <div className={styles.callDate}>
                {formatDate(row.original.createdAt)}
              </div>
            </div>
          );
        },
      },
      {
        Header: 'Статус',
        width: '10%',
        accessor: 'success',
        Cell: ({ row }) => (
          <Badge statusType={colorStatusTypes} status={row.original.success} />
        ),
      },
      {
        Header: 'Менеджер',
        width: '30%',
        accessor: 'company',
        Cell: ({ row }) => {
          return row.original?.manager
            ? renderManagerContactInfo(row.original.manager, row.original.phone)
            : renderPhone(row.original.phone);
        },
      },
      {
        Header: 'Клиент',
        width: '30%',

        accessor: 'manager',
        Cell: ({ row }) => {
          return renderWhoCallInfo(row.original);
        },
      },
      {
        Header: 'Длит.',
        accessor: 'duration',
        width: '0%',
        Cell: ({ row }) => (
          <div className={styles.durationCell}>
            {formatSeconds(row.original.duration)}
          </div>
        ),
      },
    ],
    [
      renderContactInfo,
      renderManagerContactInfo,
      renderPhone,
      renderWhoCallInfo,
    ],
  );

  const getActions = (data) => {
    const actions = [];
    if (data.record) {
      actions.push({
        label: 'Запись разговора',
        onClick: () => window.open(data.record, '_blank'),
      });
    }
    return actions;
  };

  return (
    canMakeCalls && (
      <div className={styles.container}>
        <Table
          smallTable={true}
          headerInCard={true}
          title={title}
          data={calls || []}
          columns={cols}
          actions={getActions}
          onPagination={true}
        />
      </div>
    )
  );
};

export default CompanyCallsSmall;
