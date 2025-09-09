export interface QueryParamsModel {
  orderBy: string;       // default: "Name"
  isDesc: boolean;       // default: false
  searchString: string;  // default: ""
  page: number;          // default: 1
  pageSize: number;      // default: 10
}

export function createDefaultQueryParams(): QueryParamsModel {
  return {
    orderBy: 'name',
    isDesc: false,
    searchString: '',
    page: 1,
    pageSize: 10,
  };
}
