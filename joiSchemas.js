const Joi = require('joi');

module.exports.jobSchema = Joi.object({
    job: Joi.object({
        title: Joi.string().required(),
        logo: Joi.string(),
        company: Joi.string().alphanum().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        website: Joi.any().allow(null),
        favorited: Joi.number().min(0)
    }).required()
})

