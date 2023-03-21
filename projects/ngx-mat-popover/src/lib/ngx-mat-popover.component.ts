import { Component, Input, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { LegacyMenuPositionX as MenuPositionX, LegacyMenuPositionY as MenuPositionY, MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';

@Component({
  selector: 'ngx-mat-popover',
  template: `
    <mat-menu #popover="matMenu" [xPosition]="xPosition" [yPosition]="yPosition" class="mat-popover-container">
      <ng-template matMenuContent>
        <span mat-menu-item [disableRipple]="true" (click)="$event.stopPropagation()" class="mat-popover">
          <ng-container *ngTemplateOutlet="popoverContent"></ng-container>
        </span>
      </ng-template>
    </mat-menu>
    <div [matMenuTriggerFor]="popover">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxMatPopoverComponent {
  @Input() xPosition: MenuPositionX = 'after';
  @Input() yPosition: MenuPositionY = 'below';
  @Input() popoverContent: TemplateRef<any>;

  @ViewChild(MatMenuTrigger) private matMenuTrigger: MatMenuTrigger;

  public open(): void {
    this.matMenuTrigger.openMenu();
  }

  public close(): void {
    this.matMenuTrigger.closeMenu();
  }
}
