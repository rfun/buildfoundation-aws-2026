# AWS Well-Architected Framework Labs - Implementation Plan

## Overview
Create 12 hands-on labs (2 per WAF pillar) as scrollable HTML content pages, plus a labs landing page. All labs use AWS Console only, are free-tier compatible, beginner-friendly, under 30 minutes, and include cleanup + completion screenshot instructions.

## File Structure

```
buildfoundation-aws-2026/
├── index.html                          ← ADD new "Week 2 Labs" card
├── labs/
│   ├── index.html                      ← NEW: Labs landing page (6 pillar sections, 12 lab cards)
│   ├── lab1-cloudtrail.html            ← Operational Excellence - Lab 1
│   ├── lab2-cloudwatch-dashboard.html  ← Operational Excellence - Lab 2
│   ├── lab3-iam.html                   ← Security - Lab 1
│   ├── lab4-s3-security.html           ← Security - Lab 2
│   ├── lab5-s3-versioning.html         ← Reliability - Lab 1
│   ├── lab6-vpc-availability.html      ← Reliability - Lab 2
│   ├── lab7-ec2-instance-types.html    ← Performance Efficiency - Lab 1
│   ├── lab8-dynamodb.html              ← Performance Efficiency - Lab 2
│   ├── lab9-budgets.html               ← Cost Optimization - Lab 1
│   ├── lab10-pricing-calculator.html   ← Cost Optimization - Lab 2
│   ├── lab11-s3-lifecycle.html         ← Sustainability - Lab 1
│   └── lab12-wa-tool.html              ← Sustainability - Lab 2
└── implementation-plans/               ← Save copy of this plan here
```

**Total files: 14 new HTML files + 1 edit to existing index.html**

---

## Labs Landing Page (`labs/index.html`)

- Style: Gradient background matching main `index.html`
- Back link to `../index.html`
- Title: "AWS Well-Architected Framework Labs"
- 6 sections (one per pillar), each with a color-coded header and 2 lab cards
- Each card shows: lab number, title, estimated time, brief description
- Cards link to individual lab HTML files

---

## Lab Template Structure

Each lab page uses the `local-environment-setup.html` pattern (scrollable content page) extended with:

1. **Header**: Back link → labs/index.html, pillar badge (color-coded), lab title, time estimate
2. **Overview**: What the lab covers and how it connects to the pillar (reference Week 2 lecture)
3. **Objectives**: 3-4 bullet points of what students will learn
4. **Prerequisites**: AWS free tier account, signed into Console
5. **Step-by-step instructions**: Numbered steps with clear descriptions, notes/warnings where needed
6. **Completion Screenshot**: Exact instructions on what to capture and what must be visible
7. **Cleanup**: Step-by-step resource deletion instructions
8. **Key Takeaways**: 3-4 bullets connecting back to the pillar principles from Week 2

**CSS additions** (beyond existing template):
- `.pillar-badge` - Color-coded pill showing pillar name
- `.step` - Numbered step container with step number circle
- `.note-box` / `.warning-box` - Callout boxes for tips and warnings
- `.screenshot-box` - Highlighted section for screenshot instructions
- `.cleanup-box` - Red-tinted section for cleanup steps

---

## 12 Lab Details

### Pillar 1: Operational Excellence

#### Lab 1: Exploring CloudTrail Event History (~15 min)
**Lecture tie-in**: Organize & Operate phases - "Utilize workload observability"
**AWS Services**: CloudTrail (always free - 90 day event history)

**Steps**:
1. Navigate to CloudTrail in the AWS Console
2. Open Event History
3. Examine a recent event (e.g., ConsoleLogin) - read the JSON detail
4. Filter events by Event source (e.g., `signin.amazonaws.com`)
5. Filter events by User name (your root or IAM user)
6. Filter by a specific time range
7. Understand the event record fields: who (userIdentity), what (eventName), when (eventTime), where (awsRegion)

**Screenshot**: Event History page with a filter applied showing at least 3 events, with one event's detail expanded showing the username

**Cleanup**: None needed - CloudTrail Event History is read-only exploration

---

#### Lab 2: Building a CloudWatch Dashboard with a Billing Alarm (~25 min)
**Lecture tie-in**: Prepare & Operate phases - "Implement observability", "Respond to events"
**AWS Services**: CloudWatch, SNS (10 free alarms, 3 free dashboards, SNS email free)

