import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Empty, Form, InputNumber, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MainLightTitle from "../../../../components/ui/title/MainLightTitle";
import MainText from "../../../../components/ui/title/MainText";

const SalesProductSaleCalculator = ({ setProductsData }, ref) => {
  useImperativeHandle(ref, () => {
    return {
      addInputs: (data) => handleAddInputs(data),
      restart: () => handleRestartInputs(),
    };
  });

  /* Form */
  const [form] = Form.useForm();

  /* State */

  const [inputs, setInputs] = useState([]);

  /* Handle Change */
  function handleChange({ value, subIndex, index }) {
    const newInputs = [...inputs];
    newInputs[subIndex].inputs[index].value = value;
    newInputs.forEach((item) => {
      item.inputs[1].value = parseFloat(item.inputs[1].value || 0); //Mass
      const mass = item.inputs[1].value; //Mass
      const price = parseFloat(item.inputs[0].value || 0); //Price
      item.inputs[2].value = price * mass; //Total Price
      form.setFieldValue(item.inputs[2].name, item.inputs[2].value); // Set total price
    });
    handleChangeAndSend(newInputs);
    setInputs(newInputs);
  }

  /* Handle Add */
  function handleAddInputs(data) {
    let newInputs = [...inputs];
    const res = newInputs.find((item) => item.productId === data?.id);
    if (res) {
      form.setFieldValue(res?.inputs[1]?.name, res?.inputs[1]?.value + 1);
      newInputs = newInputs.map((item) => {
        if (res.id === item.id) {
          item.inputs[1].value = parseFloat(item.inputs[1].value || 0) + 1; // Mass

          const mass = item.inputs[1].value; // Mass
          const price = parseFloat(item.inputs[0].value || 0); // Price
          item.inputs[2].value = price * mass; // Total Price
          form.setFieldValue(item.inputs[2].name, item.inputs[2].value); // Set total price
        }
        return item;
      });
    } else {
      newInputs.push({
        id: uuidv4(),
        productId: data.id,
        productName: data?.name,
        defaultProductData: { ...data },
        inputs: [
          { name: uuidv4(), value: data?.price || "" }, //Price
          { name: uuidv4(), value: 1, max: data?.soni }, // Mass
          { name: uuidv4(), value: data?.price }, // Total Price
        ],
      });
      setInputs([...newInputs]);
    }
    handleChangeAndSend([...newInputs], res);
  }

  /* Handle Remove */
  function handleRemoveInputs(id) {
    if (!id) return;
    const newInputs = [...inputs];
    const filteredInputs = newInputs.filter((item) => item.id !== id);

    handleChangeAndSend(filteredInputs);
    setInputs(filteredInputs);
  }

  /* Handle Restart */
  function handleRestartInputs() {
    setInputs([]);
    handleChangeAndSend([]);

    /* Reset form */
    form.resetFields();
  }

  /* Handle change sub weight data from receptionInnerModal.js file */
  const handleChangeAndSend = (allInputs, addedInput) => {
    setProductsData(
      allInputs.map((item) => {
        if (addedInput && addedInput.id === item.id) {
          return {
            id: item.id,
            productName: item.productName,
            price: item.inputs[0].value,
            mass: parseFloat(addedInput.inputs[1].value || 0),
            total: item.inputs[2].value, //total price
            defaultProductData: { ...item.defaultProductData },
          };
        }
        return {
          id: item.id,
          productName: item.productName,
          price: item.inputs[0].value,
          mass: item.inputs[1].value,
          total: item.inputs[2].value, //total price
          defaultProductData: { ...item.defaultProductData },
        };
      })
    );
  };

  return (
    <Card
      style={{
        height: "100%",
      }}
      styles={{ body: { height: "100%" } }}
    >
      <MainLightTitle>Kalkulator</MainLightTitle>
      <Divider />
      {/* Form */}
      <Space.Compact block>
        <div style={{ width: "100%" }}>
          <MainText>Nomi</MainText>
        </div>
        <div style={{ width: "100%" }}>
          <MainText>Narx</MainText>
        </div>
        <div style={{ width: "100%" }}>
          <MainText>Massa</MainText>
        </div>
        <div style={{ width: "100%" }}>
          <MainText>Summa</MainText>
        </div>
        <div style={{ width: "90px" }}></div>
      </Space.Compact>
      <div
        style={{
          height: "calc(100% - 230px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!inputs.length ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Empty />
          </div>
        ) : (
          <Form
            layout="vertical"
            form={form}
            style={{
              flexGrow: 1,
              height: "100px",
              overflow: "auto",
              padding: "1rem 10px",
            }}
          >
            {inputs.map((item, i) => (
              <Space key={i}>
                {/* Price */}
                <Form.Item style={{ minWidth: "100px" }}>
                  <b>{item?.productName}</b>
                </Form.Item>
                <Form.Item
                  name={item.inputs[0].name}
                  rules={[
                    {
                      required: true,
                      message: "Narx talab qilinadi",
                    },
                  ]}
                >
                  <InputNumber
                    type="number"
                    autoFocus={true}
                    style={{ width: "100%" }}
                    placeholder="Narx"
                    value={item.inputs[0].value}
                    onChange={(value) =>
                      handleChange({
                        value: value,
                        subIndex: i,
                        index: 0,
                      })
                    }
                  />
                </Form.Item>

                {/* Mass */}
                <Form.Item
                  name={item.inputs[1].name}
                  rules={[
                    {
                      required: true,
                      message: "Kg kiriting",
                    },
                  ]}
                  initialValue={item.inputs[1].value}
                >
                  <InputNumber
                    type="number"
                    style={{ width: "100%" }}
                    placeholder="Kg"
                    onChange={(value) =>
                      handleChange({
                        value: value,
                        subIndex: i,
                        index: 1,
                      })
                    }
                  />
                </Form.Item>

                {/* Total */}
                <Form.Item name={item.inputs[2].name}>
                  <InputNumber
                    disabled
                    type="number"
                    style={{ width: "100%" }}
                    placeholder="Summa"
                    value={item.inputs[2].value}
                    onChange={(value) =>
                      handleChange({
                        value: value,
                        subIndex: i,
                        index: 2,
                      })
                    }
                  />
                </Form.Item>
                {/* Delete btn */}
                <Form.Item>
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    color="#e74c3c"
                    type="text"
                    onClick={() => handleRemoveInputs(item.id)}
                  />
                </Form.Item>
              </Space>
            ))}
          </Form>
        )}
        {inputs.length ? (
          <Button
            style={{ width: "100%", marginTop: "1rem" }}
            onClick={handleRestartInputs}
            icon={<ReloadOutlined />}
            danger
          >
            Tozalash
          </Button>
        ) : null}
      </div>
    </Card>
  );
};

export default forwardRef(SalesProductSaleCalculator);
