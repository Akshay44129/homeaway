const Joi = require('joi');

// const Joi = require("joi");
const review = require("./models/review");
const listing=require("./models/listing");



// module.exports.listeningSchema =joi.object({
//     listing : joi.object({
//         title: joi.string().required(),
//         description: joi.string().required(),
//         location: joi.string().required(),
//         country: joi.string().required(),
//         price: joi.number().required().min(0),
//         image : joi.string().allow("",null)

//     }).required()
// });


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      comment: Joi.string().required() // Changed "Comment" to "comment"
    }).required() // Close the inner object
  }).required(); 