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
