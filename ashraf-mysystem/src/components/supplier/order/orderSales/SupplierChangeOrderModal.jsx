import { Button, Form, Select, message } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  useAddSupplierChangeOrderMutation,
  useGetSupplierAllQuery,
} from "../../../../features/supplier/changeOrder/supplierChangeOrderApiSlice";
import MainModal from "../../../common/modal/MainModal";
import { SaveOutlined } from "@ant-design/icons";

function SupplierChangeOrderModal(props, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenModal,
  }));

  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [openModal, setOpenModal] = useState({
    open: false,
    orderId: null,
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* API */
  const supplierDataRes = useGetSupplierAllQuery();
  const [addChangeOrder] = useAddSupplierChangeOrderMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "changeOrder";

  /* Memo */
  const supplierOptions = useMemo(() => {
    if (
      supplierDataRes?.data?.success === true &&
      supplierDataRes?.data?.data &&
      Array.isArray(supplierDataRes?.data?.data)
    ) {
      return supplierDataRes?.data.data;
    }
    return [];
  }, [supplierDataRes?.data]);

  /* Modal */
  const handleOpenModal = (orderId) => {
    setOpenModal({
      open: true,
      orderId,
    });
  };

  const handleCloseModal = () => {
    setOpenModal({
      open: false,
      orderId: null,
    });
  };

  /* Submit */
  const handleSubmit = async (values) => {
    /* Set Event */
    setIsSubmitting(true);
    /* Set status */
    setStatus("validating");
    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const data = {
        order_id: openModal?.orderId,
        dostavka_id: values?.supplier,
      };
      const resData = await addChangeOrder(data).unwrap();
      if (resData?.success === true) {
        form.resetFields();
        setStatus("success");
        if (resData?.message) {
          messageApi.open({
            key,
            type: "success",
            content: resData?.message,
          });
        }
      } else if (resData?.success === false) {
        setStatus("error");
        if (resData?.message) {
          messageApi.open({
            key,
            type: "error",
            content: resData?.message,
          });
        }
      }
      setTimeout(() => {
        setStatus("");
      }, 2000);
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        setStatus("warning");
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

  return (
    <>
      {contextHolder}

      {/* Change order Modal */}
      <MainModal open={openModal?.open} onClose={handleCloseModal}>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="supplier"
            rules={[
              {
                required: true,
                message: "Dostavkachini tanlang!",
              },
            ]}
            style={{ width: "100%" }}
            hasFeedback
            validateStatus={status}
          >
            <Select
              allowClear
              showSearch
              placeholder="Dostavkachini tanlash"
              loading={supplierDataRes?.isLoading}
              filterOption={(inputValue, option) =>
                option.children
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {supplierOptions.map((option) => (
                <Select.Option value={option.id} key={option.id}>
                  {option?.dostavchik}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isSubmitting}
            >
              Buyurtmani almashtirish
            </Button>
          </Form.Item>
        </Form>
      </MainModal>
    </>
  );
}

export default forwardRef(SupplierChangeOrderModal);
