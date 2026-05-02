import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export const GET = async (
  _req: MedusaRequest,
  res: MedusaResponse,
) => {
  const swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "PandaMarket External API",
      description: "Public API for Pro and Agency vendors to manage products, orders, and AI credits.",
      version: "1.0.0"
    },
    servers: [
      {
        url: "https://api.pandamarket.tn/api/pd",
        description: "Production Server"
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-pd-api-key"
        }
      }
    },
    security: [
      {
        ApiKeyAuth: []
      }
    ],
    paths: {
      "/products": {
        get: {
          summary: "List Products",
          responses: {
            "200": {
              description: "Successful response"
            }
          }
        },
        post: {
          summary: "Create a Product",
          responses: {
            "201": {
              description: "Product created"
            }
          }
        }
      },
      "/credits": {
        get: {
          summary: "Get AI Token Balance",
          responses: {
            "200": {
              description: "Successful response"
            }
          }
        }
      }
    }
  };

  res.json(swaggerSpec);
};
