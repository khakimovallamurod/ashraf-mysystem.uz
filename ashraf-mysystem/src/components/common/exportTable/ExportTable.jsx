import { UploadOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { memo, useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { formatFloatNumber } from "../../../util/formatFloatNumber";
import styles from "./exportTable.module.css";

function ExportTable({
  columns = [],
  data = [],
  fileName = "My System",
  tableBody,
}) {
  /* Ref */
  const exportTableRef = useRef(null);

  /* State */
  const [tableColumns, setTableColumns] = useState([]);

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
        render: item?.render,
      });
    });
    setTableColumns([...newColumn]);
  }, [columns]);

  const checkExportData = (data) => {
    if (!data || !data?.length) {
      message.error("Export qilish uchun ma'lumot mavjud emas!");
      return false;
    }

    return true;
  };

  /* Export excel */
  const onExportExcel = (data) => {
    if (!checkExportData(data)) return;
    /* Export */
    onDownload();
  };

  /* Excel */
  const { onDownload } = useDownloadExcel({
    currentTableRef: exportTableRef.current,
    filename: fileName,
    sheet: "Data",
  });

  /* Pdf */
  const onExportToPdf = (data) => {
    if (!checkExportData(data)) return;

    const sortColumns = [];
    columns.forEach((item) => {
      if (item.dataIndex === "operation") return;
      if (item.dataIndex === "id") return;

      sortColumns.push({
        header: item.title,
        dataKey: item.dataIndex,
      });
    });

    const doc = new jsPDF();
    // doc.autoTable({ html: "#exportTable" });
    doc.autoTable({
      body: data,
      columns: sortColumns,
    });
    doc.save(`${fileName}.pdf`);
  };

  return (
    <>
      <Button
        type="text"
        icon={<UploadOutlined />}
        onClick={() => onExportExcel(data)}
      >
        Excel
      </Button>
      <Button
        type="text"
        icon={<UploadOutlined />}
        onClick={() => onExportToPdf(data)}
      >
        Pdf
      </Button>
      {tableBody ? (
        <table
          ref={exportTableRef}
          className={styles.exportTable}
          id="exportTable"
        >
          <tbody>
            <tr>
              <td></td>
            </tr>
            {tableBody}
          </tbody>
        </table>
      ) : (
        <table
          ref={exportTableRef}
          className={styles.exportTable}
          id="exportTable"
        >
          <thead>
            <tr>
              {tableColumns.map((item, index) => (
                <th
                  style={{ border: "1px solid", fontFamily: "sans-serif" }}
                  colSpan={item?.colSpan}
                  rowSpan={item.rowSpan}
                  key={index}
                >
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              let rowLength = tableColumns.length;
              return (
                <tr key={index}>
                  {tableColumns.map((innerItem, inIndex) => {
                    // Check
                    if (rowLength < inIndex) return;

                    if (typeof item[innerItem.dataIndex] === "object") {
                      const colSpan = item[innerItem.dataIndex]?.colSpan;
                      if (colSpan) {
                        // Row length
                        rowLength -= parseInt(colSpan);
                        const newValue = item[innerItem.dataIndex]?.title;
                        return (
                          <td
                            key={inIndex}
                            colSpan={item[innerItem.dataIndex]?.colSpan}
                            rowSpan={item[innerItem.dataIndex]?.rowSpan}
                            style={{
                              border: "1px solid",
                              fontFamily: "sans-serif",
                              ...item[innerItem.dataIndex]?.style,
                            }}
                          >
                            {!isNaN(newValue)
                              ? formatFloatNumber(newValue)
                              : newValue}
                          </td>
                        );
                      } else {
                        return (
                          <td
                            key={inIndex}
                            rowSpan={item[innerItem.dataIndex]?.rowSpan}
                            style={{
                              border: "1px solid",
                              fontFamily: "sans-serif",
                              ...item[innerItem.dataIndex]?.style,
                            }}
                          >
                            {item[innerItem.dataIndex]?.title}
                          </td>
                        );
                      }
                    } else {
                      return (
                        <td
                          key={inIndex}
                          rowSpan={item[innerItem.dataIndex]?.rowSpan}
                          style={{
                            border: "1px solid",
                            fontFamily: "sans-serif",
                            ...item[innerItem.dataIndex]?.style,
                          }}
                        >
                          {innerItem.render
                            ? innerItem?.render(item[innerItem.dataIndex], item)
                            : item[innerItem.dataIndex]}
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}

export default memo(ExportTable);
