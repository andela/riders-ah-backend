import models from '../models';

const { Tag } = models;
/**
 * @class TagHelper
 * @description Helper for Tags
 * */
class TagHelper {
  /**
   * Check if the same tag was added before
   * @param {array} articles - array of articles
   * @return {array} Returns articles with tagList object
   * @static
   */
  static async addTagsToArticles(articles) {
    const articlesWithTags = [];
    articles.forEach((currentArticle) => {
      const articleTags = [];
      currentArticle.tagList.forEach((currentTag) => {
        articleTags.push(currentTag.name);
      });
      articlesWithTags.push({
        slug: currentArticle.slug,
        title: currentArticle.title,
        description: currentArticle.description,
        readingTime: currentArticle.readingTime,
        body: currentArticle.body,
        image: currentArticle.image,
        tagList: articleTags,
        author: currentArticle.author,
        createdAt: currentArticle.createdAt,
        updatedAt: currentArticle.updatedAt
      });
    });
    return articlesWithTags;
  }

  /**
   * @param  {number} articleId - Article ID
   * @param  {string} tagName - Name of tag
   * @returns {object} array of tags
   *  @static
   */
  static async getArticleTag(articleId, tagName) {
    const conditions = {
      where: {
        articleId,
        name: tagName
      }
    };
    const articleTags = await Tag.findAll(conditions);
    return articleTags;
  }

  /**
   * @function getTagsByArticle
   * @param  {number} articleId - Article ID
   * @returns {object} array of tags
   *  @static
   */
  static async getTagsByArticle(articleId) {
    const conditions = {
      where: { articleId },
      attributes: ['name']
    };
    const tags = await Tag.findAll(conditions).map(article => article.name);
    return tags || [];
  }
}

export default TagHelper;
