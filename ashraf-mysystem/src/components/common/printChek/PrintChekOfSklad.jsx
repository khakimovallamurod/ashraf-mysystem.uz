import { List } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useReactToPrint } from "react-to-print";
import formatCurrency from "../../../util/formatCurrency";
import getCalcData from "../../../util/getCalcArrItem";
import MainNumberFormat from "../numberFormat/MainNumberFormat";
import PrintChekContent from "./PrintChekContent";

function PrintChekOfSklad(props, ref) {
  useImperativeHandle(ref, () => ({
    onPrint: handlePrint,
  }));

  /* Ref */
  const printRef = useRef(null);

  /* State */
  const [dataHeader, setDataHeader] = useState([]);
  const [dataFooter, setDataFooter] = useState([]);
  const [data, setData] = useState([]);
  const [mount, setMount] = useState(0);

  useEffect(() => {
    if (mount >= 1) {
      onPrint();
    }
    setMount((prev) => prev + 1);
  }, [dataHeader, dataFooter]);

  const handlePrint = ({ header = [], footer = [], data }) => {
    setDataHeader([...header]);
    setDataFooter({ ...footer });
    setData(data);
  };

  const onPrint = useReactToPrint({
    content: () => printRef?.current,
  });

  return (
    <div ref={printRef} className={"printContainer printCon"}>
      <PrintChekContent>
        <List bordered={false}>
          <List.Item
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            Taminotchi: <span>{data?.taminotchi}</span>
          </List.Item>
        </List>
        <table className="printCheckTable printTable border">
          <thead>
            <tr>
              <th>Yashik soni</th>
              <th>Tovuq soni</th>
              <th>Massa(kg)</th>
            </tr>
          </thead>
          <tbody>
            {dataHeader?.map((item) => (
              <tr key={item.id}>
                {/* {console.log(item)} */}
                <td>{item.boxCount}</td>
                <td>{item.chickenCount}</td>
                <td>
                  <MainNumberFormat value={item.mass} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {dataHeader?.length && (
          <table
            style={{ width: "100%", marginTop: "-2rem", fontSize: "11px" }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    width: "105px",
                    padding: "10px",
                    fontWeight: "bold",
                  }}
                >
                  <MainNumberFormat
                    value={getCalcData(data?.sourceData, "boxCount")}
                  />{" "}
                  ta
                </td>
                <td
                  style={{
                    width: "105px",
                    padding: "10px",
                    fontWeight: "bold",
                  }}
                >
                  <MainNumberFormat
                    value={getCalcData(data?.sourceData, "chickenCount")}
                  />{" "}
                  ta
                </td>
                <td
                  style={{
                    width: "105px",
                    padding: "10px",
                    fontWeight: "bold",
                  }}
                >
                  <MainNumberFormat
                    value={getCalcData(data?.sourceData, "mass")}
                  />{" "}
                  kg
                </td>
              </tr>
            </tbody>
          </table>
        )}

        <table className="printCheckTable printTable borderRow">
          <tbody>
            <tr>
              <td>Taminotchi</td>
              <td>{dataFooter?.taminotchi}</td>
            </tr>
            <tr>
              <td>Massa</td>
              <td>
                <MainNumberFormat value={dataFooter?.massa} /> kg
              </td>
            </tr>
            <tr>
              <td>Narxi</td>
              <td>{formatCurrency(dataFooter?.price)} so'm</td>
            </tr>
            <tr>
              <td>Dona</td>
              <td>
                <MainNumberFormat value={dataFooter?.dona} /> dona
              </td>
            </tr>
            <tr>
              <td>Summa</td>
              <td>{formatCurrency(dataFooter?.summa)} so'm</td>
            </tr>
            <tr>
              <td>Sana</td>
              <td>{dataFooter?.sana} </td>
            </tr>
          </tbody>
        </table>
      </PrintChekContent>
    </div>
  );
}

export default forwardRef(PrintChekOfSklad);
