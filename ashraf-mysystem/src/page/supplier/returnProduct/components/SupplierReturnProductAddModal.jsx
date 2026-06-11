import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Select, Switch, message } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import MainModal from "../../../../components/common/modal/MainModal";
import MainInputMass from "../../../../components/ui/inputMass/MainInputMass";
import { useGetSuppplierCustomerQuery } from "../../../../features/supplier/debt/supplierDebtApiSlice";
import { useAddSupplierReturnProductMutation } from "../../../../features/supplier/returnProduct/supplierReturnProductApiSlice";
import { useGetSupplierProductsQuery } from "../../../../features/supplier/supplierApiSlice";
import removeComma from "../../../../util/removeComma";

function SupplierReturnProductAddModal(props, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenModal,
  }));
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [openModal, setOpenModal] = useState({
    open: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addReturnProduct";

  /* API */
  const customerRes = useGetSuppplierCustomerQuery();
  const productsRes = useGetSupplierProductsQuery();
  const [addData] = useAddSupplierReturnProductMutation();

  /* Memo */
  const customerOptions = useMemo(() => {
    if (
      customerRes?.data?.success === true &&
      customerRes?.data?.data &&
      Array.isArray(customerRes?.data?.data)
    ) {
      return customerRes?.data.data;
    }
    return [];
  }, [customerRes?.data]);

  const productsOptions = useMemo(() => {
    if (
      productsRes?.data?.success === true &&
      productsRes?.data?.data &&
      Array.isArray(productsRes?.data?.data)
    ) {
      return productsRes?.data.data;
    }
    return [];
  }, [productsRes?.data]);

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
        client_id: values?.customer,
        product_id: values?.product,
        massa: removeComma(values?.mass),
        paterya: values?.paterya||false,
      };
      const resData = await addData(data).unwrap();
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
  /* Modal */
  const handleOpenModal = () => setOpenModal({ open: true });
  const handleCloseModal = () => setOpenModal({ open: false });

  return (
    <>
      {contextHolder}
      <MainModal open={openModal?.open} onClose={handleCloseModal}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Customer */}
          <Form.Item
            label="Mijozni"
            name="customer"
            hasFeedback
            validateStatus={status}
            rules={[
              {
                required: true,
                message: "Mijozni talab qilinadi!",
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Mijozni tanlash"
              loading={customerRes?.isLoading}
              filterOption={(inputValue, option) =>
                option.searchOne
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0 ||
                option.searchTwo
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {customerOptions.map((option) => (
                <Select.Option
                  value={option.id}
                  key={option.id}
                  searchOne={option?.fio}
                  searchTwo={option?.telefon}
                >
                  {option?.fio}{" "}
                  <span style={{ opacity: 0.5 }}>
                    <b>{option?.korxona}</b>
                    {option?.telefon}
                  </span>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Products */}
          <Form.Item
            label="Mahsulot"
            name="product"
            hasFeedback
            validateStatus={status}
            rules={[
              {
                required: true,
                message: "Mahsulot talab qilinadi!",
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Mahsulotni tanlash"
              loading={productsRes?.isLoading}
              filterOption={(inputValue, option) =>
                option.searchOne
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0 ||
                option.searchTwo
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {productsOptions.map((option) => (
                <Select.Option
                  value={option.id}
                  key={option.id}
                  searchOne={option?.id}
                  searchTwo={option?.name}
                >
                  {option?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <MainInputMass status={status} />

          <Form.Item
            label="Pateriya"
            name="paterya"
            valuePropName="checked"
          >
            <Switch />
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

export default forwardRef(SupplierReturnProductAddModal);
