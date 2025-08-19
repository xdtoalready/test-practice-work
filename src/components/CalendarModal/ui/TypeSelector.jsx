import React from 'react';
import styles from './selector.module.sass';
import cn from 'classnames';
import {businessTypes, businessTypesRu} from "../../../pages/Calendar/calendar.types";
import Icon from "../../../shared/Icon";

// Icons for each business type (you'll need to import or create these)
const BusinessTypeIcons = {
    [businessTypes.business]: {
        name:'briefcase',
        styles:{
            stroke:'#33383F',
            'stroke-width':2,
            fill:'none'
        }
    },
    [businessTypes.call]:  {
        name:'phone',
        styles:{
            stroke:'#83BF6E',
            'stroke-width':2,
            fill:'none'
        }
    },
    [businessTypes.brainstorm]:  {
        name:'brain',
        styles:{
            stroke:'#2A85FF',
            'stroke-width':2,
            fill:'none'
        }
    },
    [businessTypes.meeting]:{
        name:'users',
        styles:{
            stroke:'#8E59FF',
            'stroke-width':2,
            fill:'none'
        }
    },
    [businessTypes.personal]:{
        name:'user',
        styles:{
            stroke:'#6F767E',
            'stroke-width':2,
            fill:'none'
        }
    },
    [businessTypes.holiday]:{
        name:'holiday',
        styles:{
            stroke:'#FFD88D',
            'stroke-width':2,
            fill:'none'
        }
    },
    [businessTypes.letter]: {
        name:'letter',
        styles:{
            stroke:'#FF6A55',
            'stroke-width':2,
            fill:'none'
        }
    },
};



const BusinessTypeSelector= ({
                                                                       selectedType,
                                                                       onTypeSelect,
                                                                        className,
                                                                   }) => {
    return (
        <div className={cn(className,styles.typeSelector)}>
            <div className={styles.typeSelectorTitle}>Тип дела</div>
            <div className={styles.typeList}>
                {Object.values(businessTypes).map((type) => (
                    <div
                        key={type}
                        className={cn(
                            styles.typeItem,
                            styles[type],
                            { [styles.selected]: selectedType === type }
                        )}
                        onClick={() => onTypeSelect(type)}
                    >
                        <div className={styles.typeIconWrapper}>
                            <Icon
                                viewBox={'0 0 23 23'}
                                name={BusinessTypeIcons[type].name}
                                size={20}
                                className={styles.typeIcon}
                                {...BusinessTypeIcons[type].styles}
                            />
                        </div>
                        <span className={styles.typeLabel}>
              {businessTypesRu[type]}
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusinessTypeSelector;