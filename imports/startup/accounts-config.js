
//It seems this file MUST be located at imports/startup/accounts-config.js
//Apparently the error occurs when executed on the server, so maybe this directory
//is special within MeteorJS

import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});
