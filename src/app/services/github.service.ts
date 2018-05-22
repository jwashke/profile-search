import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import 'rxjs/Rx';

import { IGithubUserSearchResponse } from '../models';

@Injectable()
export class GithubService {
  private githubUrl = 'https://api.github.com/';

  constructor(private http: HttpClient) { }

  searchUsers(searchTerm: string, page: number): Observable<IGithubUserSearchResponse> {
    return this.http.get(`${this.githubUrl}search/users?q=${searchTerm}&page=${page}&per_page=10`)
      .catch(error => this.handleError(error));
      
  }

  handleError(error: HttpErrorResponse) {
    console.log(error);
    return Observable.throw(error.error.message);
  }
}