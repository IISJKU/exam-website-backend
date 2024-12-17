module.exports = {
  routes: [
    {
      method: "POST",
      path: "/exams/add-tutor",
      handler: "exam.addTutorToExam",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/exams/remove-tutor",
      handler: "exam.removeTutorFromExam",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/exams/without-tutor",
      handler: "exam.findExamsWithoutTutor",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/exams/me",
      handler: "exam.findMyExams",
    },
    {
      method: "POST",
      path: "/exams/deregister-tutor",
      handler: "exam.deregisterTutor",
    },
    {
      method: "GET",
      path: "/exams/find-registered",
      handler: "exam.findExamsWhereTutorIsRegistered",
      config: {
        policies: [],
      },
    },
  ],
};
