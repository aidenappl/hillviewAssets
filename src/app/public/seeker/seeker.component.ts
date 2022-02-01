import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RequestService } from 'src/services/http/request.service';

@Component({
  selector: 'app-seeker',
  templateUrl: './seeker.component.html',
  styleUrls: ['./seeker.component.scss']
})
export class SeekerComponent implements OnInit {

  @ViewChild('assetID', { static: false }) assetIDInput!: ElementRef;

  constructor(
    private request: RequestService
  ) { }

  public btnValue = 'Lookup';

  public asset: any = null;

  ngOnInit(): void {
  }

  focusInput(id: string): void {
    document.getElementById(id)!.focus();
  }

  async lookup(): Promise<void> {
    try {
      let asset = await this.getAsset();
      this.asset = asset
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
