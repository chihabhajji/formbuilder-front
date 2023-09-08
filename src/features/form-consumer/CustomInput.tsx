import { forwardRef, Fragment, useRef } from "react";
import { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { ChangeFormInput } from "./CustomForm.tsx";
import CustomField from "./CustomField.tsx";
import {Field} from "../../store/formManagementApi.ts";

export enum Component {
  text = "text",
  textarea = "textarea",
  radioGroup = "radioGroup",
  select = "select",
  file = "file",
  group = "group",
}

interface IMyInputText
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "onChange"
  > {
  component: Component.text;
  value: string;
  onChange: (value: string | number) => void;
}
interface IMyTextArea
  extends Omit<
    React.DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
    "onChange"
  > {
  component: Component.textarea;
  value: string;
  onChange: (value: string) => void;
}

type Option = {
  value: string;
  label: string;
};
type Options = Option[];
interface IMyInputRadio
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "onChange"
  > {
  component: Component.radioGroup;
  value: string;
  onChange: (value: string) => void;
  options: Options;
}
interface IMySelect
  extends Omit<
    React.DetailedHTMLProps<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >,
    "onChange"
  > {
  component: Component.select;
  value: string | any[];
  onChange: (value: string | any[]) => void;
  options: Options;
}
interface IMyInputFile
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "onChange"
  > {
  component: Component.file;
  onChange: (files: FileList | null) => void;
}
type IMyGroup = {
  component: Component.group;
  fields: Field[];
  control: Control<any, any>;
  errors: FieldErrors<any>;
  onChangeForm?: (changeFormInput: ChangeFormInput) => void;
  formId?: string;
  setValue: UseFormSetValue<any>;
};
type MyInputRef = any;
export type MyInputProps = { editMode?: boolean } & (
  | IMyInputText
  | IMyTextArea
  | IMyInputRadio
  | IMySelect
  | IMyInputFile
  | IMyGroup
);

const CustomInput = forwardRef<MyInputRef, MyInputProps>((props, ref) => {
  const { component, editMode } = props;
  const myKeyRef = useRef("myKey");
  switch (component) {
    case Component.group:
      const { fields, control, errors, onChangeForm, formId, setValue } = props;
      return (
        <Fragment>
          {fields.length > 0 && (
            <div>
              {fields.map((field, fi) => (
                <CustomField
                  {...{
                    key: `field-${fi}`,
                    editMode,
                    field,
                    control,
                    errors,
                    onChangeForm,
                    formId,
                    setValue,
                  }}
                />
              ))}
            </div>
          )}
        </Fragment>
      );
    case Component.file:
      const { value, ...rest } = props;
      if (value === undefined) {
        myKeyRef.current = new Date().toISOString();
      }
      return (
        <input
          {...{
            ref,
            ...rest,
            type: "file",
            onChange: (e) => {
              props.onChange(e.target.files);
            },
            key: myKeyRef.current,
          }}
        />
      );
    case Component.select:
      if (props.value === undefined) {
        myKeyRef.current = new Date().toISOString();
      }
      return (
        <select
          {...{
            ref,
            ...props,
            onChange: (e) => {
              if (props.multiple) {
                const values = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                props.onChange(values);
                return;
              }
              props.onChange(e.target.value);
            },
            key: myKeyRef.current,
          }}
        >
          <option value={""} disabled>
            Choose here
          </option>
          {props.options.length > 0 &&
            props.options.map((option, oi) => (
              <option key={`select-option-${oi}`} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      );
    case Component.radioGroup:
      return (
        <Fragment>
          {props.options.length > 0 &&
            props.options.map((option, oi) => (
              <Fragment key={`radio-input-${oi}`}>
                <input
                  {...{
                    ref,
                    ...props,
                    type: "radio",
                    id: option.value,
                    value: option.value,
                    checked: props.value === option.value,
                    onChange: (e) => {
                      props.onChange(e.target.value);
                    },
                  }}
                />
                <label htmlFor={option.value}>{option.label}</label>
              </Fragment>
            ))}
        </Fragment>
      );
    case Component.textarea:
      return (
        <textarea
          {...{
            ref,
            ...props,
            onChange: (e) => {
              props.onChange(e.target.value);
            },
          }}
        >
          {props.value}
        </textarea>
      );
    case Component.text:
      if (props.type === "date") {
        return (
          <input
            {...{
              ref,
              ...props,
              value: new Date(props.value ?? new Date())
                .toISOString()
                .slice(0, -14),
              onChange: (e) => {
                props.onChange(e.target.value);
              },
              ...(typeof props.min === "string"
                ? { min: new Date(props.min).toISOString().slice(0, -14) }
                : {}),
              ...(typeof props.max === "string"
                ? {
                    max: new Date(props.max).toISOString().slice(0, -14),
                  }
                : {}),
            }}
          />
        );
      }
      if (props.type === "number") {
        return (
          <input
            {...{
              ref,
              ...props,
              value:
                props.value === ""
                  ? ""
                  : parseInt(String(props.value).replace(/^0+/, ""), 10),
              onChange: (e) => {
                const parsedValue =
                  e.target.value !== "" ? parseInt(e.target.value, 10) : "";
                props.onChange(parsedValue);
              },
            }}
          />
        );
      }
      return (
        <input
          {...{
            ref,
            ...props,
            onChange: (e) => {
              props.onChange(e.target.value);
            },
          }}
        />
      );
    default:
      return null;
  }
});

export default CustomInput;
