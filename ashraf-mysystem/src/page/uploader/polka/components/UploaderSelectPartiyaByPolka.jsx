import { Form, Select, message } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useGetUploaderPartiyaByPolkaMutation } from "../../../../features/uploader/polka/uploaderPolkaApiSlice";

function UploaderSelectPartiyaByPolka({
  polkaId,
  label,
  name,
  defaultValue = "",
  form = null,
  productId,
}) {
  /* State */
  const [status, setStatus] = useState(null);
  const [options, setOptions] = useState([]);

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "getPartiyaByPolka";

  /* API */
  const [getPartiyaByPolka] = useGetUploaderPartiyaByPolkaMutation();

  const filterOptions = useMemo(() => {
    if(productId){
      return options.filter((item) => item.product_id === productId);
    } return options
  }, [options, productId]);

  useEffect(() => {
    handleGetPartiyaByPolka(polkaId);
  }, [polkaId]);

  useEffect(() => {
    if (options?.length && form) {
      const res = options.find(
        (item) =>
          item?.partiyanomer?.toLowerCase() === defaultValue?.toLowerCase() &&
          item?.product_id === productId
      );

      setTimeout(() => {
        if (res) form.setFieldValue(name, res.id);
      }, [300]);
    }
  }, [defaultValue, form, name, options, options?.length, productId]);

  /* Handle get polka */
  const handleGetPartiyaByPolka = async (partId) => {
    /* Set status */
    setStatus("validating");

    try {
      const resData = await getPartiyaByPolka(partId).unwrap();

      if (resData?.success === true) {
        /* Set data to options */
        if (resData?.data && resData?.data?.length) {
          setOptions(resData?.data);
        }

        /* Status */
        setStatus("");
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
    }
  };

  return (
    <>
      {contextHolder}
      <Form.Item
        label={label || "Chiquvchi partiyani tanlash"}
        name={name}
        rules={[
          {
            required: true,
            message: "Chiquvchi partiyani tanlang!",
          },
        ]}
        hasFeedback
        validateStatus={status}
      >
        <Select
          allowClear
          showSearch
          placeholder={label || "Chiquvchi partiyani tanlash"}
          loading={false}
          filterOption={(inputValue, option) =>
            option.searchOne.toLowerCase().indexOf(inputValue.toLowerCase()) >=
              0 ||
            option.searchTwo.toLowerCase().indexOf(inputValue.toLowerCase()) >=
              0
          }
        >
          {filterOptions.map((option) => (
            <Select.Option
              value={option.id}
              key={option.id}
              searchOne={option?.product_name || ""}
              searchTwo={option?.partiyanomer || ""}
            >
              {option?.product_name || ""} {option?.partiyanomer || ""}{" "}
              <span style={{ opacity: "0.5" }}>{option?.massa || ""} kg </span>
              <span style={{ opacity: "0.5" }}>[{option?.vaqt || ""}]</span>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
}

export default UploaderSelectPartiyaByPolka;
