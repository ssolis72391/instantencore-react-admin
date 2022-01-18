output "aws_region" {
  value = local.aws_region
}

output "git_sha" {
  value       = local.git_sha
  description = "git SHA of the last run stored in the state file. helpful for terraform version updates"
} 