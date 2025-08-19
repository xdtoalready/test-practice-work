import React from 'react';
import styles from '../../../../../Stages/components/StagesPage/components/ClientInfo/Info.module.sass';
import Card from '../../../../../../shared/Card';
import Avatar from '../../../../../../shared/Avatar';
import { Link } from 'react-router-dom';

import ManagerCell from '../../../../../../components/ManagerCell';

const DealMembers = ({ creator, client, auditor, manager }) => {
  return (
    <div>
      <Card
        className={styles.card}
        classCardHead={styles.header}
        title={'Участники'}
      >
        {creator && <MemberComponent member={creator} label={'Создатель'} />}
        {client && (
          <MemberComponent member={client} label={'Клиент'} type={'company'} />
        )}
        {auditor && auditor.map((el,index)=>{
            return index ? <MemberComponent member={el} /> : <MemberComponent member={el} label={'Аудитор'} />
        })}
        {manager && <MemberComponent member={manager} label={'Ответственный'} />}
      </Card>
    </div>
  );
};

export default DealMembers;

const MemberComponent = ({ type = 'member', member, label }) => {
  return (
    <div>
      <div>{label}</div>
      {type === 'company' ? (
        <Link to={`/clients/${member?.id}`}>
          <ManagerCell manager={{ ...member, role: 'Клиент' }} />
        </Link>
      ) : (
        <ManagerCell manager={member} />
      )}
    </div>
  );
};
