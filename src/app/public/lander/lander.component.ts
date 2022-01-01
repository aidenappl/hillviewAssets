import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';


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
  public selectedAction = 'checkout';
  public locationAction = 'onsite';

  constructor() { }

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
  
  async valid(step: number): Promise<any> {
    try {
      if (step === 1) {
        // Check Step 1 Validators
        const studentID = this.studentIDInput.nativeElement.value
        const assetID = this.assetIDInput.nativeElement.value

        if (studentID.length === 0) { return {valid: false, message: "missing studentID"}  }
        if (assetID.length === 0) { return {valid: false, message: "missing assetID"} }

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
      let validator = await this.valid(this.step)
      if (validator.valid) { 
        this.blurInputs();
        this.step++
        this.focusNextInput(this.step)
      } else {
        window.alert(validator.message)
        return
      }
      
    } catch (error) {
      console.error(error)
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
