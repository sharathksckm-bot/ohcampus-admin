import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { GlobalService } from "app/modules/service/global.service";
import { config } from 'app/config';
import { environment } from '../../../environments/environment';
import { UserService } from 'app/core/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class CampusService {
    notificationCount() {
        throw new Error('Method not implemented.');
    }

    apiurl3: string = config.apiurl3; //campus admin
    apiurl4: string = config.apiurl4;

    
    private _authenticated: boolean = false;

    /**
   * Setter & getter for access token
   */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    constructor(private httpClient: HttpClient,
        public _globalService: GlobalService,
        private _userService: UserService) { }


    public handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }



    //--------------------------------------------  USER LOGIN --------------------------------------------------//
    public ValidateUser(username, password): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}Authentication/Login`, {
            username: username,
            assword: password
        }).pipe(
            catchError(() =>
                // Return false
                of(false)
            ),
            switchMap((response: any) => {
                if (response.response_code == 4 || response.response_code == 3 || response.response_data.user.ResetPassword == '1') {
                    return of(response)
                }

                // Store the access token in the local storage
                this.accessToken = response.response_data.token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.response_data.user;

                localStorage.setItem("currentUser", JSON.stringify(response.response_data.user));

                //  this.sessionExpireHnadler();

                // Return true
                return of(response);
            })
        );;
    }


    //--------------------------------------------  New --------------------------------------------------//



    //------------------------------ getDashboardData ---------------------------------------//

    public getDashboardData(fromdate, todate): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Dashboard/getDashboardData`,
            {
                fromdate: fromdate,
                todate: todate
            }
        )
    }

    //------------------------------ getUserDetailsById ---------------------------------------//

    public getUserDetailsById(UserId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}User/getUserDetailsById`,
            {
                UserId: UserId
            }
        )
    }

    //------------------------------ getUserList ---------------------------------------//

    public getUserList(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}User/getUserList`,
            {
            }
        )
    }

    //------------------------------ getUsers ---------------------------------------//

    public getUsers(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}User/getUsers`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }

            }
        )
    }

    //------------------------------ UserStatus/list ---------------------------------------//

    public userStatusList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}UserStatus/list`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }


    //------------------------------ insertUserStatus ---------------------------------------//

    public insertUserStatus(status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}UserStatus/insert`,
            {
                Status: status
            }
        )
    }

    //------------------------------ deleteUserStatus ---------------------------------------//

    public deleteUserStatus(statusId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}UserStatus/delete`,
            {
                StatusId: statusId
            }
        )
    }

    //------------------------------ updateUserStatus ---------------------------------------//

    public updateUserStatus(status, statusId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}UserStatus/update`,
            {
                Status: status,
                Id: statusId
            }
        )
    }

    //------------------------------ getUserStatusById ---------------------------------------//

    public getUserStatusById(statusId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}UserStatus/getDataById`,
            {
                StatusId: statusId
            }
        )
    }

    //------------------------------ UserType/list ---------------------------------------//

    public userTypeList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}UserType/list`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ insertTypeList ---------------------------------------//

    public insertTypeList(type): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}UserType/insert`,
            {
                UserType: type
            }
        )
    }

    //------------------------------ deleteUserType ---------------------------------------//

    public deleteUserType(typeId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}UserType/delete`,
            {
                TypeId: typeId
            }
        )
    }

    //------------------------------ updateUserType ---------------------------------------//

    public updateUserType(type, typeId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}UserType/update`,
            {
                UserType: type,
                TypeId: typeId
            }
        )
    }

    //------------------------------ getUserTypeById ---------------------------------------//

    public getUserTypeById(typeId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}UserType/getDataById`,
            {
                TypeId: typeId
            }
        )
    }

    //------------------------------ insertUserDetails ---------------------------------------//

    public insertUserDetails(FirstName, LastName, PhoneNumber, Email, UserType, UserStatus, Password, ConfirmPassword, ImageName): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}User/insertUserDetails`,
            {
                FirstName: FirstName,
                LastName: LastName,
                PhoneNumber: PhoneNumber,
                Email: Email,
                UserType: UserType,
                UserStatus: UserStatus,
                Password: Password,
                ConfirmPassword: ConfirmPassword,
                ImageName: ImageName

            }
        )
    }


    //------------------------------ updateUserDetails ---------------------------------------//

    public updateUserDetails(id, FirstName, LastName, PhoneNumber, Email, UserType, UserStatus, ImageName): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}User/updateUserDetails`,
            {
                UserId: id,
                FirstName: FirstName,
                LastName: LastName,
                PhoneNumber: PhoneNumber,
                Email: Email,
                UserType: UserType,
                UserStatus: UserStatus,
                ImageName: ImageName

            }
        )
    }

    //------------------------------ deleteUserDetails ---------------------------------------//

    public deleteUserDetails(userId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}User/deleteUserDetails`,
            {
                UserId: userId

            }
        )
    }


    //  ------------------------------ upload Documents ---------------------------------------//
    public uploadUserDocs(formData): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}User/uploadUserDocs`,
            formData
        );

    }

    //  ------------------------------ getCollegeTypes ---------------------------------------//

    public getCollegeTypes(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}CollegeType/getCollegeTypes`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //  ------------------------------ getCollegeType ---------------------------------------//

    public getCollegeType(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}CollegeType/getCollegeType`,
            {}
        )
    }

    //------------------------------ deleteclgTypeDetails ---------------------------------------//

    public deleteclgTypeDetails(type_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}CollegeType/deleteclgTypeDetails`,
            {
                typeId: type_id

            }
        )
    }


    //------------------------------ insertClgTypeDetails ---------------------------------------//

    public insertClgTypeDetails(type, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}CollegeType/insertClgTypeDetails`,
            {
                type: type,
                status: status
            }
        )
    }

    //------------------------------ getClgTypeDetailsById ---------------------------------------//

    public getClgTypeDetailsById(typeId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}CollegeType/getClgTypeDetailsById`,
            {
                typeId: typeId
            }
        )
    }

    //------------------------------ updatetClgTypeDetails ---------------------------------------//

    public updatetClgTypeDetails(type, status, collegeIdData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}CollegeType/updatetClgTypeDetails`,
            {
                type: type,
                status: status,
                id: collegeIdData
            }
        )
    }

    //------------------------------ getExamCourseList ---------------------------------------//

    public getExamCourseList(): Observable<any> {
        return this.httpClient.get(`${this.apiurl3}Courses/getCourse`,
            {

            }
        )
    }

    //------------------------------ getExamStateList ---------------------------------------//

    public getExamStateList(): Observable<any> {
        return this.httpClient.get(`${this.apiurl3}Courses/getState`,
            {

            }
        )
    }

    //------------------------------ getCategoryList ---------------------------------------//

    public getCategoryList(type, page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/getCategoryList`,
            {
                type: type,
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ insertCategoryDetails ---------------------------------------//

    public insertCategoryDetails(catname, topmenu, menuorder, status, type): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/insertCategoryDetails`,
            {
                CatName: catname,
                TopMenu: topmenu,
                MenuOrder: menuorder,
                Status: status,
                type: type,
            }
        )
    }

    //------------------------------ updateCategoryDetails ---------------------------------------//

    public updateCategoryDetails(catname, topmenu, menuorder, status, catId, type): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/updateCategoryDetails`,
            {
                CatName: catname,
                TopMenu: topmenu,
                MenuOrder: menuorder,
                Status: status,
                CatId: catId,
                type: type,
            }
        )
    }

    //------------------------------ getCategoryDetailsById ---------------------------------------//

    public getCategoryDetailsById(catId, type): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/getCategoryDetailsById`,
            {
                CatId: catId,
                type: type,
            }
        )
    }

    //------------------------------ deleteCategoryDetails ---------------------------------------//

    public deleteCategoryDetails(cat_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/deleteCategoryDetails`,
            {
                CatId: cat_id
            }
        )
    }




    //------------------------------ getSubCategoryList ---------------------------------------//

    public getSubCategoryList(page, pageSize, startNum, columnIndex, sortValue, search, cat, level): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/getSubCategoryList`,
            {

                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search,
                    cat: cat,
                    level: level
                }
            }
        )
    }



    //------------------------------ getFacilitiesList ---------------------------------------//

    public getFacilitiesList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Facilities/getFacilitiesList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ getFacilities ---------------------------------------//

    public getFacilities(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Facilities/getFacilities`,
            {}
        )
    }

    //------------------------------ insertFacilities ---------------------------------------//

    public insertFacilities(faciname, description, icon, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Facilities/insertFacilities`,
            {
                title: faciname,
                description: description,
                icon: icon,
                status: status
            }
        )
    }

    //------------------------------ updateFacilities ---------------------------------------//

    public updateFacilities(faciId, faciname, description, icon, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Facilities/updateFacilities`,
            {
                id: faciId,
                title: faciname,
                description: description,
                icon: icon,
                status: status
            }
        )
    }

    //------------------------------ getFacilitiesDetailsById ---------------------------------------//

    public getFacilitiesDetailsById(faciId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Facilities/getFacilitiesDetailsById`,
            {
                id: faciId
            }
        )
    }

    //------------------------------ deleteFacilities ---------------------------------------//

    public deleteFacilities(faci_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Facilities/deleteFacilities`,
            {
                id: faci_id
            }
        )
    }


    //------------------------------ getRankCategoryList ---------------------------------------//

    public getRankCategoryList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankCategories/getRankCategoryList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ getRankcategories ---------------------------------------//

    public getRankcategories(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankCategories/getRankcategories`,
            {}
        )
    }

    //------------------------------ insertRankCategory ---------------------------------------//

    public insertRankCategory(title, image): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankCategories/insertRankCategory`,
            {
                title: title,
                image: image
            }
        )
    }

    //------------------------------ updateRankCategory ---------------------------------------//

    public updateRankCategory(rankId, title, image): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankCategories/updateRankCategory`,
            {
                id: rankId,
                title: title,
                image: image
            }
        )
    }

    //------------------------------ getRnkCatDetailsById ---------------------------------------//

    public getRnkCatDetailsById(rankId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankCategories/getRnkCatDetailsById`,
            {
                id: rankId
            }
        )
    }

    //------------------------------ deleteRnkCatDetails ---------------------------------------//

    public deleteRnkCatDetails(rank_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankCategories/deleteRnkCatDetails`,
            {
                id: rank_id
            }
        )
    }

    //  ------------------------------ uploadimages ---------------------------------------//
    public uploadimages(formData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankCategories/uploadimages`,
            formData
        );

    }

 //  ------------------------------ getCityFormStateList ---------------------------------------//
 public getCityFormStateList(): Observable<any> {
    return this.httpClient.post(`${this.apiurl3}Courses/getState`,
        {}
    );

}
    
    //------------------------------ getCountryList ---------------------------------------//

    public getCountryList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Country/getCountryList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }



    //------------------------------ getCountry ---------------------------------------//

    public getCountry(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Country/getCountry`,
            {}
        )
    }

    //------------------------------ insertCountryDetails ---------------------------------------//

    public insertCountryDetails(name): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Country/insertCountryDetails`,
            {
                name: name
            }
        )
    }

    //------------------------------ updateCountryDetails ---------------------------------------//

    public updateCountryDetails(countrId, name): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Country/updateCountryDetails`,
            {
                id: countrId,
                name: name,
            }
        )
    }

    //------------------------------ getCountryDetailsById ---------------------------------------//

    public getCountryDetailsById(countrId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Country/getCountryDetailsById`,
            {
                id: countrId
            }
        )
    }

    //------------------------------ deleteCountry ---------------------------------------//

    public deleteCountry(countr_Id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Country/deleteCountry`,
            {
                id: countr_Id
            }
        )
    }

    //------------------------------ getClgList ---------------------------------------//

    public getClgList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/getClgList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

     //------------------------------ getUserforNotification ---------------------------------------//

   public getUserforNotification(search): Observable<any>{
         return this.httpClient.post(`${this.apiurl3}Notification/getUserforNotification`,{
            search:search
         })
   }

    //------------------------------ insertNotificationDetails ---------------------------------------//
   public insertNotificationDetails(users,title,message,isAllSelected): Observable<any>{
        return this.httpClient.post(`${this.apiurl3}Notification/saveNotification`,
            {
                title:title,
                message:message,
                userId:users,
                isAllselected:isAllSelected
            })
   }

       //------------------------------ updateNotificationDetails ---------------------------------------//

   public updateNotificationDetails(notificationId,users,title,message):Observable<any>{
    return this.httpClient.post(`${this.apiurl3}Notification/updateNotification`,
        {
            id:notificationId,
            title:title,
            message:message,
            userId:users,
        }
    )
   }

       //------------------------------ getNotificationDetailsById ---------------------------------------//

  public getNotificationDetailsById(id):Observable<any>{
    return this.httpClient.post(`${this.apiurl3}Notification/getNotificationById`,
        {
            notificationId:id
        }
    )
  }

       //------------------------------ deleteNotification ---------------------------------------//

  public deleteNotification(id):Observable<any>{
     return this.httpClient.post(`${this.apiurl3}Notification/deleteNotification`,
        {
            notificationId:id
        }
     )
  }
  //------------------------------ getCertifactionList ---------------------------------------//

  public getNotificationList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
    return this.httpClient.post(`${this.apiurl3}Notification/getNotificationList`,
        {
            draw: page,
            length: pageSize,
            start: startNum,
            order: [
                {
                    column: columnIndex,
                    dir: sortValue
                }
            ],
            search: {
                value: search
            }
        }
    )
}

    //------------------------------ getColleges ---------------------------------------//

    public getColleges(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/getColleges`,
            {}
        )
    }

    //------------------------------ insertCollegeDetails ---------------------------------------//

    public insertCollegeDetails(collegeName, country, state, mobileNumber, accreditation,
        maplocation, city, year, address, emailAddress, website, clgType,
        description, regPkgType, conditions, status, menu, entranceTest,
        what_new, notification, notification_link, application_link, is_trending): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/insertCollegeDetails`,
            {
                collegeName: collegeName,
                countryId: country,
                stateid: state,
                phone: mobileNumber,
                accreditation: accreditation,
                map_location: maplocation,
                cityid: city,
                estyear: year,
                address: address,
                email: emailAddress,
                website: website,
                collegeTypeId: clgType,
                description: description,
                cet: "1",
                pgcet: "1",
                package_type: regPkgType,
                terms: conditions,
                status: status,
                view_in_menu: menu,
                is_accept_entrance: entranceTest,
                what_new: what_new,
                notification: notification,
                notification_link: notification_link,
                application_link: application_link,
                is_trending: is_trending
            }
        )
    }

    //------------------------------ updateCollegeDetails ---------------------------------------//

    public updateCollegeDetails(clgId, collegeName, country, state, mobileNumber, accreditation,
        maplocation, city, year, address, emailAddress, website, clgType, description,
        regPkgType, conditions, status, menu, entranceTest,
        what_new, notification, notification_link, application_link, is_trending): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/updateCollegeDetails`,
            {
                clgId: clgId,
                collegeName: collegeName,
                countryId: country,
                stateid: state,
                phone: mobileNumber,
                accreditation: accreditation,
                map_location: maplocation,
                cityid: city,
                estyear: year,
                address: address,
                email: emailAddress,
                website: website,
                collegeTypeId: clgType,
                description: description,
                cet: "1",
                pgcet: "1",
                package_type: regPkgType,
                terms: conditions,
                status: status,
                view_in_menu: menu,
                is_accept_entrance: entranceTest,
                what_new: what_new,
                notification: notification,
                notification_link: notification_link,
                application_link: application_link,
                is_trending: is_trending
            }

        )
    }

    //------------------------------ getCollegeDetailsById ---------------------------------------//

    public getCollegeDetailsById(clgId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/getCollegeDetailsById`,
            {
                id: clgId
            }
        )
    }

    //------------------------------ deleteCollege ---------------------------------------//

    public deleteCollege(clg_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/deleteCollege`,
            {
                id: clg_id
            }
        )
    }


    //------------------------------ getStateList ---------------------------------------//

    public getStateList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}State/getStateList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ insertStateDetails ---------------------------------------//

    public insertStateDetails(stateName, countryId, view_in_menu): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}State/insertStateDetails`,
            {
                stateName: stateName,
                countryId: countryId,
                view_in_menu: view_in_menu
            }
        )
    }

    //------------------------------ updateStateDetails ---------------------------------------//

    public updateStateDetails(stateName, countryId, view_in_menu, stateId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}State/updateStateDetails`,
            {
                stateName: stateName,
                countryId: countryId,
                view_in_menu: view_in_menu,
                id: stateId,
            }
        )
    }

    //------------------------------ getStateDetailsById ---------------------------------------//

    public getStateDetailsById(stateId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}State/getStateDetailsById`,
            {
                id: stateId
            }
        )
    }

    //------------------------------ deleteState ---------------------------------------//

    public deleteState(state_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}State/deleteState`,
            {
                id: state_id
            }
        )
    }

    //------------------------------ getStateDetailsByCntId ---------------------------------------//

    public getStateDetailsByCntId(CountryId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}State/getStateDetailsByCntId`,
            {
                CountryId: CountryId
            }
        )
    }


    //------------------------------ getCityList ---------------------------------------//

    public getCityList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}City/getCityList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ insertCityDetails ---------------------------------------//

    public insertCityDetails(city, countryId, stateid, view_in_menu,image): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}City/insertCityDetails`,
            {
                city: city,
                countryId: countryId,
                stateid: stateid,
                view_in_menu: view_in_menu,
                image:image
            }
        )
    }

    //------------------------------ updateCityDetails ---------------------------------------//

    public updateCityDetails(cityId, city, countryId, stateid, view_in_menu,image): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}City/updateCityDetails`,
            {
                id: cityId,
                city: city,
                countryId: countryId,
                stateid: stateid,
                view_in_menu: view_in_menu,
                image:image
            }
        )
    }

    //------------------------------ getCityDetailsById ---------------------------------------//

    public getCityDetailsById(cityId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}City/getCityDetailsById`,
            {
                id: cityId
            }
        )
    }

    //------------------------------ deleteCity ---------------------------------------//

    public deleteCity(city_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}City/deleteCity`,
            {
                id: city_id
            }
        )
    }


    //------------------------------ getCityDetailsByStateId ---------------------------------------//

    public getCityDetailsByStateId(stateId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}City/getCityDetailsByStateId`,
            {
                stateId: stateId
            }
        )
    }

     //  ------------------------------ cityUploadDocs ---------------------------------------//

     public cityUploadDocs(formData): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}City/uploadCityDocs`,
            formData
        );
    }
    //------------------------------ getPackagesList ---------------------------------------//

    public getPackagesList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Packages/getPackagesList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ insertPackagesDetails ---------------------------------------//

    public insertPackagesDetails(name, price): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Packages/insertPackagesDetails`,
            {
                name: name,
                price: price
            }
        )
    }

    //------------------------------ updatePackagesDetails ---------------------------------------//

    public updatePackagesDetails(pkgId, name, price): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Packages/updatePackagesDetails`,
            {
                id: pkgId,
                name: name,
                price: price
            }
        )
    }

    //------------------------------ getPackagesDetailsById ---------------------------------------//

    public getPackagesDetailsById(pkgId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Packages/getPackagesDetailsById`,
            {
                id: pkgId
            }
        )
    }

    //------------------------------ deletePackages ---------------------------------------//

    public deletePackages(pkg_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Packages/deletePackages`,
            {
                id: pkg_id
            }
        )
    }

    //  ------------------------------ uploadDocs ---------------------------------------//

    public uploadDocs(formData): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}Loan/uploadDocs`,
            formData
        );
    }

    //------------------------------ getLoanList ---------------------------------------//

    public getLoanList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Loan/getLoanList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ insertLoanDetails ---------------------------------------//

    public insertLoanDetails(name, type, file_link): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Loan/insertLoanDetails`,
            {
                name: name,
                type: type,
                file_link: file_link
            }
        )
    }

    //------------------------------ updateLoanDetails ---------------------------------------//

    public updateLoanDetails(loanId, name, type, file_link): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Loan/updateLoanDetails`,
            {
                id: loanId,
                name: name,
                type: type,
                file_link: file_link
            }
        )
    }

    //------------------------------ getLoanDetailsById ---------------------------------------//

    public getLoanDetailsById(loanId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Loan/getLoanDetailsById`,
            {
                id: loanId
            }
        )
    }

    //------------------------------ deleteLoan ---------------------------------------//

    public deleteLoan(loan_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Loan/deleteLoan`,
            {
                id: loan_id
            }
        )
    }

    //  ------------------------------ ScholarUploadDocs ---------------------------------------//

    public ScholarUploadDocs(formData): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}Scholarships/uploadDocs`,
            formData
        );
    }

    //------------------------------ getScholarshipsList ---------------------------------------//

    public getScholarshipsList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Scholarships/getScholarshipsList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ getScholarships ---------------------------------------//

    public getScholarships(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Scholarships/getScholarships`,
            {}
        )
    }

    //------------------------------ insertScholarshipsDetails ---------------------------------------//

    public insertScholarshipsDetails(provider_name, name, type, file_link): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Scholarships/insertScholarshipsDetails`,
            {
                provider_name: provider_name,
                name: name,
                type: type,
                file_link: file_link
            }
        )
    }

    //------------------------------ updateScholarshipsDetails ---------------------------------------//

    public updateScholarshipsDetails(scholarId, provider_name, name, type, file_link): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Scholarships/updateScholarshipsDetails`,
            {
                id: scholarId,
                provider_name: provider_name,
                name: name,
                type: type,
                file_link: file_link
            }
        )
    }

    //------------------------------ getScholarshipsDetailsById ---------------------------------------//

    public getScholarshipsDetailsById(scholarId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Scholarships/getScholarshipsDetailsById`,
            {
                id: scholarId
            }
        )
    }

    //------------------------------ deleteScholarships ---------------------------------------//

    public deleteScholarships(scholar_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Scholarships/deleteScholarships`,
            {
                id: scholar_id
            }
        )
    }

    //------------------------------ getFaqList ---------------------------------------//

    public getFaqList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Faq/getFaqList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ insertFaqDetails ---------------------------------------//

    public insertFaqDetails(categoryid, heading, description, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Faq/insertFaqDetails`,
            {
                categoryid: categoryid,
                heading: heading,
                description: description,
                status: status,
            }
        )
    }

    //------------------------------ updateFaqDetails ---------------------------------------//

    public updateFaqDetails(faqsId, categoryid, heading, description, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Faq/updateFaqDetails`,
            {
                id: faqsId,
                categoryid: categoryid,
                heading: heading,
                description: description,
                status: status,
            }
        )
    }

    //------------------------------ getFaqDetailsById ---------------------------------------//

    public getFaqDetailsById(faqsId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Faq/getFaqDetailsById`,
            {
                id: faqsId
            }
        )
    }

    //------------------------------ deleteFaq ---------------------------------------//

    public deleteFaq(faqs_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Faq/deleteFaq`,
            {
                id: faqs_id
            }
        )
    }
    //------------------------------ deleteCollegeFaq ---------------------------------------//

    public deleteCollegeFaq(faqs_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Faq/deleteCollegeFaq`,
            {
                id: faqs_id
            }
        )
    }



    //------------------------------ getCategoryListByType ---------------------------------------//

    public getCategoryListByType(type): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/getCategoryListByType`,
            {
                type: type
            }
        )
    }

    //  ------------------------------ HostelUploadDocs ---------------------------------------//

    public HostelUploadDocs(formData): Observable<any> {

        return this.httpClient.post(
            `${this.apiurl3}Hostel/uploadDocs`,
            formData
        );
    }

    //-------------------------------uploadDescImg--------------------------------------------------//
    public uploadDescImg(formData): Observable<any> {

        return this.httpClient.post(
            `${this.apiurl3}Hostel/uploadDescriptionDocs`,
            formData
        );
    }
    //------------------------------ insertHostelDetails ---------------------------------------//

    public insertHostelDetails(userId, userType, title, image, description, colleges, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Hostel/insertHostelDetails`,
            {
                userId: userId,
                user_type: userType,
                title: title,
                image: image,
                description: description,
                college_id: colleges,
                status: status
            }
        )
    }

    //------------------------------ getHostelList ---------------------------------------//

    public getHostelList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Hostel/getHostelList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ getHostelDetailsById ---------------------------------------//

    public getHostelDetailsById(blogId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Hostel/getHostelDetailsById`,
            {
                id: blogId
            }
        )
    }

    //------------------------------ updateHostelDetails ---------------------------------------//

    public updateHostelDetails(blogId, userId, userType, title, image, description, colleges, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Hostel/updateHostelDetails`,
            {
                id: blogId,
                userId: userId,
                user_type: userType,
                title: title,
                image: image,
                description: description,
                college_id: colleges,
                status: status,

            }
        )
    }

    //------------------------------ deleteHostel ---------------------------------------//

    public deleteHostel(blog_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Hostel/deleteHostel`,
            {
                id: blog_id

            }
        )
    }



    //  ------------------------------ BlogUploadDocs ---------------------------------------//

    public BlogUploadDocs(formData): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}Blog/uploadDocs`,
            formData
        );
    }

    //------------------------------ getBlogList ---------------------------------------//

    public getBlogList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Blog/getBlogList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ insertBlogDetails ---------------------------------------//

    public insertBlogDetails(categoryid, title,subTitle, image, description, status, Exam, colleges): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Blog/insertBlogDetails`,
            {
                categoryid: categoryid,
                title: title,
                subTitle:subTitle,
                image: image,
                description: description,
                status: status,
                exam_id: Exam,
                college_id: colleges
            }
        )
    }

    //------------------------------ updateBlogDetails ---------------------------------------//

    public updateBlogDetails(blogId, categoryid, title,subTitle, image, description, status, Exam, colleges): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Blog/updateBlogDetails`,
            {
                id: blogId,
                categoryid: categoryid,
                title: title,
                subTitle:subTitle,
                image: image,
                description: description,
                status: status,
                exam_id: Exam,
                college_id: colleges
            }
        )
    }

    //------------------------------ getBlogDetailsById ---------------------------------------//

    public getBlogDetailsById(blogId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Blog/getBlogDetailsById`,
            {
                id: blogId
            }
        )
    }

    //------------------------------ deleteBlog ---------------------------------------//

    public deleteBlog(blog_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Blog/deleteBlog`,
            {
                id: blog_id
            }
        )
    }

    //------------------------------ getBlogcategoryList ---------------------------------------//

    public getBlogcategoryList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Blogcategory/getBlogcategoryList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ getBlogCategory ---------------------------------------//

    public getBlogCategory(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Blogcategory/getBlogCategory`,
            {}
        )
    }


    //------------------------------ getCertificatloiList ---------------------------------------//

    public getCertificatloiList(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Certification/getCertificateList`,
            {}
        )
    }
    //  ------------------------------ ExamUploadDocs ---------------------------------------//

    public ExamUploadDocs(formData): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}Exam/uploadDocs`,
            formData
        );
    }

    //  ------------------------------ ExamdeleteDoc ---------------------------------------//

    public ExamDeleteDoc(imageId): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}Exam/deleteDoc`,
            {
                imageId: imageId,
            }
        );
    }

    //------------------------------ getExamList ---------------------------------------//

    public getExamList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Exam/getExamList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ insertExamDetails ---------------------------------------//

    public insertExamDetails(name, category, status,courseLevel,examLevel,state,fromDate,toDate, menu, description, criteria, process, pattern, notification): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Exam/insertExamDetails`,
            {
                name: name,
                category: category,
                status: status,
                course_level:courseLevel,
                exam_level:examLevel,
                state:state,
                formData:fromDate,
                toDate:toDate,
                view_in_menu: menu,
                description: description,
                criteria: criteria,
                process: process,
                pattern: pattern,
                notification: notification
            }
        )
    }
    
  //------------------------------ deleteexamdocsById--------------------
