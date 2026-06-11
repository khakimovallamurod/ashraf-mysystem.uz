import { DeleteOutlined, EyeFilled, PrinterOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Progress, Table, Tag, message } from "antd";
import React, { useMemo, useRef, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import QrCodePrint from "../../../components/common/qrCodePrind/QrCodePrint";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import {
  useDeleteGrindProductOutItemMutation,
  useGetGrindProductOutFromGrindQuery,
} from "../../../features/grindProduct/order/grindOrderStorageApiSlice";
import { formatFloatNumber } from "../../../util/formatFloatNumber";
import GrindOutProductViewDetailItemsModal from "./GrindOutProductViewDetailItemsModal";
import GrindOutProductPrintChek from "./components/GrindOutProductPrintChek";

function GrindOutProductFromGrind() {
  /* Ref */
  const printRef = useRef();
  const productDetailModalRef = useRef(null);
  const printTableChekRef = useRef(null);

  /* State */
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [date, setDate] = useState({ start: null, end: null });

  /* API */
  const [deleteProduct] = useDeleteGrindProductOutItemMutation();
  const { data, isLoading, isError, refetch } =
    useGetGrindProductOutFromGrindQuery(date);

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "delete";

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

  /* DELETE */
  const handleDeleteItem = async (id) => {
    setDeleteLoading(true);
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const resData = await deleteProduct(id).unwrap();

      if (resData?.success === true) {
        if (resData?.message) {
          messageApi.open({
            key,
            type: "success",
            content: resData?.message,
          });
        }
      } else if (resData?.success === false) {
        if (resData?.message) {
          messageApi.open({
            key,
            type: "error",
            content: resData?.message,
          });
        }
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        message.warning("Ulanishda xatolik! Qaytadan urinib ko'ring!");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      sortType: "number",
    },
    {
      title: "Partiya nomer",
      dataIndex: "partiyanomer",
      key: "partiyanomer",
      width: 100,
      sortType: "string",
    },
    {
      title: "Sotuvchi",
      dataIndex: "sotuvchi",
      key: "sotuvchi",
      width: 100,
      sortType: "string",
    },
    {
      title: "Massa(kg)",
      dataIndex: "massa",
      key: "massa",
      width: 100,
      render: (_, { massa }) => <MainNumberFormat value={massa} />,
      sortType: "number",
    },
    {
      title: "Maydalandi(kg)",
      dataIndex: "maydalandi",
      key: "maydalandi",
      width: 100,
      render: (_, { maydalandi }) => <MainNumberFormat value={maydalandi} />,
      sortType: "number",
    },
    {
      title: "Foiz(%)",
      dataIndex: "foiz",
      key: "foiz",
      width: 50,
      render: (_, { foiz }) => (
        <Progress
          percent={foiz}
          size="small"
          strokeColor={foiz < 25 && "red"}
        />
      ),
      sortType: "number",
    },
    {
      title: "Mahsulotlar",
      dataIndex: "operation",
      key: "operation",
      width: 100,
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
      key: "status",
      width: 100,
      filters: [
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
        return <Tag color={color}>{status ? status?.toUpperCase() : ""}</Tag>;
      },
    },
    {
      title: "Sana",
      dataIndex: "sana",
      key: "sana",
      width: 100,
      sortType: "date",
    },
    {
      title: "Amal",
      dataIndex: "operation",
      fixed: "right",
      width: 60,
      align: "center",
      render: (_, { id, status, partiyanomer }) => (
        // <Space>
        <Popconfirm
          title="O'chirish"
          description="Rostdan ham o'chirmoqchimisiz?"
          onConfirm={() => handleDeleteItem(id)}
          okText="Ha, albatta"
          cancelText="Yo'q"
        >
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            size="small"
            disabled={status !== "new"}
          />
        </Popconfirm>
        /* <Button
            icon={<PrinterOutlined />}
            style={{ background: "#64d1a6" }}
            type="primary"
            size="small"
            onClick={() => {
              handlePrintPart({
                partiyanomer,
                // taminotchi,
                // qassob,
                // massa,
                // allBoxCount: JSON.parse(malumot)?.allBoxCount,
                // dona,
                // sana,
              });
            }}
          /> */
        // </Space>
      ),
    },
  ];

  const handleOpenDatailModal = (partiyaId, productId) => {
    productDetailModalRef.current.onOpen({
      partiyaId: partiyaId,
      productId: productId,
    });
  };

  const handlePrintTableChek = (data) => {
    printTableChekRef.current?.onPrint(
      data?.product_list?.map((item) => ({
        name: item?.product_name,
        mass: item.massa,
      }))
    );
  };

  return (
    <>
      {contextHolder}

      {/* Print table */}
      <GrindOutProductPrintChek ref={printTableChekRef} />

      {/* Print */}
      <QrCodePrint ref={printRef} />

      {/* Detail modal */}
      <GrindOutProductViewDetailItemsModal ref={productDetailModalRef} />

      <Section>
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
              fileName="Maydalashdan chiqarish"
              data={[...tableData]}
            />
          }
          refetch={refetch}
          expandableTableCurrent={{
            expandedRowRender: (record) => (
              <>
                <div
                  style={{
                    width: "400px",
                    border: "1px solid #f1f1f1",
                    display: "flex",
                    gap: "0.5rem",
                    margin: "auto",
                  }}
                >
                  <div
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
                            <MainNumberFormat
                              value={formatFloatNumber(massa)}
                            />
                          ),
                        },
                        {
                          title: "Amal",
                          key: "operation",
                          fixed: "right",
                          width: 60,
                          align: "center",
                          render: ({
                            product_id,
                            vaqt,
                            massa,
                            product_name,
                            polka_id,
                          }) => (
                            <div
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                size="small"
                                icon={<PrinterOutlined />}
                                style={
                                  polka_id ? { background: "#981bf7" } : null
                                }
                                disabled={!polka_id}
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
                                      product_id: product_id,
                                    },
                                  });
                                }}
                              />
                              <Button
                                size="small"
                                icon={<EyeFilled />}
                                type="primary"
                                onClick={() =>
                                  handleOpenDatailModal(record?.id, product_id)
                                }
                              />
                            </div>
                          ),
                        },
                      ]}
                      dataSource={record.product_list}
                      rowKey={"key"}
                      pagination={false}
                    />
                  </div>
                  <div>
                    <Button
                      icon={<PrinterOutlined />}
                      type="primary"
                      onClick={() => handlePrintTableChek(record)}
                    />
                  </div>
                </div>
              </>
            ),
          }}
        />
      </Section>
    </>
  );
}

export default GrindOutProductFromGrind;
