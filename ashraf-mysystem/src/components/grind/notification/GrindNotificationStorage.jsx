import { BellOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Divider,
  Form,
  List,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { memo, useEffect, useMemo, useState } from "react";
import {
  useGetGrindNotifListFromStorageQuery,
  useGetGrindNotifMessageFromStorageQuery,
} from "../../../features/grindProduct/notification/grindNotificationApiSlice";
import {
  useAddGrindOrderStorageConfirmMutation,
  useGetGrindWorkersQuery,
} from "../../../features/grindProduct/order/grindOrderStorageApiSlice";
import MainNotificationDrawer from "../../common/drawer/MainNotificationDrawer";
import MainModal from "../../common/modal/MainModal";
import { REFETCH_NOTIF_TIME } from "../../../util/const";
const { Text } = Typography;

function GrindNotificationStorage({ setSoundPlay, notificationApi }) {
  const [form] = Form.useForm();

  /* Message */
  const [messageApi, messContextHolder] = message.useMessage();
  const key = "confirmOrderGrind";

  /* State */
  const [openDrawerSales, setOpenDrawerStorage] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState({
    open: false,
    notifData: null,
  });

  /* API */
  const notifStorageRes = useGetGrindNotifMessageFromStorageQuery(null, {
    pollingInterval: REFETCH_NOTIF_TIME,
  });
  const notifListStorageRes = useGetGrindNotifListFromStorageQuery(null, {
    pollingInterval: REFETCH_NOTIF_TIME,
  });
  const workersRes = useGetGrindWorkersQuery(null);
  const [addConfirmOrderStorage] = useAddGrindOrderStorageConfirmMutation();

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

  /* Drawer */
  const handleOpenNotifStorage = () => setOpenDrawerStorage(true);
  const handleCloseNotifStorage = () => setOpenDrawerStorage(false);

  /* Handle notification sound */
  useEffect(() => {
    if (notifStorageRes?.data?.n > 0) setSoundPlay(true);
    else setSoundPlay(false);
  }, [notifStorageRes?.data?.n, setSoundPlay]);

  /* Notification */
  useEffect(() => {
    if (notifStorageRes.isLoading) return;
    if (notifStorageRes.data?.message) {
      const value = notifStorageRes.data?.message;
      notificationApi.info({
        message: `Saqlash bo'limidan`,
        description: value,
        placement: "bottomRight",
        duration: 4,
      });
    }
  }, [notificationApi, notifStorageRes.data, notifStorageRes.isLoading]);

  /* Notifcation count */
  const notifCountOfStorageProduct = useMemo(() => {
    if (notifStorageRes.isLoading) return;

    return parseInt(notifStorageRes?.data?.n) || 0;
  }, [notifStorageRes]);
  const notifListStorage = useMemo(() => {
    if (
      notifListStorageRes?.data?.success === true &&
      notifListStorageRes?.data?.data?.length
    ) {
      return notifListStorageRes.data.data;
    }
    return [];
  }, [notifListStorageRes]);

  /* Modal */
  const handleOpenConfirmModal = (notifData) => {
    handleCloseNotifStorage();
    setOpenConfirmModal({ open: true, notifData });
  };
  const handleCloseConfirmModal = () =>
    setOpenConfirmModal({ open: false, notifData: null });

  /* Handle confirm submit */
  const handleSubmitConfirmOrder = async (values) => {
    messageApi.open({
      key: key,
      type: "loading",
      content: "Loading...",
    });

    try {
      const data = {
        workers: values?.workers
          ? values.workers?.map((item) => ({ worker_id: item }))
          : [],
      };
      const resData = await addConfirmOrderStorage({
        id: openConfirmModal.notifData?.id,
        body: data,
      }).unwrap();

      if (resData?.success === true) {
        handleCloseConfirmModal();
        form.resetFields();
        if (resData?.message) {
          messageApi.open({
            key: key,
            type: "success",
            content: resData?.message,
            duration: 2,
          });
        }
      } else if (resData?.success === false) {
        if (resData?.message) {
          messageApi.open({
            key: key,
            type: "error",
            content: resData?.message,
            duration: 2,
          });
        }
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        messageApi.open({
          key: key,
          type: "warning",
          content: "Ulanishda xatolik! Qaytadan urinib ko'ring!",
          duration: 2,
        });
      }
    }
  };

  return (
    <>
      {messContextHolder}
      {/* Order confirm modal */}
      <MainModal open={openConfirmModal.open} onClose={handleCloseConfirmModal}>
        <List size="small">
          <List.Item>
            <b>Yuklovchi:</b>
            <b>{openConfirmModal.notifData?.yuklovchi}</b>
          </List.Item>
          <List.Item>
            <span>Massa:</span>
            <span>{openConfirmModal.notifData?.massa}</span>
          </List.Item>
          <List.Item>
            <span>Haqiqiy massa:</span>
            <span>{openConfirmModal.notifData?.realmassa}</span>
          </List.Item>
          <List.Item>
            <span>Sana:</span>
            <b>{openConfirmModal.notifData?.sana}</b>
          </List.Item>
          <List.Item>
            <span>Status:</span>
            <Tag color="blue-inverse">{openConfirmModal.notifData?.status}</Tag>
          </List.Item>
        </List>
        <Divider orientation="left">
          <Text disabled>Tasdiqlash</Text>
        </Divider>
        <Form form={form} layout="vertical" onFinish={handleSubmitConfirmOrder}>
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

      <Tooltip title="Saqlash">
        <Badge count={notifCountOfStorageProduct} size="small">
          <Button icon={<BellOutlined />} onClick={handleOpenNotifStorage} />
        </Badge>
      </Tooltip>

      <MainNotificationDrawer
        open={openDrawerSales}
        onClose={handleCloseNotifStorage}
      >
        <List
          itemLayout="horizontal"
          size="small"
          header={<Text style={{ padding: "0 1rem" }}>Sotuv bo'limidan</Text>}
          dataSource={notifListStorage}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: "pointer" }}
              onClick={() => handleOpenConfirmModal(item)}
            >
              <List.Item.Meta
                title={`Yuklovchi: ${item?.yuklovchi || "Noma'lum"}`}
                description={
                  <>
                    <p>
                      Massa: <b>{item?.massa}</b>kg
                    </p>
                    <p>
                      Haqiqiy massa: <b>{item?.realmassa}</b>kg
                    </p>
                    <p>Vaqti: {item?.sana}</p>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </MainNotificationDrawer>
    </>
  );
}

export default memo(GrindNotificationStorage);
