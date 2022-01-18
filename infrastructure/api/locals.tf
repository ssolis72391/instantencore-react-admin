module "sandbox_constants" {
  source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//sandbox_constants?ref=master"
}

locals {
  env        = terraform.workspace
  company    = "instantencore"
  aws_region = "us-east-1"
  git_head   = file("../../.git/HEAD")
  git_sha    = fileexists("../../.git/${trimspace(trimprefix(local.git_head, "ref:"))}") ? trimspace(file("../../.git/${trimspace(trimprefix(local.git_head, "ref:"))}")) : trimspace(local.git_head)

  common_tags = {
    Env        = local.env
    Company    = local.company
    managed_by = "terraform"
    Repository = "instantencore-digital-program-book-workspace/api"
    git_sha    = local.git_sha
  }

  is_production = local.env == "production"
  is_staging    = local.env == "copper"

  vanity_domains = {
    production = "instantencore.com"
    default    = "select_your_workspace"
  }

  vanity_domain = lookup(
    local.vanity_domains,
    local.env,
    "${local.env}.instantencore.com",
  )

  iam_roles = {
    production = "arn:aws:iam::331349321893:role/SwitchCaseAccountAccessRole_Terraform"
    default    = "arn:aws:iam:::select_your_workspace"
  }

  assume_role_arn = lookup(
    local.iam_roles,
    local.env,
    lookup(module.sandbox_constants.iam_roles, local.env, "unknown"),
  )

  dns_zone_vanity = local.vanity_domain

  cors_allowed_origin = local.is_production ? "https://*.${local.vanity_domain}" : "https://*.${local.vanity_domain},https://localhost,http://localhost,https://localhost:*,http://localhost:*"

  # https://sentry.io/InstantEncore/dpb-api-lambdas/
  sentry_dsns = {
    production = "https://17e829afda1a4360a78438caf40f751f@o552526.ingest.sentry.io/5678437"
    default    = "select_your_workspace"
  }

  sentry_dsn = lookup(
    local.sentry_dsns,
    local.env,
    "https://17e829afda1a4360a78438caf40f751f@o552526.ingest.sentry.io/5678437",
  )

  lambda_defaults = {
    memory_size   = 256
    timeout       = 29
    runtime       = "nodejs14.x"
  }

  db_host       = "dpb-db.${local.vanity_domain}" # TODO:
  db_user       = "root"                          # TODO: Change this to a user with custom password
  db_password   = var.rds_pw_root
  bypass_secret = var.bypass_secret
  db_name       = "dpb-api-db"
  db_port       = 3306

  api_version  = "1"
  api_hostname = "dpb-api"
  api_name     = "dpb-api"
}
