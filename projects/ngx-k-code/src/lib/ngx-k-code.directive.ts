import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[ngx-k-code]'
})
export class NgxKCodeDirective {
  private sequence: string[];
  private konamiCode: string[];

  @Output() private kCode: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    this.sequence = [];
    this.konamiCode = ['38', '38', '40', '40', '37', '39', '37', '39', '66', '65'];
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.keyCode) {
      this.sequence.push(event.keyCode.toString());

      if (this.sequence.length > this.konamiCode.length) {
        this.sequence.shift();
      }

      if (this.isKonamiCode()) {
        this.kCode.emit(true);
      }
    }
  }

  private isKonamiCode(): boolean {
    return this.konamiCode.every((code: string, index: number) => code === this.sequence[index]);
  }
}
