import { Tag } from "antd";
import React, { useMemo } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetGrindProductsSpareProductQuery } from "../../../features/grindProduct/GrindProductApiSlice";
import { formatFloatNumber } from "../../../util/formatFloatNumber";

function GrindProductSpareProduct() { 

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetGrindProductsSpareProductQuery();

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

  return (
    <>
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
            ],
          }}
        />
      </Section>
    </>
  );
}

export default GrindProductSpareProduct;
