resource "aws_s3_bucket" "logs" {
  bucket = "logs-${local.aws_region}-${replace(local.dns_zone_vanity, ".", "-")}"
  acl    = "log-delivery-write"
  tags   = local.common_tags
}
