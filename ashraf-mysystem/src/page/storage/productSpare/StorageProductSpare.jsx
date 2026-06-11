import { FilterOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Tag, Tooltip } from "antd";
import React, { useMemo, useRef } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import ProductPateriyaModal from "../../../components/common/productPateriya/ProductPateriyaModal";
import QrCodePrint from "../../../components/common/qrCodePrind/QrCodePrint";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetProductStorageSpareQuery } from "../../../features/productStorage/productStorageApiSlice";
import { formatFloatNumber } from "../../../util/formatFloatNumber";

function StorageProductSpare() {
  /* Ref */
  const printRef = useRef(null);
  const addPateriyaModalRef = useRef(null);

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetProductStorageSpareQuery();

  const spareProductData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
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
      width: 80,
    },
    {
      title: "Nomi",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "Nagruzka",
      dataIndex: "nagruzka",
      width: 150,
      render: (_, { nagruzka }) => (
        <MainNumberFormat value={formatFloatNumber(nagruzka)} />
      ),
    },
    {
      expand: true,
    },
    {
      title: "Mahsulotlar",
      dataIndex: "operation",
      width: 100,
      render: () => <Tag>Mahsulotlar</Tag>,
    },
  ];

  const expantableTableColumn = [
    {
      title: "Partiya nomer",
      dataIndex: "pnomer",
      key: "pnomer",
      width: 150,
    },
    {
      title: "Mahsulot nomi",
      dataIndex: "product_name",
      key: "product_name",
      width: 150,
    },
    {
      title: "Massa(kg)",
      dataIndex: "massa",
      key: "massa",
      width: 100,
      render: (_, { massa }) => (
        <MainNumberFormat value={formatFloatNumber(massa)} />
      ),
    },
    {
      title: "Sana",
      dataIndex: "vaqt",
      key: "vaqt",
      width: 100,
    },
    {
      title: <Tag color="gold-inverse">Pateriya</Tag>,
      dataIndex: "operation",
      width: 100,
      render: (_, item) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            shape="round"
            icon={<PrinterOutlined />}
            size="small"
            onClick={() => {
              handlePrintPart({
                partiyanomer: item.pnomer,
                massa: item.massa,
                sana: item.sana,
                qrData: {
                  polka_id: item.polka_id,
                  partiyanomer: item.pnomer,
                  product_id: item.product_id,
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
  ];

  const handleOpenPateriyaModal = (data) => {
    addPateriyaModalRef.current.onOpen({
      id: data.id,
      product_id: data.product_id,
    });
  };

  return (
    <>
      {/* Print */}
      <QrCodePrint ref={printRef} />

      <ProductPateriyaModal ref={addPateriyaModalRef} />

      <Section>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={spareProductData}
          refetch={refetch}
          customHeader={
            <ExportTable
              columns={columns}
              fileName="Zahira"
              data={[...spareProductData]}
            />
          }
          expandableTableCurrent={{
            expandedRowRender: (record) => (
              <MainDataTable
                isLoading={isLoading}
                isError={isError}
                data={record?.history_krim}
                refetch={refetch}
                customHeader={
                  <ExportTable
                    columns={expantableTableColumn}
                    fileName={`${record?.name}_mahsulotlar`}
                    data={[...record?.history_krim]}
                  />
                }
                columns={expantableTableColumn}
                rowClassName={(inRecord) => {
                  if (inRecord?.pnomer?.toLowerCase().includes("v")) {
                    return "row-red";
                  } else if (inRecord?.pnomer?.toLowerCase().includes("qm")) {
                    return "row-yellow";
                  }
                }}
              />
            ),
          }}
        />
      </Section>
    </>
  );
}

export default StorageProductSpare;
