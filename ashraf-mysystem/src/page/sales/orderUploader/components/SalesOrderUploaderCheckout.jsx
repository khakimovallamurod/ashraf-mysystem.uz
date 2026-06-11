import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, Divider, List, Typography, message } from "antd";
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useState
} from "react";
import MainModal from "../../../../components/common/modal/MainModal";
import formatCurrency from "../../../../util/formatCurrency";
import SalesUploaderCheckout from "./SalesUploaderCheckout";

function SalesOrderUploaderCheckout({ productsData = [], onRestart }, ref) {
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
      productPrice: productsData.reduce(
        (a, b) => a + parseFloat(b?.total || 0),
        0
      ),
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

  const handleSuccess = () => {
    onRestart();
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
        <SalesUploaderCheckout
          onSuccess={handleSuccess}
          allProducts={allProducts}
          totalPrice={productPrice}
          onClose={handleCloseCheckoutModal}
          customerData={customerData}
        />
      </MainModal>

      {/* Content */}
      <div>
        {/* Card */}
        <Card style={{ height: "100%" }}>
        <Typography.Text>Rasmiylashtirish</Typography.Text>
            
          <Divider  />
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

export default memo(forwardRef(SalesOrderUploaderCheckout));
