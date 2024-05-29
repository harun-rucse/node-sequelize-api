import Joi from "joi";

const validateCategory = (category) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    description: Joi.string().label("Description"),
  });

  return schema.validate(category);
};

const validateCategoryUpdate = (category) => {
  const schema = Joi.object({
    name: Joi.string().label("Name"),
    description: Joi.string().label("Description"),
  });

  return schema.validate(category);
};

export { validateCategory, validateCategoryUpdate };
