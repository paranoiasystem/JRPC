import { JSONSchema4 } from "json-schema";

export type JRPC_REQUEST = {
    jsonrpc: string;
    method: string;
    params?: object | Array<unknown>;
    id?: string | number;
}

export type JRPC_ERROR = {
    code: string;
    message: string;
    data?: object | null;
}

export type JRPC_RESPONSE = {
    jsonrpc: string;
    result?: object | Array<unknown>;
    error?: JRPC_ERROR;
    id?: string | number | null;
}

export type PARAM = {
    name: string;
    type: number | string | boolean | object | Array<unknown>;
}

export type JRPC_METHOD = {
    schema: JRPC_SCHEMA_METHOD,
    handler: Function;
}

export type JRPC_SCHEMA = {
    version: string;
    methods: Array<JRPC_SCHEMA_METHOD>;
}

export type JRPC_SCHEMA_METHOD = {
    name: string;
    description: string;
    params: Array<JRPC_SCHEMA_METHOD_PARAM>;
    result: JSONSchema4;
}

export type JRPC_SCHEMA_METHOD_PARAM = {
    name: string;
    description: string;
    schema: JSONSchema4;
    required?: boolean;
}

export type JRPC_SCHEMA_METHOD_RESULT = {
    name: string;
    description: string;
    schema: JSONSchema4;
} 