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
 * /articles/{slug}/rate:
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
 *       - name: slug
 *         in: path
 *         schema:
 *           type: integer
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
 *   Tag:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       articleId:
 *         type: integer
 *       required:
 *         - name
 *         - articleId

 * @swagger
 * /articles/{slug}/tag:
 *   post:
 *     tags:
 *       - Tag
 *     name: Tag user article
 *     summary: Create a tag for article which user has created
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/Tag'
 *           type: object
 *           properties:
 *             articleId:
 *               type: integer
 *             name:
 *               type: string
 *         required:
 *           - articleId
 *           - name
 *     responses:
 *       '201':
 *         description: Tag has successfully created
 *       '400':
 *         description: Provided information are invalid
 *       '401':
 *         description: Has not permission to create tag
 *       '404':
 *         description: Article not found
  * @swagger
 * /articles/tag/list:
 *   get:
 *     tags:
 *       - Tag
 *     name: List of tags
 *     summary: Get list of all created
 *     parameters:
 *       - name: body
 *         schema:
 *           $ref: '#/definitions/Tag'
 *           type: array
 *           properties:
 *         required:
 *     responses:
 *       '200':
 *         description: Ok, Successfully got list of tag
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

/**
 * @swagger
 * /articles/{slug}/share/{option}:
 *   post:
 *     tags:
 *       - share
 *     name: share article
 *     summary: share an article on a platform specified in url
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
 *       - name: option
 *         in: path
 *         schema:
 *           type: string
 *         required:
 *           - option
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *     responses:
 *       '201':
 *         description: share is made succesfully
 *       '400':
 *         share has failed
 *       '404':
 *         article not found
 */

/**
 * @swagger
 * /articles/{slug}/shares:
 *   get:
 *     tags:
 *       - share
 *     name: get shares on an  article
 *     summary: get shares on an article
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
 *         description: shares are fetched successfully
 *       '404':
 *         article or share not found
 */
