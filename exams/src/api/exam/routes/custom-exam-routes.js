module.exports = {
    routes: [
      {
        method: "GET",
        path: "/exams/student/:studentId",
        handler: "exam.findExamsForStudent",
        config: {
          auth: false, // Set to true if you require authentication
        },
      },
    ],
  };