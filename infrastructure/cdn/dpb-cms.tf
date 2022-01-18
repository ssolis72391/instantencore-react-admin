variable "distribution_name-cms" {
  default = "dpb-cms"
}

locals {
  cdn_dpb_cms = {
    embed_cache_behavior = {
      path_pattern     = "/*"
      allowed_methods  = ["GET", "HEAD", "OPTIONS"]
      cached_methods   = ["GET", "HEAD"]
      target_origin_id = "${module.dpb-cms.origin_id_prefix}${var.distribution_name-cms}-${replace(local.dns_zone_vanity, ".", "-")}"
      compress         = true

      # Origin needed for CORS for script embed
      forwarded_values_headers         = ["Origin"]
      forwarded_values_query_string    = false
      forwarded_values_cookies_forward = "none"

      viewer_protocol_policy = "redirect-to-https"
      min_ttl                = 0
      default_ttl            = 86400
      max_ttl                = 31536000
    }

    custom_error_response_403 = {
      error_code            = 403
      error_caching_min_ttl = 10
      response_code         = 403
      response_page_path    = "/errors/403.html"
    }

    custom_error_response_404 = {
      error_code            = 404
      error_caching_min_ttl = 0
      response_code         = 200
      response_page_path    = "/dpb-cms/index.html"
    }
  }
}

module "dpb-cms" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//s3site?ref=v15.0.1"

  acm_certificate_arn     = data.aws_acm_certificate.wildcard.arn
  aliases                 = ["${var.distribution_name-cms}.${local.dns_zone_vanity}"]
  bucket_name             = "${var.distribution_name-cms}-${replace(local.dns_zone_vanity, ".", "-")}"
  log_bucket              = "logs-${local.aws_region}-${replace(local.dns_zone_vanity, ".", "-")}"
  distribution_name       = var.distribution_name-cms
  dns_zone_vanity         = local.dns_zone_vanity
  cors_allowed_origins    = local.cors_allowed_origin
  custom_error_responses  = [local.cdn_dpb_cms.custom_error_response_403, local.cdn_dpb_cms.custom_error_response_404]
  ordered_cache_behaviors = [local.cdn_dpb_cms.embed_cache_behavior]
  tags                    = local.common_tags
  web_acl_id              = ""
}

resource "local_file" "appConfig-json" {
  content  = jsonencode(local.appConfig-json)
  filename = "${path.module}/rendered/${terraform.workspace}/content/dpb-cms/appConfig.json"
}

resource "aws_s3_bucket_object" "dpb-cms-appConfig-json" {
  bucket        = module.dpb-cms.origin_bucket
  acl           = "public-read"
  key           = "/appConfig.json"
  source        = local_file.appConfig-json.filename
  content_type  = "application/json"
  cache_control = "no-cache, no-store"
  # etag md5 generally should be filemd5 pointing to the file, but we have a chicken 
  # and egg problem because the file isn't created during plan only as part of apply
  etag          = md5(local_file.appConfig-json.content)
}
