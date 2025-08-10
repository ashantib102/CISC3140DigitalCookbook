require("dotenv").config({ path: require("path").join(__dirname, ".env") });

console.log("MONGODB_URI ->", process.env.MONGODB_URI);

const express = require("express");
const connectDB = require("./db");
const Recipe = require("./models/recipe");

const app = express();
app.use(express.json());

// Connect to database
connectDB();

// Function to create a recipe
async function createRecipe() {
  try {
    const newRecipe = new Recipe({
      title: "Chocolate Chip Cookies",
      description: "Chewy and delicious homemade chocolate chip cookies.",
      ingredients: [
        "All-purpose flour",
        "Baking soda",
        "Salt",
        "Unsalted butter",
        "Brown sugar",
        "Granulated sugar",
        "Eggs",
        "Vanilla extract",
        "Chocolate chips",
      ],
      instructions:
        "1. Preheat oven to 350°F (175°C). 2. Whisk together flour, baking soda, and salt. 3. Cream butter and sugars until fluffy. 4. Beat in eggs and vanilla. 5. Mix in dry ingredients, then fold in chocolate chips. 6. Drop spoonfuls onto baking sheet and bake for 10-12 minutes.",
      prepTimeInMinutes: 45,
    });

    const savedRecipe = await newRecipe.save();
    console.log("Recipe saved:", savedRecipe);
  } catch (err) {
    console.error("Error creating recipe:", err.message);
  }
}

// Run the function once when the app starts
createRecipe();

app.get("/", (_req, res) => res.send("MongoDB connection successful!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Function to retrieve and log all recipes
async function findAllRecipes() {
  try {
    const recipes = await Recipe.find();
    console.log("All Recipes:");
    recipes.forEach((recipe, index) => {
      console.log(
        `${index + 1}. ${recipe.title} (${recipe.prepTimeInMinutes} min)`
      );
    });
  } catch (err) {
    console.error("Error retrieving recipes:", err.message);
  }
}

// Function to find a single recipe by title
async function findRecipeByTitle(title) {
  try {
    const recipes = await Recipe.find({ title: title });
    if (recipes.length === 0) {
      console.log(`No recipes found with title: "${title}"`);
      return;
    }
    console.log(`Found ${recipes.length} recipe(s) with title: "${title}"`);
    recipes.forEach((recipe) => {
      console.log(`- ${recipe.title} (${recipe.prepTimeInMinutes} min)`);
    });
  } catch (err) {
    console.error("Error finding recipe:", err.message);
  }
}

async function updateRecipeDescription(title, newDescription) {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { title: title },
      { description: newDescription },
      operation,
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      console.log(`⚠️ No recipe found with title: "${title}"`);
      return;
    }

    console.log("Recipe updated successfully:");
    console.log(`Title: ${updatedRecipe.title}`);
    console.log(`New Description: ${updatedRecipe.description}`);
  } catch (err) {
    console.error("Error updating recipe:", err.message);
  }
}

// Function to delete a recipe by title
async function deleteRecipe(title) {
  try {
    const deletedRecipe = await Recipe.findOneAndDelete({ title: title });

    if (!deletedRecipe) {
      console.log(`No recipe found with title: "${title}"`);
      return;
    }

    console.log(`Recipe "${deletedRecipe.title}" deleted successfully.`);
  } catch (err) {
    console.error("Error deleting recipe:", err.message);
  }
}

app.put("/recipes/:title", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { title: req.params.title },
      { description: req.body.description },
      { new: true, runValidators: true }
    );
    if (!updatedRecipe)
      return res.status(404).json({ message: "Recipe not found" });
    res.json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
