module.exports = {
  routes: [
    {
      method: "GET",
      path: "/notifications/me",
      handler: "notification.findNotificationsForStudent",
    },
  ],
};
