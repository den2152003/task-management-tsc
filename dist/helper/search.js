"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const searchHelper = (query) => {
    let objectSearch = {
        keyword: "",
    };
    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        const reg = new RegExp(objectSearch.keyword, "i");
        objectSearch.reg = reg;
    }
    return objectSearch;
};
exports.default = searchHelper;
