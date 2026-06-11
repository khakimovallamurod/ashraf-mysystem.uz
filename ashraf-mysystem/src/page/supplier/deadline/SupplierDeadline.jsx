import React, {useMemo, useState} from "react";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import {useGetSupplierDeadlineQuery} from "../../../features/supplier/deadline/supplierDeadlineApiSlice";
import MainModal from "../../../components/common/modal/MainModal";
import {Button, Space} from "antd";
import SupplierDeadlineCloseModal from "./components/SupplierDeadlineCloseModal";
import {ClockCircleOutlined, PlusOutlined} from "@ant-design/icons";
import ChangeDeadlineModal from "./components/ChangeDeadlineModal";
import ChangeDeadlineConfirmSmsModal from "./components/ChangeDeadlineConfirmSmsModal";

function SupplierDeadline() {
  // State
  const [openModal, setOpenModal] = useState({
    open: false,
    deadlineId: null,
  });
  const [openDeadlineModal, setOpenDeadlineModal] = useState({
    open: false,
    data: {
      id: null
    }
  });
  const [activeConfirmSms, setActiveConfirmSms] = useState(false)

  /* API */
  const {data, isLoading, isError, refetch} = useGetSupplierDeadlineQuery();

  const supplierDeadlineData = useMemo(() => {
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
      title: "Mijoz",
      dataIndex: "client",
      width: 150,
      sortType: "string",
    },
    {
      title: "Mijoz telefon",
      dataIndex: "client_telefon",
      width: 150,
      sortType: "string",
    },
    {
      title: "Beriladigan summa",
      dataIndex: "berishi_kerak_summa",
      width: 150,
      sortType: "number",
    },
    {
      title: "Qarz",
      dataIndex: "qarz",
      width: 150,
      sortType: "number",
    },
    {
      title: "Amal",
      dataIndex: "operation",
      width: 100,
      align: "right",
      render: (_, {id}) => (
        <Space>
          <Button
            type={'text'}
            icon={<ClockCircleOutlined/>}
            danger
            size={"small"}
            shape={'round'}
            onClick={() => handleOpenDeadlineModal(id)}
          />
          <Button
            type="primary"
            size="small"
            shape="round"
            onClick={() => handleOpen(id)}
          >
            Yopish
          </Button>
        </Space>
      ),
    },
  ];

  // Modal
  const handleOpen = (id) => setOpenModal({open: true, deadlineId: id});
  const handleClose = () => setOpenModal({open: false, deadlineId: null});

  // Change deadline modal
  const handleOpenDeadlineModal = (id) => setOpenDeadlineModal({
    open: true,
    data: {
      id
    }
  })
  const handleCloseDeadlineModal = () => setOpenDeadlineModal({
    open: false,
    data: {
      id: null
    }
  })

  // Confirm closed

  return (
    <>
      {/*Close modal*/}
      <MainModal open={openModal.open} onClose={handleClose} title={'Muddatni yopish'}>
        <SupplierDeadlineCloseModal orderId={openModal.deadlineId}/>
      </MainModal>

      {/*Change deadline modal*/}
      <MainModal open={openDeadlineModal.open} onClose={handleCloseDeadlineModal} width={300}>
        {!activeConfirmSms ? (
          <ChangeDeadlineModal onShowConfirmSms={setActiveConfirmSms} id={openDeadlineModal.data.id}/>
        ) : (
          <ChangeDeadlineConfirmSmsModal id={openDeadlineModal.data.id} onClose={handleCloseDeadlineModal}/>
        )}
      </MainModal>

      <Section style={{marginTop: "1rem"}}>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={supplierDeadlineData}
          customHeader={
            <ExportTable
              columns={columns}
              fileName="Muddatlar"
              data={[...supplierDeadlineData]}
            />
          }
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default SupplierDeadline;
