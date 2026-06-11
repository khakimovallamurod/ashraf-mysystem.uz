import { Flex, Input, Select } from "antd";
import React, { memo } from "react";
import MainRangeDatePicker from "../rangeDatePicker/MainRangeDatePicker";
import styles from "./mainDataTable.module.css";

function MainDataTableHeader({
  onSearch,
  onSelectedPageSize,
  showDatePicker,
  setDateValue,
  customHeader,
  pagination,
  dateValue,
}) {
  /* Handle select table page size */
  const handleSelectPageSize = (val) => {
    onSelectedPageSize(val.value);
  };

  return (
    <div className={styles.tableHeader}>
      <div style={{display:'flex', flexWrap:'wrap', gap:'1rem', alignItems:'center'}}>
        {/* Select page size */}
        {pagination ? (
          <Select
            labelInValue
            defaultValue={{
              value: 25,
              label: 25,
            }}
            style={{
              width: 120,
            }}
            onChange={handleSelectPageSize}
            options={[
              {
                value: 25,
                label: 25,
              },
              {
                value: 50,
                label: 50,
              },
              {
                value: 100,
                label: 100,
              },
              {
                value: 200,
                label: 200,
              },
            ]}
          />
        ) : null}
        {customHeader}

        {/* Range date picker */}
        {showDatePicker ? (
          <MainRangeDatePicker setValue={setDateValue} value={dateValue} />
        ) : null}
      </div>

      {/* Search all */}
      <div className={styles.searchInput}>
        <Input
          placeholder="Izlash..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}

export default memo(MainDataTableHeader);
