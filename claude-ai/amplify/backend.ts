import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";
import { KnowledgeBase } from "./custom/knowledgeBase/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
});

const { cfnUserPool } = backend.auth.resources.cfnResources;

cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: false,
    requireNumbers: false,
    requireSymbols: false,
    requireUppercase: false,
  },
};

const knowledgeBaseStack = backend.createStack("knowledgeBase");
const knowledgeBase = new KnowledgeBase(knowledgeBaseStack, "KnowledgeBase", {
  storageArn: backend.storage.resources.bucket.bucketArn,
});

const KnowledgeBaseDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "KnowledgeBaseDataSource",
  `https://bedrock-agent-runtime.${cdk.Stack.of(backend.data).region}.amazonaws.com`,
  {
    authorizationConfig: {
      signingRegion: cdk.Stack.of(backend.data).region,
      signingServiceName: "bedrock",
    },
  }
);

KnowledgeBaseDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      `arn:aws:bedrock:${
        cdk.Stack.of(backend.data).region
      }:<your-aws-accountId>:knowledge-base/${knowledgeBase.knowledgeBaseId}`,
    ],
    actions: ["bedrock:Retrieve"],
  })
);
