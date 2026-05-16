import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistOrganizerPage } from './regist-organizer.page';

describe('RegistOrganizerPage', () => {
  let component: RegistOrganizerPage;
  let fixture: ComponentFixture<RegistOrganizerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistOrganizerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
