import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Select, message } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import MainModal from "../../../components/common/modal/MainModal";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetAdminDepartmentQuery } from "../../../features/admin/department/adminDepartmentApiSlice";
import {
  useGetAdminPolkaByDepartMutation,
  useGetAdminPolkaQuery,
} from "../../../features/admin/polka/adminPolkaApiSlice";
import AdminAddPolkaModal from "./components/AdminAddPolkaModal";
import ExportTable from "../../../components/common/exportTable/ExportTable";

function AdminPolka() {
  /* State */
  const [openAddDepartmentModal, setOpenAddPolkaModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [polkaTableData, setPolkaTableData] = useState([]);

  /* API */
  const departmentRes = useGetAdminDepartmentQuery();
  const [getPolkaByDepartment] = useGetAdminPolkaByDepartMutation();
  const { data, isLoading, isError, refetch } = useGetAdminPolkaQuery();

  /* Memo */
  const departmentOptions = useMemo(() => {
    if (
      departmentRes?.data?.success === true &&
      departmentRes?.data?.data &&
      Array.isArray(departmentRes?.data?.data)
    ) {
      return departmentRes?.data.data;
    }
    return [];
  }, [departmentRes?.data]);

  useEffect(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      setPolkaTableData(
        data?.data.map((item) => ({ ...item, nagruzka: item.nagruzka || 0 }))
      );
    } else {
      setPolkaTableData([]);
    }
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
      title: "Bo'lim nomi",
      dataIndex: "bulim_name",
      key: "bulim_name",
      width: 150,
      sortType: "string",
    },
    {
      title: "Nagruzka",
      dataIndex: "nagruzka",
      key: "nagruzka",
      width: 150,
      sortType: "number",
    },
  ];

  /* MODAL */
  const handleOpenAddPolkaModal = () => setOpenAddPolkaModal(true);
  const handleCloseAddPolkaModal = () => setOpenAddPolkaModal(false);

  const handleGetPolkaByDepartment = async (departmentId) => {
    if (!departmentId) {
      if (data?.success === true && data?.data && Array.isArray(data?.data)) {
        setPolkaTableData(data?.data);
      }
      return;
    }
    /* Set Event */
    setIsSubmitting(true);
    try {
      const resData = await getPolkaByDepartment(departmentId).unwrap();
      if (resData?.success === true) {
        if (resData?.data && resData?.data.length) {
          setPolkaTableData(resData?.data);
        }
      } else if (resData?.success === false) {
        if (resData?.message) {
          message.error(resData?.message);
        }
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        message.warning(`Ulanishda xatolik! Qaytadan urinib ko'ring!`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MainModal
        open={openAddDepartmentModal}
        onClose={handleCloseAddPolkaModal}
      >
        <AdminAddPolkaModal
          departmentLoading={departmentRes?.isLoading}
          departmentOptions={departmentOptions}
        />
      </MainModal>

      <Section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
            gap: "0.5rem",
          }}
        >
          <div style={{ width: "300px" }}>
            <Select
              style={{ width: "100%" }}
              allowClear
              showSearch
              placeholder="Taminotchini tanlash"
              loading={departmentRes.isLoading}
              onChange={handleGetPolkaByDepartment}
              filterOption={(inputValue, option) =>
                option.children
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {departmentOptions.map((option) => (
                <Select.Option value={option.id} key={option.id}>
                  {option?.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenAddPolkaModal}
          >
            Polka qo'shish
          </Button>
        </div>

        <Divider />

        <MainDataTable
          columns={columns}
          isLoading={isLoading || isSubmitting}
          isError={isError}
          data={polkaTableData}
          refetch={refetch}
          customHeader={
            <ExportTable
              columns={columns}
              fileName="Polkalar"
              data={[...polkaTableData]}
            />
          }
        />
      </Section>
    </>
  );
}

export default AdminPolka;
