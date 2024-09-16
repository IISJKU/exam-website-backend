'use strict';

/**
 * student controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::student.student', ({ strapi }) => ({
    // Override the default find method
    async find(ctx) {
      ctx.query.populate = '*';  // This will populate all relations
      // Fetch the entities with populated relations
       const { data, meta } = await super.find(ctx);
     
       // Helper function to embed 'id' in 'attributes' of related items
       const embedIdInAttributes = (entry) => ({
          // id: entry.id,
           attributes: {
               id: entry.id,  // Embed the 'id' into 'attributes'
               ...entry.attributes,
           },
       });
 
       // Process the main entity and its populated relations
       const newData = data.map((entry) => ({
           //id: entry.id,
           attributes: {
              id: entry.id, // Embed the main entity's id into its attributes
              ...entry.attributes,
              exams: entry.attributes.exams ? entry.attributes.exams.data.map(embedIdInAttributes) : [],  // Handle many-to-many exams relations 
           },
       }));
  
      return { data: newData, meta };
    },
  }));
