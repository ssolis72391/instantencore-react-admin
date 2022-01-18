module "ssh_key" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//ssh_key?ref=v15.0.1"

  name   = local.env == "default" ? "switchcase" : local.env
  prefix = "dpb-"
}

resource "aws_key_pair" "ssh_key" {
  key_name   = module.ssh_key.name
  public_key = module.ssh_key.public_key
}

data "aws_route53_zone" "selected" {
  name = local.dns_zone_vanity
}

data "aws_acm_certificate" "wildcard" {
  domain      = "*.${local.dns_zone_vanity}"
  statuses    = ["ISSUED"]
  most_recent = true
}

data "aws_vpc" "dpb" {
  filter {
    name = "tag:Name"
    # values = ["${local.company}-dpb-vpc"]
    values = ["dpb-vpc"]
  }
}

data "aws_subnet_ids" "vpc_dpb" {
  vpc_id = data.aws_vpc.dpb.id
  filter {
    name = "tag:Name"
    # values = ["${local.company}-dpb-sn-*"]
    values = ["dpb-sn-*"] # Forcing filter to only grab main subnet. The lambda subnets are not desired here (and cause cluster creation to fail)
  }
}

