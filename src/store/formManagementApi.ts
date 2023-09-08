import {emptySplitApi as api} from "./emptyApi";
import {JSONSchemaType} from "ajv";

const injectedRtkApi = api.injectEndpoints({
    endpoints: (build) => ({
        all: build.query<AllApiResponse, AllApiArg>({
            query: () => ({url: `/api/form-management/all`}),
        }),
        getApiFormManagementOneById: build.query<
            GetApiFormManagementOneByIdApiResponse,
            GetApiFormManagementOneByIdApiArg
        >({
            query: (queryArg) => ({url: `/api/form-management/one/${queryArg.id}`}),
        }),
        create: build.mutation<CreateApiResponse, CreateApiArg>({
            query: (queryArg) => ({
                url: `/api/form-management`,
                method: "POST",
                body: queryArg.createFormDto,
            }),
        }),
        update: build.mutation<UpdateApiResponse, UpdateApiArg>({
            query: (queryArg) => ({
                url: `/api/form-management/${queryArg.id}`,
                method: "PUT",
                body: queryArg.formInput,
            }),
        }),
        deleteApiFormManagementById: build.mutation<
            DeleteApiFormManagementByIdApiResponse,
            DeleteApiFormManagementByIdApiArg
        >({
            query: (queryArg) => ({
                url: `/api/form-management/${queryArg.id}`,
                method: "DELETE",
            }),
        }),
        submitFormAnswer: build.mutation<
            SubmitFormAnswerApiResponse,
            SubmitFormAnswerApiArg
        >({
            query: (queryArg) => ({
                url: `/api/form-management/submit/${queryArg.formId}`,
                method: "PUT",
                body: queryArg.data,
            }),
        }),
    }),
    overrideExisting: false,
});
export {injectedRtkApi as formManagementApi};
export type AllApiResponse = /** status 200  */ FormInput[];
export type AllApiArg = void;
export type GetApiFormManagementOneByIdApiResponse =
/** status 200  */ FormInput;
export type GetApiFormManagementOneByIdApiArg = {
    id: string;
};
export type CreateApiResponse = /** status 201  */ FormInput;
export type CreateApiArg = {
    createFormDto: CreateFormDto;
};
export type UpdateApiResponse = /** status 200  */ FormInput;
export type UpdateApiArg = {
    id: string;
    formInput: FormInput;
};
export type DeleteApiFormManagementByIdApiResponse = unknown;
export type DeleteApiFormManagementByIdApiArg = {
    id: string;
};
export type SubmitFormAnswerApiResponse = /** status 200  */ FormInput;
export type SubmitFormAnswerApiArg = {
    formId: string;
    data: Record<string, string | []>;
};

export type OptionType = {
    value: string;
    label: string;
};
export type Field = {
    name: string;
    label?: string;
    component: "text" | "textarea" | "radioGroup" | "select" | "file" | "group";
    type?: "address" | "email" | "password" | "date";
    placeholder?: string;
    rows?: number;
    options?: OptionType[];
    multiple?: boolean;
};
export type FormInput = {
    _id: string;
    properties:  JSONSchemaType<unknown>;
    required: string[];
    fields?: Field[];
    answers?: object[];
};
export type CreateFormDto = {
    properties:  JSONSchemaType<unknown>;
    required: string[];
    fields?: Field[];
};
export const {
    useAllQuery,
    useGetApiFormManagementOneByIdQuery,
    useCreateMutation,
    useUpdateMutation,
    useDeleteApiFormManagementByIdMutation,
    useSubmitFormAnswerMutation,
} = injectedRtkApi;
