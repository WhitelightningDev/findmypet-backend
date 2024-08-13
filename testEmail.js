// testEmail.js
const { sendSignupConfirmationEmail } = require('./services/mailService'); // Adjust path as needed

// Create a mock user object
const mockUser = {
  name: 'Daniel',
  surname: 'Mommsen',
  email: 'danielmommsen2@gmail.com'
};

(async () => {
  try {
    await sendSignupConfirmationEmail(mockUser);
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
})();
