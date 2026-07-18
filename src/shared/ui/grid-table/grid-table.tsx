import { Fragment, type CSSProperties, type ReactNode } from "react";

import clsx from "clsx";

import "./grid-table.scss";

type GridTableProps<TItem> = {
  ariaLabel: string;
  className?: string;
  emptyMessage?: string;
  gridTemplateColumns: string;
  header: readonly ReactNode[];
  items: readonly TItem[];
  renderRow: (item: TItem, index: number) => ReactNode;
};

export function GridTable<TItem>({
  items,
  ariaLabel,
  className,
  gridTemplateColumns,
  header,
  renderRow,
  emptyMessage = "No data"
}: GridTableProps<TItem>) {
  const gridStyle = { "--grid-table-columns": gridTemplateColumns } as CSSProperties;

  return (
    <div className={clsx("grid-table", "admin-hover-scrollbar-container", className)}>
      <div className="grid-table__scroll admin-hover-scrollbar" role="table" aria-label={ariaLabel} tabIndex={0}>
        <div className="grid-table__content">
          <div role="rowgroup">
            <div className="grid-table__header" role="row" style={gridStyle}>
              {header.map((item, index) => (
                <div key={index} className="grid-table__header-item" role="columnheader">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div role="rowgroup">
            {items.length > 0 ? (
              items.map((item, rowIndex) => (
                <Fragment key={rowIndex}>
                  {renderRow(item, rowIndex)}
                </Fragment>
              ))
            ) : (
              <div className="grid-table__empty" role="row" style={gridStyle}>
                <span className="grid-table__empty-content" role="cell">
                  {emptyMessage}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
