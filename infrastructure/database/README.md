# Infrastructure: Database

Creates an AWS MySQL RDS database.

## Inputs

- `<workspace>.tfvars`
- See [example.tfvars](example.tfvars)

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
| <a name="input_rds_pw_root"></a> [rds\_pw\_root](#input\_rds\_pw\_root) | password for mysql user root | `string` | n/a | yes |

## Outputs

No outputs.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_db"></a> [db](#module\_db) | terraform-aws-modules/rds/aws | ~> 3.0 |
| <a name="module_sandbox_constants"></a> [sandbox\_constants](#module\_sandbox\_constants) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//sandbox_constants | master |
| <a name="module_ssh_key"></a> [ssh\_key](#module\_ssh\_key) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//ssh_key | v15.0.1 |



## Resources

| Name | Type |
|------|------|
| [aws_key_pair.ssh_key](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/key_pair) | resource |
| [aws_route53_record.dpb_db](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_security_group.database_dpb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_acm_certificate.wildcard](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/acm_certificate) | data source |
| [aws_route53_zone.selected](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/route53_zone) | data source |
| [aws_subnet_ids.vpc_dpb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/subnet_ids) | data source |
| [aws_vpc.dpb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/vpc) | data source |


<!-- END_TF_DOCS -->
