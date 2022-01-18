# InstantEncore Digital Program Book Infrastructure

We use `terraform` to deploy our infrastructure to AWS environments.

## Table of Contents <!-- omit in toc -->

<!-- toc -->

- [Requirements](#requirements)
- [Usage](#usage)
  * [Up](#up)
  * [Down](#down)
- [Production Deployments](#production-deployments)
- [Development](#development)
  * [Formatting](#formatting)
- [Issues](#issues)
  * [Unable to run terraform plan/apply in api](#unable-to-run-terraform-planapply-in-api)
    + [Option 1: Tested, but more destructive](#option-1-tested-but-more-destructive)
    + [Option 2: More targeted, but not as tested](#option-2-more-targeted-but-not-as-tested)
  * [How to get sha if not in `terraform output`](#how-to-get-sha-if-not-in-terraform-output)
- [Yarn scripts](#yarn-scripts)

<!-- tocstop -->

## Requirements

- Terraform 14 (see [Terraform](https://github.com/SwitchCaseGroup/switchcase-engineering-docs/blob/master/docs/environments/terraform/README.md) in ` in switchcase-engineering-docs`)
- Permissions to deploy to the target environment in Azure DevOps

## Usage

\*\*These steps are for non-production deployments. It is meant as a quick way to spin up a development environment. See [Production Deployments](#production-deployments) below for info on production deployments.

Infrastructure is split into separate folders to allow for independent management. However it is still important to have a simple way to up or down all of the components.

`update_infrastructure.sh` is intended to address this mass update process. The script will `up` or `down` in a specific sequence based on the relationship / dependencies.

NOTE: This does expect that you have setup your `<workspace>.tfvars` in each `database/` and `api/`

Keeping with our standard practice all of the references to `<workspace>` are expected to be replaced with the name of the workspace you are.

### Up

To bring up or update the infrastructure:

1. Clone repo and checkout `master`.

   ```bash
   git clone git@github.com:SwitchCaseGroup/instantencore-digital-program-book-workspace.git
   cd instantencore-digital-program-book-workspace
   ```

2. Change directory to the `infrastructure/` directory.

   ```bash
   cd infrastructure
   ```

3. Prepare variables by copying `example.tfvars` to `<workspace>.tfvars`.

   ```bash
   cp example.tfvars <workspace>.tfvars
   ```

4. MANUALLY set the variables in `<workspace>.tfvars` for the target workspace.

5. Spin up the infrastructure for your workspace.

   ```bash
   ./update_infrastructure.sh <workspace> up
   ```

### Down

`down` will destroy everything except:

- Networking (VPC, etc): The network is very low cost to keep running and is foundational, should you want to spin up individual components on their own.
- CDN (Cloudfront, S3): Amazon does not recommend removing S3 buckets.

```
export AWS_PROFILE=switchcase
./update_infrastructure.sh <workspace> down
```

## Production Deployments

Production deployments of the infrastructure should be targeted at a type of change (Network, CDN, Database, or API).

Database and API rely on Network, so any changes to network need to happen first.

API depends on Database, so any changes to the database need to happen first.

The steps to deploy follow standard SwitchCase procedures:
[switchcase-engineering-docs: Terraform](https://github.com/SwitchCaseGroup/switchcase-engineering-docs/blob/master/docs/environments/terraform/README.md)

Please follow this order of operations if applying changes to more than one area:

1. [Network](network)
2. [CDN](cdn)
3. [Database](database) \*
4. [API](api) \*

_\* requires `production.tfvar` file. Use the `-var-file=production.tfvars` argument._

See the README files in each subfolder for additional details.

## Development

### Formatting

Install the following VSCode (forked) extension to enable validation and formatting of .tf files.
[l2fprod.terraform-fork](https://marketplace.visualstudio.com/items?itemName=l2fprod.terraform-fork).

This fork supports formatting of sub-projects which the official one does not.

## Issues

### Unable to run terraform plan/apply in api

You may see an error like:

```
To work with module.dpb-api-undeleteOneComponent.data.archive_file.placeholder
(orphan) its original provider configuration at
module.dpb-api-undeleteOneComponent.provider["registry.terraform.io/hashicorp/archive"]
is required, but it has been removed. This occurs when a provider
configuration is removed while objects created by that provider still exist in
the state. Re-add the provider configuration to destroy
module.dpb-api-undeleteOneComponent.data.archive_file.placeholder (orphan),
after which you can remove the provider configuration again.
```

This occurs when a lambda has been deleted in an incorrect way. At this point you are stuck. To fix this you have to go back to when the lambda was deleted, delete the module, then return to your branch and run apply again.

#### Option 1: Tested, but more destructive

```bash
# find the git_sha (commit sha)
terraform output  # note: this does not contain the sha yet. See notes below for how to get sha.
git checkout <sha>
terraform init
# This will destroy many resources (not just the one that was erroring). The necessary resoures will be re-added when you run terraform apply.
terraform destroy -target=module.dpb-api-undeleteOneComponent
git checkout <my_branch>
terraform init
terraform apply
```

#### Option 2: More targeted, but not as tested

This will update apigateway and so it is no longer referenced. Which means when you apply later, the removed resource will be destroyed.

```bash
# find the git_sha
terraform output  # note: this does not contain the sha yet. See notes below for how to get sha.
git checkout <sha>
# edit to remove apigateway variable and OAS30
terraform init
terraform apply
# undo changes
git checkout .
git checkout <my_branch>
terraform init
terraform apply
```

### How to get sha if not in `terraform output`

```bash
export AWS_PROFILE=switchcase
aws s3 ls s3://instantencore-terraform-states/env:/orange --recursive
```

Look at the dates of the files. Ex:

```bash
2021-09-13 18:02:15     212300 env:/orange/instantencore-dpb-workspace-api.tfstate
```

Look at git history on the file to find the commit sha.

## Yarn scripts

| Script   | Description                          |
| -------- | ------------------------------------ |
| yarn     | Install dependencies                 |
| yarn toc | Generates or updates this README TOC |
