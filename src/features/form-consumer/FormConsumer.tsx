import {useCallback, useRef} from 'react'
import CustomDynamicForm, {DynamicFormRef, FormData} from "./CustomForm.tsx";
import {computeValueFromType} from "../../utils/computeValueFromType.ts";
import {FormInput} from "../../store/formManagementApi.ts";

function FormConsumer({
        form,
        onSubmitForm
                      }: {
    form: FormInput,
    onSubmitForm: (data: FormData) => unknown
}) {
    const dynamicFormRef = useRef<DynamicFormRef | null>(null);
    const handleCancel = useCallback(() => {
        dynamicFormRef.current?.cancel();
    }, []);
    const handleSubmit = useCallback(() => {
        dynamicFormRef.current?.submit();
    }, []);

    if(!form.fields) return <div>Form fields not found</div>
    const {_id, ...withoutId} = form;
    return (
<>
    <CustomDynamicForm
        {...{
            ref: dynamicFormRef,
            form: {
                id: _id,
                schema: withoutId.properties,
                fields: form.fields,
                defaultValues: Object.entries(form.properties).map(
                    ([key, value]) =>
                        ({
                            [key]: computeValueFromType(value.type)
                        })
                )
            },
            onSubmitForm,
        }}
    />
    <div className="mt-6 flex justify-end space-x-4">
        <button 
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            onClick={handleCancel}>
            Cancel
        </button>
        <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleSubmit}>
            Submit
        </button>
    </div>
</>

    )
}

export default FormConsumer;
