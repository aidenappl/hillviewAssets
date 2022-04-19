import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RequestService } from 'src/services/http/request.service';
import * as dayjs from 'dayjs'
@Component({
  selector: 'app-seeker',
  templateUrl: './seeker.component.html',
  styleUrls: ['./seeker.component.scss']
})
export class SeekerComponent implements OnInit, AfterViewInit {

  @ViewChild('assetID', { static: false }) assetIDInput!: ElementRef;

  constructor(
    private request: RequestService
  ) { }

  public btnValue = 'Lookup';

  public asset: any = null;

  ngOnInit(): void {
    document.onkeydown = (e) => {
      if (e.key === 'c') {
        this.checkin()
      }
      if (e.key === 'b') {
        this.navigateToPOS()
      }
    }
  }

  ngAfterViewInit(): void {
    this.assetIDInput.nativeElement.focus();
  }

  focusInput(id: string): void {
    document.getElementById(id)!.focus();
  }

  navigateToPOS(): void {
    window.location.href = '/pos'
  }

  async lookup(): Promise<void> {
    try {
      let asset = await this.getAsset();
      let assetHistory = await this.getAssetHistory();
      asset.history = assetHistory;
      this.asset = asset
      this.assetIDInput.nativeElement.value = '';
      console.log(asset);
    } catch (error) {
      console.error(error);
    }
  }

  async getAsset(): Promise<any> {
    try {
      const response: any = await this.request.get(
        `${environment.API_URL}/read/assetByTag/${this.assetIDInput.nativeElement.value}`
      );
      return response.body;
    } catch (error) {
      throw error;
    }
  }

  async getAssetHistory(): Promise<any> {
    try {
      const response: any = await this.request.get(
        `${environment.API_URL}/read/assetCheckoutHistory?tag=${this.assetIDInput.nativeElement.value}`
      )
      if (response.body === null) {
        return {}
      }
      response.body.forEach((his: any) => {
        his.formatted = []

        if (his.time_in) {
          his.formatted.time_in = dayjs(his.time_in).format('MMM D, h:mm a');
        } else {
          his.formatted.time_in = 'Checked Out'
        }
        his.formatted.time_out = dayjs(his.time_out).format('MMM D, h:mm a');
      })
      
      return response.body;
    } catch (error) {
      throw error
    }
  }

  async checkin(): Promise<void> {
    try {
      let data: any = {
        asset_id: this.asset.id,
        user_id: this.asset.active_tab.associated_user,
      };
      data.notes = "checked in by admin";
      const response: any = await this.request.post(
        `${environment.API_URL}/checkin`,
        data
      );
      window.alert("successfully checked in");
        window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

}
