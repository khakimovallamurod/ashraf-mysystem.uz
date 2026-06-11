import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, Divider, List, message } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import MainModal from "../../../../components/common/modal/MainModal";
import PrintChek from "../../../../components/common/printChek/PrintChek";
import MainLightTitle from "../../../../components/ui/title/MainLightTitle";
import formatCurrency from "../../../../util/formatCurrency";
import AgentCheckout from "./AgentCheckout";

function AgentOrderUploaderCheckout({ productsData = [], onRestart }, ref) {
  /* Ref */
  const printRef = useRef();

  /* State */
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [customerData, setCustomerData] = useState(null);

  useImperativeHandle(ref, () => {
    return {
      setCustomerData: (data) => setCustomerData(data),
    };
  });

  /* Memo */
  const { productCount, productPrice, allProducts } = useMemo(() => {   
    return {
      allProducts: [...productsData],
      productCount: productsData.length,
      productPrice: productsData.reduce((a, b) => parseFloat(a) + parseFloat(b?.total || 0), 0),
    };
  }, [productsData]);

  /* Modal */
  const handleOpenCheckoutModal = () => {
    if (allProducts.length) {
      setOpenCheckoutModal(true);
    } else {
      message.error("Sizda rasmiylashtirish uchun mahsulotlar mavjud emas!");
    }
  };
  const handleCloseCheckoutModal = () => setOpenCheckoutModal(false);

  /* Handle grind */
  const handlePrint = () => {
    printRef.current.print();
  };

  const handleSuccess = () => {
    onRestart();
    handlePrint();
    handleCloseCheckoutModal();
  };
  return (
    <>
      {/* Checkout modal */}
      <MainModal
        open={openCheckoutModal}
        onClose={handleCloseCheckoutModal}
        width={600}
      >
        <AgentCheckout
          onSuccess={handleSuccess}
          allProducts={allProducts}
          totalPrice={productPrice}
          onClose={handleCloseCheckoutModal}
          customerData={customerData}
        />
      </MainModal>

      {/* Print chek */}
      <PrintChek ref={printRef} printProducts={allProducts} />

      {/* Content */}
      <div>
        <Card style={{ height: "100%" }}>
          <MainLightTitle>Rasmiylashtirish</MainLightTitle>
          <Divider />
          <List>
            <List.Item style={{ display: "flex" }}>
              Jami mahsulot miqdori: <b>{productCount} ta</b>
            </List.Item>
            <List.Item style={{ display: "flex" }}>
              To'lanadigan narx: <b>{formatCurrency(productPrice)}</b>
            </List.Item>
            <List.Item>
              <Button
                type="primary"
                style={{ width: "100%" }}
                icon={<ShoppingCartOutlined />}
                onClick={handleOpenCheckoutModal}
              >
                Buyurtma berish
              </Button>
            </List.Item>
          </List>
        </Card>
      </div>
    </>
  );
}

export default forwardRef(AgentOrderUploaderCheckout);
