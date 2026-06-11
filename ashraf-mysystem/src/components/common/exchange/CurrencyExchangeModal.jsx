import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckOutlined,
  CloseOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Form, Input, Select, Tag, message } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import { useAddCashierBalanceChangeMutation } from "../../../features/cashier/balance/cashierBalanceApiSlice";
import { CASHIER_EXCHANGE_HISTORY_ROUTE } from "../../../util/path";
import removeComma from "../../../util/removeComma";

const selectOptions = [
  {
    label: "Karta",
    value: "karta",
  },
  {
    label: "Naqd so'm",
    value: "naqdsum",
  },
  {
    label: "Naqd usd",
    value: "naqdusd",
  },
  {
    label: "Bank",
    value: "bank",
  },
];

function CurrencyExchangeModal(props, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenDrawer,
  }));

  /* Form */
  const [form] = Form.useForm();

  /* Navigate */
  const navigate = useNavigate();

  /* State */
  const [openDrawer, setOpenDrawer] = useState(false);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");

  /* API */
  const [addChangeBalans] = useAddCashierBalanceChangeMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "changeBalans";

  /* Modal */
  const handleOpenDrawer = () => setOpenDrawer(true);
  const handleCloseDrawer = () => setOpenDrawer(false);

  const handleCancel = () => {
    form.resetFields();
    handleCloseDrawer();
    setStatus("");
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
        chiquvchi_hisob: values?.chiquvchi_hisob,
        kiruvchi_hisob: values?.kiruvchi_hisob,
        summa: removeComma(values?.summa),
        valyuta: removeComma(values?.valyuta),
        izoh: values?.izoh,
      };
      const resData = await addChangeBalans(data).unwrap();
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

      <Drawer
        title="Hisobni ayirboshlash"
        placement="top"
        width={720}
        height={400}
        open={openDrawer}
        onClose={handleCloseDrawer}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Form.Item
              style={{ width: "100%" }}
              label={
                <Tag color="red">
                  <ArrowUpOutlined />
                  &nbsp; Chiquvchi hisob
                </Tag>
              }
              name="chiquvchi_hisob"
              hasFeedback
              validateStatus={status}
              rules={[
                {
                  required: true,
                  message: "Chiquvchi hisob talab qilinadi!",
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Chiquvchi hisob talab qilinadi"
                filterOption={(inputValue, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) >= 0
                }
              >
                {selectOptions.map((option) => (
                  <Select.Option value={option.value} key={option.value}>
                    {option?.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              style={{ width: "100%" }}
              label={
                <Tag color="cyan">
                  <ArrowDownOutlined />
                  &nbsp; Kiruvchi hisob
                </Tag>
              }
              name="kiruvchi_hisob"
              hasFeedback
              validateStatus={status}
              rules={[
                {
                  required: true,
                  message: "Kiruvchi hisob talab qilinadi!",
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Kiruvchi hisob talab qilinadi"
                filterOption={(inputValue, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) >= 0
                }
              >
                {selectOptions.map((option) => (
                  <Select.Option value={option.value} key={option.value}>
                    {option?.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              style={{ width: "100%" }}
              label="Summa"
              name={"summa"}
              rules={[
                {
                  required: true,
                  message: "Summa talab qiniladi!",
                },
              ]}
              validateStatus={status}
              hasFeedback
            >
              <NumericFormat
                customInput={Input}
                thousandSeparator=","
                min={0}
                placeholder="Summa kiritish"
              />
            </Form.Item>
            <Form.Item
              style={{ width: "100%" }}
              label="Valyuta"
              name={"valyuta"}
              rules={[
                {
                  required: true,
                  message: "Valyuta talab qiniladi!",
                },
              ]}
              validateStatus={status}
              hasFeedback
            >
              <NumericFormat
                customInput={Input}
                thousandSeparator=","
                min={0}
                placeholder="Valyuta kiritish"
              />
            </Form.Item>
          </div>
          <Form.Item name={"izoh"} hasFeedback validateStatus={status}>
            <Input.TextArea
              allowClear
              showCount
              placeholder="Izoh kiritish"
              rows={6}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Form.Item name={"eslatma"} hasFeedback validateStatus={status}>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  icon={<CloseOutlined />}
                  loading={isSubmitting}
                  danger
                  onClick={handleCancel}
                >
                  Bekor qilish
                </Button>
              </Form.Item>
              <Form.Item name={"eslatma"} hasFeedback validateStatus={status}>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                  icon={<CheckOutlined />}
                  loading={isSubmitting}
                >
                  Saqlash
                </Button>
              </Form.Item>
            </div>
            <Form.Item name={"eslatma"} hasFeedback validateStatus={status}>
              <Button
                style={{ width: "100%" }}
                onClick={() => {
                  navigate(CASHIER_EXCHANGE_HISTORY_ROUTE);
                  handleCloseDrawer();
                }}
                icon={<UnorderedListOutlined />}
                loading={isSubmitting}
              >
                Ayirboshlanganlar tarixi
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </>
  );
}

export default forwardRef(CurrencyExchangeModal);
