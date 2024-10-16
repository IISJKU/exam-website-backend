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
       const { data } = await super.find(ctx);
     
       // Helper function to embed 'id' in 'attributes' of related items
       const embedIdInAttributes = (entry) => ({
          // id: entry.id,
          // attributes: {
               id: entry.id,  // Embed the 'id' into 'attributes'
               ...entry.attributes,
          // },
       });
 
       // Process the main entity and its populated relations
       const newData = data.map((entry) => ({
           //id: entry.id,
          // attributes: {
              id: entry.id, // Embed the main entity's id into its attributes
              ...entry.attributes,
              major: entry.attributes.major ? embedIdInAttributes(entry.attributes.major.data) : null, 
              major_id: entry.attributes.major ? entry.attributes.major.data.id : null, 
          // },
       }));
  
      return newData;
  },

  // Override the default findOne method
  async update(ctx) {
    const { id } = ctx.params;  // Assuming the ID of the entity to fetch is provided in the URL

    ctx.query.populate = "*"; // This will populate all relations

    // Call the default findOne to get the entity by ID
    const { data } = await super.update(ctx);
     // Helper function to embed 'id' in 'attributes' of related items
     const embedIdInAttributes = (entry) => ({
      // id: entry.id,
      // attributes: {
           id: entry.id,  // Embed the 'id' into 'attributes'
           ...entry.attributes,
       //},
     });
    
    const newData = {
      //attributes: {
          id: data.id,  // Embed the main entity's id into its attributes
        ...data.attributes,
        major: data.attributes.major ? embedIdInAttributes(data.attributes.major.data) : null, 
        major_id: data.attributes.major ? data.attributes.major.data.id : null,
      //},
  };

    return newData;
  },
  }));
