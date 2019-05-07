import {Component, OnInit, Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GuestService } from '@lsg/service-guest/guest.service';
import { Guest } from '@lsg/model/guest';
import { GuestDto } from '@lsg/dto/guest-dto';
import { GuestResponseDto} from '@lsg/dto/guest-response-dto';
import { MemberResponseDto} from '@lsg/dto/member-response-dto';
import { FilterDto} from '@lsg/dto/filter-dto';
import { MainResponseObjectDto} from '@lsg/dto/main-response-object-dto';
import { MemberService} from '@lsg/service-member/member.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {
  angular: any;
  dataSaved = false;
  btnReady = true;
  guestForm: any;
  allGuests: GuestResponseDto[] = [];
  allMembers: MemberResponseDto[] = [];
  responseObj: MainResponseObjectDto;
  guestIdUpdate = null;
  message = null;
  isSuccess = false;
  today: number = Date.now();
  errorMsg;
  constructor(
    private formbulider: FormBuilder,
    private guestService: GuestService,
    private memberService: MemberService,
    private datePipe: DatePipe) {}


  ngOnInit() {
    this.guestForm = this.formbulider.group({
      firstName: ['', [Validators.required]],
      middleName: '',
      lastName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      address: ['', [Validators.required]],
      mobileNo: ['', [Validators.pattern("[0-9]+")]],
      email: ['', [Validators.pattern("[^ @]*@[^ @]*")]],
      invitedById: ''
    });
    this.loadAllGuests();
    this.loadAllMembers();
  }

  dateToString(date: Date){
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  loadAllGuests() {
    const guestsObservable = this.guestService.getAllGuests();
    guestsObservable.subscribe(
      res => this.allGuests = res,
      error => this.errorMsg = error
    );
  }

  loadAllMembers() {
    const memberObservable = this.memberService.getAllMembers();
    memberObservable.subscribe(res => {
      this.allMembers = res;
    });
  }

  onFormSubmit() {
    this.dataSaved = false;
    const newGuest = this.guestForm.value;
    this.AddGuest(newGuest);
    this.guestIdUpdate = null;
  }

  loadGuestToEdit(guestId: string) {
    this.guestService.getGuestId(guestId).subscribe(res => {
      this.guestIdUpdate = res.data.id;
      this.guestForm.controls['firstName'].setValue(res.data.firstName);
      this.guestForm.controls['middleName'].setValue(res.data.middleName);
      this.guestForm.controls['lastName'].setValue(res.data.lastName);
      this.guestForm.controls['birthDate'].setValue(new Date(res.data.birthDate));
      this.guestForm.controls['address'].setValue(res.data.address);
      this.guestForm.controls['mobileNo'].setValue(res.data.mobileNo);
      this.guestForm.controls['email'].setValue(res.data.email);
      this.guestForm.controls['invitedById'].setValue(res.data.invitedBy.id);
    })
  }

  AddGuest(guest: GuestDto) {
    if (this.btnReady === true) {
      this.btnReady = false;
      guest.birthDate = this.dateToString(new Date(guest.birthDate));
      if (this.guestIdUpdate == null) {
        this.guestService.addGuest(guest).subscribe(
          res => {
            this.message = res.message;
            if (res.code === 200) {
              this.dataSaved = true;
              this.loadAllGuests();
              this.formReset();
              this.btnReady = true;
              this.isSuccess = true;
            }else{
              this.btnReady = true;
              this.isSuccess = false;
            }
          })
      } else {
        guest.id = this.guestIdUpdate;
        this.guestService.updateGuest(guest).subscribe(res => {
          this.message = res.message;
          if (res.code === 200) {
            this.dataSaved = true;
            this.loadAllGuests();
            this.formReset();
            this.btnReady = true;
          }else{
            this.btnReady = true;
          }
        });
      }
    }
  }

  removeGuest(guestId: string) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.guestService.removeGuestById(guestId).subscribe(res => {
        this.message = res.message;
        if (res.code === 200) {
          this.dataSaved = true;
          this.loadAllGuests();
          this.formReset();
        }
      });
    }
  }

  calculateAge(birthDate: Date){
      var birthday = new Date(birthDate).getTime();
      var today = new Date().getTime();
      var age = Math.floor((today - birthday) / (31557600000));
      if (age < 0){
        age = 0;
      }
      return age;
  }

  markFormPrestine(){
    Object.keys(this.guestForm.controls).forEach(control =>{
      this.guestForm.controls[control].markAsPristine();
      this.guestForm.controls[control].markAsUntouched();
    });
  }

  formReset() {
    this.markFormPrestine();
    this.guestForm.reset();
    this.dataSaved = false;
  }

}
