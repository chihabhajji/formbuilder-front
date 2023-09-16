import CustomForm from "../form-consumer/CustomForm.tsx";
import {computeValueFromType} from "../../libs/computeValueFromType.ts";
import {formSlice, useAppDispatch, useAppSelector} from "../../store";
import {useEffect, useMemo, useState} from "react";
import {Component} from "../form-consumer/CustomInput.tsx";
import {Field, useCreateMutation, useUpdateMutation} from "../../store/formManagementApi.ts";
import {enqueueSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {Button} from "../../components/ui/button.tsx";
import CampaignNameStep from "./CampaignNameStep.tsx";
import {ArrowLeftCircleIcon, BackwardIcon, ForwardIcon} from "@heroicons/react/24/solid";
import {PlusCircledIcon, ResetIcon} from "@radix-ui/react-icons";

export const INITIAL_TEXT_FIELD: Field = {
    name: "text",
    label: "Text",
    component: Component.text,
}

export const INITIAL_TEXTAREA_FIELD: Field = {
    name: "textarea",
    label: "Text Area",
    component: Component.textarea,
    rows: 3,
}

export const INITIAL_SELECT_OR_RADIO_FIELD = (component: Component.select | Component.radioGroup) => ({
    name: "select",
    label: "Select",
    component: component,
    options: [
        {
            value: "field-1",
            label: "Field 1 label",
        },
        {
            value: "field-2",
            label: "Field 2 label",
        }
    ],
} as Field)

export default function FormBuilder({id}: { id?: string }) {
    const [createMutation, createState] = useCreateMutation()
    const [updateMutation, updateState] = useUpdateMutation()
    const isLoading = createState.isLoading || updateState.isLoading;
    const isError = createState.isError || updateState.isError;
    const isSuccess = createState.isSuccess || updateState.isSuccess;
    const data = createState.data ?? updateState.data;

    const fields = useAppSelector((state) => state.form.fields);
    const fieldsHistory = useAppSelector((state) => state.form.fieldsHistory);
    const campaignName = useAppSelector((state) => state.form.campaignName);
    const required = useAppSelector((state) => state.form.required);
    const properties = useAppSelector((state) => state.form.properties);
    const dispatch = useAppDispatch()

    const [currentField, setCurrentField] = useState(fields[fields.length - 1] ?? INITIAL_TEXT_FIELD);
    const defaultValues = useMemo(() => {
        return fields.map(
            value =>
                ({
                    [value.name]: computeValueFromType(value.type)
                })
        )
    }, [fields]);
    useEffect(() => {
        if (isError) {
            enqueueSnackbar("Error", {
                variant: 'error'
            })
        }
    }, [isError]);
    const navigate = useNavigate();
    useEffect(() => {
        if (isSuccess && data) {
            enqueueSnackbar(id ? 'Update success' : 'Create success', {
                variant: 'success'
            })
            navigate(`/form-builder/${data._id}`);
        }
    }, [isSuccess, data]);
    if (!campaignName) {
        return <CampaignNameStep/>
    }
    return (
        <div>
            <div className={"grid grid-cols-2 mx-auto "}>
                <div className={"border border-accent bg-transparent shadow-sm h-[90vh] dark:text-accent"}>
                    <div className={
                        " flex flex-col space-x-2 justify-center items-center p-4 bg-white rounded-md w-full max-w-md mx-auto shadow-lg mt-20"
                    }>
                        <div className="flex flex-col">
                            <label className="text-lg font-semibold" htmlFor="fieldType">
                                Campaign : {campaignName}
                            </label>
                        </div>

                        <select className="px-4 py-2 border rounded-md mt-4 w-full" disabled={fields.length === 0}
                                onChange={(e) => {
                                    setCurrentField(fields.find(f => f.name === e.target.value)!)
                                }}
                        >
                            <option value={currentField.name}>Select an option</option>
                            {fields?.map((field) => <option
                                key={field.name} value={field.name}>{field.label}</option>)}
                        </select>
                    </div>
                    <div>
                        {
                            currentField && (
                                <div className="p-8 space-y-6 bg-white rounded-md w-full max-w-md mx-auto shadow-lg mt-20">
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-lg font-semibold" htmlFor="fieldType">
                                            Field Type:
                                        </label>
                                        <select
                                            id="fieldType"
                                            className="px-4 py-2 border rounded-md"
                                            value={currentField.type}
                                            onChange={(e) =>
                                                setCurrentField((prev) => {
                                                    switch (e.target.value as Component) {
                                                        case Component.text:
                                                            return INITIAL_TEXT_FIELD;
                                                        case Component.textarea:
                                                            return INITIAL_TEXTAREA_FIELD;
                                                        case Component.select:
                                                            return INITIAL_SELECT_OR_RADIO_FIELD(Component.select);
                                                        case Component.radioGroup:
                                                            return INITIAL_SELECT_OR_RADIO_FIELD(Component.radioGroup);
                                                        default:
                                                            return prev;
                                                    }
                                                })
                                            }
                                        >
                                            <option value={Component.text}>Text</option>
                                            <option value={Component.select}>Text Options</option>
                                            <option value={Component.textarea}>Text area</option>
                                            <option value={Component.radioGroup}>Radio group</option>
                                            {/*<option value={Component.group}>Group ? (PLEASE DONT TOUCH ME)</option>*/}
                                        </select>
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <label className="text-lg font-semibold" htmlFor="fieldLabel">
                                            Label:
                                        </label>
                                        <input
                                            id="fieldLabel"
                                            type="text"
                                            className="px-4 py-2 border rounded-md"
                                            value={currentField.label}
                                            onChange={(e) =>
                                                setCurrentField((prev) => ({
                                                    ...prev,
                                                    name: e.target.value.replace(/[|&;$%@"<>()'+,]/g, ""),
                                                    label: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className={"w-full"}>
                                        {(currentField.component === "select" || currentField.component === "radioGroup") && (
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-lg font-semibold">Options:</label>
                                                {currentField.options?.map((option, index) => (
                                                    <div key={option.label} className="flex space-x-2">
                                                        <input
                                                            type="text"
                                                            className="px-4 py-2 border rounded-md flex-grow"
                                                            value={option.value}
                                                            onChange={(e) => {
                                                                if (!currentField.options) return;
                                                                const newOptions = [...currentField.options];
                                                                newOptions[index] = {
                                                                    value: e.target.value,
                                                                    label: newOptions[index].label,
                                                                };
                                                                setCurrentField((prev) => ({...prev, options: newOptions}));
                                                            }}
                                                            placeholder={option.label}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="px-2 py-1 bg-accent/40 rounded-md hover:bg-accent"
                                                            onClick={() => {
                                                                const newOptions = [...(currentField.options ?? [])];
                                                                newOptions.splice(index, 1);
                                                                setCurrentField((prev) => ({...prev, options: newOptions}));
                                                            }}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    className="px-4 py-2 mt-2 bg-secondary/40 rounded-md hover:bg-secondary w-full"
                                                    onClick={() => {
                                                        setCurrentField((prev) => ({
                                                            ...prev,
                                                            options: [
                                                                ...(prev.options ?? []),
                                                                {
                                                                    value: `field-${(currentField?.options?.length ?? 0) + 1}`,
                                                                    label: `field-${(currentField?.options?.length ?? 0) + 1}`,
                                                                }
                                                            ]
                                                        }));
                                                    }
                                                    }
                                                >
                                                    Add Option
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>)
                        }
                        <div
                            className={
                                "flex flex-row space-x-2 justify-center items-center p-4 bg-white rounded-md w-full max-w-md mx-auto my-auto shadow-lg"
                            }
                        >
                            {
                                fields.length > 0 && (
                                    <Button onClick={() => {
                                        dispatch(formSlice.actions.undoLast())
                                    }}><BackwardIcon
                                        height={24}
                                        width={24}
                                    />
                                    </Button>
                                )
                            }
                            <Button onClick={() => {
                                if (currentField)
                                    dispatch(formSlice.actions.addField(currentField))
                            }}>
                                <PlusCircledIcon/>
                            </Button>
                            {
                                fieldsHistory.length > 0 && (
                                    <Button onClick={() => {
                                        dispatch(formSlice.actions.redoLast())
                                    }}><ForwardIcon
                                        height={24}
                                        width={24}
                                    />
                                    </Button>
                                )
                            }
                            {
                                fields.length > 0 && (
                                    <Button onClick={() => {
                                        dispatch(formSlice.actions.reset())
                                    }}><ResetIcon
                                        height={24}
                                        width={24}
                                    />
                                    </Button>
                                )
                            }
                        </div>
                    </div>
                </div>
                <CustomForm
                    editmode={true}
                    form={{
                        fields: fields,
                        defaultValues,
                        schema: properties,
                        id: id ?? "1"
                    }}/>
            </div>
            <div
                className={"flex flex-row space-x-2 justify-center items-center p-4 bg-white rounded-md w-full max-w-md mx-auto my-auto shadow-lg"}>
                <Button variant={'secondary'}
                        className={'hover:bg-muted/50'}
                        onClick={() => {
                            dispatch(formSlice.actions.setCampaignName(undefined))
                        }}
                >
                    <ArrowLeftCircleIcon
                        className=" h-5 w-5"
                        width={24}
                        height={24}
                    />
                </Button>
                <Button disabled={fields.length < 1 || isLoading}
                        onClick={() => {
                            if (id) {
                                updateMutation({
                                    id: id,
                                    // @ts-ignore
                                    formInput: {
                                        _id: id,
                                        fields,
                                        required,
                                        properties,
                                        campaignName
                                    }
                                })
                            } else {
                                createMutation({
                                    createFormDto: {
                                        fields,
                                        required,
                                        properties,
                                        campaignName
                                    }
                                })
                            }
                        }}>
                    {isLoading ? 'Loading...' : id ? 'Update' : 'Create'}
                </Button>

            </div>
        </div>

    )
}