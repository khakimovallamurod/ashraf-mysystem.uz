import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {useSelector} from "react-redux";
import {useReactToPrint} from "react-to-print";
import {v4 as uuidv4} from "uuid";
import LazyImage from "../../../../../components/common/lazyLoad/LazyImage";
import MainNumberFormat from "../../../../../components/common/numberFormat/MainNumberFormat";
import PrintChekTable from "../../../../../components/common/printChek/PrintChekTable";
import {selectCurrentUser} from "../../../../../features/auth/authSlice";
import formatCurrency from "../../../../../util/formatCurrency";
import {message} from "antd";

function UploaderPrintChek(props, ref) {
  /* Handle prind with ref */
  useImperativeHandle(ref, () => ({
    onPrint,
  }));

  /* State */
  const [printData, setPrintData] = useState(null);

  /* Ref */
  const printRef = React.useRef(null);

  const userData = useSelector(selectCurrentUser);

  /* Memo */
  const tableData = useMemo(() => {
    if (printData?.productList?.length) {
      return printData?.productList.map((item) => {
        return {
          ...item,
          id: uuidv4(),
        };
      });
    }
    return [];
  }, [printData]);

  const onPrint = (data) => {

    if (!data) {
      message.error("Print qilish uchun ma'lumot yetarli emas!")
      return;
    }

    setPrintData(data);

    const time = setTimeout(() => {
      handlePrint()
      clearTimeout(time)
    }, [])
  };

  /* Handle prind */
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  }); 
  return (
    <div ref={printRef} className={"printContainer"}>
      <LazyImage imgUrl={"/images/custom-logo.png"} width={120}/>

      <p style={{marginBottom: "1rem"}}>My system</p>
      <div>
        <small
          style={{marginBottom: "1rem", textAlign: "right", fontSize: "12px"}}
        >
          Chek raqami: {printData?.orderId}
        </small>
      </div>

      <table className="printCheckTable printTable border">
        <tbody>
        <tr>
          <td>Mijoz:</td>
          <td>{printData?.customer?.name}</td>
        </tr>
        <tr>
          <td>Mijoz manzili:</td>
          <td>{printData?.customer?.location}</td>
        </tr>
        <tr>
          <td>Mijoz telefon:</td>
          <td>{printData?.customer?.allTelefon[0]}</td>
        </tr>
        <tr>
          <td>Sana:</td>
          <td>{printData?.date}</td>
        </tr>
        <tr>
          <td>Telefon</td>
          <td>+998(93)-995-16-95</td>
        </tr>
        <tr>
          <td>Sotuvchi</td>
          <td>
            <div>
              {userData?.name} {userData?.surname} {userData?.telefon}
            </div>
          </td>
        </tr>
        <tr>
          <td>Agent:</td>
          <td>{printData?.agent}</td>
        </tr>
        <tr>
          <td>Yetkazib beruvchi:</td>
          <td>
            <div>
              {printData?.supplier?.name} {printData?.supplier?.telefon}
            </div>
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
            dataIndex: "product_name",
            key: "product_name",
          },
          {
            title: "kg",
            dataIndex: "tayyorlandi",
            key: "tayyorlandi",
            render: (_, {tayyorlandi}) => (
              <span>
                <MainNumberFormat value={tayyorlandi}/>
              </span>
            ),
          },
          {
            title: "Narxi so'm",
            dataIndex: "price",
            key: "price",
            render: (price) => <MainNumberFormat value={price}/>,
          },
          {
            title: "Summa",
            dataIndex: "summa",
            key: "summa",
            render: (total) => <MainNumberFormat value={total}/>,
          },
        ]}
        data={tableData}
      />
      <div
        style={{
          textAlign: "right",
          marginTop: "-2rem",
          marginBottom: "2rem",
          fontSize: "11px",
          fontWeight: "500",
          paddingTop: "10px",
        }}
      >
        <MainNumberFormat value={printData?.allPoductTotalPrice}/> so'm
      </div>

      <table className="printCheckTable printTable borderRow">
        <tbody>
        <tr>
          <td>Mijoz qarzi:</td>
          <td>
            <MainNumberFormat value={printData?.afterBalance}/> so'm
          </td>
        </tr>
        </tbody>
      </table>

      <div
        style={{
          marginTop: "1rem",
          borderTop: "1px solid",
        }}
      >
        <p
          style={{
            paddingBottom: ".5rem",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          {/* Comment */}
        </p>
      </div>
    </div>
  );
}

export default forwardRef(UploaderPrintChek);
