interface ObjectSearch {
    keyword: string,
    reg?: RegExp
}
const searchHelper = (query: Record<string, any>): ObjectSearch => {
    let objectSearch : ObjectSearch= {
        keyword: "",
    };

    if(query.keyword)
    {
        objectSearch.keyword = query.keyword;
        const reg = new RegExp(objectSearch.keyword, "i");
        objectSearch.reg = reg;
    }
    
    return objectSearch;
}

export default searchHelper;