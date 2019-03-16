import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[routerLink]'
})
export class RouterLinkMockDirective {
  @Input('routerLink') public linkParams: any;

  public navigatedTo: any = null;

  @HostListener('click')
  public onClick(): void {
    this.navigatedTo = this.linkParams;
  }
}
