module.exports = {
  routes: [
    {
      method: "GET",
      path: "/tutors/me",
      handler: "tutor.findTutorsForStudent",
    },
    {
      method: "POST",
      path: "/tutors/import-excel",
      handler: "tutor.importExcel",
      config: {
        auth: false, // change to true if you want auth
        policies: [],
        middlewares: [],
      },
    },
  ],
};
