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
                tutor_id: entry.attributes.tutor ? entry.attributes.tutor.data.tutor_id : null,
                student_id: entry.attributes.student ? entry.attributes.student.data.attributes.student_id : null,
                examiner_id: entry.attributes.examiner ? entry.attributes.examiner.data.attributes.examiner_id : null,
            },
        }));
  
        return { data: newData, meta };
    },

    // Override the default findOne method
    async findOne(ctx) {
        const { id } = ctx.params;  // Assuming the ID of the entity to fetch is provided in the URL

        ctx.query.populate = {
            // @ts-ignore
            student: {
                fields: ['matrikel_number', 'misc'],  // Return only 'matrikel_number' and 'misc' from 'student'
            },
            tutor: {
                fields: ['first_name', 'last_name'],
            },
            examiner: {
                fields: ['first_name', 'last_name'],
            },
        };

        // Helper function to extract only values from an object
        const extractValues = (obj) => Object.values(obj);

        // Call the default findOne to get the entity by ID
        const { data } = await super.findOne(ctx);

        // Process the response just like the 'find' method
        const newData = {
            attributes: {
                id: data.id,  // Embed the main entity's id into its attributes
                ...data.attributes,
                tutor: data.attributes.tutor ? extractValues(data.attributes.tutor.data.attributes) : null,
                student: data.attributes.student ? data.attributes.student.data.attributes.matrikel_number : null,
                examiner: data.attributes.examiner ? extractValues(data.attributes.examiner.data.attributes) : null,
                student_misc: data.attributes.student ? data.attributes.student.data.attributes.misc : null,
                tutor_id: data.attributes.tutor ? data.attributes.tutor.data.id : null,
                student_id: data.attributes.student ? data.attributes.student.data.id : null,
                examiner_id: data.attributes.examiner ? data.attributes.examiner.data.id : null,
            },
        };

        return { data: newData };
    },
}));
