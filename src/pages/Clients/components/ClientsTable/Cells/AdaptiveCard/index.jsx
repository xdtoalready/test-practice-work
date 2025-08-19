import React, {useState} from 'react'
import styles from "./Card.module.sass";
import Badge from "../../../../../../shared/Badge";
import Avatar from "../../../../../../shared/Avatar";
import Card from "../../../../../../shared/Card";
import Tooltip from "../../../../../../shared/Tooltip";
import Icon from "../../../../../../shared/Icon";
import EditModal from "../../../../../Services/components/ServicesTable/components/EditModal";

const AdaptiveCard = ({data, statusType}) => {
    return (
        <div className={styles.container}>
            {data.map((original)=> {
                return <><Card onLink={()=>`${original.id}` } className={styles.card} >
                    <div className={styles.header}>
                        <div className={styles.name}>{original.title}</div>
                    </div>
                    {/*<div className={styles.footer}>*/}
                    {/*    <div className={styles.status}><Badge classname={styles.status_adaptiveStatus}*/}
                    {/*                                          status={original.status} statusType={statusType}/></div>*/}
                    {/*    <Tooltip  title={`${original.manager.name} ${original.manager.surname}`}>*/}

                    {/*    <div className={styles.avatar}><Avatar imageSrc={original.manager.image}/></div>*/}
                    {/*    </Tooltip>*/}
                    {/*</div>*/}

                </Card>
                </>
            })}
        </div>
    );
};

export default AdaptiveCard;