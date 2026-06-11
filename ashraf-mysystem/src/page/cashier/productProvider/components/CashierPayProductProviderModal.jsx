import {SaveOutlined} from "@ant-design/icons";
import {Button, Form, Input, InputNumber, Select, message} from "antd";
import React, {useMemo, useState} from "react";
import {
    useAddCashierPayProviderMutation,
    useGetCashierProdProviderQuery,
} from "../../../../features/cashier/productProvider/cashierProviderApiSlice";
import removeComma from "../../../../util/removeComma";
import MainInputPrice from "../../../../components/ui/inputPrice/MainInputPrice";

function CashierPayProductProviderModal() {
    /* Form */
    const [form] = Form.useForm();

    /* State */
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState("");

    /* Message */
    const [messageApi, contextHolder] = message.useMessage();
    const key = "addCustomer";

    /* API */
    const provider = useGetCashierProdProviderQuery();
    const [addProduct] = useAddCashierPayProviderMutation();

    /* Provider Options */
    const providerOptions = useMemo(() => {
        if (
            provider.data?.success === true &&
            provider.data?.data &&
            Array.isArray(provider.data?.data)
        ) {
            return provider.data.data;
        }
        return [];
    }, [provider.data]);

    /* Handle Submit */
    const handleSubmit = async (values) => {
        const {naqdsum, naqdusd, valyuta, bank, karta, izoh} = values;
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
                taminotchi_id: values.provider,
                naqdsum: removeComma(naqdsum),
                naqdusd: removeComma(naqdusd),
                valyuta: removeComma(valyuta),
                bank: removeComma(bank),
                karta: removeComma(karta),
                izoh,
            };
            const resData = await addProduct(data).unwrap();
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
                {/* Provider */}
                <Form.Item
                    label="Taminotchi"
                    name="provider"
                    rules={[
                        {
                            required: true,
                            message: "Taminotchini tanlang!",
                        },
                    ]}
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder="Taminotchini tanlash"
                        loading={provider.isLoading}
                        filterOption={(inputValue, option) =>
                            option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >=
                            0
                        }
                    >
                        {providerOptions.map((option) => (
                            <Select.Option value={option.id} key={option.id}>
                                {option.fio}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <MainInputPrice
                    label="Naqd so'm"
                    name="naqdsum"
                    status={status}
                />
                <MainInputPrice
                    label="Naqd usd"
                    name="naqdusd"
                    status={status}
                />
                <MainInputPrice
                    label="Valyuta"
                    name="valyuta"
                    status={status}
                />
                <MainInputPrice
                    label="Bank"
                    name="bank"
                    status={status}
                />
                <MainInputPrice
                    label="Karta"
                    name="karta"
                    status={status}
                />
                <Form.Item
                    label="Izoh"
                    name="izoh"
                    hasFeedback
                    validateStatus={status}
                    rules={[
                        {
                            required: true,
                            message: "Izoh talab qilinadi!",
                        },
                    ]}
                >
                    <Input.TextArea
                        allowClear
                        showCount
                        placeholder="Izoh kiritish"
                        rows={6}
                    />
                </Form.Item>

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

export default CashierPayProductProviderModal;
