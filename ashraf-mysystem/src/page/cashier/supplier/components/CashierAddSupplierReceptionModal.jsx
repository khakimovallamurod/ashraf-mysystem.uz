import {SaveOutlined} from "@ant-design/icons";
import {Button, Form, message} from "antd";
import React, {useEffect, useState} from "react";
import {useAddCashierSupplierReceptionMutation} from "../../../../features/cashier/supplier/cashierSupplierApiSlice";
import MainInputPrice from "../../../../components/ui/inputPrice/MainInputPrice";
import removeComma from "../../../../util/removeComma";

function CashierAddSupplierReceptionModal({id, inputsData}) {
    /* Form */
    const [form] = Form.useForm();

    /* State */
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState("");

    /* Message */
    const [messageApi, contextHolder] = message.useMessage();
    const key = "addCustomer";

    useEffect(() => {
        if (inputsData) {
            form.setFieldsValue({
                naqdsum: inputsData?.naqdsum,
                naqdusd: inputsData?.naqdusd,
                bank: inputsData?.bank,
                karta: inputsData?.karta,
            })
        }
    }, [inputsData])

    /* API */
    const [addReception] = useAddCashierSupplierReceptionMutation();

    /* Handle Submit */
    const handleSubmit = async (values) => {
        const {bank, karta, naqdsum, naqdusd} = values;

        /* Set Event */
        setIsSubmitting(true);
        /* Set status */
        setStatus("validating");
        /* Message */
        messageApi.open({
            key,
            type: "loading",
            content: "Loading...",
        });
        try {
            const data = {
                user_id: id,
                naqdsum: removeComma(naqdsum),
                naqdusd: removeComma(naqdusd),
                bank: removeComma(bank),
                karta: removeComma(karta),
            };
            const resData = await addReception(data).unwrap();
            if (resData?.success === true) {
                form.resetFields();
                setStatus("success");
                if (resData?.message) {
                    messageApi.open({
                        key,
                        type: "success",
                        content: resData?.message,
                    });
                }
            } else if (resData?.success === false) {
                setStatus("error");
                if (resData?.message) {
                    messageApi.open({
                        key,
                        type: "error",
                        content: resData?.message,
                    });
                }
            }
            setTimeout(() => {
                setStatus("");
            }, 2000);
        } catch (err) {
            if (err.status === "FETCH_ERROR") {
                setStatus("warning");
                messageApi.open({
                    key,
                    type: "warning",
                    content: `Ulanishda xatolik! Qaytadan urinib ko'ring!`,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <MainInputPrice
                    label="Naqd so'm"
                    name="naqdsum"
                    showLabel={true}
                    status={status}
                />
                <MainInputPrice
                    label="Naqd usd"
                    name="naqdusd"
                    showLabel={true}
                    status={status}
                />
                <MainInputPrice
                    label="Bank"
                    name="bank"
                    showLabel={true}
                    status={status}
                />
                <MainInputPrice
                    label="Karta"
                    name="karta"
                    showLabel={true}
                    status={status}
                />

                <Form.Item>
                    <Button
                        style={{width: "100%"}}
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined/>}
                        loading={isSubmitting}
                    >
                        Saqlash
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default CashierAddSupplierReceptionModal;
