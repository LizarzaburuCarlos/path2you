'use strict';

/**
 * ask service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::ask.ask');
