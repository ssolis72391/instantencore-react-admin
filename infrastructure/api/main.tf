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

resource "aws_security_group" "sg" {
  name        = "${local.api_name}-lambda-sg"
  description = "${local.api_name} lambda Allowed Ports"
  vpc_id      = data.aws_vpc.dpb.id
  tags        = merge(local.common_tags, { Name = "${local.api_name}-lambda-sg" })

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  # For now ALLOW everything inside our VPC
  ingress {
    from_port        = 0
    to_port          = 65535
    protocol         = "tcp"
    cidr_blocks      = [data.aws_vpc.dpb.cidr_block]
    ipv6_cidr_blocks = [data.aws_vpc.dpb.ipv6_cidr_block]
  }
}

module "apigateway" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source          = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//apigateway?ref=v15.0.1"
  aws_region      = local.aws_region
  dns_zone_vanity = local.vanity_domain
  variables = {
    #core
    version                           = local.api_version
    title                             = local.api_name
    aws_region                        = local.aws_region
    hostname                          = local.api_hostname
    domainname                        = local.vanity_domain
    lambda_alias                      = "live"
    lambda_execution_role_arn         = module.apigateway.lambda_execution_role_arn
    vtl_method_request_mapping        = module.apigateway.default_vtl_method_request_mapping
    vtl_method_error_response_mapping = module.apigateway.default_vtl_method_error_response_mapping
    #core
    #client programs
    client-getOneProgram-function-arn   = module.dpb-client-getOneProgram.function_arn
    client-getManyPrograms-function-arn = module.dpb-client-getManyPrograms.function_arn
    #client programs
    #productions
    get-productions-function-arn = module.dpb_get-productions.function_arn
    #productions
    #programs
    postOneProgram-function-arn       = module.dpb_postOneProgram.function_arn
    get-programs-function-arn         = module.dpb_get-programs.function_arn
    put-program-function-arn          = module.dpb_put-program.function_arn
    putOneProgram-function-arn        = module.dpb-api-putOneProgram.function_arn
    delete-program-function-arn       = module.dpb-api-deleteOneProgram.function_arn
    undelete-program-function-arn     = module.dpb_undelete-program.function_arn
    putRestoreOneProgram-function-arn = module.ie-dpb-api-putRestoreOneProgram.function_arn
    #programs
    #users
    get-user-function-arn = module.dpb_get-user.function_arn
    #users
    #components
    postOneComponent-function-arn     = module.dpb-api-postOneComponent.function_arn
    getOneComponent-function-arn      = module.dpb-api-getOneComponent.function_arn
    putOneComponent-function-arn      = module.dpb-api-putOneComponent.function_arn
    deleteOneComponent-function-arn   = module.dpb-api-deleteOneComponent.function_arn
    unDeleteOneComponent-function-arn = module.dpb-api-undeleteOneComponent.function_arn
    #components
    #cards
    postOneCard-function-arn   = module.dpb-api-postOneCard.function_arn
    getOneCard-function-arn    = module.dpb-api-getOneCard.function_arn
    putOneCard-function-arn    = module.dpb-api-putOneCard.function_arn
    deleteOneCard-function-arn = module.dpb-api-deleteOneCard.function_arn
    #cards
    #pages
    getOnePage-function-arn        = module.ie-dpb-api-getOnePage.function_arn
    putOnePage-function-arn        = module.dpb-api-putOnePage.function_arn
    deleteOnePage-function-arn     = module.dpb-api-deleteOnePage.function_arn
    putRestoreOnePage-function-arn = module.ie-dpb-api-putRestoreOnePage.function_arn
    #pages
    #design
    getManyDesignVariables-function-arn = module.ie-dpb-api-getManyDesignVariables.function_arn
    putOneDesignVariable-function-arn   = module.ie-dpb-api-putOneDesignVariable.function_arn
    #design
    #deprecated
    unDeleteOnePage-function-arn = module.dpb-api-unDeleteOnePage.function_arn
    #deprecated
  }
  body_template_file = "${path.root}/oas30-apigateway.yaml"
  # body_template_file = "${path.root}/../../api/openapi/openapi.yaml"
  name     = local.api_name
  hostname = local.api_hostname
  company  = local.company
  endpoint_configuration = {
    types = ["REGIONAL"]
  }
  minimum_compression_size = 1024
  certificate_arn          = data.aws_acm_certificate.wildcard.arn
  tags                     = local.common_tags
}

resource "aws_route53_record" "apigateway_v4" {
  zone_id = data.aws_route53_zone.selected.zone_id

  name = module.apigateway.endpoint_domain_name
  type = "A"

  alias {
    name                   = module.apigateway.endpoint_regional_domain_name
    zone_id                = module.apigateway.endpoint_regional_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "apigateway_v6" {
  zone_id = data.aws_route53_zone.selected.zone_id

  name = module.apigateway.endpoint_domain_name
  type = "AAAA"

  alias {
    name                   = module.apigateway.endpoint_regional_domain_name
    zone_id                = module.apigateway.endpoint_regional_zone_id
    evaluate_target_health = true
  }
}


