import { ReloadOutlined, SaveFilled } from "@ant-design/icons";

import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  message,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import {
  useAddProdRecMutation,
  useGetSettingsQuery,
} from "../../../../features/sklad/productReception/ProductReceptionApiSlice";
import { formatFloatNumber } from "../../../../util/formatFloatNumber";
import { getChickenMass } from "../../../../util/getChickenMass";
import AddButcherModal from "../butcher/AddButcherModal";
import AddProductProviderModal from "../productProvider/AddProductProviderModal";
import ReceptionModalInnerSelectButcher from "./ReceptionModalInnerSelectButcher";
import ReceptionModalInnerSelectPolka from "./ReceptionModalInnerSelectPolka";
import ReceptionModalInnerSelectProvider from "./ReceptionModalInnerSelectProvider";
import removeComma from "../../../../util/removeComma";

function ReceptionModalInner() {
  /* Form */
  const [form] = Form.useForm();
  const addProviderRef = useRef(null);
  const addButcherRef = useRef(null);

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState("");
  // Settings
  const [settingsInputs, setSettingsInputs] = useState({
    largeBox: 0,
    smallBox: 0,
    procent: 0,
  });
  const [clear, setClear] = useState(0);

  const [weightValues, setWeightValues] = useState({
    weightInputs: {
      largeBox: [],
      smallBox: [],
    },
    calculatedWeight: {
      largeBox: {
        boxCount: 0,
        chickenCount: 0,
        boxAndChickenKg: 0,
      },
      smallBox: {
        boxCount: 0,
        chickenCount: 0,
        boxAndChickenKg: 0,
      },
    },
  });

  // Calculated data
  const [calculatedData, setCalculatedData] = useState({
    allChickenCount: 0,
    allChickenKg: 0,
    allBoxCount: 0,
    allBoxKg: 0,
    price: 0,
  });
  // Error
  const [weightError, setWeightError] = useState({
    empty: false,
    calcProblem: false,
  });

  /* API */
  const [addProductReception] = useAddProdRecMutation();
  const settingsReq = useGetSettingsQuery();

  /* Memo */
  /* Settings data */
  const settingsData = useMemo(() => {
    if (
      settingsReq.data?.success === true &&
      settingsReq.data?.data &&
      typeof settingsReq.data?.data === "object"
    ) {
      const { data } = settingsReq.data;
      return {
        largeBox: {
          boxCount: data?.katta_soni,
          chickenCount: data?.katta_dona,
        },
        smallBox: {
          boxCount: data?.kichik_soni,
          chickenCount: data?.kichik_dona,
        },
        settingsInputs: {
          largeBox: parseFloat(data?.katta_yashik),
          smallBox: parseFloat(data?.kichik_yashik),
          procent: parseFloat(data?.foiz),
        },
      };
    }
    return {
      largeBox: {
        boxCount: "",
        chickenCount: "",
      },
      smallBox: {
        boxCount: "",
        chickenCount: "",
      },
      settingsInputs: {
        largeBox: 0,
        smallBox: 0,
        procent: 0,
      },
    };
  }, [settingsReq.data]);

  /* Set initial values to settings */
  useEffect(() => {
    setSettingsInputs({ ...settingsData.settingsInputs });
    form.setFieldsValue({ ...settingsData.settingsInputs });
  }, [form, settingsData]);

  /* ===================== CALCULATE =================== */
  useEffect(() => {
    const { calculatedWeight } = weightValues;

    //Get values
    let priceValue = parseFloat(price || 0);
    let largeBoxKgValue = parseFloat(settingsInputs.largeBox || 0);
    let smallBoxKgValue = parseFloat(settingsInputs.smallBox || 0);
    let procentValue = parseFloat(settingsInputs.procent || 0);

    /* Weight inputs values is number required */
    const { largeBox, smallBox } = calculatedWeight;

    /* Box */
    const allBoxCount = largeBox.boxCount + smallBox.boxCount;
    const allLargeBoxKg = largeBoxKgValue * largeBox.boxCount;
    const allSmallBoxKg = smallBoxKgValue * smallBox.boxCount;
    const allBoxKg = allLargeBoxKg + allSmallBoxKg;

    /* Chicken */
    const allChickenCount = largeBox.chickenCount + smallBox.chickenCount;
    const allChickenKg =
      largeBox.boxAndChickenKg -
      allLargeBoxKg +
      smallBox.boxAndChickenKg -
      allSmallBoxKg;
    const [pureMass, procentKg] = getChickenMass(allChickenKg, procentValue);

    setCalculatedData({
      allChickenCount,
      allChickenKg: formatFloatNumber(pureMass),
      allBoxCount,
      allBoxKg: formatFloatNumber(allBoxKg),
      price: formatFloatNumber(priceValue * formatFloatNumber(pureMass)),
      allDefaultChickenKg: formatFloatNumber(allChickenKg + allBoxKg),
      procentKg: formatFloatNumber(procentKg),
    });
  }, [
    price,
    settingsInputs.largeBox,
    settingsInputs.procent,
    settingsInputs.smallBox,
    weightValues,
  ]);

  /* ===========Check calculated data============= */
  const checkCalculatedData = () => {
    if (
      calculatedData.allBoxCount === 0 ||
      calculatedData.allChickenCount === 0
    ) {
      setWeightError({
        ...weightError,
        empty: true,
      });
      return false;
    } else if (calculatedData.allChickenKg < 0) {
      setWeightError({
        ...weightError,
        calcProblem: true,
      });
      return false;
    }
    setWeightError({
      empty: false,
      calcProblem: false,
    });
    /* Return true */
    return true;
  };

  /* Add Provider Modal */
  const openAddProviderModal = () => addProviderRef.current.onOpen();
  const openAddButcherModal = () => addButcherRef.current.onOpen();

  const clearForm = () => {
    /* Clear form */
    form.resetFields();

    setPrice("");
    form.setFieldsValue({ ...settingsData.settingsInputs });

    setClear((prev) => prev + 1);

    /* Clear weight values */
    setWeightValues({
      weightInputs: {
        largeBox: [],
        smallBox: [],
      },
      calculatedWeight: {
        largeBox: {
          boxCount: 0,
          chickenCount: 0,
          boxAndChickenKg: 0,
        },
        smallBox: {
          boxCount: 0,
          chickenCount: 0,
          boxAndChickenKg: 0,
        },
      },
    });

    setCalculatedData({
      allChickenCount: 0,
      allChickenKg: 0,
      allBoxCount: 0,
      allBoxKg: 0,
      price: 0,
    });
  };

  /* Submit */
  const handleSubmit = async (values) => {
    console.log(values);

    /* Loading */
    setIsSubmitting(true);

    try {
      const data = {
        taminotchi_id: values.provider,
        qassob_id: values.butcher,
        dona: removeComma(values.dona),
        massa: removeComma(values.massa),
        price: removeComma(values.price),
        polka_id: values.polka,
      };

      const resData = await addProductReception(data).unwrap();
      if (resData?.success === true) {
        /* Success */
        clearForm();

        // Message
        if (resData?.message) message.success(resData.message);
      } else if (resData?.success === false) {
        /* Error */

        if (resData?.message) {
          message.error(resData.message);
        }
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        message.warning("Ulanishda xatolik! Qaytadan urinib ko'ring!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFinishFailed = () => {
    checkCalculatedData();
  };

  return (
    <>
      {/* Provider modal  */}
      <AddProductProviderModal ref={addProviderRef} />

      {/* Butcher modal */}
      <AddButcherModal ref={addButcherRef} />

      <Form
        form={form}
        name="basic"
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Select polka */}
        <ReceptionModalInnerSelectPolka status={status} />

        {/* Select provider */}
        <ReceptionModalInnerSelectProvider
          status={status}
          openModal={openAddProviderModal}
        />

        {/* Select butcher */}
        <ReceptionModalInnerSelectButcher
          status={status}
          openModal={openAddButcherModal}
        />

        {/* Input price */}
        <Form.Item
          label="Narx"
          name="price"
          rules={[
            {
              required: true,
              message: "1 kg go'sht narxini kiriting!",
            },
          ]}
        >
          <NumericFormat
            customInput={Input}
            thousandSeparator=" "
            min={0}
            placeholder="so'm"
          />
        </Form.Item>

        {/* Volume */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <Form.Item
            label="Tovuq kg"
            name="massa"
            rules={[
              {
                required: true,
                message: "Tovuq kg talab qilinadi!",
              },
            ]}
          >
            <NumericFormat
              customInput={Input}
              thousandSeparator=" "
              min={0}
              placeholder="kg"
            />
          </Form.Item>
          <Form.Item
            label="Tovuq soni"
            name="dona"
            rules={[
              {
                required: true,
                message: "Tovuq soni talab qilinadi!",
              },
            ]}
          >
            <NumericFormat
              customInput={Input}
              thousandSeparator=" "
              min={0}
              placeholder="soni"
            />
          </Form.Item>
        </div>

        <div style={{ flexGrow: 1 }}></div>

        <div style={{ display: "flex", width: "100%", gap: "1rem" }}>
          <Form.Item style={{ width: "100%" }}>
            <Popconfirm
              title="Tozalash"
              description="Rostdan ham barcha ma'lumotni tozalamoqchimisiz?"
              onConfirm={clearForm}
              okText="Ha albatta"
              cancelText="Yo'q"
              style={{ width: "100%" }}
            >
              <Button
                icon={<ReloadOutlined />}
                loading={isSubmitting}
                style={{ width: "100%" }}
                danger
              >
                Tozalash
              </Button>
            </Popconfirm>
          </Form.Item>
          <Form.Item style={{ width: "100%" }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveFilled />}
              style={{ width: "100%" }}
              loading={isSubmitting}
            >
              Saqlash
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
}

export default ReceptionModalInner;
