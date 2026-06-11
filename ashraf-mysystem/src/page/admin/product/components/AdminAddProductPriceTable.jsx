import { ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Select, message } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ExportTable from "../../../../components/common/exportTable/ExportTable";
import MainDataTable from "../../../../components/ui/dataTable/MainDataTable";
import MainInputPrice from "../../../../components/ui/inputPrice/MainInputPrice";
import { useGetAdminCustomerCategoryQuery } from "../../../../features/admin/customerCategory/adminCustomerCategoryApiSlice";
import { useAddAdminProductPriceMutation } from "../../../../features/admin/product/adminProductApiSlice";
import removeComma from "../../../../util/removeComma";

function AdminAddProductPriceTable({
  data,
  isLoading,
  isError,
  refetch,
  component,
}) {
  /* Form */
  const [form] = Form.useForm();

  /* Ref */
  const selectRef = useRef(null);

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addPrice";

  /* API */
  const categoryRes = useGetAdminCustomerCategoryQuery();
  const [addProductPrice] = useAddAdminProductPriceMutation();

  const categoryOptions = useMemo(() => {
    if (
      categoryRes?.data?.success === true &&
      categoryRes?.data?.data &&
      Array.isArray(categoryRes?.data?.data)
    ) {
      return categoryRes?.data.data;
    }
    return [];
  }, [categoryRes?.data]);

  const handleSelect = useCallback((val) => {
    data?.forEach((item) => {
      if (item?.price_list && item?.price_list?.length) {
        const res = item.price_list?.find(
          (inItem) => parseInt(inItem?.client_category_id) === parseInt(val)
        );
        if (res) {
          form.setFieldValue(item?.id, res?.price);
        } else {
          form.setFieldValue(item?.id, "");
        }
      }
    });
    setSelectedCategory(val);
  }, [data, form]);

  useEffect(() => {
    if (categoryOptions?.length) {
      const selectedId = categoryOptions[0]?.id;
      form.setFieldValue("tarif", selectedId);
      handleSelect(selectedId);
    }
  }, [categoryOptions, form, handleSelect]);

  const exportData = useMemo(() => {
    if (!data.length || !selectedCategory) return [];

    return data?.map((item) => ({
      ...item,
      price: item?.price_list?.find(
        (inItem) => inItem.client_category_id === selectedCategory
      )?.price,
    }));
  }, [data, selectedCategory]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Nomi",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Narx(so'm)",
      dataIndex: "price",
      width: 120,
      render: (_, { id }) =>
        component === "outProduct" ? (
          <MainInputPrice style={{ margin: 0 }} name={id} label={"Narx"} />
        ) : null,
    },
  ];
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
      const sendData = {
        category_id: selectedCategory,
        products_list: data
          ?.map((item) => {
            const resKey = Object.keys(values).find((key) => key === item?.id);
            if (!resKey) return null;
            return {
              product_id: item?.id,
              price: removeComma(values[resKey]),
            };
          })
          .filter(Boolean),
      };
      const resData = await addProductPrice(sendData).unwrap();
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

  /* Form finish failed */
  const finishFailed = function (e) {
    message.error("Narx kiritish joylari bo'sh bo'lmasin!");
  };

  /* Form onChange */
  const formOnChange = function (e) {
    if (!form.getFieldValue("tarif") && e?.target?.id !== "tarif") {
      message.error("Tarifni tanlash talab qilinadi!");
      selectRef.current.focus();
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        onFinish={handleSubmit}
        form={form}
        layout="vertical"
        onChange={formOnChange}
        onFinishFailed={finishFailed}
      >
        <div style={{ width: "300px", marginBottom: "2rem" }}>
          <Form.Item
            label="Tarif"
            name="tarif"
            rules={[
              {
                required: true,
                message: "Tarifni tanlang!",
              },
            ]}
            help={categoryRes?.isError ? "Ulanishda xatolik" : null}
            hasFeedback
            validateStatus={status || (categoryRes?.isError ? "error" : "")}
          >
            {categoryRes?.isError ? (
              <Button
                onClick={categoryRes?.refetch}
                style={{ width: "100%" }}
                icon={<ReloadOutlined />}
                danger
              >
                Qayta yuklash
              </Button>
            ) : (
              <Select
                onChange={handleSelect}
                allowClear
                showSearch
                placeholder="Tarifni tanlash"
                loading={categoryRes.isLoading}
                filterOption={(inputValue, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) >= 0
                }
                ref={(inputRef) => (selectRef.current = inputRef)}
              >
                {categoryOptions.map((option) => (
                  <Select.Option value={option?.id} key={option?.id}>
                    {option?.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </div>

        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={data}
          customHeader={
            <ExportTable
              columns={columns}
              fileName="Bo'limlar"
              data={[...exportData]}
            />
          }
          refetch={refetch}
        />

        <Button
          style={{ width: "100%", marginTop: "2rem" }}
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          loading={isSubmitting}
        >
          Saqlash
        </Button>
      </Form>
    </>
  );
}

export default AdminAddProductPriceTable;
