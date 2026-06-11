import { Button, Form, Select, message } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useAddUploaderSetPolkaMutation } from "../../../../features/uploader/order/orderOfGrind/uploaderOrderOfGrindApiSlice";
import { useGetUploaderPolkaQuery } from "../../../../features/uploader/polka/uploaderPolkaApiSlice";
import { useAddUploaderRegrindSetPolkaMutation } from "../../../../features/uploader/regrind/uploaderRegrindApiSlice";
import MainModal from "../../../../components/common/modal/MainModal";

function UploaderOrderPutPolkaModal({ from }, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenModal,
  }));

  /* Forom */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "setPolkaOrder";

  /* API */
  const [addPolka] = useAddUploaderSetPolkaMutation();
  const [addRegrindPolka] = useAddUploaderRegrindSetPolkaMutation();
  const polkaDataRes = useGetUploaderPolkaQuery();

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

  /* State */
  const [openModal, setOpenModal] = useState({
    open: false,
    data: null,
  });

  /* Modal */
  const handleOpenModal = (orderId) => {
    setOpenModal({
      open: true,
      data: {
        orderId: orderId,
      },
    });
  };
  const handleCloseModal = () => {
    setOpenModal({
      open: false,
      data: null,
    });
  };

  /* Handle submit */
  const handleSubmit = async (values) => {
    if (!openModal?.data?.orderId) {
      message.error("Buyurtma ID si topilmadi!");
      return;
    }

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
        maydalash_id: openModal?.data?.orderId,
        polka_id: values?.polka,
      };
      let resData = null;
      if (from === "regrind") {
        resData = await addRegrindPolka(data).unwrap();
      } else {
        resData = await addPolka(data).unwrap();
      }
      if (resData?.success === true) {
        handleCloseModal();
        handleCloseModal();
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
      <MainModal open={openModal.open} onClose={handleCloseModal}>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Polkani tanlash"
            name="polka"
            rules={[
              {
                required: true,
                message: "Polkani tanlang!",
              },
            ]}
            hasFeedback
            validateStatus={status}
          >
            <Select
              allowClear
              showSearch
              placeholder="Polkani tanlash"
              loading={false}
              filterOption={(inputValue, option) =>
                option.searchOne
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0 ||
                option.searchTwo
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
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
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={isSubmitting}
            >
              Polkaga urish
            </Button>
          </Form.Item>
        </Form>
      </MainModal>
    </>
  );
}

export default forwardRef(UploaderOrderPutPolkaModal);
