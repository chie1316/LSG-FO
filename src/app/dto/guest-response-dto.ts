export interface GuestResponseDto {
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
  "birthDate": string;
  "address": string;
  "mobileNo": string;
  "email": string;
  "invitedBy": InvitedBy;
}

interface InvitedBy {
  "id": string;
  "name": string;
}