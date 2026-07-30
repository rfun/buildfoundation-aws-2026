# outputs.tf — values printed after `terraform apply`.
#
# DEMO TALKING POINT: outputs are how one Terraform project hands values to a
# human, to a script, or to another Terraform project. Show `terraform output`
# after apply, then `terraform output -json`.

output "account_id" {
  description = "The AWS account these resources landed in."
  value       = data.aws_caller_identity.current.account_id
}

output "region" {
  description = "The region these resources landed in."
  value       = data.aws_region.current.name
}

output "dynamodb_table_name" {
  description = "Name of the demo DynamoDB table."
  value       = aws_dynamodb_table.demo.name
}

output "dynamodb_table_arn" {
  description = "ARN of the demo table — note we never typed this, AWS generated it."
  value       = aws_dynamodb_table.demo.arn
}

output "parameter_name" {
  description = "SSM parameter path. Try: aws ssm get-parameter --name <this>"
  value       = aws_ssm_parameter.greeting.name
}

output "log_group_name" {
  description = "CloudWatch log group name."
  value       = aws_cloudwatch_log_group.demo.name
}
