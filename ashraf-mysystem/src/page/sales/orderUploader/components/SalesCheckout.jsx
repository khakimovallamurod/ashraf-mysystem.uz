import { Form } from "antd";
import React, { useMemo } from "react";
import Checkout from "../../../../components/common/checkout/Checkout";
import { useGetSalesCustomerQuery } from "../../../../features/sales/customer/salesCustomerApiSlice";
import { useAddSalesPlacingOrderToUploaderMutation } from "../../../../features/sales/salesApiSlice";
import SalesAddCustomerModal from "../../customer/components/SalesAddCustomerModal";

function SalesCheckout({ onSuccess, allProducts, totalPrice, onClose }) {
  /* Form */
  const [form] = Form.useForm();

  /* API */
  const [addOrder] = useAddSalesPlacingOrderToUploaderMutation();
  const customerRes = useGetSalesCustomerQuery();

  /* Memo */
  const customerOptions = useMemo(() => {
    if (
      customerRes?.data?.success === true &&
      customerRes?.data?.data &&
      Array.isArray(customerRes?.data?.data)
    ) {
      return customerRes?.data.data;
    }
    return [];
  }, [customerRes?.data]);

  return (
    <Checkout
      products={allProducts}
      totalPrice={totalPrice}
      onClose={onClose}
      onSuccess={onSuccess}
      form={form}
      addOrder={addOrder}
      customerOptions={customerOptions}
      customerLoading={customerRes?.isLoading}
      addCustomerModal={<SalesAddCustomerModal />}
    />
  );
}

export default SalesCheckout;
