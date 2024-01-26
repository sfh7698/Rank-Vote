import { Joi } from "express-validation";

export const nominateSchema = Joi.object({
    text: Joi.string().min(1).max(100).required()
});