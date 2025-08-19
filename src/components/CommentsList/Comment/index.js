import React, { useState } from 'react';
import FileElement from '../../../shared/File/Element';
import styles from './Comment.module.sass';
import EditorRenderer from '../../../shared/Editor/Rendered/EditorRendered';
import TableMenu from '../../TableMenu';
import Icon from '../../../shared/Icon';
import useUser from '../../../hooks/useUser';
import { usePermissions } from '../../../providers/PermissionProvider';
import cn from 'classnames';
import { UserPermissions } from '../../../shared/userPermissions';
const Comment = ({
  sender,
  text,
  files,
  hours,
  filterComments,
  filterFiles,
  actions,
  comment,
  ...rest
}) => {
  const [tableMenuOpen, setTableMenuOpen] = useState(false);
  const { user } = useUser();
  const { hasPermission, permissions } = usePermissions();
  return (
    <div
      className={cn(styles.container, {
        [styles.inTask]: rest?.inTask,
      })}
    >
      <div className={styles.sender}>
        <img src={sender?.image} alt={sender?.name} />
      </div>
      <div className={styles.comment}>
        <span>
          {sender?.lastName ?? ''} {sender?.name ?? ''}
        </span>
        {!filterComments && (
          <EditorRenderer className={styles.comment_text} content={text} />
        )}
        {!filterFiles && Boolean(files?.length) && (
          <div className={styles.files}>
            {files?.map((file) => (
              <FileElement key={file.id} file={file} />
            ))}
          </div>
        )}
      </div>
      <div className={styles.rightSide}>
        <div className={styles.hours}>{hours}</div>
        {(user?.id === sender?.id ||
          hasPermission(UserPermissions.SUPER_ADMIN)) && (
          <div className={styles.more} onClick={() => setTableMenuOpen(true)}>
            <Icon fill={'#6F767E'} name={'more-horizontal'} size={28} />
          </div>
        )}
        {Boolean(comment.isVisibleInLK) && <div className={styles.inLkFlag}/>}

        {tableMenuOpen && (
          <TableMenu
            actions={actions(comment)}
            isVisible={true}
            onClose={() => setTableMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Comment;