public deleteexamdocsById(docId):Observable<any>{
    return this.httpClient.post(`${this.apiurl3}Exam/deleteexamdocsById`,
        {
        docsId:docId

    })
}

    //------------------------------ getExamDocById ---------------------------------------//
      public getExamDocById(docId):Observable<any>{
        return this.httpClient.post(`${this.apiurl3}Exam/getexamdocsById`,
            {
                docsId:docId
            }
        )
      }

    //------------------------------ getExamDoc ---------------------------------------//
    public getExamDocs(page, pageSize, startNum, columnIndex, sortValue, search,examId):Observable<any>{
        return this.httpClient.post(`${this.apiurl3}Exam/getexamdocs`,
            {
                draw:page,
                length:pageSize,
                start:startNum,
                order:[
                    {
                        column:columnIndex,
                        dir:sortValue
                    }
                ],
                search:{
                    value:search
                },
                examId:examId
            }
        )
    }

    //------------------------------ updateExamDetails ---------------------------------------//

    public updateExamDetails(examId, name, category, status,course,examLevel,state,fromDate,toDate,menu, description, criteria, process, pattern, notification): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Exam/updateExamDetails`,
            {
                id: examId,
                name: name,
                category: category,
                status: status,
                course:course,
                examLevel:examLevel,
                state:state,
                formData:fromDate,
                toDate:toDate,
                view_in_menu: menu,
                description: description,
                criteria: criteria,
                process: process,
                pattern: pattern,
                notification: notification
            }
        )
    }

    //------------------------------ getExamDetailsById ---------------------------------------//

    public getExamDetailsById(examId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Exam/getExamDetailsById`,
            {
                id: examId
            }
        )
    }

    //------------------------------ deleteExam ---------------------------------------//

    public deleteExam(exam_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Exam/deleteExam`,
            {
                id: exam_id
            }
        )
    }

    //------------------------------ insertBlogCategoryDetails ---------------------------------------//

    public insertBlogCategoryDetails(catname, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Blogcategory/insertBlogcategoryDetails`,
            {
                name: catname,
                status: status,
            }
        )
    }

    //------------------------------getBlogsCategoryList---------------------------------------//

    public getBlogsCategoryList(type, page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Blogcategory/getBlogcategoryList`,
            {
                type: type,
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }
    //------------------------------  getCategoryBlogsDetailsById---------------------------------------//

    public getCategoryBlogsDetailsById(catId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Blogcategory/getBlogcategoryDetailsById`,
            {
                id: catId,

            }
        )
    }


    //------------------------------ updateBlogCategoryDetails ---------------------------------------//

    public updateBlogCategoryDetails(catId, catname, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Blogcategory/updateBlogcategoryDetails`,
            {
                id: catId,
                name: catname,
                status: status,

            }
        )
    }

    //------------------------------ deleteBlogCategoryDetails ---------------------------------------//

    public deleteBlogCategoryDetails(cat_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Blogcategory/deleteBlogcategory`,
            {
                id: cat_id
            }
        )
    }

    //------------------------------getCourseList---------------------------------------//

    public getCourseList(page, pageSize, startNum, columnIndex, sortValue, search, category): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getCourseList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search,
                    category: category
                }
            }
        )
    }

    //------------------------------ insertCourseDetails ---------------------------------------//

    public insertCourseDetails(name, duration, academicCategory, courseCategory, scope, jobProfile, eligibility, certification, description, ImageName, sub_category, topmenu): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/insertCourseDetails`,
            {
                name: name,
                duration: duration,
                academicCategory: academicCategory,
                courseCategory: courseCategory,
                scope: scope,
                jobProfile: jobProfile,
                eligibility: eligibility,
                certification: certification,
                description: description,
                imageName: ImageName,
                sub_category: sub_category,
                topmenu: topmenu
            }
        )
    }

    //------------------------------ updateCourseDetails ---------------------------------------//

    public updateCourseDetails(courseId, name, duration, academicCategory, courseCategory, scope, jobProfile, eligibility, certification, description, ImageName, sub_category, topmenu): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/updateCourseDetails`,
            {
                course_id: courseId,
                name: name,
                duration: duration,
                academicCategory: academicCategory,
                courseCategory: courseCategory,
                scope: scope,
                jobProfile: jobProfile,
                eligibility: eligibility,
                certification: certification,
                description: description,
                imageName: ImageName,
                sub_category: sub_category,
                topmenu: topmenu
            }
        )
    }

    //  ------------------------------ uploadCourseDocs ---------------------------------------//

    public uploadCourseDocs(formData): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}Courses/uploadDocs`,
            formData
        );
    }

    //------------------------------ deleteCourses ---------------------------------------//

    public deleteCourses(course_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/deleteCourses`,
            {
                id: course_id
            }
        )
    }

    //------------------------------ getCourseDetailsById ---------------------------------------//

    public getCourseDetailsById(courseId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getCourseDetailsById`,
            {
                id: courseId
            }
        )
    }

    //------------------------------ getUGCourses ---------------------------------------//

    public getUGCourses(searchUg, collegeid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getUGCoursesDropDownList`,
            {
                searchUg: searchUg,
                collegeid: collegeid
            }
        )
    }

    public getExamForSubCat(collegeid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getExamForSubCat`,
            {
                collegeid: collegeid
            }
        )
    }

    //------------------------------ getExamForCollege ---------------------------------------//

    public getExamForCollege(collegeid, subcatid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}/Courses/getExamForCollege`,
            {
                collegeid: collegeid,
                subcatid: subcatid
            }
        )
    }
    //------------------------------ deleteClgCourses ---------------------------------------//

    public deleteClgCourses(courseid, collegeid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/deleteClgCourses`,
            {
                courseid: courseid,
                collegeid: collegeid
            }
        )
    }


    //------------------------------ getPGCourses ---------------------------------------//

    public getPGCourses(searchPg, collegeid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getPGCoursesDropDownList`,
            {
                searchPg: searchPg,
                collegeid: collegeid

            }
        )
    }

    //------------------------------ getDiplomaCourses ---------------------------------------//

    public getDiplomaCourses(searchDp, collegeid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getDiplomaCoursesDropdownlist`,
            {
                searchDp: searchDp,
                collegeid: collegeid
            }
        )
    }

    //------------------------------ getDoctorialCourses ---------------------------------------//

    public getDoctorialCourses(searchDoc, collegeid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getDocCoursesDropdownlist`,
            {
                searchDoc: searchDoc,
                collegeid: collegeid


            }
        )
    }


    //------------------------------ getOtherCourses ---------------------------------------//

    public getOtherCourses(searchOther, collegeid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getOtherCoursesDropdownlist`,
            {
                searchOther: searchOther,
                collegeid: collegeid
            }
        )
    }

    //------------------------------ getPostDocCourses ---------------------------------------//

    public getPostDocCourses(searcPostDoc, collegeid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getPostDocCourses`,
            {
                searcPostDoc: searcPostDoc,
                collegeid: collegeid

            }
        )
    }

    //------------------------------ getAdvMasterCourses ---------------------------------------//

    public getAdvMasterCourses(searcAdvMas, collegeid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getAdvMasterCoursesdropdownlist`,
            {
                searcAdvMas: searcAdvMas,
                collegeid: collegeid
            }
        )
    }

    //------------------------------ getAcCategoryForCourse ---------------------------------------//

    public getAcCategoryForCourse(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/getAcCategoryForCourse`,
            {}
        )
    }

    //------------------------------ getCategoryForCourse ---------------------------------------//

    public getCategoryForCourse(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/getCategoryForCourse`,
            {}
        )
    }


    //  ------------------------------ collegeUploadDocs ---------------------------------------//

    public collegeUploadDocs(formData): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}College/uploadDocs`,
            formData
        );
    }

    //  ------------------------------ collegeSaveDoc ---------------------------------------//

    public collegeSaveDoc(clgId, logoImage, bannerImage, type, image): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}College/saveDoc`,
            {
                clgId: clgId,
                logoImage: logoImage,
                bannerImage: bannerImage,
                type: type,
                image: image
            }
        );
    }


    //  ------------------------------ collegeDeleteDoc ---------------------------------------//

    public collegeDeleteDoc(imageId): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}College/deleteDoc`,
            {
                imageId: imageId,
            }
        );
    }

    //------------------------------ updateCategoryForClg ---------------------------------------//

    public updateCategoryForClg(catIds, clgId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/updateCategoryForClg`,
            {
                catIds: catIds,
                clgId: clgId
            }
        )
    }

    //------------------------------ updateCourseForClg ---------------------------------------//

    public updateCourseForClg(clgId, courses): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/updateCourseForClg`,
            {
                clgId: clgId,
                courses: courses,
            }
        )
    }

    //------------------------------ updateHighlightsForClg ---------------------------------------//

    public updateHighlightsForClg(clgId, highlights): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/updateHighlightsForClg`,
            {
                clgId: clgId,
                highlights: highlights,
            }
        )
    }

    //------------------------------ insertUpdateFeeStructure ---------------------------------------//

    public insertUpdateFeeStructure(clgId, feeStructure): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/insertUpdateFeeStructure`,
            {
                clgId: clgId,
                feeStructure: feeStructure,
            }
        )
    }

    //------------------------------ updateFacilityForClg ---------------------------------------//

    public updateFacilityForClg(clgId, facilityIds): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/updateFacilityForClg`,
            {
                clgId: clgId,
                facilities: facilityIds,
            }
        )
    }

    //  ------------------------------ uploadBrochuresDocs ---------------------------------------//

    public uploadBrochuresDocs(formData): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}College/uploadBrochuresDocs`,
            formData
        );
    }

    //------------------------------ saveBrochuresDoc ---------------------------------------//

    public saveBrochuresDoc(clgId, image): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/saveBrochuresDoc`,
            {
                clgId: clgId,
                image: image,
            }
        )
    }

    //------------------------------getEventList---------------------------------------//

    public getEventList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Event/getEventList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ insertEventsDetails ---------------------------------------//

    public insertEventsDetails(name, address, contactnumber, email, website, maplocation, start_date, end_date, desc, collegeid, regPkgType, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Event/insertEventDetails`,
            {
                name: name,
                address: address,
                phone: contactnumber,
                email: email,
                website: website,
                maplocation: maplocation,
                start_date: start_date,
                end_date: end_date,
                desc: desc,
                collegeid: collegeid,
                package: regPkgType,
                status: status
            }
        )
    }

    //------------------------------ updateEventDetails ---------------------------------------//

    public updateEventDetails(eventId, name, address, contactnumber, email, website, maplocation, start_date, end_date, desc, collegeid, package1, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Event/updateEventDetails`,
            {
                id: eventId,
                name: name,
                address: address,
                phone: contactnumber,
                email: email,
                website: website,
                maplocation: maplocation,
                start_date: start_date,
                end_date: end_date,
                desc: desc,
                collegeid: collegeid,
                package: package1,
                status: status
            }
        )
    }

    //------------------------------getEventsDetailsById---------------------------------------//

    public getEventsDetailsById(event_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Event/getEventDetailsById`,
            {
                id: event_id
            }
        )
    }

    //------------------------------deleteEvent---------------------------------------//

    public deleteEvent(event_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Event/deleteEvent`,
            {
                id: event_id
            }
        )
    }

    //  ------------------------------ SaveDoc ---------------------------------------//

    public SaveDoc(postId, type, image): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}/Common/saveDoc `,
            {
                postId: postId,
                type: type,
                image: image
            }
        );
    }

    //  ------------------------------ SaveExamsDocs ---------------------------------------//
   
    public SaveExamsDocs(examId,docType,docName,title,docs): Observable<any>{
        return this.httpClient.post(`${this.apiurl3}Exam/saveExamDocs`,
            {
                examId:examId,
                docType:docType,
                docName:docName,
                title:title,
                docs:docs,
                
            }
        )
    }

    //  ------------------------------ updateExamsDocs ---------------------------------------//

    public updateExamsDocs(docId,examId, docType, docTypeName,Title, docFileName): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}/Exam/updateExamDocs`,
            {
               docs_id:docId,
               examId:examId,
               docType:'',
               docName:docTypeName,
               title:Title,
               docs:docFileName
            }
        );
    }


    //  ------------------------------ eventUploadDocs ---------------------------------------//

    public eventUploadDocs(formData): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}Event/uploadDocs`,
            formData
        );
    }

    //------------------------------deleteDoc---------------------------------------//

    public EventDeleteDoc(imageId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Event/deleteDoc`,
            {
                imageId: imageId
            }
        )
    }

    //------------------------------getReviewList---------------------------------------//

    public getReviewList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Review/getReviewList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------getReviewDetailsById---------------------------------------//

    public getReviewDetailsById(reviewId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Review/getReviewDetailsById`,
            {
                id: reviewId
            }
        )
    }

    //------------------------------deleteReview---------------------------------------//

    public deleteReview(review_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Review/deleteReview`,
            {
                id: review_id
            }
        )
    }

    //------------------------------updateStatus---------------------------------------//

    public reviewUpdateStatus(reviewId, statusId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Review/updateStatus`,
            {
                reviewId: reviewId,
                statusId: statusId
            }
        )
    }

    //------------------------------getEnquiryList---------------------------------------//

    public getEnquiryList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Enquiry/getEnquiryList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------deleteEnquiry---------------------------------------//

    public deleteEnquiry(enquiryId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Enquiry/deleteEnquiry`,
            {
                id: enquiryId
            }
        )
    }

    //------------------------------ updateStatus ---------------------------------------//

    public updateStatus(id, status, type): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Enquiry/updateStatus`,
            {
                id: id,
                is_attended: status,
                type: type
            }
        )
    }

    //------------------------------getCourseApplicationList---------------------------------------//

    public getCourseApplicationList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}CourseApplication/getCourseApplicationList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------deleteCourseApplication---------------------------------------//

    public deleteCourseApplication(applicationId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}CourseApplication/deleteCourseApplication`,
            {
                id: applicationId
            }
        )
    }

    //------------------------------coursesOfferedInSameGrp---------------------------------------//

    public coursesOfferedInSameGrp(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/coursesOfferedInSameGrp`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------getcourseInquiry---------------------------------------//

    public getcourseInquiry(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courseinquiry/getcourseInquiry`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------course_inquiryDelete---------------------------------------//

    public course_inquiryDelete(enquiry_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courseinquiry/course_inquiryDelete`,
            {
                id: enquiry_id
            }
        )
    }

    //  ------------------------------ CareerUploadDocs ---------------------------------------//

    public CareerUploadDocs(formData): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}Careers/uploadDocs`,
            formData
        );
    }

    //------------------------------CareerDeleteDoc---------------------------------------//

    public CareerDeleteDoc(review_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Careers/deleteDoc`,
            {
                id: review_id
            }
        )
    }

    //------------------------------getCareersList---------------------------------------//

    public getCareersList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Careers/getCareersList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ insertCareersDetails ---------------------------------------//

    public insertCareersDetails(name, description, image, categoryid, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Careers/insertCareersDetails`,
            {
                careerName: name,
                description: description,
                image: image,
                categoryid: categoryid,
                status: status
            }
        )
    }

    //------------------------------ updateCareersDetails ---------------------------------------//

    public updateCareersDetails(careerId, name, description, image, categoryid, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Careers/updateCareersDetails`,
            {
                id: careerId,
                careerName: name,
                description: description,
                image: image,
                categoryid: categoryid,
                status: status
            }
        )
    }

    //------------------------------getCareersDetailsById---------------------------------------//

    public getCareersDetailsById(careerId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Careers/getCareersDetailsById`,
            {
                id: careerId
            }
        )
    }

    //------------------------------deleteCareers---------------------------------------//

    public deleteCareers(careerId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Careers/deleteCareers`,
            {
                id: careerId
            }
        )
    }

    //------------------------------ getPredictList ---------------------------------------//

    public getPredictList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}PredictAdmission/getPredictedadmission`,
            {

                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ insertupdateAcademicYearForClg ---------------------------------------//

    public insertupdateAcademicYearForClg(clgId, placementStats): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/insertupdateAcademicYearForClg`,
            {
                clgId: clgId,
                placementStats: placementStats
            }
        )
    }

    //------------------------------ deleteAcadmicPlacements ---------------------------------------//

    public deleteAcadmicPlacements(placeIndex): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/deleteAcadmicPlacements`,
            {
                placementId: placeIndex
            }
        )
    }

    //------------------------------ insertupdateRankForClg ---------------------------------------//

    public insertupdateRankForClg(clgId, rank): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/insertupdateRankForClg`,
            {
                clgId: clgId,
                rank: rank
            }
        )
    }

    //------------------------------ getPlacementCategory ---------------------------------------//

    public getPlacementCategory(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/getPlacementCategory`,
            {}
        )
    }

    //------------------------------ deleteRankForCollege ---------------------------------------//

    public deleteRankForCollege(rankId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/deleteRankForCollege`,
            {
                rankId: rankId
            }
        )
    }

    //------------------------------ updateScholarshipsForClg ---------------------------------------//

    public updateScholarshipsForClg(clgId, scholarships): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/updateScholarshipsForClg`,
            {
                clgId: clgId,
                scholarships: scholarships
            }
        )
    }

    //------------------------------ deleteHighlightsOfCollege ---------------------------------------//

    public deleteHighlightsOfCollege(highlightId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/deleteHighlightsOfCollege`,
            {
                highlightId: highlightId
            }
        )
    }

    //------------------------------ deleteBrochureOfCollege ---------------------------------------//

    public deleteBrochureOfCollege(brochureId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/deleteBrochureOfCollege`,
            {
                brochureId: brochureId
            }
        )
    }

    //------------------------------ deleteFeeStructOfCollege ---------------------------------------//

    public deleteFeeStructOfCollege(feeId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/deleteFeeStructOfCollege`,
            {
                feeId: feeId
            }
        )
    }

    //------------------updateEventsCategory---------------------//

    public updateEventsCategory(eventId, eventsIds): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Event/updateCategory`,
            {
                eventId: eventId,
                catIds: eventsIds
            }
        )
    }

    //------------------getPageCategory---------------------//

    public getPageCategory(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/getPageCategory`,
            {}
        )
    }


    //------------------getContentCategory---------------------//

    public getContentCategory(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/getContentCategory`,
            {}
        )
    }



    //------------------getSampleFormat---------------------//

    public getSampleFormat(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/getSampleFormat`,
            {}
        )
    }

    //------------------getFormatDataUsingId---------------------//

    public getFormatDataUsingId(sampleId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/getFormatDataUsingId`,
            {
                sampleId: sampleId
            }
        )
    }

    //------------------getCourseUsingClgId---------------------//

    public getCourseUsingClgId(clgId, searchCrsValue): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/getCourseUsingClgId`,
            {
                clgId: clgId,
                searchCrs: searchCrsValue
            }
        )
    }

    //------------------getExams---------------------//

    public getExams(search_exam, subcat): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Exam/getExams`,
            {
                searchExam: search_exam,
                subcat: subcat
            }
        )
    }


    //------------------saveExamForSubCat---------------------//

    public getCollegeSubCat(collegeid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getCollegeSubCat`,
            {

                collegeid: collegeid
            }
        )
    }

    //------------------updateFaqForCollege---------------------//

    public saveExamForSubCat(collegeid, examlist): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/saveExamForSubCat`,
            {
                collegeid: collegeid,
                examlist: examlist
            }
        )
    }

    //------------------updateCourses---------------------//

    public updateEntranceExam(subcat, examids, collegeid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/saveExamForSubCat`,
            {
                subcat: subcat,
                examids: examids,
                collegeid: collegeid,
            }
        )
    }




    //------------------getCollegeCourseDetail---------------------//

    public getCollegeCourseDetail(courseId, clgId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getCollegeCourseDetail`,
            {
                id: courseId,
                clgid: clgId
            }
        )
    }



    //------------------updateCourses---------------------//

    public updateCourses(clgId, courseId, fieldName, fieldDetails): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/updateCourses`,
            {
                collegeId: clgId,
                courseId: courseId,
                fieldName: fieldName,
                fieldDetails: fieldDetails,

            }
        )
    }


    //------------------getSubCategoryByCatId---------------------//

    public getSubCategoryByCatId(catId, acCatId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/getSubCategoryByCatId`,
            {
                catId: catId,
                acCatId: acCatId
            }
        )
    }

    //------------------allFaqByCategory---------------------//

    public allFaqByCategory(catId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}faq/allFaqByCatagory`,
            {
                id: catId,
            }
        )
    }

    //------------------updateFaqForCollege---------------------//

    public updateFaqForCollege(clgId, faqsData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}faq/updateFaqForCollege`,
            {
                college: clgId,
                faqsData: faqsData
            }
        )
    }


    //------------------saveTblOfContent---------------------//

    public saveTblOfContent(titleids, collegeid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/saveTblOfContent`,
            {
                titleids: titleids,
                collegeid: collegeid,

            }
        )
    }

    //------------------getCourses---------------------//

    public getCourses(search_course): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getCourses`,
            {
                search_courses: search_course
            }
        )
    }

    //------------------getSubCategory---------------------//

    public getCategories(search_category): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/getCategories`,
            {
                search_category: search_category
            }
        )
    }

    //------------------getCategories---------------------//

    public getSubCategory(search_subcategory, categoryId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/getSubCategory`,
            {
                search_category: search_subcategory,
                categoryId: categoryId
            }
        )
    }

    //------------------getClgTypes---------------------//

    public getClgTypes(search_clgtype): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}CollegeType/getClgTypes`,
            {
                search_clgtype: search_clgtype
            }
        )
    }

    //------------------------------ getCounselingFeesList ---------------------------------------//

    public getCounselingFeesList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/getCounselingFeesList`,
            {

                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------saveCounselingFees---------------------//

    public saveCounselingFees(subCatType, catType, clgType, amount, exam): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/saveCounselingFees`,
            {
                sub_category: subCatType,
                categoryid: catType,
                collegeType: clgType,
                fees: amount,
                exam_id: exam
            }
        )
    }

    //------------------updateCounselingFees---------------------//

    public updateCounselingFees(subCatType, catType, clgType, amount, feeId, exam): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/updateCounselingFees`,
            {
                sub_category: subCatType,
                categoryid: catType,
                collegeType: clgType,
                fees: amount,
                id: feeId,
                exam_id: exam
            }
        )
    }

    //------------------deleteCounselingFees---------------------//

    public deleteCounselingFees(feeId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/deleteCounselingFees`,
            {
                id: feeId
            }
        )
    }

    //------------------getCounselingFeesById---------------------//

    public getCounselingFeesById(feeId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/getCounselingFeesById`,
            {
                id: feeId
            }
        )
    }

    //------------------SendEnquiryResponse---------------------//

    public SendEnquiryResponse(email, enquiry, response, enquiryId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Enquiry/SendEnquiryResponse`,
            {
                enquiryId: enquiryId,
                email: email,
                enquiry: enquiry,
                response: response,
            }
        )
    }

    //------------------SendCourseEnquiryResponse---------------------//

    public SendCourseEnquiryResponse(email, name, course_cat, course, interested, response, enquiryId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courseinquiry/SendCourseEnquiryResponse`,
            {
                email: email,
                name: name,
                course_cat: course_cat,
                course: course,
                intrested: interested,
                response: response,
                enquiryId: enquiryId,
            }
        )
    }

    //------------------SendCourseApplicationResponse---------------------//

    public SendCourseApplicationResponse(enquiryId, type, email, name, college, course, exams, rank, score, response): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}CourseApplication/SendCourseApplicationResponse`,
            {
                enquiryId: enquiryId,
                type: type,                             //for predict admission pass Predict Admission
                email: email,
                name: name,
                college: college,
                course: course,
                exams: exams,
                rank: rank,
                score: score,
                response: response
            }
        )
    }

    //------------------------------deleteAdmission---------------------------------------//

    public deleteAdmission(predictId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}PredictAdmission/deleteAdmission`,
            {
                id: predictId
            }
        )
    }

    //------------------------------ getCollegeReport ---------------------------------------//

    public getCollegeReport(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/getCollegeReport`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }

            }
        )
    }

    //------------------------------ getUserActivity ---------------------------------------//

    public getUserActivity(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/getUserActivity`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }

            }
        )
    }

    //------------------------------ getTeamReport ---------------------------------------//

    public getTeamReport(page, pageSize, startNum, columnIndex, sortValue, search, usertype, fromdate, todate): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/getTeamReport`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search,
                    usertype: usertype,
                    fromdate: fromdate,
                    todate: todate
                }

            }
        )
    }

    //------------------------------ getTrendingColleges ---------------------------------------//

    public getTrendingColleges(fromdate, todate): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/getTrendingColleges`,
            {
                fromdate: fromdate,
                todate: todate
            }
        )
    }

    //------------------------------ getTrendingCourse ---------------------------------------//

    public getTrendingCourse(fromdate, todate): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Courses/getTrendingCourses`,
            {
                fromdate: fromdate,
                todate: todate
            }
        )
    }

    //------------------------------ viewUserActivity ---------------------------------------//

    public viewUserActivity(userId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/viewUserActivity`,
            {
                userid: userId
            }
        )
    }



    //------------------------------ getCertifactionList ---------------------------------------//

    public getCertifactionList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Certification/getCertificateList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }


    //------------------------------ insertcertifiateDetails ---------------------------------------//

    public insertcertifiateDetails(categoryid, name, image, description, status, colleges): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Certification/insertcertifiateDetails`,
            {
                categoryid: categoryid,
                name: name,
                image: image,
                description: description,
                status: status,
                college_id: colleges
            }
        )
    }


    //------------------------------ certicationUploadDocs ---------------------------------------//

    public certicationUploadDocs(formData): Observable<any> {
        return this.httpClient.post(
            `${this.apiurl3}Certification/uploadDocs`,
            formData
        );
    }
    //  //------------------------------ getCertificateDetailsById ---------------------------------------//

    public getCertificateDetailsById(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Certification/getCertificateDetailsById`,
            {
                id: id
            }
        )
    }
    //------------------------------ deleteCertification ---------------------------------------//

    public deleteCertification(certi_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Certification/deleteCertificate`,
            {
                id: certi_id
            }
        )
    }

    //------------------------------ updateCertificationDetails ---------------------------------------//

    public updateCertificationDetails(categoryid, name, image, description, status, college_id, id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Certification/updateCertificateDetails`,
            {
                categoryid: categoryid,
                name: name,
                image: image,
                description: description,
                status: status,
                college_id: college_id,
                id: id
            }
        )
    }

    //------------------------------ notificationCount ---------------------------------------//

    public notificationCount1(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/notificationCount`,
            {}
        )
    }

    //------------------------------ updateLogStatus ---------------------------------------//

    public updateLogStatus(logid, type): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/updateLogStatus`,
            {
                logid: logid,
                type: type
            }
        )
    }

    //------------------------------ getList ---------------------------------------//

    public getList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Specialization/getList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }

            }
        )
    }

    //------------------------------ saveSpecialization ---------------------------------------//

    public saveSpecialization(specialisation, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Specialization/saveSpecialization`,
            {
                name: specialisation,
                status: status
            }
        )
    }

    //------------------------------ updateSpecialization ---------------------------------------//

    public updateSpecialization(specialisation, status, speId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Specialization/updateSpecialization`,
            {
                name: specialisation,
                status: status,
                id: speId
            }
        )
    }

    //------------------------------ getSpecializationById ---------------------------------------//

    public getSpecializationById(speId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Specialization/getSpecializationById`,
            {
                id: speId
            }
        )
    }

    //------------------------------ deleteSpecialization ---------------------------------------//

    public deleteSpecialization(speId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Specialization/deleteSpecialization`,
            {
                id: speId
            }
        )
    }
    //  //------------------------------ getTblOfContentById ---------------------------------------//

    public getTblOfContentById(collegeid): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/getTblOfContentById`,
            {
                collegeid: collegeid
            }
        )
    }

    //------------------------------ getCollegeCategory ---------------------------------------//

    public getCollegeCategory(college_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/getCollegeCategory`,
            {
                college_id: college_id
            }
        )
    }

    //------------------------------getCollegeCourses ---------------------------------------//
    public getCollegeCourses(college_id, category_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}College/getCollegeCourses`,
            {
                college_id: college_id,
                category_id: category_id
            }
        )
    }
    //------------------------------ insertKCETCutoff ---------------------------------------//

    public insertKCETCutoff(college_id, round, course_id, category_id, year, oneG, oneH, oneK, oneKH, oneR, oneRH, twoAG, twoAH, twoAK, twoAKH, twoAR, twoARH,
        twoBG, twoBH, twoBK, twoBKH, twoBR, twoBRH, treeAG, treeAH, treeAK, treeAKH, treeAR, treeARH, treeBG, treeBH, treeBK, treeBKH, treeBR, treeBRH, GM, GMH, GMK, GMKH,
        GMR, GMRH, SCG, SCH, SCK, SCKH, SCR, SCRH, STG, STH, STK, STKH, STR, STRH
    ): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Cutoff/insertKCETCutoff`,
            {
                college_id: college_id,
                round: round,
                course_id: course_id,
                category_id: category_id,
                year: year,
                G1: oneG,
                H1: oneH,
                K1: oneK,
                KH1: oneKH,
                R1: oneR,
                RH1: oneRH,
                AG2: twoAG,
                AH2: twoAH,
                AK2: twoAK,
                AKH2: twoAKH,
                AR2: twoAR,
                ARH2: twoARH,
                BG2: twoBG,
                BH2: twoBH,
                BK2: twoBK,
                BKH2: twoBKH,
                BR2: twoBR,
                BRH2: twoBRH,
                AG3: treeAG,
                AH3: treeAH,
                AK3: treeAK,
                AKH3: treeAKH,
                AR3: treeAR,
                ARH3: treeARH,
                BG3: treeBG,
                BH3: treeBH,
                BK3: treeBK,
                BKH3: treeBKH,
                BR3: treeBR,
                BRH3: treeBRH,
                GM: GM,
                GMH: GMH,
                GMK: GMK,
                GMKH: GMKH,
                GMR: GMR,
                GMRH: GMRH,
                SCG: SCG,
                SCH: SCH,
                SCK: SCK,
                SCKH: SCKH,
                SCR: SCR,
                SCRH: SCRH,
                STG: STG,
                STH: STH,
                STK: STK,
                STKH: STKH,
                STR: STR,
                STRH: STRH



            }
        )
    }

    //------------------------------ viewMoreKCET ---------------------------------------//

    public viewMoreKCET(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Cutoff/viewMoreKCET`,
            {
                id: id
            }
        )
    }

    //------------------------------ deleteKCET ---------------------------------------//

    public deleteKCET(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Cutoff/deleteKCET`,
            {
                id: id
            }
        )
    }

    //------------------------------ getDetailsById ---------------------------------------//

    public getDetailsById(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Cutoff/getDetailsById`,
            {
                id: id
            }
        )
    }

    public getSampleCSV(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Cutoff/getSampleCSV`,
            {
                // id:id
            }
        )
    }

    public importKCETcsv(formData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Cutoff/importKCETcsv`, formData
            // {
            //     id:id
            // }
        )
    }


    //------------------------------ getKCETCutOffList ---------------------------------------//

    public getKCETCutOffList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Cutoff/getKCETCutOffList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ getQADataByQueId ---------------------------------------//

    public getQADataByQueId(QueId, collegeId): Observable<any> {
        return this.httpClient.post(`${this.apiurl4}QuestionAnswere/getQADataByQueId`,
            {
                QueId: QueId,
                collegeId: collegeId
            }
        )
    }

    //------------------------------ postAnswere ---------------------------------------//

    public postAnswere(questionId, user_id, answer): Observable<any> {
        return this.httpClient.post(`${this.apiurl4}QuestionAnswere/postAnswere`,
            {
                questionId: questionId,
                user_id: user_id,
                answer: answer
            }
        )
    }

    public deleteQuestion(questionId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}QuestionAnswere/deleteQuestion`,
            {
                questionId: questionId,

            }
        )
    }

    //------------------------------ QuestionAnswere ---------------------------------------//

    public postComment(answer_id, user_id, comment): Observable<any> {
        return this.httpClient.post(`${this.apiurl4}QuestionAnswere/postAnsComment`,
            {
                answer_id: answer_id,
                user_id: user_id,
                comment: comment
            }
        )
    }
    //------------------------------ getQuestionList ---------------------------------------//

    public getQuestionList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}QuestionAnswere/getQuestionList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }


    //------------------------------ insertCourseDetails ---------------------------------------//

    public insertSubCategoryDetails(catid, level, eligibility, name): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/insertSubCategoryDetails`,
            {
                catid: catid,
                level: level,
                eligibility: eligibility,
                name: name

            }
        )
    }

    //------------------------------ deleteSubCategoryDetails ---------------------------------------//

    public deleteSubCategoryDetails(cat_id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/deleteSubCategoryDetails`,
            {
                id: cat_id
            }
        )
    }

    //------------------------------ getCourseDetailsById ---------------------------------------//

    public getSubCategoryDetailsById(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/getSubCategoryDetailsById`,
            {
                id: id
            }
        )
    }


    //------------------------------ updateCourseDetails ---------------------------------------//

    public updateSubCategoryDetails(id, catid, level, eligibility, name): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Category/updateSubCategoryDetails`,
            {
                id: id,
                catid: catid,
                level: level,
                eligibility: eligibility,
                name: name


            }
        )
    }
    //------------------------------ getCOMEDKCutOffList ---------------------------------------//

    public getCOMEDKCutOffList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}/Cutoff/getCOMEDKCutOffList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }


    //------------------------------ insertUpdateCOMEDKCutoff ---------------------------------------//

    public insertUpdateCOMEDKCutoff(college_id, course_id, round, category, year, rank, id
    ): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Cutoff/insertUpdateCOMEDKCutoff`,
            {
                college_id: college_id,
                course_id: course_id,
                round: round,
                category: category,
                year: year,
                rank: rank,
                id: id
            }
        )
    }

    //------------------------------ deleteKCET ---------------------------------------//

    public deleteCOMEDK(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}/Cutoff/deleteCOMEDK`,
            {
                id: id
            }
        )
    }



    //------------------------------ getDetailsById ---------------------------------------//

    public getCOMEDKDetailsById(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Cutoff/getCOMEDKDetailsById`,
            {
                id: id
            }
        )
    }
    //------------------------------ getSampleCSV1 ---------------------------------------//

    public getSampleCSV1(type): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Cutoff/getSampleCSV`,
            {
                type: type
            }
        )
    }

    //------------------------------ importCOMEDKcsv ---------------------------------------//

    public importCOMEDKcsv(formData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Cutoff/importCOMEDKcsv`, formData
            // {
            //     id:id
            // }
        )
    }

    //==================================================================================//
    //                      NEET COLLEGE PREDICTOR METHODS                              //
    //==================================================================================//

    //------------------------------ getNeetCutoffList ---------------------------------------//
    public getNeetCutoffList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}NeetPredictor/getNeetCutoffList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: columnIndex,
                        dir: sortValue
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    //------------------------------ insertUpdateNeetCutoff ---------------------------------------//
    public insertUpdateNeetCutoff(data): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}NeetPredictor/insertUpdateNeetCutoff`, data)
    }

    //------------------------------ getNeetCutoffById ---------------------------------------//
    public getNeetCutoffById(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}NeetPredictor/getNeetCutoffById`,
            {
                id: id
            }
        )
    }

    //------------------------------ deleteNeetCutoff ---------------------------------------//
    public deleteNeetCutoff(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}NeetPredictor/deleteNeetCutoff`,
            {
                id: id
            }
        )
    }

    //------------------------------ importNeetCutoffCsv ---------------------------------------//
    public importNeetCutoffCsv(formData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}NeetPredictor/importNeetCutoffCsv`, formData)
    }

    //------------------------------ getSampleNeetCsv ---------------------------------------//
    public getSampleNeetCsv(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}NeetPredictor/getSampleNeetCsv`, {})
    }

    //------------------------------ predictNeetColleges ---------------------------------------//
    public predictNeetColleges(data): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}NeetPredictor/predictColleges`, data)
    }

    //------------------------------ getNeetStatesList ---------------------------------------//
    public getNeetStatesList(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}NeetPredictor/getStatesList`, {})
    }

    //------------------------------ getNeetStateRules ---------------------------------------//
    public getNeetStateRules(state): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}NeetPredictor/getStateRules`,
            {
                state: state
            }
        )
    }

    //------------------------------ generateNeetPreferenceList ---------------------------------------//
    public generateNeetPreferenceList(colleges): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}NeetPredictor/generatePreferenceList`,
            {
                colleges: colleges
            }
        )
    }

    //------------------------------ getNeetPredictorLogs ---------------------------------------//
    public getNeetPredictorLogs(limit, offset): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}NeetPredictor/getPredictorLogs`,
            {
                limit: limit,
                offset: offset
            }
        )
    }

    //==================================================================================//
    //                      SEAT AVAILABILITY METHODS                                   //
    //==================================================================================//

    //------------------------------ getSeatAvailabilityList ---------------------------------------//
    public getSeatAvailabilityList(page, pageSize, startNum, columnIndex, sortValue, search, filters): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}SeatAvailability/getSeatAvailabilityList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [{ column: columnIndex, dir: sortValue }],
                search: { value: search },
                ...filters
            }
        )
    }

    //------------------------------ insertUpdateSeatAvailability ---------------------------------------//
    public insertUpdateSeatAvailability(data): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}SeatAvailability/insertUpdateSeatAvailability`, data)
    }

    //------------------------------ getSeatById ---------------------------------------//
    public getSeatById(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}SeatAvailability/getSeatById`, { id: id })
    }

    //------------------------------ deleteSeatAvailability ---------------------------------------//
    public deleteSeatAvailability(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}SeatAvailability/deleteSeatAvailability`, { id: id })
    }

    //------------------------------ importSeatsCsv ---------------------------------------//
    public importSeatsCsv(formData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}SeatAvailability/importSeatsCsv`, formData)
    }

    //------------------------------ getSeatSampleCsv ---------------------------------------//
    public getSeatSampleCsv(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}SeatAvailability/getSampleCsv`, {})
    }

    //------------------------------ getPublicSeatAvailability ---------------------------------------//
    public getPublicSeatAvailability(state, counselingType, course, year): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}SeatAvailability/getPublicSeatAvailability`,
            {
                state: state,
                counseling_type: counselingType,
                course: course,
                year: year
            }
        )
    }

    //==================================================================================//
    //                      AI PREFERENCE OPTIMIZER METHODS                             //
    //==================================================================================//

    //------------------------------ generateAIOptimizedPreferences ---------------------------------------//
    public generateAIOptimizedPreferences(data): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}AIPreferenceOptimizer/generateOptimizedPreferences`, data)
    }

    //==================================================================================//
    //                      GENERIC COLLEGE PREDICTOR METHODS                           //
    //==================================================================================//

    //------------------------------ getGenericCutoffList ---------------------------------------//
    public getGenericCutoffList(page, pageSize, startNum, columnIndex, sortValue, search, examType): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/getCutoffList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [{ column: columnIndex, dir: sortValue }],
                search: { value: search },
                exam_type: examType
            }
        )
    }

    //------------------------------ insertUpdateGenericCutoff ---------------------------------------//
    public insertUpdateGenericCutoff(data): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/insertUpdateCutoff`, data)
    }

    //------------------------------ getGenericCutoffById ---------------------------------------//
    public getGenericCutoffById(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/getCutoffById`, { id: id })
    }

    //------------------------------ deleteGenericCutoff ---------------------------------------//
    public deleteGenericCutoff(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/deleteCutoff`, { id: id })
    }

    //------------------------------ importGenericCutoffExcel ---------------------------------------//
    public importGenericCutoffExcel(formData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/importCutoffExcel`, formData)
    }

    //------------------------------ getGenericSampleCsv ---------------------------------------//
    public getGenericSampleCsv(examType): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/getSampleCsv`, { exam_type: examType })
    }

    //------------------------------ predictGenericColleges ---------------------------------------//
    public predictGenericColleges(data): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/predictColleges`, data)
    }

    //------------------------------ getGenericExamTypes ---------------------------------------//
    public getGenericExamTypes(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/getExamTypes`, {})
    }

    //------------------------------ getGenericReservations ---------------------------------------//
    public getGenericReservations(examType): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/getReservations`, { exam_type: examType })
    }

    //------------------------------ getGenericYears ---------------------------------------//
    public getGenericYears(examType): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/getYears`, { exam_type: examType })
    }

    //------------------------------ getGenericRounds ---------------------------------------//
    public getGenericRounds(examType, year): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/getRounds`, { exam_type: examType, year: year })
    }

    //------------------------------ getGenericCategories ---------------------------------------//
    public getGenericCategories(examType): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/getCategories`, { exam_type: examType })
    }

    //------------------------------ getGenericCourses ---------------------------------------//
    public getGenericCourses(examType, category): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/getCourses`, { exam_type: examType, category: category })
    }

    //------------------------------ generateGenericPreferenceList ---------------------------------------//
    public generateGenericPreferenceList(colleges): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/generatePreferenceList`, { colleges: colleges })
    }

    //------------------------------ deleteGenericBulkCutoffs ---------------------------------------//
    public deleteGenericBulkCutoffs(examType, year?, round?): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/deleteBulkCutoffs`, 
            { exam_type: examType, year: year, round: round })
    }

    //--------------------------------------------  STUDY ABROAD APIs --------------------------------------------------//

    public getStudyAbroadList(page, pageSize, startNum, columnIndex, sortValue, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}StudyAbroad/getStudyAbroadList`,
            {
                page: page,
                pageSize: pageSize,
                startNum: startNum,
                columnIndex: columnIndex,
                sortValue: sortValue,
                search: search
            }
        )
    }

    public deleteStudyAbroad(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}StudyAbroad/deleteStudyAbroad`,
            {
                id: id
            }
        )
    }

    public updateStudyAbroadStatus(id, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}StudyAbroad/updateStatus`,
            {
                id: id,
                status: status
            }
        )
    }

    public sendStudyAbroadResponse(email, enquiry, response, enquiryId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}StudyAbroad/sendResponse`,
            {
                email: email,
                enquiry: enquiry,
                response: response,
                enquiryId: enquiryId
            }
        )
    }

    //--------------------------------------------  MOCK TEST APIs --------------------------------------------------//

    public getMockTestList(page, pageSize, startNum, orderColumn, orderDir, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MockTest/getTestList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: orderColumn,
                        dir: orderDir
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    public getMockTestById(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MockTest/getTestById`,
            {
                id: id
            }
        )
    }

    public insertMockTest(testData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MockTest/insertTest`, testData)
    }

    public updateMockTest(testData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MockTest/updateTest`, testData)
    }

    public deleteMockTest(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MockTest/deleteTest`,
            {
                id: id
            }
        )
    }

    public getMockTestQuestions(testId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MockTest/getQuestions`,
            {
                test_id: testId
            }
        )
    }

    public insertMockTestQuestion(questionData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MockTest/insertQuestion`, questionData)
    }

    public updateMockTestQuestion(questionData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MockTest/updateQuestion`, questionData)
    }

    public uploadMockTestImage(formData: FormData): Observable<any> {
        return this.httpClient.post<any>(this.apiurl3 + "MockTest/uploadImage", formData);
    }
    public deleteMockTestQuestion(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MockTest/deleteQuestion`,
            {
                id: id
            }
        )
    }

    public getMockTestAttempts(page, pageSize, startNum, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MockTest/getAttempts`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                search: {
                    value: search
                }
            }
        )
    }

    public getMockTestStats(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MockTest/getStats`, {})
    }

    public bulkInsertMockTestQuestions(testId, questions): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MockTest/bulkInsertQuestions`,
            {
                test_id: testId,
                questions: questions
            }
        )
    }

    //--------------------------------------------  ALERTS APIs --------------------------------------------------//

    public getAlertsList(page, pageSize, startNum, orderColumn, orderDir, search, type = ''): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Alerts/getAlertsList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: orderColumn,
                        dir: orderDir
                    }
                ],
                search: {
                    value: search
                },
                type: type
            }
        )
    }

    public getAlertById(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Alerts/getAlertById`,
            {
                id: id
            }
        )
    }

    public insertAlert(alertData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Alerts/insertAlert`, alertData)
    }

    public updateAlert(alertData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Alerts/updateAlert`, alertData)
    }

    public deleteAlert(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Alerts/deleteAlert`,
            {
                id: id
            }
        )
    }

    public updateAlertStatus(id, status): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Alerts/updateStatus`,
            {
                id: id,
                status: status
            }
        )
    }

    //--------------------------------------------  RANK PREDICTOR APIs --------------------------------------------------//

    public getRankPredictorExamList(page, pageSize, startNum, orderColumn, orderDir, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankPredictor/getExamList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                order: [
                    {
                        column: orderColumn,
                        dir: orderDir
                    }
                ],
                search: {
                    value: search
                }
            }
        )
    }

    public getRankPredictorExamById(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankPredictor/getExamById`,
            {
                id: id
            }
        )
    }

    public insertRankPredictorExam(examData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankPredictor/insertExam`, examData)
    }

    public updateRankPredictorExam(examData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankPredictor/updateExam`, examData)
    }

    public deleteRankPredictorExam(id): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankPredictor/deleteExam`,
            {
                id: id
            }
        )
    }

    public getRankPredictorData(examId, page, pageSize, startNum): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankPredictor/getRankData`,
            {
                exam_id: examId,
                length: pageSize,
                start: startNum
            }
        )
    }

    public uploadRankPredictorCSV(examId, file): Observable<any> {
        const formData = new FormData();
        formData.append('exam_id', examId);
        formData.append('file', file);
        return this.httpClient.post(`${this.apiurl3}RankPredictor/uploadCSV`, formData)
    }

    public clearRankPredictorData(examId): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankPredictor/clearRankData`,
            {
                exam_id: examId
            }
        )
    }

    public getRankPredictorPredictions(page, pageSize, startNum, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankPredictor/getPredictions`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                search: {
                    value: search
                }
            }
        )
    }

    public getRankPredictorStats(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}RankPredictor/getStats`, {})
    }

    //--------------------------------------------  DASHBOARD STATS APIs --------------------------------------------------//

    public getDashboardStats(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}Common/getDashboardStats`, {})
    }

    // Clear all NEET cutoff data
    public clearNeetCutoffData(confirmToken: string, year?: string, state?: string, counselingType?: string): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}NeetPredictor/clearAllData`,
            {
                confirm_token: confirmToken,
                year: year,
                state: state,
                counseling_type: counselingType
            }
        )
    }

    // Clear all Generic (KCET/COMEDK/JEE) cutoff data
    public clearGenericCutoffData(confirmToken: string, examType?: string, year?: string): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}GenericPredictor/clearAllData`,
            {
                confirm_token: confirmToken,
                exam_type: examType,
                year: year
            }
        )
    }

    //--------------------------------------------  AI MOCK TEST GENERATOR APIs --------------------------------------------------//

    public getAIExamConfigs(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}AIMockTestGenerator/getExamConfigs`, {})
    }

    public generateAITest(requestData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}AIMockTestGenerator/generateTest`, requestData)
    }

    public previewAITest(requestData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}AIMockTestGenerator/previewTest`, requestData)
    }

    public publishAITest(requestData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}AIMockTestGenerator/publishTest`, requestData)
    }

    public regenerateAIQuestions(requestData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}AIMockTestGenerator/regenerateQuestions`, requestData)
    }

    public getAIGenerationHistory(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}AIMockTestGenerator/getGenerationHistory`, {})
    }

    public updateAIGeneratedQuestion(requestData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}AIMockTestGenerator/updateGeneratedQuestion`, requestData)
    }

    public bulkGenerateAITests(requestData): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}AIMockTestGenerator/bulkGenerateTests`, requestData)
    }

    //--------------------------------------------  LEAD CAPTURE APIs --------------------------------------------------//

    public getCallbackRequests(page, pageSize, startNum, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}LeadCapture/getCallbackRequests`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                search: {
                    value: search
                }
            }
        )
    }

    public updateCallbackStatus(id, status, notes, assignedTo): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}LeadCapture/updateCallbackStatus`,
            {
                id: id,
                status: status,
                notes: notes,
                assigned_to: assignedTo
            }
        )
    }

    public getCourseEnquiryLeads(page, pageSize, startNum, search): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}LeadCapture/getCourseEnquiryList`,
            {
                draw: page,
                length: pageSize,
                start: startNum,
                search: {
                    value: search
                }
            }
        )
    }

    public getLeadStats(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}LeadCapture/getLeadStats`, {})
    }

    // Lead Analytics Dashboard API
    // Lead Analytics Dashboard API
    public getLeadAnalytics(dateRange: string): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}LeadCapture/getLeadAnalytics`, { dateRange: dateRange });
    }

    // SEO Tools - Meta Description Generator
    public generateMetaDescription(data: any): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MetaDescriptionGenerator/generate`, data);
    }

    // Batch Meta Description Generation
    public generateBatchMetaDescriptions(contentType: string, limit: number): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}MetaDescriptionGenerator/generateBatchFromDB`, { content_type: contentType, limit: limit });
    }

    // Predictor Settings APIs
    public getAllPredictorSettings(): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}../apps/Exam/getAllPredictorSettings`, {});
    }

    public updatePredictorSettings(data: any): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}../apps/Exam/updatePredictorSettings`, data);
    }

    public createPredictorSettings(data: any): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}../apps/Exam/createPredictorSettings`, data);
    }

    public deletePredictorSettings(examId: number): Observable<any> {
        return this.httpClient.post(`${this.apiurl3}../apps/Exam/deletePredictorSettings`, { exam_id: examId });
    }
}

// apiURL    OnlineInsurancePortalAPI
// apiurl3   Motor_DNI_Api  winkey2key
// apiurl   testportal.dni.ae:8443
