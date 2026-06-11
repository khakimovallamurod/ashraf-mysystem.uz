import { SendOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Collapse,
  Drawer,
  Empty,
  Form,
  Input,
  Space,
  Tooltip,
  message,
} from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSalesOrderProductsListGrind,
  selectSalesOrderAllProductsGrind,
} from "../../../features/sales/salesSlice";
import SalesProductsList from "../products/SalesProductsList";
import { useAddSalesPlacingOrderToGrindMutation } from "../../../features/sales/salesApiSlice";

function SalesOrderGrindDrawer() {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [openOrderGrindDrawer, setOpenOrderGrindDrawer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Dispatch */
  const dispatch = useDispatch();

  /* Slice data */
  const products = useSelector(selectSalesOrderAllProductsGrind);

  /* API */
  const [addOrder] = useAddSalesPlacingOrderToGrindMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "placingOrder";

  /* Drawer handle */
  const handleOpenOrderGrindDrawer = () => setOpenOrderGrindDrawer(true);
  const handleCloseOrderGrindDrawer = () => setOpenOrderGrindDrawer(false);

  /* Handle submit */
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setStatus("validating");
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });

    try {
      const data = {
        product_list: products.map((item) => {
          return {
            product_id: item.id,
            massa: item.mass,
            article: item.article,
          };
        }),
        description: values.description,
      };

      const resData = await addOrder(data).unwrap();
      if (resData?.success === true) {
        form.resetFields();
        setStatus("success");
        /* Clear data */
        dispatch(clearSalesOrderProductsListGrind());

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
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        setStatus("warning");
        messageApi.open({
          key,
          type: "warning",
          content: "Ulanishda xatolik! Qaytadan urinib ko'ring!",
        });
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setStatus("");
      }, 3000);
    }
  };

  return (
    <>
      {contextHolder}
      <Space size={16}>
        <Tooltip title="Maydalashga beriladigan mahsulotlar">
          <Badge count={products.length} size="small">
            <Button
              icon={<SendOutlined />}
              onClick={handleOpenOrderGrindDrawer}
            />
          </Badge>
        </Tooltip>

        <Drawer
          title="Maydalashga beriladigan mahsulotlar"
          width={800}
          onClose={handleCloseOrderGrindDrawer}
          open={openOrderGrindDrawer}
          styles={{ body: {
            padding: "10px",
          } }}
        >
          {!products.length ? (
            <Empty />
          ) : (
            <Space
              style={{
                width: "100%",
                justifyContent: "space-between",
                height: "100%",
              }}
              direction="vertical"
            >
              <Collapse
                size="small"
                items={[
                  {
                    key: "1",
                    label: (
                      <p>
                        Mahsulotlar <b>{products.length}ta</b>
                      </p>
                    ),
                    children: (
                      /* LIST */
                      <SalesProductsList list={products} component="drawer" />
                    ),
                  },
                ]}
              />
              <Form
                form={form}
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
                layout="vertical"
              >
                <Form.Item
                  name="description"
                  rules={[{ required: true, message: "Izoh kiriting!" }]}
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
                    icon={<SendOutlined />}
                    type="primary"
                    loading={isSubmitting}
                    htmlType="submit"
                  >
                    Buyurtma berish
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          )}
        </Drawer>
      </Space>
    </>
  );
}

export default SalesOrderGrindDrawer;
