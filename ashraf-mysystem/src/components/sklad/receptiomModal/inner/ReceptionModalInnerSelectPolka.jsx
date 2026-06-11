import React, { useMemo } from "react";
import { useGetPolkaStorageQuery } from "../../../../features/productStorage/polka/productStoragePolkaApiSlice";
import { Form, Select } from "antd";
import MainNumberFormat from "../../../common/numberFormat/MainNumberFormat";
import { formatFloatNumber } from "../../../../util/formatFloatNumber";

function ReceptionModalInnerSelectPolka({ status }) {
  /* API */
  const polkaData = useGetPolkaStorageQuery();

  /* Memo */
  /* Polka Options */
  const polkaOptions = useMemo(() => {
    if (
      polkaData?.data?.success === true &&
      polkaData?.data?.data &&
      polkaData?.data?.data.length
    ) {
      return polkaData?.data?.data;
    }
    return [];
  }, [polkaData]);
  return (
    <Form.Item
      label="Polkani tanlang"
      name="polka"
      rules={[
        {
          required: true,
          message: "Polkani tanlang!",
        },
      ]}
      validateStatus={status}
      hasFeedback
    >
      <Select
        allowClear
        showSearch
        placeholder="Polkani tanlash"
        loading={polkaData.isLoading}
        filterOption={(inputValue, option) =>
          option?.searchOne
            ?.toLowerCase()
            ?.indexOf(inputValue?.toLowerCase()) >= 0 ||
          option?.searchTwo
            ?.toLowerCase()
            ?.indexOf(inputValue?.toLowerCase()) >= 0
        }
      >
        {polkaOptions.map((option) => (
          <Select.Option
            value={option.id}
            key={option.id}
            searchOne={option?.bulim_name || ""}
            searchTwo={option?.name || ""} 
          >
            {option?.name} {option?.bulim_name}{" "}
            <MainNumberFormat value={formatFloatNumber(option?.nagruzka)} />
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}

export default ReceptionModalInnerSelectPolka;
