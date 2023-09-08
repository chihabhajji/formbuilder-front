import CustomForm from "../form-consumer/CustomForm.tsx";
import {computeValueFromType} from "../../utils/computeValueFromType.ts";
import {formSlice, useAppDispatch, useAppSelector} from "../../store";
import {useEffect, useState} from "react";
import {Component} from "../form-consumer/CustomInput.tsx";
import {Field, useCreateMutation, useUpdateMutation} from "../../store/formManagementApi.ts";
import {enqueueSnackbar} from "notistack";

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

export const INITIAL_SELECT_OR_RADIO_FIELD =  (component: Component.select | Component.radioGroup) => ({
    name: "select",
    label: "Select",
    component: component,
    options: [
        {
            value: "value1",
            label: "Value 1",
        },
        {
            value: "value2",
            label: "Value 2",
        }
    ],
} as Field)

export default function FormBuilder({ id}: { id?: string }) {
    const [createMutation,createState] = useCreateMutation()
    const [updateMutation, updateState] = useUpdateMutation()
    const isLoading = createState.isLoading || updateState.isLoading;
    const isError = createState.isError || updateState.isError;
    const isSuccess = createState.isSuccess || updateState.isSuccess;
    const data = createState.data ?? updateState.data;

    const fields = useAppSelector((state) => state.form.fields);
    const [currentField, setCurrentField] = useState(fields[fields.length - 1] ?? INITIAL_TEXT_FIELD);
    const required = useAppSelector((state) => state.form.required);
    const properties = useAppSelector((state) => state.form.properties);
    const dispatch = useAppDispatch()
    useEffect(() => {
        if(isError){
            enqueueSnackbar("Error", {
                variant: 'error'
            })
        }
    }, [isError]);
    useEffect(() => {
        if(isSuccess && data){
            enqueueSnackbar(id ? 'Update success' : 'Create success', {
                variant: 'success'
            })
            window.location.href = `/form-builder/${data._id}`;
        }
    }, [isSuccess, data, id, dispatch, properties, fields]);
    return (
        <>
            {
                currentField && (<div className="p-8 space-y-6 bg-white rounded-md w-full max-w-md mx-auto shadow-lg mt-20">
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
                    {currentField.component === "select" || currentField.component === "radioGroup" && (
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
                                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
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
                                className="px-4 py-2 mt-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                onClick={() =>
                                    setCurrentField((prev) => ({
                                        ...prev,
                                        options: [
                                            ...(prev.options ?? []),
                                            {
                                                value: "",
                                                label: "",
                                            }
                                        ]
                                    }))
                                }
                            >
                                Add Option
                            </button>
                        </div>
                    )}


                </div>)
            }
            <div>
                <CustomForm
                    editMode={true}
                    form={{
                        fields: fields,
                        defaultValues: fields.map(
                            value =>
                                ({
                                    [value.name]: computeValueFromType(value.type)
                                })
                        ),
                        schema: properties,
                        id: "1"
                    }}/>

                <button onClick={() => {
                    dispatch(formSlice.actions.addField(currentField ?? INITIAL_TEXT_FIELD))
                }}>Add field
                </button>
                <button onClick={() => {
                    dispatch(formSlice.actions.removeFields())
                }}>Reset all
                </button>
                <button disabled={isLoading} onClick={() => {
                    if(id) {
                        updateMutation({
                            id: id,
                            formInput: {
                                _id: id,
                                fields,
                                required,
                                properties,
                            }
                        })
                    } else {
                        createMutation({
                            createFormDto: {
                                fields,
                                required,
                                properties,
                            }
                        })
                    }
                }}>
                    {isLoading ? 'Loading...' : id ? 'Update' : 'Create'}
                </button>
            </div>
        </>
    )
}