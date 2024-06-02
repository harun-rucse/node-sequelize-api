import Joi from "joi";

const validateProduct = (product) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    price: Joi.number().required().label("Price"),
    description: Joi.string().label("Description"),
    categoryId: Joi.number().required().label("CategoryId"),
  });

  return schema.validate(product);
};

const validateProductUpdate = (product) => {
  const schema = Joi.object({
    name: Joi.string().label("Name"),
    price: Joi.number().label("Price"),
    description: Joi.string().label("Description"),
  });

  return schema.validate(product);
};

export { validateProduct, validateProductUpdate };
