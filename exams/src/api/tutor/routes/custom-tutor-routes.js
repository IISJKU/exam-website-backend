module.exports = {
  routes: [
    {
      method: "GET",
      path: "/tutors/me",
      handler: "tutor.findTutorsForStudent",
    },
  ],
};
