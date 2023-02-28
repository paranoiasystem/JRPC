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
    name: string;
    params: Array<PARAM>;
    handler: Function;
}