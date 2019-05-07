export interface FilterDto {
  "page": number;
  "limit": number;
  "sortList": Array<SortDto>;
}

export interface SortDto{
  "sortOrder": string;
  "sortBy": string;
}
