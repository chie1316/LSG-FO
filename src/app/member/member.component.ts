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

  constructor(private memberService: MemberService) { }

  ngOnInit() {
  }

  // loadAllMembers() {
  //   const memberObservable = this.memberService.getAllMembers();
  //   memberObservable.subscribe(res => {
  //     this.allMembers = console.log(res);
  //   });
  // }

  loadAllMembers() {
    const memberObservable = this.memberService.getAllMembers();
    memberObservable.subscribe(res => console.log(res));
  }
}
