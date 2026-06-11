import { PlusOutlined } from "@ant-design/icons";
import { Button, Segmented } from "antd";
import React, { useState } from "react";
import MainModal from "../../../components/common/modal/MainModal";
import Section from "../../../components/common/section/Section";
import AdminAddProductModal from "./components/AdminAddProductModal";
import AdminAddProductPrice from "./components/AdminAddProductPrice";
import AdminProductTable from "./components/AdminProductTable";

const tabs = [
  {
    value: 1,
    label: "Mahsulotlar",
  },
  {
    value: 2,
    label: "Mahsulotlarga narx qo'shish",
  },
];

function AdminProduct() {
  /* State */
  const [openAddWorkerModal, setOpenAddWorkerModal] = useState(false);
  /* State */
  const [selectedValue, setSelectedValue] = useState(1);

  /* MODAL */
  const handleOpenAddProductModal = () => setOpenAddWorkerModal(true);
  const handleCloseAddProductModal = () => setOpenAddWorkerModal(false);

  return (
    <>
      <MainModal open={openAddWorkerModal} onClose={handleCloseAddProductModal}>
        <AdminAddProductModal onClose={handleCloseAddProductModal} />
      </MainModal>

      <Segmented
        style={{ margin: "1rem 0" }}
        block
        options={tabs}
        value={selectedValue}
        onChange={setSelectedValue}
      />

      {selectedValue === 1 ? (
        <Section>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "1rem",
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenAddProductModal}
            >
              Mahsulot qo'shish
            </Button>
          </div>
          <AdminProductTable />
        </Section>
      ) : (
        <Section>
          <AdminAddProductPrice />
        </Section>
      )}
    </>
  );
}

export default AdminProduct;
