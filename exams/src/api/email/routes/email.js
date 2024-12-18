module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/send-email', // Endpoint for sending emails
      handler: 'email.sendEmail', // The controller function to handle the request
      config: {
        policies: [], // Add policies if needed
        middlewares: [], // Add middlewares if needed
      },
    },
  ],
};
