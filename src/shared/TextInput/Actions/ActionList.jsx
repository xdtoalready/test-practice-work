import React, {useMemo} from 'react';
import cn from "classnames";
import styles from "../TextInput.module.sass";
import See from "./See";
import Edit from "./Edit";
import Submit from "./Submit";
import Close from "./Close";
import Delete from "./Delete";
import Copy from "./Copy";
import Add from "./Add";
import Call from "./Call";
import {usePermissions} from "../../../providers/PermissionProvider";
import { UserPermissions } from '../../userPermissions';

const ActionList = ({setClose,actions,classNameActions,inputRef,props,withLabels=false}) => {
    const { hasPermission,permissions } = usePermissions();
    const canCall = useMemo(()=>hasPermission(UserPermissions.ACCESS_ALL_CALLS),[permissions])
    return (
        <div className={cn(styles.actions, classNameActions)}>
            {actions?.see && !props?.edited && <See setClose={setClose } label={withLabels ? 'Посмотреть' :''} props={props} inputRef={inputRef}/>}
            {(actions?.edit || actions?.onEdit) && !props?.edited && <Edit  label={withLabels ? 'Редактировать' :''} inputRef={inputRef}  actions={actions} props={props}/>}
            {actions?.edit && props?.edited && <Submit setClose={setClose} label={withLabels ? 'Подтвердить' :''}  props={props} actions={actions}/>}
            {actions?.edit && props.edited && <Close  setClose={setClose } label={withLabels ? 'Закрыть' :''}  actions={actions} props={props}/>}
            {actions?.delete && <Delete setClose={setClose } label={withLabels ? 'Удалить' :''}  actions={actions} props={props} inputRef={inputRef}/>}
            {actions?.copy && <Copy props={props} setClose={setClose} label={withLabels ? 'Копировать' :''}  inputRef={inputRef} actions={actions}/>}
            {actions?.add && <Add props={props} setClose={setClose} label={withLabels ? 'Добавить' :''}  inputRef={inputRef} actions={actions}/>}
            {actions?.call && canCall && <Call props={props} setClose={setClose} label={withLabels ? 'Позвонить' :''}  inputRef={inputRef} actions={actions}/>}
        </div>
    );
};

export default ActionList;