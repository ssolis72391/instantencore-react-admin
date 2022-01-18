output "aws_region" {
  value = local.aws_region
}

output "api_versions_stable" {
  value = module.apigateway.endpoint_stage_stable
}

output "endpoint_uri" {
  value = module.apigateway.direct_endpoint_uri
}

output "vanity_endpoint_uri" {
  value = "${module.apigateway.endpoint_scheme}${module.apigateway.endpoint_domain_name}/${module.apigateway.endpoint_stage_stable}/"
}

output "git_sha" {
  value       = local.git_sha
  description = "git SHA of the last run stored in the state file. helpful for terraform version updates"
}
