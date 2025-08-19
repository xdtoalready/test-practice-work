import React from 'react';
import { observer } from 'mobx-react';
import DealsManager from "./components/DealsManager";

const DealsTable = observer(({ data, handleChange, onClick }) => {
    return (
        <DealsManager
            data={data}
            handleChange={handleChange}
            onClick={onClick}
        />
    );
});

export default DealsTable;