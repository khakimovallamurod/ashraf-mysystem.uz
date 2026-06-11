import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import React, { useMemo, useRef } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import Section from "../../../components/common/section/Section";
import AddProductProviderModal from "../../../components/sklad/receptiomModal/productProvider/AddProductProviderModal";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetProductProviderQuery } from "../../../features/sklad/productProvider/productProviderApiSlice";
import formatCurrency from "../../../util/formatCurrency";

function StorageProvider() {
  /* Ref */
  const addProviderRef = useRef(null);

  /* API */
  const { data, isLoading, isError, refetch } = useGetProductProviderQuery();

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
      width: 50,
      sortType: "number",
    },
    {
      title: "Nomi",
      dataIndex: "fio",
      width: 150,
      sortType: "string",
    },
    {
      title: "Telefon",
      dataIndex: "telefon",
      width: 150,
      sortType: "string",
    },
    {
      title: "Balans(so'm)",
      dataIndex: "balans",
      width: 150,
      sortType: "number",
      render: (telefon) => formatCurrency(telefon),
    },
  ];

  const openAddProviderModal = () => addProviderRef.current.onOpen();

  return (
    <>
      {/* Provider modal */}
      <AddProductProviderModal ref={addProviderRef} />

      <Section>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
            gap: "1rem",
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAddProviderModal}
          >
            Taminotchi qo'shish
          </Button>
        </div>

        <Divider />

        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={newData}
          customHeader={
            <ExportTable
              columns={columns}
              fileName="Taminotchilar"
              data={[...newData]}
            />
          }
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default StorageProvider;
