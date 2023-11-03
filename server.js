const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dotenv = require("dotenv");
const mongoose = require("mongoose");


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: [process.env.COOKIE_SECRET],
    httpOnly: true,
  }));

// Set up the MongoDB connection
try {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connect to MongoDB.");
      initial();
    })
    .catch((err) => {
      console.error("Connection error", err);
      process.exit(1); // Exit the process with an error code
    });
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1); // Exit the process with an error code
}

app.get("/", (req, res) => {
  try {
    res.json({ message: "Welcome to bezkoder application." });
  } catch (error) {
    console.error("Error handling the / route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Import the contact and project routers
const contactRouter = require("./app/routes/contact.routes");
const projectRouter = require("./app/routes/project.routes"); // Import the project router
const postRoutes = require("./app/routes/postRoutes");
const serviceRouter = require("./app/routes/service.routes")
const testimonialRouter = require("./app/routes/testimonial.routes")
const imageRoutes = require('./app/routes/imageRoutes')
const resetRouter=require('./app/routes/reset.routes')

app.use("/", contactRouter); // Mount the contact router on the /api/contacts route
app.use("/", projectRouter); // Mount the project router on the /api/projects route

app.use("/", serviceRouter);
app.use("/", testimonialRouter);
app.use('/', postRoutes);
app.use('/api', imageRoutes);
app.use('/api',resetRouter);

// Import the authentication and user routes (replace with actual paths)
try {
  require("./app/routes/auth.routes")(app);
  require("./app/routes/user.routes")(app);
} catch (error) {
  console.error("Error setting up routes:", error);
}

const PORT = process.env.PORT || 8080;
try {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
} catch (error) {
  console.error("Error starting the server:", error);
}

// Set up the initial roles
function initial() {
  try {
    const Role = require("./app/models/role.model");

    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }

          console.log("added 'user' to roles collection");
        });

        new Role({
          name: "admin",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }

          console.log("added 'admin' to roles collection");
        });
        new Role({
          name: "moderator"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'moderator' to roles collection");
        });
      }
    });
  } catch (error) {
    console.error("Error in the initial setup:", error);
  }
}
