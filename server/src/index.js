import { app } from "./app.js";
import { connectDB } from "./db/index.js";

connectDB().then(() => {
  app.listen(process.env.PORT || 7000, () => {
    console.log("Server connected on port", process.env.PORT);
  });
});
