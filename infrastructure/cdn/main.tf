data "aws_acm_certificate" "wildcard" {
  provider    = aws.useast1
  domain      = "*.${local.dns_zone_vanity}"
  statuses    = ["ISSUED"]
  most_recent = true
}

data "aws_caller_identity" "current" {
}