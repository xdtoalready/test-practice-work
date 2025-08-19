import {motion} from "framer-motion";
import {opacityTransition} from "../../utils/motion.variants";
import React from "react";
import TimeTrackingsTable from "./components/Table";

const TimeTrackings = () => {
    return (
        <motion.div
            variants={opacityTransition}
            initial="hidden"
            animate="show"
        >
            <TimeTrackingsTable />
        </motion.div>
    );
};

export default TimeTrackings;
