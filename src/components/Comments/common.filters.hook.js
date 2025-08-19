import {useState} from "react";

const useCommentsFilters = () => {
    const [isFilterFiles, setFilterFiles] = useState(false);
    const [isFilterComments, setCommentFiles] = useState(false);
    const [isFilterTimeTracking, setFilterTimeTracking] = useState(false);

    const handleFilterAll = () => {
        setFilterFiles(false);
        setCommentFiles(false);
        setFilterTimeTracking(false);
    };

    const handleFilterByComments = () => {
        setFilterFiles(false);
        setCommentFiles(true);
        setFilterTimeTracking(false);
    };

    const handleFilterByFiles = () => {
        setFilterFiles(true);
        setCommentFiles(false);
        setFilterTimeTracking(false);
    };

    const handleFilterByTimeTracking = () => {
        setFilterFiles(false);
        setCommentFiles(false);
        setFilterTimeTracking(true);
    };

    return {
        filters: {
            isFilterFiles,
            isFilterComments,
            isFilterTimeTracking
        },
        handlers: {
            handleFilterAll,
            handleFilterByComments,
            handleFilterByFiles,
            handleFilterByTimeTracking
        }
    };
};

export default useCommentsFilters