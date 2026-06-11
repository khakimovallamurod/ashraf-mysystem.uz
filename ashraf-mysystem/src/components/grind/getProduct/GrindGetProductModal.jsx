import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, FloatButton, Form, message, Select } from "antd";
import React, { useMemo, useState } from "react";
import { useAddGrindPlacingOrderToStorageMutation } from "../../../features/grindProduct/order/grindOrderSalesApiSlice";
import MainInputMass from "../../ui/inputMass/MainInputMass";
import removeComma from "../../../util/removeComma";
import { useGetPolkaStorageQuery } from "../../../features/productStorage/polka/productStoragePolkaApiSlice";
import { useGetOrderReceptionByIdStorageMutation } from "../../../features/productStorage/order/storageOrderApiSlice";

function GrindGetProductModal() {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);

  const [receptionDataOptions, setReceptionDataOptions] = useState([]);

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  /* API */
  const polkaData = useGetPolkaStorageQuery();
  const [getReceptionByPolkaId, getReceptionEvents] =
    useGetOrderReceptionByIdStorageMutation();
  const [addGetProductOrder] = useAddGrindPlacingOrderToStorageMutation();

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
        krim_id: values.kirim,
        massa: removeComma(values.mass),
        polka_id: values.polka,
        isend: true,
        isendpartiya: true,
      };
      const resData = await addGetProductOrder(data).unwrap();
      if (resData?.success === true) {
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
    }
  };

  /* Drawer actions */
  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };
  const showDrawer = () => {
    setOpenDrawer(true);
  };

  /* Handle change select */
  const handleChangeSelect = (_, value) => {
    form.setFieldValue("massa", value?.mass);
  };

  return (
    <>
      {contextHolder}

      {/* Fload button */}
      <FloatButton
        shape="circle"
        type="primary"
        style={{
          right: 24,
        }}
        icon={<PlusOutlined />}
        onClick={showDrawer}
      />

      <Drawer
        title="Maydalash uchun mahsulot buyurtma berish"
        placement="left"
        width={400}
        onClose={onCloseDrawer}
        closeIcon={false}
        open={openDrawer}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        {/* Form */}
        <Form
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
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

          <MainInputMass />

          <Form.Item>
            <Button
              style={{ width: "100%" }}
              htmlType="submit"
              type="primary"
              icon={<PlusOutlined />}
              loading={isSubmitting}
            >
              Qabul qilish
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}

export default GrindGetProductModal;
