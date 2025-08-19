import React from 'react';
import styles from "../../pages/Clients/components/ClientsTable/Cells/ServicesCell/ServicesCell.module.sass";

const Index = ({label='Отсутствуют', value,children}) => {
    if (!value){
        return <div className={styles.servicesCell}><span>Отсутствуют</span></div>
    }
    return (
        <div>
            {children}
        </div>
    );
};

export default Index;