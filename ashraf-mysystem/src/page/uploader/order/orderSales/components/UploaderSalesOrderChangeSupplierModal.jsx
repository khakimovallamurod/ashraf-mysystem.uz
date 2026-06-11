import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Select, message } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import MainModal from "../../../../../components/common/modal/MainModal";
import { useGetSalesSupplierQuery } from "../../../../../features/sales/customer/salesCustomerApiSlice";
import { usePutUploaderOrderSalesChangeOrderSupplierMutation } from "../../../../../features/uploader/order/orderOfSales/uploaderOrderOfSalesApiSlice";

function UploaderSalesOrderChangeSupplierModal({refetch}, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenModal,
  }));
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [openModal, setOpenModal] = useState({
    open: false,
    data: {
      orderId: null,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* API */
  const supplierRes = useGetSalesSupplierQuery();
  const [putChangeSupplier] =
    usePutUploaderOrderSalesChangeOrderSupplierMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  // Customer category options
  const supplierOptions = useMemo(() => {
    if (
      supplierRes.data?.success === true &&
      supplierRes.data?.data &&
      Array.isArray(supplierRes.data?.data)
    ) {
      return supplierRes.data.data;
    }
    return [];
  }, [supplierRes.data]);

  /* Modal */
  const handleOpenModal = (orderId) => {
    setOpenModal({
      open: true,
      data: {
        orderId,
      },
    });
  };
  const handleCloseModal = () =>
    setOpenModal({
      open: false,
      data: {
        orderId: null,
      },
    });

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
        dostavka_id: values.supplier,
      };
      let resData = await putChangeSupplier({
        orderId: openModal.data?.orderId,
        body: data,
      }).unwrap();

      if (resData?.success === true) {
        refetch();
        
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

      <MainModal open={openModal.open} onClose={handleCloseModal}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label={"Dostavkachi"}
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
              loading={supplierRes?.isLoading}
              filterOption={(inputValue, option) =>
                option.children
                  .toLowerCase()
                  .indexOf(inputValue?.toLowerCase()) >= 0
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
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </MainModal>
    </>
  );
}

export default forwardRef(UploaderSalesOrderChangeSupplierModal);
