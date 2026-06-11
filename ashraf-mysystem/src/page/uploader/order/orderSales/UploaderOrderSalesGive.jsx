import { Button, Form, Input, InputNumber, Select, message } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAddUploaderOrderSalesGiveMutation } from "../../../../features/uploader/order/orderOfSales/uploaderOrderOfSalesApiSlice";
import { useGetUploaderPolkaQuery } from "../../../../features/uploader/polka/uploaderPolkaApiSlice";
import UploaderSelectPartiyaByPolka from "../../../../page/uploader/polka/components/UploaderSelectPartiyaByPolka";

function UploaderOrderSalesGive({ orderData, onClose, openCount }) {
  /* Ref */
  // const inputRef = useRef(null);
  const massRef = useRef(null);

  // const qrCodeInput = {
  //   style: {
  //     width: "100%",
  //   },
  //   ref: inputRef,
  // };

  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedPolkaId, setSelectedPolkaId] = useState(null);
  const [partiyaId, setPartiyaId] = useState(null);

  const [productId, setProductId] = useState(null);

  /* API */
  const [addGiveOrder] = useAddUploaderOrderSalesGiveMutation();

  /* Hook */
  // const debouncedValue = useDebounce(qrCodeValue, setQrCodeValue)

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "setPolkaOrder";

  const polkaDataRes = useGetUploaderPolkaQuery();

  // useEffect(() => {
  //   // setTimeout(() => {
  //   //   inputRef.current.focus({
  //   //     cursor: "all",
  //   //   });
  //   // }, 350);
  // }, [openCount]);

  /* Memo */
  const polkaOptions = useMemo(() => {
    if (
      polkaDataRes?.data?.success === true &&
      polkaDataRes?.data?.data &&
      Array.isArray(polkaDataRes?.data?.data)
    ) {
      return polkaDataRes?.data.data;
    }
    return [];
  }, [polkaDataRes?.data]);

  const handleSetQrCode = (value) => {
    try {
      const res = JSON.parse(value);
      if (!res?.polka_id || !res?.partiyanomer || !res?.product_id) {
        message.error("Skanner qilingan ma'lumot to'liq emas.");
        return;
      }
      form.setFieldValue("polka", res?.polka_id);
      setSelectedPolkaId(res?.polka_id);

      /* Product */
      const prodRes = orderData?.product_list.find(
        (item) => item.product_id === res?.product_id
      );
      if (prodRes) {
        form.setFieldValue("product", res?.product_id?.toString());
        setProductId(res?.product_id?.toString());
      }
      // form.setFieldValue("product", "7");

      /* Partiya */
      setPartiyaId(res?.partiyanomer?.toString());
      // setPartiyaId("P1");

      massRef.current.focus({
        cursor: "all",
      });
    } catch (err) {}
  };

  /* Handle submit */
  const handleSetPolka = async (values) => {
    const productItem = orderData?.product_list?.find(
      (item) => item.product_id === values.product
    );

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
        order_id: orderData.id,
        order_item_id: productItem?.item_id,
        polka_id: values?.polka,
        partiya_id: values?.partiyaId,
        massa: values?.mass,
        isEnd: false,
        isEndOrder: false,
      };
      const resData = await addGiveOrder(data).unwrap();
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

      <Form form={form} layout="vertical" onFinish={handleSetPolka}>
        {/* <Form.Item name="scannerVal" hasFeedback validateStatus={status}>
          <Input
            {...qrCodeInput}
            placeholder="Partiya raqam"
            onChange={(e) => handleSetQrCode(e.target.value)}
          />
        </Form.Item> */}

        <Form.Item
          label="Skladni tanlash"
          name="polka"
          rules={[
            {
              required: true,
              message: "Skladni tanlang!",
            },
          ]}
          hasFeedback
          validateStatus={status}
        >
          <Select
            allowClear
            showSearch
            placeholder="Skladni tanlash"
            loading={false}
            filterOption={(inputValue, option) =>
              option.searchOne
                .toLowerCase()
                .indexOf(inputValue.toLowerCase()) >= 0 ||
              option.searchTwo
                .toLowerCase()
                .indexOf(inputValue.toLowerCase()) >= 0
            }
            onChange={setSelectedPolkaId}
          >
            {polkaOptions.map((option) => (
              <Select.Option
                value={option.id}
                key={option.id}
                searchOne={option?.name}
                searchTwo={option?.bulim_name}
              >
                {option?.name} {option?.bulim_name}{" "}
                <span style={{ fontSize: "12px", opacity: 0.6 }}>
                  Nagruzka: {option?.nagruzka || 0}
                </span>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Mahsulotni tanlash"
          name="product"
          rules={[
            {
              required: true,
              message: "Mahsulotni tanlang!",
            },
          ]}
          hasFeedback
          validateStatus={status}
        >
          <Select
            allowClear
            showSearch
            placeholder="Mahsulotni tanlash"
            loading={false}
            filterOption={(inputValue, option) =>
              option.searchOne
                .toLowerCase()
                .indexOf(inputValue.toLowerCase()) >= 0
            }
            onChange={(val) => {
              setProductId(val);
              form.setFieldValue("partiyaId", null);
            }}
          >
            {orderData?.product_list?.map((option) => (
              <Select.Option
                value={option.product_id}
                key={option.product_id}
                searchOne={option?.product_name}
              >
                {option?.product_name} {option?.bulim_name}{" "}
                {option?.massa ? `${option?.massa}kg` : null}{" "}
                <span style={{ opacity: "0.6" }}>
                  [{option?.tayyorlandi ? `${option?.tayyorlandi}kg` : null}]
                </span>
                <span style={{ fontSize: "12px", opacity: 0.6 }}>
                  {option?.status}
                </span>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <UploaderSelectPartiyaByPolka
          name={"partiyaId"}
          label="Partiyani tanlash"
          polkaId={selectedPolkaId}
          defaultValue={partiyaId}
          form={form}
          // defaultId={defaultProductId}
          productId={productId}
        />

        <Form.Item
          label="Massasi"
          name="mass"
          rules={[
            {
              required: true,
              message: "Massasi talab qilinadi!",
            },
          ]}
          hasFeedback
          validateStatus={status}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Massa kiritish"
            ref={massRef}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            loading={isSubmitting}
          >
            Tasdiqlash
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default UploaderOrderSalesGive;
