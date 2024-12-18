'use strict';

module.exports = {
  async sendEmail(ctx) {
    // Extract email data from the request body
    const { to, subject, text, html } = ctx.request.body;

    // Validate input fields
    if (!to || !subject || !text) {
      return ctx.badRequest("Missing required fields: to, subject, or text.");
    }

    try {
      // Use Strapi's email plugin to send the email
      await strapi.plugin('email').service('email').send({
        to, // Recipient email
        subject, // Email subject
        text, // Plain text version of the email
        html, // HTML version of the email (optional)
      });

      // Respond with success
      ctx.send({ message: "Email sent successfully!" });
    } catch (error) {
      // Handle errors
      console.error("Error sending email:", error);
      ctx.internalServerError("Failed to send email.");
    }
  },
};
