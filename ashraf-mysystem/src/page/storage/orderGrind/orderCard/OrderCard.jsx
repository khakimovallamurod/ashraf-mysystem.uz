import { CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  message,
  Modal,
  Select,
  Switch,
  Tag,
} from "antd";
import React, { useMemo, useState } from "react";
import {
  useGetOrderReceptionByIdStorageMutation,
  useSendOrderProductToGrindStorageMutation,
} from "../../../../features/productStorage/order/storageOrderApiSlice";
import { useGetPolkaStorageQuery } from "../../../../features/productStorage/polka/productStoragePolkaApiSlice";
import styles from "./orderCard.module.css";
import MainInputMass from "../../../../components/ui/inputMass/MainInputMass";
import removeComma from "../../../../util/removeComma";

/*

 */
function OrderCard({
  id,
  massa,
  nomer,
  sana,
  status,
  tayyorlandi,
  buyurtmachi,
}) {
  /* Form */
  const [form] = Form.useForm();

  /* Message */
  const [messageApi, messContextHolder] = message.useMessage();
  const messageKey = "confirmOrder";

  /* State */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receptionDataOptions, setReceptionDataOptions] = useState([]);

  /* API */
  const polkaData = useGetPolkaStorageQuery();
  const [getReceptionByPolkaId, getReceptionEvents] =
    useGetOrderReceptionByIdStorageMutation();
  const [addPolka] = useSendOrderProductToGrindStorageMutation();

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

  /* Handle get reception by polka */
  const handleGetReceptionByPolka = async (id) => {
    try {
      const resData = await getReceptionByPolkaId(id).unwrap();

      if (
        resData?.success &&
        resData?.success === true &&
        resData?.data &&
        resData?.data.length
      ) {
        setReceptionDataOptions(resData?.data);
      } else {
        form.setFieldValue("kirim", null);
        setReceptionDataOptions([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
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
        zayavka_id: id, //this card id
        polka_id: values.polka,
        krim_id: values.kirim,
        massa: removeComma(values.mass),
        isend: true,
        isendpartiya: true,
        // isend: values.isEnd,
        // isendpartiya: values.isEndPartiya,
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

  /* Handle change select */
  const handleChangeSelect = (_, value) => {
    form.setFieldValue("massa", value?.mass);
  };

  return (
    <>
      {messContextHolder}
      <Modal
        title="Maydalash buyurtmasini tayyorlash"
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
            label="Polkani"
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
              onSelect={(id) => handleGetReceptionByPolka(id)}
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

          <Form.Item
            label="Kirimni tanlash"
            name="kirim"
            rules={[
              {
                required: true,
                message: "Kirimni tanlang!",
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Kirimni tanlash"
              loading={getReceptionEvents.isLoading}
              onChange={handleChangeSelect}
              filterOption={(inputValue, option) =>
                option.searchOne
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {receptionDataOptions?.map((option) => (
                <Select.Option
                  value={option.id}
                  key={option.id}
                  mass={option?.massa}
                  searchOne={option.partiya}
                >
                  {`id: ${option.id}`} {`partiya: ${option.partiya}`}{" "}
                  {`massa: ${option.massa}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item
            label="Buyurtmani tugatish"
            name="isEnd"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Partiyani tugatish"
            name="isEndPartiya"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item> */}

          <MainInputMass />

          <Form.Item>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              className={styles.addButton}
              htmlType="submit"
              loading={isSubmitting}
            >
              Topshirish
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Card */}
      <Col span={8}>
        <Card bordered={false}>
          <ul className={styles.innerList}>
            <li>
              <span>Buyurtmachi:</span>
              <b>{buyurtmachi}&nbsp;</b>
            </li>
            <li>
              <span>Raqami:</span>
              <span>{nomer}&nbsp;</span>
            </li>
            <li>
              <span>Massa:</span>
              <span>{massa}&nbsp;kg</span>
            </li>
            <li>
              <span>Tayyorlandi:</span>
              <span>{tayyorlandi}&nbsp;kg</span>
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
            Topshirish
          </Button>
        </Card>
      </Col>
    </>
  );
}

export default OrderCard;
