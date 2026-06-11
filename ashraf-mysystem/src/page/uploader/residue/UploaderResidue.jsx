import React, { useMemo, useState } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetAdminResidueQuery } from "../../../features/admin/residue/adminResidueApiSlice";
import { formatFloatNumber } from "../../../util/formatFloatNumber";
import validateApiResObjectArray from "../../../util/validateApiResObjectArray";

function UploaderResidue() {
  // State
  const [openModal, setOpenModal] = useState({
    open: false,
    data: {
      polkaId: null,
      productId: null,
    },
  });

  // Api
  const dataRes = useGetAdminResidueQuery();

  // table data
  const tableData = useMemo(() => {
    return validateApiResObjectArray(dataRes, "ostatka");
  }, [dataRes]);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      width: 150,
      sortType: "string",
    },
    {
      title: "Joy",
      dataIndex: "name",
      width: 150,
      sortType: "string",
    },
    {
      title: "Bo'lim nomi",
      dataIndex: "bulim_name",
      width: 150,
      sortType: "string",
    },
    {
      title: "Massa (kg)",
      dataIndex: "nagruzka",
      width: 150,
      sortType: "number",
      render: (_, { nagruzka }) => (
        <MainNumberFormat value={formatFloatNumber(nagruzka)} />
      ),
    },
  ];

  // Modal
  const onOpenModal = (polkaId, productId) =>
    setOpenModal({ open: true, data: { polkaId, productId } });
  const onCloseModal = () =>
    setOpenModal({
      open: false,
      data: {
        polkaId: null,
        productId: null,
      },
    });

  return (
    <>
      {/* <MainModal open={openModal.open} onClose={onCloseModal}>
        <UploaderResidueModal {...openModal.data} />
      </MainModal> */}

      <Section>
        <MainDataTable
          mobile={true}
          columns={columns}
          isLoading={dataRes.isLoading}
          data={tableData}
          pagination={false}
          key={"product_id"}
          scroll={{ x: 300 }}
          expandableTableCurrent={{
            expandedRowRender: (record) => (
              <div style={{ maxWidth: 500, margin: "auto" }}>
                <MainDataTable
                  tableHeaderHidden={true}
                  customHeader={false}
                  data={record?.mahsulotlar}
                  scroll={{ x: 400 }}
                  rowKey={"product_id"}
                  columns={[
                    {
                      title: "Mahsulot nomi",
                      dataIndex: "product_name",
                    },
                    {
                      title: "Massa",
                      dataIndex: "massa",
                      render: (_, { massa }) => (
                        <MainNumberFormat value={massa} />
                      ),
                    },
                    // {
                    //   title: "Amal",
                    //   dataIndex: "operation",
                    //   render: (_, {product_id}) => (
                    //     <Button
                    //       icon={<EyeOutlined/>} type={'primary'}
                    //       onClick={() => onOpenModal(record.id, product_id)}
                    //     />
                    //   )
                    // },
                  ]}
                />
              </div>
            ),
          }}
        />
      </Section>
    </>
  );
}

export default UploaderResidue;
