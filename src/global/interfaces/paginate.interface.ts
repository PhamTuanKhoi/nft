export interface PaginateResponse<T> {
  items: T[];
  paginate: PaginateMeta;
}

export interface PaginateMeta {
  count: number;
  page: number;
  limit: number;
}


export class PaginationInput {
  limit: number;
  page: number;
  sortBy?: string;
  sortType?: string | number;
  searchBy?: string;
  searchType?: string | number;
}
