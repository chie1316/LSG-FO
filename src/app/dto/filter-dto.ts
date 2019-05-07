export interface FilterDto {
  "page": number;
  "limit": number;
  "sortList": SortDto;
}

 interface SortDto{
  "sortOrder": string;
  "sortBy": string;
}
