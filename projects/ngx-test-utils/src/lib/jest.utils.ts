import { async, TestBed } from '@angular/core/testing';

// @dynamic
export class JestUtils {
  public static createSpyObj = <T>(baseName: string, methodNames: string[]): jest.Mocked<T> => {
    return methodNames.reduce((obj, method) => {
      obj[method] = jest.fn();
      return obj;
    }, {} as any);
  }

  public static resetSpies = (...mockInstances: jest.Mocked<any>[]): void => {
    mockInstances.forEach(instance => {
      JestUtils.getAllMethodNames(instance).forEach((method) => {
        instance[method].mockClear();
      });
    });
  }

  public static initJestBed = (configurationFunction: Function): void => {
    const originalAngularResetTestingModule = TestBed.resetTestingModule;
    const preventAngularFromResettingTestBed = () => TestBed.resetTestingModule = () => TestBed;

    let forceDestroyFixture = null;
    let wasPreviouslyInitialized = false;

    beforeAll(async(() => {
      originalAngularResetTestingModule();
      preventAngularFromResettingTestBed();
    }));

    beforeEach(async(() => {
      if (!wasPreviouslyInitialized) {
        if (forceDestroyFixture) {
          forceDestroyFixture();
        }

        const fixture = configurationFunction();

        forceDestroyFixture = fixture.destroy.bind(fixture);

        // Make original destroy inoperative
        fixture.destroy = () => { };

        wasPreviouslyInitialized = true;
      }
    }));

    afterAll(() => {
      if (forceDestroyFixture) {
        forceDestroyFixture();
      }

      originalAngularResetTestingModule();
    });
  }

  public static getAllMethodNames = (instance: object): Set<string | number | symbol> => {
    return new Set(Reflect.ownKeys(instance));
  }

  public static getCallsSingleArgs = (...args: any[]): any[] => {
    const callsArgs = [];

    args.forEach(arg => {
      callsArgs.push([arg]);
    });

    return callsArgs;
  }
}
