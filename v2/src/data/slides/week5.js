// Week 5 slide data. See ./index.js for the shape of a slide
// and how images/notes are resolved.

export default {
  title: 'Cloud Security, HA & Reliability',
  slides: [
    {
      type: 'slide-image-bg',
      note: 'Title slide. Open with: "Who has ever seen a company in the news for a data breach?" Then: "Almost none of those were clever hacking. They were misconfiguration." That framing carries the whole security half of today.',
      content: { ariaLabel: 'The Build Fellowship — title slide with gradient logo and buildfellowship.com' },
    },
    {
      type: 'slide-section-light',
      note: 'Three topics today: Security, High Availability, Reliability. They\'re interconnected — a secure system that can\'t recover from failure isn\'t reliable, and a highly available system with an open S3 bucket isn\'t secure.',
      content: { brandHeader: 'The Build Fellowship', title: 'Cloud Security, High Availability & Reliability', week: 'Week 5', date: 'August 2026' },
    },
    {
      type: 'slide-agenda',
      note: 'Terraform review first — answer questions on last week\'s assignment while it\'s fresh. Then the three main topics. Security → HA (AZs, scaling) → Reliability (backup/recovery).',
      content: {
        title: 'Agenda',
        items: ['Terraform Review', 'Cloud Security', 'High Availability', 'Reliability'],
      },
    },
    {
      type: 'slide-content',
      note: 'Three topics, one theme: systems fail and get attacked, design for that reality. Frame the outcomes around that before the breach examples.',
      content: {
        title: 'Learning Outcomes',
        subtitle: 'By the end of today, you\'ll be able to...',
        items: [
          'Identify common cloud security misconfigurations and how to prevent them',
          'Explain Availability Zones, Regions, and why multi-AZ design improves uptime',
          'Explain horizontal vs. vertical scaling and configure an Auto Scaling Group',
          'Describe AWS backup/recovery options and how they support reliability',
        ],
      },
    },
    {
      type: 'slide-section-light',
      note: 'Open the floor on last week\'s Terraform assignment before starting new material. Usual sticking points: AMI IDs that don\'t exist in their region, forgetting terraform destroy, committing the state file, and the EBS volume landing in a different AZ from the instance. Ask who got a clean plan and who is still stuck — 10 minutes, no slides.',
      content: { brandHeader: 'The Build Fellowship', title: 'Terraform Review', date: 'Week 4 assignment — questions & common mistakes' },
    },
    {
      type: 'slide-section-dark',
      note: 'Security section. Lead with the real-world breaches — makes it tangible. These are all things that could have been prevented.',
      content: { title: 'Cloud Security' },
    },
    {
      type: 'slide-content',
      note: 'Four breaches, four different root causes. Capital One: misconfigured WAF + overprivileged IAM role. Pegasus: public S3 bucket. Twitch: server config error. Codefinger: compromised credentials. Pattern: misconfiguration, not hacking. Ask them to spot the common thread before you say it.',
      content: {
        title: 'AWS Cloud Security – Recent Breaches',
        breachCards: [
          { heading: '2019 – Capital One', text: 'Misconfigured WAF allowed the attacker to grab AWS instance metadata including temporary credentials. Accessed 100M customer records, SSN, emails. Cost: $150 million.' },
          { heading: '2022 – Pegasus Data Breach', text: 'Misconfigured S3 bucket exposed 6.5 TB of sensitive data including crew members\' personal information and operational details.' },
          { heading: '2021 – Twitch', text: 'Over 125 GB of data leaked due to a server configuration error which allowed public access to internal systems.' },
          { heading: '2025 – Codefinger Ransomware', text: 'Compromised AWS credentials allowed attackers to encrypt data in S3 buckets using a custom key, making decryption impossible without the attackers\' keys.' },
        ],
        callout: 'None of these were sophisticated attacks. Every one was a setting someone left wrong — which means every one was preventable by the people who built it.',
      },
    },
    {
      type: 'slide-content',
      note: 'Five common problems. Encryption: RDS and EBS are NOT encrypted by default. EC2 in private subnet — never expose directly to internet. S3 public access — block it by default. Open ports — close everything except what you need. No MFA — enforce it on all users.',
      content: {
        title: 'AWS Cloud Security – Common Problems and Suggestions',
        securityItems: [
          { heading: 'Encryption', items: ['RDS is by default created without encryption', 'EBS volumes are not encrypted by default', 'S3 should employ at rest encryption', 'Use KMS managed keys for encryption'] },
          { heading: 'Connecting EC2 directly to the internet', items: ['Create EC2 instances in a private Subnet, protected by Security groups and ACL rules', 'If internet access is needed (Nginx), use a WAF and load balancer'] },
          { heading: 'S3 Buckets – Public Access', items: ['Misconfigured S3 settings can allow public access', 'Use pre-signed URLs for uploads/downloads, block all public access', 'Regularly audit permissions'] },
          { heading: 'Leaving Insecure ports open', text: 'SSH, HTTP, FTP, TelNet ports should generally be shut. Only allow SSH access from trusted IPs.' },
          { heading: 'No MFA for IAM Users', text: 'Ensure strict password policies and MFA standards on any user that has access to the AWS CLI/UI.' },
        ],
      },
    },
    {
      type: 'slide-code',
      note: 'This is Part 1 of their assignment, in code. The point students miss is the second block: security_groups instead of cidr_blocks. A CIDR says "this IP range can reach me." A security group reference says "whatever is wearing this badge can reach me, wherever it happens to be." That is what makes the rule survive auto scaling — instances come and go with new IPs, and the rule keeps working. Ask what cidr_blocks = ["0.0.0.0/0"] on port 22 would mean before you move on.',
      content: {
        title: 'Least Privilege in Terraform',
        subtitle: 'Two tiers, and the rule that survives auto scaling',
        code: `# App tier — public web traffic, SSH from you only
resource "aws_security_group" "app" {
  name   = "app-tier"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip]   # "203.0.113.4/32"
  }
}

# DB tier — reachable ONLY from the app tier
resource "aws_security_group" "db" {
  name   = "db-tier"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }
}`,
        annotations: [
          { label: 'cidr_blocks = ["0.0.0.0/0"]', text: 'Anyone, anywhere. Fine for 443 on a public site. Never acceptable on port 22.' },
          { label: 'var.my_ip', text: 'A /32 is a single address — yours. Put it in a variable so it is easy to change when your IP does.' },
          { label: 'security_groups = [...]', text: 'The important one. Allows the app tier by identity, not by address — so it keeps working as instances are replaced.' },
          { label: 'Two groups, not one', text: 'Tiering is what stops a compromised web server from talking straight to the database.' },
        ],
        note: 'Default-deny is the model: a security group blocks everything until you open it. You are never "closing ports" — you are choosing the few to open.',
      },
    },
    {
      type: 'slide-content',
      note: 'Inspector: automated vulnerability scanning for EC2, containers, Lambda. Compares installed software against 50+ CVE databases. Can auto-close findings when patched. The AI-powered Lambda remediation is new — mention it.',
      content: {
        title: 'AWS Cloud Security – Amazon Inspector',
        sections: [
          { heading: 'What does it do?', text: 'Discovers Amazon EC2 instances, containers, and Lambda functions, and scans them for software vulnerabilities and unintended network exposure.' },
          { heading: 'Key Features', items: [
            'Checks installed software against 50+ CVE (Common Vulnerabilities & Exposures) databases',
            'Can use AWS System Manager agent (SSM) or perform agentless scanning via EBS snapshots',
            'Detects if a reported vulnerability has been patched and closes the finding automatically',
            'Can provide AI-powered remediation/code patches for Lambda functions',
          ]},
          { heading: 'Pricing', text: 'EC2 per instance: $1.25–$1.75/mo. ECR: $0.09 per image scan. Lambda standard: $0.30/lambda/mo, with code scanning: $0.90/lambda/mo.' },
        ],
      },
    },
    {
      type: 'slide-section-dark',
      note: 'HA section. Ask: "What does high availability actually mean?" Don\'t answer yet — the next five slides build the answer with arithmetic, and the payoff lands harder if they\'ve guessed first.',
      content: { title: 'High Availability' },
    },
    {
      type: 'slide-image-bg',
      note: 'The starting point. Three tiers in series, each a single server at 90%. Multiply, don\'t average: 0.9 x 0.9 x 0.9 = 72.9%, and the slide\'s 80.2% is the same idea. Key insight: availability multiplies down a chain, so a stack is always worse than its worst part. The desired SLA is 99.5% — they are nowhere near it.',
      content: { img: 9, ariaLabel: 'High Availability: single-server tiers (90% each) = 80.2% total availability vs 99.5% desired SLA' },
    },
    {
      type: 'slide-image-bg',
      note: 'Add a second web server. Redundancy within a tier works the opposite way to a chain: both must fail for the tier to fail, so 1-(1-0.9)^2 = 99%. The tier jumps 9 points from one extra box. Total is still dragged down by the untouched tiers.',
      content: { img: 10, ariaLabel: 'Introducing redundancy: 2 web servers, tier availability = 1-(1-0.9)^2 = 0.99, total 88.2%' },
    },
    {
      type: 'slide-image-bg',
      note: 'Third web server: the tier goes 99% to 99.9%, but the total barely moves (88.2% to 89.0%). This is the diminishing-returns moment — point at it. Adding a third server to an already-redundant tier buys almost nothing while the other tiers are still single points of failure.',
      content: { img: 11, ariaLabel: 'High Availability: 3 web servers, tier availability = 1-(1-0.9)^3 = 0.999, total 89.0%' },
    },
    {
      type: 'slide-image-bg',
      note: 'Now fix the app tier too. Total jumps to 98.8% — a far bigger gain than the third web server bought. The lesson: spend your next dollar on the weakest tier, not the one you already fixed.',
      content: { img: 12, ariaLabel: 'High Availability: expand redundancy to web and app tiers (3 each), total availability 98.8%' },
    },
    {
      type: 'slide-image-bg',
      note: 'Finally the database, which is the hardest tier to make redundant because of state — hence master + replicas rather than three identical boxes. 99.8% total. Note we spent roughly 3x the infrastructure to go from 80% to 99.8%.',
      content: { img: 13, ariaLabel: 'High Availability: full redundancy across all tiers including DB replication (Master + 2 Replicas), total availability 99.8%' },
    },
    {
      type: 'slide-image-bg',
      note: 'The cost/value chart. Value flattens, cost keeps climbing linearly. Ask: "Where would you stop?" There is no universal answer — it depends what an hour of downtime costs the business. That is the real engineering judgement.',
      content: { img: 14, ariaLabel: 'HA learnings: Cost vs Value chart showing diminishing returns of redundancy. Key: stack availability cannot exceed its least-available tier.' },
    },
    {
      type: 'slide-content',
      note: 'Make the arithmetic concrete before leaving HA. Most students have seen "99.9% uptime" in a contract and never converted it to hours. Do that conversion live — the jump from three nines to four nines is 8 hours down to 52 minutes, and that is the difference between a bad afternoon and a page at 3am. Land the second bullet hard: the chain rule is why one un-redundant tier ruins everything upstream of it.',
      content: {
        title: 'High Availability – What the Numbers Mean',
        subtitle: 'Two rules, and the table you will be held to in a contract',
        dense: true,
        items: [
          'Redundancy within a tier gives logarithmic returns — the first extra server buys a lot, the third buys almost nothing.',
          'Availability multiplies down the chain, so your stack can never be more available than its least-available tier.',
        ],
        matrix: {
          head: ['Availability', 'Downtime / year', 'Downtime / month', 'Typically means'],
          rows: [
            ['99%  — "two nines"', '3.65 days', '7.2 hours', 'A single server. Fine for an internal tool.'],
            ['99.9%  — "three nines"', '8.8 hours', '43 minutes', 'Redundant instances in one AZ. Common SaaS baseline.'],
            ['99.99%  — "four nines"', '52 minutes', '4.4 minutes', 'Multi-AZ with automatic failover. Most AWS managed services.'],
            ['99.999%  — "five nines"', '5.3 minutes', '26 seconds', 'Multi-region, active-active. Very expensive, rarely justified.'],
          ],
        },
        callout: 'Every extra nine costs roughly an order of magnitude more. Ask what an hour of downtime actually costs the business before you promise one.',
      },
    },
    {
      type: 'slide-content',
      note: 'AZs: close enough for low latency, far enough to survive natural disasters. This is why multi-AZ deployments are the baseline for production — it is how you buy the fourth nine from the previous slide without going multi-region.',
      content: {
        title: 'High Availability (HA) – AZ/Regions',
        sectionSubtitle: 'Availability Zone – Recap',
        items: [
          'Built for high reliability so that nothing short of a natural disaster brings one down',
          'Located close to one another and connected via low-latency high-bandwidth links',
          'Located far enough from each other that a single natural disaster cannot bring all of them down at the same time',
        ],
      },
    },
    {
      type: 'slide-image-bg',
      note: 'The reference architecture for the rest of the course. Load balancer spans both AZs; every tier is duplicated in each. Point out that the ELB is the thing that makes failover automatic — without it, redundant servers still need someone to redirect traffic. Their assignment needs subnets in two AZs for exactly this reason.',
      content: { img: 16, ariaLabel: 'Multi-AZ architecture: Elastic Load Balancer across AZ-A and AZ-B, each with web servers, app servers, and DB (master + replicas)' },
    },
    {
      type: 'slide-image-bg',
      note: 'Vertical = a bigger box. Horizontal = more boxes. Ask which one the previous HA slides were doing — horizontal, and that is not a coincidence: a bigger single server is still a single point of failure.',
      content: { img: 17, ariaLabel: 'Scalability: Vertical Scaling (increase/decrease capacity of existing instances) vs Horizontal Scaling (add more VMs to spread workload)' },
    },
    {
      type: 'slide-content',
      note: 'The trade-off the diagram does not show. Vertical is easier — no code changes, no load balancer — but it needs downtime to resize, has a hard ceiling at the largest instance type, and gives you zero redundancy. Horizontal is the cloud-native answer but it demands stateless application code, which is the part students underestimate. If a user\'s session lives in memory on one instance, scaling out breaks logins. That is the single most common real-world blocker.',
      content: {
        title: 'Vertical vs. Horizontal Scaling',
        subtitle: 'Both are "scaling" — only one gives you availability',
        dense: true,
        matrix: {
          head: ['', 'Vertical (scale up)', 'Horizontal (scale out)'],
          rows: [
            ['What changes', 'Same server, bigger instance type', 'More servers, same instance type'],
            ['Downtime to apply', 'Yes — the instance must stop and restart', 'No — new instances join the pool live'],
            ['Ceiling', 'Hard limit at the largest instance type available', 'Effectively none — keep adding instances'],
            ['Redundancy gained', 'None. Still one server, still one failure away', 'Yes. This is what the HA math was doing'],
            ['Demands from your app', 'Nothing — it just gets a bigger machine', 'App must be stateless (no session in local memory)'],
            ['Cost shape', 'Steep steps — each size roughly doubles', 'Linear and granular, and you can scale back down'],
          ],
        },
        callout: 'The catch: horizontal scaling only works if any instance can serve any request. Session state in local memory is the #1 thing that breaks scale-out.',
      },
    },
    {
      type: 'slide-image-bg',
      note: 'The three numbers that define an ASG. Min = the floor AWS will never go below, even at 3am with no traffic. Max = your cost ceiling and your safety net against a runaway scale-out. Desired = where it sits right now, and the only one that moves automatically. Their assignment uses 1 / 1 / 3.',
      content: { img: 18, ariaLabel: 'AWS EC2 Auto Scaling concept: Auto Scaling Group with minimum size, desired capacity, and maximum size' },
    },
    {
      type: 'slide-image-bg',
      note: 'The whole picture: ELB in front, two independently scaling fleets behind it, shared database. Note the web and app tiers scale separately — that is the payoff of tiering. A traffic spike that hammers the web tier does not force you to pay for more app servers.',
      content: { img: 19, ariaLabel: 'AWS EC2 Auto Scaling full architecture: VPC with ELB, web server fleet and app server fleet auto-scaling, connected to primary database' },
    },
    {
      type: 'slide-content',
      note: 'Four ways to drive an ASG. Walk down the list — they get progressively more automatic. Target tracking is the one they will use and the one worth understanding: you name a metric and a number, AWS works out the instance count. Scheduled is underrated for predictable load (business hours, batch windows). Warn about the cooldown: without it an ASG oscillates, launching and killing instances every few minutes.',
      content: {
        title: 'High Availability (HA) – Scalability',
        sectionSubtitle: 'AWS EC2 Auto Scaling — four ways to size the group',
        definitionGrid: [
          { term: 'Maintain current levels', definition: 'The ASG just replaces failed instances to hold the desired count. No scaling at all — but this alone gives you self-healing.' },
          { term: 'Manual scaling', definition: 'You change desired capacity yourself. Useful for a known one-off event; not a strategy.' },
          { term: 'Scheduled scaling', definition: 'Scale on a clock — up at 8am, down at 7pm. Best when your load is predictable, and it saves money overnight.' },
          { term: 'Target tracking (on demand)', definition: 'You set a metric and a target (e.g. CPU at 60%). AWS adds and removes instances to hold it there. This is what your assignment uses.' },
        ],
        callout: 'Set a cooldown period. Without one, an ASG can thrash — launching instances, seeing CPU drop, killing them, and repeating every few minutes.',
      },
    },
    {
      type: 'slide-code',
      note: 'Part 2 of their assignment. Three resources, and the order matters: the launch template is the blueprint, the ASG builds from it, the policy drives it. Point at vpc_zone_identifier with two subnets — that is where HA and auto scaling meet, and it is why they have to add a second AZ to their Week 4 VPC. The "$Latest" string trips people up: it is an AWS literal, not Terraform interpolation. Note that aws_instance is gone entirely — you no longer name individual servers, you describe a fleet.',
      content: {
        title: 'Auto Scaling in Terraform',
        subtitle: 'Blueprint, fleet, policy — replacing your Week 4 aws_instance',
        code: `# 1. The blueprint for every instance
resource "aws_launch_template" "app" {
  name_prefix   = "app-"
  image_id      = var.ami_id
  instance_type = "t2.micro"
}

# 2. The fleet — note TWO subnets, in two AZs
resource "aws_autoscaling_group" "app" {
  min_size            = 1
  desired_capacity    = 1
  max_size            = 3
  vpc_zone_identifier = [aws_subnet.a.id, aws_subnet.b.id]

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }
}

# 3. What makes it scale
resource "aws_autoscaling_policy" "cpu" {
  autoscaling_group_name = aws_autoscaling_group.app.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    target_value = 60
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
  }
}`,
        annotations: [
          { label: 'aws_launch_template', text: 'Everything an instance needs: AMI, type, security groups, user data. Versioned — bump it rather than replacing it.' },
          { label: 'vpc_zone_identifier', text: 'The HA lever. Two subnets in two AZs means an AZ outage costs you half your fleet, not all of it.' },
          { label: 'min / desired / max', text: 'Floor, current, ceiling. Only desired moves on its own. max is your cost cap.' },
          { label: '"$Latest"', text: 'An AWS literal, not Terraform syntax. New instances pick up the newest template version.' },
          { label: 'target_value = 60', text: 'Hold average CPU near 60%. You state the goal; AWS works out the instance count.' },
        ],
        note: 'Your aws_instance resource disappears. You stop naming individual servers and start describing a fleet — that is the real shift on this assignment.',
      },
    },
    {
      type: 'slide-image-bg',
      note: 'Databases scale too, but read replicas only — writes still go to one primary. Aurora can add and remove replicas on the same target-tracking idea. Mention that this is why "make the database redundant" was the hardest tier in the HA math earlier: state is what makes scaling hard.',
      content: { img: 21, ariaLabel: 'HA Scalability for Databases: Aurora Auto Scaling policy configuration for Aurora Replicas' },
    },
    {
      type: 'slide-section-dark',
      note: 'Reliability is about recovery, not prevention. HA keeps you up when something fails; reliability gets you back when something is lost or corrupted. Redundancy does not protect you from a bad deploy or a ransomware key — replicas faithfully replicate the damage.',
      content: { title: 'Reliability' },
    },
    {
      type: 'slide-content',
      note: '"Resiliency is the ability of a workload to recover..." Key: chaos engineering, game days. Design for failure. Tie back to the Codefinger breach — replication would not have saved them, backups would.',
      content: {
        title: 'Reliability',
        definitionBox: 'Resiliency is the ability of a workload to recover from infrastructure or service disruptions, dynamically acquire computing resources to meet demand, and mitigate disruptions, such as misconfigurations or transient network issues.',
      },
    },
    {
      type: 'slide-content',
      note: 'Backup hierarchy, roughly least to most managed. Introduce RPO and RTO here — they are the two numbers every backup conversation actually turns on, and students have usually never heard them. RPO = how much data you can afford to lose (set by backup frequency). RTO = how long you can afford to be down (set by restore speed). Make the distinction stick: a nightly backup means an RPO of 24 hours, so a failure at 5pm loses the whole working day.',
      content: {
        title: 'Reliability – Backup Options',
        subtitle: 'Every backup choice is really a choice about RPO and RTO',
        dense: true,
        sections: [
          {
            heading: 'The two numbers that decide everything',
            items: [
              'RPO (Recovery Point Objective) — how much data you can afford to lose. Set by how often you back up.',
              'RTO (Recovery Time Objective) — how long you can afford to be down. Set by how fast you can restore.',
            ],
          },
        ],
        matrix: {
          head: ['Option', 'Covers', 'Typical RPO', 'Notes'],
          rows: [
            ['Manual snapshots', 'EBS, RDS', 'Whenever you remember', 'Fine for a checkpoint before a risky change. Not a backup strategy.'],
            ['Data Lifecycle Manager', 'EBS only', 'Hours', 'Automates EBS snapshots on a schedule with retention. Free — you pay only for storage.'],
            ['RDS automated backups', 'RDS, Aurora', '5 minutes', 'Point-in-time restore, but capped at a 35-day retention window.'],
            ['AWS Backup', 'EBS, EC2, EFS, FSx, RDS, Aurora, DynamoDB', 'Hours (policy-driven)', 'One plan, one vault, many services. Cross-region copy and compliance reporting.'],
          ],
        },
        callout: 'A backup you have never restored is not a backup — it is a hope. Test the restore, not just the backup job.',
      },
    },
    {
      type: 'slide-image-bg',
      note: 'AWS Backup is the centralised answer: one plan covers many services instead of a different mechanism per service. Three pieces to name, because they map exactly to their assignment: the vault is where backups live, the plan is the schedule and retention rule, the selection is which resources the plan applies to.',
      content: { img: 25, ariaLabel: 'AWS Backup service diagram: supports FSx, EBS, EC2, EFS, RDS, Aurora, DynamoDB, Storage Gateway with backup plans and vaults' },
    },
    {
      type: 'slide-content',
      note: 'Set expectations clearly: this builds directly on their Week 4 code, but it goes in a fresh week-5 directory — they copy Week 4 forward and edit the copy, so last week\'s working project stays intact. Flag the two things that catch people out: the ASG needs a second AZ so their Week 4 VPC has to grow a subnet, and backup vaults refuse to delete while they hold recovery points, so cleanup takes an extra step. End on destroy.',
      content: {
        title: 'Your Assignment This Week',
        subtitle: 'Security & Resilience Hardening — about 2 hours',
        dense: true,
        sections: [
          {
            heading: 'What you change',
            items: [
              'Harden your security groups — SSH from your IP only, plus a DB tier group that trusts the app tier group',
              'Add a second subnet in a second AZ, so the ASG has somewhere to spread',
              'Replace aws_instance with a Launch Template + Auto Scaling Group (1 / 1 / 3) and a CPU target-tracking policy',
              'Add an AWS Backup vault, a daily plan with 7-day retention, and a selection covering your EBS volume',
            ],
          },
          {
            heading: 'What you hand in',
            items: [
              'Your updated Terraform project in a separate week-5 homework directory — your Week 4 code, moved forward',
              'Console screenshots of the ASG with a running instance, and of the Backup plan',
              'A half-page reflection: what changed, what risk each change removes, what you would add next',
            ],
          },
        ],
        callout: 'Cleanup has an extra step this week — a Backup vault will not delete while it still holds recovery points. Delete those in the console first, then terraform destroy.',
      },
    },
    {
      type: 'slide-content',
      note: 'The first two docs are the ones they will actually need open while doing the assignment — say that explicitly. Everything under the second heading is genuinely optional; nobody should feel behind for skipping a 10-minute video or a practice exam. The Well-Architected Reliability Pillar is the best single document here if anyone wants depth.',
      content: {
        title: 'Additional Reading',
        subtitle: 'The first two are what you need for the assignment',
        dense: true,
        sections: [
          {
            heading: 'For this week\'s assignment',
            readingLinks: [
              { icon: '📋', label: 'Terraform aws_autoscaling_group — provider docs (start here)', url: 'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/autoscaling_group' },
              { icon: '💾', label: 'Terraform aws_backup_plan & aws_backup_vault — provider docs', url: 'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/backup_plan' },
              { icon: '📈', label: 'Target Tracking Scaling Policies — AWS EC2 Auto Scaling guide', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html' },
              { icon: '🛡️', label: 'AWS Well-Architected — Reliability Pillar', url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html' },
            ],
          },
          {
            heading: 'Optional — going deeper',
            readingLinks: [
              { icon: '🏠', label: 'Airbnb Case Study — Moving to AWS (optional)', url: 'https://aws.amazon.com/solutions/case-studies/airbnb-case-study/' },
              { icon: '🎥', label: 'Top 50+ AWS Services Explained in 10 Minutes (optional)', url: 'https://www.youtube.com/watch?v=JIbIYCM48to' },
              { icon: '☁️', label: 'AWS Certified Cloud Practitioner — official resources (optional)', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/?c=sec&sec=resources' },
              { icon: '📝', label: 'Free Cloud Practitioner practice exams — AWSBoy (optional)', url: 'https://awsboy.com/aws-practice-exams/practitioner/' },
            ],
          },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'Security and reliability are some of the most stable, well-paid specialties in cloud — worth naming directly given how much breach/outage content we just covered. Point out that this week\'s assignment is resume-able in the same way Week 4\'s was.',
      content: {
        title: 'Career Connection',
        subtitle: 'This is the work that keeps companies out of the headlines',
        items: [
          'Cloud Security Engineer / Analyst → preventing exactly the kind of breaches we just reviewed',
          'Site Reliability Engineer (SRE) → owns uptime, auto-scaling, and backup/recovery design',
          'These specialties are consistently among the highest-paid in cloud, because the cost of getting them wrong is so visible',
          'This week\'s assignment is a resume line: "Hardened AWS infrastructure with least-privilege security groups, auto scaling, and automated backup policies"',
        ],
      },
    },
    {
      type: 'slide-callout',
      note: '1-minute reflection — security/reliability content can feel abstract, so ground it in something personal before moving to the migration project weeks.',
      content: {
        calloutTitle: 'Quick Reflection',
        calloutText: 'Pick one breach example from today — what\'s the one-sentence fix, and would you have caught it?',
      },
    },
    {
      type: 'slide-image-bg',
      note: 'Closing slide. Next week starts the cloud migration project — this is the last of the foundational content.',
      content: { img: 26, ariaLabel: 'The Build Fellowship and OpenAvenues Foundation — closing branding slide' },
    },
  ],
}
