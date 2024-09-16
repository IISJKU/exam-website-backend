'use strict';

/**
 * exam controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::exam.exam', ({ strapi }) => ({
    // Override the default find method
    async find(ctx) {
        ctx.query.populate = {
            // @ts-ignore
            student: {
                fields: ['matrikel_number', 'misc']  // Return only 'matrikel_number' field from 'student'
            },
            tutor: {
                fields: ['first_name', 'last_name']  
            },
            examiner: {
                fields: ['first_name', 'last_name']  
            }
        };
        const { data, meta } = await super.find(ctx);

        // Helper function to extract only values from an object
        const extractValues = (obj) => Object.values(obj);
     
       // Helper function to embed 'id' in 'attributes' of related items
       const embedIdInAttributes = (entry) => ({
          // id: entry.id,
          // attributes: {
           //    id: entry.id,  // Embed the 'id' into 'attributes'
               ...entry.attributes,
          // },
       });
 
       // Process the main entity and its populated relations
       const newData = data.map((entry) => ({
           //id: entry.id,
           attributes: {
              id: entry.id, // Embed the main entity's id into its attributes
               ...entry.attributes,
               tutor: entry.attributes.tutor ? extractValues(entry.attributes.tutor.data.attributes) : null,  
               student: entry.attributes.student ? entry.attributes.student.data.attributes.matrikel_number : null,  
               examiner: entry.attributes.examiner ? extractValues(entry.attributes.examiner.data.attributes) : null,  
               student_misc: entry.attributes.student ? entry.attributes.student.data.attributes.misc : null,
           },
       }));
  
      return { data: newData, meta };
    },
  }));
