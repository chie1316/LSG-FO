import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable,EMPTY, throwError } from 'rxjs';
import { map, catchError  } from 'rxjs/operators';
import { GuestDto } from '@lsg/dto/guest-dto';
import { Guest } from '@lsg/model/guest';
import { GuestResponseDto, Data } from '@lsg/dto/guest-response-dto';
import { MainResponseObjectDto } from '@lsg/dto/main-response-object-dto';
import { FilterDto } from '@lsg/dto/filter-dto';

@Injectable({
  providedIn: 'root'
})

export class GuestService {
  url = 'http://localhost:8080/lsg/guest';

  constructor(private _http: HttpClient) {
  }

  // getAllGuests(filter: FilterDto): Observable<GuestResponseDto[]> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this._http.post<GuestResponseDto[]>(this.url + '/getGuests', filter, httpOptions)
  //   .pipe(map((data: GuestResponseDto[]) => {
  //     console.log("MAP :: " + JSON.stringify(data));
  //     return data;
  //   }) ,catchError((this.handleErrorObservable)));
  // }
    // private handleErrorObservable (error: Response | any)
    //     {
    //         console.error(error.message || error);
    //         //console.log("Error in Observable");
    //         return Observable.throw(error.message || error);
    //     }

  getAllGuests(filter: FilterDto): Observable<GuestResponseDto[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this._http.post<GuestResponseDto[]>(this.url + '/getGuests', filter, httpOptions);
  }

  getGuestId(guestId: string): Observable<GuestResponseDto> {
    return this._http.get<GuestResponseDto>(this.url + '/getGuestDetailsById?id=' + guestId);
  }

  addGuest(newGuest: GuestDto): Observable<MainResponseObjectDto> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this._http.post<MainResponseObjectDto>(this.url + '/addGuest',
      newGuest, httpOptions);
  }

  updateGuest(guest: GuestDto): Observable<MainResponseObjectDto> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this._http.put<MainResponseObjectDto>(this.url + '/updateGuest',
      guest, httpOptions);
  }

  removeGuestById(guestId: string): Observable<GuestResponseDto> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this._http.delete<GuestResponseDto>(this.url + '/removeGuest?id=' + guestId,
      httpOptions);
  }
}
