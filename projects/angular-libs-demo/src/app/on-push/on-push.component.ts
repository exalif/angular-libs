import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Uploader, NgxFileUploadState, NgxFileUploadOptions, UploadxService } from '../../../../ngx-file-upload/src/public_api';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-on-push',
  templateUrl: './on-push.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushComponent implements OnInit {
  state: Observable<NgxFileUploadState>;
  uploads$: Observable<Uploader[]>;
  options: NgxFileUploadOptions = {
    url: `${environment.api}/upload?uploadType=ngx-file-upload`,
    token: 'sometoken',
    chunkSize: 1024 * 256 * 8
  };
  constructor(private uploadService: UploadxService, private auth: AuthService) { }

  ngOnInit() {
    this.state = this.uploadService.init(this.options);
    this.uploads$ = this.state.pipe(map(() => this.uploadService.queue));
  }
  cancelAll() {
    this.uploadService.control({ action: 'cancelAll' });
  }

  uploadAll() {
    this.uploadService.control({ action: 'uploadAll' });
  }

  pauseAll() {
    this.uploadService.control({ action: 'pauseAll' });
  }

  pause(uploadId: string) {
    this.uploadService.control({ action: 'pause', uploadId });
  }

  upload(uploadId: string) {
    this.uploadService.control({ action: 'upload', uploadId });
  }
}
