import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, InputNumber, Popconfirm, Space, Typography } from "antd";
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { formatFloatNumber } from "../../../../util/formatFloatNumber";
import { MinusCircleOutlined } from "@ant-design/icons";
import MainNumberFormat from "../../../common/numberFormat/MainNumberFormat";
const { Text } = Typography;

function WeightModalForm({ onChange, boxType, initialValues, activeTab }, ref) {
  useImperativeHandle(ref, () => ({
    onClear: handleClearInputs,
  }));

  const localStorageName = `weightInputsValue_${boxType}`;

  const [form] = Form.useForm();
  const [inputs, setInputs] = useState([
    {
      id: uuidv4(),
      inputs: [
        { name: uuidv4(), value: initialValues?.boxCount || "" },
        { name: uuidv4(), value: initialValues?.chickenCount || "" },
        { name: uuidv4(), value: "" },
      ],
    },
  ]);

  /* Count */
  const [count, setCount] = useState({
    box: 0,
    chicken: 0,
    boxAndChickenKg: 0,
  });

  useEffect(() => {
    let res = localStorage.getItem(localStorageName);
    handleRestartInputs();

    if (res) {
      res = JSON.parse(res);
      /* Create new inputs using previous values */
      const newInputs = [];

      res.forEach((item) => {
        if (!item.id || !item?.inputs?.length) {
          return;
        }
        newInputs.push({
          id: item.id,
          inputs: [
            { name: item.inputs[0].name, value: item.inputs[0].value },
            { name: item.inputs[1].name, value: item.inputs[1].value },
            { name: item.inputs[2].name, value: item.inputs[2].value },
          ],
        });
      });
      setInputs(newInputs);
    }
  }, [boxType]);

  /* Calculate */
  useEffect(() => {
    let boxCount = 0;
    let chickenCount = 0;
    let boxAndChickenKg = 0;

    inputs.forEach((item) => {
      const { inputs } = item;
      const boxValue = inputs[0].value ? parseInt(inputs[0].value) : 0;
      const chickenValue = inputs[1].value ? parseInt(inputs[1].value) : 0;
      const kgValue = inputs[2].value ? parseFloat(inputs[2].value) : 0;

      if (kgValue > 0 && (boxValue > 0 || chickenValue > 0)) {
        boxCount += boxValue;
        chickenCount += chickenValue;
        boxAndChickenKg += kgValue;
      }
    });
    setCount({
      box: boxCount,
      chicken: chickenCount,
      boxAndChickenKg: formatFloatNumber(boxAndChickenKg),
    });
  }, [inputs]);

  /* Handle Add */
  function handleAddInputs() {
    setInputs([
      ...inputs,
      {
        id: uuidv4(),
        inputs: [
          { name: uuidv4(), value: initialValues?.boxCount || "" },
          { name: uuidv4(), value: initialValues?.chickenCount || "" },
          { name: uuidv4(), value: "" },
        ],
      },
    ]);
  }

  /* Handle Remove */
  function handleRemoveInputs(id) {
    if (!id) return;
    const newInputs = [...inputs];
    const filteredInputs = newInputs.filter((item) => item.id !== id);
    handleSaveLocalStorage(filteredInputs);
    setInputs(filteredInputs);
  }

  /* Handle Restart */
  function handleRestartInputs() {
    setInputs([
      {
        id: uuidv4(),
        inputs: [
          { name: uuidv4(), value: initialValues?.boxCount || "" },
          { name: uuidv4(), value: initialValues?.chickenCount || "" },
          { name: uuidv4(), value: "" },
        ],
      },
    ]);
    /* Reset form */
    form.resetFields();
    handleSubmit("clear");
  }

  /* Handle Restart */
  function handleClearInputs() {
    handleRestartInputs();

    localStorage.removeItem(localStorageName);
  }

  /* Handle Change */
  function handleChange({ value, subIndex, index }) {
    const newInputs = [...inputs];
    newInputs[subIndex].inputs[index].value = value;

    handleSaveLocalStorage(newInputs);
    setInputs(newInputs);
  }

  const handleSaveLocalStorage = (data) => {
    localStorage.setItem(localStorageName, JSON.stringify(data));
  };

  /* Submit */
  const handleSubmit = (type) => {
    let data = [];
    if (type !== "clear") {
      data = inputs.map((item) => ({
        boxCount: item.inputs[0].value,
        chickenCount: item.inputs[1].value,
        kg: item.inputs[2].value,
      }));
    }
    onChange(boxType, [...data]);
  };

  return activeTab === boxType ? (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Form.Item style={{ flexGrow: 1 }}>
        <Space
          size={10}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Text>
            Yashik soni:{" "}
            <b>
              <MainNumberFormat value={count.box} />
            </b>
          </Text>
          <Text>
            Tovuq soni:{" "}
            <b>
              <MainNumberFormat value={count.chicken} />
            </b>
          </Text>
          <Text>
            Kg:{" "}
            <b>
              <MainNumberFormat value={count.boxAndChickenKg} />
            </b>
          </Text>
          <Form.Item label="&nbsp;" style={{ width: "30%" }}>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={handleAddInputs}
            >
              Qo'shish
            </Button>
          </Form.Item>
        </Space>
      </Form.Item>
      {inputs.map((item, i) => (
        <Space key={i}>
          <Form.Item
            name={item.inputs[0].name}
            rules={[
              {
                required: true,
                message: "Yashik sonini kiriting",
              },
            ]}
            initialValue={item.inputs[0].value}
          >
            <InputNumber
              type="number"
              style={{ width: "100%" }}
              placeholder="yashik soni"
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
          <Form.Item
            name={item.inputs[1].name}
            rules={[
              {
                required: true,
                message: "Tovuq sonini kiriting",
              },
            ]}
            initialValue={item.inputs[1].value}
          >
            <InputNumber
              type="number"
              style={{ width: "100%" }}
              placeholder="tovuq soni"
              value={item.inputs[1].value}
              onChange={(value) =>
                handleChange({
                  value: value,
                  subIndex: i,
                  index: 1,
                })
              }
            />
          </Form.Item>
          <Form.Item
            name={item.inputs[2].name}
            rules={[
              {
                required: true,
                message: "Kg kiriting",
              },
            ]}
            initialValue={item.inputs[2].value}
          >
            <InputNumber
              type="number"
              style={{ width: "100%" }}
              placeholder="kg"
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
          <Form.Item>
            <Button
              icon={<MinusCircleOutlined />}
              type="text"
              onClick={() => handleRemoveInputs(item.id)}
              style={{ visibility: i === 0 ? "hidden" : null }}
            />
          </Form.Item>
        </Space>
      ))}

      {/* Footer */}
      <Form.Item>
        <Space>
          <Popconfirm
            title="Tozalash"
            description="Rostdan ham barcha ma'lumotni tozalamoqchimisiz?"
            onConfirm={handleClearInputs}
            okText="Ha albatta"
            cancelText="Yo'q"
            style={{ width: "100%" }}
          >
            <Button style={{ width: "100%" }}>Tozalash</Button>
          </Popconfirm>

          <Button style={{ width: "100%" }} htmlType="submit" type="primary">
            Saqlash
          </Button>
        </Space>
      </Form.Item>
    </Form>
  ) : null;
}

export default forwardRef(WeightModalForm);
