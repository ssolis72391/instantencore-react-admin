#
# NAT on Private Subnets for Lambda functions is required
# https://aws.amazon.com/premiumsupport/knowledge-center/internet-access-lambda-function/
#
data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  subnet_count  = 2
  subnet_offset = 14 - local.subnet_count
}

resource "aws_subnet" "lambda_private" {
  count = local.subnet_count

  vpc_id            = data.aws_vpc.dpb.id
  availability_zone = data.aws_availability_zones.available.names[count.index]

  # http://blog.itsjustcode.net/blog/2017/11/18/terraform-cidrsubnet-deconstructed/
  cidr_block      = cidrsubnet(data.aws_vpc.dpb.cidr_block, 4, local.subnet_offset + count.index)
  ipv6_cidr_block = cidrsubnet(data.aws_vpc.dpb.ipv6_cidr_block, 8, local.subnet_offset + count.index)

  assign_ipv6_address_on_creation = true
  map_public_ip_on_launch         = false

  lifecycle {
    ignore_changes = [
      availability_zone,
    ]
  }
  tags = merge(local.common_tags, { Name = "${local.api_name}-sn-${count.index}" })
}

resource "aws_eip" "nat" {
  vpc  = true
  tags = merge(local.common_tags, { Name = "${local.api_name}-nat" })
}

resource "aws_nat_gateway" "gw" {
  allocation_id = aws_eip.nat.id
  subnet_id     = tolist(data.aws_subnet_ids.vpc_dpb.ids)[0]
  tags          = merge(local.common_tags, { Name = "${local.api_name}-nat" })

  // Note: It's recommended to denote that the NAT Gateway depends on the Internet Gateway
  // for the VPC in which the NAT Gateway's subnet is located.
  // depends_on = ["module.vpc_main.igw_id"]
}


resource "aws_route_table" "lambda_private" {
  vpc_id = data.aws_vpc.dpb.id
  tags   = merge(local.common_tags, { Name = "${local.api_name}-rt" })
}

resource "aws_route" "lambda_private_ipv4" {
  route_table_id         = aws_route_table.lambda_private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.gw.id
  depends_on             = [aws_route_table.lambda_private]
}

/*
resource "aws_route" "lambda_private_ipv6" {
  count      = local.subnet_count

  route_table_id         = aws_route_table.lambda_private.id
  destination_ipv6_cidr_block = "::/0"
  # gateway_id                  = module.vpc_main.igw_id
}
*/

resource "aws_route_table_association" "a" {
  count          = local.subnet_count
  subnet_id      = element(aws_subnet.lambda_private.*.id, count.index)
  route_table_id = aws_route_table.lambda_private.id
}
