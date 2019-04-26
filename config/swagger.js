import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import swaggerui from 'swagger-ui-express';

dotenv.config();

const swaggerDefinition = {
  info: {
    title: 'Authors Haven',
    version: '1.0.0',
    description: 'A Social platform for the creative at heart'
  },
  host: `${process.env.BASE_URL}`,
  basePath: '/api/v1'
};

const options = {
  swaggerDefinition,
  apis: ['./routes/**/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

const registerSwagger = app => app.use('/docs', swaggerui.serve, swaggerui.setup(swaggerSpec));

export default registerSwagger;
