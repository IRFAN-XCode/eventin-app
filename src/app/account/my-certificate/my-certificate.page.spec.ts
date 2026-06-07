import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyCertificatePage } from './my-certificate.page';

describe('MyCertificatePage', () => {
  let component: MyCertificatePage;
  let fixture: ComponentFixture<MyCertificatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCertificatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
