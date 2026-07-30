# variables.tf — the inputs to this project.
#
# DEMO TALKING POINT: variables are why the same code can build dev, staging and
# prod. Nothing below is hardcoded to one environment.

variable "aws_region" {
  description = "AWS region to deploy the demo resources into."
  type        = string
  default     = "us-east-1"
}

variable "owner" {
  description = "Your name — used in tags and resource names so nothing collides."
  type        = string
  # No default on purpose: Terraform will PROMPT for this if you don't set it.
  # Good moment to show terraform.tfvars as the alternative to being prompted.
}

variable "environment" {
  description = "Environment name (dev / test / prod). Drives naming."
  type        = string
  default     = "dev"

  # Validation blocks catch bad input at plan time instead of at apply time.
  validation {
    condition     = contains(["dev", "test", "prod"], var.environment)
    error_message = "environment must be one of: dev, test, prod."
  }
}

variable "log_retention_days" {
  description = "How long to keep CloudWatch logs. 1-3 days keeps this free."
  type        = number
  default     = 1
}
