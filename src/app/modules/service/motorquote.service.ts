import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import {  switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from '../../../environments/environment';
import { catchError, tap, map } from 'rxjs/operators';
import { GlobalService } from "app/modules/service/global.service";
@Injectable({
    providedIn: 'root',
})
export class MotorquoteService {
    
  
}