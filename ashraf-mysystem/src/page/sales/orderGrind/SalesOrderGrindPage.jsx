import React, { useMemo, useRef } from "react";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetSalesProductsQuery } from "../../../features/sales/salesApiSlice";
import Section from "../../../components/common/section/Section";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SalesAddOrderGrindModal from "./components/SalesAddOrderGrindModal";
import { useSelector } from "react-redux";
import { selectSalesOrderAllProductsGrind } from "../../../features/sales/salesSlice";

function SalesOrderGrindPage() {
  /* Ref */
  const addOrderModalRef = useRef(null);

  /* Selector */
  const selectedRowItems = useSelector(selectSalesOrderAllProductsGrind);

  /* Modal */
  const handleOpenOrderModal = (data) => {
    addOrderModalRef.current.onOpen(data);
  };

  /* Table */
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      sortType: "number",
    },
    {
      title: "Nomi",
      dataIndex: "title",
      width: 150,
      sortType: "string",
    },
    {
      title: "Massa",
      dataIndex: "mass",
      width: 150,
      sortType: "number",
    },
    // {
    //   title: "Amal",
    //   key: "operation",
    //   width: 60,
    //   render: ({ id }, data) => (
    //     <Button
    //       icon={<PlusOutlined />}
    //       type="primary"
    //       onClick={() => handleOpenOrderModal(data)}
    //       size="small"
    //       disabled={selectedRowItems.find((item) => item.id === id)}
    //     />
    //   ),
    // },
  ];

  /* API */
  const { data, isLoading, isError, refetch } = useGetSalesProductsQuery();

  /* Api data */
  const productsData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data?.data.map((item) => {
        return {
          id: item?.id,
          title: item?.name,
          price: item?.price,
          count: item?.soni,
          category_id: item?.category_id,
          mass: item?.soni,
        };
      });
    }
    return [];
  }, [data]);

  return (
    <>
      <SalesAddOrderGrindModal ref={addOrderModalRef} />

      <Section>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={productsData}
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default SalesOrderGrindPage;
