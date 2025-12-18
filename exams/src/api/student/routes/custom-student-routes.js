module.exports = {
  routes: [
    {
      method: "GET",
      path: "/students/me",
      handler: "student.findStudentsMe",
    },
    {
      method: "POST",
      path: "/students/import-excel",
      handler: "student.importExcel",
      config: {
        auth: false, // change to true if you want auth
        policies: [],
        middlewares: [],
      },
    },
  ],
};
