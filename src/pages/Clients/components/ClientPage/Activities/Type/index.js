import React from 'react';
import Icon from "../../../../../../shared/Icon";
import cn from "classnames";
import styles from './Type.module.sass'
import Tooltip from "../../../../../../shared/Tooltip";
import {businessTypes} from "../../../../../Calendar/calendar.types";

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

const ActivityType = ({membersCount,type,className}) => {

    const getCurrentFilLAndTooltip = () => {
        switch (type){
            case 'call':
                return {fill:'#26842A',tooltip:'Тип мероприятия: звонок'}
            case 'business':
                return {fill:'#33383F',tooltip:'Тип мероприятия: Дело'}
            case 'brainstorm':
                return {fill:'#2A85FF',tooltip:'Тип мероприятия: Мозговой штурм'}
            case 'meeting':
                return {fill:'#8E59FF',tooltip:'Тип мероприятия: Встреча'}
            case 'personal':
                return {fill:'#6F767E',tooltip:'Тип мероприятия: Личное'}
            case 'holiday':
                return {fill:'#FFD88D',tooltip:'Тип мероприятия: Праздник'}
            case 'letter':
                return {fill:'#E13F29',tooltip:'Тип мероприятия: Письмо'}
            default:
                return {fill:'#000', tooltip: '-'};
        }
    }

    return (
        <div className={cn(styles.container,className)}>
            {/*<div className={styles.members}>*/}
            {/*    <Icon viewBox={'0 0 22 22'} size={18} name={'user'}/>*/}
            {/*    <p>{membersCount}</p>*/}
            {/*</div>*/}
            <div>
                <Tooltip place={'top'} title={getCurrentFilLAndTooltip().tooltip} >
                    <Icon viewBox={'0 0 30 30'}
                          name={BusinessTypeIcons[type].name}
                          size={20}
                          {...BusinessTypeIcons[type].styles}/>
                </Tooltip>
            </div>
        </div>
    );
};

export default ActivityType;