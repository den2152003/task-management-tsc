interface ObjectPagination {
    currentPage: number,
    limitItem: number,
    skip?: number,
    totalPage?: number
};

const paginationHelper = (objectPagination: ObjectPagination, query: Record<string, any>, countTask: number): ObjectPagination => {
    if (query.page)
    {
        objectPagination.currentPage = parseInt(query.page);
    }

    if(query.limit){
        objectPagination.limitItem = query.limit;
    }
    objectPagination.skip = (objectPagination.currentPage - 1)*objectPagination.limitItem;

    const totalPage = Math.ceil(countTask/objectPagination.limitItem);

    objectPagination.totalPage = totalPage;

    return objectPagination;
}

export default paginationHelper;