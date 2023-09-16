import {useCallback, useRef} from 'react'
import CustomDynamicForm, {DynamicFormRef, FormData} from "./CustomForm.tsx";
import {computeValueFromType} from "../../libs/computeValueFromType.ts";
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

    if (!form.fields) return <div>Form fields not found</div>
    const {_id, ...withoutId} = form;
    return (
        <>
            <CustomDynamicForm
                {...{
                    ref: dynamicFormRef,
                    form: {
                        id: _id,
                        schema: withoutId.properties,
                        fields: withoutId.fields!,

                        defaultValues: Object.entries(withoutId.properties).map(
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
                    className="px-4 py-2 border bg-muted border-accent/40 rounded hover:bg-accent focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
                    onClick={handleCancel}>
                    Reset
                </button>
                <button
                    className="px-4 py-2 rounded hover:bg-accent focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
                    onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </>

    )
}

export default FormConsumer;
