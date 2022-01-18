terraform {
  required_providers {
    # https://github.com/hashicorp/terraform-provider-archive/blob/master/CHANGELOG.md
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
    # https://github.com/hashicorp/terraform-provider-aws/blob/master/CHANGELOG.md
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.20"
    }
    # https://github.com/hashicorp/terraform-provider-local/blob/master/CHANGELOG.md
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
    # https://github.com/hashicorp/terraform-provider-null/blob/master/CHANGELOG.md
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }

  }
  required_version = ">= 0.14"

  backend "s3" {
    region = "us-west-2"
    bucket = "instantencore-terraform-states"
    key    = "instantencore-dpb-workspace-network.tfstate"
  }
}

# Configure the AWS Provider
provider "aws" {
  region = local.aws_region
  assume_role {
    role_arn     = local.assume_role_arn
    session_name = "terraform"
  }
}

provider "aws" {
  alias  = "useast1"
  region = "us-east-1"
  assume_role {
    role_arn     = local.assume_role_arn
    session_name = "terraform"
  }
}
