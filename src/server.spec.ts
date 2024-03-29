import Server from "./server";
import { JRPC_REQUEST } from "./types/types";

describe("Server", () => {
    it("should be defined", () => {
        expect(Server).toBeDefined();
    });

    it("regist two times the same method", () => {
        const server = new Server();
        server.addMethod({
            "name": "sum",
            "description": "make a sum of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sum",
                    "schema": {
                        "type": "integer",
                        "required": true
                    }
                },
                {
                    "name": "b",
                    "description": "Second value of sum",
                    "schema": {
                        "type": "integer",
                        "required": true
                    }
                }
            ],
            "result": {
                "name": "sum",
                "description": "The result of sum",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
            return a + b;
        });
        expect(() => {
            server.addMethod({
                "name": "sum",
                "description": "make a sum of two numbers",
                "params": [
                    {
                        "name": "a",
                        "description": "First value of sum",
                        "schema": {
                            "type": "integer"
                        }
                    },
                    {
                        "name": "b",
                        "description": "Second value of sum",
                        "schema": {
                            "type": "integer"
                        }
                    }
                ],
                "result": {
                    "name": "sum",
                    "description": "The result of sum",
                    "schema": {
                        "type": "integer"
                    }
                }
            }, (a: number, b: number) => {
                return a + b;
            });
        }).toThrow();
    });

    it("regist not valid method", () => {
        const server = new Server();
        expect(() => {
            server.addMethod({
                "name": "sum",
                "description": "make a sum of two numbers",
                "params": [
                    {
                        "name": "a",
                        "description": "First value of sum",
                        "schema": {
                            "type": "integer"
                        },
                    },
                    {
                        "name": "b",
                        "description": "Second value of sum",
                        "schema": {
                            "type": "integer"
                        }
                    }
                ],
                "result": {
                    "name": "sum",
                    "description": "The result of sum",
                    "schema": {
                        "type": "integer"
                    }
                }
                // @ts-ignore
            }, 'test not valid method');
        }).toThrow();
    });

    it("regist and invoke method", async () => {
        const server = new Server();
        server.addMethod({
            "name": "ping",
            "description": "responde pong",
            "params": [],
            "result": {
                "name": "response",
                "description": "The response to the ping request",
                "schema": {
                    "type": "string"
                }
            }
        }, () => {
            return 'pong'
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "ping",
            params: [],
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            result: "pong",
            id: 1
        });
    });

    it("regist and invoke method with obj input params", async () => {
        const server = new Server();
        server.addMethod({
            "name": "sum",
            "description": "make a sum of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sum",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "b",
                    "description": "Second value of sum",
                    "schema": {
                        "type": "integer"
                    }
                }
            ],
            "result": {
                "name": "sum",
                "description": "The result of sum",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: { a: 1, b: 2 },
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            result: 3,
            id: 1
        });
    });

    it("regist and invoke method with array input params", async () => {
        const server = new Server();
        server.addMethod({
            "name": "sum",
            "description": "make a sum of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sum",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "b",
                    "description": "Second value of sum",
                    "schema": {
                        "type": "integer"
                    }
                }
            ],
            "result": {
                "name": "sum",
                "description": "The result of sum",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: [1, 2],
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            result: 3,
            id: 1
        });
    });

    it("regist and invoke method and check positional argument, input obj", async () => {
        const server = new Server();
        server.addMethod({
            "name": "sub",
            "description": "make a sub of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sub",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "b",
                    "description": "Second value of sub",
                    "schema": {
                        "type": "integer"
                    }
                }
            ],
            "result": {
                "name": "sub",
                "description": "The result of sub",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
            return a - b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sub",
            params: { b: 1, a: 2 },
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            result: 1,
            id: 1
        });
    });

    it("regist and invoke method and check positional argument, input array", async () => {
        const server = new Server();
        server.addMethod({
            "name": "sub",
            "description": "make a sub of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sub",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "b",
                    "description": "Second value of sub",
                    "schema": {
                        "type": "integer"
                    }
                }
            ],
            "result": {
                "name": "sub",
                "description": "The result of sub",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
            return a - b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sub",
            params: [2, 1],
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            result: 1,
            id: 1
        });
    });

    it("regist and invoke method in batch mode", async () => {
        const server = new Server();
        server.addMethod({
            "name": "sum",
            "description": "make a sum of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sum",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "b",
                    "description": "Second value of sum",
                    "schema": {
                        "type": "integer"
                    }
                }
            ],
            "result": {
                "name": "sum",
                "description": "The result of sum",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
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
        const result = await server.executeRequest(JSON.stringify(request));
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

    it("invoke method with invalid params", async () => {
        const server = new Server();
        server.addMethod({
            "name": "sum",
            "description": "make a sum of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sum",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "b",
                    "description": "Second value of sum",
                    "schema": {
                        "type": "integer"
                    }
                }
            ],
            "result": {
                "name": "sum",
                "description": "The result of sum",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: { a: 1, c: 2 },
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
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

    it("invoke method not exist", async () => {
        const server = new Server();
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: { a: 1, c: 2 },
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
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

    it("invoke method with invalid json", async () => {
        const server = new Server();
        const result = await server.executeRequest("invalid json");
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

    it("invoke method with invalid jsonrpc", async () => {
        const server = new Server();
        const request: JRPC_REQUEST = {
            jsonrpc: "1.0",
            method: "sum",
            params: { a: 1, c: 2 },
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
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

    it("invoke without method name", async () => {
        const server = new Server();
        // @ts-ignore
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            params: { a: 1, c: 2 },
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
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

    it("invoke method with invalid numbers of params, input array", async () => {
        const server = new Server();
        server.addMethod({
            "name": "sum",
            "description": "make a sum of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sum",
                    "schema": {
                        "type": "integer"
                    },
                    required: true
                },
                {
                    "name": "b",
                    "description": "Second value of sum",
                    "schema": {
                        "type": "integer"
                    },
                    required: true
                }
            ],
            "result": {
                "name": "sum",
                "description": "The result of sum",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: [1],
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
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

    it("invoke method with invalid numbers of params, input object", async () => {
        const server = new Server();
        server.addMethod({
            "name": "sum",
            "description": "make a sum of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sum",
                    "schema": {
                        "type": "integer"
                    },
                    required: true
                },
                {
                    "name": "b",
                    "description": "Second value of sum",
                    "schema": {
                        "type": "integer"
                    },
                    required: true
                }
            ],
            "result": {
                "name": "sum",
                "description": "The result of sum",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: { a: 1 },
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
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

    it("invoke method with invalid type of params, input object", async () => {
        const server = new Server();
        server.addMethod({
            "name": "sum",
            "description": "make a sum of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sum",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "b",
                    "description": "Second value of sum",
                    "schema": {
                        "type": "integer"
                    }
                }
            ],
            "result": {
                "name": "sum",
                "description": "The result of sum",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: { a: 1, b: "2" },
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
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

    it("invoke method with invalid type of params, input array", async () => {
        const server = new Server();
        server.addMethod({
            "name": "sum",
            "description": "make a sum of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sum",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "b",
                    "description": "Second value of sum",
                    "schema": {
                        "type": "integer"
                    }
                }
            ],
            "result": {
                "name": "sum",
                "description": "The result of sum",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: [1, "2"],
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
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

    it("invoke method throw error", async () => {
        const server = new Server();
        server.addMethod({
            "name": "sum",
            "description": "make a sum of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sum",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "b",
                    "description": "Second value of sum",
                    "schema": {
                        "type": "integer"
                    }
                }
            ],
            "result": {
                "name": "sum",
                "description": "The result of sum",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
            throw new Error("custom error message");
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: [1, 2],
            id: 1
        }
        const result = await server.executeRequest(JSON.stringify(request));
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

    it("invoke method whitout request id", async () => {
        const server = new Server();
        server.addMethod({
            "name": "sum",
            "description": "make a sum of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sum",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "b",
                    "description": "Second value of sum",
                    "schema": {
                        "type": "integer"
                    }
                }
            ],
            "result": {
                "name": "sum",
                "description": "The result of sum",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
            return a + b;
        });
        const request: JRPC_REQUEST = {
            jsonrpc: "2.0",
            method: "sum",
            params: [1, 2]
        }
        const result = await server.executeRequest(JSON.stringify(request));
        expect(result).toEqual({
            jsonrpc: "2.0",
            error: {
                code: "-32600",
                message: "Invalid Request",
                data: null
            },
        });
    });

    it("server get the schema", async () => {
        const server = new Server();
        server.addMethod({
            "name": "sum",
            "description": "make a sum of two numbers",
            "params": [
                {
                    "name": "a",
                    "description": "First value of sum",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "b",
                    "description": "Second value of sum",
                    "schema": {
                        "type": "integer"
                    }
                }
            ],
            "result": {
                "name": "sum",
                "description": "The result of sum",
                "schema": {
                    "type": "integer"
                }
            }
        }, (a: number, b: number) => {
            return a + b;
        }
        );
        const schema = server.getSchema();
        expect(schema).toEqual({
            "version": "2.0",
            "methods": [
                {
                    "name": "sum",
                    "description": "make a sum of two numbers",
                    "params": [
                        {
                            "name": "a",
                            "description": "First value of sum",
                            "schema": {
                                "type": "integer"
                            }
                        },
                        {
                            "name": "b",
                            "description": "Second value of sum",
                            "schema": {
                                "type": "integer"
                            }
                        }
                    ],
                    "result": {
                        "name": "sum",
                        "description": "The result of sum",
                        "schema": {
                            "type": "integer"
                        }
                    }
                }
            ]
        });
    });


});