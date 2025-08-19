import React, {useContext} from 'react';
import {StoreContext} from "../providers/StoreProvider";

const UseStore = () => {
    const context = useContext(StoreContext)
    if (context === undefined) {
        throw new Error("useRootStore must be used within RootStoreProvider")
    }

    return context
};

export default UseStore;