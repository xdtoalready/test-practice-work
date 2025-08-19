import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './TableSwitcher.module.sass';
import Button from "../../../../shared/Button";

const TableSwitcher = ({value,swithers=[]}) => {
    return (
        <div className={styles.switcher}>
            {/*<NavLink to="?filter=employers" className={value==='employers' ? styles.active:''}>*/}
            {/*    <Button classname={styles.button} type={'secondary'} name={'Сотрудники'}/>*/}
            {/*</NavLink>*/}
            {/*<NavLink to="?filter=legals" className={value==='legals' ? styles.active:''}>*/}
            {/*    <Button classname={styles.button} type={'secondary'} name={'Юр. лица'}/>*/}
            {/*</NavLink>*/}
          {swithers.map(el=>(
            <NavLink to={el?.to} className={value===el.key ? styles.active:''}>
              <Button classname={styles.button} type={'secondary'} name={el?.name??''}/>
            </NavLink>
          ))}
        </div>
    );
};

export default TableSwitcher;
