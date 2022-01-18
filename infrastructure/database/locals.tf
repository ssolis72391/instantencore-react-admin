module "sandbox_constants" {
  source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//sandbox_constants?ref=master"
}

locals {
  env          = terraform.workspace
  company      = "instantencore"
  aws_region   = "us-east-1"
  vpc_dpb_cidr = "172.17.128.0/19"
  git_head     = file("../../.git/HEAD")
  git_sha      = fileexists("../../.git/${trimspace(trimprefix(local.git_head, "ref:"))}") ? trimspace(file("../../.git/${trimspace(trimprefix(local.git_head, "ref:"))}")) : trimspace(local.git_head)

  common_tags = {
    Env        = local.env
    Company    = local.company
    managed_by = "terraform"
    Repository = "instantencore-digital-program-book-workspace/database"
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

  rds_port                = 3306
  rds_pw_root             = var.rds_pw_root
  rds_identifier          = "instantencore-dpb"
  rds_instance_class      = local.env == "production" ? "db.t3.micro" : "db.t3.micro"
  rds_multi_az            = local.env == "production" ? true : false
  rds_skip_final_snapshot = local.env == "production" ? false : true
  rds_deletion_protection = local.env == "production" ? true : false
  rds_backup_retention    = local.env == "production" ? 21 : 0

  cors_allowed_origin = local.is_production ? "https://*.${local.vanity_domain}" : "https://*.${local.vanity_domain},https://localhost,http://localhost,https://localhost:*,http://localhost:*"

  known_cidrs = {
    office_santa_clara = "64.201.255.29/32" # PAXIO Santa Clara Office (64.201.255.16/28)
    office_san_diego   = "104.9.49.53/32"
    home_zach          = "70.95.196.58/32"
    home_evan          = "76.167.195.62/32"
    home_randy         = "76.176.73.44/32"
    home_aaron         = "134.228.176.186/32"
    home_sander        = "70.95.8.4/32"
    home_alfredo       = "181.64.100.212/32"
    home_alfredo2      = "204.199.166.75/32"
  }

}
