// Week 4 slide data. See ./index.js for the shape of a slide
// and how images/notes are resolved.

export default {
  title: 'Infrastructure as Code',
  slides: [
    {
      type: 'slide-image-bg',
      note: 'Title slide. Open with: "Who has deployed something in the AWS Console by clicking around?" Then ask: "What happens if you need to do it again? Or in a different account?"',
      content: { ariaLabel: 'The Build Fellowship — title slide with gradient logo and buildfellowship.com' },
    },
    {
      type: 'slide-section-light',
      note: 'IaC week. The transition from clicking to coding is a big mental shift for some students. Be patient and use the quiz to warm them up.',
      content: { brandHeader: 'The Build Fellowship', title: 'Infrastructure As Code (IaC)', week: 'Week 4', date: 'July 2026' },
    },
    {
      type: 'slide-agenda',
      note: 'Quiz first — 10 minutes. Then IaC concepts. Then Terraform specifically. End with a live demo. The demo is the most valuable part.',
      content: { title: 'Agenda', items: ['Quiz', 'IaC', 'Terraform', 'Demo'] },
    },
    {
      type: 'slide-content',
      note: 'This is a big mental shift for some — clicking to coding. Naming the outcome upfront helps: by the end they\'ll have written and applied real Terraform, not just watched a demo.',
      content: {
        title: 'Learning Outcomes',
        subtitle: 'By the end of today, you\'ll be able to...',
        items: [
          'Explain why Infrastructure as Code solves the problems of manual deployment',
          'Read and write basic Terraform (HCL) to define AWS resources',
          'Run the terraform init / plan / apply / destroy workflow',
          'Start this week\'s assignment: deploying a VPC, EC2 instance, and S3 bucket with Terraform',
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'Traditional approach: GUI or scripts. Problems: manual, error-prone, configuration drift, hard to scale. Ask: "Has anyone seen a dev environment that doesn\'t match prod?" That\'s configuration drift.',
      content: {
        title: 'Traditional Infrastructure Deployment',
        sections: [
          {
            heading: 'Methods',
            items: ['Graphical User Interface (GUI)', 'Scripts – Platform specific'],
          },
          {
            heading: 'Limitations',
            items: [
              'Manual and time-consuming process',
              'Error-prone',
              'Inconsistency and Configuration drift',
              'Difficulty to keep multiple environments in sync',
              'Poor scalability',
              'Difficult to document',
            ],
          },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'The fix for everything on the previous slide. Emphasise "repeatable and consistent" — the same code produces Dev, UAT and Prod, so environments cannot silently drift apart. Tie source control back to the Git work they already did in week 1.',
      content: {
        title: 'Infrastructure as Code',
        subtitle: 'What is IaC?',
        definitionBox: 'Managing and provisioning of infrastructure through code. Allows automation of creation and modification of infrastructure.',
        sections: [
          {
            heading: 'Benefits',
            items: [
              'Automation in one and multi-cloud',
              'Speed and efficiency',
              'Repeatable and consistent (Dev, UAT, Prod)',
              'Source control and versioning',
              'Team collaboration',
              'CI/CD pipelines',
              'Simplify, standardize, and scale at ease',
            ],
          },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'Terraform is the IaC tool we use. Walk the file layout on the right: you write .tf files, Terraform talks to the cloud provider, and it records what it built in terraform.tfstate. Stress the state file — it is Terraform\'s memory of what exists. Delete it and Terraform forgets your infrastructure (and will try to create it all again). Never commit it to Git; it can contain secrets.',
      content: {
        title: 'Infrastructure as Code — Terraform',
        subtitle: 'What is Terraform?',
        dense: true,
        definitionBox: 'Terraform is an open-source tool that lets you build, change and manage infrastructure using code.',
        sections: [
          {
            heading: 'Benefits',
            items: [
              'Declarative language — you describe the end state, not the steps',
              'Cloud agnostic / multi-cloud support',
              'Large list of providers available',
              'Source control with Git or Terraform Cloud',
              'RBAC workspaces',
              'Policy as code (approve and reject automation)',
            ],
          },
          {
            heading: 'Project files',
            items: [
              'main.tf — the resources you want',
              'provider.tf — which cloud, which region',
              'variables.tf / terraform.tfvars — inputs',
              'output.tf — values printed after apply',
              'terraform.tfstate — what Terraform actually built (never commit)',
            ],
          },
        ],
        figure: {
          src: 'slides/week4/terraform-state-file.jpg',
          alt: 'Diagram: terraform.tfstate, terraform.tfvars, provider and resource .tf files feed into Terraform, which provisions resources in GCP, Azure and AWS',
          caption: 'Your .tf files and state file feed Terraform, which provisions resources in any supported cloud.',
          credit: 'pynetlabs.com',
        },
      },
    },
    {
      type: 'slide-content',
      note: 'Students always ask "why not CloudFormation?" — answer it before they ask. The honest trade-off is the state file: CloudFormation manages state for you, Terraform makes you own it. Don\'t hide that; it sets up the state slide two ahead. If anyone has AWS experience, ask what they\'ve used.',
      content: {
        title: 'Why Terraform?',
        subtitle: 'Terraform is not the only IaC tool — here\'s the landscape',
        dense: true,
        matrix: {
          head: ['Tool', 'Language', 'Works with', 'Best when'],
          rows: [
            ['Terraform', 'HCL — declarative', 'AWS, Azure, GCP, GitHub, Cloudflare, Datadog… (~1,400 AWS resources alone)', 'You want one tool and one language across every provider'],
            ['CloudFormation', 'YAML / JSON', 'AWS only', 'You are all-in on AWS and want a native service with no state file to manage'],
            ['AWS CDK', 'TypeScript, Python, Java, Go', 'AWS only — compiles down to CloudFormation', 'Your team would rather write real code with loops and classes than config'],
            ['Pulumi', 'TypeScript, Python, Go, C#', 'Multi-cloud', 'You want CDK-style real code but without being tied to AWS'],
          ],
        },
        sections: [
          {
            heading: 'Why we teach Terraform',
            items: [
              'It is the one employers ask for — "Terraform" appears in cloud job postings far more than any competing IaC tool',
              'The syntax transfers: what you learn on AWS this week works on Azure, GCP, GitHub or Cloudflare unchanged',
              'plan is an explicit, separate step — you always see what will change before it changes',
              'Honest trade-off: you own the state file yourself. CloudFormation hides that from you. That is the price of being cloud-agnostic',
            ],
          },
        ],
      },
    },
    {
      type: 'slide-code',
      note: 'Slow down here — this is the first HCL they see. Read the first line out loud as four separate things: block type, resource type, local name, then the braces. The address point at the bottom is the one that unlocks everything else: aws_dynamodb_table.demo is how Terraform names things internally, and it is also how it works out build order.',
      content: {
        title: 'Anatomy of a Terraform Resource',
        subtitle: 'Every block you write this week looks like this',
        code: `resource "aws_dynamodb_table" "demo" {
  name         = "students-demo-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "ItemId"

  attribute {
    name = "ItemId"
    type = "S"
  }
}

# Reference it somewhere else:
output "table_arn" {
  value = aws_dynamodb_table.demo.arn
}`,
        annotations: [
          { label: 'resource', text: 'The block type. Others you will use: data, variable, output, provider, locals.' },
          { label: '"aws_dynamodb_table"', text: 'The resource type. The aws_ prefix names the provider. This is the string you search for in the docs.' },
          { label: '"demo"', text: 'Your local name — you invent it. It exists only inside your Terraform code, never in AWS.' },
          { label: 'name = "…"', text: 'Arguments. The docs tell you which are Required and which are Optional.' },
          { label: 'attribute { }', text: 'A nested block — some arguments are themselves blocks, listed separately in the docs.' },
          { label: 'aws_dynamodb_table.demo.arn', text: 'The address: type.local_name.attribute. Referencing a resource is also how Terraform works out what to build first.' },
        ],
        note: 'You never told Terraform the order to build things in. It reads the references and figures the graph out itself — that is what "declarative" means.',
      },
    },
    {
      type: 'slide-content',
      note: 'This is the slide to leave on screen during the demo. Hammer plan: it is the difference between a good and a bad Terraform engineer. Ask "what happens if you skip plan and apply is wrong?" — the answer is you find out from the AWS bill.',
      content: {
        title: 'The Terraform Workflow',
        subtitle: 'Six commands. You will run these all week.',
        definitionGrid: [
          { term: 'terraform init', definition: 'Downloads the providers your code needs into .terraform/. Run it once per project, and again whenever you add a provider or module.' },
          { term: 'terraform fmt', definition: 'Rewrites your .tf files into canonical formatting. Run it before every commit — reviewers will notice.' },
          { term: 'terraform validate', definition: 'Checks syntax and types. Makes no AWS calls, returns instantly, catches typos before you wait on a plan.' },
          { term: 'terraform plan', definition: 'The dry run. Shows + create, ~ change, - destroy. Read it every single time — this is your last chance to catch a mistake.' },
          { term: 'terraform apply', definition: 'Makes it real. Prompts for confirmation, unless you hand it a plan you saved earlier with -out.' },
          { term: 'terraform destroy', definition: 'Deletes everything in the state file. This is how you keep your AWS bill at zero after an assignment.' },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'The single most misunderstood thing in Terraform. Make the callout the last thing you say: deleting state does NOT delete AWS resources — it orphans them, and then you are cleaning up by hand in the Console. In the demo you will show drift live; this slide is the theory that makes that land.',
      content: {
        title: 'terraform.tfstate — Terraform\'s Memory',
        subtitle: 'The file everyone misunderstands',
        dense: true,
        definitionBox: 'A JSON file mapping every resource in your code to the real thing Terraform created in your AWS account.',
        sections: [
          {
            heading: 'Why it has to exist',
            items: [
              'Your code says what you want. AWS knows what exists. State is the link between the two.',
              'Without it Terraform cannot tell "already built" from "needs building" — it would try to create everything again.',
              'It is what makes plan able to show you a diff at all.',
            ],
          },
          {
            heading: 'The rules',
            items: [
              'Never commit it to Git — it stores resource attributes in plain text, secrets included.',
              'Never hand-edit it. Use the terraform state commands if you truly must.',
              'On a team it lives in remote state (S3 + DynamoDB lock, or Terraform Cloud) so everyone shares one copy and two people cannot apply at once.',
              'Delete it and your AWS resources do NOT disappear — Terraform just loses track of them, and you clean up by hand.',
            ],
          },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'The skill that outlives this course. Actually open the page while you talk — do not just describe it. Have a student pick a service nobody has used and find it together. Point out the version selector; students on v4 docs writing v5 code is a real and confusing failure mode.',
      content: {
        title: 'Reading the Provider Docs',
        subtitle: 'registry.terraform.io/providers/hashicorp/aws/latest/docs',
        description: 'Nobody memorises ~1,400 AWS resources. Finding the right page fast is the actual skill — and every page has the same four parts.',
        definitionGrid: [
          { term: 'Example Usage', definition: 'A working snippet. Start here always — copy it and edit, never type from scratch.' },
          { term: 'Argument Reference', definition: 'Every input you can set, each marked (Required) or (Optional), with defaults.' },
          { term: 'Attribute Reference', definition: 'What AWS hands back after creation — id, arn — that you can feed into outputs or other resources.' },
          { term: 'Import', definition: 'How to bring a resource you already built by hand in the Console under Terraform control.' },
        ],
        sections: [
          {
            heading: 'Three things that trip people up',
            items: [
              'Sidebar split: Resources create things (aws_vpc). Data Sources only look things up (data "aws_vpc"). Same name, opposite direction.',
              'Check the version selector at the top — pin ~> 5.0 in required_providers so you and the docs agree.',
              'For your assignment, start with: aws_vpc, aws_subnet, aws_internet_gateway, aws_security_group, aws_instance, aws_s3_bucket.',
            ],
          },
        ],
      },
    },
    {
      type: 'slide-section-light',
      note: 'Switch to the terminal. Full script and the runnable files are at demo/week4-terraform in the repo, and on the site at /demo/week4-terraform. Five acts: empty folder, state & drift, provider docs, real project layout, destroy. Leave the workflow slide up on a second screen if you have one.',
      content: { brandHeader: 'The Build Fellowship', title: 'Demo', date: 'Terraform on AWS — live' },
    },
    {
      type: 'slide-content',
      note: 'Set expectations clearly: it is a different set of resources from the demo on purpose, so they cannot copy-paste. Point them at the assignment page for the full step-by-step. End on the destroy warning — a forgotten t2.micro is how fellows burn their free tier.',
      content: {
        title: 'Your Assignment This Week',
        subtitle: 'Terraform Infrastructure — about 2 hours',
        dense: true,
        sections: [
          {
            heading: 'What you build',
            items: [
              'A VPC (10.0.0.0/16) with a public subnet, internet gateway and route table',
              'A Security Group allowing SSH on port 22 from your IP only',
              'An EC2 instance (t2.micro, Amazon Linux 2023) with an 8 GB gp3 EBS volume attached',
              'An S3 bucket with versioning enabled and all public access blocked',
            ],
          },
          {
            heading: 'What you hand in',
            items: [
              'Your Terraform code (main.tf, variables.tf, outputs.tf) in your homework directory',
              'A screenshot of a clean terraform plan',
              'Console screenshots proving the VPC, EC2, EBS volume and bucket exist'              
            ],
          },
        ],
        callout: 'Run terraform destroy once you have your screenshots. An EC2 instance left running is the most common way fellows burn through their free tier.',
      },
    },
    {
      type: 'slide-content',
      note: 'The HashiCorp Getting Started guide is the best entry point; the AWS Provider docs are the reference they\'ll live in during the assignment. Tell them explicitly which ones are optional — the freeCodeCamp video is 2.5 hours and nobody should feel behind for skipping it.',
      content: {
        title: 'Additional Reading',
        subtitle: 'Infrastructure as Code — start with the first two',
        dense: true,
        readingLinks: [
          { icon: '🚀', label: 'Terraform AWS Get Started Tutorial — HashiCorp (start here)', url: 'https://developer.hashicorp.com/terraform/tutorials/aws-get-started' },
          { icon: '📋', label: 'Terraform AWS Provider Docs — the reference you\'ll live in this week', url: 'https://registry.terraform.io/providers/hashicorp/aws/latest/docs' },
          { icon: '⌨️', label: 'Terraform CLI Command Reference — every command and flag', url: 'https://developer.hashicorp.com/terraform/cli/commands' },
          { icon: '📖', label: 'Terraform Language Documentation — HCL syntax reference', url: 'https://developer.hashicorp.com/terraform/language' },
          { icon: '☁️', label: 'What is Infrastructure as Code? — AWS', url: 'https://aws.amazon.com/what-is/iac/' },
          { icon: '✅', label: 'Terraform Best Practices — Spacelift (optional)', url: 'https://spacelift.io/blog/terraform-best-practices' },
          { icon: '🎥', label: 'Terraform Course for Beginners — freeCodeCamp (optional, 2.5 hrs)', url: 'https://www.youtube.com/watch?v=SLB_c_ayRMo' },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'Terraform is one of the single highest-leverage skills for this resume — say so directly. This is a good moment to mention they can describe the assignment as "Built and deployed AWS infrastructure using Terraform" on a resume/LinkedIn.',
      content: {
        title: 'Career Connection',
        subtitle: 'IaC is one of the most in-demand resume skills in cloud right now',
        items: [
          'Terraform/IaC experience → DevOps Engineer, Platform Engineer, Site Reliability Engineer',
          'Most cloud job postings now list "Terraform" or "IaC" as a required or preferred skill',
          'This week\'s assignment is something you can describe directly on a resume: "Built and deployed AWS infrastructure (VPC, EC2, S3) using Terraform"',
        ],
      },
    },
    {
      type: 'slide-callout',
      note: '1-minute reflection before they start the assignment — gets them thinking about the resume framing while it\'s fresh.',
      content: {
        calloutTitle: 'Quick Reflection',
        calloutText: 'Draft one resume bullet for the Terraform work you\'re about to do this week — you\'ll refine it after the assignment.',
      },
    },
    {
      type: 'slide-image-bg',
      note: null,
      content: { img: 7, ariaLabel: 'The Build Fellowship and OpenAvenues Foundation — closing branding slide' },
    },
  ],
}
