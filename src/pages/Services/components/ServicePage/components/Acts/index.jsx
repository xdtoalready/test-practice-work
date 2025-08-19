import styles from './Acts.module.sass';
import { formatDateWithoutHours } from '../../../../../../utils/formate.date';
import React, { useMemo, useState } from 'react';
import TextLink from '../../../../../../shared/Table/TextLink';
import { formatSum } from '../../../../../../utils/format.number';
import ServiceBadge, { serviceStatuses } from '../Statuses';
import Table from '../../../../../../shared/Table';
import AdaptiveCard from '../../../../../Clients/components/ClientPage/Deals/AdaptiveCard';
import Button from '../../../../../../shared/Button';
import Icon from '../../../../../../shared/Icon';
import cn from 'classnames';
import { observer } from 'mobx-react';
import EditModal from '../../../../../Acts/components/ActsTable/components/EditModal';
import { colorActStatusTypes } from '../../../../../Acts/acts.types';

const Acts = observer(({ acts, service, company, stage }) => {
  const downloadAct = (url) => {
    window.open(url, '_blank');
  };

  const [actModalOpen, setActModalOpen] = useState(false);
  const [actData, setActData] = useState(null);

  const cols = React.useMemo(
    () => [
      {
        Header: '№ акта',
        id: 'title',
        width: '17%',
        Cell: ({ row }) => {
          const data = row?.original;
          return (
            <TextLink
              onClick={() => {
                setActData(data);
                setActModalOpen(true);
              }}
            >
              Акт №{data.number}
            </TextLink>
          );
        },
      },
      {
        Header: '',
        width: '30%',
        id: 'actWithSign',
        Cell: ({ row }) => {
          return row?.original.stampedAct && (
            <Button
              onClick={() => downloadAct(row?.original.stampedAct)}
              type={'secondary'}
              after={<Icon size={24} name={'download'} />}
              classname={cn(styles.button, styles.button_acts)}
              name={'Акт с печатью'}
            />
          );
        },
      },
      {
        Header: '',
        width: '30%',
        id: 'actWithoutSign',
        Cell: ({ row }) => {
          return row?.original.unstampedAct && (
            <Button
              onClick={() => downloadAct(row?.original.unstampedAct)}
              type={'secondary'}
              after={<Icon size={24} name={'download'} />}
              classname={cn(styles.button, styles.button_acts)}
              name={'Акт без печати'}
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
              statusType={colorActStatusTypes}
            />
          );
        },
      },
      // {
      //   Header: 'Дата',
      //   id: 'date',
      //   width: '30%',
      //   Cell: ({ row }) => {
      //     const data = row?.original;
      //     return <p>{formatDateWithoutHours(data.date)}</p>;
      //   },
      // },
    ],
    [],
  );

  const data = useMemo(() => acts ?? [], [acts]);

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
            action: () => setActModalOpen(true),
            isSmall: true,
            cls: `${styles.button} ${styles.button_title}`,
            type: 'primary',
            title: 'Добавить акт',
          },
        }}
        title={'Акты'}
        data={data}
        columns={cols}
      />
      {actModalOpen && (
        <EditModal
          actId={actData?.id !== null ? actData?.id : null}
          service={service}
          company={company}
          stage={stage}
          onClose={() => {
            setActModalOpen(false);
            setActData(null);
          }}
        />
      )}
    </div>
  );
});

export default Acts;