# bucket for dpb images
resource "aws_s3_bucket" "dpb-image-store" {
  acl    = "private"
  bucket = "dpb-image-store-${replace(local.dns_zone_vanity, ".", "-")}"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "DELETE"]
    allowed_origins = local.cors_allowed_origin
  }
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    sid    = "1"
    effect = "Allow"

    actions   = ["s3:PutObject", "s3:PutObjectAcl"]
    resources = ["${aws_s3_bucket.dpb-image-store.arn}/*"]

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:PrincipalArn"

      values = [
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/instantencore_lambda_api"
      ]
    }
  }

  statement {
    sid    = "2"
    effect = "Allow"

    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.dpb-image-store.arn}/*"]

    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

resource "aws_s3_bucket_policy" "dpb-image-store" {
  bucket = aws_s3_bucket.dpb-image-store.bucket
  policy = data.aws_iam_policy_document.s3_policy.json
}
