# Amplify AI Samples

## Getting Started

All of these samples use the Amplify AI. To run these samples you will need an AWS account with AWS Amplify set up and access to Bedrock models in the region you want to deploy in.

# Sample Repository Setup Guide

This guide will walk you through the steps to set up and use this repository. Follow the instructions below to ensure the project is configured correctly.

## Prerequisites

1. **Create a Pinecone Account and Index**  
   - Sign up for a Pinecone account [here](https://www.pinecone.io/).
   - Create an index within your Pinecone account for vector-based knowledge base storage.

2. **Store Pinecone API Key in AWS Secrets Manager**  
   - Save your Pinecone API key in AWS Secrets Manager. This key will be used to authenticate with Pinecone.

3. **Update the AWS Account ID**  
   - Open `claude-ai/amplify/backend.ts`.
   - Replace `<your-aws-accountId>` in the following line with your AWS account ID:
     ```javascript
     arn:aws:bedrock:${cdk.Stack.of(backend.data).region}:<your-aws-accountId>:knowledge-base/${knowledgeBase.knowledgeBaseId}
     ```

4. **Configure Pinecone Endpoint and Secret Manager ARN**  
   - Open `claude-ai/amplify/config.ts`.
   - Update the following fields with your Pinecone index endpoint and the ARN of the secret stored in AWS Secrets Manager:
     ```javascript
     pineconeEndpoint: "<your-pinecone-endpoint>",
     pineconeApiKeySecretArn: "<secret-manager-arn>",
     ```

5. **Install Dependencies**  
   Run the following command to install all required dependencies:
   ```bash
   npm install
   ```
   Or, if you use Yarn:
   ```bash
   yarn
   ```

6. **Create a Cloud Sandbox**  
   Use Amplify to create a cloud sandbox environment:
   ```bash
   npx amplify sandbox
   ```

7. **Update the Knowledge Base ID**  
   - Once the sandbox is created, locate the ID of the created Knowledge Base.
   - Open `claude-ai/amplify/data/resolvers/kbResolver.js` and replace `<your-knowledgeBase-id>` in the following line with the Knowledge Base ID:
     ```javascript
     resourcePath: "/knowledgebases/<your-knowledgeBase-id>/retrieve",
     ```

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

