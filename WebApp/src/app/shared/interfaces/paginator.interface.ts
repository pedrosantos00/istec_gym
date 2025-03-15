export interface Paginator<T> {
  data: T;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
