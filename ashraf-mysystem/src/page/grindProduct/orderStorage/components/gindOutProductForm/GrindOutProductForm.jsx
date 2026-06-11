import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, InputNumber, Select, Space } from "antd";
import React, { memo, useRef, useState } from "react";

function GrindOutProductForm({
  polkaOptions,
  polkaIsLoading,
  product,
  setGrindOutList,
}) {
  // State
  const [errors, setErrors] = useState({
    mass: false,
    box: false,
    polka: false,
  });
  const [selected, setSelected] = useState(null);

  // Ref
  const massRef = useRef(null);
  // const boxRef = useRef(null);

  const checkInputs = () => {
    const newErrors = {
      mass: false,
      box: false,
      polka: false,
    };

    // Mass
    if (!massRef.current.value) newErrors.mass = true;
    else newErrors.mass = false;

    // Box
    // if (!boxRef.current.value) newErrors.box = true;
    // else newErrors.box = false;

    // Polka
    if (!selected) newErrors.polka = true;
    else newErrors.polka = false;

    setErrors({ ...newErrors });
    return !Object.keys(newErrors).find((key) => newErrors[key]);
  };

  // Submit
  const submit = () => {
    if (!checkInputs()) return;

    setGrindOutList({
      mass: massRef.current?.value,
      box: 0,
      polka: polkaOptions.find((item) => item.id === selected),
      product: product,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {product?.name}
      <>
        <Space.Compact>
          <InputNumber
            ref={massRef}
            placeholder="Massa"
            style={{ width: "100px" }}
            status={errors.mass && "error"}
          />
          {/* <InputNumber
            ref={boxRef}
            placeholder="Yashik"
            style={{ width: "100px" }}
            status={errors.box && "error"}
          /> */}

          <Select
            value={selected}
            style={{ width: 120 }}
            status={errors.polka ? "error" : ""}
            allowClear
            showSearch
            placeholder="Polkani tanlash"
            loading={polkaIsLoading}
            filterOption={(inputValue, option) =>
              option.searchOne
                .toLowerCase()
                .indexOf(inputValue.toLowerCase()) >= 0 ||
              option.searchTwo
                .toLowerCase()
                .indexOf(inputValue.toLowerCase()) >= 0
            }
            onChange={setSelected}
          >
            {polkaOptions.map((option) => (
              <Select.Option
                value={option.id}
                key={option.id}
                searchOne={option.bulim_name}
                searchTwo={option.name}
              >
                {option.name}{" "}
                <span style={{ opacity: "0.5" }}>{option.bulim_name}</span>
              </Select.Option>
            ))}
          </Select>
          <Button
            onClick={submit}
            type="primary"
            icon={<ArrowRightOutlined />}
          />
        </Space.Compact>
      </>
    </div>
  );
}

export default memo(GrindOutProductForm);
