resource "aws_security_group" "database_dpb" {
  name        = "${local.company}-database-dpb"
  description = "dpb db Allowed Ports"
  vpc_id      = data.aws_vpc.dpb.id
  tags        = merge(local.common_tags, { Name = "${local.company}-database-dpb" })

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  # For now ALLOW everything inside our VPC
  ingress {
    description      = ""
    from_port        = 0
    to_port          = 65535
    protocol         = "tcp"
    cidr_blocks      = [data.aws_vpc.dpb.cidr_block]
    ipv6_cidr_blocks = [data.aws_vpc.dpb.ipv6_cidr_block]
  }

  # Always allowed addresses
  dynamic "ingress" {
    for_each = [
      { description = "office_santa_clara", cidr_block = [local.known_cidrs.office_santa_clara] },
      { description = "office_san_diego", cidr_block = [local.known_cidrs.office_san_diego] },
      { description = "home_zach", cidr_block = [local.known_cidrs.home_zach] },
      { description = "home_evan", cidr_block = [local.known_cidrs.home_evan] },
    ]
    content {
      description = ingress.value["description"]
      cidr_blocks = ingress.value["cidr_block"]
      from_port   = 3306
      to_port     = 3306
      protocol    = "tcp"
    }
  }

  # Sandbox only allowed addresses
  dynamic "ingress" {
    for_each = local.is_production ? [] : [
      { description = "home_alfredo", cidr_block = [local.known_cidrs.home_alfredo] },
      { description = "home_alfredo2", cidr_block = [local.known_cidrs.home_alfredo2] }
    ]
    content {
      description = ingress.value["description"]
      cidr_blocks = ingress.value["cidr_block"]
      from_port   = 3306
      to_port     = 3306
      protocol    = "tcp"
    }
  }

}

module "db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 3.0"

  identifier = local.rds_identifier

  publicly_accessible = true

  # All available versions: http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html#MySQL.Concepts.VersionMgmt
  engine               = "mysql"
  engine_version       = "8.0.21"
  family               = "mysql8.0" # DB parameter group
  major_engine_version = "8.0"      # DB option group
  instance_class       = local.rds_instance_class

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = false

  username = "root"
  password = local.rds_pw_root
  port     = local.rds_port

  multi_az               = local.rds_multi_az
  subnet_ids             = data.aws_subnet_ids.vpc_dpb.ids
  vpc_security_group_ids = [aws_security_group.database_dpb.id]

  maintenance_window              = "Mon:06:00-Mon:09:00"
  backup_window                   = "03:00-06:00"
  enabled_cloudwatch_logs_exports = ["general"]

  backup_retention_period = local.rds_backup_retention
  skip_final_snapshot     = local.rds_skip_final_snapshot
  deletion_protection     = local.rds_deletion_protection

  performance_insights_enabled = false
  # performance_insights_retention_period = 7
  create_monitoring_role = false

  parameters = [
    {
      name  = "character_set_client"
      value = "utf8mb4"
    },
    {
      name  = "character_set_server"
      value = "utf8mb4"
    }
  ]

  tags = local.common_tags
}

resource "aws_route53_record" "dpb_db" {
  zone_id = data.aws_route53_zone.selected.zone_id
  name    = "dpb-db.${local.vanity_domain}"
  type    = "CNAME"
  ttl     = "300"
  records = [module.db.db_instance_address]
}
