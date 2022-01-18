module "vpc_dpb" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//vpc?ref=v15.0.1"

  aws_region = local.aws_region
  cidr       = local.vpc_dpb_cidr
  name       = "dpb"
  tags       = local.common_tags
}

# 200 /32 TCP 443 ALLOW Allows inbound mysql traffic from whitelist ips
resource "aws_network_acl_rule" "v4-ingress-mysql" {
  count          = length(local.whitelist_access_cidr_blocks)
  rule_number    = 200 + count.index
  network_acl_id = module.vpc_dpb.network_acl_id
  egress         = false
  protocol       = "tcp"
  rule_action    = "allow"
  cidr_block     = element(local.whitelist_access_cidr_blocks, count.index)
  from_port      = 3306
  to_port        = 3306
}