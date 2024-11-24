import { appConfig } from "./../../config";
import { v4 as uuidv4 } from "uuid";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as bedrock from "aws-cdk-lib/aws-bedrock";

interface KnowledgeBaseProps {
  storageArn: string;
}

export class KnowledgeBase extends Construct {
  public readonly knowledgeBaseId: string;

  constructor(scope: Construct, id: string, props: KnowledgeBaseProps) {
    super(scope, id);

    const {
      pineconeEndpoint,
      pineconeApiKeySecretArn,
      embeddingModelArn,
    } = appConfig;

    const uid = uuidv4();

    const knowledgeBaseRole = new iam.Role(this, `KnowledgeBaseRole`, {
      roleName: `knowledgeBase-role-${uid}`,
      assumedBy: new iam.ServicePrincipal("bedrock.amazonaws.com"),
      inlinePolicies: {
        inlinePolicy1: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              resources: [pineconeApiKeySecretArn],
              actions: ["secretsmanager:GetSecretValue"],
            }),
            new iam.PolicyStatement({
              resources: [embeddingModelArn],
              actions: ["bedrock:InvokeModel"],
            }),
            new iam.PolicyStatement({
              resources: [props.storageArn, `${props.storageArn}/*`],
              actions: ["s3:ListBucket", "s3:GetObject"],
            }),
          ],
        }),
      },
    });

    const knowledgeBase = new bedrock.CfnKnowledgeBase(this, "KnowledgeBase", {
      knowledgeBaseConfiguration: {
        type: "VECTOR",
        vectorKnowledgeBaseConfiguration: {
          embeddingModelArn,
        },
      },
      name: `knowledgeBase-${uid}`,
      roleArn: knowledgeBaseRole.roleArn,
      storageConfiguration: {
        pineconeConfiguration: {
          connectionString: pineconeEndpoint,
          credentialsSecretArn: pineconeApiKeySecretArn,
          fieldMapping: {
            metadataField: "metadata",
            textField: "text",
          },
        },
        type: "PINECONE",
      },
    });

    this.knowledgeBaseId = knowledgeBase.ref;

    new bedrock.CfnDataSource(this, "BedrockKnowledgeBaseDataStore", {
      name: `knowledgeBase-data-source-${uid}`,
      knowledgeBaseId: knowledgeBase.ref,
      dataSourceConfiguration: {
        s3Configuration: {
          bucketArn: props.storageArn,
          inclusionPrefixes: ["rag-resources/"],
        },
        type: "S3",
      },
    });
  }
}
