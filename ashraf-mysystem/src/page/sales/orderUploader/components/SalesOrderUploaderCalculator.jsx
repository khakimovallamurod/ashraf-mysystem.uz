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
  Input,
  InputNumber,
  Select,
  Space,
  message,
} from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import MainModal from "../../../../components/common/modal/MainModal";
import MainLightTitle from "../../../../components/ui/title/MainLightTitle";
import MainText from "../../../../components/ui/title/MainText";
import { useGetSalesCustomerQuery } from "../../../../features/sales/customer/salesCustomerApiSlice";
import SalesAddCustomerModal from "../../customer/components/SalesAddCustomerModal";
import { NumericFormat, removeNumericFormat } from "react-number-format";
import removeComma from "../../../../util/removeComma";

const SalesOrderUploaderCalculator = (
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

  /* Ref */
  const addCustomerModalRef = useRef(null);

  /* State */
  const [inputs, setInputs] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerError, setSelelectedCustomerError] = useState(false);

  /* API */
  const customerRes = useGetSalesCustomerQuery();

  /* MODAL */
  const handleOpenAddCustomerModal = () =>
    addCustomerModalRef.current?.onOpen();

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

  /* getProductPriceByCustomer */
  function getProductPriceByCustomer(priceList) {
    return priceList.find(
      (item) => item?.client_category_id === selectedCustomer?.category_id
    );
  }

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
      const categoryPrice = getProductPriceByCustomer(data?.price_list || []);

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
    <>
      {/* Customer modal */}
      <SalesAddCustomerModal ref={addCustomerModalRef} />

      <Card
        style={{
          height: "100%",
        }}
        styles={{ body: { height: "100%" } }}
      >
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
        <Divider style={{ margin: "10px 0" }} />
        {/* Form */}
        <Space.Compact block>
          <div style={{ width: "100%", marginRight: "1.5rem" }}>
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
                    initialValue={item.inputs[0].value}
                  >
                    <InputNumber
                      type="number"
                      // readOnly
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
                    <NumericFormat
                      customInput={Input}
                      thousandSeparator=","
                      min={0}
                      placeholder="Kg"
                      onChange={(e) =>
                        handleChange({
                          value: removeComma(e.target.value),
                          subIndex: i,
                          index: 1,
                        })
                      }
                    />
                    {/* <InputNumber
                      type="number"
                      autoFocus={true}
                      style={{ width: "100%" }}
                      placeholder="Kg"
                      // onChange={}
                      onScroll={false}
                    /> */}
                  </Form.Item>

                  {/* Total */}
                  <Form.Item
                    name={item.inputs[2].name}
                    initialValue={item.inputs[2].value}
                  >
                    <InputNumber
                      disabled
                      type="number"
                      style={{ width: "100%" }}
                      placeholder="Summa"
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

export default forwardRef(SalesOrderUploaderCalculator);
