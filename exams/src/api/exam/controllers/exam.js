"use strict";

/**
 * exam controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

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

      console.log("All Tutors Data:", allTutors);

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
}));
