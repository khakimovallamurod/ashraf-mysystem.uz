import { formatFloatNumber } from "./formatFloatNumber";

const getCalcData = (arr, calcItem) => {
  if (!arr.length) return 0;
  return formatFloatNumber(
    arr?.reduce((a, b) => a + parseFloat(b[calcItem]), 0)
  );
};

export default getCalcData;
