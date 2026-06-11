import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authApiSlice";
import { setCredentials } from "../../features/auth/authSlice";
import MainText from "../../components/ui/title/MainText";
import { ROLE_LIST } from "../../util/const";
import { SALES_DASHBOARD_ROUTE } from "../../util/path";
import styles from "./register.module.css";

export default function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  async function handleSubmit(values) {
    setIsSubmitting(true);
    setStatus("validating");

    try {
      const resData = await login({
        login: values.login,
        parol: values.password,
      }).unwrap();

      if (resData?.success === true) {
        if (resData?.data && resData?.data?.rol) {
          if (resData.data.rol !== ROLE_LIST.sales) {
            message.error("Bu loyiha faqat sotuv roli uchun qoldirilgan!");
            setStatus("warning");
            return;
          }

          if (resData.message) {
            message.success(resData.message);
          }

          dispatch(
            setCredentials({
              user: {
                name: resData.data?.ism,
                surname: resData.data?.familya,
                email: resData.data?.email,
                telefon: resData.data?.telefon,
                image: resData.data?.rasm,
                login: resData.data?.login,
              },
              accessToken: resData.data?.token,
              role: resData.data?.rol,
              remember: values.remember,
            })
          );

          setStatus("success");
          navigate(SALES_DASHBOARD_ROUTE, { replace: true });
        } else {
          message.error("Mavjud bo'lmagan toifa!");
          setStatus("warning");
        }
      } else if (resData?.success === false) {
        if (resData.message) {
          message.error(resData.message);
        }
        setStatus("error");
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        message.warning("Ulanishda xatolik! Qaytadan urinib ko'ring!");
      }

      setStatus("warning");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <MainText lg>Kirish</MainText>
      <Form
        className={styles.form}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="login"
          rules={[{ required: true, message: "Login bo'sh bo'lmasin!" }]}
          hasFeedback
          validateStatus={status}
        >
          <Input
            autoFocus={true}
            prefix={<UserOutlined />}
            placeholder="Login kiriting"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Parol bo'sh bo'lmasin!" }]}
          hasFeedback
          validateStatus={status}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Parol"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" noStyle valuePropName="checked">
            <Checkbox>Meni eslab qol</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submitBtn}
            loading={isSubmitting}
          >
            Kirish
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
