import { async, TestBed } from '@angular/core/testing';

// @dynamic
export class JestUtils {
  public static createSpyObj = <T>(baseName: string, methodNames: string[]): jest.Mocked<T> => {
    return methodNames.reduce((obj, method) => {
      obj[method] = jest.fn();
      return obj;
    }, {} as any);
  }

  public static resetSpies = (...mockInstances: jest.Mocked<any>[]) => {
    mockInstances.forEach(instance => {
      JestUtils.getAllMethodNames(instance).forEach((method) => {
        instance[method].mockClear();
      });
    });
  }

  public static initJestBed = (configurationFunction) => {
    const resetTestingModule = TestBed.resetTestingModule;
    const preventAngularFromResetting = () => TestBed.resetTestingModule = () => TestBed;
    let destroyFixture = null;
    let init = false;

    beforeAll(async(() => {
      resetTestingModule();
      preventAngularFromResetting();
    }));

    beforeEach(async(() => {
      if (!init) {
        if (destroyFixture) {
          destroyFixture();
        }

        const fixture = configurationFunction();

        destroyFixture = fixture.destroy.bind(fixture);
        fixture.destroy = () => { };

        init = true;
      }
    }));

    afterAll(() => {
      if (destroyFixture) {
        destroyFixture();
      }

      resetTestingModule();
    });
  }

  public static getAllMethodNames = (instance) => {
    return new Set(Reflect.ownKeys(instance));
  }

  public static getCallsSingleArgs = (...args: any[]) => {
    const callsArgs = [];

    args.forEach(arg => {
      callsArgs.push([arg]);
    });

    return callsArgs;
  }
}
