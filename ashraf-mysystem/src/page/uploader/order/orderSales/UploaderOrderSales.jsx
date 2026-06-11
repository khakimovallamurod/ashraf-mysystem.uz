import { ReloadOutlined } from "@ant-design/icons";
import { Button, Divider, Select, Typography } from "antd";
import React, { useMemo, useState } from "react";
import MainModal from "../../../../components/common/modal/MainModal";
import MainRow from "../../../../components/ui/row/MainRow";
import { useGetSalesSupplierQuery } from "../../../../features/sales/customer/salesCustomerApiSlice";
import { useGetUploaderOrderSalesInProcessQuery } from "../../../../features/uploader/order/orderOfSales/uploaderOrderOfSalesApiSlice";
import UploaderOrderSalesGive from "./UploaderOrderSalesGive";
import UploaderOrderSalesItem from "./UploaderOrderSalesItem";

function UploaderOrderSales() {
  // modal
  const [openSetPolkaModal, setOpenSetGiveOrderModal] = useState({
    open: false,
    item: null,
  });

  /* State */
  const [count, setCount] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  /* API */
  const supplierRes = useGetSalesSupplierQuery();
  const { data, isLoading, refetch } = useGetUploaderOrderSalesInProcessQuery();

  /* Sales in proccess */
  const list = useMemo(() => {
    if (data?.success === true && data?.data && data?.data?.length) {
      if (selectedSupplier) {
        console.log(selectedSupplier);
        return data?.data.filter(
          (item) => item.dostavka_id === selectedSupplier
        );
      }

      return data?.data;
    }
    return [];
  }, [data, selectedSupplier]);

  // Customer category options
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

  /* Modal */
  const handleOpenSetPolkaModal = (item) => {
    setOpenSetGiveOrderModal({
      open: true,
      item: item,
    });
  };
  const handleCloseSetGiveOrderModal = () => {
    setOpenSetGiveOrderModal({ open: false, item: null });
    setCount((prev) => prev + 1);
  };

  return (
    <>
      <MainModal
        open={openSetPolkaModal.open}
        onClose={handleCloseSetGiveOrderModal}
      >
        <UploaderOrderSalesGive
          orderData={openSetPolkaModal.item}
          onClose={handleCloseSetGiveOrderModal}
          openCount={count}
        />
      </MainModal>

      <div style={{ padding: "1.2rem 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            paddingRight: "1rem",
          }}
        >
          <Typography.Title level={5}>
            Sotuvdan tushgan <br /> buyurtmalar{" "}
            <b style={{ opacity: 0.5 }}>{list.length} ta</b>
          </Typography.Title>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ width: 173 }}>
              <Select
                style={{ width: "100%" }}
                allowClear
                showSearch
                placeholder="Dostavkachini tanlash"
                loading={supplierRes?.isLoading}
                filterOption={(inputValue, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) >= 0
                }
                onChange={setSelectedSupplier}
              >
                {supplierOptions.map((option) => (
                  <Select.Option value={option.id} key={option.id}>
                    {option?.dostavchik}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              loading={isLoading}
              onClick={refetch}
            >
              Yangilash
            </Button>
          </div>
        </div>

        <Divider />
        <MainRow>
          {isLoading
            ? Array(5)
                .fill()
                .map((_, index) => (
                  <UploaderOrderSalesItem key={index} isLoading={true} />
                ))
            : list.map((item) => (
                <UploaderOrderSalesItem
                  key={item.id}
                  {...item}
                  handleOpenModal={handleOpenSetPolkaModal}
                />
              ))}
        </MainRow>
      </div>
    </>
  );
}

export default UploaderOrderSales;
