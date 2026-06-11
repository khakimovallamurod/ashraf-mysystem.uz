import {
  Button,
  Empty,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import React, { useMemo, useRef, useState } from "react";

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import MainRefetchBtn from "../../../../components/common/refechBtn/MainRefetchBtn";
import {
  useAddGrindRegrindOrderCloseMutation,
  useGetGrindRegrindInProcessQuery,
} from "../../../../features/grindProduct/regrind/grindRegrindApiSlice";
import GrindOrderOutFormDrawer from "./GrindOrderOutFormDrawer";
import MainModal from "../../../../components/common/modal/MainModal";

function GrindRegrindProcess() {
  /* Ref */
  const ref = useRef(null);

  /* State */
  const [openProductModal, setOpenProductModal] = useState({
    open: false,
    productData: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "closeOrder";

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetGrindRegrindInProcessQuery();

  const [addCloseOrder] = useAddGrindRegrindOrderCloseMutation();

  /* Drawer */
  const handleOpenUploadOrderDrawer = (orderId) => {
    ref.current.onOpen(orderId);
  };

  /* Memo */
  const orderProductData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  /* Product modal */
  const handleOpenProductModal = (productData) => {
    if (productData && Array.isArray(productData) && productData?.length) {
      setOpenProductModal({
        open: true,
        productData: [...productData],
      });
    }
  };
  const handleCloseProductModal = () => {
    setOpenProductModal({
      open: false,
      productData: [],
    });
  };

  /* Handle close order */
  const handleCloseOrder = async (orderId) => {
    setIsSubmitting(true);
    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const data = {
        zayavka_id: orderId,
      };
      const resData = await addCloseOrder(data).unwrap();
      if (resData?.success === true) {
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
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        messageApi.open({
          key,
          type: "warning",
          content: `Ulanishda xatolik! Qaytadan urinib ko'ring!`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Columns */
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
        return <Tag color={"magenta-inverse"}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "izoh",
      dataIndex: "izoh",
      key: "izoh",
      width: 150,
    },
    {
      title: "Mahsulotlar",
      dataIndex: "product_list",
      key: "product_list",
      width: 150,
      render: (_, { product_list }) => (
        <Tooltip title="Mahsulotlarni ko'rish">
          <Button
            type="link"
            onClick={() => handleOpenProductModal(product_list)}
          >
            Mahsulotlar &nbsp;<b>{product_list?.length}</b>
          </Button>
        </Tooltip>
      ),
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
      width: 180,
      fixed: "right",
      render: ({ id }) => (
        <Space>
          <Tooltip title="Maydalashdan chiqarish">
            <Button
              size={"medium"}
              shape="rounded"
              icon={<CheckOutlined />}
              type="primary"
              onClick={() => handleOpenUploadOrderDrawer(id)}
            >
              Topshirish
            </Button>
          </Tooltip>
          <Tooltip title="Buyurtmani tugatish" placement="bottom">
            <Popconfirm
              title="Buyurtmani tugatish"
              description="Buyurtmani tugatmoqchimisiz?"
              okText="Albatta"
              cancelText="Yo'q"
              onConfirm={() => handleCloseOrder(id)}
              okButtonProps={{
                loading: isSubmitting,
              }}
              // onCancel={handleCancel}
            >
              <Button
                size={"medium"}
                shape="rounded"
                icon={<CloseOutlined />}
                type="primary"
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      {/* Products Modal */}
      <MainModal
        open={openProductModal?.open}
        onClose={handleCloseProductModal}
      >
        <Table
          columns={[
            {
              title: "ID",
              dataIndex: "product_id",
              key: "product_id",
            },
            {
              title: "Nomi",
              dataIndex: "product_name",
              key: "product_name",
            },
            {
              title: "Massa(kg)",
              dataIndex: "massa",
              key: "massa",
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (_, { status }) => {
                const color =
                  status === "new" ? "cyan-inverse" : "blue-inverse";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
              },
            },
          ]}
          rowKey={"product_id"}
          dataSource={openProductModal?.productData}
        />
      </MainModal>

      {/* Out product driver  */}
      <GrindOrderOutFormDrawer ref={ref} />

      <Table
        columns={columns}
        dataSource={orderProductData}
        loading={isLoading}
        scroll={{
          x: 1350,
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

export default GrindRegrindProcess;
