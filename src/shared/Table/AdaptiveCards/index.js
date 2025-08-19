import React from 'react';
import styles from './Cards.module.sass'
import Card from "../../Card";
import Badge from "../../Badge";
import Avatar from "../../Avatar";
const AdaptiveCards = ({rows,onPagination,cardComponent}) => {

    return (
        cardComponent(rows.map(el=>el.original),onPagination)
    );
};

export default AdaptiveCards;