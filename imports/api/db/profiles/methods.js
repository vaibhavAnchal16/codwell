import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { ServiceConfiguration } from "meteor/service-configuration";

ServiceConfiguration.configurations.remove({
  service: "google",
});
ServiceConfiguration.configurations.insert({
  service: "google",
  clientId:
    "496426612013-5k710bse2319kfobm6qba8trcqe06ill.apps.googleusercontent.com",
  secret: "HrC-I51_NNlQgMo4cF_zGg7N",
});

Accounts.registerLoginHandler("google", (params) => {
  const data = params.google;
  // If this isn't facebook login then we don't care about it. No need to proceed.
  if (!data) {
    return undefined;
  }
  // The fields we care about (same as Meteor's)
  const whitelisted = ["id", "email", "name", "picture"];
  // Build our actual data object.
  const serviceData = {
    accessToken: data.accessToken,
  };
  const fields = Object.assign({}, serviceData, data.user);
  // Search for an existing user with that facebook id
  const existingUser = Meteor.users.findOne({
    "services.google.id": data.user.id,
  });
  let userId;
  if (existingUser) {
    userId = existingUser._id;
    // Update our data to be in line with the latest from Facebook
    const prefixedData = {};
    _.each(fields, (val, key) => {
      prefixedData[`services.google.${key}`] = val;
    });
    Meteor.users.update(
      { _id: userId },
      {
        $set: prefixedData,
        $addToSet: { emails: { address: data.user.email, verified: true } },
      }
    );
    Profiles.insert({
      userId: userId,
      email: data.user.email,
    });
  } else {
    // Create our user
    userId = Meteor.users.insert({
      services: {
        google: fields,
      },
      profile: { name: data.user.name },
      emails: [
        {
          address: data.user.email,
          verified: true,
        },
      ],
    });
    Profiles.insert({
      userId: userId,
      email: data.user.email,
    });
  }
  return { userId: userId };
});
