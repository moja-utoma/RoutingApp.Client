export interface QueryParamsModel {
  orderBy?: string;       // default: "Name"
  isDesc?: boolean;       // default: false
  searchString?: string;  // default: ""
  page?: number;          // default: 1
  pageSize?: number;      // default: 10
}
