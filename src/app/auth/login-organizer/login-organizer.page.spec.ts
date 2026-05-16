import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginOrganizerPage } from './login-organizer.page';

describe('LoginOrganizerPage', () => {
  let component: LoginOrganizerPage;
  let fixture: ComponentFixture<LoginOrganizerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginOrganizerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
