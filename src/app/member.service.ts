import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberResponseDto } from './member-response-dto';
import { MainResponseObject } from './main-response-object'

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  url = 'http://localhost:8080/lsg/member';

  constructor(private http: HttpClient) { }

  getAllMembers(): Observable<MemberResponseDto[]> {
   return this.http.get<MemberResponseDto[]>(this.url + '/getMembers');
  }

  getMemberId(memberId: string): Observable<MemberResponseDto> {
     return this.http.get<MemberResponseDto>(this.url + '/getMemberDetailsById?id=' + memberId);
   }
}
