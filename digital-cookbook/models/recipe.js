const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ingredients: {
      type: [String],
      required: [true, "Ingredients are required"],

      validate: {
        validator: (arr) =>
          Array.isArray(arr) &&
          arr.length > 0 &&
          arr.every((s) => typeof s === "string" && s.trim().length > 0),
        message: "Ingredients must be a non-empty array of strings",
      },
    },
    instructions: {
      type: String,
      required: [true, "Instructions are required"],
      trim: true,
    },
    prepTimeInMinutes: {
      type: Number,
      // “positive number” => strictly > 0
      min: [1, "Prep time must be at least 1 minute"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
