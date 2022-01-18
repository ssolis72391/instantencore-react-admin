module "dpb-client-getOneProgram" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"

  description   = "instantencore_dpb getOneProgram data function"
  function_name = "ie-dpb-api-client-getOneProgram"
  memory_size   = 128
  timeout       = 29
  runtime       = "nodejs14.x"
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "client-getOneProgram.handler"
  environment = {
    variables = {
      DB_HOST     = local.db_host
      DB_USER     = local.db_user
      DB_PASSWORD = local.db_password
      DB_NAME     = local.db_name
      DB_PORT     = local.db_port
      SENTRY_DSN  = local.sentry_dsn
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}

module "dpb-client-getManyPrograms" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"

  description   = "instantencore_dpb client getManyPrograms data function"
  function_name = "ie-dpb-api-client-getManyPrograms"
  memory_size   = 128
  timeout       = 29
  runtime       = "nodejs14.x"
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "client-getManyPrograms.handler"
  environment = {
    variables = {
      DB_HOST     = local.db_host
      DB_USER     = local.db_user
      DB_PASSWORD = local.db_password
      DB_NAME     = local.db_name
      DB_PORT     = local.db_port
      SENTRY_DSN  = local.sentry_dsn
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}
