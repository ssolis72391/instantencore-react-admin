# System Deployment

Follow these steps to create your infrastructure and deploy the applications.

## Step 1: Deploy all Infrastructure

See [infrastructure/README.md](../infrastructure/README.md) for details.

## Step 2: Run DB migrations

See [Database](../api/src/database/README.md) for steps to create the DB and run migrations.

## Step 3: Deploy all Applications

### Deploy api

1. [Azure DevOps pipeline 203](https://dev.azure.com/switchcasegroup/SCG/_build?definitionId=203): Click "Run Pipeline".
   - Option: Resources should be opened to ensure you are deploying the latest master build.
   - Otherwise defaults are okay
2. "Approve Stages": Each stage requires approval, before it will run the deployment, you must Review / approve the stage(s) you wish to deploy.
3. Confirmation that endpoint is up can be manually tested in your browser by visiting `https://dpb-api.<workspace>.instantencore.com/1/helloworld` (example https://dpb-api.copper.instantencore.com/1/helloworld)
4. If you have made terraform changes you must Deploy the API Gateway
   1. Log into the AWS Console and go to [API Gateway](https://console.aws.amazon.com/apigateway/main/apis?region=us-east-1)
   2. Select `dpb-api`.
   3. Click "Actions" button and choose "Deploy API".
   4. Pick "Stage 1" and click "Deploy".

### Deploy cms

1. [Azure DevOps pipeline 208](https://dev.azure.com/switchcasegroup/SCG/_build?definitionId=208): Click "Run Pipeline".
   - Option: Resources should be opened to ensure you are deploying the latest master build. If you need to create a new non-master build you can do so from the [instantencore-digital-program-book-workspace-cms pipeline](https://dev.azure.com/switchcasegroup/SCG/_build?definitionId=207).
   - Otherwise defaults are okay
2. "Approve Stages": Each stage requires approval, before it will run the deployment, you must Review / approve the stage(s) you wish to deploy.
3. Confirmation that endpoint is up can be manually tested in your browser by visiting `https://dpb-cms.<workspace>.instantencore.com` (example https://dpb-cms.copper.instantencore.com)

### Deploy client-web

1. [Azure DevOps pipeline 206](https://dev.azure.com/switchcasegroup/SCG/_build?definitionId=206): Click "Run Pipeline".
   - Option: Resources should be opened to ensure you are deploying the latest master build.
   - Otherwise defaults are okay
2. "Approve Stages": Each stage requires approval, before it will run the deployment, you must Review / approve the stage(s) you wish to deploy.
3. Confirmation that endpoint is up can be manually tested in your browser by visiting `https://dpb-web.<workspace>.instantencore.com` (example https://dpb-web.copper.instantencore.com)