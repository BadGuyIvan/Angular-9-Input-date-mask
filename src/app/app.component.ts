import { Component, ViewChild, OnInit, ElementRef, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { map, filter, take, takeWhile, tap } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>

  ngOnInit(): void {

    let mask = "__-__-____"

    const onChange = fromEvent(this.input.nativeElement, "input")

    this.input.nativeElement.value = mask

    onChange.pipe(
      map((event: any) => (
        {
          type: event.inputType,
          start: event.target.selectionStart,
          value: event.target.value,
        }
      )),
    ).subscribe(event => {
      if (event.start <= mask.length) {
        this.input.nativeElement.maxLength = event.start >= mask.length ? mask.length : mask.length + 1
        if (event.type === 'insertText') {
          if (mask[event.start - 1] !== "_") {
            let toSpecificSymbol = event.value.substr(0, event.start - 1);
            let specificSymbol = mask[event.start - 1];
            let inputValue = event.value.substr(event.start - 1, 1)
            this.input.nativeElement.value = toSpecificSymbol + specificSymbol + inputValue + event.value.substr(event.start + 2);
            this.input.nativeElement.selectionEnd = event.start + 1
          } else {
            this.input.nativeElement.value = event.value.substr(0, event.start) + event.value.substr(event.start + 1);
            this.input.nativeElement.selectionEnd = mask[event.start] !== '_' ? event.start + 1 : event.start
          }
        } else {
          if (event.type === 'deleteContentBackward' && event.value === '') {
            this.input.nativeElement.value = mask;
            this.input.nativeElement.selectionEnd = 0
          } else {
            this.input.nativeElement.value = event.value.substr(0, event.start) + mask[event.start] + event.value.substr(event.start)
            this.input.nativeElement.selectionEnd = event.start
          }
        }
      } else {
        this.input.nativeElement.value = mask;
      }
    })
  }
}
