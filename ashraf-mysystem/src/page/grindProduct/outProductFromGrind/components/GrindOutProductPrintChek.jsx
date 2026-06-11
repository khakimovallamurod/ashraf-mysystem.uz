import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useReactToPrint } from "react-to-print";
import PrintChekContent from "../../../../components/common/printChek/PrintChekContent";
import { formatFloatNumber } from "../../../../util/formatFloatNumber";

function GrindOutProductPrintChek(props, ref) {
  useImperativeHandle(ref, () => ({
    onPrint: handlePrintAndSetData,
  }));

  /* Ref */
  const expandTableRef = useRef(null);

  /* State */
  const [tableData, setTableData] = useState([]);
  const [mount, setMount] = useState(0);

  useEffect(() => {
    if (mount >= 1) {
      handlePrint();
    }

    setMount((prev) => prev + 1);
  }, [tableData]);

  const handlePrintAndSetData = (data = []) => {
    if (!data.length) return;

    setTableData([...data]);
  };

  /* Handle print */
  const handlePrint = useReactToPrint({
    content: () => expandTableRef.current,
  });

  return (
    <div ref={expandTableRef} className={"printContainer"}>
      <PrintChekContent>
        <table className="printCheckTable printTable border">
          <thead>
            <tr>
              <th>Mahsulot</th>
              <th>Massasi (kg)</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{formatFloatNumber(item.mass)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table
          className="printCheckTable printTable"
          style={{ marginTop: "-2rem" }}
        >
          <tbody>
            <tr>
              <td style={{ width: "120px" }}></td>
              <td>
                <div style={{ width: "90px", wordWrap: "break-word" }}>
                  {formatFloatNumber(
                    tableData?.reduce((a, b) => a + parseFloat(b?.mass), 0)
                  )}kg
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </PrintChekContent>
    </div>
  );
}

export default forwardRef(GrindOutProductPrintChek);
