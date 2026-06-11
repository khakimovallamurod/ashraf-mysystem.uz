import React from 'react';
import FormItem from "antd/es/form/FormItem";
import {NumericFormat} from "react-number-format";
import {Input} from "antd";

function MainInputMass({status='', name="mass", onChange=() => {}}) {
    return (
        <FormItem
            label="Massa"
            name={name}
            hasFeedback
            validateStatus={status}
            rules={[
                {
                    required: true,
                    message: "Massa talab qilinadi!",
                },
            ]}
        >
            <NumericFormat
                customInput={Input}
                thousandSeparator=" "
                min={0}
                placeholder="Massa kiritish"
                onChange={onChange}
            />
        </FormItem>
    );
}

export default MainInputMass;