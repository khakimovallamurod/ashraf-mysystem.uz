import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import React, { useMemo, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainModal from "../../../components/common/modal/MainModal";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetAdminExpensesCategoryQuery } from "../../../features/admin/expensesCategory/adminExpensesCategoryApiSlice";
import AdminAddExpensesCategoryModal from "./components/AdminAddExpensesCategoryModal";

function AdminExpensesCategory() {
  const [openAddDepartmentModal, setOpenAddDepartmentModal] = useState(false);

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetAdminExpensesCategoryQuery();

  const expensesCategoryData = useMemo(() => {
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
        <AdminAddExpensesCategoryModal />
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

        <Divider />

        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={expensesCategoryData}
          customHeader={
            <ExportTable
              columns={columns}
              fileName="Xarajat turi"
              data={[...expensesCategoryData]}
            />
          }
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default AdminExpensesCategory;
