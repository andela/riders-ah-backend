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
 *       - Rating
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
 *       articleSlug:
 *         type: string
 *       required:
 *         - name
 *         - articleSlug
 * @swagger
 * /articles/{slug}/rate:
 *   get:
 *     tags:
 *       - Rating
 *     name: Rating
 *     summary: User get all rates given to an article
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
 *       articleSlug:
 *         type: string
 *       required:
 *         - name
 *         - articleSlug
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

/**
 * @swagger
 * /articles/{slug}/bookmark:
 *   post:
 *     tags:
 *       - bookmark
 *     name: bookmark
 *     summary: create bookmark by a user an article
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
 *       '201':
 *         description: bookmark have been created successfully
 *       '400':
 *         bookmark have been failed to be created
 */

/**
 * @swagger
 * /articles/user/bookmarks:
 *   get:
 *     tags:
 *       - bookmark
 *     name: bookmark
 *     summary: get bookmark made by a user an article
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *     responses:
 *       '200':
 *         description: bookmarks have been fetched successfully
 *       '400':
 *         bookmarks have been failed to be fetched
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     tags:
 *       - search engine
 *     name: search article
 *     summary: search for articles using different filtering parameters
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: author
 *         in: query
 *         schema:
 *           type: string
 *       - name: title
 *         in: query
 *         schema:
 *           type: string
 *       - name: tag
 *         in: query
 *         schema:
 *           type: string
 *       - name: keyword
 *         in: query
 *         schema:
 *           type: string
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *     responses:
 *       '200':
 *         description: articles fetched successfuly
 *       '404':
 *         articles not found
 */

/**
 * @swagger
 * /articles/{slug}/highlight:
 *   post:
 *     tags:
 *       - Highlight
 *     name: Highlight
 *     summary: User can highlight and comment an article's text
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
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             articleSlug:
 *               type: string
 *             userId:
 *               type: string
 *             startIndex:
 *               type: integer
 *             endIndex:
 *               type: integer
 *             content:
 *               type: string
 *         required:
 *           - startIndex
 *           - endIndex
 *           - content
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Article not found
 *   Tag:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       articleSlug:
 *         type: string
 *       required:
 *         - name
 *         - articleSlug
 * @swagger
 * /articles/{slug}/highlight:
 *   get:
 *     tags:
 *       - Highlight
 *     name: Highlight
 *     summary: User get all highlight text on an article
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
 *     responses:
 *       '200':
 *         description: Ok
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Article not found
 *   Tag:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       articleSlug:
 *         type: string
 *       required:
 *         - name
 *         - articleSlug
 * @swagger
 * /articles/highlight/{highlightId}/highlight:
 *   post:
 *     tags:
 *       - Highlight
 *     name: Highlight
 *     summary: User can comment a highlighted text of an article
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: highlightId
 *         in: path
 *         schema:
 *           type: integer
 *         required:
 *           - highlightId
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
 *             id:
 *               type: integer
 *             userId:
 *               type: integer
 *             highlightId:
 *               type: string
 *             comment:
 *               type: integer
 *         required:
 *           - comment
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Text highlighted not found
 *   Tag:
 *     type: object
 *     properties:
 *       name:
 *         type: integer
 *       highlightId:
 *         type: integer
 *       required:
 *         - name
 *         - highlightId
 * @swagger
 * /articles/highlight/{highlightId}/highlight:
 *   get:
 *     tags:
 *       - Highlight
 *     name: Highlight
 *     summary: User get all comments on highlighted text on an article
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: highlightId
 *         in: path
 *         schema:
 *           type: integer
 *         required:
 *           - highlightId
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *     responses:
 *       '200':
 *         description: Ok
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Highlighted text not found
 */
/**
 * @swagger
 * definitions:
 *   ReportedArticle:
 *     type: object
 *     properties:
 *       userId:
 *         type: integer
 *       articleId:
 *         type: integer
 *       reportType:
 *         type: enum
 *       reason:
 *         type: text
 */
/**
* @swagger
*  /articles/{slug}/report/{reportType}:
*   post:
*     tags:
*       - Report
*     name: Report
*     summary: User must be able to report an article.
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
*       - name: reportType
*         in: path
*         schema:
*           type: string
*         required:
*           - reportType
*       - name: authorization
*         in: header
*         schema:
*           type: string
*         required:
*           - authorization
*       - name: reason
*         in: reason
*         schema:
*           $ref: '#/definitions/ReportedArticle'
*           type: object
*           properties:
*             reason:
*               type: text
*     responses:
*       '201':
*         description: Article reported
*       '400':
*         description: Bad Request
*       '404':
*         description: article not found
*/
/**
* @swagger
*  /articles/reported:
*   get:
*     tags:
*       - Report
*     name: Report
*     summary: Get all reported articles
*     produces:
*       - application/json
*     consumes:
*       - application/json
*     parameters:
*       - name: authorization
*         in: header
*         schema:
*           type: string
*         required:
*           - authorization
*     responses:
*       '200':
*         description: ok
*       '404':
*         description: article not found
*/
