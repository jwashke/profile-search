import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';

import {Observable } from 'Rxjs';

import { MyMaterialModule } from '../my-material.module';

import { MainComponent } from './main.component';
import { GithubService } from '../services';


describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainComponent ],
      imports: [
        FormsModule,
        MyMaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: GithubService, useClass: StubGithubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#search', () => {
    it('resets the page', () => {
      const stubService = fixture.debugElement.injector.get(GithubService);
      spyOn(stubService, 'searchUsers').and.returnValue(Observable.of({ total_count: 0, items: [] }));

      component.page = 2;
      component.search();

      expect(component.page).toBe(1);
    });

    it('resets show error', () => {
      const stubService = fixture.debugElement.injector.get(GithubService);
      spyOn(stubService, 'searchUsers').and.returnValue(Observable.of({ total_count: 0, items: [] }));

      component.showError = true;
      component.search();

      expect(component.showError).toBeFalsy();
    });

    describe('it successfully returns profiles', () => {
      beforeEach(() => {
        const stubService = fixture.debugElement.injector.get(GithubService);
        spyOn(stubService, 'searchUsers').and.returnValue(Observable.of({ total_count: 2, items: [{ login: 'test1' }, { login: 'test2' }] }));
      });

      it('sets the total count returned and displays it on the page', fakeAsync(() => {
        const element = fixture.debugElement.nativeElement;
        component.search();
        tick();
        fixture.detectChanges();

        expect(component.totalCount).toBe(2);
        expect(element.querySelector('h2').textContent).toContain('Total Count: 2');
      }));

      it('sets the profiles returned displays them on the page', fakeAsync(() => {
        const element = fixture.debugElement.nativeElement;
        component.search();
        tick();
        fixture.detectChanges();

        expect(component.userProfiles.length).toBe(2);
        expect(element.querySelector('.user-profiles').textContent).toContain('test1');
        expect(element.querySelector('.user-profiles').textContent).toContain('test2');
      }));
    });

    describe('it throws an error during the search', () => {
      beforeEach(() => {
        const stubService = fixture.debugElement.injector.get(GithubService);
        spyOn(stubService, 'searchUsers').and.returnValue(Observable.throw('error!'));
      });

      it('sets showError to true', fakeAsync(() => {
        component.search();
        tick();

        expect(component.showError).toBeTruthy();
      }));

      it('sets the error message and displays it on the page', fakeAsync(() => {
        const element = fixture.debugElement.nativeElement;
        component.search();
        tick();
        fixture.detectChanges();

        expect(component.errorMessage).toBe('error!');
        expect(element.querySelector('.error-info').textContent).toContain('error!');
      }));
    })
  })

  describe('#pageEvent', () => {
    beforeEach(() => {
      const stubService = fixture.debugElement.injector.get(GithubService);
      spyOn(stubService, 'searchUsers').and.returnValue(Observable.of({ total_count: 0, items: [] }));
    });

    it('sets the page to the given page index + 1', () => {
      component.pageEvent({ pageIndex: 2, pageSize: 10, length: 0 });

      expect(component.page).toBe(3);
    });
  })
});

class StubGithubService {
  searchUsers(searchTerm: string, page: number) { }
}