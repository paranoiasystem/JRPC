import { JRPC_REQUEST } from "./types/types";
import { v4 as uuidv4 } from 'uuid';

const VERSION = '2.0';

export default class Client {
    public createRequest(method: string, params: object | Array<unknown>): JRPC_REQUEST {
        return {
            jsonrpc: VERSION,
            method,
            params,
            id: uuidv4(),
        }
    }
}