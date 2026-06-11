import { Button, Card, List, Table, Tag, Tooltip } from "antd";
import React, { useRef, useState } from "react";

import MainModal from "../../../../components/common/modal/MainModal";
import MainCol from "../../../../components/ui/col/MainCol";
import { useReactToPrint } from "react-to-print";
import { PrinterFilled } from "@ant-design/icons";

function GrindOrderSalesItem({
  id,
  sotuvchi,
  partiyanomer,
  sana,
  status,
  izoh,
  product_list,
  handleOpenOrderModal,
}) {
  /* Ref */
  const printRef = useRef();
  /* State */
  const [openModal, setOpenModal] = useState(false);

  /* Modal */
  // products
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handlePrintData = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      {/* Products Modal */}
      <MainModal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <Button
            onClick={handlePrintData}
            icon={<PrinterFilled />}
            type="primary"
            shape="round"
          />
        </div>
        <div ref={printRef}>
          <Table
            pagination={false}
            size="small"
            columns={[
              {
                title: "ID",
                dataIndex: "product_id",
                key: "product_id",
              },
              {
                title: "Nomi",
                dataIndex: "product_name",
                key: "product_name",
              },
              {
                title: "Massa(kg)",
                dataIndex: "buyurtmamassa",
                key: "buyurtmamassa",
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (_, { status }) => {
                  const color =
                    status === "new" ? "cyan-inverse" : "blue-inverse";
                  return <Tag color={color}>{status.toUpperCase()}</Tag>;
                },
              },
            ]}
            rowKey={"product_id"}
            dataSource={product_list}
          />
        </div>
      </MainModal>

      <MainCol>
        <Card>
          <List>
            <List.Item>
              <b>{sotuvchi || "Sotuvchi ismi noma'lum"}</b>
            </List.Item>
            <List.Item>
              <span>Partiya nomeri:</span>
              <span>{partiyanomer}</span>
            </List.Item>
            <List.Item>
              <span>Sana:</span>
              <span>{sana}</span>
            </List.Item>
            <List.Item>
              <span>Status:</span>
              <Tag color="blue-inverse">{status}</Tag>
            </List.Item>
            <List.Item>
              <span>Mahsulotlar:</span>
              <Tooltip title="Mahsulotlarni ko'rish">
                <Button type="link" onClick={handleOpenModal}>
                  Mahsulotlar &nbsp;<b>{product_list?.length}</b>
                </Button>
              </Tooltip>
            </List.Item>
            <List.Item>
              <span>Izoh:</span>
              <span>{izoh}</span>
            </List.Item>
            <List.Item>
              <Tooltip title="Saqlash bo'limiga buyurtma berish">
                <Button
                  style={{ width: "100%", marginTop: "1rem" }}
                  type="primary"
                  onClick={() => handleOpenOrderModal(id)}
                >
                  Buyurtma berish
                </Button>
              </Tooltip>
            </List.Item>
          </List>
        </Card>
      </MainCol>
    </>
  );
}

export default GrindOrderSalesItem;
