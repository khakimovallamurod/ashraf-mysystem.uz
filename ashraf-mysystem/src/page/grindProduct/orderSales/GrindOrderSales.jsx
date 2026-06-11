import { PrinterFilled } from "@ant-design/icons";
import { Button, Table, Tag, Tooltip } from "antd";
import React, { useMemo, useRef, useState } from "react";
import MainModal from "../../../components/common/modal/MainModal";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetGrindOrderSalesInProcessQuery } from "../../../features/grindProduct/order/grindOrderSalesApiSlice";
import GrindOutProductPrintChek from "../outProductFromGrind/components/GrindOutProductPrintChek";
import GrindOrderPlacingToStorageModal from "./components/GrindOrderPlacingToStorageModal";

function GrindOrderSales() {
  /* Ref */
  const placingProductOrderModalRef = useRef();
  const printTableChekRef = useRef(null);

  /* State */
  const [openProductModal, setOpenProductModal] = useState({ open: false });

  /* API */
  const { data, isError, isLoading, refetch } =
    useGetGrindOrderSalesInProcessQuery();

  /* Memo */
  const tableData = useMemo(() => {
    if (data?.success === true && data?.data && data?.data?.length) {
      return data.data;
    }
    return [];
  }, [data]);

  const columns = [
    {
      title: "Sotuvchi",
      dataIndex: "sotuvchi",
      key: "sotuvchi",
      width: 150,
      sortType: "string",
    },
    {
      title: "Partiya nomeri",
      dataIndex: "partiyanomer",
      key: "partiyanomer",
      width: 150,
      sortType: "string",
    },
    {
      title: "Mahsulotlar",
      dataIndex: "partiyanomer",
      key: "partiyanomer",
      width: 150,
      render: (_, { product_list }) => (
        <Tooltip title="Mahsulotlarni ko'rish">
          <Button
            type="link"
            onClick={() => handleOpenProductModal(product_list)}
          >
            Mahsulotlar &nbsp;<b>{product_list?.length}</b>
          </Button>
        </Tooltip>
      ),
    },
    {
      title: "Izoh",
      dataIndex: "izoh",
      width: 150,
      sortType: "string",
    },
    {
      title: "Sana",
      dataIndex: "sana",
      width: 150,
      sortType: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      render: (status) => {
        let color = "";
        switch (status) {
          case "new":
            color = "#ff0099";
            break;
          case "tayyorlanmoqda":
            color = "#07e0a3";
            break;
          case "tayyorlandi":
            color = "yellow-inverse";
            break;
          case "tugatildi":
            color = "red-inverse";
            break;
          case "dostavka":
            color = "#4788f7";
            break;
          case "topshirildi":
            color = "#059b3e";
            break;
          default:
        }

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Amal",
      dataIndex: "operation",
      width: 150,
      align: "center",
      render: (_, item) => (
        <Tooltip title="Saqlash bo'limiga buyurtma berish">
          <Button
            type="primary"
            size="small"
            onClick={() => handleOpenPlacingOrderModal(item)}
          >
            Buyurtma berish
          </Button>
        </Tooltip>
      ),
    },
  ];

  const handleOpenProductModal = (data = []) =>
    setOpenProductModal({
      open: true,
      data,
    });
  const handleCloseProductModal = (data) =>
    setOpenProductModal({
      open: false,
      data: null,
    });

  const handlePrintTableChek = (data) => {
    printTableChekRef.current?.onPrint(
      data?.map((item) => ({
        name: item?.product_name,
        mass: item?.buyurtmamassa,
      }))
    );
  };

  const handleOpenPlacingOrderModal = (product) =>
    placingProductOrderModalRef.current.onOpen(product);

  return (
    <>
      {/* Print table */}
      <GrindOutProductPrintChek ref={printTableChekRef} />

      {/* Placing order */}
      <GrindOrderPlacingToStorageModal ref={placingProductOrderModalRef} />

      {/* Products Modal */}
      <MainModal open={openProductModal.open} onClose={handleCloseProductModal}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <Button
            onClick={() => handlePrintTableChek(openProductModal.data)}
            icon={<PrinterFilled />}
            type="primary"
            shape="round"
          />
        </div>
        <div>
          <Table
            pagination={false}
            size="small"
            columns={[
              {
                title: "ID",
                dataIndex: "product_id",
                key: "product_id",
              },
              {
                title: "Nomi",
                dataIndex: "product_name",
                key: "product_name",
              },
              {
                title: "Massa(kg)",
                dataIndex: "buyurtmamassa",
                key: "buyurtmamassa",
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (_, { status }) => {
                  const color =
                    status === "new" ? "cyan-inverse" : "blue-inverse";
                  return <Tag color={color}>{status.toUpperCase()}</Tag>;
                },
              },
            ]}
            rowKey={"product_id"}
            dataSource={openProductModal.data}
          />
        </div>
      </MainModal>

      <Section>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={tableData}
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default GrindOrderSales;
