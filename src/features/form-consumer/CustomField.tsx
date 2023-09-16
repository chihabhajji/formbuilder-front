/* eslint-disable */
import {Control, Controller, FieldErrors, UseFormSetValue} from "react-hook-form";
import CustomInput from "./CustomInput.tsx";
import {ChangeFormInput} from "./CustomForm.tsx";
import {Field} from "../../store/formManagementApi.ts";
import {formSlice, useAppDispatch, useAppSelector} from "../../store";
import {Button} from "../../components/ui/button.tsx";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/20/solid";

type MyfieldProps = {
    editmode?: boolean;
    field: Field;
    control?: Control<any>;
    errors?: FieldErrors<any>;
    onChangeForm?: (changeFormInput: ChangeFormInput) => void;
    formId?: string;
    setValue?: UseFormSetValue<any>;
};

const CustomField: React.FC<MyfieldProps> = ({
                                                 editmode,
                                                 field,
                                                 control,
                                                 errors,
                                                 onChangeForm,
                                                 formId,
                                                 setValue
                                             }) => {
    const dispatch = useAppDispatch();
    if (!field) return <div>This is awkward</div>;
    if (field.name === null || field.name === undefined) return <div>Even more</div>
    const property = useAppSelector(state => state.form.properties[field.name]);
    const required = useAppSelector(state => state.form.required.includes(field.name));
    const requiredFieldId = `${field.name}-required`;
    return (
        <div className={"flex flex-col p-2 m-2"}>
            <div className="mb-4 flex flew-col">
                {required? (<EyeIcon width={24} height={24}/>) : (<EyeSlashIcon width={24} height={24}/>)}
                <label htmlFor={field.name} className="flex-1 block mb-2 text-sm font-medium text-gray-600">
                    {`${field.label}`}
                </label>
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
                                    editmode
                                }}
                            />
                        );
                    }}
                />
            </div>
            {
                editmode && (
                    <div className={"flex flex-row place-content-evenly my-auto"}>
                        {
                            field?.component === "text" && (
                                <div className="flex flex-col space-y-2">
                                    <label className="text-lg font-semibold">Text field type:</label>
                                    <select name={`${field.name}-type`}
                                            className={"w-full"}
                                            value={property?.format ?? undefined}
                                            onChange={(e) => dispatch(formSlice.actions.addProperties({
                                                type: e.target.value as any,
                                                name: field.name,
                                                format: e.target.value === "email" ? "email" : undefined
                                            }))}
                                            >
                                        <option value={"address"}>Address</option>
                                        <option value={"email"}>Email</option>
                                        <option value={"password"}>Password</option>
                                        <option value={"date"}>Date</option>
                                    </select>
                                </div>
                            )
                        }
                        <div className={"flex flex-row my-auto"}>
                            <input type="checkbox" id={requiredFieldId}
                                   checked={required}
                                   onChange={() => dispatch(formSlice.actions.toggleRequired(field.name))}
                                   className="mr-2 rounded focus:ring-2 focus:ring-accent"/>
                            <label htmlFor={requiredFieldId} className="text-sm">
                                {required ? "Required" : "Optional"}
                            </label>
                        </div>
                        <Button variant={"outline"} onClick={() => dispatch(formSlice.actions.removeField(field.name))}>
                            Remove
                        </Button>
                    </div>
                )
            }
            {errors && field.name && errors[field.name] && (
                <span id={`${field.name}-error`} className="block mt-1 text-sm text-red-500">
                    {errors[field.name]?.message?.toString()}
                </span>
            )}
        </div>
    );
};

export default CustomField;