**Steps**:
1. Navigate to SNS → Create a topic (Standard type, name: "BillingAlerts")
2. Create an email subscription to the topic
3. Confirm the subscription via email
4. Navigate to CloudWatch → Alarms → Create alarm
5. Select metric: Billing → Total Estimated Charge → USD
6. Set threshold: Static, Greater than $1 (or $5)
7. Configure notification to send to the SNS topic
8. Name the alarm (e.g., "BillingThresholdAlarm")
9. Navigate to CloudWatch → Dashboards → Create dashboard
10. Add a Number widget showing EstimatedCharges metric
11. Add a Text widget with a markdown note about the billing alarm
12. Save the dashboard

**Screenshot**: CloudWatch Dashboard showing the billing widget and text widget, with the alarm visible in the Alarms section

**Cleanup**: Optional - recommend keeping the billing alarm and dashboard as they're useful. If removing: delete dashboard, delete alarm, delete SNS subscription and topic.

**Note**: Must enable "Receive Billing Alerts" in Billing Preferences first (included as step 0).

---

### Pillar 2: Security

#### Lab 3: IAM Users, Groups, and Least Privilege Policies (~20 min)
**Lecture tie-in**: "Implement a strong identity foundation"
**AWS Services**: IAM (always free)

**Steps**:
1. Navigate to IAM → User Groups → Create group ("ReadOnlyTeam")
2. Attach AWS managed policy "ReadOnlyAccess" to the group
3. Navigate to IAM → Users → Create user ("lab-student")
4. Do NOT enable console access (just creating the identity)
5. Add user to the "ReadOnlyTeam" group
6. Navigate to IAM → Policy Simulator (or use the link)
7. Select the "lab-student" user
8. Test action: `s3:GetObject` → Run Simulation → observe "allowed"
9. Test action: `s3:DeleteBucket` → Run Simulation → observe "denied"
10. Test action: `ec2:DescribeInstances` → observe "allowed"
11. Test action: `ec2:TerminateInstances` → observe "denied"
12. Discuss: ReadOnlyAccess allows read actions but denies write/delete actions

**Screenshot**: IAM Policy Simulator showing at least one "allowed" and one "denied" result for the lab-student user

**Cleanup**: Delete IAM user "lab-student", delete IAM group "ReadOnlyTeam"

---

#### Lab 4: Securing an S3 Bucket with Encryption and Access Controls (~25 min)
**Lecture tie-in**: "Protect data in transit and at rest", "Apply security at all layers"
**AWS Services**: S3 (5GB free tier)

