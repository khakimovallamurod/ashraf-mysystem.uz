import React, { useMemo } from "react";
import { formatFloatNumber } from "../../../util/formatFloatNumber";
import MainNumberFormat from "../numberFormat/MainNumberFormat";

function TableTd({
  children,
  rowSpan,
  colSpan,
  border = true,
  style = { width: "120px" },
  numberFormat,
}) {
  const newStyles = useMemo(() => {
    let newStyle = { ...style, fontFamily: "Arial", fontSize: "9pt" };
    if (border) {
      newStyle = {
        ...newStyle,
        border: "0.5px solid",
      };
    }
    return newStyle;
  }, [border, style]);

  const [newChildren, isNumFormat] = useMemo(() => {
    if (children === "0" || children === 0) return "";

    if (numberFormat) return [children, true];

    return [children, false];
  }, [children, numberFormat]);

  return (
    <td
      style={newStyles}
      rowSpan={rowSpan}
      colSpan={colSpan}
      className={border ? "border" : ""}
    >
      {isNumFormat ? <MainNumberFormat value={newChildren} /> : newChildren}
    </td>
  );
}

export default TableTd;
