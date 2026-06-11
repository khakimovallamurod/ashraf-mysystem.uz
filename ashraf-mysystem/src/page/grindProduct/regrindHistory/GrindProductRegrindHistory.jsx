import { PrinterOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag, Progress } from "antd";
import React, { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import QrCodePrint from "../../../components/common/qrCodePrind/QrCodePrint";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetGrindRegrindHistoryQuery } from "../../../features/grindProduct/regrind/grindRegrindApiSlice";

function GrindProductRegrindHistory() {
  /* Ref */
  const printRef = useRef();
  const expandTableRef = useRef(null);

  /* State */
  const [date, setDate] = useState({ start: null, end: null });

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetGrindRegrindHistoryQuery(date);

  /* API data */
  const tableData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      const filterData = [];
      data.data.forEach((item) => {
        filterData.push({
          key: item.id,
          ...item,
        });
      });
      return filterData;
    }

    return [];
  }, [data]);

  /*  HANDLE PRINT  */
  const handlePrintPart = (data) => {
    printRef.current.onPrint(data);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 40,
      sortType: "number",
    },
    {
      title: "Partiya nomer",
      dataIndex: "partiyanomer",
      width: 70,
      sortType: "string",
    },
    {
      title: "Massa(kg)",
      dataIndex: "massa",
      width: 70,
      sortType: "number",
      render: (_, { massa }) => <MainNumberFormat value={massa} />,
    },
    {
      title: "Maydalandi(kg)",
      dataIndex: "maydalandi",
      width: 70,
      sortType: "number",
      render: (_, { maydalandi }) => <MainNumberFormat value={maydalandi} />,
    },
    {
      title: "Foiz(%)",
      dataIndex: "foiz",
      key: "foiz",
      width: 50,
      sortType: "number",
      render: (_, { foiz = 0 }) => (
        <Progress
          percent={foiz}
          size="small"
          strokeColor={foiz < 97 && "red"}
        />
      ),
    },
    {
      title: "Mahsulotlar",
      dataIndex: "operation",
      width: 70,
      render: (_, { product_list }) => (
        <Tag color="green">
          Mahsulotlar&nbsp;
          <b>({product_list?.length})</b>
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      filters: [
        {
          text: "New",
          value: "new",
        },
        {
          text: "Maydalashda",
          value: "maydalashda",
        },
        {
          text: "Bajarildi",
          value: "bajarildi",
        },
      ],
      onFilter: (value, record) => record?.status?.indexOf(value) === 0,
      render: (_, { status }) => {
        let color = status === "joylandi" ? "success" : "blue";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Sana",
      dataIndex: "sana",
      width: 100,
    },
  ];

  /* Handle print expand table */
  const handlePrintExpandTable = useReactToPrint({
    content: () => expandTableRef.current,
  });

  return (
    <>
      {/* Print */}
      <QrCodePrint ref={printRef} />

      <Section style={{ maxWidth: 1000, margin: "auto" }}>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={tableData}
          scroll={{ y: 1000 }}
          // date
          showDatePicker={true}
          dateValue={date}
          setDateValue={setDate}
          customHeader={
            <ExportTable
              columns={columns}
              fileName="Qayta maydalash"
              data={[...tableData]}
            />
          }
          refetch={refetch}
          expandableTableCurrent={{
            expandedRowRender: (record) => (
              <div
                style={{
                  width: "100%",
                  border: "1px solid #f1f1f1",
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <div
                  ref={expandTableRef}
                  style={{
                    width: "100%",
                  }}
                >
                  <Table
                    columns={[
                      {
                        title: "Mahsulot nomi",
                        dataIndex: "product_name",
                        key: "product_name",
                        width: 100,
                      },
                      {
                        title: "Massa(kg)",
                        dataIndex: "massa",
                        key: "massa",
                        width: 100,
                        render: (_, { massa }) => (
                          <MainNumberFormat value={massa} />
                        ),
                      },
                      {
                        title: "Polka",
                        dataIndex: "polka_name",
                        key: "polka_name",
                        width: 100,
                      },
                      {
                        title: "Yuklovchi",
                        dataIndex: "yuklovchi",
                        key: "yuklovchi",
                        width: 100,
                      },
                      {
                        title: "Yuklangan vaqt",
                        dataIndex: "yuklangan_vaqt",
                        key: "yuklangan_vaqt",
                        width: 100,
                        render: (_, { yuklangan_vaqt }) => (
                          <Tag color="cyan-inverse">{yuklangan_vaqt}</Tag>
                        ),
                      },
                      {
                        title: "Status",
                        dataIndex: "status",
                        key: "status",
                        width: 100,
                        render: (_, { status }) => {
                          return (
                            <Tag color={"blue"}>{status.toUpperCase()}</Tag>
                          );
                        },
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
                        render: ({
                          id,
                          vaqt,
                          massa,
                          product_name,
                          product_id,
                          polka_id,
                        }) => (
                          <Space>
                            <Button
                              icon={<PrinterOutlined />}
                              style={{ background: "#981bf7" }}
                              type="primary"
                              onClick={() => {
                                handlePrintPart({
                                  productName: product_name,
                                  partiyanomer: record?.partiyanomer,
                                  massa,
                                  sana: vaqt,
                                  qrData: {
                                    polka_id,
                                    partiyanomer: record?.partiyanomer,
                                    product_id,
                                  },
                                });
                              }}
                            />
                          </Space>
                        ),
                      },
                    ]}
                    dataSource={record.product_list}
                    rowKey={"id"}
                    pagination={false}
                  />
                </div>
                <div>
                  <Button
                    icon={<PrinterOutlined />}
                    type="primary"
                    onClick={handlePrintExpandTable}
                  />
                </div>
              </div>
            ),
          }}
        />
      </Section>
    </>
  );
}

export default GrindProductRegrindHistory;
