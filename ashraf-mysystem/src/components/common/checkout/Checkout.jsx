import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import MainLightTitle from "../../ui/title/MainLightTitle";
import MainModal from "../modal/MainModal";
import MainNumberFormat from "../numberFormat/MainNumberFormat";
import styles from "./checkout.module.css";

function Checkout({
  products,
  totalPrice = 0,
  onClose,
  onSuccess,
  form,
  addOrder,
  customerOptions,
  customerLoading,
  addCustomerModal,
}) {
  /* State */
  const [status, setStatus] = React.useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);
  const [currency, setCurrency] = useState({
    naqd: 0,
    plastik: 0,
    karta: 0,
    usd: 0,
    exchangeUsd: 0,
  });
  const [returnCurrency, setReturnCurrency] = useState("");
  const [repaymentDate, setRepaymentDate] = useState(null);

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "checkout";

  useEffect(() => {
    const data = { ...currency };
    /* Total */
    let total = 0;
    total += parseFloat(data.naqd || 0);
    total += parseFloat(data.plastik || 0);
    total += parseFloat(data.karta || 0);
    /* Exchange */
    const exchanged =
      parseFloat(data.usd || 0) * parseFloat(data.exchangeUsd || 0);
    total += exchanged || 0;
    setReturnCurrency(total - totalPrice);
  }, [currency, totalPrice]);

  const handleChange = (name, value) => {
    const data = { ...currency };

    data[name] = value;

    setCurrency({ ...data });
  };

  /* MODAL */
  const handleOpenAddCustomerModal = () => setOpenAddCustomerModal(true);
  const handleCloseAddCustomerModal = () => setOpenAddCustomerModal(false);

  /* Handle reset */
  const handleReset = () => {
    form.resetFields();
    setReturnCurrency("");
    setCurrency({
      naqd: 0,
      plastik: 0,
      karta: 0,
      usd: 0,
      exchangeUsd: 0,
    });
  };

  /* Handle submit */
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
        product_list: products.map((item) => ({
          product_id: item?.defaultProductData?.id,
          aritcle: item?.defaultProductData?.article,
          massa: item?.mass,
          price: item?.price,
        })),
        summa: totalPrice,
        naqd: values?.naqd,
        naqdusd: values?.usd,
        valyuta: values?.exchangeUsd,
        plastik: values?.plastik,
        karta: values?.karta,
        muddat: repaymentDate,
        izoh: values?.eslatma,
      };
      const resData = await addOrder(data).unwrap();
      if (resData?.success === true) {
        handleReset();
        onSuccess();

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

      {/* Add Customer modal */}
      <MainModal
        open={openAddCustomerModal}
        onClose={handleCloseAddCustomerModal}
      >
        {addCustomerModal}
      </MainModal>

      <Form
        onFinish={handleSubmit}
        autoComplete="off"
        layout="horizontal"
        form={form}
      >
        <MainLightTitle>To'lov</MainLightTitle>
        <Divider />
        <table style={{ width: "100%" }}>
          <tbody>
            <tr className={styles.tableRow}>
              <td className={styles.tableItem}>
                <b>Xaridor:</b>
              </td>
              <td>
                <Space.Compact block style={{ width: "100%" }}>
                  <Form.Item
                    name="customer"
                    rules={[
                      {
                        required: true,
                        message: "Xaridorni tanlang!",
                      },
                    ]}
                    style={{ width: "100%" }}
                    hasFeedback
                    validateStatus={status}
                  >
                    <Select
                      allowClear
                      showSearch
                      placeholder="Xaridorni tanlash"
                      loading={customerLoading}
                      filterOption={(inputValue, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }
                    >
                      {customerOptions.map((option) => (
                        <Select.Option value={option.id} key={option.id}>
                          {option?.fio}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="">
                    <Button
                      icon={<PlusOutlined />}
                      type="primary"
                      onClick={handleOpenAddCustomerModal}
                    >
                      {window.innerWidth > 725 ? "Qo'shish" : ""}
                    </Button>
                  </Form.Item>
                </Space.Compact>
              </td>
            </tr>
          </tbody>
        </table>

        <Divider style={{ margin: "1rem 0" }} />

        <table style={{ width: "100%" }}>
          <tbody>
            <tr className={styles.tableRow}>
              <td className={styles.tableItem}>
                <b>Summa:</b>
              </td>
              <td className={styles.tableItem}>
                <b>
                  <MainNumberFormat value={totalPrice} />
                  &nbsp;so'm
                </b>
              </td>
            </tr>
            <tr>
              <td className={styles.tableItem}>Naqd(uzs):</td>
              <td className={styles.tableItem}>
                <Form.Item
                  name="naqd"
                  rules={[
                    {
                      required: true,
                      message: "Naqd pulni kiritish talab qilinadi!",
                    },
                  ]}
                  hasFeedback
                  validateStatus={status}
                  initialValue={0}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="0"
                    onChange={(val) => handleChange("naqd", val)}
                  />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td className={styles.tableItem}>Plastik:</td>
              <td className={styles.tableItem}>
                <Form.Item
                  name="plastik"
                  rules={[
                    {
                      required: true,
                      message: "Plastik kiritish talab qilinadi!",
                    },
                  ]}
                  hasFeedback
                  validateStatus={status}
                  initialValue={0}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="0"
                    onChange={(val) => handleChange("plastik", val)}
                  />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td className={styles.tableItem}>Karta:</td>
              <td className={styles.tableItem}>
                <Form.Item
                  name="karta"
                  rules={[
                    {
                      required: true,
                      message: "Karta talab qilinadi!",
                    },
                  ]}
                  hasFeedback
                  validateStatus={status}
                  initialValue={0}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="0"
                    onChange={(val) => handleChange("karta", val)}
                  />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td className={styles.tableItem}>Naqd(usd):</td>
              <td className={styles.tableItem}>
                <Form.Item
                  name="usd"
                  rules={[
                    {
                      required: true,
                      message: "Naqd USD kiritish talab qilinadi!",
                    },
                  ]}
                  hasFeedback
                  validateStatus={status}
                  initialValue={0}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="0"
                    onChange={(val) => handleChange("usd", val)}
                  />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td className={styles.tableItem}>Valyuta kursi:</td>
              <td className={styles.tableItem}>
                <Form.Item
                  name="exchangeUsd"
                  rules={[
                    {
                      required: true,
                      message: "Valyuta kursini kiritish talab qilinadi!",
                    },
                  ]}
                  hasFeedback
                  validateStatus={status}
                  initialValue={0}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="0"
                    onChange={(val) => handleChange("exchangeUsd", val)}
                  />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td className={styles.tableItem}>Qarzni qaytarish muddati:</td>
              <td className={styles.tableItem}>
                <Form.Item
                  name="repayment"
                  rules={[
                    {
                      required: returnCurrency < 0,
                      message: "Muddat talab qilinadi!",
                    },
                  ]}
                  hasFeedback
                  validateStatus={status}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="0000-00-00"
                    onChange={(_, val) => setRepaymentDate(val)}
                  />
                </Form.Item>
              </td>
            </tr>
          </tbody>
        </table>

        <Divider />

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "1rem",
          }}
        >
          <tbody>
            <tr className={styles.tableRow}>
              <td className={styles.tableItem}>Qarz(uzs):</td>
              <td className={styles.tableItem}>
                <Tag color={returnCurrency < 0 ? "red" : "green"}>
                  <MainNumberFormat
                    value={returnCurrency >= 0 ? 0 : returnCurrency}
                  />
                  &nbsp;so'm
                </Tag>
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={styles.tableItem}>Qaytim(uzs):</td>
              <td className={styles.tableItem}>
                <MainNumberFormat
                  value={returnCurrency < 0 ? 0 : returnCurrency}
                />
                &nbsp;so'm
              </td>
            </tr>
          </tbody>
        </table>

        <Typography.Text strong>
          Eslatma <span style={{ opacity: 0.5 }}>(agar joiz bo'lsa)</span>
        </Typography.Text>
        <Form.Item name={"eslatma"} hasFeedback validateStatus={status}>
          <Input.TextArea
            allowClear
            showCount
            placeholder="Izoh kiritish"
            rows={6}
          />
        </Form.Item>
        <Form.Item style={{ width: "100%" }}>
          <div style={{ width: "100%", display: "flex", gap: "1rem" }}>
            <Button
              style={{ width: "100%" }}
              type="primary"
              icon={<CloseOutlined />}
              danger
              disabled={isSubmitting}
              onClick={onClose}
            >
              Bekor qilish
            </Button>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              loading={isSubmitting}
            >
              Saqlash
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
}

export default Checkout;
