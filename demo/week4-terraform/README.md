# Week 4 Live Demo — Terraform on AWS

A ~25 minute instructor-led demo that teaches the Terraform workflow **without doing
the Week 4 assignment for anyone**.

- The assignment builds **VPC, EC2, EBS, S3**.
- This demo builds **SSM Parameter, DynamoDB table, CloudWatch log group** — different
  services, same workflow, same file layout.

Students leave knowing how to write, plan, apply and destroy Terraform, and — most
importantly — **how to find a resource they've never used in the provider docs**.

## Cost

Everything here is free:

| Resource | Why it's free |
|---|---|
| `aws_ssm_parameter` (Standard tier) | Standard parameters have no charge |
| `aws_dynamodb_table` (PAY_PER_REQUEST, empty) | Free tier covers 25 GB storage; no reads/writes means no request charges |
| `aws_cloudwatch_log_group` (1-day retention, no logs written) | Free tier covers 5 GB ingest/storage; we write nothing |

You still run `terraform destroy` at the end — partly for hygiene, mostly because
watching Terraform delete everything is the point.

## Before class (do this, don't do it live)

```bash
terraform -version                 # 1.6+
aws sts get-caller-identity        # confirms your credentials work
cd demo/week4-terraform
cp terraform.tfvars.example terraform.tfvars   # set owner = "yourname"
```

Then `terraform init && terraform apply && terraform destroy` once as a dry run so
you know provider download time and nothing surprises you on stage. Delete
`.terraform/` and `terraform.tfstate*` afterwards if you want a clean `init` on stage.

Have these two tabs open and ready:

1. https://registry.terraform.io/providers/hashicorp/aws/latest/docs
2. The AWS Console, signed in, in the region from your `tfvars`

---

## Demo script

### Act 1 — The empty folder (3 min)

Start in an **empty directory**, not this one. Type it live; it's only 6 lines.

```bash
mkdir /tmp/tf-demo && cd /tmp/tf-demo
```

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_ssm_parameter" "hello" {
  name  = "/demo/hello"
  type  = "String"
  value = "Hello from Terraform"
}
```

```bash
terraform init     # look: it DOWNLOADS the AWS provider, creates .terraform/
terraform plan     # "1 to add, 0 to change, 0 to destroy"
terraform apply    # type: yes
```

**Say:** "That's the whole loop. Everything else today is detail."

Then show it exists two ways — the Console (Systems Manager → Parameter Store) and:

```bash
aws ssm get-parameter --name /demo/hello
```

**Say:** "Terraform is not magic. It called the same AWS API the Console calls."

### Act 2 — State, the idea students always miss (4 min)

```bash
ls -a                          # terraform.tfstate appeared
cat terraform.tfstate | head -40
terraform apply                # "No changes." ← why?
```

**Say:** "Terraform compared three things: your code, the state file, and reality.
All three agree, so there's nothing to do."

Now break it deliberately — this is the highest-value 90 seconds of the demo:

```bash
# change value = "Hello from Terraform" to "Hello again"
terraform plan                 # 1 to change, shows the ~ diff
```

Then go into the **Console** and edit the parameter value by hand to something else.
Come back:

```bash
terraform plan                 # Terraform notices and wants to put it back
```

**Say:** "That's configuration drift, and that's the answer to 'why not just click
around in the Console?' Terraform is the source of truth and it will correct you."

Finish the act on the state file rules:

- Never commit it (it can hold secrets in plain text)
- Never edit it by hand
- On a real team it lives in **remote state** (S3 + DynamoDB lock, or Terraform Cloud)
  so everyone shares one copy — mention it, don't build it

```bash
terraform destroy              # clean up the throwaway folder
```

### Act 3 — Reading the docs (5 min) ← the skill that outlives the demo

Switch to `demo/week4-terraform/`. Open `main.tf` at the DynamoDB table but
**delete the resource block first** and rebuild it live from the docs.

1. Go to the [AWS provider docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
2. Search **"dynamodb"** in the left sidebar
3. Point out the anatomy of every provider docs page:
   - **Example Usage** — copy from here, always
   - **Argument Reference** — what you can set; note `(Required)` vs `(Optional)`
   - **Attribute Reference** — what AWS gives *back* (like `arn`) that you can use in outputs
   - **Import** — how to bring an existing hand-made resource under Terraform
4. Note the sidebar split: **Resources** (`aws_dynamodb_table`) vs
   **Data Sources** (`aws_dynamodb_table` as a lookup). Same name, opposite direction.

**Say:** "Nobody memorises this. There are ~1,400 resources in the AWS provider. The
job is knowing the docs are the answer and how to read them fast."

Do the same lookup for `aws_cloudwatch_log_group` and let a student read out which
arguments are required.

### Act 4 — A real project layout (8 min)

Now walk the actual files in this folder, in this order:

| File | What to say |
|---|---|
| `provider.tf` | Version constraints and why `~> 5.0` matters. `default_tags` — free win, tag everything. |
| `variables.tf` | Nothing is hardcoded. `owner` has no default, so Terraform *prompts*. Show the `validation` block by setting `environment = "banana"`. |
| `terraform.tfvars` | Where the values actually come from. Show it's gitignored. |
| `main.tf` | `data` vs `resource`. `locals` for computed names. |
| `outputs.tf` | Values you didn't type — AWS generated the ARN. |
| `.gitignore` | Read it aloud. State out, lock file in. |

Then run the loop for real:

```bash
terraform fmt          # canonical formatting — run it before every commit
terraform validate     # syntax + type check, no AWS calls, instant
terraform plan -out=tfplan
terraform apply tfplan # applying a SAVED plan: no surprises between plan and apply
terraform output
terraform output -json dynamodb_table_arn
```

Show the created table in the Console, then point at the tags — **nobody typed those
on the resource**; `default_tags` added them.

Then the dependency point:

```bash
terraform state list           # what Terraform believes it owns
terraform state show aws_dynamodb_table.demo
```

**Say:** "Look at the log group name — it references the table. I never told Terraform
what order to build things in. It read the references and worked out the graph."

### Act 5 — Destroy, and the handoff (3 min)

```bash
terraform destroy
```

Read the plan out loud before typing `yes`: 3 to destroy. Show the Console refreshing
to empty.

**Say:** "Tear-down being one command is why cloud engineers can afford to experiment.
Your assignment costs you nothing as long as you destroy at the end."

Close on the assignment framing:

> "You've now seen the whole workflow. Your assignment uses **different** resources —
> VPC, EC2, EBS, S3 — so you can't copy this folder. But the loop is identical, and
> the docs page is the same page. Start by finding `aws_vpc` in the provider docs."

---

## Command cheat sheet (leave this on screen)

```bash
terraform init       # download providers — run once per project, and after adding one
terraform fmt        # auto-format .tf files
terraform validate   # check syntax and types, no cloud calls
terraform plan       # dry run: what WOULD change (read this every time)
terraform apply      # make it real
terraform output     # show output values
terraform state list # what Terraform tracks
terraform destroy    # tear it all down
```

## If something breaks live

| Symptom | Fix |
|---|---|
| `no valid credential sources found` | `aws configure` / check `AWS_PROFILE` |
| `ResourceInUseException` on the table | A previous demo left it behind — `terraform destroy`, or rename with a different `owner` |
| `ParameterAlreadyExists` | Same — the `/…/greeting` path already exists in this account |
| Provider download is slow | You should have run `init` before class; keep talking through it |
| Plan shows changes you didn't make | Good! That's drift — use it, don't hide it |
