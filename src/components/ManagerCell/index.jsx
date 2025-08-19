import React, { useEffect, useRef, useState } from 'react';
import styles from './ManagerCell.module.sass';
import Avatar from '../../shared/Avatar';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import Tooltip from '../../shared/Tooltip';
import { loadAvatar } from '../../utils/create.utils';
import TextLink from '../../shared/Table/TextLink';

const ManagerCell = ({ manager, children, inTable = false, ...rest }) => {
  const imageSrc = manager?.image ?? manager?.avatar;
  const roleRef = useRef(null);
  const containerRef = useRef(null);
  const [truncatedRole, setTruncatedRole] = useState(manager?.role || '');
  const [showFullRole, setShowFullRole] = useState(false);

  const renderName = () => {
    if (manager?.fio) {
      return manager.fio;
    }
    const hasNameOrSurname = Boolean(
      manager?.name || manager?.surname || manager?.lastName,
    );
    if (hasNameOrSurname) {
      const surname = manager?.surname ?? manager?.lastName ?? '';
      return `${surname} ${manager?.name ?? ''} ${manager?.middleName ?? ''}`.trim();
    }

    return 'Не указано';
  };

  useEffect(() => {
    if (inTable && roleRef.current && containerRef.current && manager?.role) {
      // Check if we need to truncate
      const checkAndTruncate = () => {
        const roleElement = roleRef.current;
        const containerElement = containerRef.current;

        if (!roleElement || !containerElement) return;

        // Reset to full content to measure properly
        roleElement.textContent = manager.role;

        // Get the height of one line of text (approximate)
        const lineHeight = parseInt(
          window.getComputedStyle(roleElement).lineHeight,
        );
        const containerHeight = containerElement.clientHeight;

        // If content takes more than container height minus some margin
        // or if the content is taller than one line
        if (
          roleElement.scrollHeight > containerHeight - 10 ||
          roleElement.scrollHeight > lineHeight * 3
        ) {
          // Truncate the text
          let text = manager.role;
          let truncated = false;

          while (roleElement.scrollHeight > lineHeight * 3 && text.length > 0) {
            text = text.substring(0, text.length - 5);
            roleElement.textContent = text + '...';
            truncated = true;
          }

          if (truncated) {
            setTruncatedRole(text + '...');
            setShowFullRole(true);
          }
        }
      };

      // Run on mount and resize
      checkAndTruncate();
      window.addEventListener('resize', checkAndTruncate);

      return () => {
        window.removeEventListener('resize', checkAndTruncate);
      };
    }
  }, [inTable, manager?.role]);

  return (
    <div ref={containerRef} className={cn(styles.container, rest.className)}>
      {!rest?.disableAvatar && (
        <Avatar size={42} imageSrc={imageSrc ?? loadAvatar()} />
      )}
      <div className={cn(styles.fioContainer, rest?.fioContainerClass)}>
        <div className={styles.fio}>
          <TextLink className={rest?.classLink}>{renderName()}</TextLink>
        </div>
        {rest?.companyName && (
          <div className={styles.name}>
            <TextLink to={rest?.companyLink}>{rest?.companyName}</TextLink>
          </div>
        )}
        {!rest?.disableRole && (
          <div ref={roleRef} className={styles.role}>
            {showFullRole ? (
              <Tooltip content={manager?.role}>
                <span>{truncatedRole}</span>
              </Tooltip>
            ) : (
              manager?.role || ''
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default ManagerCell;
