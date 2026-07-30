const assignments = {
  4: {
    week: 4,
    title: 'Terraform Infrastructure',
    subtitle: 'Deploy cloud infrastructure with IaC',
    time: '~2 hours',
    tags: ['Terraform', 'VPC', 'EC2', 'S3', 'EBS'],
    overview: `In this assignment you'll move from clicking in the AWS Console to writing infrastructure as code. Using Terraform, you'll define and deploy a complete cloud environment: a VPC with subnets, an EC2 instance with an EBS volume attached, and an S3 bucket — all reproducible from a single \`terraform apply\`.`,
    resumeBullet: 'Built and deployed AWS cloud infrastructure (VPC, EC2, EBS, S3) as code using Terraform, enabling reproducible, version-controlled environment provisioning.',
    objectives: [
      'Write a Terraform configuration that provisions a VPC, subnets, and an internet gateway.',
      'Launch an EC2 instance inside the VPC and attach an EBS volume to it.',
      'Create an S3 bucket with versioning enabled.',
      'Use Terraform variables and outputs to make your configuration reusable.',
      'Understand the Terraform state file and why it must be preserved.',
    ],
    deliverables: [
      {
        title: 'Terraform code',
        desc: 'A working Terraform project (main.tf, variables.tf, outputs.tf) committed to your GitHub repo.',
      },
      {
        title: 'terraform plan output',
        desc: 'A screenshot of a clean terraform plan showing the resources to be created.',
      },
      {
        title: 'Deployed resources',
        desc: 'Screenshots from the AWS Console confirming the VPC, EC2, EBS, and S3 bucket exist.',
      }
    ],
    sections: [
      {
        title: 'Part 1 — VPC & Networking',
        steps: [
          'Create a VPC with CIDR block 10.0.0.0/16.',
          'Add a public subnet in one Availability Zone (10.0.1.0/24).',
          'Attach an Internet Gateway and update the route table so the subnet has internet access.',
          'Create a Security Group that allows SSH (port 22) from your IP only.',
        ],
      },
      {
        title: 'Part 2 — EC2 & EBS',
        steps: [
          'Define an EC2 resource using the Amazon Linux 2023 AMI (t2.micro, free tier).',
          'Place the instance in your public subnet and attach the security group.',
          'Create an EBS volume (8 GB, gp3) in the same AZ as the instance.',
          'Attach the EBS volume to the EC2 instance.',
        ],
      },
      {
        title: 'Part 3 — S3 Bucket',
        steps: [
          'Define an S3 bucket resource with a unique name (e.g., yourname-tf-lab-2026).',
          'Enable versioning on the bucket.',
          'Block all public access on the bucket.',
          'Add an output that prints the bucket name after apply.',
        ],
      },
    ],
    tips: [
      'Run terraform fmt before committing to keep your code clean.',
      'Use terraform plan before every apply to preview what will change.',
      'Never commit your .terraform/ directory or terraform.tfstate file — add them to .gitignore.',
      'If you get an error about AMI IDs, look up the current Amazon Linux 2023 AMI for us-east-1 in the EC2 console.',
    ],
    cleanup: 'Run terraform destroy when you\'re done to avoid any unexpected AWS charges. Verify all resources are removed in the AWS Console.',
  },

  5: {
    week: 5,
    title: 'Security & Resilience Hardening',
    subtitle: 'Harden your Terraform infrastructure',
    time: '~2 hours',
    tags: ['Security Groups', 'Auto Scaling', 'AWS Backup', 'IAM', 'Terraform'],
    overview: `Building on your Week 4 Terraform code, you'll now harden it with security and reliability best practices: tighter Security Group rules, an Auto Scaling Group to handle load spikes, and AWS Backup policies to protect your data. This assignment directly applies Week 5 content on Cloud Security, HA, and Reliability.`,
    resumeBullet: 'Hardened cloud infrastructure security and reliability by implementing least-privilege Security Groups, an Auto Scaling Group with CPU-based scaling, and automated backup/retention policies with AWS Backup.',
    objectives: [
      'Refine Security Group rules to follow the principle of least privilege.',
      'Replace the standalone EC2 instance with a Launch Template and Auto Scaling Group.',
      'Configure a scaling policy that responds to CPU utilization.',
      'Set up an AWS Backup plan with a retention policy.',
      'Document the reliability improvements over the Week 4 architecture.',
    ],
    deliverables: [
      {
        title: 'Updated Terraform code',
        desc: 'The Week 4 Terraform project updated with security hardening and ASG, committed to GitHub.',
      },
      {
        title: 'Auto Scaling Group screenshot',
        desc: 'AWS Console screenshot showing the ASG with at least one running instance.',
      },
      {
        title: 'AWS Backup plan screenshot',
        desc: 'Screenshot of the Backup plan showing the retention rule and resource assignment.',
      },
      {
        title: 'Reflection (½ page)',
        desc: 'What changed from Week 4? What risks does each change mitigate? What would you add next?',
      },
    ],
    sections: [
      {
        title: 'Part 1 — Security Group Hardening',
        steps: [
          'Remove the open SSH rule (port 22 from 0.0.0.0/0) if present.',
          'Add inbound rules only for HTTP (80) and HTTPS (443) from anywhere.',
          'Add SSH access only from your specific IP address (use /32 CIDR).',
          'Add a second security group for the database tier that only accepts traffic from the app tier SG.',
        ],
      },
      {
        title: 'Part 2 — Auto Scaling Group',
        steps: [
          'Create a Launch Template from your Week 4 EC2 configuration.',
          'Remove the standalone aws_instance resource and replace it with an aws_autoscaling_group.',
          'Set desired_capacity = 1, min_size = 1, max_size = 3.',
          'Add a target tracking scaling policy on CPUUtilization at 60% target.',
        ],
      },
      {
        title: 'Part 3 — AWS Backup',
        steps: [
          'Create an aws_backup_vault resource.',
          'Define an aws_backup_plan with a daily backup rule and 7-day retention.',
          'Create an aws_backup_selection that assigns your EBS volume to the plan.',
          'Verify the backup plan appears in the AWS Backup console.',
        ],
      },
    ],
    tips: [
      'Auto Scaling Groups require subnets in multiple AZs for true HA — extend your VPC to a second AZ.',
      'Launch Templates support versioning — increment the version when making changes rather than replacing.',
      'AWS Backup works with EBS, RDS, DynamoDB, and more — the same plan can cover multiple resource types.',
      'Use terraform state list to see all resources currently managed before making structural changes.',
    ],
    cleanup: 'Run terraform destroy to remove all resources. AWS Backup vaults cannot be deleted while they contain recovery points — delete recovery points first via the console.',
  },
}

export default assignments
