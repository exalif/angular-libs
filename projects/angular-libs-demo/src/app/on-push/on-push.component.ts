import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { AuthService } from '../auth.service';

import { UploadState } from 'projects/ngx-file-upload/src/lib/models/upload-state';
import { Uploader } from 'projects/ngx-file-upload/src/lib/utils/uploader';
import { UploadxOptions } from 'projects/ngx-file-upload/src/lib/models/upload-options';
import { NgxFileUploadService } from 'projects/ngx-file-upload/src/lib/ngx-file-upload.service';

@Component({
  selector: 'app-on-push',
  templateUrl: './on-push.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushComponent implements OnInit {
  public state: Observable<UploadState>;
  public uploads$: Observable<Uploader[]>;
  public options: UploadxOptions = {
    url: `${environment.api}/upload?uploadType=uploadx`,
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
