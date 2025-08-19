import React, {useEffect} from 'react';
import styles from './services.module.sass'
import ServicesTable from "./components/ServicesTable";
import {observer} from "mobx-react";
import useStore from "../../hooks/useStore";
import useServicesApi from "./services.api";
import {motion} from "framer-motion";
import {opacityTransition} from "../../utils/motion.variants";

const Services = observer(() => {

    // const api = useServicesApi()
    // useEffect(()=> {
    //     api.getServices()
    // },[])

    return (
        <motion.div
            variants={opacityTransition}
            initial="hidden"
            animate="show" className={styles.container}>
            <ServicesTable/>
        </motion.div>
    );
});

export default Services;