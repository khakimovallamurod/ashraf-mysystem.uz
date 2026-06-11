import { FilterOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Tag, Tooltip, Space } from "antd";
import React, { useMemo, useRef } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import ProductPateriyaModal from "../../../components/common/productPateriya/ProductPateriyaModal";
import QrCodePrint from "../../../components/common/qrCodePrind/QrCodePrint";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetGrindProductsSpareQuery } from "../../../features/grindProduct/GrindProductApiSlice";
import { formatFloatNumber } from "../../../util/formatFloatNumber";

function GrindProductSpare() {
  /* Ref */
  const printRef = useRef(null);
  const addPateriyaModalRef = useRef(null);

  /* API */
  const { data, isLoading, isError, refetch } = useGetGrindProductsSpareQuery();

  const spareProductData = useMemo(() => {
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
      title: "Nomi",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Nagruzka",
      dataIndex: "nagruzka",
      key: "nagruzka",
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
      dataIndex: "product_list",
      key: "product_list",
      width: 100,
      render: () => <Tag>Mahsulotlar</Tag>,
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

      <Section>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={spareProductData}
          refetch={refetch}
          expandableTable={{
            name: "history_krim",
            columns: [
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
                  <Space>
                    <Button
                      size="small"
                      icon={<PrinterOutlined />}
                      disabled={!item?.polka_id}
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
                        type="primary"
                        size="small"
                        icon={<FilterOutlined />}
                        onClick={() => handleOpenPateriyaModal(item)}
                      />
                    </Tooltip>
                  </Space>
                ),
              },
            ],
          }}
          expandableTableRowClassName={(inRecord) =>
            inRecord?.pnomer?.toLowerCase().includes("v") ? "row-red" : ""
          }
        />
      </Section>
    </>
  );
}

export default GrindProductSpare;
