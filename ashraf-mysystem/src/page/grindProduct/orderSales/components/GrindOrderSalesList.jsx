import {Button, Card, Form, message, Row} from "antd";
import React, {useState} from "react";

import MainModal from "../../../../components/common/modal/MainModal";
import GrindOrderSalesItem from "./GrindOrderSalesItem";
import {
  useAddGrindPlacingOrderToStorageMutation
} from "../../../../features/grindProduct/order/grindOrderSalesApiSlice";
import MainCol from "../../../../components/ui/col/MainCol";
import MainInputMass from "../../../../components/ui/inputMass/MainInputMass";
import removeComma from "../../../../util/removeComma";

function GrindOrderSalesList({ list = [], isLoading }) {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [openPlacingOrderModal, setOpenPlacingOrderModal] = useState({
    productId: null,
    open: false,
  });

  /* API */
  const [addOrderToStorage] = useAddGrindPlacingOrderToStorageMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addOrderToStorage";

  /* Modal */
  // placing order
  const handleOpenPlacingOrderModal = (productId) => {
    const product = list.find((item) => item.id === productId);
    if (product) {
      /* Mass summ */
      let massSumm = 0;
      if(product?.product_list){
        product?.product_list.forEach(item => {
          massSumm += item.buyurtmamassa?parseFloat(item.buyurtmamassa):0
        })
      }
      form.setFieldValue('mass', massSumm)
      setOpenPlacingOrderModal({
        open: true,
        productId,
      });
    } else {
      message.error("Mahsulotni ID si topilmadi!");
    }
  };
  const handleClosePlacingOrderModal = () =>
    setOpenPlacingOrderModal({ productId: null, open: false });

  const handleSubmit = async (values) => {
    
    /* Set Event */
    setIsSubmitting(true);
    /* Set status */
    setFormStatus("validating");
    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const data = {
        massa: removeComma(values.mass),
        reply_id: openPlacingOrderModal.productId,
      };
      const resData = await addOrderToStorage(data).unwrap();
      if (resData?.success === true) {
        form.resetFields();
        setFormStatus("success");
        handleClosePlacingOrderModal();
        if (resData?.message) {
          messageApi.open({
            key,
            type: "success",
            content: resData?.message,
          });
        }
      } else if (resData?.success === false) {
        setFormStatus("error");
        if (resData?.message) {
          messageApi.open({
            key,
            type: "error",
            content: resData?.message,
          });
        }
      }
      setTimeout(() => {
        setFormStatus("");
      }, 2000);
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        setFormStatus("warning");
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

  return (
    <>
      {contextHolder}

      {/* Placing order modal */}
      <MainModal
        open={openPlacingOrderModal.open}
        onClose={handleClosePlacingOrderModal}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
        >
          {/*Mass*/}
          <MainInputMass />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={isSubmitting}
            >
              Buyurtma berish
            </Button>
          </Form.Item>
        </Form>
      </MainModal>

      {isLoading ? (
        <Row style={{ width: "100%" }} gutter={[16, 16]}>
          {Array(5)
            .fill("")
            .map((_, index) => (
              <MainCol key={index}>
                <Card
                  style={{
                    width: "100%",
                  }}
                  loading={true}
                ></Card>
              </MainCol>
            ))}
        </Row>
      ) : (
        <Row style={{ width: "100%" }} gutter={[16, 16]}>
          {list.map((item) => (
            <GrindOrderSalesItem
              {...item}
              key={item.id}
              handleOpenOrderModal={handleOpenPlacingOrderModal}
            />
          ))}
        </Row>
      )}
    </>
  );
}

export default GrindOrderSalesList;
