import { Divider, Table, Typography } from "antd";
import React, { useRef, useState } from "react";
import MainModal from "../../../common/modal/MainModal";
import MainRow from "../../../ui/row/MainRow";
import SupplierOrderSalesGive from "./SupplierOrderSalesGive";
import SupplierOrderSalesItem from "./SupplierOrderSalesItem";
import SupplierChangeOrderModal from "./SupplierChangeOrderModal";
import MainNumberFormat from "../../../common/numberFormat/MainNumberFormat";

function SupplierOrderSales({ list = [], isLoading }) {
  /* Ref */
  const changeOrderModalRef = useRef(null);

  // modal
  const [openGiveOrderModal, setOpenGiveOrderModal] = useState({
    open: false,
    orderId: null,
  });
  const [openProductsModal, setOpenProductsModal] = useState({
    open: false,
    items: [],
  });

  /* Modal */
  // change order modal
  const handleOpenChangeOrderModal = (orderId) => {
    changeOrderModalRef.current?.onOpen(orderId);
  };

  // products
  const handleOpenProductsModal = ({ id, items }) => {
    const res = list.find((item) => item.id === id);

    if (res) {
      setOpenProductsModal({
        open: true,
        items: [...items],
      });
    }
  };

  const handleCloseProductsModal = () =>
    setOpenProductsModal({
      open: false,
      items: [],
    });

  /* Modal */
  const handleOpenGiveOrderModal = ({ id }) => {
    const res = list.find((item) => item.id === id);

    if (res) {
      setOpenGiveOrderModal({
        open: true,
        orderId: id,
      });
    }
  };
  const handleCloseOpenGiveOrderModal = () =>
    setOpenGiveOrderModal({ open: false, orderId: null });

  return (
    <>
      <SupplierChangeOrderModal ref={changeOrderModalRef} />

      {/* Products Modal */}
      <MainModal
        open={openProductsModal?.open}
        onClose={handleCloseProductsModal}
      >
        <Table
          columns={[
            {
              title: "Massa(kg)",
              dataIndex: "mass",
              key: "mass",
              render: (mass) => <MainNumberFormat value={mass} />,
            },
            {
              title: "Narxi",
              dataIndex: "price",
              key: "price",
              render: (price) => <MainNumberFormat value={price} />,
            },
            {
              title: "Summa",
              dataIndex: "summ",
              key: "summ",
              render: (summ) => <MainNumberFormat value={summ} />,
            },
            {
              title: "Mahsulotlar",
              dataIndex: "completedCount",
              key: "completedCount",
              render: (completedCount) => (
                <MainNumberFormat value={completedCount} />
              ),
            },
          ]}
          dataSource={openProductsModal?.items}
        />
      </MainModal>

      {/* Order give */}
      <MainModal
        open={openGiveOrderModal.open}
        onClose={handleCloseOpenGiveOrderModal}
      >
        <SupplierOrderSalesGive
          orderId={openGiveOrderModal.orderId}
          onClose={handleCloseOpenGiveOrderModal}
        />
      </MainModal>

      <div style={{ padding: "1.2rem 0" }}>
        <Typography.Title level={4}>
          Sotuvdan tushgan buyurtmalar{" "}
          <b style={{ opacity: 0.5 }}>{list.length} ta</b>
        </Typography.Title>
        <Divider />
        <MainRow>
          {isLoading
            ? Array(5)
                .fill()
                .map((_, index) => (
                  <SupplierOrderSalesItem key={index} isLoading={true} />
                ))
            : list.map((item) => (
                <SupplierOrderSalesItem
                  key={item.id}
                  {...item}
                  handleOpenChangeOrderModal={handleOpenChangeOrderModal}
                  handleOpenModal={handleOpenGiveOrderModal}
                  handleOpenProductsModal={handleOpenProductsModal}
                />
              ))}
        </MainRow>
      </div>
    </>
  );
}

export default SupplierOrderSales;
