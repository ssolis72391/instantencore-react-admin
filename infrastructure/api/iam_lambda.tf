resource "aws_iam_role" "lambda_api" {
  name               = "${local.company}_lambda_api"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "edgelambda.amazonaws.com",
          "lambda.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

}

resource "aws_iam_role_policy_attachment" "aws-lambda-vpcaccess-execution-role" {
  role       = aws_iam_role.lambda_api.id
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy" "lambda_kms_access" {
  name   = "lambda_api"
  role   = aws_iam_role.lambda_api.id
  policy = <<EOF
{
  "Version" : "2012-10-17",
  "Statement": [ {
      "Effect": "Allow",
      "Action": [
         "kms:DescribeKey",
         "kms:GenerateDataKey*",
         "kms:Encrypt",
         "kms:ReEncrypt*",
         "kms:Decrypt"
       ],
       "Resource": ["*"]
    }
  ]
}
EOF

}
