import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { v4 as uuidv4 } from "uuid";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import formatCurrency from "../../../util/formatCurrency";
import LazyImage from "../lazyLoad/LazyImage";
import MainNumberFormat from "../numberFormat/MainNumberFormat";
import PrintChekTable from "./PrintChekTable";

function PrintChekOfSales(props, ref) {
  const { printData = [] } = props;
  const printRef = React.useRef();
  const userData = useSelector(selectCurrentUser);

  const tableData = useMemo(() => {
    if (printData?.productList?.length) {
      return printData.productList.map((item) => ({
        id: uuidv4(),
        name: item?.productName,
        price: item?.price,
        mass: item?.mass,
        completedMass: item?.completedMass,
        total: item?.total,
        supplier: item?.supplier,
        agent: item?.agent,
      }));
    }
    return [];
  }, [printData]);

  useImperativeHandle(ref, () => ({
    print: handlePrint,
  }));

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div
      ref={printRef}
      className={"printContainer"}
      style={{
        width: "55mm",
        maxWidth: "55mm",
        padding: "4px 2px",
        fontSize: "10px",
        color: "#111827",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <LazyImage imgUrl={"/images/custom-logo.png"} width={70} />
        <div style={{ fontWeight: 700, fontSize: "12px", marginTop: 4 }}>
          OFFICE ASHRAF SYSTEM
        </div>
        <div style={{ fontSize: "10px", marginTop: 2 }}>
          Chek raqami: {printData?.orderId}
        </div>
      </div>

      <table
        className="printCheckTable printTable border"
        style={{ fontSize: "10px" }}
      >
        <tbody>
          <tr>
            <td>Mijoz:</td>
            <td>{printData?.customer?.name}</td>
          </tr>
          <tr>
            <td>Manzil:</td>
            <td>{printData?.customer?.location}</td>
          </tr>
          <tr>
            <td>Telefon:</td>
            <td>{printData?.customer?.allTelefon?.[0]}</td>
          </tr>
          <tr>
            <td>Sana:</td>
            <td>{printData?.date}</td>
          </tr>
          <tr>
            <td>Sotuvchi:</td>
            <td>
              {userData?.name} {userData?.surname} {userData?.telefon}
            </td>
          </tr>
          <tr>
            <td>Agent:</td>
            <td>{printData?.agent}</td>
          </tr>
          <tr>
            <td>Yetkazuvchi:</td>
            <td>
              {printData?.supplier?.name} {printData?.supplier?.telefon}
            </td>
          </tr>
          <tr>
            <td>Eski qarz:</td>
            <td>{formatCurrency(printData?.customer?.old_balance)} so'm</td>
          </tr>
        </tbody>
      </table>

      <PrintChekTable
        columns={[
          {
            title: "Nomi",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Kg",
            dataIndex: "mass",
            key: "mass",
            render: (_, { completedMass }) => (
              <span>
                <MainNumberFormat value={completedMass} />
              </span>
            ),
          },
          {
            title: "Narx",
            dataIndex: "price",
            key: "price",
            render: (price) => <MainNumberFormat value={price} />,
          },
          {
            title: "Summa",
            dataIndex: "total",
            key: "total",
            render: (total) => <MainNumberFormat value={total} />,
          },
        ]}
        data={tableData}
      />

      <div
        style={{
          textAlign: "right",
          marginTop: "-1rem",
          marginBottom: "1rem",
          fontSize: "11px",
          fontWeight: "700",
          paddingTop: "8px",
        }}
      >
        <MainNumberFormat value={printData?.allPoductTotalPrice} /> so'm
      </div>

      <table
        className="printCheckTable printTable borderRow"
        style={{ fontSize: "10px" }}
      >
        <tbody>
          <tr>
            <td>Mijoz qarzi:</td>
            <td>
              <MainNumberFormat value={printData?.afterBalance} /> so'm
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          marginTop: "1rem",
          borderTop: "1px dashed #9ca3af",
          paddingTop: 8,
        }}
      >
        <p style={{ margin: 0, textAlign: "center", fontSize: "10px" }}>
          Xaridingiz uchun rahmat
        </p>
      </div>
    </div>
  );
}

export default forwardRef(PrintChekOfSales);
