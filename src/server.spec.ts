import Server from "./server";
import { JRPC_REQUEST } from "./types/types";

describe("Server", () => {
    it("should be defined", () => {
        expect(Server).toBeDefined();
    });

    it("regist two times the same method", () => {
        const server = new Server();
        server.addMethod("sum", [
            { name: "a", type: "number" },
            { name: "b", type: "number" }
        ], (a: number, b: number) => {
            return a + b;
        });
        expect(() => {
            server.addMethod("sum", [
                { name: "a", type: "number" },
                { name: "b", type: "number" }
            ], (a: number, b: number) => {
                return a + b;
            });
        }).toThrow();
    });

    it("regist not valid method", () => {
        const server = new Server();
        expect(() => {
            server.addMethod("sum", [
                { name: "a", type: "number" },
                { name: "b", type: "number" }
                // @ts-ignore
            ], 'test not valid method');
        }).toThrow();
    });

    it("regist and invoke method", () => {
        const server = new Server();
        server.addMethod("ping", [], () => {
            return 'pong'
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "ping",
            params: [],
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            result: "pong",
            id: 1
        });
    });

    it("regist and invoke method with obj input params", () => {
        const server = new Server();
        server.addMethod("sum", [
            { name: "a", type: "number" },
            { name: "b", type: "number" }
        ], (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: { a: 1, b: 2},
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            result: 3,
            id: 1
        });
    });

    it("regist and invoke method with array input params", () => {
        const server = new Server();
        server.addMethod("sum", [
            { name: "a", type: "number" },
            { name: "b", type: "number" }
        ], (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: [1, 2],
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            result: 3,
            id: 1
        });
    });

    it("regist and invoke method and check positional argument, input obj", () => {
        const server = new Server();
        server.addMethod("sub", [
            { name: "a", type: "number" },
            { name: "b", type: "number" }
        ], (a: number, b: number) => {
            return a - b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sub",
            params: { b: 1, a: 2 },
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            result: 1,
            id: 1
        });
    });

    it("regist and invoke method and check positional argument, input array", () => {
        const server = new Server();
        server.addMethod("sub", [
            { name: "a", type: "number" },
            { name: "b", type: "number" }
        ], (a: number, b: number) => {
            return a - b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sub",
            params: [2, 1],
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            result: 1,
            id: 1
        });
    });

    it("regist and invoke method in batch mode", () => {
        const server = new Server();
        server.addMethod("sum", [
            { name: "a", type: "number" },
            { name: "b", type: "number" }
        ], (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST[] = [
            {
                jsonrpc: "2.0",
                method: "sum",
                params: [1, 2],
                id: 1
            },
            {
                jsonrpc: "2.0",
                method: "sum",
                params: [3, 4],
                id: 2
            }
        ]
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual([
            {
                jsonrpc: "2.0",
                result: 3,
                id: 1
            },
            {
                jsonrpc: "2.0",
                result: 7,
                id: 2
            }
        ]);
    });
    
    it("invoke method with invalid params", () => {
        const server = new Server();
        server.addMethod("sum", [
            { name: "a", type: "number" },
            { name: "b", type: "number" }
        ], (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: { a: 1, c: 2 },
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            error: {
                code: "-32602",
                message: "Invalid params",
                data: null
            },
            id: 1
        });
    });

    it("invoke method not exist", () => {
        const server = new Server();
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: { a: 1, c: 2 },
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            error: {
                code: "-32601",
                message: "Method not found",
                data: null
            },
            id: 1
        });
    });

    it("invoke method with invalid json", () => {
        const server = new Server();
        const result = server.executeRequest("invalid json");
        expect(result).toEqual({
            jsonrpc: "2.0",
            error: {
                code: "-32700",
                message: "Parse error",
                data: null
            },
            id: null
        });
    });

    it("invoke method with invalid jsonrpc", () => {
        const server = new Server();
        const request: JRPC_REQUEST = {
            jsonrpc: "1.0",
            method: "sum",
            params: { a: 1, c: 2 },
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            error: {
                code: "-32600",
                message: "Invalid Request",
                data: null
            },
            id: 1
        });
    });

    it("invoke without method name", () => {
        const server = new Server();
        // @ts-ignore
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            params: { a: 1, c: 2 },
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            error: {
                code: "-32600",
                message: "Invalid Request",
                data: null
            },
            id: 1
        });
    });

    it("invoke method with invalid numbers of params, input array", () => {
        const server = new Server();
        server.addMethod("sum", [
            { name: "a", type: "number" },
            { name: "b", type: "number" }
        ], (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: [1],
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            error: {
                code: "-32602",
                message: "Invalid params",
                data: null
            },
            id: 1
        });
    });

    it("invoke method with invalid numbers of params, input object", () => {
        const server = new Server();
        server.addMethod("sum", [
            { name: "a", type: "number" },
            { name: "b", type: "number" }
        ], (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: { a: 1 },
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            error: {
                code: "-32602",
                message: "Invalid params",
                data: null
            },
            id: 1
        });
    });

    it("invoke method with invalid type of params, input object", () => {
        const server = new Server();
        server.addMethod("sum", [
            { name: "a", type: "number" },
            { name: "b", type: "number" }
        ], (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: { a: 1, b: "2"},
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            error: {
                code: "-32602",
                message: "Invalid params",
                data: null
            },
            id: 1
        });
    });

    it("invoke method with invalid type of params, input array", () => {
        const server = new Server();
        server.addMethod("sum", [
            { name: "a", type: "number" },
            { name: "b", type: "number" }
        ], (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: [1, "2"],
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            error: {
                code: "-32602",
                message: "Invalid params",
                data: null
            },
            id: 1
        });
    });

    it("invoke method throw error", () => {
        const server = new Server();
        server.addMethod("sum", [
            { name: "a", type: "number" },
            { name: "b", type: "number" }
        ], (a: number, b: number) => {
            throw new Error("custom error message");
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: [1, 2],
            id: 1
        }
        const result = server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            error: {
                code: "-32000",
                message: "Server error",
                data: {
                    message: "custom error message",
                }
            },
            id: 1
        });
    });
    
});