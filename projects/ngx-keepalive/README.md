# Introduction

[![Build Status](https://github.com/moribvndvs/ng2-idle/workflows/ci/badge.svg)](https://github.com/moribvndvs/ng2-idle/actions?query=workflow%3Aci)
[![Coverage Status](https://coveralls.io/repos/github/moribvndvs/ng2-idle/badge.svg?branch=master)](https://coveralls.io/github/moribvndvs/ng2-idle?branch=master)

A module for responding to idle users in Angular applications. 

This package is a cloned and modified version of original  [ng2-idle module](https://github.com/moribvndvs/ng2-idle). For version of Angular < 15, see original package.

## Demo

Visit original site https://moribvndvs.github.io/ng2-idle to view a simple example with quick start instructions.

## Quick start

`@exalif/ngx-keepalive` is shipped via [npm](https://www.npmjs.com) or yarn. You can install the package using the following command for the latest supported version of Angular:

```
npm install --save @exalif/ngx-keepalive
```

Integrating and configuring the package into your application requires a few more steps. Please visit [@ng-idle-example](https://github.com/moribvndvs/ng2-idle-example.git) for source and instructions on how to get going.

## Design Considerations

The primary application of this module is to detect when users are idle. It can also be used to warn users of an impending timeout, and then time them out. The core of this module is the `Idle` service which does its best - based on your configuration - to detect when a user is active or idle and pass that information on to your application so it can respond appropriately.

### Modularization

The core functionality can be found in the `@exalif/ngx-keepalive` package via [npm](https://www.npmjs.com).

Additional modules to extend functionality:

- `@exalif/ngx-keepalive` (see below)

### Extensible Keepalive Integration

In a common use case where it is used for session management, you may need to signal to the server periodically that the user is still logged in and active. If you need that functionality, `@ng-idle` can **optionally** integrate with `@exalif/ngx-keepalive`. `@ng-idle` will instruct `@exalif/ngx-keepalive` to ping while the user is active, and stop once they go idle or time out. When the user resumes activity or the idle state is reset, it will ping immediately and then resume pinging. **Please note** that keepalive integration is optional, and you must install and configure `@exalif/ngx-keepalive` separately to get this functionality. You can implement your own by extending `KeepaliveSvc` and configuring it as a provider in your application for the `KeepaliveSvc` class.

### Extensible Interrupts

An interrupt is any source of input (typically from the user, but could be things like other tabs or an event) that can be used to signal to `Idle` that the idle watch should be interrupted or reset. Unlike `ng-idle`, these sources are not hardcoded; you can extend `InterruptSource` or any of the built-in sources to suit your purposes. This feature is also useful to handle input noise that may plague your particular use case. It can also be used to target specific elements on a page rather than the whole document or window. The following sources come built into this package:

- `InterruptSource` (abstract): A base type you can implement to make your own source.
- `EventTargetInterruptSource`: Any object that implements `EventTarget`, such as an `HTMLElement` or `Window`. Takes in the object that is the source and a space delimited string containing the events that cause an interrupt.
- `DocumentInterruptSource`: Looks for events (in a space delimited string) that bubble up to the `document.documentElement` (`html` node).
- `WindowInterruptSource`: Looks for events (in a space delimited string) that bubble up to the `Window`.
- `StorageInterruptSource`: Looks only for the `Storage` event of `Window` object. Obligatory for `LocalStorageExpiry`.

**NOTE**: You must configure source(s) yourself when you initialize the application. By default, no interrupts are configured. You can use a configuration analogous to the `ng-idle` default by importing `DEFAULT_INTERRUPTSOURCES` and passing that reference to `Idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);`.

### Extensible Expiry

Another feature ported from `ng-idle` is the ability to store an expiry value in some store where multiple tabs or windows running the same application can write to. Commonly, this store is the `localStorage`, but could be cookies or whatever you want. The purpose of this expiry and the expiry store is twofold: First, to prevent a window from not timing out if it sleeps or pauses longer than the configured timeout period. Second, it can be used so that activity in one tab or window prevents other tabs or windows in the same application from timing out.

By default, a `LocalStorageExpiry` type is provided, which will just keep track of the expiry in the localStorage. It will fulfill all purposes mentioned above. If you don't want to support multiple tabs or windows, you can use `SimpleExpiry`. In other words, `SimpleExpiry` does not coordinate last activity between tabs or windows. If you want to store the expiry value in another store, like cookies, you'll need to use or create an implementation that supports that. You can create your own by extending `IdleExpiry` or `SimpleExpiry` and configuring it as a provider for the `IdleExpiry` class.

### Multiple Idle Instance Support

The dependency injector in Angular supports a hierarchical injection strategy. This allows you to create an instance of `Idle` at whatever scope you need, and there can be more than one instance. This allows you to have two separate watches, for example, on two different elements on the page.  
If you use the default expiry (`LocalStorageExpiry`), you will need to define a name for each idle with `Idle.setIdleName('yourIdleName')`, otherwise the same key will be used in the localStorage and this feature will not work as expected.

### Example Use Case

For example, consider an email application. For increased security, the application may wish to determine when the user is inactive and log them out, giving them a chance to extend their session if they are still at the computer and just got distracted. Additionally, for even better security the server may issue the user's session a security token that expires after 5 minutes of inactivity. The user may take much more time than that to type out their email and send it. It would be frustrating to find you are logged out when you were actively using the software!

`@exalif/ngx-keepalive` can detect that the user is clicking, typing, touching, scrolling, etc. and know that the user is still active. It can work with `@exalif/ngx-keepalive` to ping the server every few minutes to keep them logged in. In this case, as long as the user is doing something, they stay logged in. If they step away from the computer, we can present a warning dialog, and then after a countdown, log them out.

## Server-Side Rendering/Universal

@exalif/ngx-keepalive uses DOM events on various targets to detect user activity. However, when using SSR/Universal Rendering the app is not always running in the browser and thus may not have access to these DOM targets, causing your app to potentially crash or throw errors as it tries to use browser globals like `document` and `window` through @ng-idle.

`EventTargetInterruptSource` and all the interrupt sources that derive from it (such as `DocumentInterruptSource`, `WindowInterruptSource`, and `StorageInterruptSource`) are designed to lazily initialize the event target listeners for compatibility with server-side rendering. The `EventTargetInterruptSource` will detect whether your app is running in the browser or on the server by using [`isPlatformServer`](https://angular.io/api/common/isPlatformServer) and will skip initialization of the event target listeners when run on the server.
