import React, { useCallback, useEffect, useState } from "react";
import { useGetSalesDistrictMutation } from "../../../../features/sales/salesApiSlice";
import { Button, Form, Select, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

function SalesSelectDistrict({ regionId, form, status }) {
  /* State */
  const [formStatus, setFormStatus] = useState("");
  const [regionConErr, setRegionConErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [districtOptions, setDistrictOptions] = useState([]);

  /* API */
  const [getDistrict] = useGetSalesDistrictMutation();

  /* Handle get district */
  const handleGetDistrict = useCallback(async (id = regionId) => {
    if (!id) return;
    setDistrictOptions([]);
    /* Set status */
    setRegionConErr(false);
    setFormStatus("");
    setIsLoading(true);
    try {
      const resData = await getDistrict(id).unwrap();

      if (resData?.success === true) {
        if (resData?.data && resData?.data?.length) {
          setDistrictOptions(resData.data);
          /* Set initial values */
          const res = resData?.data.find((item) => item?.id === "39");
          if (res) {
            form.setFieldValue("tuman", res.id);
          }
        }
        setFormStatus("");
      } else if (resData?.success === false) {
        setFormStatus("error");
        setRegionConErr(true);
        if (resData?.message) {
          message.error(resData.message);
        }
      }
      setTimeout(() => {
        setFormStatus("");
      }, 2000);
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        setFormStatus("error");
        setRegionConErr(true);
        message.warning("Ulanishda xatolik! Qaytadan urinib ko'ring!");
      }
    } finally {
      setIsLoading(false);
    }
  }, [form, getDistrict, regionId]);

  useEffect(() => {
    if (regionId) {
      handleGetDistrict(regionId);
    }
  }, [handleGetDistrict, regionId]);

  return (
    <Form.Item
      label="Tuman"
      name="tuman"
      rules={[
        {
          required: true,
          message: "Tumanni tanlang!",
        },
      ]}
      hasFeedback
      validateStatus={status || formStatus}
      help={regionConErr ? "Ulanishda xatolik" : null}
    >
      {regionConErr ? (
        <Button
          onClick={handleGetDistrict}
          style={{ width: "100%" }}
          icon={<ReloadOutlined />}
          danger
        >
          Qayta yuklash
        </Button>
      ) : (
        <Select
          allowClear
          showSearch
          placeholder="Tumanni tanlash"
          loading={isLoading}
          filterOption={(inputValue, option) =>
            option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
          }
        >
          {districtOptions.map((option) => (
            <Select.Option value={option.id} key={option.id}>
              {option?.nomi}
            </Select.Option>
          ))}
        </Select>
      )}
    </Form.Item>
  );
}

export default SalesSelectDistrict;
