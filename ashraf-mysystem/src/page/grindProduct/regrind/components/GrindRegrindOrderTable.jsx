import {
  Button,
  Empty,
  Form,
  Select,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import React, { useMemo, useState } from "react";

import { CarryOutOutlined, ReloadOutlined } from "@ant-design/icons";
import MainModal from "../../../../components/common/modal/MainModal";
import MainRefetchBtn from "../../../../components/common/refechBtn/MainRefetchBtn";
import {
  useAddGrindRegrindConfirmMutation,
  useGetGrindRegrindQuery,
} from "../../../../features/grindProduct/regrind/grindRegrindApiSlice";
import { useGetGrindWorkersQuery } from "../../../../features/grindProduct/order/grindOrderStorageApiSlice";

function GrindRegrindOrderTable() {
  /* Form */
  const [form] = Form.useForm();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "confirmOrder";

  /* Status */
  const [openConfirmModal, setOpenConfirmModal] = useState({
    open: false,
    orderId: null,
  });

  /* API */
  const { data, isLoading, isError, refetch } = useGetGrindRegrindQuery();
  const [addConfirm] = useAddGrindRegrindConfirmMutation();
  const workersRes = useGetGrindWorkersQuery(null);

  /* Memo */
  const workersOptions = useMemo(() => {
    if (
      workersRes?.data?.success === true &&
      workersRes?.data?.data &&
      workersRes?.data?.data?.length
    ) {
      return workersRes?.data?.data;
    }
    return [];
  }, [workersRes]);

  /* Modal */
  const handleOpenConfirmModal = (orderId) => {
    setOpenConfirmModal({
      open: true,
      orderId,
    });
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal({
      open: false,
      orderId: null,
    });
  };

  const orderProductData = useMemo(() => {
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
    },
    {
      title: "partiyanomer",
      dataIndex: "partiyanomer",
      key: "partiyanomer",
      width: 150,
    },
    {
      title: "yuklovchi",
      dataIndex: "yuklovchi",
      key: "yuklovchi",
      width: 150,
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        return <Tag color={"cyan-inverse"}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "izoh",
      dataIndex: "izoh",
      key: "izoh",
      width: 150,
    },
    {
      title: "sana",
      dataIndex: "sana",
      key: "sana",
      width: 150,
    },
    {
      title: "Amal",
      key: "operation",
      width: 50,
      fixed: "right",
      render: ({ id }) => (
        <Tooltip title="Qabul qilish">
          <Button
            size={"large"}
            shape="rounded"
            icon={<CarryOutOutlined />}
            type="primary"
            onClick={() => handleOpenConfirmModal(id)}
          />
        </Tooltip>
      ),
    },
  ];

  /* Handle confirm order */
  const handleConfirmOrder = async (values) => {
    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const data = {
        workers: values?.workers
          ? values.workers?.map((item) => ({ worker_id: item }))
          : [],
      };
      const resData = await addConfirm({
        orderId: openConfirmModal?.orderId,
        body: data,
      }).unwrap();

      if (resData?.success === true) {
        handleCloseConfirmModal();
        if (resData?.message) {
          messageApi.open({
            key,
            type: "success",
            content: resData?.message,
          });
        }
      } else if (resData?.success === false) {
        if (resData?.message) {
          messageApi.open({
            key,
            type: "error",
            content: resData?.message,
          });
        }
      }
      setTimeout(() => {}, 2000);
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        messageApi.open({
          key,
          type: "warning",
          content: `Ulanishda xatolik! Qaytadan urinib ko'ring!`,
        });
      }
    }
  };

  return (
    <>
      {contextHolder}

      <MainModal open={openConfirmModal.open} onClose={handleCloseConfirmModal}>
        <Form form={form} layout="vertical" onFinish={handleConfirmOrder}>
          <Form.Item label="Ishchi tanlash" name="workers">
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Ishchini tanlash"
              loading={workersRes.isLoading}
              filterOption={(inputValue, option) =>
                option.children
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {workersOptions.map((option) => (
                <Select.Option value={option?.id} key={option?.id}>
                  {option?.fio}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Qabul qilish
            </Button>
          </Form.Item>
        </Form>
      </MainModal>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1.2rem",
        }}
      >
        <Button icon={<ReloadOutlined />} type="primary" onClick={refetch}>
          Yangilash
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={orderProductData}
        loading={isLoading}
        scroll={{
          x: 1200,
          // y: 500,
        }}
        locale={{
          emptyText: () => {
            if (isError && !isLoading) {
              return <MainRefetchBtn refetch={refetch} />;
            } else {
              return <Empty />;
            }
          },
        }}
        rowKey={"id"}
      />
    </>
  );
}

export default GrindRegrindOrderTable;
