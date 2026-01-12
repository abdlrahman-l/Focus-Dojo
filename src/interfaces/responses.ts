/* eslint-disable @typescript-eslint/no-explicit-any */
export type Resource = {
	uid: string;
};

export interface Pagination {
	records: number;
	total_records: number;
	limit: number;
	page: number;
	total_page: number;
}
export interface DataType {
	value: any;
	label: string;
}

export type Meta = {
	correlation_id: string;
	code: number;
	message: string;
	time: string;
};

export type ResponseError = {
    meta: Meta;
	errors?: object;
}

export interface ResponseData<T> {
	meta:  Meta & { pagination: Pagination };
	data: T;
	errors?: object;
}

export interface MutationProps<T> {
	onError?: (errMsg: any) => void;
	onSuccess: (response: T) => void;
}
