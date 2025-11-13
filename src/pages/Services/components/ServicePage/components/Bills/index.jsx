import styles from './Bills.module.sass';
import { formatDateWithoutHours } from '../../../../../../utils/formate.date';
import React, { useMemo, useState } from 'react';
import TextLink from '../../../../../../shared/Table/TextLink';
import ServiceBadge, { serviceStatuses } from '../Statuses';
import Table from '../../../../../../shared/Table';
import AdaptiveCard from '../../../../../Clients/components/ClientPage/Deals/AdaptiveCard';
import Button from '../../../../../../shared/Button';
import Icon from '../../../../../../shared/Icon';
import cn from 'classnames';
import EditModal from '../../../../../Documents/components/BillsTable/components/EditModal';
import { observer } from 'mobx-react';

const Bills = observer(({ bills, service, company, stage }) => {
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [billData, setBillData] = useState(null);
  const cols = React.useMemo(
    () => [
      {
        Header: '№ счета',
        id: 'title',
        width: '17%',
        Cell: ({ row }) => {
          const data = row?.original;
          return (
            <TextLink
              onClick={() => {
                setBillData(data);
                setBillModalOpen(true);
              }}
            >
              Счет №{data.number}
            </TextLink>
          );
        },
      },
      {
        Header: '',
        width: '30%',
        id: 'billWithSign',
        Cell: ({ row }) => {
          return (
            <Button
              onClick={() => window.open(`/documents/bills/${row?.original.id}?stamp=1`, '_blank')}
              type={'secondary'}
              after={<Icon size={24} name={'download'} />}
              classname={cn(styles.button, styles.button_bills)}
              name={'Счет с печатью'}
            />
          );
        },
      },
      {
        Header: '',
        width: '30%',
        id: 'billWithoutSign',
        Cell: ({ row }) => {
          return (
            <Button
              onClick={() => window.open(`/documents/bills/${row?.original.id}?stamp=0`, '_blank')}
              type={'secondary'}
              after={<Icon size={24} name={'download'} />}
              classname={cn(styles.button, styles.button_bills)}
              name={'Счет без печати'}
            />
          );
        },
      },
      {
        Header: 'Сумма',
        width: '15%',
        id: 'sum',
        Cell: ({ row }) => {
          const data = row?.original;
          return <p>{data.sum.toFixed(2)}</p>;
        },
      },
      {
        Header: 'Статус',
        width: '20%',
        id: 'status',
        Cell: ({ row }) => {
          const data = row?.original;
          return (
            <ServiceBadge
              status={data.status}
              statusType={serviceStatuses.bill}
            />
          );
        },
      },
      {
        Header: 'Дата оплаты',
        id: 'date',
        width: '30%',
        Cell: ({ row }) => {
          const data = row?.original;
          return <p>{formatDateWithoutHours(data.paymentDate)}</p>;
        },
      },
    ],
    [],
  );
  const data = useMemo(() => bills ?? [], bills);

  return (
    <div className={styles.table_container}>
      <Table
        withHeaderWhenEmpty={false}
        smallTable={true}
        cardComponent={(data, onPagination) => (
          <AdaptiveCard data={data} onPagination={onPagination} />
        )}
        headerActions={{
          add: {
            action: () => setBillModalOpen(true),
            isSmall: true,
            cls: `${styles.button} ${styles.button_title}`,
            type: 'primary',
            title: 'Добавить счет',
          },
        }}
        title={'Счета'}
        data={data}
        columns={cols}
      />
      {billModalOpen && (
        <EditModal
          billId={billData?.id !== null ? billData?.id : null}
          service={service}
          company={company}
          stage={stage}
          onClose={() => {
            setBillModalOpen(false);
            setBillData(null);
          }}
        />
      )}
    </div>
  );
});

export default Bills;
