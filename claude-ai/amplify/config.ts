import * as dotenv from "dotenv";

// you can add more region here
export type Region = "ap-northeast-1" | "us-east-1";

dotenv.config({
  path: ".env",
});

const config = {
  "ap-northeast-1": {
    pineconeEndpoint: "<your-pinecone-endpoint>",
    pineconeApiKeySecretArn: "<secret-manager-arn>",
    embeddingModelArn:
      "arn:aws:bedrock:ap-northeast-1::foundation-model/cohere.embed-multilingual-v3",
  },
  "us-east-1": {
    pineconeEndpoint: "<your-pinecone-endpoint>",
    pineconeApiKeySecretArn: "<secret-manager-arn>",
    embeddingModelArn:
      "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v2:0",
  },
} as const;

function getConfig(env: Region) {
  return config[env];
}

function isValidEnvironment(env: string): env is Region {
  return env === "ap-northeast-1" || env === "us-east-1";
}

const { REGION } = process.env;

if (!REGION) {
  throw new Error("BRANCH env var is required");
}

if (!isValidEnvironment(REGION)) {
  throw new Error(`Invalid region: ${REGION}`);
}

export const appConfig = getConfig(REGION);
