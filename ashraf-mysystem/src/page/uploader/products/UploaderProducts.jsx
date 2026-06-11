import { message } from "antd";
import React, { useMemo } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetUploaderAllProductsQuery } from "../../../features/uploader/uploaderApiSlice";

function UploaderProducts() {
  /* API */
  const { data, isLoading, isError, refetch } =
    useGetUploaderAllProductsQuery();

  /* Memo */
  const tableData = useMemo(() => {
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
      sortType: "number",
    },
    {
      title: "Nomi",
      dataIndex: "name",
      key: "name",
      width: 150,
      sortType: "string",
    },
    {
      title: "Massa(kg)",
      dataIndex: "soni",
      key: "soni",
      width: 150,
      sortType: "number",
      render: (_, { soni }) => <MainNumberFormat value={soni} />,
    },
  ];

  return (
    <>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Section>
          <MainDataTable
            mobile={true}
            columns={columns}
            isLoading={isLoading}
            isError={isError}
            data={tableData}
            refetch={refetch}
            scroll={{x: 400}}
          />
        </Section>
      </div>
    </>
  );
}

export default UploaderProducts;
