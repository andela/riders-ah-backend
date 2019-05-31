import Sequelize from 'sequelize';
import Articlehepler from '../helpers/articleRatevalidator';
import searchArticleHelper from '../helpers/article';

const { Op } = Sequelize;

/**
 * @exports ArticleMiddleware
 * @class ArticleMiddleware
 * @description Article Middleware
 * */
class ArticleMiddleware {
  /**
     * Validate article and rate
     * @param {string} req - a request
     * @param {string} res - a response
     * @param {string} next - next function for continue
     * @return {string} Returns error or proceed the execution
     * @static
     */
  static async checkRatedArticle(req, res, next) {
    const errorMessage = [];
    if (req.body.rate === undefined) {
      errorMessage.push('Oops! Rate is required');
    }
    const validateArticle = await Articlehepler.validateArticleRated(req.params.slug, req.user.id);
    if (validateArticle !== true) {
      errorMessage.push(validateArticle);
    }
    const validateRate = await Articlehepler.validateRating(req.body.rate);
    if (validateRate !== true) {
      errorMessage.push(validateRate);
    }
    if (errorMessage.length) {
      return res.status(400).json({ status: 400, errors: { body: errorMessage } });
    }
    next();
  }

  /**
     * Validate article and rate
     * @param {string} req - a request
     * @param {string} res - a response
     * @param {string} next - next function for continue
     * @return {string} Returns error or proceed the execution
     * @static
     */
  static async searchArticle(req, res, next) {
    const {
      author, title, tag, keyword
    } = req.query;
    let param;
    if (author && !title && !tag && !keyword) {
      param = { username: { [Op.iLike]: author } };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles by ${author} found` });
      }
      return res.status(200).send(result);
    }
    if (!author && title && !tag && !keyword) {
      param = { title: { [Op.iLike]: title } };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles with title ${title} found` });
      }
      return res.status(200).send(result);
    }
    if (!author && !title && tag && !keyword) {
      param = { name: { [Op.iLike]: tag } };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles with tag ${tag} found` });
      }
      return res.status(200).send(result);
    }
    if (!author && !title && !tag && keyword) {
      param = { keyword: { title: { [Op.iLike]: `%${keyword}%` } } };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles with a title containing ${keyword} found` });
      }
      return res.status(200).send(result);
    }
    if (author && title && !tag && !keyword) {
      param = {
        authorTitle: [
          { username: { [Op.iLike]: author } },
          { title: { [Op.iLike]: title } }
        ]
      };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles with author ${author} and title ${title} found` });
      }
      return res.status(200).send(result);
    }
    if (author && !title && tag && !keyword) {
      param = {
        authorTag: [
          { username: { [Op.iLike]: author } },
          { name: { [Op.iLike]: tag } }
        ]
      };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles with author ${author} and tag ${tag} found` });
      }
      return res.status(200).send(result);
    }
    if (author && !title && !tag && keyword) {
      param = {
        authorKeyword: [
          { username: { [Op.iLike]: author } },
          { title: { [Op.iLike]: `%${keyword}%` } }
        ]
      };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles with author ${author} and keyword ${keyword} found` });
      }
      return res.status(200).send(result);
    }
    if (!author && title && tag && !keyword) {
      param = {
        titleTag: [
          { title: { [Op.iLike]: title } },
          { name: { [Op.iLike]: tag } }
        ]
      };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles with title ${title} and tag ${tag} found` });
      }
      return res.status(200).send(result);
    }
    if (!author && title && !tag && keyword) {
      param = {
        titleKeyword:
        {
          [
          Op.or]: [
            { title: { [Op.iLike]: title } },
            { title: { [Op.iLike]: `%${keyword}%` } }]
        }
      };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles with title ${title} or keyword ${keyword} in its title found` });
      }
      return res.status(200).send(result);
    }
    if (!author && !title && tag && keyword) {
      param = {
        tagKeyword: [
          { name: { [Op.iLike]: tag } },
          { title: { [Op.iLike]: `%${keyword}%` } }
        ]
      };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles with tag ${tag} and keyword ${keyword} found` });
      }
      return res.status(200).send(result);
    }
    if (author && title && tag && !keyword) {
      param = {
        authorTitleTag: [
          { username: { [Op.iLike]: author } },
          { title: { [Op.iLike]: title } },
          { name: { [Op.iLike]: tag } }
        ]
      };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles with author ${author}, title ${title} and tag ${tag} found` });
      }
      return res.status(200).send(result);
    }
    if (author && title && !tag && keyword) {
      param = {
        authorTitleKeyword: [
          { username: { [Op.iLike]: author } },
          {
            [
            Op.or]: [
              { title: { [Op.iLike]: title } },
              { title: { [Op.iLike]: `%${keyword}%` } }]
          }
        ]
      };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles with author ${author} and title ${title} or keyword ${keyword} found` });
      }
      return res.status(200).send(result);
    }
    if (!author && title && tag && keyword) {
      param = {
        titleTagKeyword: [
          {
            [
            Op.or]: [
              { title: { [Op.iLike]: title } },
              { title: { [Op.iLike]: `%${keyword}%` } }]
          },
          { name: { [Op.iLike]: tag } }
        ]
      };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles with title ${title}, tag ${tag} and keyword ${keyword} found` });
      }
      return res.status(200).send(result);
    }
    if (author && !title && tag && keyword) {
      param = {
        authorTagKeyword: [
          { username: { [Op.iLike]: author } },
          { name: { [Op.iLike]: tag } },
          { title: { [Op.iLike]: `%${keyword}%` } }
        ]
      };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({ message: `no articles with author ${author}, tag ${tag} and keyword ${keyword} found` });
      }
      return res.status(200).send(result);
    }
    if (author && title && tag && keyword) {
      param = {
        allParams: [
          { username: { [Op.iLike]: author } },
          {
            [
            Op.or]: [
              { title: { [Op.iLike]: title } },
              { title: { [Op.iLike]: `%${keyword}%` } }]
          },
          { name: { [Op.iLike]: tag } }
        ]
      };
      const result = await searchArticleHelper.searchArticle(param);
      if (result.length < 1) {
        return res.status(404).send({
          message: `no articles with author ${author}, title ${title}, tag ${tag} and keyword ${keyword} found`
        });
      }
      return res.status(200).send(result);
    }
    next();
    return true;
  }
}
export default ArticleMiddleware;
