import React, { useMemo, useRef } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetUploaderReportQuery } from "../../../features/uploader/report/uploaderReportApiSlice";
import { formatFloatNumber } from "../../../util/formatFloatNumber";
import Section from "../../../components/common/section/Section";

import { v4 as uuidv4 } from "uuid";

function UploaderReport() {
  /* API */
  const { data, isLoading, isError, refetch } = useGetUploaderReportQuery();

  /* Memo */
  const reportData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data.map((item) => ({
        ...item,
        id: uuidv4(),
      }));
    }
    return [];
  }, [data]);

  const columns = [
    {
      title: "Mahsulot nomi",
      dataIndex: "product_name",
      width: 150,
      sortType: "string",
    },
    {
      title: "Massa (kg)",
      dataIndex: "massa",
      width: 150,
      sortType: "number",
      render: (_, { massa }) => (
        <MainNumberFormat value={formatFloatNumber(massa)} />
      ),
    },
  ];

  return (
    <div style={{ marginTop: "1rem", maxWidth: "400px", margin: "1rem auto" }}>
      <Section>
        <MainDataTable
          mobile={true}
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={reportData}
          refetch={refetch}
          pagination={false}
          scroll={{ x: 300 }}
        />
      </Section>
    </div>
  );
}

export default UploaderReport;
