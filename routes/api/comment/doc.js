/**
 * @swagger
 * /article/{slug}/comments:
 *   post:
 *     tags:
 *       - comment
 *     name: comment
 *     summary: Create a coment on an article
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         in: path
 *         schema:
 *           type: string
 *         required:
 *           - slug
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             body:
 *               type: string
 *         required:
 *           - body
 *     responses:
 *       '201':
 *         description: The comment have been created successfully
 *       '400':
 *         The comment have failed to be created
 */

/**
 * @swagger
 * /article/{slug}/comments:
 *   get:
 *     tags:
 *       - comment
 *     name: comment
 *     summary: fetch all comments
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         in: path
 *         schema:
 *           type: string
 *         required:
 *           - slug
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *     responses:
 *       '200':
 *         description: comments are fetched successfully
 *       '400':
 *         The comment has problem in query causing comments not to be fetched
 */

/**
 * @swagger
 * /article/{slug}/comments/{id}:
 *   get:
 *     tags:
 *       - comment
 *     name: comment
 *     summary: fetch one comment
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         in: path
 *         schema:
 *           type: string
 *         required:
 *           - slug
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *         required:
 *           - id
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *     responses:
 *       '200':
 *         description: one comment is fetched successfully
 *       '400':
 *         The comment has problem in query causing comments not to be fetched
 */

/**
 * @swagger
 * /article/{slug}/comments/{id}:
 *   delete:
 *     tags:
 *       - comment
 *     name: comment
 *     summary: delete one comment
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         in: path
 *         schema:
 *           type: string
 *         required:
 *           - slug
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *         required:
 *           - id
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *     responses:
 *       '200':
 *         description: one comment is deleted successfully
 *       '400':
 *         The comment has problem in query causing comments not to be deleted
 *         The comment has problem can only be deleted by a user who created them
 */

/**
 * @swagger
 * /article/{slug}/comments/{id}:
 *   post:
 *     tags:
 *       - comment
 *     name: comment
 *     summary: update a coment on an article
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         in: path
 *         schema:
 *           type: string
 *         required:
 *           - slug
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *         required:
 *           - id
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             body:
 *               type: string
 *         required:
 *           - body
 *     responses:
 *       '201':
 *         description: The comment have been updated successfully
 *       '400':
 *         The comment have failed to be updated
 */

/**
 * @swagger
 * /comment/{id}/reply:
 *   post:
 *     tags:
 *       - reply comment
 *     name: reply comment
 *     summary: Create a reply to a coment on an article
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *         required:
 *           - id
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             body:
 *               type: string
 *         required:
 *           - body
 *     responses:
 *       '201':
 *         description: The reply have been created successfully
 *       '400':
 *         The reply have failed to be created
 */

/**
 * @swagger
 * /comment/{id}/likes:
 *   get:
 *     tags:
 *       - like
 *     name: like
 *     summary: get likes on a comment
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type:integer
 *         required:
 *           - id
 *     responses:
 *       '200':
 *         description: likes have been fetched successfully
 *       '400':
 *         likes have been failed to be fetched
 */
/**
 * @swagger
 * /comment/{id}/feedback/{like}:
 *   post:
 *     tags:
 *       - like
 *     name: like
 *     summary: like a comment
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: like
 *         in: path
 *         schema:
 *           type: string
 *         required:
 *           - like
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *         required:
 *           - id
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *     responses:
 *       '200':
 *         description:  Successfully liked a comment
 */
