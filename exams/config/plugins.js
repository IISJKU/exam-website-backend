module.exports = ({ env }) => ({
    email: {
      config: {
        provider: "nodemailer", // Use nodemailer for SMTP
        providerOptions: {
          host: env("SMTP_HOST"), // Default to your SMTP host
          port: env.int("SMTP_PORT"), // Port 25 for non-secure connections
          secure: env.bool("SMTP_SECURE"), // False since it's not using TLS
          auth: env("SMTP_USERNAME") 
            ? { user: env("SMTP_USERNAME") } 
            : undefined, // Only add auth if a username is provided
        },
        settings: {
          defaultFrom: "pruefung-integriert-studieren@jku.at", // Sender email
          defaultReplyTo: "pruefung-integriert-studieren@jku.at", // Reply-to email
        },
      },
    },
  });
  