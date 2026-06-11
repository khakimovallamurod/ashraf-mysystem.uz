import {
  FilterOutlined,
  PrinterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Empty, Table, Tag, Tooltip } from "antd";
import React, { useMemo, useRef } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import ProductPateriyaModal from "../../../components/common/productPateriya/ProductPateriyaModal";
import QrCodePrint from "../../../components/common/qrCodePrind/QrCodePrint";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import { useGetUploaderSpareProductsQuery } from "../../../features/uploader/uploaderApiSlice";

function UploaderSpare() {
  /* Ref */
  const printRef = useRef();
  const addPateriyaModalRef = useRef(null);

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetUploaderSpareProductsQuery();

  /* Form */
  const grindedProductData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Bo'lim nomi",
      dataIndex: "bulim_name",
      key: "bulim_name",
      width: 100,
    },
    {
      title: "Nomi",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "Nagruzka",
      dataIndex: "nagruzka",
      key: "nagruzka",
      width: 100,
      render: (_, { nagruzka }) => <MainNumberFormat value={nagruzka} />,
    },
    Table.EXPAND_COLUMN,
    {
      title: "Kirimlar tarixi",
      dataIndex: "history_krim",
      key: "history_krim",
      width: 120,
      render: () => <>Kirimlar</>,
    },
  ];

  const handleOpenPateriyaModal = (data) => {
    addPateriyaModalRef.current.onOpen({
      id: data.id,
      product_id: data.product_id,
    });
  };

  /*  HANDLE PRINT  */
  const handlePrintPart = (data) => {
    printRef.current.onPrint(data);
  };

  return (
    <>
      {/* Print */}
      <QrCodePrint ref={printRef} />

      <ProductPateriyaModal ref={addPateriyaModalRef} />

      <div style={{ padding: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1.2rem",
          }}
        >
          <Button
            icon={<ReloadOutlined />}
            type="primary"
            onClick={refetch}
            loading={isLoading}
          >
            Yangilash
          </Button>
        </div>

        {/* Table */}
        <Table
          size="small"
          columns={columns}
          dataSource={grindedProductData}
          loading={isLoading}
          scroll={{
            x: 400,
            y: 700,
          }}
          locale={{
            emptyText: () => {
              if (isError && !isLoading) {
                return <MainRefetchBtn refetch={refetch} />;
              } else {
                return <Empty />;
              }
            },
          }}
          expandable={{
            expandedRowRender: (record) => (
              <Table
                size="small"
                style={{ margin: "1rem auto", maxWidth: "600px" }}
                scroll={{ x: 300 }}
                columns={[
                  {
                    title: "Partiya",
                    dataIndex: "pnomer",
                    key: "pnomer",
                    width: 80,
                  },
                  {
                    title: "Mahsulot nomi",
                    dataIndex: "product_name",
                    key: "product_name",
                    width: 80,
                  },
                  {
                    title: "Massa(kg)",
                    dataIndex: "massa",
                    key: "massa",
                    width: 80,
                  },
                  {
                    title: "Sana",
                    dataIndex: "vaqt",
                    key: "vaqt",
                    width: 80,
                    render: (_, { vaqt }) => (
                      <Tag color="cyan-inverse">{vaqt}</Tag>
                    ),
                  },
                  {
                    title: <Tag color="gold-inverse">Pateriya</Tag>,
                    dataIndex: "operation",
                    width: 100,
                    render: (_, item) => (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Button
                          shape="round"
                          size="small"
                          icon={<PrinterOutlined />}
                          style={
                            item?.polka_id ? { background: "#981bf7" } : null
                          }
                          disabled={!item?.polka_id}
                          type="primary"
                          onClick={() => {
                            handlePrintPart({
                              productName: item?.product_name,
                              partiyanomer: item?.pnomer,
                              massa: item?.massa,
                              sana: item?.vaqt,
                              qrData: {
                                polka_id: item?.polka_id,
                                partiyanomer: item?.pnomer,
                                product_id: item?.product_id,
                              },
                            });
                          }}
                        />
                        <Tooltip title="Pateriya">
                          <Button
                            shape="round"
                            type="primary"
                            size="small"
                            icon={<FilterOutlined />}
                            onClick={() => handleOpenPateriyaModal(item)}
                          />
                        </Tooltip>
                      </div>
                    ),
                  },
                ]}
                rowClassName={(inRecord) =>
                  inRecord?.pnomer?.toLowerCase().includes("v") ? "row-red" : ""
                }
                pagination={false}
                dataSource={record.history_krim}
                rowKey={"id"}
              />
            ),
          }}
          rowKey={"id"}
        />
      </div>
    </>
  );
}

export default UploaderSpare;
