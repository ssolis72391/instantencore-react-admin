# todo: rename
module "dpb_get-productions" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"

  description   = "instantencore_dpb get-productions function"
  function_name = "ie-dpb-api-get-productions"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "get-productions.handler"
  environment = {
    variables = {
      LIVE_NOTE_API_BASE_PATH = "https://instantencore.com/livenote"
      BYPASS_SECRET           = local.bypass_secret
      SENTRY_DSN              = local.sentry_dsn
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}

# todo: remove
module "dpb_delete-program" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"

  description   = "dpb_delete-program function"
  function_name = "dpb_delete-program"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "dpb_delete-program.handler"
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


# todo: remove
module "dpb_program_id" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"

  description   = "dpb_program_id function"
  function_name = "dpb_program_id"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "dpb_program_id.handler"
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

# todo: rename
module "dpb_get-programs" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"

  description   = "DPB API getPrograms function"
  function_name = "ie-dpb-api-getPrograms"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "getPrograms.handler"
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

# todo: rename
module "dpb_postOneProgram" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"

  description   = "DPB API postOneProgram function"
  function_name = "ie-dpb-api-postOneProgram"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "postOneProgram.handler"
  environment = {
    variables = {
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
      SENTRY_DSN            = local.sentry_dsn
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}

module "dpb-api-deleteOneProgram" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"

  description   = "DPB API deleteOneProgram function"
  function_name = "ie-dpb-api-deleteOneProgram"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "deleteOneProgram.handler"
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

# todo: remove
module "dpb_undelete-program" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "instantencore_dpb undelete-program function"
  function_name = "ie-dpb-api-undelete-program"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "undelete-program.handler"
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

# todo: remove
module "dpb_put-program" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "instantencore_dpb put-program function"
  function_name = "ie-dpb-api-put-program"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "put-program.handler"
  environment = {
    variables = {
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
      SENTRY_DSN            = local.sentry_dsn
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}

# todo: rename
module "dpb_get-user" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DBP API get-user function"
  function_name = "ie-dpb-api-get-user"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "get-user.handler"
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

module "dpb-api-putOneComponent" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API putOneComponent function"
  function_name = "ie-dpb-api-putOneComponent"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "putOneComponent.handler"
  environment = {
    variables = {
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      SENTRY_DSN            = local.sentry_dsn
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}

module "dpb-api-deleteOneComponent" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DBP API deleteOneComponent lambda function"
  function_name = "ie-dpb-api-deleteOneComponent"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "deleteOneComponent.handler"
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

# todo: rename
module "dpb-api-undeleteOneComponent" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API unDeleteOneComponent function"
  function_name = "ie-dpb-api-unDeleteOneComponent"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "unDeleteOneComponent.handler"
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

module "dpb-api-postOneComponent" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API postOneComponent lambda function"
  function_name = "ie-dpb-api-postOneComponent"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "postOneComponent.handler"
  environment = {
    variables = {
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
      SENTRY_DSN            = local.sentry_dsn
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}

module "dpb-api-getOneComponent" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "getOneComponent lambda function"
  function_name = "ie-dpb-api-getOneComponent"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "getOneComponent.handler"
  environment = {
    variables = {
      SENTRY_DSN            = local.sentry_dsn
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}


module "dpb-api-postOneCard" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API postOneCard lambda function"
  function_name = "ie-dpb-api-postOneCard"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "postOneCard.handler"
  environment = {
    variables = {
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
      SENTRY_DSN            = local.sentry_dsn
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}

module "dpb-api-getOneCard" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "getOneCard lambda function"
  function_name = "ie-dpb-api-getOneCard"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "getOneCard.handler"
  environment = {
    variables = {
      SENTRY_DSN            = local.sentry_dsn
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}

module "dpb-api-putOnePage" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API putOnePage lambda function"
  function_name = "ie-dpb-api-putOnePage"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "putOnePage.handler"
  environment = {
    variables = {
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
      SENTRY_DSN            = local.sentry_dsn
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}


module "dpb-api-deleteOnePage" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API deleteOnePage lambda function"
  function_name = "ie-dpb-api-deleteOnePage"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "deleteOnePage.handler"
  environment = {
    variables = {
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
      SENTRY_DSN            = local.sentry_dsn
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}

module "dpb-api-deleteOneCard" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API deleteOneCard lambda function"
  function_name = "ie-dpb-api-deleteOneCard"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "deleteOneCard.handler"
  environment = {
    variables = {
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
      SENTRY_DSN            = local.sentry_dsn
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}

module "dpb-api-putOneCard" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API putOneCard lambda function"
  function_name = "ie-dpb-api-putOneCard"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "putOneCard.handler"
  environment = {
    variables = {
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
      SENTRY_DSN            = local.sentry_dsn
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}

module "dpb-api-unDeleteOnePage" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API unDeleteOnePage function"
  function_name = "ie-dpb-api-unDeleteOnePage"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "unDeleteOnePage.handler"
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

module "ie-dpb-api-putRestoreOnePage" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API putRestoreOnePage function"
  function_name = "ie-dpb-api-putRestoreOnePage"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "putRestoreOnePage.handler"
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

module "dpb-api-putOneProgram" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API putOneProgram function"
  function_name = "ie-dpb-api-putOneProgram"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "putOneProgram.handler"
  environment = {
    variables = {
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      SENTRY_DSN            = local.sentry_dsn
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}

module "ie-dpb-api-putRestoreOneProgram" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API putRestoreOneProgram function"
  function_name = "ie-dpb-api-putRestoreOneProgram"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "putRestoreOneProgram.handler"
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

module "ie-dpb-api-getOnePage" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API getOnePage function"
  function_name = "ie-dpb-api-getOnePage"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "getOnePage.handler"
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

module "ie-dpb-api-getManyDesignVariables" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "getManyDesignVariables lambda function"
  function_name = "ie-dpb-api-getManyDesignVariables"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "getManyDesignVariables.handler"
  environment = {
    variables = {
      SENTRY_DSN            = local.sentry_dsn
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}


module "ie-dpb-api-putOneDesignVariable" {
  # https://github.com/SwitchCaseGroup/switchcase-terraform-modules/releases
  source        = "git@github.com:SwitchCaseGroup/switchcase-terraform-modules.git//lambda?ref=v15.0.1"
  description   = "DPB API putOneDesignVariable lambda function"
  function_name = "ie-dpb-api-putOneDesignVariable"
  memory_size   = local.lambda_defaults.memory_size
  timeout       = local.lambda_defaults.timeout
  runtime       = local.lambda_defaults.runtime
  company       = local.company
  tags          = local.common_tags
  role_arn      = aws_iam_role.lambda_api.arn
  handler       = "putOneDesignVariable.handler"
  environment = {
    variables = {
      DB_HOST               = local.db_host
      DB_USER               = local.db_user
      DB_PASSWORD           = local.db_password
      DB_NAME               = local.db_name
      DB_PORT               = local.db_port
      S3_BUCKET             = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"
      IMAGE_STORE_BASE_PATH = "https://dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}.s3.amazonaws.com"
      S3_REGION             = "us-east-1"
      SENTRY_DSN            = local.sentry_dsn
    }
  }
  vpc_config = {
    subnet_ids         = tolist(aws_subnet.lambda_private.*.id)
    security_group_ids = [aws_security_group.sg.id]
  }
}
