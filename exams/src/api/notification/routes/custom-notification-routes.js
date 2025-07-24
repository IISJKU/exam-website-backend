module.exports = {
  routes: [
    {
      method: "GET",
      path: "/notifications/me",
      handler: "notification.findMyNotifications",
    },
    {
      method: "GET",
      path: "/notifications/created-exams",
      handler: "notification.findMyCreatedExams",
      config: {
        policies: [], // Add auth policy if needed
      },
    },
  ],
};
