output "aws_region" {
  value = local.aws_region
}

output "vpc_id" {
  value = module.vpc_dpb.vpc_id
}

output "route_table_id" {
  value = module.vpc_dpb.route_table_id
}

output "cidr_block" {
  value = module.vpc_dpb.cidr_block
}

output "ipv6_cidr_block" {
  value = module.vpc_dpb.ipv6_cidr_block
}

output "subnet_ids" {
  value = [module.vpc_dpb.subnet_ids]
}

output "git_sha" {
  value       = local.git_sha
  description = "git SHA of the last run stored in the state file. helpful for terraform version updates"
} 