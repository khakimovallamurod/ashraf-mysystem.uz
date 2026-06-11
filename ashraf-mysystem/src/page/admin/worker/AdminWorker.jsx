import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useMemo, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainModal from "../../../components/common/modal/MainModal";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetAdminDepartmentQuery } from "../../../features/admin/department/adminDepartmentApiSlice";
import { useGetAdminWorkerQuery } from "../../../features/admin/worker/adminWorkerApiSlice";
import AdminAddWorkerModal from "./components/AdminAddWorkerModal";

function AdminWorker() {
  /* State */
  const [openAddWorkerModal, setOpenAddWorkerModal] = useState(false);

  /* API */
  const { data, isLoading, isError, refetch } = useGetAdminWorkerQuery();
  const { data: departmentData } = useGetAdminDepartmentQuery();

  const workerData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  const departmentsMap = useMemo(() => {
    if (departmentData?.success === true && Array.isArray(departmentData?.data)) {
      return departmentData.data.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {});
    }
    return {};
  }, [departmentData]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      sortType: "number",
    },
    {
      title: "FIO",
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
      title: "Balans",
      dataIndex: "balans",
      width: 150,
      sortType: "number",
      render: (balans) => <MainNumberFormat value={balans} />,
    },
    {
      title: "Oylik",
      dataIndex: "oylik_id",
      width: 150,
      sortType: "number",
      render: (oylik_id) => <MainNumberFormat value={oylik_id} />,
    },
    {
      title: "Bo'lim ID",
      dataIndex: "bulim_id",
      width: 160,
      sortType: "number",
      render: (bulim_id) => departmentsMap[bulim_id] || bulim_id || "—",
    },
    {
      title: "Chat ID",
      dataIndex: "chat_id",
      width: 170,
      sortType: "string",
    },
  ];

  /* MODAL */
  const handleOpenAddDepartmentModal = () => setOpenAddWorkerModal(true);
  const handleCloseAddDepartmentModal = () => setOpenAddWorkerModal(false);

  return (
    <>
      <MainModal
        open={openAddWorkerModal}
        onClose={handleCloseAddDepartmentModal}
      >
        <AdminAddWorkerModal onClose={handleCloseAddDepartmentModal} />
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
            Xodim qo'shish
          </Button>
        </div>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={workerData}
          customHeader={
            <ExportTable
              columns={columns}
              fileName="Ishchilar"
              data={[...workerData]}
            />
          }
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default AdminWorker;
