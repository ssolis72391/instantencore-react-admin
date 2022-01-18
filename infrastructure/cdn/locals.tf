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
    Repository = "instantencore-digital-program-book-workspace/cdn"
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

  appConfig-jsons = {
    production = {
      "apiBasePath" : "https://dpb-api.${local.dns_zone_vanity}/1/",
      "ieWebBasePath" : "https://${local.dns_zone_vanity}/",
      "authPath" : "https://${local.dns_zone_vanity}/DigitalProgramBook/ValidateToken/",
      "usingMock" : false,
      "previewRoot": "https://dpb-web.${local.dns_zone_vanity}",
    }
    default = {}
    copper = {
      "apiBasePath" : "https://dpb-api.${local.dns_zone_vanity}/1/",
      "ieWebBasePath" : "https://${local.dns_zone_vanity}/",
      "authPath" : "https://${local.dns_zone_vanity}/DigitalProgramBook/ValidateToken/",
      "usingMock" : false,
      "previewRoot": "https://dpb-web.${local.dns_zone_vanity}",
    }
    orange = {
      "apiBasePath" : "https://dpb-api.${local.dns_zone_vanity}/1/",
      "ieWebBasePath" : "https://${local.dns_zone_vanity}/",
      "authPath" : "",
      "usingMock" : false,
      "previewRoot": "https://dpb-web.${local.dns_zone_vanity}",
    }
    evan = {
      "apiBasePath" : "https://dpb-api.${local.dns_zone_vanity}/1/",
      "ieWebBasePath" : "https://${local.dns_zone_vanity}/",
      "authPath" : "",
      "usingMock" : false,
      "previewRoot": "https://dpb-web.${local.dns_zone_vanity}",
    }
    zach = {
      "apiBasePath" : "https://dpb-api.${local.dns_zone_vanity}/1/",
      "ieWebBasePath" : "https://${local.dns_zone_vanity}/",
      "authPath" : "https://${local.dns_zone_vanity}/DigitalProgramBook/ValidateToken/",
      "usingMock" : false,
      "previewRoot": "https://dpb-web.${local.dns_zone_vanity}",
    }
    silver = {
      "apiBasePath" : "https://dpb-api.${local.dns_zone_vanity}/1/",
      "ieWebBasePath" : "https://${local.dns_zone_vanity}/",
      "authPath" : "",
      "usingMock" : false,
      "previewRoot": "https://dpb-web.${local.dns_zone_vanity}",
    }
  }

  appConfig-json = lookup(
    local.appConfig-jsons,
    local.env,
    {
      "apiBasePath" : "https://dpb-api.${local.dns_zone_vanity}/1/",
      "ieWebBasePath" : "https://${local.dns_zone_vanity}/",
      "authPath" : "", # empty means token auth is disabled
      "usingMock" : true,
      "previewRoot": "https://dpb-web.${local.dns_zone_vanity}",
    },
  )

  dns_zone_vanity = local.vanity_domain

  cors_allowed_origin = local.is_production ? ["https://*.${local.vanity_domain}"] : ["https://*.${local.vanity_domain}", "https://localhost", "http://localhost", "https://localhost:*", "http://localhost:*"]
}
