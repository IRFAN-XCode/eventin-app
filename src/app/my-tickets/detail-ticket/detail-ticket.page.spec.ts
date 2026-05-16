import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailTicketPage } from './detail-ticket.page';

describe('DetailTicketPage', () => {
  let component: DetailTicketPage;
  let fixture: ComponentFixture<DetailTicketPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
