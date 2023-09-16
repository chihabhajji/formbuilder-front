import FormBuilder from "../features/dynamic-form-builder/FormBuilder.tsx";
import {useParams} from "react-router";
import {useGetApiFormManagementOneByIdQuery} from "../store/formManagementApi.ts";
import {useEffect} from "react";
import {formSlice, useAppDispatch} from "../store";

export default function FormBuilderPage() {
    const formid = useParams<{ id?: string }>().id;
    const result = useGetApiFormManagementOneByIdQuery({
        id: formid!
    }, {
        skip: !formid
    });
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (result.isSuccess && result.data?.fields) {
            dispatch(dispatch(formSlice.actions.setStore({
                fields: result.data.fields,
                required: result.data.required,
                properties: result.data.properties,
                fieldsHistory: [],
                campaignName: result.data.campaignName
            })))
        }
    }, [dispatch, result]);
    useEffect(() => {
        if(!formid) {
            dispatch(dispatch(formSlice.actions.reset()));
        }
        return () => {
            dispatch(dispatch(formSlice.actions.reset()));
        }
    }, [formid]);

    return (<FormBuilder id={formid}/>
    )
}