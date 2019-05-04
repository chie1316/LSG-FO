import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GuestService } from '../guest.service';
import { Guest } from '../guest';
import { GuestDto } from '../guestDto';
import { GuestResponseDto} from '../guest-response-dto'
import { MainResponseObject} from '../main-response-object'

@Component({
selector: 'app-guest',
templateUrl: './guest.component.html',
styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {
  angular: any;
  dataSaved = false;
  guestForm: any;
  allGuests: GuestResponseDto[] = [];
  responseObj: MainResponseObject;
  guestIdUpdate = null;
  massage = null;

  constructor(private formbulider: FormBuilder,
  private guestService: GuestService) {
  }


  ngOnInit() {
    this.guestForm = this.formbulider.group({
     firstName: ['', [Validators.required]],
     middleName: '',
     lastName: ['', [Validators.required]],
     age: ['', [Validators.required]],
     address: ['', [Validators.required]],
     mobileNo: '',
     email:'',
     invitedById:''
   });
    this.loadAllGuests();
  }

  loadAllGuests() {
    const guestsObservable = this.guestService.getAllGuest();
    guestsObservable.subscribe(guestData => {
      this.allGuests = guestData;
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

  AddGuest(guest: GuestDto){
    if (this.guestIdUpdate == null) {
      this.guestService.addGuest(guest).subscribe(
        res => {
          this.massage = res.message;
          if (res.code === 200){
            this.dataSaved = true;
            this.loadAllGuests();
            this.formReset();
          }
      })
    }else{
    guest.id = this.guestIdUpdate;
     this.guestService.updateGuest(guest).subscribe(res => {
       this.massage = res.message;
       if (res.code === 200){
         this.dataSaved = true;
         this.loadAllGuests();
         this.formReset();
       }
     });
    }
  }

  removeGuest(guestId: string) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.guestService.removeGuestById(guestId).subscribe(res => {
        this.massage = res.message;
        if (res.code === 200){
          this.dataSaved = true;
          this.loadAllGuests();
          this.formReset();
        }
      });
    }
  }

  formReset() {
     this.guestForm.reset(this.guestForm.controls['invitedById'].setValue('sadsd'));
     this.massage = null;
     this.dataSaved = false;
   }

}
