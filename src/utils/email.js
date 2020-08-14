const sgMail = require('@sendgrid/mail');

const { MASTER_EMAIL_ID: masterEmail, SENDGRID_API_KEY: apiKey } = process.env;

sgMail.setApiKey(apiKey);

const sendWelcomeEmail = ({ email, name }) => {
  sgMail.send({
    to: email,
    from: masterEmail,
    subject: 'Thanks for joining in!',
    text: `Welcome to the Travor, ${name}. We'll try our best to make this the one and the best travel app you'll have to use. Let us know how you get along with the app!`,
  });
};

const sendBookingEmailDealer = ({ dealerEmail, customer, room, hotel }) => {
  sgMail.send({
    to: dealerEmail,
    from: masterEmail,
    subject: `You've got a new customer`,
    text: `${customer.name} (${customer.email}) booked ${room} at your hotel ${hotel}. Try your best to make it their best hotel experience ever.`,
  });
};

const sendBookingEmailUser = ({ email, name, hotel, room }) => {
  sgMail.send({
    to: email,
    from: masterEmail,
    subject: `Your booking at ${hotel} is complete!`,
    text: `Hi ${name}! The booking you had done for ${room} at ${hotel} was successfully completed!`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendBookingEmailDealer,
  sendBookingEmailUser,
};
