import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {useReactToPrint} from "react-to-print";
import {v4 as uuidv4} from "uuid";
import MainNumberFormat from "../../../../../components/common/numberFormat/MainNumberFormat";
import PrintChekTable from "../../../../../components/common/printChek/PrintChekTable";
import {message} from "antd";
import PrintChekContent from "../../../../../components/common/printChek/PrintChekContent";

function UploaderProductsPrintChek(props, ref) {
  /* Handle prind with ref */
  useImperativeHandle(ref, () => ({
    onPrint,
  }));

  /* State */
  const [printData, setPrintData] = useState(null);

  /* Ref */
  const printRef = React.useRef(null);

  /* Memo */
  const tableData = useMemo(() => {
    if (printData?.product_list?.length) {
      return printData?.product_list.map((item) => {
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
      <PrintChekContent>
        <div>
          <small
            style={{marginBottom: "1rem", textAlign: "right", fontSize: "12px"}}
          >
            Chek raqami: {printData?.id}
          </small>
        </div>


        <table className="printCheckTable printTable border">
          <tbody>
          <tr>
            <td>Mijoz:</td>
            <td>{printData?.client}</td>
          </tr>
          {/* <tr>
            <td>Mijoz manzili:</td>
            <td>{printData?.customer?.location}</td>
          </tr> */}
          <tr>
            <td>Yetkazib beruvchi:</td>
            <td>{printData?.dostavchik}</td>
          </tr>
          <tr>
            <td>Izoh:</td>
            <td>{printData?.izoh}</td>
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
              dataIndex: "massa",
              key: "massa",
              render: (_, {massa}) => (
                <span>
                <MainNumberFormat value={massa}/>
              </span>
              ),
            },
          ]}
          data={tableData}
        />

      </PrintChekContent>

    </div>
  );
}

export default forwardRef(UploaderProductsPrintChek);
