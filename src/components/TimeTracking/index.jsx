import React, { useState } from 'react';
import styles from './TimeTracking.module.sass';
import { formatDateOnlyHours, formatHours } from '../../utils/formate.date';
import useUser from '../../hooks/useUser';
import Icon from '../../shared/Icon';
import TableMenu from '../TableMenu';
import cn from 'classnames';
import { LoadingProvider } from '../../providers/LoadingProvider';
import Comment from '../CommentsList/Comment';
import TimeTrack from './TimeTrack';
import useScrollAfterDelete from '../../hooks/useScrollAfterDelete';
import useGroupByDate from '../../hooks/useGroupByDate';
import EditTimeTrackModal from './EditModal';
import { observer } from 'mobx-react';
import { usePermissions } from '../../providers/PermissionProvider';

const TimeTrackingList = ({
  timeTrackings,
  onEdit,
  onDelete,
  onSave,
  onReset,
}) => {
  const { user } = useUser();
  const { groupedByDate: groupedTimeTracks, isLoading: groupedLoading } =
    useGroupByDate(timeTrackings);
  const { hasPermission } = usePermissions();
  const { ref, isDeleting, isRendered } = useScrollAfterDelete(timeTrackings);
  const [timeTrackToEdit, setTimeTrackToEdit] = useState(null);

  const handleEditTimeTracking = (hours, minutes) => {
    // const { name, value } = event.target;
    onEdit(timeTrackToEdit.id, {
      minutes: minutes || 0,
      hours: hours || 0,
      allTimeInMinutes: (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0),
    });
  };

  const handleSaveTimeTracking = (hours, minutes) => {
    handleEditTimeTracking(hours, minutes);
    onSave({ id: timeTrackToEdit.id, hours: hours, minutes: minutes });
  };

  const handleDeleteTimeTrack = (timeTrackId) => {
    isDeleting.current = true;
    onDelete(timeTrackId);
  };

  const handleEditTimeTrack = (timeTrack) => {
    setTimeTrackToEdit(timeTrack);
  };

  const handleResetTimeTrack = () => {
    onReset(timeTrackToEdit.id);
    setTimeTrackToEdit(null);
  };

  const getActions = (data) => [
    {
      label: 'Редактировать',
      onClick: () => handleEditTimeTrack(data),
      // visible: hasPermission(UserPermissions.VIEW_ALL_TIME_SPENDINGS),
      visible:true
    },
    {
      label: 'Удалить',
      onClick: () => handleDeleteTimeTrack(data.id),
      // visible: hasPermission(UserPermissions.VIEW_ALL_TIME_SPENDINGS),
      visible:true

    },
  ];

  return (
    <>
      <div ref={ref} className={cn(styles.timeTrackingList)}>
        <LoadingProvider isLoading={groupedLoading}>
          {Object.entries(groupedTimeTracks).map(([date, dateComments]) => (
            <div key={date} className={styles.dateGroup}>
              <h3 className={styles.dateHeader}>{date}</h3>
              {dateComments.map((timeTracking) => (
                <div className={styles.container}>
                  <TimeTrack actions={getActions} timeTracking={timeTracking} />
                </div>
              ))}
            </div>
          ))}
        </LoadingProvider>
      </div>
      {Boolean(timeTrackToEdit) && (
        <EditTimeTrackModal
          onChange={handleEditTimeTracking}
          onSubmit={handleSaveTimeTracking}
          isOpen={Boolean(timeTrackToEdit)}
          timeTracking={timeTrackToEdit}
          onClose={handleResetTimeTrack}
        />
      )}
    </>
  );
};

export default TimeTrackingList;
