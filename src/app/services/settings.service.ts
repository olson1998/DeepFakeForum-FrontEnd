import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {News} from "./news.service";

@Injectable({
  providedIn: 'root'
})
export class SettingsService{

  constructor(private HttpClient: HttpClient) { }

  setCurrentPage(page: number): Observable<number>{
    return this.HttpClient.put<number>("http://localhost:8080/settings/page/", page)
  }

  setNumberOfNewsesOnPage(quantity: number): Observable<number>{
    return this.HttpClient.put<number>("http://localhost:8080/settings/quantity/", quantity)
  }

  getLastPage(): Observable<number>{
    return this.HttpClient.get<number>("http://localhost:8080/settings/numberof/pages")
  }

  getCurrentPage(): Observable<number>{
    return this.HttpClient.get<number>("http://localhost:8080/settings/current/page")
  }

}
