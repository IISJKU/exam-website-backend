module.exports = {
  routes: [
    {
      method: "GET",
      path: "/students/me",
      handler: "student.findStudentsMe",
    },
  ],
};
