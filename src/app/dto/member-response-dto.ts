export interface MemberResponseDto {
  "code": number;
  "title": string;
  "message": string;
  "data": Data;
}

 interface Data{
  "id": string;
  "firstName": string;
  "middleName": string;
  "lastName": string;
}
