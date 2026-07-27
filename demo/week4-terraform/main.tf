# main.tf — the resources.
#
# Everything in this file is free (or free-tier) and takes seconds to create and
# destroy. NONE of it overlaps with the Week 4 assignment (VPC / EC2 / EBS / S3) —
# this is the teaching demo, not the answer key.

# ── Data sources: read-only lookups, they create nothing ────────────────────────
# DEMO TALKING POINT: `data` = "go ask AWS about something that already exists".
# `resource` = "make this exist". This is the single most useful distinction in
# Terraform and it's worth 60 seconds.

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

# ── A locals block: computed values reused across resources ────────────────────
locals {
  # e.g. "rohit-dev" — keeps every resource name unique per student per env.
  name_prefix = "${var.owner}-${var.environment}"
}

# ── 1. SSM Parameter: the simplest possible resource ───────────────────────────
# Standard-tier SSM parameters are free. This is a great first `apply` because it
# completes in about a second.
#
# PROVIDER DOCS: registry.terraform.io/providers/hashicorp/aws/latest/docs
#   → search "ssm_parameter" → aws_ssm_parameter
resource "aws_ssm_parameter" "greeting" {
  name        = "/${local.name_prefix}/demo/greeting"
  description = "A throwaway config value to demonstrate Terraform."
  type        = "String"
  value       = "Hello from Terraform, ${var.owner}!"
}

# ── 2. DynamoDB table: a resource with enough arguments to make docs matter ────
# PAY_PER_REQUEST billing means you pay per read/write, and the AWS Free Tier
# covers 25 GB of storage — an empty demo table costs nothing.
#
# DEMO TALKING POINT: this is where you STOP typing and open the provider docs.
# Ask the room: "how do we know a hash_key needs a matching attribute block?"
# Answer: we don't — we read the docs. Show the Argument Reference and the
# Example Usage section on the aws_dynamodb_table page.
resource "aws_dynamodb_table" "demo" {
  name         = "${local.name_prefix}-demo-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "ItemId"

  attribute {
    name = "ItemId"
    type = "S" # S = String, N = Number, B = Binary
  }

  # Nested blocks like this one are common — the docs list them under
  # "Argument Reference" as separate sub-sections.
  point_in_time_recovery {
    enabled = false # keep it off: PITR is a paid feature
  }

  tags = {
    Name = "${local.name_prefix}-demo-table"
  }
}

# ── 3. CloudWatch Log Group: shows dependencies and interpolation ──────────────
# DEMO TALKING POINT: notice the name references the DynamoDB table's attribute.
# Terraform reads that reference and works out the ORDER by itself — the table is
# created before the log group. You never write "step 1, step 2". That's what
# "declarative" means. Show this with `terraform graph` if you have time.
resource "aws_cloudwatch_log_group" "demo" {
  name              = "/build-fellowship/${aws_dynamodb_table.demo.name}"
  retention_in_days = var.log_retention_days
}
