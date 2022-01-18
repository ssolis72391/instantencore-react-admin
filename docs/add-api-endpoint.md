# Add an API endpoint

Our API usese AWS Gateway and AWS Lambda to power our API. This doc describes the steps to add a new API endpoint.

## Table of Content <!-- omit in toc -->

- [1. Define lambda](#1-define-lambda)
- [2. Define API Gateway Variable](#2-define-api-gateway-variable)
- [3. OpenAPI spec](#3-openapi-spec)
- [4. Preview the changes](#4-preview-the-changes)
- [5. Add to deployment pipeline](#5-add-to-deployment-pipeline)
- [6. Check lambdaPrefix in webpack config](#6-check-lambdaprefix-in-webpack-config)
- [7. Write lambda code](#7-write-lambda-code)
- [8. Write test for lambda code](#8-write-test-for-lambda-code)
- [9. Apply terraform changes](#9-apply-terraform-changes)
- [10. Deploy API Gateway](#10-deploy-api-gateway)
- [11. Deploy lambda](#11-deploy-lambda)
- [Resources](#resources)

## 1. Define lambda

- Add module to [infrastructure/api/lambdas_client.tf](../infrastructure/api/lambdas_client.tf). Example:

  ```yml
  module "dpb-client-getManyPrograms" {
    # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
    source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"

    description   = "instantencore_dpb client getManyPrograms data function"
    function_name = "ie-dpb-api-client-getManyPrograms"
    memory_size   = 128
    timeout       = 29
    runtime       = "nodejs14.x"
    company       = local.company
    tags          = local.common_tags
    role_arn      = aws_iam_role.lambda_api.arn
    handler       = "client-getManyPrograms.handler"
    environment = {
      variables = {
        DB_HOST     = local.db_host
        DB_USER     = local.db_user
        DB_PASSWORD = local.db_password
        DB_NAME     = local.db_name
        DB_PORT     = local.db_port
        SENTRY_DSN  = local.sentry_dsn
      }
    }
    vpc_config = {
      subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
      security_group_ids = [aws_security_group.sg.id]
    }
  }
  ```

## 2. Define API Gateway Variable

1. Go to [infrastructure/api/main.tf](../infrastructure/api/main.tf).
2. Add variable to `apigateway` > `variables`. Example
   ```yml
   client-getManyPrograms-function-arn = module.dpb-client-getManyPrograms.function_arn
   ```

## 3. OpenAPI spec

- Add an element to `path` in [infrastructure/api/oas30-apigateway.yaml](../infrastructure/api/oas30-apigateway.yaml). Example:
  ```yml
  "/client/programs":
    get:
      responses:
        200:
          description: "Ok"
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
      x-amazon-apigateway-integration:
        uri: "arn:aws:apigateway:${aws_region}:lambda:path/2015-03-31/functions/${client-getManyPrograms-function-arn}:${lambda_alias}/invocations"
        credentials: "${lambda_execution_role_arn}"
        responses:
        default:
          statusCode: "200"
          responseParameters:
            method.response.header.Access-Control-Allow-Origin: "'*'"
        type: aws_proxy
        httpMethod: "POST"
  ```

## 4. Preview the changes

- View the changes that terraform will apply to your workspace.
- Replace `<workspace>` with your workspace name. Ex: `evan`, `silver`, `orange`.
- You need to create `<workspace>.tfvars`. See [infrastructure/README.md](../infrastructure/README.md).

```bash
cd infrastrucutre/api
export AWS_PROFILE=switchcase
./update_plan.sh <workspace>
```

## 5. Add to deployment pipeline

- In [api/azure-pipelines-deploy.yml](../api/azure-pipelines-deploy.yml) add to `parameters.default`. Example:
  ```yml
  parameters:
    - name: lambdaPrefix
      type: string
      default: "ie-dpb-api-"
    - name: lambdas
      type: object
      default:
        [
          postOneProgram,
          getPrograms,
          deleteOneProgram,
          client-getOneProgram,
          client-getManyPrograms,
          getOneComponent,
        ]
  ```

## 6. Check lambdaPrefix in webpack config

- Check if prefix is in `lambdaPrefixes` in [api/webpack.dev.config.babel.js](../api/webpack.dev.config.babel.js). Example:
  ```yml
  const lambdaPrefixes = [
  "get",
  "put",
  "post",
  "delete",
  "undelete",
  "client-get",
  ];
  ```

## 7. Write lambda code

- Add file to `api/src/functions`. Example: [client-getManyPrograms](../api/src/functions/client-getManyPrograms.ts).

## 8. Write test for lambda code

- Add file to `api/test-integrations/functions`. Example: [clieint_getManyPrograms.test.ts](../api/test-integration/functions/client_getManyPrograms.test.ts).
- Make sure to build the lambda before running the test: `yarn build-one-dev <lambda-name| ex: putOneCard>`.
- To test a single lambda: `yarn test-file <lambda-test-file|ex: test-ingeration/functions/putOneCard.test.ts>`.

## 9. Apply terraform changes

### Option 1: Targeted

Assuming you did [Preview the changes](#4-preview-the-changes), just run `terraform apply`. This will just updated the api and not other parts of the infrastructure.

```
cd path/to/infrastrcture/api
terraform apply -var-file=<workspace>.tfvars
```

### Option 2: Update all infrastructure

Follow instructions in [System Deployment](system-deployment.md) to update all the infrastructure.

## 10. Deploy API Gateway

1. Log into the AWS Console for your `<workspace>` and go to [API Gateway](https://console.aws.amazon.com/apigateway/main/apis?region=us-east-1)
2. Select `dpb-api`.
3. Click "Actions" button and choose "Deploy API".
4. Pick "Stage 1" and click "Deploy".

## 11. Deploy lambda

Option 1: Use Azure DevOps (which will deploy all lambdas).

Option 2: Targeted local deploy: From `api` run `yarn update <name-of-lambda`.

## Resources

- [Example Shortcut story for adding an endpoint](https://app.shortcut.com/switchcase/story/97953/api-client-programs)
