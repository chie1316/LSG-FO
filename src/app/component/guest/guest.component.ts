import { Component, OnInit, Inject, LOCALE_ID, Pipe, PipeTransform, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GuestService } from '@lsg/service-guest/guest.service';
import { Guest } from '@lsg/model/guest';
import { GuestDto } from '@lsg/dto/guest-dto';
import { GuestResponseDto } from '@lsg/dto/guest-response-dto';
import { MemberResponseDto } from '@lsg/dto/member-response-dto';
import { FilterDto, SortDto } from '@lsg/dto/filter-dto';
import { MainResponseObjectDto } from '@lsg/dto/main-response-object-dto';
import { MemberService } from '@lsg/service-member/member.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  guestListFilterForm: any;
  guestListFilterDto: FilterDto;
  guestSortDto: SortDto[] = [{ sortOrder: 'desc', sortBy: 'createDate' }];
  allGuests: GuestResponseDto[] = [];
  allMembers: MemberResponseDto[] = [];
  responseObj: MainResponseObjectDto;
  guestIdUpdate = null;
  isSuccess = false;
  today: number = Date.now();
  httpErrorMsg: string;
  addGuestMessage: string = "";
  page: number = 0;
  pageSize: number = 10;

  constructor(
    private formbulider: FormBuilder,
    private guestService: GuestService,
    private memberService: MemberService,
    private datePipe: DatePipe,
    private _http: HttpClient,
    private renderer: Renderer2) {
  }

   @ViewChild('msgContainer') appender: ElementRef;
  addElement(message: string) {
      const p: HTMLParagraphElement = this.renderer.createElement('p');
      p.innerHTML = message;
      this.renderer.addClass(this.appender.nativeElement, 'alert');
      this.renderer.addClass(this.appender.nativeElement, 'alert-danger');
      this.renderer.appendChild(this.appender.nativeElement, p);
    }

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

    this.guestListFilterForm = this.formbulider.group({
      page: this.page,
      limit: this.pageSize,
      sortList: [this.guestSortDto]
    });
    this.guestListFilterDto = this.guestListFilterForm.value;
    this.loadAllGuests(this.guestListFilterDto);
    this.loadAllMembers();
  }

  dateToString(date: Date) {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  loadAllGuests(filter: FilterDto) {
    const guestsObservable = this.guestService.getAllGuests(filter);
    guestsObservable.subscribe(
      res => this.allGuests = res,
      error => {
        this.interceptorErrorMsgBuilder(error,"Unable to Load Guest list");
      }
    );
  }

  interceptorErrorMsgBuilder(error: any, message: string) {
    console.log(error);
    var errorTitle = error.title;
    if (error.status === 0){
      errorTitle = "Error Connection Refused";
    }
    this.httpErrorMsg = error.status + " : " + errorTitle + " - " + message;
    this.addElement(this.httpErrorMsg);
  }

  responseErrorMsgBuilder(response: any) {
    console.log(response);
    var buildMsg = response.message + "\n";
    this.addGuestMessage += buildMsg;
  }

  loadAllMembers() {
    const memberObservable = this.memberService.getAllMembers();
    memberObservable.subscribe(res => {
      this.allMembers = res;
    });
  }


  onFilterSubmit() {
    const filterData = this.guestListFilterForm.value;
    this.loadAllGuests(filterData);
  }

  onFormSubmit(newGuest, formDirective: any) {
    this.dataSaved = false;
    this.addNewGuest(newGuest);
    this.guestIdUpdate = null;
    formDirective.resetForm();
  }

  onFormReset(formDirective: any) {
    formDirective.resetForm();
    this.dataSaved = false;
    this.guestIdUpdate = null;
    this.addGuestMessage = "";
  }

  loadGuestToEdit(guestId: string) {
    this.guestService.getGuestId(guestId).subscribe(res => {
      console.log(JSON.stringify(res));
      this.guestIdUpdate = res.data.id;
      this.guestForm.controls['firstName'].setValue(res.data.firstName);
      this.guestForm.controls['middleName'].setValue(res.data.middleName);
      this.guestForm.controls['lastName'].setValue(res.data.lastName);
      this.guestForm.controls['birthDate'].setValue(new Date(res.data.birthDate));
      this.guestForm.controls['address'].setValue(res.data.address);
      this.guestForm.controls['mobileNo'].setValue(res.data.mobileNo);
      this.guestForm.controls['email'].setValue(res.data.email);
      this.guestForm.controls['invitedById'].setValue(res.data.invitedBy.id);
    },error => {
      this.interceptorErrorMsgBuilder(error,"Unable to Load Guest Details");
    }
  )
  }

  addNewGuest(guest: GuestDto) {
    if (this.btnReady === true) {
      this.btnReady = false;
      this.addGuestMessage = "";
      guest.birthDate = this.dateToString(new Date(guest.birthDate));
      if (this.guestIdUpdate == null) {
        this.guestService.addGuest(guest).subscribe(
          res => {
            if (res.code === 200) {
              this.dataSaved = true;
              this.loadAllGuests(this.guestListFilterForm.value);
              this.formReset();
              this.btnReady = true;
              this.isSuccess = true;
            } else {
              this.btnReady = true;
              this.isSuccess = false;
              this.responseErrorMsgBuilder(res);
            }
          },error => {
            this.interceptorErrorMsgBuilder(error,"Unable to Add Guest");
          })
      } else {
        guest.id = this.guestIdUpdate;
        this.guestService.updateGuest(guest).subscribe(res => {
          if (res.code === 200) {
            this.dataSaved = true;
            this.loadAllGuests(this.guestListFilterForm.value);
            this.formReset();
            this.btnReady = true;
          } else {
            this.btnReady = true;
          }
        },error => {
          this.interceptorErrorMsgBuilder(error,"Unable to Edit Guest");
        });
      }
    }
  }

  removeGuest(guestId: string) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.guestService.removeGuestById(guestId).subscribe(res => {
        if (res.code === 200) {
          this.dataSaved = true;
          this.loadAllGuests(this.guestListFilterForm.value);
        }
      },error => {
        this.interceptorErrorMsgBuilder(error,"Unable to Remove Guest");
      });
    }
  }

  calculateAge(birthDate: Date) {
    var birthday = new Date(birthDate).getTime();
    var today = new Date().getTime();
    var age = Math.floor((today - birthday) / (31557600000));
    if (age < 0) {
      age = 0;
    }
    return age;
  }

  formReset() {
    this.guestForm.reset();
    this.dataSaved = false;
    this.guestIdUpdate = null;
    this.addGuestMessage = "";
  }

}
