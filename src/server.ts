import { ErrorResponse } from "./DTOs/errors";
import { JRPC_REQUEST, JRPC_RESPONSE, JRPC_ERROR, JRPC_METHOD, PARAM } from "./types/types";

const VERSION = '2.0';

const ERRORS = {
    PARSE_ERROR: '-32700',
    INVALID_REQUEST: '-32600',
    METHOD_NOT_FOUND: '-32601',
    INVALID_PARAMS: '-32602',
    INTERNAL_ERROR: '-32603',
    SERVER_ERROR: '-32000',
}

const ERROR_MESSAGES = {
    [ERRORS.PARSE_ERROR]: 'Parse error',
    [ERRORS.INVALID_REQUEST]: 'Invalid Request',
    [ERRORS.METHOD_NOT_FOUND]: 'Method not found',
    [ERRORS.INVALID_PARAMS]: 'Invalid params',
    [ERRORS.INTERNAL_ERROR]: 'Internal error',
    [ERRORS.SERVER_ERROR]: 'Server error',
}

export default class Server {

    private methods: JRPC_METHOD[] = [];

    // check if method exists
    private methodExists(name: string): boolean {
        return !!this.methods.find((method) => method.name === name);
    }

    // find method by name
    private findMethod(name: string): JRPC_METHOD | null {
        return this.methods.find((method) => method.name === name) || null;
    }

    // add method to container
    public addMethod(name: string, params: PARAM[], handler: Function) {
        if (typeof handler !== 'function') {
            throw new Error('Handler must be a function');
        }
        if (this.methodExists(name)) {
            throw new Error(`Method ${name} already exists`);
        }
        this.methods.push({
            name,
            params: params,
            handler,
        });
    }
    
    // create response
    private createResponse(request: JRPC_REQUEST, result: object | Array<any>): JRPC_RESPONSE {
        return {
            jsonrpc: VERSION,
            result,
            id: request.id,
        }
    }

    // create error response
    private createErrorResponse(request: JRPC_REQUEST | null, code: string, message: string, data?: object): JRPC_RESPONSE {
        return {
            jsonrpc: VERSION,
            error: {
                code,
                message,
                data: (data) ? data : null,
            },
            id: (request) ? request.id : null,
        }
    }

    // parse request
    private parseRequest(request: string): JRPC_REQUEST | JRPC_REQUEST[] {
        try {
            return JSON.parse(request);
        } catch (e) {
            throw new ErrorResponse(ERROR_MESSAGES[ERRORS.PARSE_ERROR], parseInt(ERRORS.PARSE_ERROR));
        }
    }

    // validate request
    private validateRequest(request: JRPC_REQUEST): void {
        const method = this.findMethod(request.method);
        if (request.jsonrpc !== VERSION) {
            throw new ErrorResponse(ERROR_MESSAGES[ERRORS.INVALID_REQUEST], parseInt(ERRORS.INVALID_REQUEST));
        }
        if (!request.method) {
            throw new ErrorResponse(ERROR_MESSAGES[ERRORS.INVALID_REQUEST], parseInt(ERRORS.INVALID_REQUEST));
        }
        if (!method) {
            throw new ErrorResponse(ERROR_MESSAGES[ERRORS.METHOD_NOT_FOUND], parseInt(ERRORS.METHOD_NOT_FOUND));
        }
        // validate params
        // TODO test better
        if(Array.isArray(method.params)) {
            if (typeof request.params === 'object' && !Array.isArray(request.params)) {
                const valuesKeys = Object.keys(request.params);
                if (valuesKeys.length !== method.params.length) {
                    throw new ErrorResponse(ERROR_MESSAGES[ERRORS.INVALID_PARAMS], parseInt(ERRORS.INVALID_PARAMS));
                }
                for(let i = 0; i < valuesKeys.length; i++) {
                    const found = method.params.find(param => param.name === valuesKeys[i])
                    if(!found) {
                        throw new ErrorResponse(ERROR_MESSAGES[ERRORS.INVALID_PARAMS], parseInt(ERRORS.INVALID_PARAMS));
                    }
                    // @ts-ignore
                    if (typeof request.params[valuesKeys[i]] !== found.type) {
                        throw new ErrorResponse(ERROR_MESSAGES[ERRORS.INVALID_PARAMS], parseInt(ERRORS.INVALID_PARAMS));
                    }
                }
            } else if (Array.isArray(request.params)) {
                if (request.params.length !== method.params.length) {
                    throw new ErrorResponse(ERROR_MESSAGES[ERRORS.INVALID_PARAMS], parseInt(ERRORS.INVALID_PARAMS));
                }
                for (let i = 0; i < request.params.length; i++) {
                    if (typeof request.params[i] !== method.params[i].type) {
                        throw new ErrorResponse(ERROR_MESSAGES[ERRORS.INVALID_PARAMS], parseInt(ERRORS.INVALID_PARAMS));
                    }
                }
            }
        }
    }

    // handle request
    private handleRequest(request: JRPC_REQUEST): JRPC_RESPONSE {
        try {
            this.validateRequest(request);
            const method = this.findMethod(request.method);
            // prepare params as input for handler
            const params = [];
            if (!Array.isArray(request!.params)) {
                // put values in array in the right order
                for (let i = 0; i < method!.params.length; i++) {
                    // @ts-ignore
                    params.push(request.params[method.params[i].name]);
                }
            } else {
                params.push(...request.params);
            }
            const result = method?.handler(...params);
            return this.createResponse(request, result);
        } catch (e) {
            if (e instanceof ErrorResponse) {
                return this.createErrorResponse(request, e.code.toString(), e.message);
            } else {
                // @ts-ignore
                return this.createErrorResponse(request, ERRORS.SERVER_ERROR, ERROR_MESSAGES[ERRORS.SERVER_ERROR], {
                    // @ts-ignore
                    message: e.message,
                });
            }
        }
    }

    // execute request
    public executeRequest(request: string): JRPC_RESPONSE | JRPC_RESPONSE[] {
        try {
            const parsedRequest: JRPC_REQUEST | JRPC_REQUEST[] = this.parseRequest(request);
            if (Array.isArray(parsedRequest)) {
                const responses = [];
                for (let i = 0; i < parsedRequest.length; i++) {
                    responses.push(this.handleRequest(parsedRequest[i]));
                }
                return responses;
            } else {
                return this.handleRequest(parsedRequest);
            }
        } catch (e) {
            if (e instanceof ErrorResponse) {
                return this.createErrorResponse(null, e.code.toString(), e.message);
            } else {
                // @ts-ignore
                return this.createErrorResponse(null, ERRORS.SERVER_ERROR, ERROR_MESSAGES[ERRORS.SERVER_ERROR], {
                    // @ts-ignore
                    message: e.message,
                });
            }
        }
    }
}