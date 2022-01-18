# Infrastructure: API

Defines the infrastructure of the Digital Program Book API.

## Table of Contents <!-- omit in toc -->

- [Inputs](#inputs)
- [Scripts](#scripts)
- [Adding an API endpoint](#adding-an-api-endpoint)
- [Removing an API endpoint](#removing-an-api-endpoint)

## Inputs

See [example.tfvars](example.tfvars).

| Name          | Description                                                                                     | Type     | Default | Required |
| ------------- | ----------------------------------------------------------------------------------------------- | -------- | ------- | :------: |
| rds_pw_root   | The password for dpb mysql user root.                                                           | `string` | n/a     |   yes    |
| bypass_secret | The AWS Web Application Firewall (WAF) secret to allow requests and prevent bot classification. | `string` | n/a     |   yes    |

## Scripts

This will update the api resources (part of `..update_infrastructure.sh {workspace} up`)

```bash
./update.sh {workspace}
```

## Adding an API endpoint

See instructions in [Add an API endpoint](../../docs/add-api-endpoint.md).

## Removing an API endpoint

To avoid [issues](../README.md#issues) after removing a lamba, please follow these steps to remove a lambda.

They aren't required and you can address the issues. But it takes more time and effort if you don't remove the endpoints as follows.

1. Remove the `apigateway` module `variable` from [main.tf](main.tf).
2. Remove the lambda from [oas30-apigateway.yaml](oas30-apigateway.yaml).
3. Add a comment to the lambda module in [lambdas.tf](lambdas.tf) (or whatever file it is in) that it is deprecated and will be removed soon.
4. Check in the code.
5. `terraform apply`. This will update the API Gateway and update the state to have no references to the lambda. The lambda will still exist, but there are no references to it.
   1. If working across many environments, you need to run `terraform apply` in all the environments to avoid having issues any of the environments.
   2. Confirm with everyone that they have completed this.
6. Remove the lambda module from [lambdas.tf](lambdas.tf) (or whatever file it is in).
7. Check in the code.
8. `terraform apply`. This will delete the lambda without issue.

_Please note that these steps have not been completely tested. If any changes are required to the process please update this document._

## Gotchas

### CORS issue when making a requist to an endpoint

1. If a lambda has been updated by terraform (ex: the open api spec has been updated), then the lambda must be redeployed to AWS. If not, you will get a CORS error message because the lambda isn't returning anything.
2. Make sure the lambda is listed in `azure-pipelines-deploy.yml`.

<!-- BEGIN_TF_DOCS -->


<!--
``hcl
{ include "examples/main.tf" }}
```
-->

## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.14 |
| <a name="requirement_archive"></a> [archive](#requirement\_archive) | ~> 2.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 3.20 |
| <a name="requirement_local"></a> [local](#requirement\_local) | ~> 2.0 |
| <a name="requirement_null"></a> [null](#requirement\_null) | ~> 3.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 3.32.0 |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_bypass_secret"></a> [bypass\_secret](#input\_bypass\_secret) | The AWS Web Application Firewall (WAF) secret to allow requests and prevent bot classification | `string` | n/a | yes |
| <a name="input_rds_pw_root"></a> [rds\_pw\_root](#input\_rds\_pw\_root) | password for dpb mysql user root | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_api_versions_stable"></a> [api\_versions\_stable](#output\_api\_versions\_stable) | n/a |
| <a name="output_aws_region"></a> [aws\_region](#output\_aws\_region) | n/a |
| <a name="output_endpoint_uri"></a> [endpoint\_uri](#output\_endpoint\_uri) | n/a |
| <a name="output_git_sha"></a> [git\_sha](#output\_git\_sha) | git SHA of the last run stored in the state file. helpful for terraform version updates |
| <a name="output_vanity_endpoint_uri"></a> [vanity\_endpoint\_uri](#output\_vanity\_endpoint\_uri) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_apigateway"></a> [apigateway](#module\_apigateway) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//apigateway | v15.0.1 |
| <a name="module_dpb-api-deleteOneCard"></a> [dpb-api-deleteOneCard](#module\_dpb-api-deleteOneCard) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-api-deleteOneComponent"></a> [dpb-api-deleteOneComponent](#module\_dpb-api-deleteOneComponent) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-api-deleteOnePage"></a> [dpb-api-deleteOnePage](#module\_dpb-api-deleteOnePage) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-api-deleteOneProgram"></a> [dpb-api-deleteOneProgram](#module\_dpb-api-deleteOneProgram) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-api-getOneCard"></a> [dpb-api-getOneCard](#module\_dpb-api-getOneCard) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-api-getOneComponent"></a> [dpb-api-getOneComponent](#module\_dpb-api-getOneComponent) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-api-postOneCard"></a> [dpb-api-postOneCard](#module\_dpb-api-postOneCard) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-api-postOneComponent"></a> [dpb-api-postOneComponent](#module\_dpb-api-postOneComponent) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-api-putOneCard"></a> [dpb-api-putOneCard](#module\_dpb-api-putOneCard) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-api-putOneComponent"></a> [dpb-api-putOneComponent](#module\_dpb-api-putOneComponent) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-api-putOnePage"></a> [dpb-api-putOnePage](#module\_dpb-api-putOnePage) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-api-putOneProgram"></a> [dpb-api-putOneProgram](#module\_dpb-api-putOneProgram) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-api-unDeleteOnePage"></a> [dpb-api-unDeleteOnePage](#module\_dpb-api-unDeleteOnePage) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-api-undeleteOneComponent"></a> [dpb-api-undeleteOneComponent](#module\_dpb-api-undeleteOneComponent) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-client-getManyPrograms"></a> [dpb-client-getManyPrograms](#module\_dpb-client-getManyPrograms) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb-client-getOneProgram"></a> [dpb-client-getOneProgram](#module\_dpb-client-getOneProgram) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb_delete-program"></a> [dpb\_delete-program](#module\_dpb\_delete-program) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb_get-productions"></a> [dpb\_get-productions](#module\_dpb\_get-productions) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb_get-programs"></a> [dpb\_get-programs](#module\_dpb\_get-programs) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb_get-user"></a> [dpb\_get-user](#module\_dpb\_get-user) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb_postOneProgram"></a> [dpb\_postOneProgram](#module\_dpb\_postOneProgram) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb_program_id"></a> [dpb\_program\_id](#module\_dpb\_program\_id) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb_put-program"></a> [dpb\_put-program](#module\_dpb\_put-program) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_dpb_undelete-program"></a> [dpb\_undelete-program](#module\_dpb\_undelete-program) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_ie-dpb-api-getManyDesignVariables"></a> [ie-dpb-api-getManyDesignVariables](#module\_ie-dpb-api-getManyDesignVariables) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_ie-dpb-api-getOnePage"></a> [ie-dpb-api-getOnePage](#module\_ie-dpb-api-getOnePage) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_ie-dpb-api-putOneDesignVariable"></a> [ie-dpb-api-putOneDesignVariable](#module\_ie-dpb-api-putOneDesignVariable) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_ie-dpb-api-putRestoreOnePage"></a> [ie-dpb-api-putRestoreOnePage](#module\_ie-dpb-api-putRestoreOnePage) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_ie-dpb-api-putRestoreOneProgram"></a> [ie-dpb-api-putRestoreOneProgram](#module\_ie-dpb-api-putRestoreOneProgram) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda | v15.0.1 |
| <a name="module_sandbox_constants"></a> [sandbox\_constants](#module\_sandbox\_constants) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//sandbox_constants | master |



## Resources

| Name | Type |
|------|------|
| [aws_eip.nat](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eip) | resource |
| [aws_iam_role.lambda_api](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.lambda_kms_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy_attachment.aws-lambda-vpcaccess-execution-role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_nat_gateway.gw](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/nat_gateway) | resource |
| [aws_route.lambda_private_ipv4](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route) | resource |
| [aws_route53_record.apigateway_v4](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.apigateway_v6](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route_table.lambda_private](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table) | resource |
| [aws_route_table_association.a](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table_association) | resource |
| [aws_security_group.sg](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_subnet.lambda_private](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/subnet) | resource |
| [aws_acm_certificate.wildcard](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/acm_certificate) | data source |
| [aws_availability_zones.available](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/availability_zones) | data source |
| [aws_route53_zone.selected](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/route53_zone) | data source |
| [aws_subnet_ids.vpc_dpb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/subnet_ids) | data source |
| [aws_vpc.dpb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/vpc) | data source |


<!-- END_TF_DOCS -->
