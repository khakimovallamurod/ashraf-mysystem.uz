import { Form, Select, message } from "antd";
import React, { useMemo, useState } from "react";
import { useGetUploaderPolkaQuery } from "../../../../features/uploader/polka/uploaderPolkaApiSlice";

function UploaderSelectPolka({ label, name, onSelectPolka }) {
  /* API */
  const polkaDataRes = useGetUploaderPolkaQuery();

  /* Memo */
  // Part
  const polkaOptions = useMemo(() => {
    if (
      polkaDataRes?.data?.success === true &&
      polkaDataRes?.data?.data &&
      Array.isArray(polkaDataRes?.data?.data)
    ) {
      return polkaDataRes?.data.data;
    }
    return [];
  }, [polkaDataRes?.data]);

  return (
    <>
      <Form.Item
        label={`${label} ${label ? "p" : "P"}olkani tanlash`}
        name={name}
        rules={[
          {
            required: true,
            message: `${label} polkani tanlang!`,
          },
        ]}
      >
        <Select
          allowClear
          showSearch
          placeholder={`${label} polkani tanlash`}
          loading={false}
          filterOption={(inputValue, option) =>
            option.searchOne.toLowerCase().indexOf(inputValue.toLowerCase()) >=
            0
          }
          onChange={onSelectPolka}
        >
          {polkaOptions.map((option) => (
            <Select.Option
              value={option.id}
              key={option.id}
              searchOne={option?.name}
            >
              {option?.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
}

export default UploaderSelectPolka;
