import React, { useMemo } from "react";
import { NumericFormat } from "react-number-format";
import { formatFloatNumber } from "../../../util/formatFloatNumber";

function MainNumberFormat({ value = 0 }) {
  const newValue = useMemo(() => {
    return formatFloatNumber(value)
  }, [value])
  return (
    <NumericFormat
      displayType="text"
      value={newValue}
      thousandSeparator=","
    />
  );
}

export default MainNumberFormat;
