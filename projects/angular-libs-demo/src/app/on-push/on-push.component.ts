import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Uploader, NgxFileUploadState, NgxFileUploadOptions, NgxFileUploadService } from '../../../../ngx-file-upload/src/public-api';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-on-push',
  templateUrl: './on-push.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushComponent implements OnInit {
  public state: Observable<NgxFileUploadState>;
  public uploads$: Observable<Uploader[]>;
  public options: NgxFileUploadOptions = {
    url: `${environment.api}/upload?uploadType=ngx-file-upload`,
    token: 'sometoken',
    chunkSize: 1024 * 256 * 8
  };

  constructor(
    private uploadService: NgxFileUploadService,
    private auth: AuthService
  ) { }

  public ngOnInit(): void {
    this.state = this.uploadService.init(this.options);
    this.uploads$ = this.state.pipe(map(() => this.uploadService.queue));
  }
  public cancelAll(): void {
    this.uploadService.control({ action: 'cancelAll' });
  }

  public uploadAll(): void {
    this.uploadService.control({ action: 'uploadAll' });
  }

  public pauseAll(): void {
    this.uploadService.control({ action: 'pauseAll' });
  }

  public pause(uploadId: string): void {
    this.uploadService.control({ action: 'pause', uploadId });
  }

  public upload(uploadId: string): void {
    this.uploadService.control({ action: 'upload', uploadId });
  }
}
