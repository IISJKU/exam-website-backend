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
        fields: ["matrikel_number", "misc"],
        populate: {
          major: {
            fields: ["name"], // Specify the major fields to populate
          },
        },
      },
      tutor: {
        fields: ["first_name", "last_name"],
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
    const { data } = await super.find(ctx);

    // Helper function to extract only values from an object
    const extractValues = (obj) => Object.values(obj);

   // Helper function to embed 'id' in 'attributes' of related items
    const embedIdInAttributes = (entry) => {
      if (entry == null) return ''; // Check for null and return early if entry is null
      
      return {
        id: entry.id, // Embed the 'id' into 'attributes'
        ...entry.attributes,
      };
    };


    // Process the main entity and its populated relations
    const newData = data.map((entry) => ({
      //id: entry.id,
      // attributes: {
      id: entry.id, // Embed the main entity's id into its attributes
      ...entry.attributes,
      tutor: entry.attributes.tutor ? embedIdInAttributes(entry.attributes.tutor.data) : null,
      student: entry.attributes.student ? embedIdInAttributes(entry.attributes.student.data): null,
      examiner: entry.attributes.examiner ? embedIdInAttributes(entry.attributes.examiner.data) : null,
      exam_mode: entry.attributes.exam_mode ? embedIdInAttributes(entry.attributes.exam_mode.data) : null,
      institute: entry.attributes.institute ? embedIdInAttributes(entry.attributes.institute.data) : null,
      student_misc: entry.attributes.student ? entry.attributes.student.data.attributes.misc : null,
      major: entry.attributes.student ? embedIdInAttributes(entry.attributes.student.data.attributes.major.data) : null,
      room: entry.attributes.room ? embedIdInAttributes(entry.attributes.room.data) : null,
      tutor_id: entry.attributes.tutor ? entry.attributes.tutor.data.id : null,
      student_id: entry.attributes.student ? entry.attributes.student.data.id : null,
      examiner_id: entry.attributes.examiner ? entry.attributes.examiner.data.id : null,
      major_id: entry.attributes.student.data.attributes.major ? entry.attributes.student.data.attributes.major.data.id : null,
      institute_id: entry.attributes.institute ? entry.attributes.institute.data.id : null,
      mode_id: entry.attributes.exam_mode ? entry.attributes.exam_mode.data.id : null,
      room_id: entry.attributes.room ? entry.attributes.room.data.id : null,
      //   },
    }));

    return newData;
  },

  // Override the default findOne method to fetch a single entity
  async findOne(ctx) {
    const { id } = ctx.params; // Get the ID from the route parameters

    // Specify fields and relations to populate
    ctx.query.populate = {
      // @ts-ignore
      student: {
        fields: ["matrikel_number", "misc"],
        populate: {
          major: {
            fields: ["name"], // Specify the major fields to populate
          },
        },
      },
      tutor: {
        fields: ["first_name", "last_name"],
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

    // Call the default findOne to get the entity by ID
    const { data } = await super.findOne(ctx);

    // Helper function to embed 'id' in 'attributes' of related items
    const embedIdInAttributes = (entry) => ({
      id: entry.id, // Embed the 'id' into 'attributes'
      ...entry.attributes,
    });

    // Process the main entity and its populated relations
    const newData = {
      id: data.id, // Embed the main entity's id into its attributes
      ...data.attributes,
      tutor: data.attributes.tutor ? embedIdInAttributes(data.attributes.tutor.data) : null,
      student: data.attributes.student ? embedIdInAttributes(data.attributes.student.data): null,
      examiner: data.attributes.examiner ? embedIdInAttributes(data.attributes.examiner.data) : null,
      exam_mode: data.attributes.exam_mode ? embedIdInAttributes(data.attributes.exam_mode.data) : null,
      institute: data.attributes.institute ? embedIdInAttributes(data.attributes.institute.data) : null,
      student_misc: data.attributes.student ? data.attributes.student.data.attributes.misc : null,
      major: data.attributes.student ? embedIdInAttributes(data.attributes.student.data.attributes.major.data) : null,
      room: data.attributes.room ? embedIdInAttributes(data.attributes.room.data) : null,
      tutor_id: data.attributes.tutor ? data.attributes.tutor.data.id : null,
      student_id: data.attributes.student ? data.attributes.student.data.id : null,
      examiner_id: data.attributes.examiner ? data.attributes.examiner.data.id : null,
      major_id: data.attributes.student.data.attributes.major ? data.attributes.student.data.attributes.major.data.id : null,
      institute_id: data.attributes.institute ? data.attributes.institute.data.id : null,
      mode_id: data.attributes.exam_mode ? data.attributes.exam_mode.data.id : null,
      room_id: data.attributes.room ? data.attributes.room.data.id : null,
    };

    return newData;
  },

  // Override the default update method
  async update(ctx) {
    const { id } = ctx.params; // Assuming the ID of the entity to fetch is provided in the URL

    ctx.query.populate = {
      // @ts-ignore
      student: {
        fields: ["matrikel_number", "misc"],
        populate: {
          major: {
            fields: ["name"], // Specify the major fields to populate
          },
        },
      },
      tutor: {
        fields: ["first_name", "last_name"],
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
      tutor: data.attributes.tutor ? embedIdInAttributes(data.attributes.tutor.data) : null,
      student: data.attributes.student ? embedIdInAttributes(data.attributes.student.data): null,
      examiner: data.attributes.examiner ? embedIdInAttributes(data.attributes.examiner.data) : null,
      exam_mode: data.attributes.exam_mode ? embedIdInAttributes(data.attributes.exam_mode.data) : null,
      institute: data.attributes.institute ? embedIdInAttributes(data.attributes.institute.data) : null,
      student_misc: data.attributes.student ? data.attributes.student.data.attributes.misc : null,
      major: data.attributes.student ? embedIdInAttributes(data.attributes.student.data.attributes.major.data) : null,
      room: data.attributes.room ? embedIdInAttributes(data.attributes.room.data) : null,
      tutor_id: data.attributes.tutor ? data.attributes.tutor.data.id : null,
      student_id: data.attributes.student ? data.attributes.student.data.id : null,
      examiner_id: data.attributes.examiner ? data.attributes.examiner.data.id : null,
      major_id: data.attributes.student.data.attributes.major ? data.attributes.student.data.attributes.major.data.id : null,
      institute_id: data.attributes.institute ? data.attributes.institute.data.id : null,
      mode_id: data.attributes.exam_mode ? data.attributes.exam_mode.data.id : null,
      room_id: data.attributes.room ? data.attributes.room.data.id : null,
      //  },
    };

    return newData;
  },
  
  async findExamsForStudent(ctx) {
    const { studentId } = ctx.params;
  
    if (!studentId) {
      return ctx.badRequest("Missing student ID");
    }
    // Use the correct filter syntax for a relational field
    const exams = await strapi.entityService.findMany("api::exam.exam", {
      filters: {
        student: { id: studentId }, // Filters based on the relation's ID
      },
      populate: {
        student: {
          fields: ["matrikel_number", "misc"],
          populate: {
            major: {
              fields: ["name"], // Populate fields as needed
            },
          },
        },
        tutor: { fields: ["first_name", "last_name"] },
        examiner: { fields: ["first_name", "last_name"] },
        exam_mode: { fields: ["name"] },
        institute: { fields: ["name", "abbreviation"] },
        room: { fields: ["name"] },
      },
    });

    return exams;
  },
  
}));
