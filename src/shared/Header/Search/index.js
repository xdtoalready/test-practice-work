import React, { useRef, useState, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';
import styles from './Search.module.sass';
import Icon from '../../Icon';
import { debounce } from 'lodash';
import Item from './Item';
import Suggestion from './Suggestion';
import { useNavigate } from 'react-router';
import useStore from '../../../hooks/useStore';
import useAppApi from '../../../api';
import TaskEditModal from '../../../components/TaskModal';
import useTasks from '../../../pages/Tasks/hooks/useTasks';
import useTasksApi from '../../../pages/Tasks/tasks.api';

const Search = observer(({ className }) => {
  const navigate = useNavigate();
  const { appStore } = useStore();
  const { tasksStore } = useStore();
  const { searchResults } = appStore;
  const appApi = useAppApi();
  // const { data, isLoading, store: taskStore } = useTasks();
  const taskApi = useTasksApi();

  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const ref = useRef(null);
  const inputRef = useRef(null);

  // Debounced search function
  const searchFunction = async (query) => {
    if (query.length >= 3) {
      try {
        await appApi.search(query);
      } catch (error) {
        console.error('Search error:', error);
        appStore.clearSearchResults();
      }
    } else {
      appStore.clearSearchResults();
    }
  };

  const debouncedSearch = useCallback(debounce(searchFunction, 100), [appApi]);

  useEffect(() => {
    debouncedSearch(text);
    return () => {
      debouncedSearch.cancel();
    };
  }, [text]);

  const handleClickOnTask = async (item) => {

    await taskApi.getTaskById(item.id);
    setSelectedTask(item);
  };

  const handleResultClick = (item, type) => {
    switch (type) {
      case 'tasks':
        handleClickOnTask(item);
        break;
      case 'deals':
        navigate(`/deals/${item.id}`);
        break;
      case 'companies':
        navigate(`/clients/${item.id}`);
        break;
      case 'services':
        navigate(`/services/${item.id}`);
        break;
    }
    setVisible(false);
  };

  const formatResults = () => {
    const results = [];

    // Заголовки для групп результатов
    const TYPE_GROUPS = {
      companies: 'Компании',
      deals: 'Сделки',
      tasks: 'Задачи',
      services: 'Услуги',
    };
    const ORDER = ['companies', 'services', 'deals', 'tasks'];

    ORDER.forEach((type) => {
      const items = searchResults[type] || [];
      if (items.length > 0) {
        results.push({
          title: TYPE_GROUPS[type],
          items: items.map((item) => ({
            title: item.name,
            content: TYPE_GROUPS[type],
            id: item.id,
            type,
          })),
        });
      }
    });

    return results;
  };

  const handleClose = () => {
    setText('');
    inputRef.current.blur();
    setVisible(false);
    appStore.clearSearchResults();
  };

  return (
    <>
      <div
        ref={ref}
        className={cn(styles.search, className, { [styles.active]: visible })}
      >
        <div className={styles.head}>
          <button className={styles.start}>
            <Icon className={styles.searchIcon} name="search" size="24" />
          </button>
          <input
            ref={inputRef}
            value={text}
            className={styles.input}
            type="text"
            placeholder="Поиск"
            onChange={({ target }) => {
              setText(target.value);
              setVisible(true);
            }}
          />
          <button className={styles.close} onClick={handleClose}>
            <Icon name="close-circle" size="24" />
          </button>
        </div>
        <div className={styles.body}>
          {formatResults().map((section, sectionIndex) => (
            <div className={styles.box} key={sectionIndex}>
              <div className={styles.category}>{section.title}</div>
              <div className={styles.list}>
                {section.items.map((item, itemIndex) => (
                  <Item
                    className={styles.item}
                    item={item}
                    key={itemIndex}
                    onClick={() => handleResultClick(item, item.type)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTask && (
        <TaskEditModal
          data={selectedTask}
          handleClose={() => setSelectedTask(null)}
          taskStore={tasksStore}
          taskApi={taskApi}
        />
      )}
    </>
  );
});

export default Search;
