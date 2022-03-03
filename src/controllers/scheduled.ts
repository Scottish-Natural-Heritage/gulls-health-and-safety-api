import database from '../models/index.js';

const {Application} = database;

const ScheduledController = {
  getUnconfirmed: async () => {
    return Application.findAll({where: {confirmedByLicenseHolder: false, fourteenDayReminder: false}});
  },

  checkUnconfirmedAndSendReminder: async () => {
    const unconfirmed = await ScheduledController.getUnconfirmed();

    // createdAt date filter on the unconfirmed Array - easier to do here.

    for (const application of unconfirmed) {
      console.log('APPLICATION: ' + application)
      // Do what needs to be done here.

      // loop through each application and create personalisation object.

      // Send an email with magic link.

      // Update database 14DayReminder field with true.

    }
  },
};

export {ScheduledController as default};
