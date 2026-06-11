import { ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import ReactInputMask from "react-input-mask";
import MainModal from "../../../../components/common/modal/MainModal";
import {
  useAddSalesCustomerMutation,
  useEditSalesCustomerMutation,
  useGetSalesSupplierQuery,
} from "../../../../features/sales/customer/salesCustomerApiSlice";
import { useGetSalesRegionQuery } from "../../../../features/sales/salesApiSlice";
import SalesSelectDistrict from "./SalesSelectDistrict";

function SalesAddCustomerModal(props, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenAddCustomerModal,
  }));

  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isEditable, setIsEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [regionConErr, setRegionConErr] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [openAddCustomerModal, setOpenAddCustomerModal] = useState({
    open: false,
    data: null,
  });

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  /* API */
  const supplierRes = useGetSalesSupplierQuery();
  const allRegionRes = useGetSalesRegionQuery();
  const [addCustomer] = useAddSalesCustomerMutation();
  const [editCustomer] = useEditSalesCustomerMutation();

  useEffect(() => {
    if (allRegionRes?.isLoading) {
      setRegionConErr(false);
    } else if (allRegionRes?.isError) {
      setRegionConErr(true);
    }
  }, [allRegionRes?.isError, allRegionRes?.isLoading]);

  /* Memo */
  // Supplier options
  const supplierOptions = useMemo(() => {
    if (
      supplierRes.data?.success === true &&
      supplierRes.data?.data &&
      Array.isArray(supplierRes.data?.data)
    ) {
      return supplierRes.data.data;
    }
    return [];
  }, [supplierRes.data]);

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
        category_id: 1,
        dostavka_id: values?.supplier,
        fio: values?.fio,
        telefon: values?.telefon,
        chat_id: values?.chat_id || "",
        telefon2: values?.telefon || "",
        telefon3: values?.telefon || "",
        korxona: values?.korxona,
        manzil: values?.manzil,
        lokatsiya: values?.lokatsiya,
        viloyat_id: values?.viloyat,
        tuman_id: values?.tuman,
      };
      let resData = null;
      if (isEditable) {
        resData = await editCustomer({
          id: openAddCustomerModal?.data?.id,
          data
        }).unwrap();
      } else {
        resData = await addCustomer(data).unwrap();
      }

      if (resData?.success === true) {
        form.resetFields();
        setStatus("success");

        handleCloseAddCustomerModal()
        
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

  /* Form set values */
  const handleFormSetValues = (data) => {
    form.setFieldsValue({
      supplier: data?.dostavka_id,
      fio: data?.fio,
      telefon: data?.telefon,
      chat_id: data?.chat_id,
      korxona: data?.korxona,
      viloyat: data?.viloyat_id,
      tuman: data?.tuman_id,
      manzil: data?.manzil,
      lokatsiya: data?.lokatsiya,
    });
  };

  /* MODAL */
  const handleOpenAddCustomerModal = (data) => {
    form.resetFields();
    if (data) {
      setOpenAddCustomerModal({
        open: true,
        data,
      });
      setIsEditable(true);
      handleFormSetValues(data);
    } else {
      setOpenAddCustomerModal({
        open: true,
        data: null,
      });
      setIsEditable(false);
    }
  };
  const handleCloseAddCustomerModal = () =>
    setOpenAddCustomerModal({
      open: false,
      data: null,
    });

  return (
    <>
      {contextHolder}

      <MainModal
        open={openAddCustomerModal?.open}
        onClose={handleCloseAddCustomerModal}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label={"Dostavkachi"}
            name="supplier"
            rules={[
              {
                required: true,
                message: "Dostavkachini tanlang!",
              },
            ]}
            style={{ width: "100%" }}
            hasFeedback
            validateStatus={status}
          >
            <Select
              allowClear
              showSearch
              placeholder="Dostavkachini tanlash"
              loading={supplierRes?.isLoading}
              filterOption={(inputValue, option) =>
                option.children
                  .toLowerCase()
                  .indexOf(inputValue?.toLowerCase()) >= 0
              }
            >
              {supplierOptions.map((option) => (
                <Select.Option value={option.id} key={option.id}>
                  {option?.dostavchik}
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
            label="Telefon 1"
            name="telefon"
            hasFeedback
            validateStatus={status}
            rules={[
              {
                required: true,
                message: "Telefon talab qilinadi!",
              },
            ]}
            initialValue={998}
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
            label="Chat ID"
            name="chat_id"
            hasFeedback
            validateStatus={status}
          >
            <Input placeholder="Telegram chat id" />
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
          <SalesSelectDistrict
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
      </MainModal>
    </>
  );
}

export default forwardRef(SalesAddCustomerModal);
