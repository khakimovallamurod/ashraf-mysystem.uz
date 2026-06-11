import { Button, Form, Select, Divider, Radio, Input } from "antd";
import React, { useMemo, useState } from "react";
import Section from "../../../../components/common/section/Section";

const feedbackOptions = [
  {
    label: "Qoniqarli",
    value: "qoniqarli",
  },
  {
    label: "Qoniqarsiz",
    value: "qoniqarsiz",
  },
  {
    label: "Yaxshi",
    value: "yaxshi",
  },
  {
    label: "A'lo",
    value: "alo",
  },
];

function CrmAddFeedback() {
  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(false);

  // Customer options
  const customerOptions = useMemo(() => {
    return [];
  }, []);

  /* Handle Submit */
  async function handleSubmit(values) {}

  return (
    <div
      style={{
        maxWidth: "50%",
        width: "100%",
        marginRight: "auto",
      }}
    >
      <Section>
        <Form
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Mijozni tanlang"
            name="customer"
            rules={[{ required: true, message: "Mijoz talab qilinadi!" }]}
            hasFeedback
            validateStatus={status}
          >
            <Select
              allowClear
              showSearch
              placeholder="Mijoz"
              loading={false}
              filterOption={(inputValue, option) =>
                option.children
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {customerOptions.map((option) => (
                <Select.Option value={option.id} key={option.id}>
                  {option?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Buyurtmani tanlang"
            name="order"
            rules={[{ required: true, message: "Buyurtma talab qilinadi!" }]}
            hasFeedback
            validateStatus={status}
          >
            <Select
              allowClear
              showSearch
              placeholder="Buyurtma"
              loading={false}
              filterOption={(inputValue, option) =>
                option.children
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {customerOptions.map((option) => (
                <Select.Option value={option.id} key={option.id}>
                  {option?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Mijoz fikrini tanlang"
            name="feedback"
            rules={[{ required: true, message: "Mijoz fikri talab qilinadi!" }]}
            hasFeedback
            validateStatus={status}
          >
            <Radio.Group
              options={feedbackOptions}
              onChange={(a) => console.log(a)}
              // value={value3}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>

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

          <Divider />
          <Form.Item>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Saqlash
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                danger
              >
                Keyinroqga qoldirish
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Section>
    </div>
  );
}

export default CrmAddFeedback;
