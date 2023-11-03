const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");
const contactController = require("../controllers/contact.controller");

// Define the route to handle contact form submissions
router.post("/api/contacts", contactController.createContact);
router.get(
    "/api/contacts",
    [authJwt.verifyToken, authJwt.hasAdminOrModeratorRole],
    contactController.getAllContacts
  );
  router.delete(
    "/api/contacts/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    contactController.deleteContact
  );
module.exports = router;
