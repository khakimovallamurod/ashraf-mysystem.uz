import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import React, { useMemo, useState } from "react";
import MainModal from "../../../components/common/modal/MainModal";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetAdminDepartmentQuery } from "../../../features/admin/department/adminDepartmentApiSlice";
import AdminAddDepartmentModal from "./components/AdminAddDepartmentModal";
import ExportTable from "../../../components/common/exportTable/ExportTable";

function AdminDepartment() {
  const [openAddDepartmentModal, setOpenAddDepartmentModal] = useState(false);

  /* API */
  const { data, isLoading, isError, refetch } = useGetAdminDepartmentQuery();

  const departmentData = useMemo(() => {
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
        <AdminAddDepartmentModal />
      </MainModal>

      <Section style={{maxWidth: 600, margin:'auto'}}>
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
            Bo'lim qo'shish
          </Button>
        </div>

        <Divider />

        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={departmentData}
          scroll={{x: 500}}
          customHeader={
            <ExportTable
              columns={columns}
              fileName="Bo'limlar"
              data={[...departmentData]}
            />
          }
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default AdminDepartment;
