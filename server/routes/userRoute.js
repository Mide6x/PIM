const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API endpoints for managing users
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve all users
 *     description: Fetch a list of all users in the system.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user ID.
 *                     example: 61234abcd5678efg91234hij
 *                   name:
 *                     type: string
 *                     description: The user's name.
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     description: The user's email.
 *                     example: johndoe@example.com
 *       500:
 *         description: Internal server error
 */
router.get("/", userController.getUsers);

module.exports = router;
