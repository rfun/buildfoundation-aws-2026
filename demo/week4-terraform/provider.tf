# provider.tf — which providers this project needs, and how to configure them.
#
# DEMO TALKING POINT: `required_providers` is what `terraform init` reads to know
# what to download. The version constraint "~> 5.0" means "any 5.x, but not 6.0" —
# so a new major release of the AWS provider can't silently break this project.

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# The provider block configures HOW Terraform talks to AWS.
# Credentials are NOT written here — they come from your environment
# (`aws configure`, or AWS_PROFILE / AWS_ACCESS_KEY_ID env vars).
# Never put access keys in a .tf file.
provider "aws" {
  region = var.aws_region

  # Every resource created by this project gets these tags automatically.
  # This is a real-world habit worth showing: it makes cleanup and cost
  # attribution trivial.
  default_tags {
    tags = {
      Project   = "build-fellowship-week4-demo"
      ManagedBy = "terraform"
      Owner     = var.owner
    }
  }
}
