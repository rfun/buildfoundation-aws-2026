// Instructor-led live demos. Rendered by pages/DemoPage.jsx at /demo/:demoId
//
// Block types inside an act:
//   { type: 'text',  text }              — a paragraph
//   { type: 'say',   text }              — the "say this out loud" call-out
//   { type: 'code',  lang, code }        — a code / terminal block
//   { type: 'list',  items }             — a bullet list
//   { type: 'table', head, rows }        — a small table

const demos = {
  'week4-terraform': {
    week: 4,
    accent: '#7b42bc', // HashiCorp purple
    title: 'Terraform on AWS',
    subtitle: 'Live demo — the workflow, not the assignment',
    time: '~25 minutes',
    repoPath: 'demo/week4-terraform',
    overview: `A walkthrough of the full Terraform loop — write, init, plan, apply, destroy — using resources that are free and that are deliberately NOT part of your Week 4 assignment. The assignment builds a VPC, EC2 instance, EBS volume and S3 bucket. This demo builds an SSM parameter, a DynamoDB table and a CloudWatch log group. Different services, identical workflow, identical file layout — so you can follow along here and still have to do the thinking on your own assignment.`,
    careerConnection:
      'Being handed an unfamiliar AWS service and expected to codify it from the provider docs is the actual day-to-day of a platform or DevOps engineer. Act 3 of this demo is that skill in miniature.',
    objectives: [
      'Run the terraform init / plan / apply / destroy loop end to end.',
      'Explain what the state file is, and see configuration drift happen live.',
      'Find any AWS resource in the Terraform provider docs and read its Argument Reference.',
      'Recognise a real project layout: provider.tf, variables.tf, main.tf, outputs.tf, .gitignore.',
      'Use variables, locals and outputs instead of hardcoding values.',
    ],
    prerequisites: [
      'Terraform 1.6 or newer installed (terraform -version).',
      'AWS CLI configured with working credentials (aws sts get-caller-identity).',
      'An AWS account — everything in this demo stays inside the free tier.',
      'A terminal and a text editor side by side.',
    ],
    cost: {
      label: 'What this costs',
      rows: [
        ['aws_ssm_parameter (Standard tier)', 'Free — Standard parameters have no charge'],
        ['aws_dynamodb_table (on-demand, empty)', 'Free tier covers 25 GB; no reads/writes means no request charges'],
        ['aws_cloudwatch_log_group (1-day retention)', 'Free tier covers 5 GB ingest; we never write a log line'],
      ],
      note: 'You still run terraform destroy at the end — partly for hygiene, mostly because watching everything disappear in one command is the point.',
    },
    acts: [
      {
        num: 1,
        title: 'The empty folder',
        time: '3 min',
        blocks: [
          { type: 'text', text: 'Start in an empty directory and type it live — it is only six lines of Terraform. Nothing is pre-baked, so nobody can claim it only works because it was set up beforehand.' },
          { type: 'code', lang: 'bash', code: 'mkdir /tmp/tf-demo && cd /tmp/tf-demo' },
          {
            type: 'code',
            lang: 'hcl',
            code: `# main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_ssm_parameter" "hello" {
  name  = "/demo/hello"
  type  = "String"
  value = "Hello from Terraform"
}`,
          },
          {
            type: 'code',
            lang: 'bash',
            code: `terraform init     # downloads the AWS provider, creates .terraform/
terraform plan     # "1 to add, 0 to change, 0 to destroy"
terraform apply    # type: yes`,
          },
          { type: 'say', text: 'That is the whole loop. Everything else today is detail.' },
          { type: 'text', text: 'Prove it exists twice — once in the Console (Systems Manager → Parameter Store) and once from the CLI:' },
          { type: 'code', lang: 'bash', code: 'aws ssm get-parameter --name /demo/hello' },
          { type: 'say', text: 'Terraform is not magic. It called the exact same AWS API that the Console calls when you click.' },
        ],
      },
      {
        num: 2,
        title: 'State, and the drift demo',
        time: '4 min',
        blocks: [
          {
            type: 'code',
            lang: 'bash',
            code: `ls -a                      # terraform.tfstate appeared
head -40 terraform.tfstate
terraform apply            # "No changes." — why?`,
          },
          { type: 'say', text: 'Terraform just compared three things: your code, the state file, and reality. All three agree, so there is nothing to do.' },
          { type: 'text', text: 'Now break it on purpose. This is the highest-value ninety seconds of the demo. First change the value in the code:' },
          { type: 'code', lang: 'bash', code: '# edit value = "Hello again"\nterraform plan             # 1 to change, with a ~ diff' },
          { type: 'text', text: 'Then go into the AWS Console and edit that same parameter by hand to something else. Come back to the terminal:' },
          { type: 'code', lang: 'bash', code: 'terraform plan             # Terraform noticed, and wants to put it back' },
          { type: 'say', text: 'That is configuration drift — and it is the answer to "why not just click around in the Console?" Terraform is the source of truth and it will correct you.' },
          { type: 'text', text: 'Land the state file rules while it is on screen:' },
          {
            type: 'list',
            items: [
              'Never commit it — it can hold secrets in plain text.',
              'Never edit it by hand.',
              'On a real team it lives in remote state (S3 + DynamoDB lock, or Terraform Cloud) so everyone shares one copy. Mention it; do not build it today.',
            ],
          },
          { type: 'code', lang: 'bash', code: 'terraform destroy          # clean up the throwaway folder' },
        ],
      },
      {
        num: 3,
        title: 'Reading the provider docs',
        time: '5 min',
        blocks: [
          { type: 'text', text: 'This is the skill that outlives the demo. Switch to the demo project, delete the DynamoDB resource block, and rebuild it live from the docs.' },
          {
            type: 'list',
            items: [
              'Open registry.terraform.io/providers/hashicorp/aws/latest/docs',
              'Search "dynamodb" in the left sidebar.',
              'Walk the anatomy of the page — every provider docs page has the same four parts.',
            ],
          },
          {
            type: 'table',
            head: ['Section', 'What it gives you'],
            rows: [
              ['Example Usage', 'Copy from here. Always. It is the fastest correct starting point.'],
              ['Argument Reference', 'What you can set, and whether it is (Required) or (Optional).'],
              ['Attribute Reference', 'What AWS hands back — like arn — that you can feed into outputs.'],
              ['Import', 'How to bring an existing hand-made resource under Terraform control.'],
            ],
          },
          { type: 'text', text: 'Point out the sidebar split too: Resources (aws_dynamodb_table — make this exist) versus Data Sources (aws_dynamodb_table — go look this up). Same name, opposite direction.' },
          { type: 'say', text: 'Nobody memorises this. There are roughly 1,400 resources in the AWS provider. The job is knowing the docs are the answer, and reading them fast.' },
          { type: 'text', text: 'Repeat the lookup for aws_cloudwatch_log_group and have a student read out which arguments are required.' },
        ],
      },
      {
        num: 4,
        title: 'A real project layout',
        time: '8 min',
        blocks: [
          { type: 'text', text: 'Now walk the files in demo/week4-terraform in this order:' },
          {
            type: 'table',
            head: ['File', 'The point'],
            rows: [
              ['provider.tf', 'Version constraints — why "~> 5.0" stops a major release breaking you. default_tags: tag everything, for free.'],
              ['variables.tf', 'Nothing is hardcoded. owner has no default, so Terraform prompts. Set environment = "banana" to show the validation block firing.'],
              ['terraform.tfvars', 'Where the values actually come from — and it is gitignored.'],
              ['main.tf', 'data (look it up) vs resource (make it exist). locals for computed names.'],
              ['outputs.tf', 'Values nobody typed — AWS generated that ARN.'],
              ['.gitignore', 'Read it aloud. State file out, lock file in.'],
            ],
          },
          { type: 'text', text: 'Then run the loop for real:' },
          {
            type: 'code',
            lang: 'bash',
            code: `terraform fmt              # canonical formatting — run before every commit
terraform validate         # syntax + types, no AWS calls, instant
terraform plan -out=tfplan
terraform apply tfplan     # applying a SAVED plan: no surprises in between
terraform output
terraform output -json dynamodb_table_arn`,
          },
          { type: 'text', text: 'Open the table in the Console and point at the tags — nobody typed those on the resource; default_tags added them. Then show what Terraform believes it owns:' },
          {
            type: 'code',
            lang: 'bash',
            code: `terraform state list
terraform state show aws_dynamodb_table.demo`,
          },
          { type: 'say', text: 'Look at the log group name — it references the table. I never told Terraform what order to build things in. It read the references and worked out the graph itself. That is what "declarative" means.' },
        ],
      },
      {
        num: 5,
        title: 'Destroy, and the handoff',
        time: '3 min',
        blocks: [
          { type: 'code', lang: 'bash', code: 'terraform destroy' },
          { type: 'text', text: 'Read the plan out loud before typing yes — 3 to destroy. Refresh the Console and show it empty.' },
          { type: 'say', text: 'Tear-down being one command is why cloud engineers can afford to experiment. Your assignment costs you nothing, as long as you destroy at the end.' },
          { type: 'text', text: 'Close on the assignment framing: you have seen the whole workflow, but the assignment uses different resources — VPC, EC2, EBS, S3 — so this folder will not copy-paste. The loop is identical and the docs page is the same page. Start by finding aws_vpc in the provider docs.' },
        ],
      },
    ],
    cheatsheet: [
      ['terraform init', 'Download providers — once per project, and after adding one'],
      ['terraform fmt', 'Auto-format .tf files'],
      ['terraform validate', 'Check syntax and types — no cloud calls'],
      ['terraform plan', 'Dry run: what WOULD change. Read this every time'],
      ['terraform apply', 'Make it real'],
      ['terraform output', 'Show output values'],
      ['terraform state list', 'What Terraform is tracking'],
      ['terraform destroy', 'Tear it all down'],
    ],
    troubleshooting: [
      ['no valid credential sources found', 'Run aws configure, or check AWS_PROFILE'],
      ['ResourceInUseException on the table', 'A previous run left it behind — terraform destroy, or change owner'],
      ['ParameterAlreadyExists', 'Same cause — that SSM path already exists in the account'],
      ['Provider download is slow', 'You should have run init before class. Keep talking through it'],
      ['Plan shows changes you did not make', 'Good — that is drift. Use it, do not hide it'],
    ],
  },
}

export default demos
