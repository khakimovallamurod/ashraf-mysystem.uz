import { Button, Form, Input, InputNumber, Select, message } from "antd";
import React, { useState } from "react";
import UploaderSelectPolka from "../../polka/components/UploaderSelectPolka";
import { SaveOutlined } from "@ant-design/icons";
import UploaderSelectPartiyaByPolka from "../../polka/components/UploaderSelectPartiyaByPolka";
import { useAddUploaderRegrindMutation } from "../../../../features/uploader/regrind/uploaderRegrindApiSlice";

function UploaderRegrindForm() {
  /* Form */
  const [form] = Form.useForm();

  /* API */
  const [addRegrind] = useAddUploaderRegrindMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "regrindAction";

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedPolkaId, setSelectedPolkaId] = useState(null);

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
        product_list: [
          {
            polka_id: values?.polka,
            partiya_id: values?.partiyaId,
            massa: values?.partiyaMass,
          },
        ],
        description: values?.description,
      };
      const resData = await addRegrind(data).unwrap();
      if (resData?.success === true) {
        form.resetFields();
        setStatus("success");
        setSelectedPolkaId(null)
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

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {/* polka */}
        <UploaderSelectPolka
          label={""}
          name={"polka"}
          onSelectPolka={setSelectedPolkaId}
        />

        {/* Out polka partiya */}
        <UploaderSelectPartiyaByPolka
          name={"partiyaId"}
          label={"Partiyani tanlash"}
          polkaId={selectedPolkaId}
        />

        <Form.Item
          label="Partiya massasi"
          name="partiyaMass"
          rules={[
            {
              required: true,
              message: "Partiya massasi kiriting!",
            },
          ]}
          hasFeedback
          validateStatus={status}
        >
          <InputNumber
            type="number"
            style={{ width: "100%" }}
            min={0}
            placeholder="Partiya massasi kiriting"
          />
        </Form.Item>

        <Form.Item name={"description"} hasFeedback validateStatus={status}>
          <Input.TextArea
            allowClear
            showCount
            placeholder="Izoh kiritish"
            rows={6}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            style={{ width: "100%" }}
            loading={isSubmitting}
          >
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default UploaderRegrindForm;
