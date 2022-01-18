# Infrastructure: CDN

The terraform scripts in this repo will setup a complete preview of digital program book `client-web` in a web environment:

* Sets up a cloudfront instance to deploy the digital program book code to.
* To access the client-web go to:
  - `https://dpb-web.<workspace>.instantencore.com`
  - Examples:
    - https://dpb-web.copper.instantencore.com
    - https://dpb-web.instantencore.com

## Inputs

None


## Notes

- You will always see the following line when running `terraform plan`. This is because it has to write the local file to disk. However, as long as the file on S3 isn't changing, you won't actually be uploading the file to S3.
  ```
  # local_file.appConfig-json will be created
  ```

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
| <a name="provider_aws"></a> [aws](#provider\_aws) | 3.34.0 |
| <a name="provider_aws.useast1"></a> [aws.useast1](#provider\_aws.useast1) | 3.34.0 |
| <a name="provider_local"></a> [local](#provider\_local) | 2.1.0 |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_distribution_name-cms"></a> [distribution\_name-cms](#input\_distribution\_name-cms) | n/a | `string` | `"dpb-cms"` | no |
| <a name="input_distribution_name-web"></a> [distribution\_name-web](#input\_distribution\_name-web) | n/a | `string` | `"dpb-web"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_aws_region"></a> [aws\_region](#output\_aws\_region) | n/a |
| <a name="output_git_sha"></a> [git\_sha](#output\_git\_sha) | git SHA of the last run stored in the state file. helpful for terraform version updates |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_dpb-cms"></a> [dpb-cms](#module\_dpb-cms) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//s3site | v15.0.1 |
| <a name="module_dpb-web"></a> [dpb-web](#module\_dpb-web) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//s3site | v15.0.1 |
| <a name="module_sandbox_constants"></a> [sandbox\_constants](#module\_sandbox\_constants) | git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//sandbox_constants | master |



## Resources

| Name | Type |
|------|------|
| [aws_s3_bucket.dpb-image-store](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_object.dpb-cms-appConfig-json](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_object) | resource |
| [aws_s3_bucket_policy.dpb-image-store](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_policy) | resource |
| [local_file.appConfig-json](https://registry.terraform.io/providers/hashicorp/local/latest/docs/resources/file) | resource |
| [aws_acm_certificate.wildcard](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/acm_certificate) | data source |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.s3_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |


<!-- END_TF_DOCS -->
