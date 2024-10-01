'use strict';

/**
 * exam-mode service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::exam-mode.exam-mode');
