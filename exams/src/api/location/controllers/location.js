'use strict';

/**
 * location controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const embedIdInAttributes = (entry) => ({
    // id: entry.id,
    // attributes: {
    id: entry.id, // Embed the 'id' into 'attributes'
    ...entry.attributes,
    // },
  });

module.exports = createCoreController('api::location.location', ({ strapi }) => ({
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
          faculty : entry.attributes.faculty.data ? embedIdInAttributes(entry.attributes.faculty.data) : null,
        //},
      }));
  
      return newData;
    },
  
  // Override the default findOne method
  async findOne(ctx) {
    const { id } = ctx.params;  // Assuming the ID of the entity to fetch is provided in the URL

    ctx.query.populate = "*"; // This will populate all relations

    // Call the default findOne to get the entity by ID
    const { data } = await super.findOne(ctx);

    const newData = {
      //attributes: {
        id: data.id,  // Embed the main entity's id into its attributes
        ...data.attributes,
        faculty : data.attributes.faculty.data ? embedIdInAttributes(data.attributes.faculty.data) : null,
      // },
    };
    return newData;
  },

    // Override the default update method
    async update(ctx) {
      const { id } = ctx.params;  // Assuming the ID of the entity to fetch is provided in the URL
  
      ctx.query.populate = "*"; // This will populate all relations
  
      // Call the default update to get the entity by ID
      const { data } = await super.update(ctx);
  
      const newData = {
        //attributes: {
          id: data.id,  // Embed the main entity's id into its attributes
          ...data.attributes,
          faculty : data.attributes.faculty.data ? embedIdInAttributes(data.attributes.faculty.data) : null,
        // },
     };
      return newData;
    },
  }));
  
  
