import styles from './Bills.module.sass';
import { formatDateWithoutHours } from '../../../../../../utils/formate.date';
import React, { useMemo, useState } from 'react';
import TextLink from '../../../../../../shared/Table/TextLink';
import Table from '../../../../../../shared/Table';
import AdaptiveCard from '../../../../../Clients/components/ClientPage/Deals/AdaptiveCard';
import Button from '../../../../../../shared/Button';
import Icon from '../../../../../../shared/Icon';
import cn from 'classnames';
import EditModal from '../../../../../Documents/components/BillsTable/components/EditModal';
import { observer } from 'mobx-react';
import StatusDropdown from '../../../../../../components/StatusDropdown';
import { colorActStatusTypes } from '../../../../../Acts/acts.types';
import { colorBillStatusTypes } from '../../../../../Documents/types/bills.types';
import useBillsApi from '../../../../../Documents/api/bills.api';
import useDocumentsPrintApi from '../../../../../Documents/api/documents-print.api';

const Bills = observer(({ bills, service, company, stage }) => {
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [billData, setBillData] = useState(null);
  const { updateBill } = useBillsApi();
  const documentsPrintApi = useDocumentsPrintApi();

  const handleActStatusChange = (billId, newStatus) => {
    const actSigned = newStatus.key === 'stamped' ? 1 : 0;
    updateBill(billId, { act_signed: actSigned }, true);
  };

  const handleBillStatusChange = (billId, newStatus) => {
    updateBill(billId, { status: newStatus.key }, true);
  };

  const cols = React.useMemo(
    () => [
      {
        Header: '№ счета / акта',
        id: 'title',
        width: '17%',
        Cell: ({ row }) => {
          const data = row?.original;
          const isAct = data.isAct;

          if (isAct) {
            return (
              <div style={{ paddingLeft: '24px', fontSize: '13px', color: '#6B7280' }}>
                Акт №{data.number}
              </div>
            );
          }

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
        id: 'documentWithSign',
        Cell: ({ row }) => {
          const data = row?.original;
          const isAct = data.isAct;

          if (isAct) {
            return (
              <Button
                onClick={() => documentsPrintApi.viewActByBillId(data.billId, true)}
                type={'secondary'}
                after={<Icon size={24} name={'download'} />}
                classname={cn(styles.button, styles.button_bills)}
                name={'Акт с печатью'}
              />
            );
          }

          return (
            <Button
              onClick={() => window.open(`/documents/bills/${data.id}?stamp=1`, '_blank')}
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
        id: 'documentWithoutSign',
        Cell: ({ row }) => {
          const data = row?.original;
          const isAct = data.isAct;

          if (isAct) {
            return (
              <Button
                onClick={() => documentsPrintApi.viewActByBillId(data.billId, false)}
                type={'secondary'}
                after={<Icon size={24} name={'download'} />}
                classname={cn(styles.button, styles.button_bills)}
                name={'Акт без печати'}
              />
            );
          }

          return (
            <Button
              onClick={() => window.open(`/documents/bills/${data.id}?stamp=0`, '_blank')}
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
          return <p style={{ fontSize: data.isAct ? '13px' : '14px' }}>{data.sum.toFixed(2)}</p>;
        },
      },
      {
        Header: 'Статус',
        width: '20%',
        id: 'status',
        Cell: ({ row }) => {
          const data = row?.original;
          const isAct = data.isAct;

          if (isAct) {
            const currentStatus = data.actSigned ? 'stamped' : 'unstamped';
            const statusValue = colorActStatusTypes[currentStatus];

            return (
              <div style={{ position: 'relative' }}>
                <StatusDropdown
                  statuses={colorActStatusTypes}
                  value={statusValue}
                  onChange={(newStatus) => handleActStatusChange(data.billId, newStatus)}
                />
              </div>
            );
          }

          const billStatusValue = colorBillStatusTypes[data.status];
          return (
            <div style={{ position: 'relative' }}>
              <StatusDropdown
                statuses={colorBillStatusTypes}
                value={billStatusValue}
                onChange={(newStatus) => handleBillStatusChange(data.id, newStatus)}
              />
            </div>
          );
        },
      },
      {
        Header: 'Дата',
        id: 'date',
        width: '30%',
        Cell: ({ row }) => {
          const data = row?.original;
          const isAct = data.isAct;

          if (isAct) {
            return (
              <p style={{ fontSize: '13px' }}>
                {data.signedDate ? formatDateWithoutHours(data.signedDate) : '—'}
              </p>
            );
          }

          return <p>{formatDateWithoutHours(data.paymentDate)}</p>;
        },
      },
    ],
    [bills],
  );

  const data = useMemo(() => {
    if (!bills) return [];

    const result = [];
    bills.forEach((bill) => {
      result.push(bill);
      if (bill.status === 'paid' && bill.act) {
        result.push({
          isAct: true,
          billId: bill.id,
          number: bill.number,
          sum: bill.sum,
          actSigned: bill.actSigned,
          signedDate: bill.signedDate,
        });
      }
    });

    return result;
  }, [bills]);

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
        getRowProps={(row) => ({
          className: row.original.isAct ? styles.act_row : '',
        })}
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
