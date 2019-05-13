/**
 * @swagger
 * definitions:
 *   Rating:
 *     type: object
 *     properties:
 *       rate:
 *         type: integer
 *       required:
 *         - rate
 */

/**
 * @swagger
 * /articles/rate/{id}:
 *   post:
 *     tags:
 *       - Article
 *     name: Rating
 *     summary: User rate an article
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
 *           $ref: '#/definitions/Rating'
 *           type: object
 *           properties:
 *             rate:
 *               type: integer
 *         required:
 *           - rate
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad Request
 */

/**
 * @swagger
 * /articles/{slug}/likes/{like}:
 *   post:
 *     tags:
 *       - like
 *     name: like
 *     summary: like an article
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
 *       - name: like
 *         in: path
 *         schema:
 *           type: string
 *         required:
 *           - like
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *     responses:
 *       '201':
 *         description: The like have been created successfully
 *       '400':
 *         The like have failed to be created
 */

/**
 * @swagger
 * /articles/{slug}/dislikes/{dislike}:
 *   post:
 *     tags:
 *       - dislike
 *     name: dislike
 *     summary: dislike an article
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
 *       - name: dislike
 *         in: path
 *         schema:
 *           type: string
 *         required:
 *           - dislike
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *     responses:
 *       '201':
 *         description: The dislike have been created successfully
 *       '400':
 *         The dislike have failed to be created
 */

/**
 * @swagger
 * /articles/{slug}/likes:
 *   get:
 *     tags:
 *       - like
 *     name: like
 *     summary: get likes an article
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
 *         description: likes have been fetched successfully
 *       '400':
 *         likes have been failed to be fetched
 */

/**
 * @swagger
 * /articles/{slug}/dislikes:
 *   get:
 *     tags:
 *       - dislike
 *     name: dislikes
 *     summary: get dislikes an article
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
 *         description: dislikes have been fetched successfully
 *       '400':
 *         dislikes have been failed to be fetched
 */
