import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'translate' })
export class TranslatePipeMock implements PipeTransform {
  public transform(value: string, ...params: any[]): string {
    let translation: string = 'translated ' + value;

    if (params && params.length > 0) {
      translation += ' ' + JSON.stringify(params[0]);
    }

    return translation;
  }
}
