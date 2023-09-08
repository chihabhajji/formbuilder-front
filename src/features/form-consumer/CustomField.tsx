/* eslint-disable */
import {Control, Controller, FieldErrors, UseFormSetValue} from "react-hook-form";
import CustomInput from "./CustomInput.tsx";
import {ChangeFormInput} from "./CustomForm.tsx";
import {Field} from "../../store/formManagementApi.ts";
import {formSlice, useAppDispatch, useAppSelector} from "../../store";

type MyfieldProps = {
    editMode?: boolean;
    field: Field;
    control?: Control<any>;
    errors?: FieldErrors<any>;
    onChangeForm?: (changeFormInput: ChangeFormInput) => void;
    formId?: string;
    setValue?: UseFormSetValue<any>;
};

const CustomField: React.FC<MyfieldProps> = ({
                                                 editMode,
                                                 field,
                                                 control,
                                                 errors,
                                                 onChangeForm,
                                                 formId,
                                                 setValue
                                             }) => {
    const dispatch = useAppDispatch();
    if(!field) return <div>This is awkward</div>;
    if(!field.name) return <div>Even more</div>
    const property = useAppSelector(state => state.form.properties[field.name]);
    const required = useAppSelector(state => state.form.required.includes(field.name));
    console.log(property)
    console.log(required)
    console.log(field)
    console.log(property?.type)
    const requiredFieldId= `${field.name}-required`;
    return (
        <div className="mb-4">
            {field.label && (
                <label htmlFor={field.name} className="block mb-2 text-sm font-medium text-gray-600">
                    {field.label}
                </label>
            )}

            <Controller
                name={field.name}
                control={control}
                render={(props) => {
                    return (
                        // @ts-ignore
                        <CustomInput
                            {...{
                                ...props.field,
                                ...field,
                                id: field.name,
                                "aria-invalid": errors && errors[field.name] ? "true" : "false",
                                "aria-errormessage": errors && errors[field.name] && `${field.name}-error`,
                                onChange: (value: any) => {
                                    props.field.onChange(value);
                                    if (typeof onChangeForm === "function") {
                                        onChangeForm({
                                            formId,
                                            fieldName: field.name,
                                            value
                                        });
                                    }
                                },
                                control,
                                errors,
                                onChangeForm,
                                formId,
                                setValue,
                                editMode
                            }}
                        />
                    );
                }}
            />

            {editMode && (
                <div className="flex items-center mt-5">
                    <button onClick={() => dispatch(formSlice.actions.removeField(field.name))}>
                        Remove
                    </button>
                    <input type="checkbox" id={requiredFieldId}
                           checked={required}
                           onChange={() => dispatch(formSlice.actions.toggleRequired(field.name))}
                           className="mr-2 rounded text-blue-500 focus:ring-2 focus:ring-blue-400"/>
                    <label htmlFor={requiredFieldId} className="text-sm text-gray-600">
                        {required ? "Required" : "Optional"}
                    </label>
                    <div>
                    {
                        field?.component === "text" && (
                            <select name={`${field.name}-type`} value={property?.type ?? undefined}
                                    onChange={(e) => dispatch(formSlice.actions.addProperties({
                                        name: field.name,
                                        type: e.target.value as any
                                    }))}>
                                <option value={"address"}>address</option>
                                <option value={"email"}>Email</option>
                                <option value={"password"}>Password</option>
                                <option value={"date"}>Date</option>
                            </select>
                        )
                    }
                    </div>
                    <div>
                        {
                            (field.component == "select" || field.component === "radioGroup") && (
                                <div>
                                    zibo
                                    <button
                                        type="button"
                                        className="px-4 py-2 mt-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                        onClick={() => dispatch(formSlice.actions.addOption(field.name))}
                                    >
                                        Add Option
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>
            )}

            {errors && errors[field.name] && (
                <span id={`${field.name}-error`} className="block mt-1 text-sm text-red-500">
                    {errors[field.name]?.message?.toString()}
                </span>
            )}
        </div>
    );
};

export default CustomField;
