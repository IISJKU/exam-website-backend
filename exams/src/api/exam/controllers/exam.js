"use strict";

/**
 * exam controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const Excel = require("exceljs");

module.exports = createCoreController("api::exam.exam", ({ strapi }) => ({
  // Override the default find method
  async find(ctx) {
    ctx.query.populate = {
      // @ts-ignore
      student: {
        fields: [
          "matrikel_number",
          "misc",
          "first_name",
          "last_name",
          "bonus_time",
        ],
        populate: {
          major: {
            fields: ["name"],
          },
          user: {
            fields: ["email"],
          },
        },
      },
      tutor: {
        fields: ["first_name", "last_name"],
        populate: {
          user: {
            fields: ["email"],
          },
        },
      },
      examiner: { fields: ["first_name", "last_name"] },
      exam_mode: { fields: ["name"] },
      institute: { fields: ["name", "abbreviation"] },
      room: { fields: ["name"] },
      registeredTutors: {
        // Directly populate the registeredTutors field
        fields: ["id", "first_name", "last_name"], // Specify the fields to include
      },
    };

    const { data } = await super.find(ctx);

    const embedIdInAttributes = (entry) => {
      if (!entry) return null; // Return null if the entry is null
      return { id: entry.id, ...entry.attributes };
    };

    const newData = data.map((entry) => ({
      id: entry.id,
      ...entry.attributes,
      tutor:
        entry.attributes.tutor && entry.attributes.tutor.data
          ? embedIdInAttributes(entry.attributes.tutor.data)
          : null,
      registeredTutors:
        entry.attributes.registeredTutors &&
        entry.attributes.registeredTutors.data
          ? entry.attributes.registeredTutors.data.map((tutor) =>
              embedIdInAttributes(tutor)
            )
          : [],
      student:
        entry.attributes.student && entry.attributes.student.data
          ? embedIdInAttributes(entry.attributes.student.data)
          : null,
      examiner:
        entry.attributes.examiner && entry.attributes.examiner.data
          ? embedIdInAttributes(entry.attributes.examiner.data)
          : null,
      exam_mode:
        entry.attributes.exam_mode && entry.attributes.exam_mode.data
          ? embedIdInAttributes(entry.attributes.exam_mode.data)
          : null,
      institute:
        entry.attributes.institute && entry.attributes.institute.data
          ? embedIdInAttributes(entry.attributes.institute.data)
          : null,
      student_misc:
        entry.attributes.student && entry.attributes.student.data
          ? entry.attributes.student.data.attributes.misc
          : null,
      major:
        entry.attributes.student &&
        entry.attributes.student.data &&
        entry.attributes.student.data.attributes.major.data
          ? embedIdInAttributes(
              entry.attributes.student.data.attributes.major.data
            )
          : null,
      room:
        entry.attributes.room && entry.attributes.room.data
          ? embedIdInAttributes(entry.attributes.room.data)
          : null,
      tutor_id:
        entry.attributes.tutor && entry.attributes.tutor.data
          ? entry.attributes.tutor.data.id
          : null,
      student_id:
        entry.attributes.student && entry.attributes.student.data
          ? entry.attributes.student.data.id
          : null,
      examiner_id:
        entry.attributes.examiner && entry.attributes.examiner.data
          ? entry.attributes.examiner.data.id
          : null,
      major_id:
        entry.attributes.student &&
        entry.attributes.student.data &&
        entry.attributes.student.data.attributes.major.data
          ? entry.attributes.student.data.attributes.major.data.id
          : null,
      student_email:
        entry.attributes.student &&
        entry.attributes.student.data &&
        entry.attributes.student.data.attributes.user &&
        entry.attributes.student.data.attributes.user.data
          ? entry.attributes.student.data.attributes.user.data.attributes.email
          : null,
      tutor_email:
        entry.attributes.tutor &&
        entry.attributes.tutor.data &&
        entry.attributes.tutor.data.attributes.user &&
        entry.attributes.tutor.data.attributes.user.data
          ? entry.attributes.tutor.data.attributes.user.data.attributes.email
          : null,
      institute_id:
        entry.attributes.institute && entry.attributes.institute.data
          ? entry.attributes.institute.data.id
          : null,
      mode_id:
        entry.attributes.exam_mode && entry.attributes.exam_mode.data
          ? entry.attributes.exam_mode.data.id
          : null,
      room_id:
        entry.attributes.room && entry.attributes.room.data
          ? entry.attributes.room.data.id
          : null,
    }));

    return newData;
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    ctx.query.populate = {
      // @ts-ignore
      student: {
        fields: [
          "matrikel_number",
          "misc",
          "first_name",
          "last_name",
          "bonus_time",
        ],
        populate: {
          major: {
            fields: ["name"],
          },
          user: {
            fields: ["email"],
          },
        },
      },
      tutor: {
        fields: ["first_name", "last_name"],
        populate: {
          user: {
            fields: ["email"],
          },
        },
      },
      examiner: { fields: ["first_name", "last_name"] },
      exam_mode: { fields: ["name"] },
      institute: { fields: ["name", "abbreviation"] },
      room: { fields: ["name"] },
      registeredTutors: {
        // Directly populate the registeredTutors field
        fields: ["id", "first_name", "last_name"], // Specify the fields to include
      },
    };

    const { data } = await super.findOne(ctx);

    const embedIdInAttributes = (entry) => {
      if (!entry) return null; // Return null if the entry is null
      return { id: entry.id, ...entry.attributes };
    };

    const newData = {
      id: data.id,
      ...data.attributes,
      tutor:
        data.attributes.tutor && data.attributes.tutor.data
          ? embedIdInAttributes(data.attributes.tutor.data)
          : null,
      student:
        data.attributes.student && data.attributes.student.data
          ? embedIdInAttributes(data.attributes.student.data)
          : null,
      examiner:
        data.attributes.examiner && data.attributes.examiner.data
          ? embedIdInAttributes(data.attributes.examiner.data)
          : null,
      exam_mode:
        data.attributes.exam_mode && data.attributes.exam_mode.data
          ? embedIdInAttributes(data.attributes.exam_mode.data)
          : null,
      institute:
        data.attributes.institute && data.attributes.institute.data
          ? embedIdInAttributes(data.attributes.institute.data)
          : null,
      student_misc:
        data.attributes.student && data.attributes.student.data
          ? data.attributes.student.data.attributes.misc
          : null,
      major:
        data.attributes.student &&
        data.attributes.student.data &&
        data.attributes.student.data.attributes.major.data
          ? embedIdInAttributes(
              data.attributes.student.data.attributes.major.data
            )
          : null,
      room:
        data.attributes.room && data.attributes.room.data
          ? embedIdInAttributes(data.attributes.room.data)
          : null,
      tutor_id:
        data.attributes.tutor && data.attributes.tutor.data
          ? data.attributes.tutor.data.id
          : null,
      student_id:
        data.attributes.student && data.attributes.student.data
          ? data.attributes.student.data.id
          : null,
      examiner_id:
        data.attributes.examiner && data.attributes.examiner.data
          ? data.attributes.examiner.data.id
          : null,
      major_id:
        data.attributes.student &&
        data.attributes.student.data &&
        data.attributes.student.data.attributes.major.data
          ? data.attributes.student.data.attributes.major.data.id
          : null,
      student_email:
        data.attributes.student &&
        data.attributes.student.data &&
        data.attributes.student.data.attributes.user &&
        data.attributes.student.data.attributes.user.data
          ? data.attributes.student.data.attributes.user.data.attributes.email
          : null,
      tutor_email:
        data.attributes.tutor &&
        data.attributes.tutor.data &&
        data.attributes.tutor.data.attributes.user &&
        data.attributes.tutor.data.attributes.user.data
          ? data.attributes.tutor.data.attributes.user.data.attributes.email
          : null,
      institute_id:
        data.attributes.institute && data.attributes.institute.data
          ? data.attributes.institute.data.id
          : null,
      mode_id:
        data.attributes.exam_mode && data.attributes.exam_mode.data
          ? data.attributes.exam_mode.data.id
          : null,
      room_id:
        data.attributes.room && data.attributes.room.data
          ? data.attributes.room.data.id
          : null,
      registeredTutors:
        data.attributes.registeredTutors &&
        data.attributes.registeredTutors.data
          ? data.attributes.registeredTutors.data.map((tutor) =>
              embedIdInAttributes(tutor)
            )
          : [],
    };

    return newData;
  },

  // Override the default update method
  async update(ctx) {
    const { id } = ctx.params; // Assuming the ID of the entity to fetch is provided in the URL

    ctx.query.populate = {
      // @ts-ignore
      student: {
        fields: [
          "matrikel_number",
          "misc",
          "first_name",
          "last_name",
          "bonus_time",
        ],
        populate: {
          major: {
            fields: ["name"], // Specify the major fields to populate
          },
          user: {
            fields: ["email"],
          },
        },
      },
      tutor: {
        fields: ["first_name", "last_name"],
        populate: {
          user: {
            fields: ["email"],
          },
        },
      },
      examiner: {
        fields: ["first_name", "last_name"],
      },
      exam_mode: {
        fields: ["name"],
      },
      institute: {
        fields: ["name", "abbreviation"],
      },
      room: {
        fields: ["name"],
      },
    };

    // Helper function to extract only values from an object
    const extractValues = (obj) => Object.values(obj);

    // Call the default update to get the entity by ID
    const { data } = await super.update(ctx);

    // Helper function to embed 'id' in 'attributes' of related items
    const embedIdInAttributes = (entry) => ({
      // id: entry.id,
      //attributes: {
      id: entry.id, // Embed the 'id' into 'attributes'
      ...entry.attributes,
      //},
    });

    const newData = {
      // attributes: {
      id: data.id, // Embed the main entity's id into its attributes
      ...data.attributes,
      tutor:
        data.attributes.tutor && data.attributes.tutor.data
          ? embedIdInAttributes(data.attributes.tutor.data)
          : null,
      student:
        data.attributes.student && data.attributes.student.data
          ? embedIdInAttributes(data.attributes.student.data)
          : null,
      examiner:
        data.attributes.examiner && data.attributes.examiner.data
          ? embedIdInAttributes(data.attributes.examiner.data)
          : null,
      exam_mode:
        data.attributes.exam_mode && data.attributes.exam_mode.data
          ? embedIdInAttributes(data.attributes.exam_mode.data)
          : null,
      institute:
        data.attributes.institute && data.attributes.institute.data
          ? embedIdInAttributes(data.attributes.institute.data)
          : null,
      student_misc:
        data.attributes.student && data.attributes.student.data
          ? data.attributes.student.data.attributes.misc
          : null,
      major:
        data.attributes.student &&
        data.attributes.student.data &&
        data.attributes.student.data.attributes.major.data
          ? embedIdInAttributes(
              data.attributes.student.data.attributes.major.data
            )
          : null,
      room:
        data.attributes.room && data.attributes.room.data
          ? embedIdInAttributes(data.attributes.room.data)
          : null,
      tutor_id:
        data.attributes.tutor && data.attributes.tutor.data
          ? data.attributes.tutor.data.id
          : null,
      student_id:
        data.attributes.student && data.attributes.student.data
          ? data.attributes.student.data.id
          : null,
      examiner_id:
        data.attributes.examiner && data.attributes.examiner.data
          ? data.attributes.examiner.data.id
          : null,
      major_id:
        data.attributes.student &&
        data.attributes.student.data &&
        data.attributes.student.data.attributes.major.data
          ? data.attributes.student.data.attributes.major.data.id
          : null,
      student_email:
        data.attributes.student &&
        data.attributes.student.data &&
        data.attributes.student.data.attributes.user &&
        data.attributes.student.data.attributes.user.data
          ? data.attributes.student.data.attributes.user.data.attributes.email
          : null,
      tutor_email:
        data.attributes.tutor &&
        data.attributes.tutor.data &&
        data.attributes.tutor.data.attributes.user &&
        data.attributes.tutor.data.attributes.user.data
          ? data.attributes.tutor.data.attributes.user.data.attributes.email
          : null,
      institute_id:
        data.attributes.institute && data.attributes.institute.data
          ? data.attributes.institute.data.id
          : null,
      mode_id:
        data.attributes.exam_mode && data.attributes.exam_mode.data
          ? data.attributes.exam_mode.data.id
          : null,
      room_id:
        data.attributes.room && data.attributes.room.data
          ? data.attributes.room.data.id
          : null,
      //  },
    };

    return newData;
  },

  // Custom method to fetch exams where the tutor is in registeredTutors
  async findExamsWhereTutorIsRegistered(ctx) {
    const { user } = ctx.state; // Extract the logged-in user
    const userId = user?.id;

    try {
      const exams = await strapi.entityService.findMany("api::exam.exam", {
        filters: {
          registeredTutors: {
            //@ts-ignore
            user: {
              id: { $eq: userId }, // Match tutor.user.id with userId
            },
          },
        },
        populate: {
          registeredTutors: { fields: ["id", "first_name", "last_name"] },
          tutor: { fields: ["id", "first_name", "last_name"] },
          student: {
            fields: ["matrikel_number", "first_name", "last_name"],
            populate: { major: { fields: ["name"] } },
          },
          examiner: {
            fields: ["first_name", "last_name"],
          },
          exam_mode: {
            fields: ["name"],
          },
          institute: {
            fields: ["name", "abbreviation"],
          },
          room: {
            fields: ["name"],
          },
        },
      });

      return exams;
    } catch (error) {
      console.error("Error fetching exams:", error);
      return ctx.internalServerError("An error occurred while fetching exams");
    }
  },

  async findMyExams(ctx) {
    const userId = ctx.state.user.id;
    let apiContentType = "";

    if (ctx.state.user.role.type == "student") {
      apiContentType = "api::student.student";
    } else if (ctx.state.user.role.type == "tutor") {
      apiContentType = "api::tutor.tutor";
    }

    //@ts-ignore
    const entries = await strapi.entityService.findMany(apiContentType, {
      filters: {
        user: { id: userId },
      },
      fields: ["id"], // Retrieve only the exam IDs
    });

    // @ts-ignore
    let entriesId = entries[0].id;

    let filter = {
      student: { id: entriesId },
    };

    if (ctx.state.user.role.type == "tutor") {
      //@ts-ignore
      filter = {
        tutor: { id: entriesId },
      };
    }

    // Use the correct filter syntax for a relational field
    const exams = await strapi.entityService.findMany("api::exam.exam", {
      filters: filter,
      populate: {
        student: {
          fields: [
            "matrikel_number",
            "misc",
            "first_name",
            "last_name",
            "bonus_time",
          ],
          populate: {
            major: {
              fields: ["name"], // Populate fields as needed
            },
            user: {
              fields: ["email"],
            },
          },
        },
        tutor: {
          fields: ["first_name", "last_name"],
          populate: {
            user: {
              fields: ["email"],
            },
          },
        },
        examiner: { fields: ["first_name", "last_name"] },
        exam_mode: { fields: ["name"] },
        institute: { fields: ["name", "abbreviation"] },
        room: { fields: ["name"] },
      },
    });

    return exams;
  },

  // Add a tutor to an exam
  async addTutorToExam(ctx) {
    // Extract examId and tutorId from request body and ensure they are numbers
    //@ts-ignore
    let { examId } = ctx.request.body;
    const { user } = ctx.state; // Extract the logged-in user
    const userId = user?.id;

    const tutors = await strapi.entityService.findMany("api::tutor.tutor", {
      filters: {
        user: { id: userId },
      },
    });
    let tutorId = tutors[0].id;

    // Convert examId to a number in case it's passed as a string
    examId = Number(examId);

    // Validate the presence of examId and tutorId
    if (!examId || isNaN(examId) || !tutorId) {
      return ctx.badRequest("Missing or invalid exam ID or tutor ID");
    }

    // Fetch the current registeredTutors to append the new tutor
    const existingExam = await strapi.entityService.findOne(
      "api::exam.exam",
      examId,
      {
        populate: {
          registeredTutors: { fields: ["id"] },
        },
      }
    );

    // Check if the exam exists
    if (!existingExam) {
      return ctx.notFound("Exam not found");
    }

    // Extract the current list of tutor IDs and append the new tutorId
    const existingTutors = existingExam.registeredTutors
      ? existingExam.registeredTutors.map((tutor) => tutor.id)
      : [];

    if (existingTutors.includes(tutorId)) {
      return ctx.badRequest("Tutor already registered for this exam");
    }

    const updatedTutors = [...existingTutors, tutorId];

    // Update the exam with the new list of registered tutors
    const updatedExam = await strapi.entityService.update(
      "api::exam.exam",
      examId,
      {
        data: {
          registeredTutors: updatedTutors,
        },
        populate: {
          student: {
            fields: [
              "matrikel_number",
              "misc",
              "first_name",
              "last_name",
              "bonus_time",
            ],
            populate: {
              major: { fields: ["name"] },
              user: {
                fields: ["email"],
              },
            },
          },
          tutor: {
            fields: ["first_name", "last_name"],
            populate: {
              user: {
                fields: ["email"],
              },
            },
          },
          examiner: { fields: ["first_name", "last_name"] },
          exam_mode: { fields: ["name"] },
          institute: { fields: ["name", "abbreviation"] },
          room: { fields: ["name"] },
          registeredTutors: { fields: ["id", "first_name", "last_name"] },
        },
      }
    );

    return updatedExam;
  },

  // Custom method to fetch all tutors and print all fields
  async printAllTutors(ctx) {
    try {
      const allTutors = await strapi.entityService.findMany(
        "api::tutor.tutor",
        {
          populate: "*", // Fetch all relations and fields
        }
      );

      // Return the data (optional)
      return allTutors;
    } catch (error) {
      console.error("Error fetching tutors:", error);
      return ctx.internalServerError("An error occurred while fetching tutors");
    }
  },

  // Custom method to find exams where the user has not registered yet
  async findExamsWithoutTutor(ctx) {
    const { user } = ctx.state; // Extract the authenticated user from the context
    const userId = user?.id; // Get the user's ID

    // Validate if the user is authenticated
    if (!userId) {
      return ctx.badRequest("User is not authenticated");
    }

    const examsWithoutUser = await strapi.entityService.findMany(
      "api::exam.exam",
      {
        filters: {
          //@ts-ignore
          tutor: { $null: true }, // Exams where the tutor is not assigned
          $or: [
            { registeredTutors: { user: { id: { $ne: userId } } } }, // Exams where user is NOT in registeredTutors
            //@ts-ignore
            { registeredTutors: { $null: true } }, // Exams where registeredTutors is empty
          ],
        },
        populate: {
          student: {
            fields: [
              "matrikel_number",
              "misc",
              "first_name",
              "last_name",
              "bonus_time",
            ],
            populate: {
              major: {
                fields: ["name"],
              },
              user: {
                fields: ["email"],
              },
            },
          },
          examiner: { fields: ["first_name", "last_name"] },
          exam_mode: { fields: ["name"] },
          institute: { fields: ["name", "abbreviation"] },
          room: { fields: ["name"] },
          registeredTutors: { fields: ["id", "first_name", "last_name"] },
        },
      }
    );

    return examsWithoutUser;
  },
  // Remove a tutor from an exam
  async removeTutorFromExam(ctx) {
    // Extract examId from request body
    // @ts-ignore
    const { examId } = ctx.request.body;

    if (!examId) {
      return ctx.badRequest("Missing exam ID");
    }

    // Update the exam, setting tutor field to null
    const updatedExam = await strapi.entityService.update(
      "api::exam.exam",
      examId,
      {
        data: {
          tutor: null, // Remove the tutor association
        },
        populate: {
          student: {
            fields: [
              "matrikel_number",
              "misc",
              "first_name",
              "last_name",
              "bonus_time",
            ],
            populate: {
              major: {
                fields: ["name"],
              },
              user: {
                fields: ["email"],
              },
            },
          },
          tutor: {
            fields: ["first_name", "last_name"],
            populate: {
              user: {
                fields: ["email"],
              },
            },
          },
          examiner: { fields: ["first_name", "last_name"] },
          exam_mode: { fields: ["name"] },
          institute: { fields: ["name", "abbreviation"] },
          room: { fields: ["name"] },
        },
      }
    );

    // Check if updatedExam is null
    if (!updatedExam) {
      return ctx.notFound("Exam not found");
    }

    return updatedExam;
  },

  async deregisterTutor(ctx) {
    // Extract examId from request body
    // @ts-ignore
    const { examId } = ctx.request.body;
    const { user } = ctx.state; // Extract the logged-in user
    const userId = user?.id;

    if (!examId) {
      return ctx.badRequest("Missing exam ID");
    }

    const ex = await strapi.entityService.findOne("api::exam.exam", examId, {
      populate: {
        registeredTutors: { fields: ["first_name", "last_name", "id"] },
      },
    });
    const tutors = await strapi.entityService.findMany("api::tutor.tutor", {
      filters: {
        user: { id: userId },
      },
    });

    let newTutors = [];

    //@ts-ignore
    let regTut = ex.registeredTutors;
    if (tutors.length == 1) {
      regTut.forEach((el) => {
        if (el.id != tutors[0].id) {
          newTutors.push(el);
        }
      });
    }

    const updatedExam = await strapi.entityService.update(
      "api::exam.exam",
      examId,
      {
        data: {
          registeredTutors: newTutors,
        },
        populate: {
          student: {
            fields: [
              "matrikel_number",
              "misc",
              "first_name",
              "last_name",
              "bonus_time",
            ],
            populate: {
              major: { fields: ["name"] },
            },
          },
          tutor: { fields: ["first_name", "last_name"] },
          examiner: { fields: ["first_name", "last_name"] },
          exam_mode: { fields: ["name"] },
          institute: { fields: ["name", "abbreviation"] },
          room: { fields: ["name"] },
        },
      }
    );

    // Check if updatedExam is null
    if (!updatedExam) {
      return ctx.notFound("Exam not found");
    }

    return updatedExam;
  },

  async importExcel(ctx) {
    try {
      const req = ctx.request;
      const files = req.files;
      const uploaded = files?.file;

      if (!uploaded) {
        return ctx.badRequest('No file uploaded. Expecting form field "file".');
      }

      const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
      const filePath = file.filepath || file.path;

      if (!filePath) {
        return ctx.badRequest("Couldn't resolve uploaded file path.");
      }

      // ----- PRELOAD STUDENTS (for matching) -----
      const allStudents = await strapi.entityService.findMany(
        "api::student.student",
        {
          fields: ["id", "matrikel_number", "first_name", "last_name"],
          limit: 10000,
        }
      );

      const studentByMatrikel = {};
      const studentByName = {};

      allStudents.forEach((s) => {
        if (s.matrikel_number) {
          const key = String(s.matrikel_number).trim();
          studentByMatrikel[key] = s.id;
        }
        if (s.first_name && s.last_name) {
          const nameKey = (s.first_name + " " + s.last_name)
            .toLowerCase()
            .trim();
          studentByName[nameKey] = s.id;
        }
      });

      // ----- PRELOAD STUDENTS (for matching) -----
      const allTutors = await strapi.entityService.findMany(
        "api::tutor.tutor",
        {
          fields: ["id", "phone", "first_name", "last_name"],
          limit: 10000,
        }
      );

      const tutorByName = {};
      const tutorByPhone = {};

      allTutors.forEach((s) => {
        if (s.phone) {
          const key = String(s.phone).trim();
          tutorByPhone[key] = s.id;
        }
        if (s.first_name && s.last_name) {
          const nameKey = (s.first_name + " " + s.last_name)
            .toLowerCase()
            .trim();
          tutorByName[nameKey] = s.id;
        }
      });

      // ----- Examiners -----
      const examiners = {};

      const allExaminers = await strapi.entityService.findMany(
        "api::examiner.examiner",
        {
          fields: ["id", "first_name", "last_name"],
          limit: 10000,
        }
      );

      allExaminers.forEach((s) => {
        if (s.first_name && s.last_name) {
          const nameKey = (s.first_name + " " + s.last_name)
            .toLowerCase()
            .trim();
          examiners[nameKey] = s.id;
        }
      });

      // ----- Mode map -----
      const modeMap = {};
      const allModes = await strapi.entityService.findMany(
        "api::exam-mode.exam-mode",
        {
          fields: ["id", "name"],
          limit: 1000,
        }
      );

      allModes.forEach((entr) => (modeMap[entr.name?.toLowerCase()] = entr.id));

      console.log(modeMap);

      // ----- Location map -----
      const allRooms = await strapi.entityService.findMany("api::room.room", {
        fields: ["id", "name"],
        limit: 1000,
      });
      const roomMap = {};
      allRooms.forEach((room) => (roomMap[room.name?.toLowerCase()] = room.id));

      console.log(roomMap);

      const workbook = new Excel.Workbook();
      await workbook.xlsx.readFile(filePath);

      // you were using sheet index 2 before, keep that:
      const sheet = workbook.worksheets[1];
      if (!sheet) {
        return ctx.badRequest("Excel has no sheet at index 1");
      }

      const headerRow = sheet.getRow(1);
      const headers = headerRow.values;

      const createdExams = [];
      const updatedExams = [];
      const skippedRows = [];

      for (let rowNumber = 2; rowNumber <= sheet.actualRowCount; rowNumber++) {
        const row = sheet.getRow(rowNumber);

        // skip fully empty rows
        if (
          !row ||
          row.values.filter((v) => v !== null && v !== undefined && v !== "")
            .length === 0
        ) {
          continue;
        }

        // Build a plain row object from headers
        const rowObj = {};
        headers.forEach((header, colIndex) => {
          if (typeof header === "string" && header.trim() !== "") {
            const cell = row.getCell(colIndex);
            let value = cell.value;

            if (value && typeof value === "object" && "text" in value) {
              value = value.text;
            }

            rowObj[header] = value;
          }
        });

        if (rowObj["LVA-Titel"] == null) break;

        // break condition (as you had)

        /*
          if (
            !(
              (rowObj["Vorname"] == "Außenstandorte" ||
                rowObj["Vorname"] ==
                  "Freie Dienstnehmer bzw. besondere Regelungen") &&
              (!rowObj["Familienname"] || rowObj["Familienname"] == "")
            )
          )
            continue; */

        // Row color from first cell
        let color = null;
        const firstCell = row.getCell(1);
        if (firstCell.fill?.fgColor) {
          const fg = firstCell.fill.fgColor;
          color = fg.argb || fg.theme || null;
        }

        if (color == "1" || color == 1) {
          //continue;
        }

        //match student

        // ------------- STUDENT MATCHING -------------
        // assume Excel has:
        //   "Matrikel Nr."      -> matrikel number
        //   "Studierende"       -> "FirstName LastName"

        let rawStudentField = rowObj["KandidatIn"];

        let studentId = null;

        if (rawStudentField && rawStudentField != "") {
          let studentNameRaw = rawStudentField.split(" (")[0].trim();

          let matrikelRaw = "";

          if (rawStudentField.split(" (")[1]) {
            matrikelRaw = rawStudentField.split(" (")[1].replaceAll(")", "");
          }

          // 1) try by matrikel number
          if (matrikelRaw) {
            const matrikelKey = String(matrikelRaw).trim();
            studentId = studentByMatrikel[matrikelKey] || null;
          }

          // 2) if no matrikel match, try by first + last name
          if (!studentId && studentNameRaw) {
            const nameStr = String(studentNameRaw).trim();
            const parts = nameStr.split(/\s+/);
            let firstNameGuess = "";
            let lastNameGuess = "";

            if (parts.length === 1) {
              lastNameGuess = parts[0];
            } else if (parts.length > 1) {
              lastNameGuess = parts[parts.length - 1];
              firstNameGuess = parts.slice(0, -1).join(" ");
            }

            const nameKey = (firstNameGuess + " " + lastNameGuess)
              .toLowerCase()
              .trim();
            if (nameKey) {
              studentId = studentByName[nameKey] || null;
            }
            //maybe its upsidedown
            if (!studentId || studentId == null)
              studentId =
                studentByName[
                  (lastNameGuess + " " + firstNameGuess).toLowerCase().trim()
                ] || null;
          }

          // If still no match, skip this exam
          if (!studentId) {
            const nameStr = String(studentNameRaw).trim();
            const parts = nameStr.split(/\s+/);
            let firstNameGuess = "";
            let lastNameGuess = "";

            if (parts.length === 1) {
              lastNameGuess = parts[0];
            } else if (parts.length > 1) {
              lastNameGuess = parts[parts.length - 1];
              firstNameGuess = parts.slice(0, -1).join(" ");
            }

            // if no matrikel present, generate a temporary one
            let matrikelKey = "";
            if (matrikelRaw) {
              matrikelKey = String(matrikelRaw).trim();

              if (!matrikelKey || matrikelKey == "") {
                matrikelKey = `TEMP-${rowNumber}-${Date.now()}`;
              }

              const studentData = {
                first_name: firstNameGuess,
                last_name: lastNameGuess,
                matrikel_number: matrikelKey,
              };

              const newStudent = await strapi.entityService.create(
                "api::student.student",
                { data: studentData }
              );

              studentId = newStudent.id;

              // update maps so later rows can reuse
              studentByMatrikel[matrikelKey] = studentId;
              const nameKey = (
                firstNameGuess.trim() +
                "|" +
                lastNameGuess.trim()
              ).toLowerCase();
              studentByName[nameKey] = studentId;
            }
          }
        }

        //////////////////////////////////
        // examiner stuff

        let profId;

        if (
          rowObj["ProfIn"] &&
          rowObj["ProfIn"] != "" &&
          typeof rowObj["ProfIn"] == "string"
        ) {
          let prof = rowObj["ProfIn"].normalize("NFC");

          let seperators = [",", ";", "/", "("];

          seperators.forEach((s) => {
            if (prof.includes(s)) {
              prof = prof.substring(0, prof.indexOf(s));
            }
          });

          let replaceWords = [
            "Dr",
            "Dr.",
            "Frau",
            "Univ.-Prof.",
            "Herr",
            "Fr",
            "Fr.",
            "Hr",
            "Prof.",
            "Profin.",
            "Prof.in",
          ];
          replaceWords.forEach((w) => {
            prof = prof.replaceAll(w + " ", "");
          });

          prof = prof.trim();

          if (examiners[prof.toLowerCase()]) {
            profId = examiners[prof.toLowerCase()];
          }

          if (isNaN(profId) || !profId) {
            let names = prof.split(" ");
            let pFirstName = "";
            let pLastName = "";

            if (names.length == 1) pLastName = names[0];
            if (names.length > 1) {
              pFirstName = names[0];

              for (var i = 1; i < names.length; i++) {
                if (i == 1) pLastName = names[i];
                else pLastName = pLastName + " " + names[i];
              }

              pLastName.trim();
            }

            const profData = {
              first_name: pFirstName,
              last_name: pLastName,
            };

            const newProf = await strapi.entityService.create(
              "api::examiner.examiner",
              { data: profData }
            );

            examiners[(pFirstName + " " + pLastName).toLowerCase()] =
              newProf.id;

            profId = newProf.id;
          }
        }

        //////////////////////////////////
        //format examthings
        let title = rowObj["LVA-Titel"];
        console.log(rowObj);
        if (title["richText"] && title["richText"] != "") {
          title = title["richText"][0]["text"];
        }
        let notes = rowObj["Status"];
        let dur = Number(rowObj["Dauer (min)"]);
        if (isNaN(dur)) dur = 0;
        let date = rowObj["Datum"];

        if (date) {
          date = new Date(date);
          if (rowObj["Startzeit"]) {
            const excelDate = new Date(rowObj["Startzeit"]);

            const hours = excelDate.getUTCHours();
            const minutes = excelDate.getUTCMinutes();
            const seconds = excelDate.getUTCSeconds();

            date = date.setHours(hours, minutes, seconds);
          }

          date = new Date(date);
        } else {
          date = new Date(null);
        }

        let rawMode = rowObj["Raum/Ort/Prüfungsart"];
        let mode;
        let room;

        if (rawMode && rawMode != "") {
          rawMode = rawMode.toLowerCase();

          //console.log(rawMode + " i go here");
          if (
            rawMode.includes("hf1") ||
            rawMode.includes("präsenz") ||
            rawMode.includes("regulär") ||
            rawMode.includes("linz") ||
            rawMode.includes("wien") ||
            rawMode.includes("bregenz")
          ) {
            mode = modeMap["present"];
          }

          if (rawMode.includes("moodle")) {
            mode = modeMap["moodle"];
          }

          if (
            rawMode.includes("online") ||
            rawMode.includes("zuhause") ||
            rawMode.includes("zoom")
          ) {
            mode = modeMap["online"];
          }

          if (rawMode.includes("hf135") || rawMode.includes("hf 135"))
            room = roomMap["hf 135"];
          if (rawMode.includes("hf104") || rawMode.includes("hf 104"))
            room = roomMap["hf 104"];
          if (rawMode.includes("hf134") || rawMode.includes("hf 134"))
            room = roomMap["hf 134"];
        }

        let lvaNum = rowObj["LVA-NR"];
        if (lvaNum && lvaNum != "") {
          lvaNum = lvaNum + "";
        } else lvaNum = "0";

        lvaNum = lvaNum.trim();

        if (lvaNum == "-") lvaNum = "0";

        //tutor
        let tutorId;

        if (
          rowObj["TutorIn"] &&
          rowObj["TutorIn"].trim().toLowerCase() != "nicht notwendig"
        ) {
          let raw = rowObj["TutorIn"].trim().toLowerCase();

          if (raw.includes("("))
            raw = raw.substring(0, raw.indexOf("(")).trim();

          if (raw == "david") raw = "david kühhas";

          tutorId = tutorByName[raw];
        }

        const examData = {
          title: title || "",
          notes: notes || "",
          duration: dur || 0,
          date: date || null,
          tutor: tutorId || null,
          lva_num: lvaNum || "",
          student: studentId,
          exam_mode: mode || null,
          room: room || null,
          examiner: profId || null,
        };

        // ----- UPSERT: prefer matrikel; if none, use phone -----
        let existing = [];
        if (examData.title) {
          existing = await strapi.entityService.findMany("api::exam.exam", {
            filters: { title: title },
            limit: 1,
          });
        }

        if (existing.length > 0) {
          const updated = await strapi.entityService.update(
            "api::exam.exam",
            existing[0].id,
            { data: examData }
          );
          updatedExams.push(updated.id);
        } else {
          const created = await strapi.entityService.create("api::exam.exam", {
            data: examData,
          });
          createdExams.push(created.id);
        }
      }

      console.log(
        "==================================================================="
      );

      return ctx.send({
        message: "Exams import finished (UPSERT)",
        file: file.name,
        created: createdExams.length,
        updated: updatedExams.length,
        skippedRows,
      });
    } catch (err) {
      console.error("Error importing exams:", err);
      return ctx.internalServerError("Failed to import exams from Excel");
    }
  },
}));
