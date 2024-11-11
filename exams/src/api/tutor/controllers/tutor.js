"use strict";

/**
 * tutor controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::tutor.tutor", ({ strapi }) => ({
  // Override the default find method
  async find(ctx) {
    ctx.query.populate = "*"; // This will populate all relations
    // Fetch the entities with populated relations
    const { data } = await super.find(ctx);

    // Process the main entity and its populated relations
    const newData = data.map((entry) => ({
      //id: entry.id,
      //attributes: {
      id: entry.id, // Embed the main entity's id into its attributes
      ...entry.attributes,
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
      //},
    };
    return newData;
  },

  async findTutorsForStudent(ctx) {
    const userId = ctx.state.user.id;

    const students = await strapi.entityService.findMany(
      "api::student.student",
      {
        filters: {
          user: { id: userId },
        },
        fields: ["id"], // Retrieve only the exam IDs
      }
    );

    // @ts-ignore
    let studentId = students[0].id;
    // First, find all exams where the student is linked
    const exams = await strapi.entityService.findMany("api::exam.exam", {
      filters: {
        student: { id: studentId },
      },
      populate: { tutor: true }, // Populate the tutor relation to access the ID
    });

    // Extract tutor IDs from the result
    const tutorIds = exams
      .map((exam) => exam.tutor?.id) // Map to tutor IDs, handling possible nulls
      .filter((id) => id !== undefined); // Filter out undefined values

    // Then, fetch tutors that match these IDs
    const tutors = await strapi.entityService.findMany("api::tutor.tutor", {
      filters: {
        id: { $in: tutorIds }, // Filter by tutor IDs
      },
      populate: "*", // Populate all related fields if needed
    });

    return tutors;
  },
}));
