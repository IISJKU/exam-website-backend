module.exports = {
  routes: [
    {
      method: "GET",
      path: "/exams/tutor/:tutorId",
      handler: "exam.findExamsForTutor",
      config: {
        auth: false, // Set to true if you require authentication
      },
    },
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
      handler: "exam.findExamsForStudent",
    },
  ],
};
