import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import { useMemo, useState } from "react";
import {
  useAddSalesTaminotchiPayMutation,
  useGetSalesTaminotchiQuery,
} from "../../../../features/sales/taminotchi/salesTaminotchiApiSlice";
import MainInputPrice from "../../../../components/ui/inputPrice/MainInputPrice";
import removeComma from "../../../../util/removeComma";

function SalesPaySupplierModal({ onClose }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const key = "salesPaySupplier";

  const { data: taminotchiData, isLoading: taminotchiLoading } =
    useGetSalesTaminotchiQuery();
  const [addPay] = useAddSalesTaminotchiPayMutation();

  const taminotchiOptions = useMemo(() => {
    if (
      taminotchiData?.success === true &&
      Array.isArray(taminotchiData?.data)
    ) {
      return taminotchiData.data;
    }
    return [];
  }, [taminotchiData]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setStatus("validating");
    messageApi.open({ key, type: "loading", content: "Loading..." });
    try {
      const data = {
        taminotchi_id: values.taminotchi_id,
        naqdsum: removeComma(values.naqdsum) || 0,
        naqdusd: removeComma(values.naqdusd) || 0,
        valyuta: removeComma(values.valyuta) || 0,
        bank: removeComma(values.bank) || 0,
        karta: removeComma(values.karta) || 0,
        izoh: values.izoh,
      };
      const resData = await addPay(data).unwrap();
      if (resData?.success === true) {
        form.resetFields();
        setStatus("success");
        messageApi.open({ key, type: "success", content: resData?.message || "Saqlandi" });
        setTimeout(() => {
          if (onClose) onClose();
        }, 800);
      } else {
        setStatus("error");
        messageApi.open({ key, type: "error", content: resData?.message || "Xatolik" });
      }
      setTimeout(() => setStatus(""), 2000);
    } catch (err) {
      setStatus("warning");
      messageApi.open({ key, type: "warning", content: "Ulanishda xatolik!" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Ta'minotchi"
          name="taminotchi_id"
          rules={[{ required: true, message: "Ta'minotchini tanlang!" }]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Ta'minotchini tanlash"
            loading={taminotchiLoading}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {taminotchiOptions.map((t) => (
              <Select.Option value={t.id} key={t.id}>
                {t.fio}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <MainInputPrice label="Naqd so'm" name="naqdsum" status={status} showLabel />
        <MainInputPrice label="Naqd USD" name="naqdusd" status={status} showLabel />
        <MainInputPrice label="Valyuta kursi" name="valyuta" status={status} showLabel />
        <MainInputPrice label="Bank (plastik)" name="bank" status={status} showLabel />
        <MainInputPrice label="Karta" name="karta" status={status} showLabel />

        <Form.Item
          label="Izoh"
          name="izoh"
          hasFeedback
          validateStatus={status}
          rules={[{ required: true, message: "Izoh talab qilinadi!" }]}
        >
          <Input.TextArea
            allowClear
            showCount
            placeholder="Izoh kiritish"
            rows={4}
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
            Saqlash va kod yuborish
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default SalesPaySupplierModal;
