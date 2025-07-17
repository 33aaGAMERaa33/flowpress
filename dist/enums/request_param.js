"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestParam = void 0;
var RequestParam;
(function (RequestParam) {
    RequestParam[RequestParam["MetadataKey"] = 0] = "MetadataKey";
    RequestParam[RequestParam["middlewaresData"] = 1] = "middlewaresData";
    RequestParam[RequestParam["request"] = 2] = "request";
    RequestParam[RequestParam["response"] = 3] = "response";
    RequestParam[RequestParam["headers"] = 4] = "headers";
    RequestParam[RequestParam["header"] = 5] = "header";
    RequestParam[RequestParam["query"] = 6] = "query";
    RequestParam[RequestParam["body"] = 7] = "body";
})(RequestParam || (exports.RequestParam = RequestParam = {}));
