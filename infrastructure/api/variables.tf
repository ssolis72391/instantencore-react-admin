variable "rds_pw_root" {
  description = "password for dpb mysql user root"
  type        = string
  sensitive   = true
}

variable "bypass_secret" {
  description = "The AWS Web Application Firewall (WAF) secret to allow requests and prevent bot classification"
  type        = string
  sensitive   = true
}
