import { Button, Skeleton, message } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useGetProductStorageReportDetailMutation } from "../../../../features/productStorage/productStorageApiSlice";
import MainModal from "../../modal/MainModal";
import MainNumberFormat from "../../numberFormat/MainNumberFormat";
import MainPrintTableData from "../../printTableData/MainPrintTableData";
import { PrinterOutlined } from "@ant-design/icons";

/* Print table */
const printTableColumn = [
  {
    title: "Vaqt",
    dataIndex: "sana",
  },
  {
    title: "1 kg narx",
    dataIndex: "price",
  },
  {
    title: "Jami kg",
    dataIndex: "massa",
  },
  {
    title: "Summa",
    dataIndex: "summa",
  },
];

function ProductStorageShowReportDetailModal(props, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenModal,
  }));

  /* Ref */
  const printTableRef = useRef(null);

  /* State */
  const [openModal, setOpenModal] = useState(false);
  const [productStatus, setProductStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [tableData, setTableData] = useState([]);

  /* API */
  const [getReportDetailData] = useGetProductStorageReportDetailMutation();

  /* Modal */
  const handleOpenModal = ({ id, status }) => {
    setOpenModal({ open: true });
    handleGetData({ id, status });
  };
  const handleCloseModal = () => {
    setDetailData(null);
    setOpenModal({ open: false });
  };

  /* handleGetData */
  const handleGetData = async ({ id, status }) => {
    /* Loading */
    setIsSubmitting(true);
    setProductStatus(status);

    try {
      const resData = await getReportDetailData({ id, status }).unwrap();
      if (resData?.success === true) {
        /* Success */
        if (resData?.data) {
          setTableData([
            {
              sana: resData?.data?.sana,
              price: resData?.data?.price,
              massa: resData?.data?.massa,
              summa: resData?.data?.summa,
            },
          ]);
          setDetailData(resData?.data);
        } else {
          setDetailData(null);
        }
      } else if (resData?.success === false) {
        /* Error */

        if (resData?.message) {
          message.error(resData.message);
        }
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        message.warning("Ulanishda xatolik! Qaytadan urinib ko'ring!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintData = () => printTableRef.current.onPrint();

  return (
    <MainModal open={openModal.open} onClose={handleCloseModal}>
      {isSubmitting ? (
        <Skeleton active />
      ) : (
        <>
          <MainPrintTableData
            ref={printTableRef}
            columns={printTableColumn}
            data={tableData}
            rowKey={"key"}
            header={
              <table
                className="printCheckTable printTable borderRow"
                style={{ marginTop: "1rem" }}
              >
                <tbody>
                  <tr>
                    <td>Taminotchi:</td>
                    <td>
                      <b>{detailData?.taminotchi}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Taminotchi telefoni:</td>
                    <td>
                      <b>{detailData?.taminotchi_telefon}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Qassob:</td>
                    <td>
                      <b>{detailData?.qassob}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            }
          />

          <div style={{ padding: "1rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                {detailData?.javobgar && (
                  <h3>Javobgar: {detailData?.javobgar}</h3>
                )}
                {detailData?.taminotchi && (
                  <h3>Taminotchi: {detailData?.taminotchi}</h3>
                )}
                {detailData?.taminotchi && (
                  <h4>Qassob: {detailData?.qassob}</h4>
                )}
              </div>

              <Button
                onClick={handlePrintData}
                icon={<PrinterOutlined />}
                shape="round"
                type="primary"
                disabled={productStatus !== "olingan"}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2rem",
                marginTop: "1rem",
              }}
            >
              <div>
                {" "}
                <p>
                  Partiya raqami: <b>{detailData?.partiyanomer}</b>
                </p>
                <p>
                  Dona:{" "}
                  <b>
                    <MainNumberFormat value={detailData?.dona} />
                  </b>
                </p>
              </div>
              <div>
                <p>
                  Massa:{" "}
                  <b>
                    <MainNumberFormat value={detailData?.massa} /> kg
                  </b>
                </p>
                <p>
                  Narx:{" "}
                  <b>
                    <MainNumberFormat value={detailData?.price} /> so'm
                  </b>
                </p>
              </div>
              <div>
                <p>
                  Summa:{" "}
                  <b>
                    <MainNumberFormat value={detailData?.summa} /> so'm
                  </b>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </MainModal>
  );
}

export default forwardRef(ProductStorageShowReportDetailModal);
