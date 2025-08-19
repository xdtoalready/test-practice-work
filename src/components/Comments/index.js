import React, { useMemo, useState } from 'react';
import Card from '../../shared/Card';
import CommentsList from '../CommentsList';
import CommentsInput from './CommentsInput';
import useUser from '../../hooks/useUser';
import CommentsFilters from './CommentsFilters';
import useAppApi from '../../api';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router';
import TimeTrackingList from '../TimeTracking';
import TimeTrackingInput from '../../pages/TimeTracking/components/TimeTrackingInput';
import useQueryParam from '../../hooks/useQueryParam';
import useStore from '../../hooks/useStore';
import useTimeTrackingApi from '../../pages/TimeTracking/timeTracking.api';
import { observer } from 'mobx-react';
import { handleError, handleInfo, handleSubmit } from '../../utils/snackbar';
import useCommentsFilters from './common.filters.hook';
import TimeTrackingSection from '../TimeTracking/Section';
import { EditorProvider } from '../../shared/Editor/context/editor.context';

const Comments = observer(
  ({
    comments,
    onChange,
    prefix = '',
    entityId,
    belongsTo = null,
    onDelete,
    timeTrackings,
    mode,
    contextStore,
    ...rest
  }) => {
    const commentsLength = useMemo(
      () => Object.keys(comments ?? {}).length,
      [comments],
    );
    const timeTrackingLength = useMemo(
      () => (timeTrackings ? Object.keys(timeTrackings).length : null),
      [timeTrackings],
    );
    const { id } = useParams();
    const taskId = useQueryParam('taskId');
    const { user } = useUser();
    const { tasksStore } = useStore();
    const url = useLocation();
    const appApi = useAppApi();
    const timeTrackingApi = useTimeTrackingApi();

    function countComments() {
      const commentArr = comments
        ? Object.entries(comments).map(([key, val]) => ({
            key,
            type: val.type,
          }))
        : [];

      return commentArr?.filter((item) => item.type === 'Comment')?.length;
    }

    function getCurrentEntityType() {
      const path = url.pathname;
      if (path.includes('clients')) {
        return 'companies';
      } else if (path.includes('deals')) {
        return 'deals';
      } else if (path.includes('tasks') || path.includes('stages')) {
        return 'tasks';
      } else if (path.includes('calendar')) {
        return 'business';
      }
    }

    function countFiles() {
      return Object.values(comments ?? {}).reduce((totalFiles, comment) => {
        return (
          totalFiles +
          (comment?.value?.files ? comment?.value?.files?.length : 0)
        );
      }, 0);
    }

    const handleSendComment = async (val) => {
      handleInfo('Комментарий отправляется...');
      try {
        const result = await appApi.sendComment(
          belongsTo ?? getCurrentEntityType(),
          entityId ?? id,
          { text: val.value?.text, files: val.value.files },
        );

        if (Object.keys(result)) {
          onChange(`${prefix}comments.${result.id}`, result);
        }
      } catch (error) {
        handleError(error?.message, error);
      }
    };

    const { filters, handlers } = useCommentsFilters();
    return (
      <Card>
        <CommentsFilters
          timeTrackingsLength={timeTrackingLength}
          filterComments={handlers.handleFilterByComments}
          filterFiles={handlers.handleFilterByFiles}
          filterAll={handlers.handleFilterAll}
          openTimeTracking={handlers.handleFilterByTimeTracking}
          filesLength={countFiles()}
          commentsLength={countComments()}
        />
        {filters.isFilterTimeTracking ? (
          <>
            <TimeTrackingSection
              timeTrackings={timeTrackings}
              timeTrackingLength={timeTrackingLength}
              taskId={taskId}
              entityId={entityId}
              tasksStore={tasksStore}
              timeTrackingApi={timeTrackingApi}
              mode={mode}
              contextStore={contextStore}
              prefix={prefix}
            />
          </>
        ) : (
          <>
            <CommentsList
              onChange={(result) => {
                if (Object.keys(result)) {
                  onChange(`${prefix}comments.${result.id}`, result);
                }
              }}
              deleteComments={appApi.deleteComments}
              isLoading={appApi.isLoading}
              isLoadingUpper={rest.isLoading ?? false}
              onDelete={onDelete}
              filterFiles={filters.isFilterFiles}
              filterComments={filters.isFilterComments}
              comments={comments}
              {...rest}
            />
            <EditorProvider>
              <CommentsInput
                commentsLength={commentsLength}
                onSendMessage={handleSendComment}
                currentUser={user}
              />
            </EditorProvider>
          </>
        )}
      </Card>
    );
  },
);

export default Comments;
