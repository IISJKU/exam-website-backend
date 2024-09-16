'use strict';

/**
 * examiner service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::examiner.examiner');
