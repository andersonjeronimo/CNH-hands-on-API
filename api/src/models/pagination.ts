export default class Pagination {
    pageNumber: number;
    pageSize: number;
    limit: number;
    constructor(pageNumber: number, pageSize: number, limit: number) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.limit = limit;
    }
};