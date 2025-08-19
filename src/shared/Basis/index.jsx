import React from 'react';

const BasisComponent = ({basis=1525,className,children}) => {
    return (
        <div style={{flexBasis:basis}} className={className}>
            {children}
        </div>
    );
};

export default BasisComponent;