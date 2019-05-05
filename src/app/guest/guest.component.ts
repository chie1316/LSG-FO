import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GuestService } from '../guest.service';
import { Guest } from '../guest';
import { GuestDto } from '../guestDto';
import { GuestResponseDto} from '../guest-response-dto'
import { MemberResponseDto} from '../member-response-dto'
import { MainResponseObject} from '../main-response-object'
import { MemberService} from '../member.service'

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
  responseObj: MainResponseObject;
  guestIdUpdate = null;
  message = null;
  isSuccess = false;
  constructor(
    private formbulider: FormBuilder,
    private guestService: GuestService,
    private memberService: MemberService) {}


  ngOnInit() {
    this.guestForm = this.formbulider.group({
      firstName: ['', [Validators.required]],
      middleName: '',
      lastName: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.pattern("[0-9]+")]],
      address: ['', [Validators.required]],
      mobileNo: ['', [Validators.pattern("[0-9]+")]],
      email: ['', [Validators.pattern("[^ @]*@[^ @]*")]],
      invitedById: ''
    });
    this.loadAllGuests();
    this.loadAllMembers();
  }

  loadAllGuests() {
    const guestsObservable = this.guestService.getAllGuests();
    guestsObservable.subscribe(res => {
      this.allGuests = res;
    });
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
      console.log(res.data.firstName);
      this.guestForm.controls['firstName'].setValue(res.data.firstName);
      this.guestForm.controls['middleName'].setValue(res.data.middleName);
      this.guestForm.controls['lastName'].setValue(res.data.lastName);
      this.guestForm.controls['age'].setValue(res.data.age);
      this.guestForm.controls['address'].setValue(res.data.address);
      this.guestForm.controls['mobileNo'].setValue(res.data.mobileNo);
      this.guestForm.controls['email'].setValue(res.data.email);
      this.guestForm.controls['invitedById'].setValue(res.data.invitedBy.id);
    })
  }

  AddGuest(guest: GuestDto) {
    if (this.btnReady === true) {
      this.btnReady = false;
      if (this.guestIdUpdate == null) {
        this.guestService.addGuest(guest).subscribe(
          res => {
            this.message = res.message;
            console.log(this.message);
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
