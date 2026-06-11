import { ReloadOutlined, SaveOutlined, AimOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import ReactInputMask from "react-input-mask";
import { useGetAgentRegionQuery } from "../../../../../features/agent/agentApiSlice";
import {
  useAddAgentCustomerMutation,
  useGetAgentCustomerCategoryQuery,
} from "../../../../../features/agent/customer/agentCustomerApiSlice";
import AgentSelectDistrict from "./AgentSelectDistrict";

function AgentAddCustomerModal() {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [regionConErr, setRegionConErr] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  /* API */
  const customerCategoryRes = useGetAgentCustomerCategoryQuery();
  const allRegionRes = useGetAgentRegionQuery();
  const [addCustomer] = useAddAgentCustomerMutation();

  useEffect(() => {
    if (allRegionRes?.isLoading) {
      setRegionConErr(false);
    } else if (allRegionRes?.isError) {
      setRegionConErr(true);
    }
  }, [allRegionRes?.isError, allRegionRes?.isLoading]);

  /* Memo */
  // Customer category options
  const customerCategoryOptions = useMemo(() => {
    if (
      customerCategoryRes.data?.success === true &&
      customerCategoryRes.data?.data &&
      Array.isArray(customerCategoryRes.data?.data)
    ) {
      return customerCategoryRes.data.data;
    }
    return [];
  }, [customerCategoryRes.data]);
  // Region options
  const allRegionOptions = useMemo(() => {
    if (
      allRegionRes?.data?.success === true &&
      allRegionRes?.data?.data &&
      Array.isArray(allRegionRes?.data?.data)
    ) {
      /* Set initial values */
      const res = allRegionRes?.data?.data.find((item) => item?.id === "7");
      if (res) {
        setTimeout(() => {
          form.setFieldValue("viloyat", res.id);
          setSelectedRegion(res.id);
        }, 400);
      }
      /* Status */
      return allRegionRes?.data?.data;
    }

    return [];
  }, [allRegionRes?.data?.data, allRegionRes?.data?.success, form]);

  const handleChangeRegion = (id) => {
    setSelectedRegion(id);
    form.setFieldValue("tuman", null);
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
        category_id: values?.customerCategory,
        fio: values?.fio,
        telefon: values?.telefon,
        telefon2: values?.telefon2,
        telefon3: values?.telefon3,
        korxona: values?.korxona,
        manzil: values?.manzil,
        lokatsiya: values?.lokatsiya,
        viloyat_id: values?.viloyat,
        tuman_id: values?.tuman,
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
      const resData = await addCustomer(data).unwrap();
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

  const keyGetLocation = "getCustomerLocation";

  function handleLocationClick() {
    messageApi.open({
      key: keyGetLocation,
      type: "loading",
      content: "Loading...",
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({ latitude, longitude });
    setTimeout(() => {
      form.setFieldValue("myLocation", JSON.stringify({ latitude, longitude }));
      messageApi.open({
        key: keyGetLocation,
        type: "success",
        content: "Manzilingiz olindi",
      });
    }, 300);
  }

  function error() {
    messageApi.open({
      key: keyGetLocation,
      type: "error",
      content: "Unable to retrieve your location",
    });
  }

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={"Mijoz toifasi"}
          name="customerCategory"
          rules={[
            {
              required: true,
              message: "Mijoz toifasini tanlang!",
            },
          ]}
          style={{ width: "100%" }}
          hasFeedback
          validateStatus={status}
        >
          <Select
            allowClear
            showSearch
            placeholder="Mijoz toifasini tanlash"
            loading={customerCategoryRes?.isLoading}
            filterOption={(inputValue, option) =>
              option.children
                .toLowerCase()
                .indexOf(inputValue?.toLowerCase()) >= 0
            }
          >
            {customerCategoryOptions.map((option) => (
              <Select.Option value={option.id} key={option.id}>
                {option?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="FIO"
          name="fio"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "FIO talab qilinadi!",
            },
          ]}
        >
          <Input placeholder="FIO kiritish" autoFocus={true} />
        </Form.Item>
        <Form.Item
          label="Telefon"
          name="telefon"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Telefon talab qilinadi!",
            },
          ]}
        >
          <ReactInputMask mask="+999(99)999-99-99">
            {(inputProps) => (
              <Input
                {...inputProps}
                placeholder="Telefon kiritish"
                type="tel"
              />
            )}
          </ReactInputMask>
        </Form.Item>
        <Form.Item
          label="Telefon 2"
          name="telefon2"
          hasFeedback
          validateStatus={status}
        >
          <ReactInputMask mask="+999(99)999-99-99">
            {(inputProps) => (
              <Input
                {...inputProps}
                placeholder="Telefon kiritish"
                type="tel"
              />
            )}
          </ReactInputMask>
        </Form.Item>
        <Form.Item
          label="Telefon 3"
          name="telefon3"
          hasFeedback
          validateStatus={status}
        >
          <ReactInputMask mask="+999(99)999-99-99">
            {(inputProps) => (
              <Input
                {...inputProps}
                placeholder="Telefon kiritish"
                type="tel"
              />
            )}
          </ReactInputMask>
        </Form.Item>
        <Form.Item
          label="Korxona"
          name="korxona"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Korxona talab qilinadi!",
            },
          ]}
        >
          <Input placeholder="Korxona kiritish" />
        </Form.Item>

        {/* Select region */}
        <Form.Item
          label="Viloyat"
          name="viloyat"
          rules={[
            {
              required: true,
              message: "Viloyatni tanlang!",
            },
          ]}
          help={regionConErr ? "Ulanishda xatolik" : null}
          hasFeedback
          validateStatus={status || (regionConErr ? "error" : "")}
        >
          {regionConErr ? (
            <Button
              onClick={allRegionRes?.refetch}
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
              placeholder="Viloyatni tanlash"
              loading={allRegionRes.isLoading}
              onChange={handleChangeRegion}
              filterOption={(inputValue, option) =>
                option.children
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {allRegionOptions.map((option) => (
                <Select.Option value={option.id} key={option.id}>
                  {option?.nomi}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        {/* Select district */}
        <AgentSelectDistrict
          status={status}
          form={form}
          regionId={selectedRegion}
        />

        <Form.Item
          label="Manzil"
          name="manzil"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Manzil talab qilinadi!",
            },
          ]}
        >
          <Input placeholder="Manzil kiritish" />
        </Form.Item>

        <Form.Item
          label="Xaritadagi manzili"
          name="lokatsiya"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Xaritadagi manzili qilinadi!",
            },
          ]}
        >
          <Input placeholder="Xaritadagi manzili kiritish" />
        </Form.Item>

        <Form.Item
          label="Men turgan joy"
          name="myLocation"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Turgan joy talab qilinadi!",
            },
          ]}
        >
          <div>
            <Input style={{ display: "none" }} />
            <Button
              style={{ width: "100%" }}
              icon={<AimOutlined />}
              onClick={handleLocationClick}
            >
              Men turgan
            </Button>
          </div>
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

export default AgentAddCustomerModal;