**Steps**:
1. Navigate to S3 → Create bucket (name: "yourname-security-lab-2026")
2. Verify "Block all public access" is enabled (should be by default)
3. Enable default encryption: SSE-S3 (Amazon S3 managed keys)
4. Enable Bucket Versioning (adds defense in depth)
5. Create the bucket
6. Upload a test text file
7. Click the uploaded file → verify "Server-side encryption" shows SSE-S3
8. Go to Permissions tab → add a Bucket Policy that enforces HTTPS-only access:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "DenyNonHTTPS",
       "Effect": "Deny",
       "Principal": "*",
       "Action": "s3:*",
       "Resource": ["arn:aws:s3:::BUCKET-NAME/*"],
       "Condition": {"Bool": {"aws:SecureTransport": "false"}}
     }]
   }
   ```
9. Review the Access section to confirm "Public access: Blocked"

**Screenshot**: Bucket Properties tab showing: (1) Encryption = SSE-S3 enabled, (2) Versioning = Enabled, and the Permissions tab showing Block Public Access = On

**Cleanup**: Empty the bucket (delete all objects and versions), then delete the bucket

---

### Pillar 3: Reliability

#### Lab 5: S3 Versioning and Object Recovery (~15 min)
**Lecture tie-in**: "Observability and failure management"
**AWS Services**: S3 (5GB free tier)

**Steps**:
1. Navigate to S3 → Create bucket with Versioning enabled (name: "yourname-reliability-lab-2026")
2. Create a simple text file locally (e.g., `notes.txt` with "Version 1 content")
3. Upload the file to the bucket
4. Edit the local file (change to "Version 2 content") and re-upload with same name
5. Toggle "Show versions" in the S3 console - observe both versions
6. Delete the file (without toggling versions - creates a delete marker)
7. Notice the file appears "deleted"
8. Toggle "Show versions" again - see the delete marker and both previous versions
9. Delete the delete marker to restore the file
10. Verify the file is restored by downloading it

**Screenshot**: S3 console with "Show versions" toggled ON, showing: the file name, multiple version IDs, and the timestamps for each version

**Cleanup**: Toggle "Show versions" → select all versions → delete permanently. Then delete the bucket.

---

#### Lab 6: Exploring VPC Infrastructure and Availability Zones (~20 min)
**Lecture tie-in**: "Networking, quotas, and constraints" + AWS Global Infrastructure (regions, AZs)
**AWS Services**: VPC (always free)

**Steps**:
1. Navigate to VPC Dashboard → explore the summary (VPCs, subnets, etc.)
2. Click on the default VPC → note the CIDR block (e.g., 172.31.0.0/16)
3. Click on Subnets → observe subnets in different Availability Zones
4. Note: each subnet is in a different AZ → this is the foundation of multi-AZ reliability
5. Click on Route Tables → examine the default route table (local + internet gateway)
6. Click on Internet Gateways → see the default IGW attached to the VPC
7. Navigate to Security Groups → Create a new security group:
   - Name: "web-server-sg"
   - Description: "Allows HTTP and HTTPS traffic"
   - VPC: default VPC
   - Inbound rules: HTTP (80) from 0.0.0.0/0, HTTPS (443) from 0.0.0.0/0
   - Outbound: leave default (all traffic)
8. Navigate to Service Quotas → search for VPC → view current quotas (e.g., VPCs per region, subnets per VPC)

**Screenshot**: VPC Subnets page showing subnets in multiple Availability Zones (AZ column visible) + the custom security group's inbound rules

**Cleanup**: Delete the "web-server-sg" security group

---

### Pillar 4: Performance Efficiency

#### Lab 7: Exploring EC2 Instance Types and Launching an Instance (~25 min)
**Lecture tie-in**: "Architecture selection", "Compute & Hardware"
**AWS Services**: EC2 (t2.micro/t3.micro - 750 hrs/month free)

**Steps**:
1. Navigate to EC2 → Instance Types (left sidebar)
2. Explore different families:
   - t3 (general purpose, burstable) - web servers, small DBs
   - m5 (general purpose, fixed) - application servers
   - c5 (compute optimized) - batch processing, gaming
   - r5 (memory optimized) - in-memory databases
3. Filter by "Free tier eligible" - note which types qualify
4. Navigate to EC2 → Launch Instance
5. Name: "performance-lab-instance"
6. AMI: Amazon Linux 2023 (free tier eligible)
7. Instance type: t2.micro (or t3.micro if t2 not available)
8. Key pair: "Proceed without a key pair" (we won't SSH in)
9. Network: default VPC, auto-assign public IP
10. Security group: create new, allow SSH from "My IP" only
11. Launch the instance
12. Wait for "Running" state → click Monitoring tab
13. Explore the CloudWatch metrics (CPU, Network, Disk)
14. Click on the instance → view Instance type, Availability Zone, and status checks

**Screenshot**: EC2 instance detail page showing: Instance state = Running, Instance type = t2.micro, the Monitoring tab with at least one metric graph visible

**Cleanup**: Select the instance → Instance State → Terminate instance. Verify it moves to "Terminated" state. Delete the security group created for this lab.

---

#### Lab 8: Creating and Querying a DynamoDB Table (~20 min)
**Lecture tie-in**: "Data Management" - optimize data storage, access patterns, and performance
**AWS Services**: DynamoDB (25GB + 25 RCU/WCU free)

**Steps**:
1. Navigate to DynamoDB → Create table
2. Table name: "CourseStudents"
3. Partition key: "StudentId" (String)
4. Sort key: "CourseName" (String)
5. Table settings: customize → capacity mode: On-demand
6. Create the table
7. Click "Explore table items" → Create item:
   - StudentId: "student-001", CourseName: "AWS-Foundations"
   - Add attribute: Name (String) = "Alice", Grade (Number) = 95
8. Create 2-3 more items with different StudentIds
9. Run a Query: Partition key = "student-001" → see filtered results
10. Run a Scan: see all items in the table
11. Go to the Monitor tab → explore read/write capacity metrics
12. Discuss: On-demand = auto-scaling performance, Provisioned = predictable cost

**Screenshot**: DynamoDB table Items view showing the query results with multiple items visible, plus the table's Overview tab showing the capacity mode

**Cleanup**: Select the table → Delete → confirm deletion

---

### Pillar 5: Cost Optimization

#### Lab 9: Setting Up AWS Budgets and Free Tier Tracking (~20 min)
**Lecture tie-in**: "Implement cloud financial management", "Analyze and attribute expenditure"
**AWS Services**: AWS Budgets (2 free/month), Billing Dashboard (free)

**Steps**:
1. Navigate to AWS Billing and Cost Management → Dashboard
2. Explore: Month-to-date spend, service breakdown, free tier usage
3. Click "Free Tier" in the left sidebar → review current free tier usage
4. Navigate to Budgets → Create budget
5. Choose "Zero spend budget" template
6. Name: "ZeroSpendAlert"
7. Add email recipients for notifications
8. Create the budget
9. Create a second budget: "Monthly cost budget"
   - Budget amount: $10 (as an example)
   - Configure alert at 80% threshold
   - Add email notification
10. Review the Budgets dashboard showing both budgets
11. Navigate to Cost Explorer → enable if not already → explore the interface (may take 24hrs to populate)

**Screenshot**: AWS Budgets page showing both budgets (ZeroSpendAlert and Monthly cost budget) with their status and thresholds visible

**Cleanup**: Can keep budgets (recommended - they're useful!). To remove: delete both budgets.

**Note on difference from Lab 2**: Lab 2 used CloudWatch billing alarms (reactive operational monitoring). This lab uses AWS Budgets (proactive financial planning with forecasting). Both are complementary cost management tools.

---

#### Lab 10: AWS Pricing Calculator and Trusted Advisor (~20 min)
**Lecture tie-in**: "Adopt a consumption model", "Measure overall efficiency", "Stop spending money on undifferentiated heavy lifting"
**AWS Services**: AWS Pricing Calculator (free, external), Trusted Advisor (Basic - free)

**Steps**:
1. Open AWS Pricing Calculator (https://calculator.aws/)
2. Create a new estimate → Add service: Amazon EC2
   - Region: US East (N. Virginia)
   - Instance type: t3.micro, 1 instance, Linux
   - Usage: 730 hours/month (24/7)
   - Note the monthly cost
3. Add service: Amazon S3
   - Storage: 50GB Standard
   - Requests: 10,000 GET, 1,000 PUT
   - Note the monthly cost
4. Add service: Amazon DynamoDB
   - On-demand, 25 read/write units
   - Note the monthly cost
5. Review the total monthly estimate for this simple architecture
6. Compare: change EC2 to t3.medium → see cost difference (right-sizing impact!)
7. Switch to AWS Console → navigate to Trusted Advisor
8. Review the available free checks:
   - Cost Optimization: review any recommendations
   - Security: check for open security groups, MFA on root
   - Fault Tolerance: review any warnings
   - Performance: review suggestions
   - Service Limits: check usage vs limits
9. Discuss how Trusted Advisor automates the "measure overall efficiency" principle

**Screenshot**: Split screenshot showing (1) AWS Pricing Calculator with the 3-service estimate total and (2) Trusted Advisor dashboard showing the check categories and their status

**Cleanup**: None needed - Pricing Calculator is a web tool, Trusted Advisor is read-only

---

### Pillar 6: Sustainability

#### Lab 11: Configuring S3 Lifecycle Policies for Efficient Data Management (~15 min)
**Lecture tie-in**: "Data Storage", "Utilization & Scaling" - reducing unnecessary resource consumption
**AWS Services**: S3 (5GB free tier)

**Steps**:
1. Navigate to S3 → Create bucket ("yourname-sustainability-lab-2026")
2. Upload 3-4 test files of different types (text, image, etc.)
3. Go to Properties → explore Storage Classes section - discuss each:
   - Standard: frequently accessed data
   - Standard-IA: infrequently accessed, lower cost
   - Glacier Instant/Flexible/Deep Archive: archival, lowest cost
4. Go to Management tab → Create lifecycle rule
5. Rule name: "optimize-storage-costs"
6. Apply to all objects in the bucket
7. Configure transitions:
   - Transition to Standard-IA after 30 days
   - Transition to Glacier Flexible Retrieval after 90 days
8. Configure expiration:
   - Expire current versions after 365 days
   - Delete expired object delete markers
9. Save the lifecycle rule
10. Review the rule summary
11. Discuss sustainability impact: automated data lifecycle means less stored data = less energy consumption = smaller environmental footprint

**Screenshot**: S3 Management tab showing the lifecycle rule with transition and expiration actions visible in the rule summary

**Cleanup**: Delete the lifecycle rule, empty the bucket, delete the bucket

---

#### Lab 12: Running an AWS Well-Architected Framework Review (~25 min)
**Lecture tie-in**: AWS Well-Architected Tool (Week 2 Slide 25), all 6 pillars, sustainability focus
**AWS Services**: AWS Well-Architected Tool (always free)

**Steps**:
1. Navigate to AWS Well-Architected Tool (search "Well-Architected" in console)
2. Define a workload:
   - Name: "Sample Web Application"
   - Description: "A simple web application for learning purposes"
   - Environment: Pre-production
   - Region: your current region
3. Start a review → select "AWS Well-Architected Framework" lens
4. Navigate to the Sustainability pillar section
5. Answer 5-6 sustainability questions (guided answers provided in lab):
   - SUS 1: How do you select Regions to support your sustainability goals?
   - SUS 2: How do you take advantage of user behavior patterns to support sustainability goals?
   - SUS 3: How do you take advantage of software and architecture patterns to support sustainability goals?
   - (Answer based on the sample web application scenario)
6. After answering, review the improvement plan generated
7. Navigate to other pillars briefly - note how questions are structured
8. View the overall workload dashboard - see risk counts per pillar
9. Explore the "Improvement plan" tab
10. Discuss: This tool provides the systematic review process shown in Week 2 lecture (Identify → Evaluate → Prioritize → Test → Deploy → Measure cycle)

**Screenshot**: Well-Architected Tool workload dashboard showing the pillar summary with risk counts (high risk, medium risk, no risk) for the Sustainability pillar

**Cleanup**: Navigate to Well-Architected Tool → Workloads → select the workload → Delete

---

## Implementation Order

1. **Create lab HTML template** - Build one lab file first as the template, get the CSS/styling right
2. **Create `labs/index.html`** - Labs landing page with all 12 lab cards
3. **Create all 12 lab HTML files** - Using the template, create each lab
4. **Update main `index.html`** - Add "Week 2 Labs" card linking to `labs/index.html`
5. **Save implementation plan** - Copy plan to `implementation-plans/waf-labs-plan.md`
6. **Verify** - Open in browser and test all navigation links

## Key Design Decisions

- **Labs use same CSS variable system** as existing pages for visual consistency
- **Each lab is self-contained** - one HTML file with embedded CSS (matching existing pattern)
- **Back link paths**: Lab pages → `index.html` (labs landing), Labs landing → `../index.html` (main site)
- **Pillar color coding**: Each pillar gets a distinct accent color for its badge/headers
- **Step numbering**: CSS-styled numbered circles (similar to the checkmark style in local-environment-setup.html)
- **No external dependencies** beyond Google Fonts (matching existing pattern)

## AWS Free Tier Verification

| Lab | Service | Free Tier | Cost Risk |
|-----|---------|-----------|-----------|
| 1 | CloudTrail | 90-day event history always free | None |
| 2 | CloudWatch + SNS | 10 alarms, 3 dashboards, email free | None |
| 3 | IAM | Always free | None |
| 4 | S3 | 5GB, 20K GET, 2K PUT/month | None |
| 5 | S3 | Same as above | None |
| 6 | VPC | Default VPC + SGs always free | None |
| 7 | EC2 | t2.micro 750 hrs/month | None if terminated |
| 8 | DynamoDB | 25GB + 25 WCU/RCU | None |
| 9 | Budgets | 2 budgets/month free | None |
| 10 | Pricing Calc + Trusted Advisor | Both free | None |
| 11 | S3 | Same as Lab 4/5 | None |
| 12 | Well-Architected Tool | Always free | None |

## Edit to Main `index.html`

Add a new card after the "Local Environment Setup" card:

```html
<a href="labs/index.html" class="card">
    <div class="card-icon">🔬</div>
    <div class="card-title">Week 2 Labs</div>
    <div class="card-description">Hands-on labs for the AWS Well-Architected Framework pillars</div>
</a>
```

## Verification

1. Open `index.html` in browser → verify "Week 2 Labs" card appears and links correctly
2. Open `labs/index.html` → verify all 12 lab cards render with correct pillar grouping
3. Click each of the 12 lab cards → verify each lab page loads with proper styling
4. Verify back links work: lab page → labs landing → main index
5. On each lab page verify: objectives, prerequisites, numbered steps, screenshot instructions, cleanup section, and key takeaways are all present
6. Spot-check free tier claims against current AWS documentation
7. Verify responsive design works at mobile breakpoint (768px)
