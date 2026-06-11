import {SaveOutlined} from "@ant-design/icons";
import {Button, Divider, Form, InputNumber, message} from "antd";
import React, {useEffect, useState} from "react";
import MainText from "../../../components/ui/title/MainText";
import {usePutUploaderPolkaReplaceMutation} from "../../../features/uploader/polka/uploaderPolkaApiSlice";
import UploaderSelectPartiyaByPolka from "./components/UploaderSelectPartiyaByPolka";
import UploaderSelectPolka from "./components/UploaderSelectPolka";
import MainInputMass from "../../../components/ui/inputMass/MainInputMass";
import removeComma from "../../../util/removeComma";

function UploaderProductReplace() {
    /* Form */
    const [form] = Form.useForm();

    /* State */
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState("");
    const [selectedPolkaId, setSelectedPolkaId] = useState(null);

    /* Message */
    const [messageApi, contextHolder] = message.useMessage();
    const key = "replaceId";

    /* Api */

    const [putReplacePolka] = usePutUploaderPolkaReplaceMutation();

    useEffect(() => {
        form.setFieldValue("outPolka", null);
        form.setFieldValue("outPolkaPartiya", null);
    }, [form]);

    /* Submit */
    const handleReplaceSubmit = async (values) => {
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
                polka_id: values?.outPolka,
                partiya_id: values?.outPolkaPartiya,
                massa: removeComma(values?.outProductMass),
                polka2_id: values?.inPolka,
            };
            const resData = await putReplacePolka(data).unwrap();
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

            <div style={{marginTop: "20px"}}>
                <MainText sm>Joyini almashtirish</MainText>
                <Divider/>
            </div>
            <Form form={form} onFinish={handleReplaceSubmit} layout="vertical">
                {/* Out polka */}
                <UploaderSelectPolka
                    label={"Chiquvchi"}
                    name={"outPolka"}
                    onSelectPolka={setSelectedPolkaId}
                />

                {/* Out polka partiya */}
                <UploaderSelectPartiyaByPolka name={"outPolkaPartiya"} polkaId={selectedPolkaId}/>

                <MainInputMass
                    name="outProductMass"
                    status={status}
                />

                <div style={{marginBottom: "3rem"}}>
                    {/* In polka */}
                    <UploaderSelectPolka label={"Kiruvchi"} name={"inPolka"}/>
                </div>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined/>}
                        style={{width: "100%"}}
                        loading={isSubmitting}
                    >
                        Saqlash
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default UploaderProductReplace;
