# Verafide SDK - Example Project

## Overview

This project demonstrates how the Verafide SDK can be imported and used. The App class (in index.js) contains a collection of methods that show examples (with comments) of commonly used methods in the Verafide SDK.

## Quick Start

1. Clone this project.

2. Run an `npm install`.

3. You can adjust the Environment to TEST, UAT, PROD

4. Update the login details found in the App.login method.

5. Run the index.js file with `node index.js`.

## Verafide SDK

This project imports and uses the Verafide SDK from NPM, so you can install the SDK directly from NPM like so.

```shell
npm install @verafide/sdk
```

## App Class

This App class consists of the following 4 methods;
 - `login`
 - `credentials`
 - `presentation`
 - `schemas`

These categorise the SDK methods as those found in each method are usually used together. Some SDK methods return data, that we then stored on the App class, so we can use it in other methods.

### `login`

The login method contains a single login call to authenticate via the Verafide SDK.

_Note: It is important to update this information to mirror your desired system/user details before you run the example project._

### `credentials`

The credentials method demonstrates how you can fetch your Verifiable Credentials (VCs) and how you can verify that a VC is authentic.

### `presentation`

The presentation method runs through our presentation flow. It shows how we can create a new presentation, giving us a secret token, and how we can check for when we should sign the presentation by polling. It also shows how to sign our VC, and update our presentation with that signed VC.

### `schemas`

The schemas method details how schemas and DIDs can be requested and used. It fetches the required data for a VC request and makes a request for a new VC.
