import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Empty, Space, Table, Tooltip, message } from "antd";
import React, { useMemo, useRef } from "react";
import MainRefetchBtn from "../../../../components/common/refechBtn/MainRefetchBtn";
import {
  useAddUploaderRegrindConfirmMutation,
  useGetUploaderRegrindListQuery,
} from "../../../../features/uploader/regrind/uploaderRegrindApiSlice";

function UploaderRegrindTable() {
  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "confirmOrder";

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetUploaderRegrindListQuery();
  const [addConfirmOrder] = useAddUploaderRegrindConfirmMutation();

  /* Form */
  const grindedProductData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  /* Modal */
  const handleConfirmOrder = async (orderId) => {
    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const resData = await addConfirmOrder(orderId).unwrap();
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
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Mahsulot nomi",
      dataIndex: "product_name",
      key: "product_name",
      width: 150,
    },
    {
      title: "Massa",
      dataIndex: "massa",
      key: "massa",
      width: 150,
    },
    {
      title: "Maydalovchi",
      dataIndex: "maydalovchi",
      key: "maydalovchi",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
    },
    {
      title: "Sana",
      dataIndex: "sana",
      key: "sana",
      width: 150,
    },
    {
      title: "Amal",
      key: "operation",
      width: 80,
      fixed: "right",
      render: ({ id }) => (
        <Space style={{ justifyContent: "center!important", width: "100%" }}>
          <Tooltip title="Qabul qilish">
            <Button
              size={"large"}
              shape="circle"
              icon={<DownloadOutlined />}
              type="primary"
              onClick={() => handleConfirmOrder(id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <>
      {contextHolder}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1.2rem",
        }}
      >
        <Button
          icon={<ReloadOutlined />}
          type="primary"
          onClick={refetch}
          loading={isLoading}
        >
          Yangilash
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={grindedProductData}
        loading={isLoading}
        scroll={{
          x: 400,
          y: 700,
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

export default UploaderRegrindTable;
