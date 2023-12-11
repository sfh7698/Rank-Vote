import { Joi } from 'express-validation';

export const validateCreatePoll = {
    body: Joi.object({
        topic: Joi.string().min(1).max(100).required(),
        votesPerVoter: Joi.number().integer().min(1).max(5).required(),
        name: Joi.string().min(1).max(25).required()
    })
}

export const validateJoinPoll = {
    body: Joi.object({
        pollID: Joi.string().min(6).max(6).required(),
        name: Joi.string().min(1).max(25).required()
    })
}
