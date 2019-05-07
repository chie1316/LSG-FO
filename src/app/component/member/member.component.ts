import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberService } from '@lsg/service-member/member.service';
import { MemberResponseDto} from '@lsg/dto/member-response-dto'
import { MainResponseObjectDto} from '@lsg/dto/main-response-object-dto';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  angular: any;
  responseObj: MainResponseObjectDto;
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
