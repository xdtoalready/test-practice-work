import React from 'react';
import Card from "../../../../../../shared/Card";
import Button from "../../../../../../shared/Button";
import Icon from "../../../../../../shared/Icon";
import AdaptiveStages from "../AdaptiveCard";
import styles from '../../page.module.sass'
import cn from "classnames";

const Index = ({service}) => {
    return (
        <>
            <Card
            classCardHead={styles.card_title}
            className={cn(styles.card, styles.secondCard)}
            title={'Документы'}
        >
          <div className={styles.buttons}>
            <Button
                type={'secondary'}
                after={<Icon size={24} name={'download'}/>}
                classname={styles.button}
                name={'Договор'}
            />
            <Button
                type={'secondary'}
                after={<Icon size={24} name={'download'}/>}
                classname={styles.button}
                name={'Доп.соглашение'}
            />
          </div>
        </Card>
            </>
    );
};

export default Index;