import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import MainModal from "../../../components/common/modal/MainModal";
import { useGetGrindProductOutItemMutation } from "../../../features/grindProduct/order/grindOrderStorageApiSlice";
import { Button, Table, Tag, message } from "antd";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import { PrinterOutlined } from "@ant-design/icons";
import QrCodePrint from "../../../components/common/qrCodePrind/QrCodePrint";

function GrindOutProductViewDetailItemsModal(props, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenModal,
  }));

  /* Ref */
  const printRef = useRef(null);
  /* State */
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productItemTableData, setProductItemTableData] = useState([]);
  const [partiya, setPartiya] = useState("");

  /* API */
  const [getData] = useGetGrindProductOutItemMutation();

  /* Modal */
  const handleOpenModal = ({ partiyaId, productId }) => {
    handleGetPolkaByDepartment({ partiyaId, productId });
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  /* Handle get Data */
  const handleGetPolkaByDepartment = async ({ partiyaId, productId }) => {
    /* Set Event */
    setIsSubmitting(true);
    try {
      const resData = await getData({ partiyaId, productId }).unwrap();
      if (resData?.success === true) {
        if (resData?.data && resData?.data && resData?.data[0]) {
          if (
            resData?.data[0]?.product_list &&
            resData?.data[0]?.product_list?.length
          ) {
            setPartiya(resData?.data[0]?.partiyanomer);
            setProductItemTableData(resData?.data[0]?.product_list);
          }
        }
      } else if (resData?.success === false) {
        if (resData?.message) {
          message.error(resData?.message);
        }
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        message.warning(`Ulanishda xatolik! Qaytadan urinib ko'ring!`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /*  HANDLE PRINT  */
  const handlePrintPart = (data) => {
    printRef.current.onPrint(data);
  };

  return (
    <>
      {/* Print */}
      <QrCodePrint ref={printRef} />

      <MainModal open={openModal} onClose={handleCloseModal}>
        <Table
          loading={isSubmitting}
          columns={[
            {
              title: "Mahsulot nomi",
              dataIndex: "product_name",
              key: "product_name",
              width: 100,
            },
            {
              title: "Polka",
              dataIndex: "polka_name",
              key: "polka_name",
              width: 100,
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              width: 100,
            },
            {
              title: "Massa(kg)",
              dataIndex: "massa",
              key: "massa",
              width: 100,
              render: (_, { massa }) => <MainNumberFormat value={massa} />,
            },
            {
              title: "Amal",
              key: "operation",
              fixed: "right",
              width: 60,
              align: "center",
              render: (
                { product_id, vaqt, massa, product_name, polka_id },
                item
              ) => (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    size="small"
                    icon={<PrinterOutlined />}
                    style={polka_id ? { background: "#981bf7" } : null}
                    disabled={!polka_id}
                    type="primary"
                    onClick={() => {
                      handlePrintPart({
                        productName: product_name,
                        partiyanomer: partiya,
                        massa,
                        sana: vaqt,
                        qrData: {
                          polka_id,
                          partiyanomer: partiya,
                          product_id: product_id,
                        },
                      });
                    }}
                  />
                </div>
              ),
            },
          ]}
          dataSource={productItemTableData}
          rowKey={"key"}
          pagination={false}
        />
      </MainModal>
    </>
  );
}

export default forwardRef(GrindOutProductViewDetailItemsModal);
