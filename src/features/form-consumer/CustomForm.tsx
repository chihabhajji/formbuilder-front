import {forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle} from "react";
import {FieldErrors, SubmitHandler, useForm, UseFormReturn} from "react-hook-form";
import CustomInput, {Component} from "./CustomInput.tsx";
import {ajvResolver} from "@hookform/resolvers/ajv";
import {Field} from "../../store/formManagementApi.ts";
import {JSONSchemaType} from "ajv";

export type Form = {
    id: string;
    fields: Field[];
    defaultValues?: any;
    schema: JSONSchemaType<any>;
};
export type FormData = {
    formId: string;
    data: any;
};
export type ChangeFormInput = {
    formId?: string;
    fieldName?: string;
    value?: any;
};
export interface MyDynamicFormProps {
    editmode?: boolean;
    children?: ReactNode;
    form: Form;
    onSubmitForm?: (data: FormData) => Promise<any> | any;
    onErrorForm?: (error: FieldErrors<any>) => void;
    onChangeForm?: (changeFormInput: ChangeFormInput) => void;
}
export type DynamicFormRef = {
    form: UseFormReturn<any>;
    submit: () => void;
    cancel: () => void;
};

const CustomDynamicForm = forwardRef<DynamicFormRef, MyDynamicFormProps>(
    (props, ref) => {
        const { form, onSubmitForm, onErrorForm, onChangeForm, editmode } = props;
        const { id: formId, fields, defaultValues, schema } = form;
        const reactHookForm = useForm<IFormInput>({
            defaultValues,
            resolver: ajvResolver(schema, {
                $data: true,
                strictSchema: false,
                code: {
                    esm: true,
                },
                strict: false,
            })
        });
        const watch = reactHookForm.watch()
        useEffect(() => {
            console.log(watch)
        }, [watch])
        const {
            control,
            formState: { errors },
            handleSubmit,
            reset,
            setValue
        } = reactHookForm;
        type IFormInput = typeof defaultValues;
        const onSubmit: SubmitHandler<IFormInput> = useCallback(
            async (data) => {
                if (typeof onSubmitForm === "function") {
                    await onSubmitForm({ formId, data });
                }
            },
            [onSubmitForm, formId]
        );

        const submit = useCallback(() => {
            handleSubmit(onSubmit)();
        }, [handleSubmit, onSubmit]);

        const cancel = useCallback(() => {
            reset(defaultValues);
        }, [reset, defaultValues]);

        useImperativeHandle(
            ref,
            () => ({
                form: reactHookForm,
                submit,
                cancel
            }),
            [reactHookForm, submit, cancel]
        );

        useEffect(() => {
            if (typeof onErrorForm === "function" && Object.keys(errors).length > 0) {
                onErrorForm(errors);
            }
        }, [errors, onErrorForm]);

        return (
            <form onSubmit={handleSubmit(onSubmit)} noValidate
                className={"border border-input bg-transparent shadow-sm static flex flex-col px-4 py-10 overflow-y-scroll h-[90vh]"}
            >
                <CustomInput
                    {...{
                        editmode,
                        component: Component.group,
                        fields,
                        control,
                        errors,
                        onChangeForm,
                        formId,
                        setValue
                    }}
                />
            </form>
        );
    }
);

export default CustomDynamicForm;
