import { DeleteOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import React, { memo } from "react";
import MainNumberFormat from "../../../../../components/common/numberFormat/MainNumberFormat";
import styles from "../order/grindOrderStorage.module.css";

function GrindOutListTable({ data, onDelete }) {
  return (
    <Table
      size="small"
      className={styles.table}
      columns={[
        {
          dataIndex: "name",
          key: "name",
        },
        {
          dataIndex: "name",
          key: "name",
          render: (_, { polkaData }) => <>{polkaData?.name}</>,
        },
        {
          dataIndex: "mass",
          key: "mass",
          render: (_, record) => (
            <b>
              <MainNumberFormat value={record?.mass} /> kg
            </b>
          ),
        },
        {
          key: "operation",
          align: "center",
          render: (_, { id }) => (
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              size="small"
              danger
              onClick={() => onDelete(id)}
            />
          ),
        },
      ]}
      dataSource={[...data]}
      rowKey={"id"}
      pagination={false}
    />
  );
}

export default memo(GrindOutListTable);
