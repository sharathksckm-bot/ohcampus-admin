import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class GlobalService {

  userData:any=[];

  //public changeUserInfo:BehaviorSubject<any> = new BehaviorSubject<any>(this.userData);
  //public navChanged:BehaviorSubject<number> = new BehaviorSubject<number>( Number(localStorage.getItem('sidebarHideShoe')));
  constructor(  private _httpClient: HttpClient,
    private _userService: UserService) {


  //  console.log(this.changeUserInfo.prev());



    // if(typeof(this.changeUserInfo.value.EmailAddress)=="undefined" ||  this.changeUserInfo.value.EmailAddress==""){
    //  localStorage.clear();
     // window.location.href = config.logOutURL;
    // }

  }


  //------------------------------ FOR GET COVER TYPE ----------------------------------------------//
//  public getAllMenu():Observable<any> {
//   let localStorDta =  this.getLocalStorageData();

// let  email = localStorDta.EmailAddress;
//  return this.httpClient.post(`${this.apiURL}Webservice/getAllMenuData`,{userName:email});


// }
  convertResponseInJson(res)
  {
    let  response:any= res;
    return response;
  }

  getLocalStorageData()
  {
    if (localStorage.getItem("accessToken") != null) {
     let retrievedData = localStorage.getItem("currentUser");
      this.userData = JSON.parse(retrievedData);
   //   this.changeUserInfo.next(this.userData)
      return this.userData;
  }
  }

  getHeader(){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      // Authorization:  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6bnVsbCwiZGF0YSI6eyJmaXJzdG5hbWUiOiJRdWVlbnplbmQgV2ViIiwibGFzdG5hbWUiOiJTb2x1dGlvbiIsInVzZXJ0eXBlIjoiYWRtaW4iLCJlbWFpbCI6InRlc3QuYnVzaW5lc3N1c2VyMUBnbWFpbC5jb20iLCJpbWFnZSI6InBpY3R1cmVfclhUZkFfRGluZXNoIENsZyAyMDE0MTAzMV8xNDQxMDEuanBnIiwidXNlcmlkIjoiMiIsInVzZXJuYW1lIjoidGVzdC5idXNpbmVzc3VzZXIxQGdtYWlsLmNvbSIsImFjY291bnRpbmdfdXNlciI6MSwiZmlybV9pZCI6IjIiLCJpc19yZXZpZXdlciI6IjEifSwiaWF0IjoxNTc2MTQ5OTA3LCJleHAiOjE1NzYxNjc5MDd9.HnO0fF4FWu-mDQW9LzutzqvVHBZQHvBmiD9fZN1eJB4'
       Authorization:   localStorage.getItem("backend-token")

      })
    }
    return httpOptions;
  }
    /* START:VALIDATE DATA NUM/decimal with number  */
    checkValidInputData(event: any,type) {
      var pattern:any;
      if(type=='1'){
        pattern= /^[0-9]*\.?[0-9]*$/;//validae decimal with number
      }
      if(type=='2'){
         pattern= /^[0-9]*\.?[0-9]*$/;//validae decimal with number
      }
      if(type=='3'){
        pattern= /^[A-Za-z0-9]+$/;//validae alphanumeric
      }
      if(type=='4'){
        pattern= /^[A-Za-z0-9 ]+$/;//validae alphanumeric with space

      }
      if(type=='5'){
        pattern = /^[(\d{3}\)\s?\d{3}-\d{4}]+$/;
       // pattern = /[0-9\+\/\ ]/;//validae only number with \
      }
      if(type == '6'){
          pattern= /^['A-Za-z0-9\-\\.\\/\']+$/;
      }
      if(type=='7'){
        pattern= /^[A-Za-z ]+$/;//validae alphabets with space
       // pattern= /^['A-Za-z0-9 \-\ \.\ \:\ \;\ \_\ \%\ \#\ \@\ \%\']+$/;
      }
      if(type=='8'){
         pattern = /^[a-zA-Z \-\']+/; //Only alphabets
      }
      if(type=='10'){
          // pattern =  /^[A-Za-z0-9 #&()]+$/; //for location table
          pattern = /^[A-Za-z0-9#&()_., -]+$/;
      }
      if(type=='11'){
             pattern = /^[0-9 \,\']+$/;
      }
      if(type=='12'){
             pattern= /^['A-Za-z0-9 \-\ \.\ \(\ \)\ \\\\ \#\ \/\ \,\ \&\']+$/;//validae alphanumeric with space ^[a-zA-Z \-\ \.\']+ ............ADDRESS
      }

      if(type=='13'){
        pattern= /^['A-Za-z0-9 \-\ \.\ \&\ \/\']+$/;
      }

      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
    /* END:VALIDATE DATA NUM/decimal with number  */

     /* START:VALIDATE ALL EVENTS  */
    preventAllEvents(e: any)
    {
      if (e.ctrlKey && (e.keyCode == 88 || e.keyCode == 67 || e.keyCode == 86)) {
       e.preventDefault();
      }
    }





    spinnerHide(){
      return true;
    }


    spinnerShow(){
      return false;
    }



//----------- CONVERT DATE INTO DD/MM/YYYY FORMAT ------------//
  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    //return ([ d.getFullYear(),pad(d.getMonth()+1),pad(d.getDate())].join('-'));
    return ([ pad(d.getDate()),pad(d.getMonth()+1),d.getFullYear()].join('-'));

  }


}
