"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
const paginationHelper = (objectPagination, query, countTask) => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }
    if (query.limit) {
        objectPagination.limitItem = query.limit;
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;
    const totalPage = Math.ceil(countTask / objectPagination.limitItem);
    objectPagination.totalPage = totalPage;
    return objectPagination;
};
exports.default = paginationHelper;
