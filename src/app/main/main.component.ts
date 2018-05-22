import { Component, OnInit } from '@angular/core';

import { PageEvent } from '@angular/material';

import { GithubService } from '../services';
import { IGithubUserProfile } from '../models';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  errorMessage: string;
  page: number;
  searchTerm: string;
  showError: boolean;
  totalCount: number;
  userProfiles: IGithubUserProfile[];

  constructor(private githubService: GithubService) { }

  search() {
    this.page = 1;
    this.showError = false;
    this.getUsers();
  }

  pageEvent(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.getUsers();
  }

  private getUsers() {
    this.githubService.searchUsers(this.searchTerm, this.page)
      .subscribe(response => {
        this.totalCount = response.total_count;
        this.userProfiles = response.items;
      }, error => {
        this.showError = true;
        this.errorMessage = error;
      });
  }
}
