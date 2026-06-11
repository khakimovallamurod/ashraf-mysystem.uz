import { PrinterOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Empty, Table } from "antd";
import React, { useMemo, useRef, useState } from "react";
import Section from "../../../components/common/section/Section";
import { useGetPolkaStorageQuery } from "../../../features/productStorage/polka/productStoragePolkaApiSlice";
import { useReactToPrint } from "react-to-print";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";

function StoragePolka() {
  /*Ref*/
  const printRef = useRef(null);

  /*State*/
  const [printData, setPrintData] = useState(null);

  /*API*/
  const { data, isLoading, isError, refetch } = useGetPolkaStorageQuery();

  const newData = useMemo(() => {
    if (data?.success === true && data?.data && data?.data?.length) {
      const filterData = [];

      data?.data?.forEach((item) => {
        filterData.push({
          key: item.id,
          ...item,
        });
      });

      return filterData;
    }
    return [];
  }, [data]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
    {
      title: "Nomi",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Bo'lim nomi",
      dataIndex: "bulim_name",
      key: "bulim_name",
      width: 150,
    },
    {
      title: "Bo'lim ID",
      dataIndex: "bulim_id",
      key: "bulim_id",
      width: 150,
    },
    Table.EXPAND_COLUMN,
    {
      title: "Nagruzka",
      dataIndex: "nagruzka",
      key: "nagruzka",
      width: 150,
    },
  ];

  /*Print*/
  const onPrintChek = (data) => {
    setPrintData(data);
    const timeId = setTimeout(() => {
      handlePrint();
      return clearTimeout(timeId);
    }, 300);

  };

  const handlePrint = useReactToPrint({
    content: () => printRef?.current,
  });

  return (
    <>
      <div className={"printContainer"} ref={printRef}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          {printData?.pnomer}
        </h2>
        <table className="printCheckTable printTable borderRow">
          <tbody>
            <tr>
              <td>Qoldi</td>
              <td>
                <MainNumberFormat value={printData?.qoldi} />kg
              </td>
            </tr>
            <tr>
              <td>Kirgan vaqti</td>
              <td>{printData?.vaqt}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Section>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
            gap: "1rem",
          }}
        >
          <Button type="primary" icon={<ReloadOutlined />} onClick={refetch}>
            Yangilash
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={newData}
          loading={isLoading}
          scroll={{
            x: 800,
            y: 700,
          }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ maxWidth: "500px", margin: "auto" }}>
                <Table
                  pagination={false}
                  columns={[
                    {
                      title: "Partiya",
                      dataIndex: "pnomer",
                      key: "pnomer",
                      width: 100,
                    },
                    {
                      title: "Massa(kg)",
                      dataIndex: "massa",
                      key: "massa",
                      width: 100,
                    },
                    {
                      title: "Qoldi(kg)",
                      dataIndex: "qoldi",
                      key: "qoldi",
                      width: 100,
                    },
                    {
                      title: "Sana",
                      dataIndex: "vaqt",
                      key: "vaqt",
                      width: 100,
                    },
                    {
                      title: "Amal",
                      key: "operation",
                      fixed: "right",
                      width: 60,
                      align: "center",
                      render: (_, item) => (
                        <Button
                          icon={<PrinterOutlined />}
                          type="primary"
                          size="small"
                          onClick={() => onPrintChek(item)}
                        />
                      ),
                    },
                  ]}
                  dataSource={record.history_krim}
                  rowKey={"id"}
                />
              </div>
            ),
          }}
          locale={{
            emptyText: () => {
              if (isError && !isLoading) {
                return (
                  <Button onClick={refetch} icon={<ReloadOutlined />}>
                    Reload
                  </Button>
                );
              } else {
                return <Empty />;
              }
            },
          }}
        />
      </Section>
    </>
  );
}

export default StoragePolka;
