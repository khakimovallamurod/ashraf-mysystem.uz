import {
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Empty,
  Form,
  InputNumber,
  Select,
  Space,
  message,
} from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import MainModal from "../../../../components/common/modal/MainModal";
import MainLightTitle from "../../../../components/ui/title/MainLightTitle";
import MainText from "../../../../components/ui/title/MainText";
import { useGetAgentCustomerQuery } from "../../../../features/agent/customer/agentCustomerApiSlice";
import AgentAddCustomerModal from "./customer/AgentAddCustomerModal";

const AgentOrderUploaderCalculator = (
  { setProductsData, setCustomer },
  ref
) => {
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
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerError, setSelelectedCustomerError] = useState(false);
  const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);

  /* API */
  const customerRes = useGetAgentCustomerQuery();

  /* Memo */
  const customerOptions = useMemo(() => {
    if (
      customerRes?.data?.success === true &&
      customerRes?.data?.data &&
      Array.isArray(customerRes?.data?.data)
    ) {
      return customerRes?.data.data;
    }
    return [];
  }, [customerRes?.data]);

  /* Handle select */
  const handleSelect = (val) => {
    handleRestartInputs();
    if (val) {
      const res = customerOptions.find((item) => item.id === val);
      setCustomer(res);
      setSelectedCustomer(res);
    } else {
      setSelectedCustomer(null);
    }
  };

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
    if (!selectedCustomer) {
      setSelelectedCustomerError(true);
      message.error("Mijozni tanlang!");
      return;
    }
    setSelelectedCustomerError(false);

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
      const categoryPrice = getProductPriceByCustomer(data?.price_list);

      newInputs.push({
        id: uuidv4(),
        productId: data.id,
        productName: data?.name,
        defaultProductData: { ...data },
        inputs: [
          { name: uuidv4(), value: categoryPrice?.price }, //Price
          { name: uuidv4(), value: 1, max: data?.soni }, // Mass
          { name: uuidv4(), value: categoryPrice?.price }, // Total Price
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

    if (inputs.length) {
      /* Reset form */
      form.resetFields();
    }
  }

  /* getProductPriceByCustomer */
  function getProductPriceByCustomer(priceList) {
    return priceList.find(
      (item) => item?.client_category_id === selectedCustomer?.category_id
    );
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
  /* MODAL */
  const handleOpenAddCustomerModal = () => setOpenAddCustomerModal(true);
  const handleCloseAddCustomerModal = () => setOpenAddCustomerModal(false);

  return (
    <>
      {/* Customer modal */}
      <MainModal
        open={openAddCustomerModal}
        onClose={handleCloseAddCustomerModal}
      >
        <AgentAddCustomerModal />
      </MainModal>

      <Card
        style={{
          height: "100%",
        }}
        bodyStyle={{ height: "100%", padding: "12px" }}
      >
        <MainLightTitle>Kalkulator</MainLightTitle>
        <Divider />
        <Space.Compact block style={{ width: "100%" }}>
          <Select
            allowClear
            showSearch
            placeholder="Xaridorni tanlash"
            loading={customerRes?.isLoading}
            filterOption={(inputValue, option) =>
              option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >=
              0
            }
            style={{ width: "100%" }}
            onChange={handleSelect}
            status={selectedCustomerError ? "error" : ""}
          >
            {customerOptions.map((option) => (
              <Select.Option value={option.id} key={option.id}>
                {option?.fio}
              </Select.Option>
            ))}
          </Select>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={handleOpenAddCustomerModal}
          >
            {window.innerWidth > 725 ? "Qo'shish" : ""}
          </Button>
        </Space.Compact>
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
                    initialValue={item.inputs[0].value}
                  >
                    <InputNumber
                      type="number"
                      readOnly
                      autoFocus={true}
                      style={{ width: "100%" }}
                      placeholder="Narx"
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
    </>
  );
};

export default forwardRef(AgentOrderUploaderCalculator);
