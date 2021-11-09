import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lander',
  templateUrl: './lander.component.html',
  styleUrls: ['./lander.component.scss']
})
export class LanderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  formInputFocused(e: any): void {
    const elem = e.target;
    const labelElem = elem.nextSibling;

    labelElem.classList.add('active');
  }

  formInputBlurred(e: any): void {
    const elem = e.target;
    const val = elem.value;
    const labelElem = elem.nextSibling;

    if(val.trim().length > 0) return;

    labelElem.classList.remove('active');
  }

  formKeyup(e: any): void {
    const elem = e.target;
    const dataTagID = elem.getAttribute('data-profileKey');
    elem.classList.remove('error');
    // this.formData[dataTagID] = elem.value;
  }


}
