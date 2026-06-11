import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import {
  useAddAdminUserMutation,
  usePutAdminUserMutation,
} from "../../../../features/admin/user/adminUserApiSlice";
import { ROLE_LIST } from "../../../../util/const";

function AdminAddUserModal({ userData, onClose }) {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  /* API */
  const [addUser] = useAddAdminUserMutation();
  const [editUser] = usePutAdminUserMutation();

  useEffect(() => {
    form.setFieldsValue({
      rol: userData?.rol,
      ism: userData?.ism,
      familiya: userData?.familya,
      telefon: userData?.telefon,
      login: userData?.login,
    });
  }, [form, userData]);

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
        id: userData?.id,
        rol: values?.rol,
        ism: values?.ism,
        familya: values?.familiya,
        telefon: values?.telefon,
        login: values?.login,
        parol: values?.parol,
      };
      let resData = null;
      if (userData) {
        resData = await editUser(data).unwrap();
      } else {
        resData = await addUser(data).unwrap();
      }
      if (resData?.success === true) {
        /* Close this modal */
        if (userData) {
          onClose();
        }

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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Rol"
          name="rol"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Rol talab qilinadi!",
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Rolni tanlash"
            filterOption={(inputValue, option) =>
              option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >=
              0
            }
          >
            {Object.keys(ROLE_LIST).map((key) => (
              <Select.Option value={ROLE_LIST[key]} key={key}>
                {ROLE_LIST[key]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Ism"
          name="ism"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Ism talab qilinadi!",
            },
          ]}
        >
          <Input placeholder="Ism kiritish" autoFocus={true} />
        </Form.Item>
        <Form.Item
          label="Familiya"
          name="familiya"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Familiya talab qilinadi!",
            },
          ]}
        >
          <Input placeholder="Familiya kiritish" autoFocus={true} />
        </Form.Item>
        <Form.Item
          label="Telefon"
          name="telefon"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Telefon talab qilinadi!",
            },
          ]}
        >
          <ReactInputMask mask="+999(99)999-99-99">
            {(inputProps) => (
              <Input
                {...inputProps}
                placeholder="Telefon kiritish"
                type="tel"
              />
            )}
          </ReactInputMask>
        </Form.Item>
        <Form.Item
          label="Login"
          name="login"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Login talab qilinadi!",
            },
          ]}
        >
          <Input placeholder="Login kiritish" autoFocus={true} />
        </Form.Item>
        <Form.Item
          label="Parol"
          name="parol"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Parol talab qilinadi!",
            },
          ]}
        >
          <Input placeholder="Parol kiritish" autoFocus={true} />
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

export default AdminAddUserModal;
