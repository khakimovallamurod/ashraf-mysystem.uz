import React, { memo, useEffect, useState } from "react";
import MainDataTableBody from "./MainDataTableBody";
import MainDataTableHeader from "./MainDataTableHeader";

function MainDataTable({
  columns = [],
  isLoading = false,
  isError = false,
  data = [],
  refetch = () => {},
  showDatePicker,
  setDateValue,
  dateValue,
  scroll,
  customHeader,
  pagination = true,
  rowKey,
  rowClassName,
  expandableTableCurrent,
  expandableTable,
  expandableTableRowClassName,
  tableHeaderHidden = false,
}) {
  /* State */
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [showPagination, setShowPagination] = useState(pagination);

  useEffect(() => {
    if (tableHeaderHidden) {
      setShowPagination(false);
    }
  }, [tableHeaderHidden]);

  return (
    <>
      {/* Header */}
      {!tableHeaderHidden && (
        <MainDataTableHeader
          pagination={showPagination}
          onSelectedPageSize={setPageSize}
          onSearch={setSearch}
          showDatePicker={showDatePicker}
          setDateValue={setDateValue}
          customHeader={customHeader}
          dateValue={dateValue}
        />
      )}
      {/* Body */}
      <MainDataTableBody
        // mobile={mobile}
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        pageSize={pageSize}
        pagination={showPagination}
        search={search}
        expandableTable={expandableTable}
        scroll={scroll}
        rowKey={rowKey}
        rowClassName={rowClassName}
        expandableTableCurrent={expandableTableCurrent}
        expandableTableRowClassName={expandableTableRowClassName}
      />
    </>
  );
}

export default memo(MainDataTable);
