// Week 5 slide data. See ./index.js for the shape of a slide
// and how images/notes are resolved.

export default {
  title: 'Cloud Security, HA & Reliability',
  slides: [
    {
      type: 'slide-image-bg',
      note: null,
      content: { ariaLabel: 'The Build Fellowship — title slide with gradient logo and buildfellowship.com' },
    },
    {
      type: 'slide-section-light',
      note: 'Title slide. Three topics today: Security, High Availability, Reliability. They\'re interconnected — a secure system that can\'t recover from failure isn\'t reliable.',
      content: { brandHeader: 'The Build Fellowship', title: 'Cloud Security, High Availability & Reliability', week: 'Week 5', date: 'July 2026' },
    },
    {
      type: 'slide-section-dark',
      note: 'Give them the roadmap. Security → HA (AZ/Regions) → Scalability → Reliability.',
      content: {
        title: 'Contents',
        tocItems: [
          { slideRef: 'Slide 5', label: 'Cloud Security' },
          { slideRef: 'Slide 9', label: 'High Availability' },
          { slideRef: 'Slide 15', label: 'HA – AZ/Regions' },
          { slideRef: 'Slide 20', label: 'HA – Scalability' },
          { slideRef: 'Slide 22', label: 'Reliability' },
        ],
      },
    },
    {
      type: 'slide-agenda',
      note: 'Agenda overview — Terraform review first, then the three main topics.',
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
      type: 'slide-section-dark',
      note: 'Security section. Lead with the real-world breaches — makes it tangible. These are all things that could have been prevented.',
      content: { title: 'Cloud Security' },
    },
    {
      type: 'slide-content',
      note: 'Four breaches, four different root causes. Capital One: misconfigured WAF + overprivileged IAM role. Pegasus: public S3 bucket. Twitch: server config error. Codefinger: compromised credentials. Pattern: misconfiguration, not hacking.',
      content: {
        title: 'AWS Cloud Security – Recent Breaches',
        breachCards: [
          { heading: '2019 – Capital One', text: 'Misconfigured WAF allowed the attacker to grab AWS instance metadata including temporary credentials. Accessed 100M customer records, SSN, emails. Cost: $150 million.' },
          { heading: '2022 – Pegasus Data Breach', text: 'Misconfigured S3 bucket exposed 6.5 TB of sensitive data including crew members\' personal information and operational details.' },
          { heading: '2021 – Twitch', text: 'Over 125 GB of data leaked due to a server configuration error which allowed public access to internal systems.' },
          { heading: '2025 – Codefinger Ransomware', text: 'Compromised AWS credentials allowed attackers to encrypt data in S3 buckets using a custom key, making decryption impossible without the attackers\' keys.' },
        ],
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
      note: 'HA section. Ask: "What does high availability actually mean?" 99.9% uptime = ~8.7 hrs downtime/year. 99.99% = ~52 minutes. The nines matter.',
      content: { title: 'High Availability' },
    },
    {
      type: 'slide-image-bg',
      note: null,
      content: { img: 9, ariaLabel: 'High Availability: single-server tiers (90% each) = 80.2% total availability vs 99.5% desired SLA' },
    },
    {
      type: 'slide-image-bg',
      note: null,
      content: { img: 10, ariaLabel: 'Introducing redundancy: 2 web servers, tier availability = 1-(1-0.9)^2 = 0.99, total 88.2%' },
    },
    {
      type: 'slide-image-bg',
      note: null,
      content: { img: 11, ariaLabel: 'High Availability: 3 web servers, tier availability = 1-(1-0.9)^3 = 0.999, total 89.0%' },
    },
    {
      type: 'slide-image-bg',
      note: null,
      content: { img: 12, ariaLabel: 'High Availability: expand redundancy to web and app tiers (3 each), total availability 98.8%' },
    },
    {
      type: 'slide-image-bg',
      note: null,
      content: { img: 13, ariaLabel: 'High Availability: full redundancy across all tiers including DB replication (Master + 2 Replicas), total availability 99.8%' },
    },
    {
      type: 'slide-image-bg',
      note: null,
      content: { img: 14, ariaLabel: 'HA learnings: Cost vs Value chart showing diminishing returns of redundancy. Key: stack availability cannot exceed its least-available tier.' },
    },
    {
      type: 'slide-content',
      note: 'AZs: close enough for low latency, far enough to survive natural disasters. This is why multi-AZ deployments are the baseline for production.',
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
      note: null,
      content: { img: 16, ariaLabel: 'Multi-AZ architecture: Elastic Load Balancer across AZ-A and AZ-B, each with web servers, app servers, and DB (master + replicas)' },
    },
    {
      type: 'slide-image-bg',
      note: null,
      content: { img: 17, ariaLabel: 'Scalability: Vertical Scaling (increase/decrease capacity of existing instances) vs Horizontal Scaling (add more VMs to spread workload)' },
    },
    {
      type: 'slide-image-bg',
      note: null,
      content: { img: 18, ariaLabel: 'AWS EC2 Auto Scaling concept: Auto Scaling Group with minimum size, desired capacity, and maximum size' },
    },
    {
      type: 'slide-image-bg',
      note: null,
      content: { img: 19, ariaLabel: 'AWS EC2 Auto Scaling full architecture: VPC with ELB, web server fleet and app server fleet auto-scaling, connected to primary database' },
    },
    {
      type: 'slide-content',
      note: 'Auto Scaling Group: 4 modes. Most important: scale based on demand. Set a target tracking policy on CPU utilization — AWS handles the rest. Mention the assignment uses this.',
      content: {
        title: 'High Availability (HA) – Scalability',
        sectionSubtitle: 'AWS EC2 Auto Scaling',
        items: [
          'Maintaining current instance level at all times',
          'Manual Scaling',
          'Scaling based on schedule',
          'Scale based on demand (target tracking)',
        ],
      },
    },
    {
      type: 'slide-image-bg',
      note: null,
      content: { img: 21, ariaLabel: 'HA Scalability for Databases: Aurora Auto Scaling policy configuration for Aurora Replicas' },
    },
    {
      type: 'slide-section-dark',
      note: 'Reliability is about recovery. The definition: recover from disruptions, acquire resources dynamically, mitigate transient issues.',
      content: { title: 'Reliability' },
    },
    {
      type: 'slide-content',
      note: '"Resiliency is the ability of a workload to recover..." Key: chaos engineering, game days. Design for failure.',
      content: {
        title: 'Reliability',
        definitionBox: 'Resiliency is the ability of a workload to recover from infrastructure or service disruptions, dynamically acquire computing resources to meet demand, and mitigate disruptions, such as misconfigurations or transient network issues.',
      },
    },
    {
      type: 'slide-content',
      note: 'Backup hierarchy: manual snapshots → Data Lifecycle Manager → RDS automated backups (30-day limit, 5-min RPO) → AWS Backup (centralized, multi-service). Assignment uses AWS Backup — make sure they understand the vault + plan + selection structure.',
      content: {
        title: 'Reliability – Backup Options',
        items: [
          'Manual Backups – EBS Snapshot, RDS etc.',
          'Automated Backups using Amazon Data Lifecycle Manager for EBS',
          'Automated snapshots using RDS backup policy – Generally limited to 30 days',
          'Point in time restore for RDS – Can have up to 5 minutes of data loss',
          'AWS Backup — centralized backup across FSx, EBS, EC2, EFS, RDS, Aurora, DynamoDB',
        ],
      },
    },
    {
      type: 'slide-image-bg',
      note: null,
      content: { img: 25, ariaLabel: 'AWS Backup service diagram: supports FSx, EBS, EC2, EFS, RDS, Aurora, DynamoDB, Storage Gateway with backup plans and vaults' },
    },
    {
      type: 'slide-content',
      note: 'The Airbnb and Netflix case studies are great reading — real companies, real AWS scale. Cloud Practitioner practice exams are worth doing even if they don\'t pursue the cert.',
      content: {
        title: 'Additional Training & Resources',
        sections: [
          {
            heading: 'Videos & Case Studies',
            readingLinks: [
              { icon: '🎥', label: 'Top 50+ AWS Services Explained in 10 Minutes', url: 'https://www.youtube.com/watch?v=JIbIYCM48to' },
              { icon: '🚀', label: 'AWS re:Invent Talk — Scaling on AWS', url: 'https://www.youtube.com/watch?v=kKjm4ehYiMs' },
              { icon: '🏠', label: 'Airbnb Case Study — Moving to AWS', url: 'https://aws.amazon.com/solutions/case-studies/airbnb-case-study/' },
            ],
          },
          {
            heading: 'Practice Exams — AWS Cloud Practitioner',
            readingLinks: [
              { icon: '☁️', label: 'Official AWS Certified Cloud Practitioner Resources', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/?c=sec&sec=resources' },
              { icon: '📝', label: 'Free Practice Exams — AWSBoy', url: 'https://awsboy.com/aws-practice-exams/practitioner/' },
              { icon: '📋', label: 'Free GitHub Repo — Cloud Practitioner Practice Questions', url: 'https://github.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/blob/master/practice-exam/exams.md' },
            ],
          },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'Security and reliability are some of the most stable, well-paid specialties in cloud — worth naming directly given how much breach/outage content we just covered.',
      content: {
        title: 'Career Connection',
        subtitle: 'This is the work that keeps companies out of the headlines',
        items: [
          'Cloud Security Engineer / Analyst → preventing exactly the kind of breaches we just reviewed',
          'Site Reliability Engineer (SRE) → owns uptime, auto-scaling, and backup/recovery design',
          'These specialties are consistently among the highest-paid in cloud, because the cost of getting them wrong is so visible',
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
      note: null,
      content: { img: 26, ariaLabel: 'The Build Fellowship and OpenAvenues Foundation — closing branding slide' },
    },
  ],
}
