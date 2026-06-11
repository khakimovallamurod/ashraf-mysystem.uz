import React, {useState} from 'react'
import {useAddSupplierDeadlineCloseMutation} from '../../../../features/supplier/deadline/supplierDeadlineApiSlice'
import {Button, Col, Form, InputNumber, message, Row, Space} from "antd";
import {SaveOutlined} from "@ant-design/icons";

const SupplierDeadlineCloseModal = ({orderId}) => {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  // Api
  const [addCloseOrder] = useAddSupplierDeadlineCloseMutation();


  // Submit
  const handleSubmit = () => {

  }


  if(process.env.NODE_ENV === 'development'){
    return ''
  }

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Naqd so'm"
          name="naqdsum"
          rules={[
            {
              required: true,
              message: "Naqd so'm talab qilinadi!",
            },
          ]}
        >
          <InputNumber
            style={{width: '100%'}}
            placeholder="so'm"
            type="number"
          />
        </Form.Item>

        <Form.Item>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                style={{width: '100%!important'}}
                label="Naqd usd"
                name="naqdusd"
                rules={[
                  {
                    required: true,
                    message: "Naqd usd talab qilinadi!",
                  },
                ]}
              >
                <InputNumber
                  style={{width: '100%'}}
                  placeholder="usd"
                  type="number"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                style={{width: '100%!important'}}
                label="Valyuta"
                name="valyuta"
                rules={[
                  {
                    required: true,
                    message: "Valyuta talab qilinadi!",
                  },
                ]}
              >
                <InputNumber
                  style={{width: '100%'}}
                  placeholder="so'm"
                  type="number"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label="Bank"
          name="bank"
          rules={[
            {
              required: true,
              message: "Bank talab qilinadi!",
            },
          ]}
        >
          <InputNumber
            style={{width: '100%'}}
            placeholder="so'm"
            type="number"
          />
        </Form.Item>

        <Form.Item
          label="Karta"
          name="karta"
          rules={[
            {
              required: true,
              message: "Karta talab qilinadi!",
            },
          ]}
        >
          <InputNumber
            style={{width: '100%'}}
            placeholder="so'm"
            type="number"
          />
        </Form.Item>

        <Form.Item>
          <Button
            style={{width: "100%"}}
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined/>}
            loading={isSubmitting}
          >
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default SupplierDeadlineCloseModal