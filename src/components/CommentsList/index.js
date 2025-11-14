import React from 'react';
import Comment from './Comment';
import { formatDateOnlyHours } from '../../utils/formate.date';
import styles from './CommentList.module.sass';
import { LoadingProvider } from '../../providers/LoadingProvider';
import useAppApi from '../../api';
import cn from 'classnames';
import useUser from '../../hooks/useUser';
import useScrollAfterDelete from '../../hooks/useScrollAfterDelete';
import useGroupByDate from '../../hooks/useGroupByDate';
import Call from './Call';
import { usePermissions } from '../../providers/PermissionProvider';
import { UserPermissions } from '../../shared/userPermissions';

const CommentsList = ({
                        comments = {},
                        filterComments,
                        filterFiles,
                        cls,
                        isLoadingUpper,
                        onDelete,
                        isLoading,
                        deleteComments,
                        onChange,
                        ...rest
                      }) => {
  const { user } = useUser();
  const appApi = useAppApi();
  const { hasPermission } = usePermissions();

  const filterFunc = (comment) => {
    if (filterComments && !comment.value?.files?.length) {
      return false;
    }
    return !(filterFiles && !comment.value?.text);
  };
  const { groupedByDate: groupedComments, isLoading: groupedLoading } =
    useGroupByDate(comments, filterFunc);

  const { ref, isDeleting } = useScrollAfterDelete(comments);

  const handleDeleteComment = (commentId) => {
    isDeleting.current = true;
    deleteComments(commentId, onDelete);
  };

  const handleToggleVisibility = async (commentId) => {
    try {
      const result = await appApi.toggleCommentVisibility(commentId); // Нужно добавить этот метод в useAppApi
      onChange(result);
    } catch (error) {
      console.error('Error toggling comment visibility:', error);
    }
  };

  const getActions = (data) => [
    {
      label: 'Удалить',
      onClick: () => handleDeleteComment(data.id),
      visible: data.sender.id === user.id || hasPermission(UserPermissions.SUPER_ADMIN),
    },
    {
      label: data.isVisibleInLK ? 'Скрыть из ЛК' : 'Показать в ЛК',
      onClick: () => handleToggleVisibility(data.id),
      visible: rest?.inTask && data.type !== 'Call',
    },
  ];

  if (!Object.keys(comments).length && !isLoading) {
    return <div className={cn(styles.empty, cls)}>Нет комментариев</div>;
  }

  return (
    <div ref={ref} className={cn(cls, styles.commentList)}>
      <LoadingProvider isLoading={isLoading || groupedLoading}>
        {Object.entries(groupedComments).map(([date, dateComments]) => (
          <div key={date} className={styles.dateGroup}>
            <h3 className={styles.dateHeader}>{date}</h3>
            {dateComments.map((comment) => (
              <div key={`comment-${comment.id}-${comment.isVisibleInLK}`} className={styles.container}>
                {comment.type === 'Call' ? (
                  <Call
                    call={comment}
                    hours={formatDateOnlyHours(comment?.date)}
                  />
                ) : (
                  <Comment
                    filterComments={filterComments}
                    filterFiles={filterFiles}
                    hours={formatDateOnlyHours(comment?.date)}
                    sender={comment.sender}
                    text={comment.value?.text ?? ' '}
                    files={comment.value?.files ?? []}
                    comment={comment}
                    actions={getActions}
                    {...rest}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </LoadingProvider>
    </div>
  );
};

export default CommentsList;
