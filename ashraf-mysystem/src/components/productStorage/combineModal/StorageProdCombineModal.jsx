import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import React, { useMemo, useState } from "react";
import { useAddGrindProductCombineMutation } from "../../../features/grindProduct/combine/grindCombineApiSlice";
import { useGetProductStorageSpareQuery } from "../../../features/productStorage/productStorageApiSlice";
import FormItem from "antd/es/form/FormItem";
import { NumericFormat } from "react-number-format";
import removeComma from "../../../util/removeComma";
import MainNumberFormat from "../../common/numberFormat/MainNumberFormat";

function StorageProdCombineModal() {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [outSelectedProduct, setOutSelectedProduct] = useState(null);
  const [innerProductOptions, setInnerProductOptions] = useState([]);

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  /* API */
  const prodSpareRes = useGetProductStorageSpareQuery();
  const [addCombine] = useAddGrindProductCombineMutation();

  const productSpareOptions = useMemo(() => {
    if (
      prodSpareRes?.data?.success === true &&
      prodSpareRes?.data?.data &&
      Array.isArray(prodSpareRes?.data?.data)
    ) {
      return prodSpareRes?.data.data;
    }
    return [];
  }, [prodSpareRes?.data]);

  const handleSelectPolka = (partId) => {
    if (!productSpareOptions.length) return;

    form.setFieldValue("chiquvchi_id", null);
    form.setFieldValue("kiruvchi_id", null);

    const res = productSpareOptions.find((item) => item.id === partId);
    if (res && res?.history_krim?.length) {
      const productList = res?.history_krim;

      setProductOptions([...productList]);
    } else {
      setProductOptions([]);
    }
  };

  const handleSelectProduct = (_, productId) => {
    if (!productId || !productOptions?.length) return;

    const res = productOptions?.filter((item) => item.product_id === productId);
    form.setFieldValue("kiruvchi_id", null);
    setOutSelectedProduct(productId);
    setInnerProductOptions([...res]);
  };

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
        product_id: outSelectedProduct,
        chiquvchi_id: values?.chiquvchi_id,
        kiruvchi_id: values?.kiruvchi_id,
        massa: removeComma(values?.massa),
      };
      const resData = await addCombine(data).unwrap();
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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Polkani tanlash"
          name="polka"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Polka talab qilinadi!",
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Polkani tanlash"
            loading={prodSpareRes?.isLoading}
            filterOption={(inputValue, option) =>
              option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >=
              0
            }
            onChange={handleSelectPolka}
          >
            {productSpareOptions.map((option) => (
              <Select.Option value={option.id} key={option.id}>
                {option?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Chiquvchi partiyani tanlash"
          name="chiquvchi_id"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Chiquvchi partiya talab qilinadi!",
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chiquvchi partiyani tanlash"
            loading={prodSpareRes?.isLoading}
            filterOption={(inputValue, option) =>
              option.searchOne
                .toLowerCase()
                .indexOf(inputValue.toLowerCase()) >= 0 ||
              option.searchTwo
                .toLowerCase()
                .indexOf(inputValue.toLowerCase()) >= 0
            }
            onChange={(_, val) => handleSelectProduct(val.value, val.productId)}
          >
            {productOptions.map((option) => (
              <Select.Option
                value={option.id}
                key={option.id}
                productId={option?.product_id}
                searchOne={option?.pnomer}
                searchTwo={option?.product_name}
              >
                <b>{option?.pnomer}</b> {option?.product_name},{" "}
                <MainNumberFormat value={option?.massa} />
                kg, [{option.vaqt}]
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <FormItem
          label="Massa (kg)"
          name={"massa"}
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Massa talab qilinadi!",
            },
          ]}
        >
          <NumericFormat
            customInput={Input}
            thousandSeparator=","
            min={0}
            placeholder="Kg"
          />
        </FormItem>

        <Form.Item
          label="Chiquvchi partiyani tanlash"
          name="kiruvchi_id"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Chiquvchi partiya talab qilinadi!",
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chiquvchi partiyani tanlash"
            loading={prodSpareRes?.isLoading}
            filterOption={(inputValue, option) =>
              option.searchOne
                .toLowerCase()
                .indexOf(inputValue.toLowerCase()) >= 0 ||
              option.searchTwo
                .toLowerCase()
                .indexOf(inputValue.toLowerCase()) >= 0
            }
          >
            {innerProductOptions.map((option) => (
              <Select.Option
                value={option.id}
                key={option.id}
                searchOne={option?.pnomer}
                searchTwo={option?.product_name}
              >
                <b>{option?.pnomer}</b> {option?.product_name},{" "}
                <MainNumberFormat value={option?.massa} />
                kg, [{option.vaqt}]
              </Select.Option>
            ))}
          </Select>
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

export default StorageProdCombineModal;
