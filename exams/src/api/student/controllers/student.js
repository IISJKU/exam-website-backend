"use strict";

/**
 * student controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

// Helper function to embed 'id' in 'attributes' of related items
const embedIdInAttributes = (entry) => ({
  // id: entry.id,
  // attributes: {
  id: entry.id, // Embed the 'id' into 'attributes'
  ...entry.attributes,
  // },
});

module.exports = createCoreController("api::student.student", ({ strapi }) => ({
  // Override the default find method
  async find(ctx) {
    ctx.query.populate = "*"; // This will populate all relations
    // Fetch the entities with populated relations
    const { data } = await super.find(ctx);

    // Process the main entity and its populated relations
    const newData = data.map((entry) => ({
      //id: entry.id,
      // attributes: {
      id: entry.id, // Embed the main entity's id into its attributes
      ...entry.attributes,
      major: entry.attributes.major? embedIdInAttributes(entry.attributes.major.data): null,
      major_id: entry.attributes.major ? entry.attributes.major.data.id : null,
      student_email: entry.attributes.user.data ? entry.attributes.user.data.attributes.email : null,
      location: entry.attributes.location.data ? embedIdInAttributes(entry.attributes.location.data) : null,
      faculty : entry.attributes.faculty.data ? embedIdInAttributes(entry.attributes.faculty.data) : null,
      disability_types: entry.attributes.disability_types && entry.attributes.disability_types.data ? entry.attributes.disability_types.data.map(embedIdInAttributes) : [],
      // },
    }));

    return newData;
  },

  // Override the default findOne method
  async findOne(ctx) {
    const { id } = ctx.params; // Assuming the ID of the entity to fetch is provided in the URL

    ctx.query.populate = "*"; // This will populate all relations

    // Call the default findOne to get the entity by ID
    const { data } = await super.findOne(ctx);

    const newData = {
      //attributes: {
      id: data.id, // Embed the main entity's id into its attributes
      ...data.attributes,
      major: data.attributes.major ? embedIdInAttributes(data.attributes.major.data): null,
      major_id: data.attributes.major ? data.attributes.major.data.id : null,
      location: data.attributes.location.data ? embedIdInAttributes(data.attributes.location.data) : null,
      faculty : data.attributes.faculty.data ? embedIdInAttributes(data.attributes.faculty.data) : null,
      disability_types: data.attributes.disability_types && data.attributes.disability_types.data ? data.attributes.disability_types.data.map(embedIdInAttributes) : [],
      //},
    };

    return newData;
  },

  // Override the default update method
  async update(ctx) {
    const { id } = ctx.params; // Assuming the ID of the entity to fetch is provided in the URL

    ctx.query.populate = "*"; // This will populate all relations

    // Call the default update to get the entity by ID
    const { data } = await super.update(ctx);

    const newData = {
      //attributes: {
      id: data.id, // Embed the main entity's id into its attributes
      ...data.attributes,
      major: data.attributes.major
        ? embedIdInAttributes(data.attributes.major.data)
        : null,
      major_id: data.attributes.major ? data.attributes.major.data.id : null,
      location: data.attributes.location.data ? embedIdInAttributes(data.attributes.location.data) : null,
      faculty : data.attributes.faculty.data ? embedIdInAttributes(data.attributes.faculty.data) : null,
      disability_types: data.attributes.disability_types && data.attributes.disability_types.data ? data.attributes.disability_types.data.map(embedIdInAttributes) : [],
      //},
    };

    return newData;
  },

  async findStudentsMe(ctx) {
    const userId = ctx.state.user.id;

    if (ctx.state.user.role.type == "student") {
      const students = await strapi.entityService.findMany(
        "api::student.student",
        {
          filters: {
            user: { id: userId },
          },
          fields: ["id"], // Retrieve only the exam IDs
        }
      );

      return students;
    } else {
      const exams = await strapi.entityService.findMany("api::exam.exam", {
        filters: {
          tutor: { id: userId },
        },
        fields: "*", // Retrieve only the exam IDs
      });

      const students = await strapi.entityService.findMany("api::exam.exam", {
        fields: "*",
      });

      const filteredStudents = [];
      exams.forEach((exam) => {
        students.forEach((student) => {
          //@ts-ignore
          if (exam.student_id == student.id) {
            filteredStudents.push(student);
          }
        });
      });

      return filteredStudents;
    }
  },
}));
