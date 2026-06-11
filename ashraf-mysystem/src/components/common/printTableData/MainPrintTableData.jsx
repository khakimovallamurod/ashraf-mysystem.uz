import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useReactToPrint } from "react-to-print";
import formatCurrency from "../../../util/formatCurrency";
import styles from "./printTableData.module.css";
import PrintChekContent from "../printChek/PrintChekContent";

function MainPrintTableData(
  { columns, data, footer = "", header = "", rowKey = "id" },
  ref
) {
  useImperativeHandle(ref, () => ({
    onPrint: handlePrint,
  }));

  /* Ref */
  const expandTableRef = useRef(null);

  /* State */
  const [tableColumns, setTableColumns] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const newColumn = [];
    columns?.forEach((item) => {
      if (
        item.dataIndex === "operation" ||
        item?.expand ||
        !item.title ||
        item.title.toLowerCase() === "id"
      )
        return;

      newColumn.push({
        title: item.title,
        dataIndex: item.dataIndex,
      });
    });
    setTableColumns([...newColumn]);
  }, [columns]);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handlePrint = useReactToPrint({
    content: () => expandTableRef.current,
  });

  return (
    <div ref={expandTableRef} className={styles.printContainer}>
      <PrintChekContent>
        {header}
        <table className="printTable border">
          <thead>
            <tr>
              {tableColumns.map((item, index) => (
                <th key={index}>{item.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index}>
                {tableColumns.map((innerItem, inIndex) => (
                  <td key={inIndex}>
                    {!isNaN(item[innerItem.dataIndex])
                      ? formatCurrency(item[innerItem.dataIndex])
                      : item[innerItem.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {footer}
      </PrintChekContent>
    </div>
  );
}

export default forwardRef(MainPrintTableData);
