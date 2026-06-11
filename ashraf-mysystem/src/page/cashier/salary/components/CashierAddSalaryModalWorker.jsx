import { ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import React, { useMemo, useState } from "react";
import MainNumberFormat from "../../../../components/common/numberFormat/MainNumberFormat";
import MainInputPrice from "../../../../components/ui/inputPrice/MainInputPrice";
import {
  useAddCashierWorkerSalaryMutation,
  useGetCashierWorkerQuery,
} from "../../../../features/cashier/salary/cashierSalaryApiSlice";
import removeComma from "../../../../util/removeComma";

function CashierAddSalaryModalWorker({ onClose }) {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  /* API */
  const { data, isLoading, isError, refetch } = useGetCashierWorkerQuery();
  const [addSalary] = useAddCashierWorkerSalaryMutation();

  const workerOptions = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  /* Handle Submit */
  const handleSubmit = async (values) => {
    const { worker_id, naqdsum, naqdusd, valyuta, bank, karta, izoh } = values;
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
      let data = {
        worker_id,
        naqdsum: removeComma(naqdsum),
        naqdusd: removeComma(naqdusd),
        valyuta: removeComma(valyuta),
        bank: removeComma(bank),
        karta: removeComma(karta),
        izoh,
      };
      const resData = await addSalary(data).unwrap();

      if (resData?.success === true) {
        /* Close this modal */
        onClose();

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

  // console.log()
  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Ishchi"
          name="worker_id"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Ishchi talab qilinadi!",
            },
          ]}
        >
          {!isLoading && isError ? (
            <Button
              onClick={refetch}
              style={{ width: "100%" }}
              icon={<ReloadOutlined />}
              danger
            >
              Qayta yuklash
            </Button>
          ) : (
            <Select
              allowClear
              showSearch
              placeholder="Ishchini tanlash"
              filterOption={(inputValue, option) =>
                option.searchOne
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0 ||
                option.searchTwo
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {workerOptions.map(({ id, fio, balans }) => (
                <Select.Option
                  value={id}
                  key={id}
                  searchOne={fio}
                  searchTwo={balans}
                >
                  {fio}{" "}
                  <span style={{ fontSize: "12px", opacity: 0.6 }}>
                    <MainNumberFormat value={balans} />
                  </span>
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <MainInputPrice label="Naqd so'm" name="naqdsum" status={status} />
        <MainInputPrice label="Naqd usd" name="naqdusd" status={status} />
        <MainInputPrice label="Valyuta" name="valyuta" status={status} />
        <MainInputPrice label="Bank" name="bank" status={status} />
        <MainInputPrice label="Karta" name="karta" status={status} />

        <Form.Item
          label="Izoh"
          name="izoh"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Izoh talab qilinadi!",
            },
          ]}
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
    </>
  );
}

export default CashierAddSalaryModalWorker;
