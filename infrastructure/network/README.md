# Infrastructure: Network

Defines the VPC and network layer.

## Inputs

None.

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

No inputs.

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_aws_region"></a> [aws\_region](#output\_aws\_region) | n/a |
| <a name="output_cidr_block"></a> [cidr\_block](#output\_cidr\_block) | n/a |
| <a name="output_git_sha"></a> [git\_sha](#output\_git\_sha) | git SHA of the last run stored in the state file. helpful for terraform version updates |
| <a name="output_ipv6_cidr_block"></a> [ipv6\_cidr\_block](#output\_ipv6\_cidr\_block) | n/a |
| <a name="output_route_table_id"></a> [route\_table\_id](#output\_route\_table\_id) | n/a |
| <a name="output_subnet_ids"></a> [subnet\_ids](#output\_subnet\_ids) | n/a |
| <a name="output_vpc_id"></a> [vpc\_id](#output\_vpc\_id) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_sandbox_constants"></a> [sandbox\_constants](#module\_sandbox\_constants) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//sandbox_constants | master |
| <a name="module_vpc_dpb"></a> [vpc\_dpb](#module\_vpc\_dpb) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//vpc | v15.0.1 |



## Resources

| Name | Type |
|------|------|
| [aws_network_acl_rule.v4-ingress-mysql](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/network_acl_rule) | resource |
| [aws_s3_bucket.logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |


<!-- END_TF_DOCS -->
