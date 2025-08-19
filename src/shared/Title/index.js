import React, { useState } from 'react';
import cn from 'classnames';
import styles from './Title.module.sass';
import Icon from '../Icon';
import Button from '../Button';
import TitleButtons from './Buttons';
const Title = ({ title, ...rest }) => {
  const { actions, tableActions, smallTable } = rest ?? {};
  const [isSortDecrease, setSortDecrease] = useState(true);
  const makeAction = (name) => {
    if (actions[name] && actions[name].hasOwnProperty('action')) {
      actions[name].action();
    }
  };
  const doSort = () => {
    tableActions.sorting(isSortDecrease);
    setSortDecrease(!isSortDecrease);
    makeAction('sorting');
  };
  const doFiltering = () => {};
  return (
    <>
      {
        <div
          className={cn('h4', styles.title, {
            [styles.format_margin]: rest.smallTable,
          })}
        >
          {title}
          {actions && (
            <TitleButtons
              actions={actions}
              titleButton={actions?.add?.title ?? ''}
              isSmallButton={smallTable}
              doSort={doSort}
              isSortDecrease={isSortDecrease}
            />
          )}
          {rest.onRightButtonClick && (
            <div className={styles.rightButton}>
              <Button
                onClick={rest.onRightButtonClick}
                name={rest.rightButtonName}
              />
            </div>
          )}
        </div>
      }
    </>
  );
};

export default Title;
