declare var iframeResize: any;
declare var $q: any;

import { Injectable } 
    from '@angular/core';

import { HttpClient, HttpClientModule, HttpHeaders } 
     from '@angular/common/http';

import { Observable, Subject } 
    from 'rxjs';


import { catchError, map, tap } 
    from 'rxjs/operators';


@Injectable()
export class NotificationsService {
    private headers: HttpHeaders;
    private notify = new Subject<any>();

    public retrieveCountCalled: boolean;

    
    notifyObservable$ = this.notify.asObservable();

    defaultMaxResults: number;
    firstResult: number;
    maxResults: any;
    notificationAlerts: any;
    notifications: any;
    showArchived: boolean;
    unreadCount: any;

    constructor( private http: HttpClient ){
        this.headers = new HttpHeaders(
            {
                'Access-Control-Allow-Origin':'*',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector("meta[name='_csrf']").getAttribute("content")
            }
        );

        this.firstResult = 0;
        this.maxResults = this.defaultMaxResults = 10;
        this.notificationAlerts = [];
        this.notifications = [];
        this.retrieveCountCalled = false;
        this.showArchived = false;
        this.unreadCount = 0;
    }

    archive( notificationId ): any {
        let encoded_data = JSON.stringify( notificationId  );
        return this.http.post( 
            getBaseUri() + '/inbox/' + notificationId  + '/archive.json', 
            encoded_data, 
            { headers: this.headers }
        )
    }

    getUnreadCount(): any {
        return this.unreadCount;
    }

    getNotifications(): Observable<any> {
        var url = getBaseUri() + '/inbox/notifications.json?firstResult=' + this.firstResult + '&maxResults=' + this.maxResults;             
        if(this.showArchived){
            url += "&includeArchived=true";
        }
        return this.http.get(
            url
        )
    }

    getNotificationAlerts(): any{
        return this.http.get(
            getBaseUri() + '/inbox/notification-alerts.json'
        )
        .pipe(
            tap(
                (data) => {
                    this.notificationAlerts = data;
                    this.retrieveUnreadCount();                                              
                }
            )
        );
    }

    retrieveUnreadCount(): any {
        this.retrieveCountCalled = true;
        return this.http.get(
            getBaseUri() + '/inbox/unreadCount.json'
        )
    }

    flagAsRead( notificationId ): any {   
        let encoded_data = JSON.stringify( notificationId );
        return this.http.post( 
            getBaseUri() + '/inbox/' + notificationId  + '/read.json', 
            encoded_data, 
            { headers: this.headers }
        )
    }

    suppressAlert(notificationId): any {      
        return this.http.get(
            getBaseUri() + '/inbox/' + notificationId + '/suppressAlert.json',
        )
        .pipe(
            tap(
                (data) => {
                    for(var i = 0;  i < this.notifications.length; i++){
                        var existing = this.notifications[i];
                        if(existing.putCode === notificationId){
                            this.notifications.splice(i, 1);
                            if(this.firstResult > 0){
                                this.firstResult--;
                            }
                            break;
                        }
                    }                                            
                }
            )

        );
    }
}