import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberService } from '../member.service';
import { MemberResponseDto} from '../member-response-dto'
import { MainResponseObject} from '../main-response-object'

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  angular: any;
  responseObj: MainResponseObject;
  allMembers: MemberResponseDto[] = [];
  memberForm: any;
  constructor(
    private formbulider: FormBuilder,
    private memberService: MemberService) { }

  ngOnInit() {
    this.memberForm = this.formbulider.group({
      firstName: ['', [Validators.required]],
      middleName: '',
      lastName: ['', [Validators.required]]
    });
    this.loadAllMembers();
  }

  loadAllMembers() {
    const memberObservable = this.memberService.getAllMembers();
    memberObservable.subscribe(res => {
      this.allMembers = res;
    });
  }


}
