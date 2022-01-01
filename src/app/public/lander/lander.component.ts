import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RequestService } from 'src/services/http/request.service';


const validSelections = ['checkout', 'checkin', 'lookup'] as const;
type SelectionType = (typeof validSelections)[number];

const validLocations = ['onsite', 'offsite'] as const;
type LocationType = (typeof validLocations)[number];

@Component({
  selector: 'app-lander',
  templateUrl: './lander.component.html',
  styleUrls: ['./lander.component.scss']
})

export class LanderComponent implements OnInit, AfterViewInit {

  @ViewChild('studentID', {static: false}) studentIDInput!:ElementRef
  @ViewChild('assetID', {static: false}) assetIDInput!:ElementRef
  @ViewChild('notes', {static: false}) notesInput!:ElementRef
  @ViewChild('duration', {static: false}) duration!:ElementRef

  public step = 1;
  public selectedAction: string = "";
  public locationAction = 'onsite';

  public user: any = null;
  public asset: any = null;

  public btnValue = 'Next Step';

  constructor(
    private request: RequestService
  ) { }

  ngOnInit(): void {
    document.addEventListener('keypress', (e: any) => {
      this.logKey(e)
    });
  }

  reload(): void {
    window.location.reload()
  }

  ngAfterViewInit(): void {
    this.studentIDInput.nativeElement.focus()
  }

  logKey(e: any) {
    if(e.code === 'Backslash' && this.step > 1) {
      this.back()
    }
    if(e.code === 'Enter' && (this.step === 2 || this.step === 3)) {
      this.next()
    }
  }

  selectLocationAction (input: string): void {
    this.locationAction = input
  }

  isOfTypeActions (userInput: string): userInput is SelectionType {
    return (validSelections as readonly string[]).includes(userInput);
  }

  isOfTypeLocation (userInput: string): userInput is LocationType {
    return (validLocations as readonly string[]).includes(userInput);
  }

  focusInput(id: string): void {
    document.getElementById(id)!.focus()
  }

  async validUser(studentID: string): Promise<boolean> {
    try {
      const response: any = await this.request.get(`${environment.API_URL}/valid/userByTag/${studentID}`)
      return response.status === 200;
    } catch (error) {
      throw error;
    }
  }

  async validAsset(assetID: string): Promise<boolean> {
    try {
      const response: any = await this.request.get(`${environment.API_URL}/valid/assetByTag/${assetID}`)
      return response.status === 200;
    } catch (error) {
      throw error;
    }
  }
  
  async valid(step: number): Promise<any> {
    try {
      if (step === 1) {
        // Check Step 1 Validators
        const studentID = this.studentIDInput.nativeElement.value
        const assetID = this.assetIDInput.nativeElement.value

        if (studentID.length === 0) { return {valid: false, message: "missing studentID"}  }
        if (assetID.length === 0) { return {valid: false, message: "missing assetID"} }

        const validUser = await this.validUser(studentID);
        const validAsset = await this.validAsset(assetID);

        if (!validUser) { return {valid: false, message: "invalid studentID"}  }
        if (!validAsset) { return {valid: false, message: "invalid assetID"} }

        return {valid: true, message: ""}
      }
      if (step === 2) {
        // Check Step 2 Validators
        if (!this.isOfTypeActions(this.selectedAction)) {
          return {valid: false, message: "not a valid selected action"}
        }

        return {valid: true, message: ""}
      }
      if (step === 3) {
        // Check Step 3 Validators
        if (this.selectedAction === 'checkout' && !this.isOfTypeLocation(this.locationAction)) {
          return {valid: false, message: "not a valid selected location"}
        }
        if (this.selectedAction === 'checkout' && this.duration.nativeElement.value.length === 0) {
          return {valid: false, message: "missing duration of checkout"}
        }
        return {valid: true, message: ""}
      }
      return {valid: false, message: "invalid step"};
    } catch (error) {
      throw error
    }
  }

  async next(): Promise<void> {
    try {
      if (this.step < 3) {
        this.btnValue = "";
      }
      let validator = await this.valid(this.step)
      if (validator.valid) { 
        this.blurInputs();
        await this.dataRunners();
        this.step++
        this.focusNextInput(this.step)
        setTimeout(() => {
          if (this.step <= 2) {
            this.btnValue = "Next Step"
          } else {
            this.btnValue = "Done!"
          }
        }, 200)

      } else {
        window.alert(validator.message)
        setTimeout(() => {
          if (this.step <= 2) {
            this.btnValue = "Next Step"
          } else {
            this.btnValue = "Done!"
          }
        }, 200)
        return
      }
      
    } catch (error) {
      console.error(error)
    }
  }

  async dataRunners(): Promise<void> {
    try {
      if (this.step === 1) {
        // Step 1 Data Runners
        let user = await this.getUser()
        let asset = await this.getAsset()
        this.user = user;
        this.asset = asset;
        console.log(user, asset)
        return;
      }
    } catch (error) {
      throw error;
    }
  }

  async getUser(): Promise<any> {
    try {
      const response: any = await this.request.get(`${environment.API_URL}/read/userByTag/${this.studentIDInput.nativeElement.value}`)
      return response.body
    } catch (error) {
      throw error;
    }
  }

  async getAsset(): Promise<any> {
    try {
      const response: any = await this.request.get(`${environment.API_URL}/read/assetByTag/${this.assetIDInput.nativeElement.value}`)
      return response.body
    } catch (error) {
      throw error;
    }
  }

  focusNextInput(step: number): void {
    if (step === 3 && this.selectedAction === 'checkin') {
      this.notesInput.nativeElement.focus()
    }  
  }

  blurInputs(): void {
    let el: any = document.querySelector( ':focus' );
    if( el ) el.blur();
  }

  async back(): Promise<void> {
    this.step--
    console.log(this.step)
  }

  setSelectAction(e: any): void {
    this.selectedAction = e!.target.id
  }

}
