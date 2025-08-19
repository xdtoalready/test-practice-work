import React, {useMemo, useState} from 'react';
import Table from "../../../../../shared/Table";
import { formatDateWithoutHours, formatHours } from "../../../../../utils/formate.date";
import styles from './Activities.module.sass';
import DealCell from "./ActivityCell";
import ManagerCell from "../../../../../components/ManagerCell";
import ActivityType from "./Type";
import EmptyCell from "../../../../../shared/Table/EmptyCell";
import AdaptiveCard from "./AdaptiveCard";
import cn from "classnames";
import useMappedObj from "../../../../../hooks/useMappedObj";
import CalendarModal from "../../../../../components/CalendarModal";
import useStore from "../../../../../hooks/useStore";
import useCalendarApi from "../../../../Calendar/calendar.api";

const ClientActivities = ({ activities = {},clientStore,clientApi,client,deal,dealApi,dealStore }) => {

    const mappedActivities = useMappedObj(activities);

    const [businessData, setbusinessData] = useState(null);
    const [isCreateMode, setIsCreateMode] = useState(false);



    const groupedActivities = useMemo(() => {
        const groups = {};
        mappedActivities.forEach(([key, el]) => {
            const date = formatDateWithoutHours(el.startDate);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(el);
        });

        return Object.entries(groups);
    }, [mappedActivities]);

    const columns = groupedActivities.flatMap(([date, items], groupIndex) =>
        items.map((el, index) => {

            const isFirstOfDay = index === 0;

            return {
                Header: isFirstOfDay ? ()=> (
                    <div className={cn(styles.header, { [styles.header_first]: groupIndex === 0 })}>
                        {date}
                    </div>
                ) : ()=>null,
                id: `activities_${groupIndex}_${index}`,
                columns: [
                    {
                        Header:()=>null,
                        id: `${groupIndex}_${index}_description`,
                        Cell: ({ row }) => <div onClick={()=>handleOpenModal(el)}><DealCell title={el.name} startTime={el.startTime} endTime={el.endTime} /></div>
                    },
                    {
                        Header: () => null,
                        id: `${groupIndex}_${index}_empty`,
                        Cell: () => <EmptyCell />
                    },
                    {
                        Header: () => null,
                        id: `${groupIndex}_${index}_manager`,
                        Cell: ({ row }) => <ManagerCell className={styles.cell_manager} manager={el.performer} />
                    },
                    {
                        Header: () => null,
                        id: `${groupIndex}_${index}_type`,
                        Cell: ({ row }) => (
                            <ActivityType className={styles.types} type={el.type} />
                        )
                    },
                ]
            };
        })
    )

    const handleOpenModal = (data) => {

        setbusinessData(data);
        setIsCreateMode(false);
    };

    const handleCreateBusiness = () => {
        setbusinessData(null);
        setIsCreateMode(true);
    };

    const handleCloseModal = () => {
        setbusinessData(null);
        setIsCreateMode(false);
        // Перезагружаем данные после закрытия модалки
        // loadData();
    };

    return (
        <>
        <Table
            disableHeader
            smallTable
            headerInCard
            // cardComponent={(data, onPagination) => <AdaptiveCard data={data} onPagination={onPagination} />}
            headerActions={{
                sorting: true,
                add: {
                    action: handleCreateBusiness,
                    title: 'Создать дело',
                },
            }}
            onPagination
            title='Дела'
            data={mappedActivities.map(([_, value]) => value)}
            columns={columns}
        />
            {(businessData || isCreateMode) && (
                <CalendarModal
                    dealStore={dealStore}
                    deal={deal}
                    dealApi={dealApi}
                    client={client}
                    data={businessData}
                   clientApi={clientApi}
                   clientStore={clientStore}
                    businessId={businessData?.id ?? null}
                    onClose={handleCloseModal}
                />
            )}
            </>
    );
};

export default ClientActivities;
