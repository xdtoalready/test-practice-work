import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Table.module.sass';
import cn from 'classnames';
import { useTable, useSortBy, useGroupBy, usePagination } from 'react-table';
import { observer } from 'mobx-react';
import { motion } from 'framer-motion';
import Card from '../Card';
import Icon from '../Icon';
import AdaptiveCards from './AdaptiveCards';
import Title from '../Title';
import { clickRecursive } from '../../utils/click';
import TableMenu from '../../components/TableMenu';
import { useLocation, useNavigate } from 'react-router';
import { NextButton, PreviousButton } from '../PaginationButton';
import TableSwithcer from '../../pages/Settings/components/TableSwithcer';
import { LoadingProvider } from '../../providers/LoadingProvider';

const Table = observer(
  ({
    columns,
    data,
    title,
    beforeTable,
    headerActions,
    cardComponent,
    editComponent,
    actions, // Добавлено для передачи действий
    paging, // Добавлено для пагинации
      withHeaderWhenEmpty=true,
    ...rest
  }) => {
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [isSorting, setIsSorting] = useState(false);
    const [activeMenuRowIndex, setActiveMenuRowIndex] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    // Получение номера страницы из query параметра
    //   console.log(paging,'paging')
    const tableInstance = useTable(
      {
        columns,
        data,
        initialState: {
          pageIndex: paging?.current ? Number(paging?.current) : undefined,
          columnWidths: columns.map((col) => ({
            width: col.width ? `${col.width}` : 'auto',
            minWidth: col.minWidth || 'unset',
          })),
        },
        manualPagination: !!paging, // Управляем пагинацией вручную
        pageCount: paging ? Math.floor(paging.all / paging.offset) : undefined,
      },
      useGroupBy,
      useSortBy,
      usePagination,
    );

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      page,
      prepareRow,
      canPreviousPage,
      canNextPage,
      pageOptions,
      gotoPage,
      nextPage,
      previousPage,
      state: { pageIndex },
    } = tableInstance;
    const rowsOrPage = paging ? page : rows;

    const allPages = paging
      ? paging.totalPages ?? Math.ceil(paging.all / paging.offset)
      : undefined;
    // useEffect(() => {
    //   if (paging) {
    //     navigate({
    //       pathname: location.pathname,
    //       search: `?page=${pageIndex}`,
    //     });
    //   }
    // }, [location.pathname, pageIndex, paging]);
    const getVisiblePages = (currentPage, totalPages) => {
      const delta = 3;
      const range = [];
      const rangeWithDots = [];
      let l;

      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 ||
          i === totalPages ||
          (i >= currentPage - delta && i <= currentPage + delta)
        ) {
          range.push(i);
        }
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots;
    };

    const headerSortingRef = useRef(null);
    const titleJsx = (
      <Title
        smallTable={rest.smallTable}
        tableActions={{
          sorting: (decr) => {
            rows[0].allCells[0].column.toggleSortBy(decr);
          },
        }}
        actions={headerActions}
        title={title}
      />
    );

    const handleMenuClick = (index) => {
      setActiveMenuRowIndex(activeMenuRowIndex === index ? null : index);
    };
    const handleEditClick = (index) => {
      if (!isSorting) {
        setEditingRowIndex(editingRowIndex === index ? null : index);
        setTimeout(() => (editingRowIndex === index ? null : index), 5);
      }
      setIsSorting(false);
    };

    const renderRow = (row, index) => {
      prepareRow(row);
      const isEditing = editComponent && index === editingRowIndex;

      const editComponentContent =
        isEditing && typeof editComponent === 'function'
          ? () => editComponent(row.original)
          : null;

      return (
        <React.Fragment key={row.id}>
          <tr {...row.getRowProps()}>
            {row.cells.map((cell, cellIndex) => (
              <td
                className={cell.column.flexCol && styles.flexCol}
                {...cell.getCellProps()}
              >
                {cell.render('Cell')}
              </td>
            ))}
            {actions && (
              <td className={styles.menuTd}>
                <div
                  className={styles.menuButton}
                  onClick={(e) => handleMenuClick(index)}
                >
                  <Icon fill={'#6F767E'} name={'more-horizontal'} size={28} />
                </div>
                {activeMenuRowIndex === index && (
                  <TableMenu
                    actions={actions(row.original)}
                    isVisible={true}
                    onClose={() => setActiveMenuRowIndex(null)}
                  />
                )}
              </td>
            )}
            {editComponent &&
              (!editComponentContent ? (
                <td>
                  <div
                    className={styles.editButton}
                    onClick={() => {
                      handleEditClick(index);
                    }}
                  >
                    {!isEditing ? (
                      <Icon fill={'#6F767E66'} name={'edit'} size={20} />
                    ) : (
                      typeof editComponent !== 'function' && (
                        <Icon
                          fill={'#FF6A55'}
                          name={'check-circle'}
                          size={20}
                        />
                      )
                    )}
                  </div>
                </td>
              ) : (
                <td>
                  <div
                    className={styles.editButton}
                    onMouseUp={() => setEditingRowIndex(null)}
                    onClick={() => {
                      setIsSorting(false);
                      setEditingRowIndex((prev) => {
                        return index;
                      });
                      setTimeout(() => setEditingRowIndex(index), 100);
                    }}
                  >
                    <Icon fill={'#6F767E66'} name={'edit'} size={20} />
                  </div>
                </td>
              ))}
          </tr>
          {editComponentContent && !isSorting && editComponentContent()}
        </React.Fragment>
      );
    };

    return (
      <>
        <div className={rest.classContainer}>
          {!rest.headerInCard && titleJsx}
          {rest?.settingsSwithcerValue && (
            <TableSwithcer value={rest.settingsSwithcerValue} swithers={rest?.switchers??[]} />
          )}
          <div className={'gridContainer'}>
            {beforeTable && beforeTable()}
            <Card
              className={cn(styles.card, {
                [styles.card_smallTable]: rest.smallTable,
              })}
            >
              {rest.headerInCard && titleJsx}
              <div
                className={cn(styles.wrapper, {
                  [styles.smallTable]: rest.smallTable,
                  [styles.pagingTable]: !!paging,
                })}
              >
                  {Boolean((Array.isArray(data) && data.length) || withHeaderWhenEmpty) && <table {...getTableProps()}>
                  <thead>
                    {!rest.disableHeader &&
                      headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <motion.th
                              onClick={(e) => {
                                setIsSorting(true);
                                if (column.canSort && !column.isSortedDesc)
                                  clickRecursive(e.target);
                              }}
                              {...column.getHeaderProps(
                                column.getSortByToggleProps(),
                              )}
                              style={{
                                width: column.width || 'auto',
                                minWidth: column.minWidth || 'unset',
                              }}
                            >
                              <div
                                onClick={() => {
                                  setIsSorting(true);
                                }}
                                className={cn(styles.headerCol_wrapper)}
                              >
                                <div
                                  className={cn(styles.headerCol)}
                                  ref={headerSortingRef}
                                >
                                  <span>{column.render('Header')}</span>
                                  {column.canSort && (
                                    <span className={styles.margin}>
                                      <div className={styles.flex}>
                                        <Icon
                                          fill={'#6F767E'}
                                          name={'sort-arrow'}
                                          viewBox={'0 0 8 17'}
                                          size={16}
                                        />
                                        <div
                                          className={cn(styles.component, {
                                            [styles.active]:
                                              column.isSortedDesc,
                                          })}
                                        >
                                          <span />
                                          <span />
                                          <span />
                                        </div>
                                      </div>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.th>
                          ))}
                        </tr>
                      ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    <LoadingProvider
                      cls={styles.table_loader}
                      isLoading={
                        rest.hasOwnProperty('isLoading')
                          ? rest?.isLoading
                          : false
                      }
                    >
                      {rest.disableHeader
                        ? headerGroups.map((group) =>
                            group.headers
                              .filter((col) => col.columns && !col.parent)
                              .map((col) => {

                                const colJsx = col.render('Header');
                                return (
                                  <div
                                    className={styles.disable_header}
                                    key={col.id}
                                  >
                                    {Object.keys(colJsx.props).length ? (
                                      <tr>
                                        <td>{colJsx}</td>
                                      </tr>
                                    ) : (
                                      <></>
                                    )}
                                    {rowsOrPage
                                      .filter(
                                        (el) =>
                                          el.id ===
                                          col.originalId.split('_')[1],
                                      )
                                      .map((row) => {
                                        prepareRow(row);
                                        return (
                                          <React.Fragment
                                            key={row.id}
                                            {...row.getRowProps()}
                                          >
                                            <tr>
                                              {row.cells
                                                .filter(
                                                  (cell) =>
                                                    cell.column.parent.id ===
                                                    col.originalId,
                                                )
                                                .map((cell) => (
                                                  <td
                                                    key={cell.column.id}
                                                    {...cell.getCellProps()}
                                                  >
                                                    {cell.render('Cell')}
                                                  </td>
                                                ))}
                                            </tr>
                                          </React.Fragment>
                                        );
                                      })}
                                  </div>
                                );
                              }),
                          )
                        : rowsOrPage.map((row, index) => renderRow(row, index))}
                    </LoadingProvider>
                  </tbody>
                </table>}
              </div>
            </Card>
            {paging && (
              <Card className={styles.pagingCard}>
                {paging && (
                  <div className={styles.pagination}>
                    <PreviousButton
                      disabled={Number(paging.current) === 1}
                      onClick={() =>
                        paging.onPageChange(Number(paging.current) - 1)
                      }
                    />
                    <div className={cn(styles.divider_line, styles.left)} />
                    {allPages && (
                      <div className={styles.pagesCount}>
                        {getVisiblePages(Number(paging.current), allPages).map(
                          (pageNum, index) => (
                            <React.Fragment key={index}>
                              {pageNum === '...' ? (
                                <div className={styles.dots}>...</div>
                              ) : (
                                <div
                                  className={
                                    Number(paging.current) === pageNum
                                      ? cn(styles.page, styles.active)
                                      : styles.page
                                  }
                                  onClick={() => {
                                    if (typeof pageNum === 'number') {
                                      paging.onPageChange(pageNum);
                                    }
                                  }}
                                >
                                  {pageNum}
                                </div>
                              )}
                            </React.Fragment>
                          ),
                        )}
                      </div>
                    )}
                    <div className={cn(styles.divider_line, styles.right)} />
                    <NextButton
                      disabled={Number(paging.current) === allPages}
                      onClick={() =>
                        paging.onPageChange(Number(paging.current) + 1)
                      }
                    />
                  </div>
                )}
              </Card>
            )}
            {rest?.after}
            {rest?.lastColumn}
          </div>

          {cardComponent && (
            <AdaptiveCards
              onPagination={rest?.onPagination ?? null}
              cardComponent={cardComponent}
              rows={rows}
            />
          )}
        </div>
      </>
    );
  },
);

export default Table;
