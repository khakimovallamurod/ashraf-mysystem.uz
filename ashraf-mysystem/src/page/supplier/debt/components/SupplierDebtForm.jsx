import {PlusOutlined} from "@ant-design/icons";
import {Button, Form, InputNumber, Select, message} from "antd";
import React, {useMemo, useState} from "react";
import {
    useAddSupplierDebtMutation,
    useGetSuppplierCustomerQuery
} from "../../../../features/supplier/debt/supplierDebtApiSlice";
import removeComma from "../../../../util/removeComma";
import MainInputPrice from "../../../../components/ui/inputPrice/MainInputPrice";

function SupplierDebtForm() {
    /* Form */
    const [form] = Form.useForm();

    /* State */
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState("");

    /* API */
    const [addButcher] = useAddSupplierDebtMutation();
    const customerRes = useGetSuppplierCustomerQuery();

    /* Message */
    const [messageApi, contextHolder] = message.useMessage();
    const key = "updatable";

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

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        setStatus("validating");
        messageApi.open({
            key,
            type: "loading",
            content: "Loading...",
        });
        try {
            const data = {
                client_id: values?.customer,
                naqdsum: removeComma(values?.naqdsum),
                naqdusd: removeComma(values?.naqdusd),
                valyuta: removeComma(values?.valyuta),
                bank: removeComma(values?.bank),
                karta: removeComma(values?.karta),
            };

            const resData = await addButcher(data).unwrap();
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
        } catch (err) {
            if (err.status === "FETCH_ERROR") {
                setStatus("warning");
                messageApi.open({
                    key,
                    type: "warning",
                    content: "Ulanishda xatolik! Qaytadan urinib ko'ring!",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {contextHolder}

            <Form
                form={form}
                onFinish={handleSubmit}
                autoComplete="off"
                layout="vertical"
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    padding: "1rem",
                }}
            >
                <Form.Item
                    label={'Xaridorni tanlash'}
                    name="customer"
                    rules={[
                        {
                            required: true,
                            message: "Xaridorni tanlang!",
                        },
                    ]}
                    style={{width: "100%"}}
                    hasFeedback
                    validateStatus={status}
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder="Xaridorni tanlash"
                        loading={customerRes?.isLoading}
                        filterOption={(inputValue, option) =>
                            option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >=
                            0
                        }
                    >
                        {customerOptions.map((option) => (
                            <Select.Option value={option.id} key={option.id}>
                                {option?.fio}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <MainInputPrice
                    showLabel={true}
                    label="Naqd so'm"
                    name="naqdsum"
                    status={status}
                />
                <MainInputPrice
                    showLabel={true}
                    label="Naqd usd"
                    name="naqdusd"
                    status={status}
                />
                <MainInputPrice
                    showLabel={true}
                    label="Valyuta"
                    name="valyuta"
                    status={status}
                />
                <MainInputPrice
                    showLabel={true}
                    label="Bank"
                    name="bank"
                    status={status}
                />
                <MainInputPrice
                    showLabel={true}
                    label="Karta"
                    name="karta"
                    status={status}
                />

                <Form.Item>
                    <Button
                        style={{width: "100%", marginTop: "3rem"}}
                        htmlType="submit"
                        type="primary"
                        icon={<PlusOutlined/>}
                        loading={isSubmitting}
                    >
                        Saqlash
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default SupplierDebtForm;
