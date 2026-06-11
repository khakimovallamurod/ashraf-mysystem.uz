import {
  EditOutlined,
  EnvironmentOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Divider, Space, Tooltip } from "antd";
import React, { useMemo, useRef } from "react";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetSalesCustomerQuery } from "../../../features/sales/customer/salesCustomerApiSlice";
import formatCurrency from "../../../util/formatCurrency";
import SalesAddCustomerModal from "./components/SalesAddCustomerModal";
import MainTableRowCard from "../../../components/common/mainTableCard/MainTableRowCard";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";

function SalesCustomer() {
  /* Ref */
  const addCustomerModalRef = useRef(null);

  /* API */
  const { data, isLoading, isError, refetch } = useGetSalesCustomerQuery();

  const customerData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data?.data, data?.success]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "FIO",
      dataIndex: "fio",
      width: 150,
    },
    {
      title: "Telefon",
      dataIndex: "telefon",
      width: 150,
    },
    {
      title: "Chat ID",
      dataIndex: "chat_id",
      width: 150,
    },
    {
      title: "Korxona",
      dataIndex: "korxona",
      width: 150,
    },
    {
      title: "Balans",
      dataIndex: "balans",
      width: 150,
      render: (balans) => formatCurrency(balans),
    },
    {
      title: "Viloyat",
      dataIndex: "viloyat",
      width: 150,
    },
    {
      title: "Tuman",
      dataIndex: "tuman",
      width: 150,
    },
    {
      title: "Manzil",
      dataIndex: "manzil",
      width: 150,
    },
    {
      title: "Lokatsiya",
      dataIndex: "lokatsiya",
      width: 150,
      render: (_, { lokatsiya }) => {
        return (
          <Tooltip title="Mijozning manzilini xaritadan ko'rish">
            <Button shape="round" type="link" href={lokatsiya} target="_blank">
              <EnvironmentOutlined />
              Manzili
            </Button>
          </Tooltip>
        );
      },
    },
    {
      title: "Ro'yxatdan o'tkazilgan",
      dataIndex: "registertime",
      key: "registertime",
      width: 150,
    },
    {
      title: "Amal",
      key: "operation",
      width: 80,
      fixed: "right",
      align: "center",
      render: ({ id }, itemData) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            size="small"
            onClick={() => handleOpenEditCustomerModal(itemData)}
          />
        </Space>
      ),
    },
  ];

  /* MODAL */
  const handleOpenAddCustomerModal = () => addCustomerModalRef.current.onOpen();
  const handleOpenEditCustomerModal = (data) =>
    addCustomerModalRef.current.onOpen(data);

  return (
    <>
      <SalesAddCustomerModal ref={addCustomerModalRef} />

      <Section>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            marginBottom: "1rem",
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenAddCustomerModal}
          >
            Mijoz qo'shish
          </Button>
        </div>

        <Divider />
        <MainDataTable
          customHeader={
            <MainTableRowCard
              title={"Jami balans"}
              value={
                <MainNumberFormat
                  value={customerData?.reduce(
                    (sum, object) => sum + parseFloat(object.balans),
                    0
                  )}
                />
              }
            />
          }
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={customerData}
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default SalesCustomer;
