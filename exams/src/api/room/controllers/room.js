'use strict';

/**
 * room controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::room.room', ({ strapi }) => ({
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
        //},
      }));
  
      return newData;
    },
  
    // Override the default findOne method
    async update(ctx) {
      const { id } = ctx.params;  // Assuming the ID of the entity to fetch is provided in the URL
  
      ctx.query.populate = "*"; // This will populate all relations
  
      // Call the default findOne to get the entity by ID
      const { data } = await super.update(ctx);
      const newData = {
       // attributes: {
          id: data.id,  // Embed the main entity's id into its attributes
          ...data.attributes,
         //},
     };
      return newData;
    },
  }));
  
