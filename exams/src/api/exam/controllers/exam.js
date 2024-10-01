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
                fields: ['matrikel_number', 'misc'],
                populate: {
                    major: {
                        fields: ['name']  // Specify the major fields to populate
                    }
                }
            },
            tutor: {
                fields: ['first_name', 'last_name']
            },
            examiner: {
                fields: ['first_name', 'last_name']
            },
            exam_mode: {
                fields: ['name']
            },
            institute: {
                fields: ['name', 'abbreviation']
            },
            room: {
                fields: ['name']
            }
        };
        const { data } = await super.find(ctx);

        // Helper function to extract only values from an object
        const extractValues = (obj) => Object.values(obj);
     
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
                tutor: entry.attributes.tutor ? extractValues(entry.attributes.tutor.data.attributes) : null,
                student: entry.attributes.student ? entry.attributes.student.data.attributes.matrikel_number : null,
                examiner: entry.attributes.examiner ? extractValues(entry.attributes.examiner.data.attributes) : null,
                exam_mode: entry.attributes.exam_mode ? entry.attributes.exam_mode.data.attributes.name : null,
                institute: entry.attributes.institute ? entry.attributes.institute.data.attributes.abbreviation : null,
                student_misc: entry.attributes.student ? entry.attributes.student.data.attributes.misc : null,
                major: entry.attributes.student ? entry.attributes.student.data.attributes.major.data.attributes.name : null,
                room: entry.attributes.room ? entry.attributes.room.data.attributes.name : null,
                tutor_id: entry.attributes.tutor ? entry.attributes.tutor.data.id : null,
                student_id: entry.attributes.student ? entry.attributes.student.data.id : null,
                examiner_id: entry.attributes.examiner ? entry.attributes.examiner.data.id : null,
                major_id: entry.attributes.student.data.attributes.major ? entry.attributes.student.data.attributes.major.data.id : null,
                institute_id: entry.attributes.institute ? entry.attributes.institute.data.id : null,
                mode_id: entry.attributes.exam_mode ? entry.attributes.exam_mode.data.id : null,
                room_id: entry.attributes.room ? entry.attributes.room.data.id : null,
            },
        }));
  
        return { data: newData };
    },

    // Override the default findOne method
    async update(ctx) {
        const { id } = ctx.params;  // Assuming the ID of the entity to fetch is provided in the URL

        ctx.query.populate = {
            // @ts-ignore
            student: {
                fields: ['matrikel_number', 'misc'],
                populate: {
                    major: {
                        fields: ['name']  // Specify the major fields to populate
                    }
                }
            },
            tutor: {
                fields: ['first_name', 'last_name']
            },
            examiner: {
                fields: ['first_name', 'last_name']
            },
            exam_mode: {
                fields: ['name']
            },
            institute: {
                fields: ['name', 'abbreviation']
            },
            room: {
                fields: ['name']
            }
        };

        // Helper function to extract only values from an object
        const extractValues = (obj) => Object.values(obj);

        // Call the default findOne to get the entity by ID
        const { data } = await super.update(ctx);

        // Process the response just like the 'find' method
        const newData = {
            attributes: {
                id: data.id,  // Embed the main entity's id into its attributes
                ...data.attributes,
                tutor: data.attributes.tutor ? extractValues(data.attributes.tutor.data.attributes) : null,
                student: data.attributes.student ? data.attributes.student.data.attributes.matrikel_number : null,
                examiner: data.attributes.examiner ? extractValues(data.attributes.examiner.data.attributes) : null,
                exam_mode: data.attributes.exam_mode ? data.attributes.exam_mode.data.attributes.name : null,
                institute: data.attributes.institute ? data.attributes.institute.data.attributes.abbreviation : null,
                student_misc: data.attributes.student ? data.attributes.student.data.attributes.misc : null,
                room: data.attributes.room ? data.attributes.room.data.attributes.name : null,
                major: data.attributes.student ? data.attributes.student.data.attributes.major.data.attributes.name : null,
                tutor_id: data.attributes.tutor ? data.attributes.tutor.data.id : null,
                student_id: data.attributes.student ? data.attributes.student.data.id : null,
                examiner_id: data.attributes.examiner ? data.attributes.examiner.data.id : null,
                major_id: data.attributes.student.data.attributes.major ? data.attributes.student.data.attributes.major.data.id : null,
                institute_id: data.attributes.institute ? data.attributes.institute.data.id : null,
                mode_id: data.attributes.exam_mode ? data.attributes.exam_mode.data.id : null,
                room_id: data.attributes.room ? data.attributes.room.data.id : null,
            },
        };

        return { data: newData };
    },
}));
