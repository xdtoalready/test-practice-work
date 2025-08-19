import React, {useState} from 'react';
import {AnimatePresence, motion} from "framer-motion";
import {TranslateYTransition} from "../../../../../../utils/motion.variants";
import cn from "classnames";
import styles from "../ClientInfo/Info.module.sass";
import Card from "../../../../../../shared/Card";
import LabeledParagraph from "../../../../../../shared/LabeledParagraph";
import {formatDateWithDateAndYear} from "../../../../../../utils/formate.date";
import HoursComponent from "../../../../../../components/HoursComponent";
import {convertToHours} from "../../../../../../utils/format.time";
import {compareTime} from "../../../../../../utils/compare";
import TextLink from "../../../../../../shared/Table/TextLink";
import DescriptionModal from "../../../../../../components/DescriptionModal";

const Index = ({description,label}) => {
    const [isOpen,setIsOpen] = useState(false)
    return (
        <AnimatePresence>
            {(
                <motion.div
                    animate={'show'}
                    initial={'hidden'}
                    exit={'hidden'}
                    variants={TranslateYTransition}
                    className={cn(styles.col, {
                        // [styles.col_dropdowned]: dropDownClicked,
                    })}
                >
                    <div className={styles.container}>
                        <Card
                            className={styles.card}
                            classCardHead={styles.header}
                            title={label}
                        >
                            {!description || description === ' ' ? <span>Отсутствует</span> : <TextLink className={styles.taskName_primary} onClick={()=>setIsOpen(true)}>Подробнее...</TextLink>}
                        </Card>
                    </div>
                </motion.div>
            )}
            {isOpen && <DescriptionModal description={description} label={label} onClose={()=>setIsOpen(false)}/>}
        </AnimatePresence>
    );
};

export default Index;