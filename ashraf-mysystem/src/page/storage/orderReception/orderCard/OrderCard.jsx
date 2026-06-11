import {CheckOutlined} from "@ant-design/icons";
import {Button, Card, Col, Form, message, Modal, Select, Tag,} from "antd";
import React, {useMemo, useState} from "react";
import {useAddOrderPutPolkaStorageMutation} from "../../../../features/productStorage/order/storageOrderApiSlice";
import {useGetPolkaStorageQuery} from "../../../../features/productStorage/polka/productStoragePolkaApiSlice";
import styles from "./orderCard.module.css";
import MainInputMass from "../../../../components/ui/inputMass/MainInputMass";
import removeComma from "../../../../util/removeComma";

function OrderCard({ dona, id, massa, sana, status, summa, joylangani }) {
  /* Form */
  const [form] = Form.useForm();

  /* Message */
  const [messageApi, messContextHolder] = message.useMessage();
  const messageKey = "confirmOrder";

  /* State */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* API */
  const polkaData = useGetPolkaStorageQuery();
  const [addPolka] = useAddOrderPutPolkaStorageMutation();

  /* Polka Options */
  const polkaOptions = useMemo(() => {
    if (
      polkaData?.data?.success === true &&
      polkaData?.data?.data &&
      polkaData?.data?.data.length
    ) {
      return polkaData?.data?.data;
    }
    return [];
  }, [polkaData]);

  /* Modal */
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /* Handle submit */

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    /* Message */
    messageApi.open({
      key: messageKey,
      type: "loading",
      content: "Loading...",
    });

    try {
      const data = {
        polka_id: values.polka,
        krim_id: id,
        massa: removeComma(values.mass),
      };
      const resData = await addPolka(data).unwrap();
      if (resData?.success === true) {
        form.resetFields();
        if (resData?.message) {
          messageApi.open({
            key: messageKey,
            type: "success",
            content: resData?.message,
            duration: 2,
          });
        }
        /* Close Modal */
        handleCancel();
      } else if (resData?.success === false) {
        if (resData?.message) {
          messageApi.open({
            key: messageKey,
            type: "error",
            content: resData?.message,
            duration: 2,
          });
        }
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        messageApi.open({
          key: messageKey,
          type: "warning",
          content: "Ulanishda xatolik! Qaytadan urinib ko'ring!",
          duration: 2,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {messContextHolder}
      <Modal
        title="Polkaga urish"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Polkani tanlang"
            name="polka"
            rules={[
              {
                required: true,
                message: "Polkani tanlang!",
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Polkani tanlash"
              loading={polkaData.isLoading}
              filterOption={(inputValue, option) =>
                option.searchOne
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0 ||
                option.searchTwo
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0 ||
                option.searchThree
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {polkaOptions.map((option) => (
                <Select.Option
                  value={option.id}
                  key={option.id}
                  searchOne={option.bulim_name}
                  searchTwo={option.name}
                  searchThree={option.nagruzka}
                >
                  {option.name} {option.bulim_name} {option.nagruzka}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <MainInputMass />
          <Form.Item>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              className={styles.addButton}
              htmlType="submit"
              loading={isSubmitting}
            >
              Tugatish
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Card */}
      <Col span={8}>
        <Card bordered={false}>
          <ul className={styles.innerList}>
            <li>
              <b>Summa:</b>
              <b>{summa}</b>
            </li>
            <li>
              <span>Dona:</span>
              <span>{dona}&nbsp;ta</span>
            </li>
            <li>
              <span>Massa:</span>
              <span>{massa}&nbsp;kg</span>
            </li>
            <li>
              <span>Joylangani:</span>
              <span>{joylangani}&nbsp;kg</span>
            </li>
            <li>
              <span>Sana:</span>
              <span>{sana}</span>
            </li>
            <li>
              <span>Status:</span>
              <Tag color="blue">{status}</Tag>
            </li>
          </ul>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            className={styles.addButton}
            onClick={showModal}
          >
            Tugatish
          </Button>
        </Card>
      </Col>
    </>
  );
}

export default OrderCard;
