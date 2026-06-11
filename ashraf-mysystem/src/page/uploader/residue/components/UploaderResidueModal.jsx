import React, {useMemo} from "react";
import {useGetAdminResidueMoreQuery} from "../../../../features/admin/residue/adminResidueApiSlice";
import validateApiResObjectArray from "../../../../util/validateApiResObjectArray";
import MainDataTable from "../../../../components/ui/dataTable/MainDataTable";
import {v4 as uuidv4} from "uuid";
import MainNumberFormat from "../../../../components/common/numberFormat/MainNumberFormat";

const columns = [
  {
    title: "Partiya nomer",
    dataIndex: "partiya_nomer",
    width: 150,
    sortType: "string",
  },
  {
    title: "Massa (kg)",
    dataIndex: "massa",
    width: 150,
    sortType: "number",
    render: (_, {massa}) => (
      <MainNumberFormat value={massa}/>
    ),
  },
];

function UploaderResidueModal({polkaId = null, productId = null}) {

  // Api
  const dataRes = useGetAdminResidueMoreQuery({polkaId, productId})

  // Data
  const [tableData, productName, total] = useMemo(() => {
    const validatedData = validateApiResObjectArray(dataRes, 'list');

    if (validatedData) {
      return [
        validatedData.map(item => ({
          ...item,
          key: uuidv4()
        })),
        dataRes.data?.data?.product,
        dataRes.data?.data?.jami,
      ]
    } else {
      return [
        [],
        '',
        0
      ]
    }

  }, [dataRes])

  return (
    <MainDataTable
      customHeader={
        <>
          <b>{productName}</b>
          {total} kg
        </>
      }
      mobile={true}
      columns={columns}
      isLoading={dataRes.isLoading}
      data={tableData}
      pagination={false}
      rowKey={"key"}
      scroll={{x: 300}}
    />
  )
}

export default UploaderResidueModal
