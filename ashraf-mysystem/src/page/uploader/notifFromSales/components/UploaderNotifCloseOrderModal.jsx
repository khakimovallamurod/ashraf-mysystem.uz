import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import MainModal from "../../../../components/common/modal/MainModal";
import MainNumberFormat from "../../../../components/common/numberFormat/MainNumberFormat";
import { useAddUploaderCloseOrderNotifItemMutation } from "../../../../features/uploader/notification/notifFromSales/uploaderNotifFromSalesApiSlice";

function SalesNotifCloseOrderModal(props, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenModal,
  }));
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [openMadal, setOpenModal] = useState({
    open: false,
    data: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const key = "closeOrder";

  /* API */
  const [addCloseOrder] = useAddUploaderCloseOrderNotifItemMutation();

  /* Modal */
  const handleOpenModal = (data) => {
    setOpenModal({
      open: true,
      data,
    });
  };

  const handleCloseModal = () => {
    setOpenModal({
      open: false,
      data: null,
    });
  };

  /* Handle Submit */
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
        sale_order_id: openMadal?.data?.id,
        sale_order_item_id: values?.productId,
        izoh: values?.comment,
      };
      const resData = await addCloseOrder(data).unwrap();
      if (resData?.success === true) {
        form.resetFields();
        setStatus("success");
        handleCloseModal();
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
      <MainModal open={openMadal?.open} onClose={handleCloseModal}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Mahsulot"
            name="productId"
            rules={[
              {
                required: true,
                message: "Mahsulot tanlang!",
              },
            ]}
            hasFeedback
            validateStatus={status}
          >
            <Select
              allowClear
              showSearch
              placeholder="Mahsulotni tanlash"
              loading={false}
              filterOption={(inputValue, option) =>
                option.searchOne
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0 ||
                option.searchTwo
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {openMadal.data?.product_list.map((option) => (
                <Select.Option
                  value={option.id}
                  key={option.id}
                  searchOne={option?.product_name}
                  searchTwo={option?.massa}
                >
                  {option?.product_name}{" "}
                  <b style={{ fontSize: "12px", opacity: 0.6 }}>
                    {<MainNumberFormat value={option?.massa} />}
                  </b>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={"comment"}
            rules={[
              {
                required: true,
                message: "Izoh talab qilinadi!",
              },
            ]}
            hasFeedback
            validateStatus={status}
          >
            <Input.TextArea
              allowClear
              showCount
              placeholder="Izoh kiritish"
              rows={6}
            />
          </Form.Item>

          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isSubmitting}
            >
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </MainModal>
    </>
  );
}

export default forwardRef(SalesNotifCloseOrderModal);
