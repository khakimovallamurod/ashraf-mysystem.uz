import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useMemo, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainModal from "../../../components/common/modal/MainModal";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetAdminCustomerCategoryQuery } from "../../../features/admin/customerCategory/adminCustomerCategoryApiSlice";
import AdminAddCustomerCategoryModal from "./components/AdminAddCustomerCategoryModal";

function AdminCustomerCategory() {
  /* State */
  const [openAddDepartmentModal, setOpenAddDepartmentModal] = useState(false);

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetAdminCustomerCategoryQuery();

  const customerCategoryData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      sortType: "number",
    },
    {
      title: "Nomi",
      dataIndex: "name",
      width: 150,
      sortType: "string",
    },
  ];

  /* MODAL */
  const handleOpenAddDepartmentModal = () => setOpenAddDepartmentModal(true);
  const handleCloseAddDepartmentModal = () => setOpenAddDepartmentModal(false);

  return (
    <>
      <MainModal
        open={openAddDepartmentModal}
        onClose={handleCloseAddDepartmentModal}
      >
        <AdminAddCustomerCategoryModal />
      </MainModal>

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
            onClick={handleOpenAddDepartmentModal}
          >
            Toifa qo'shish
          </Button>
        </div>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={customerCategoryData}
          customHeader={
            <ExportTable
              columns={columns}
              fileName="Mijoz tariflari"
              data={[...customerCategoryData]}
            />
          }
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default AdminCustomerCategory;
