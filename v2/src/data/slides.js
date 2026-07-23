// Per-week slide data.
// Each slide: { type, content, note }
// type → SlideRenderer picks the right layout component
// note → shown only when ?admin=true (presenter notes panel)
// slide-image-bg slides try /public/slides/weekN/SlideN.jpeg, where N = content.img
// (falls back to array position + 1 if content.img is omitted); ariaLabel is the fallback text

const slides = {

  // ─── WEEK 1 ─────────────────────────────────────────────────────────────────
  1: {
    title: 'Introduction',
    slides: [
      {
        type: 'slide-title',
        note: 'Title slide. Welcome everyone. Give a 30-second overview of what today covers before jumping in.',
        content: { label: 'The', title: 'Build\nFellowship', subtitle: 'BUILDFELLOWSHIP.COM' },
      },
      {
        type: 'slide-section-light',
        note: 'Section divider: Introduction. Pause here and do a quick round of names.',
        content: { title: 'Introduction', date: 'July 2026' },
      },
      {
        type: 'slide-agenda',
        note: 'Walk through the agenda briefly. Today: introductions, project layout, final project overview, web hosting concepts, then a live local setup demo.',
        content: {
          title: 'Agenda',
          items: [
            'Introductions',
            'Project layout',
            'Final project',
            'Web application hosting + AWS Cloud',
            'Local Setup Instructions + Demo',
            'Next week Preview',
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'After the agenda, before intros: set expectations for the next 8 weeks. By the end, link this back to today\'s agenda items so students see how each piece builds toward it.',
        content: {
          title: 'Learning Outcomes',
          subtitle: 'By the end of this program, you\'ll be able to...',
          items: [
            'Explain the AWS Well-Architected Framework and apply its 6 pillars to a real design',
            'Describe core AWS services (networking, compute, storage, databases) and when to use each',
            'Write and deploy Infrastructure as Code with Terraform',
            'Identify common cloud security risks and reliability/availability patterns',
            'Present a cloud migration plan the way you would to a hiring manager or client',
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Share your background. Keep it tight — 2 minutes max. Then ask each student: name, background, and one thing they hope to learn. The "But what about software?" line is a good opener.',
        content: {
          title: 'Introductions',
          subtitle: 'A bit about me, a bit about you',
          items: [
            'Indian, Raised in Dubai, UAE',
            'Bachelors, Masters and PhD in Civil Engineering',
            'But what about software?',
            'Master in IT',
            'Past Job: Backend engineer – Node.JS',
            'Platform/DevOps Engineer for CHG HealthCare for 5+ years',
            'Relevant Certifications: AWS Cloud Practitioner, AWS Solutions Architect – Associate, Terraform Associate, Terraform Authoring Professional',
          ],
        },
      },
      {
        type: 'slide-callout',
        note: 'Say this out loud, don\'t just show it. Many of you are coming from non-CS backgrounds, working jobs alongside this, or doing cloud for the first time — same as I was. Confusion is part of learning this material, not a sign you don\'t belong. Ask questions whenever they come up, there\'s no "too basic" question here.',
        content: {
          calloutTitle: 'Before we go further — you belong here',
          calloutText: 'Everyone in this room is learning something new. Questions, mistakes, and "wait, can you repeat that?" are exactly how this is supposed to go — ask anytime.',
        },
      },
      {
        type: 'slide-section-dark',
        note: 'Section divider. Good moment to transition from intros to structure.',
        content: { title: 'Project\nLayout' },
      },
      {
        type: 'slide-two-column',
        note: 'Weeks 1–4: intro, WAF, base cloud concepts, IaC & Terraform. Emphasize this is a build-up — each week depends on the previous one.',
        content: {
          columnTitle: 'Project Layout',
          items: [
            { label: 'Week 1', desc: 'Introduction to the Project, general discussions and local setup' },
            { label: 'Week 2 and 3', desc: 'AWS Well Architected Framework and Base Cloud concepts' },
            { label: 'Week 4', desc: 'Infrastructure as Code (IaC) and Terraform' },
          ],
        },
      },
      {
        type: 'slide-two-column',
        note: 'Weeks 5–8: security & HA, migration project, design review, final presentations. Make clear weeks 6–8 are project-focused — they need to start thinking about it early.',
        content: {
          columnTitle: 'Project Layout',
          items: [
            { label: 'Week 5', desc: 'Cloud Security, High availability and reliability' },
            { label: 'Week 6 and 7', desc: 'Cloud migration project and Design Reviews' },
            { label: 'Week 8', desc: 'Final presentations and Wrap Up' },
          ],
        },
      },
      {
        type: 'slide-section-light',
        note: 'Section divider. The final project is a cloud migration strategy — a company wants to move On-Prem to AWS. They produce an architecture diagram and present in week 8.',
        content: { title: 'Final Project' },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { ariaLabel: 'AWS architecture diagram showing the final project cloud migration scenario' },
      },
      {
        type: 'slide-section-dark',
        note: 'Transition to the technical content. Ask: "What does it mean to host a web application?" Let them answer before moving forward.',
        content: { title: 'Web application\nhosting & AWS Cloud' },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { img: 14, ariaLabel: 'Server room / data center imagery illustrating traditional on-premises infrastructure' },
      },
      {
        type: 'slide-callout',
        note: '"On-demand delivery of IT resources via the Internet, with pay-as-you-go pricing." Ask them to think about what "on-demand" and "pay-as-you-go" really mean vs. buying a server.',
        content: {
          calloutTitle: 'So what is Cloud Computing?',
          calloutText: 'The on-demand delivery of IT resources via the Internet, with pay-as-you-go pricing.',
        },
      },
      {
        type: 'slide-table',
        note: 'AWS has been running cloud since 2006 — 19+ years of learnings baked in. Call out the 70+ services number: students don\'t need to know all of them. We\'ll focus on the core ones.',
        content: {
          tableTitle: 'What sets AWS apart?',
          rows: [
            { label: 'Experience', value: 'Building and managing cloud since 2006' },
            { label: 'Service breadth & depth', value: '70+ services to support virtually any cloud workload' },
            { label: 'Pace of innovation', value: 'History of rapid, customer-driven releases' },
            { label: 'Global footprint', value: '13 regions, 35 availability zones, 56 edge locations' },
            { label: 'Pricing philosophy', value: '51 proactive price reductions to date' },
            { label: 'Ecosystem', value: 'Tens of thousands of partners; 2,500+ Marketplace products' },
          ],
        },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { img: 17, ariaLabel: 'On-Premises vs Cloud comparison — showing CapEx model vs OpEx model, and responsibility shifts' },
      },
      {
        type: 'slide-benefits',
        note: 'Three themes: eliminate technical debt, innovate faster, reduce risk. These map directly to why companies move to cloud. Real examples help here — Netflix, Airbnb, etc.',
        content: {
          benefits: [
            { icon: '💰', title: 'Eliminate costly technical debt and reallocate resources', text: 'so you can deliver high-value, revenue-generating projects faster.' },
            { icon: '📊', title: 'Innovate faster and solidify your competitive advantage', text: 'merging startup agility with enterprise experience and resources.' },
            { icon: '📋', title: 'Reduce risk by focusing resources on security, compliance', text: 'and availability to the most important areas of your business.' },
          ],
        },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { img: 19, ariaLabel: 'AWS Services overview grid showing 70+ services organized by category' },
      },
      {
        type: 'slide-cards',
        note: 'Quick plug for free resources. aws.amazon.com/training has free videos and labs. AWS certifications are genuinely valued by employers.',
        content: {
          cardsTitle: 'AWS Training & Certification',
          cards: [
            { icon: '▶️', title: 'Intro Videos & Labs', text: 'Free videos and labs to help you learn to work with 30+ AWS services – in minutes!' },
            { icon: '👨‍🏫', title: 'Training Classes', text: 'In-person and online courses to build technical skills – taught by accredited AWS instructors' },
            { icon: '💻', title: 'Online Labs', text: 'Practice working with AWS services in live environment – Learn how related services work together' },
            { icon: '🏆', title: 'AWS Certification', text: 'Validate technical skills and expertise - identify qualified IT talent or show you are AWS cloud ready' },
          ],
        },
      },
      {
        type: 'slide-section-dark',
        note: 'Transition to the live demo. Make sure everyone has the local-environment-setup page open.',
        content: { title: 'Local Setup Instructions' },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { ariaLabel: '6 Pillars of the AWS Well-Architected Framework hexagon diagram — preview of next week' },
      },
      {
        type: 'slide-content',
        note: 'Close on why this matters for their careers, not just this course. Cloud skills are some of the highest-demand, highest-starting-salary skills for new grads right now — worth saying explicitly.',
        content: {
          title: 'Career Connection',
          subtitle: 'Why this matters beyond the classroom',
          items: [
            'Cloud Engineer, DevOps Engineer, and Solutions Architect are consistently among the highest-demand entry-level tech roles',
            'Every role we touch this semester (security, networking, IaC) maps to a real job title and job posting',
            'You don\'t need to know everything by week 8 — you need enough to talk credibly about cloud in an interview',
          ],
        },
      },
      {
        type: 'slide-callout',
        note: '1-minute pair-share or journal prompt to close. Don\'t skip this even if you\'re short on time — it\'s 60 seconds and reinforces the whole session.',
        content: {
          calloutTitle: 'Quick Reflection',
          calloutText: 'Pair up for 1 minute: what\'s one thing from today you could mention in a job interview, even briefly?',
        },
      },
    ],
  },

  // ─── WEEK 2 ─────────────────────────────────────────────────────────────────
  2: {
    title: 'AWS Well-Architected Framework',
    slides: [
      {
        type: 'slide-image-bg',
        note: null,
        content: { ariaLabel: 'The Build Fellowship — title slide with gradient logo' },
      },
      {
        type: 'slide-section-light',
        note: 'Title slide. Open with: "What makes a cloud system good?" Let them answer freely before framing it with the WAF.',
        content: { brandHeader: 'The Build Fellowship', title: 'AWS Well-Architected Framework', date: 'July 2026' },
      },
      {
        type: 'slide-agenda',
        note: 'Six pillars today, then the WAF Tool, then lab time. The pillars are not separate — they trade off against each other. Emphasize that throughout.',
        content: {
          title: 'Agenda',
          items: [
            'Operational Excellence Pillar',
            'Sustainability Pillar',
            'Reliability Pillar',
            'Performance Efficiency Pillar',
            'Security Pillar',
            'Cost Optimization Pillar',
            'AWS Well Architected Tool',
            'Labs',
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Set this up before diving into pillars — students should know what they\'re working toward, not just memorizing six names.',
        content: {
          title: 'Learning Outcomes',
          subtitle: 'By the end of today, you\'ll be able to...',
          items: [
            'Name all 6 WAF pillars and explain the core tradeoff each one addresses',
            'Recognize which pillar a given design decision or AWS service choice supports',
            'Use the AWS Well-Architected Tool to evaluate a workload',
            'Connect each pillar to the kind of job role that owns it day-to-day',
          ],
        },
      },
      {
        type: 'slide-section-dark',
        note: 'First pillar: Operational Excellence. Core idea: run and monitor systems to deliver business value, and continuously improve processes.',
        content: {
          title: 'Operational Excellence Pillar',
          readingLinks: [
            { label: 'Operational Excellence Pillar Whitepaper', url: 'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html' },
            { label: 'Design Principles', url: 'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/design-principles.html' },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Overview of the four areas of Operational Excellence before diving into each. These map to the next four slides.',
        content: {
          subtitle: 'Operational Excellence Pillar',
          title: 'Four Areas of Focus',
          definitionGrid: [
            { term: 'Organize', definition: 'Give teams a shared understanding of the workload, their roles, and business goals so they can set the right priorities.' },
            { term: 'Prepare', definition: 'Design workloads for operations and observability — build in telemetry and mitigate deployment risk before you go live.' },
            { term: 'Operate', definition: 'Measure success by business and customer outcomes: understand operational health and respond to events.' },
            { term: 'Evolve', definition: 'Continuously improve — regularly analyze operations and failures, experiment, and learn from what breaks.' },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Organization: teams need shared understanding of the workload and business goals. Ask: "What happens when different teams optimize for different things?" Leads to configuration drift and incidents.',
        content: {
          title: 'Organization',
          description: 'Your teams need to have a shared understanding of your entire workload, their role in it, and shared business goals to set the priorities that will create business success.',
          items: [
            'Evaluate external and internal Customer needs',
            'Governance and compliance requirements',
            'Threat evaluation – AWS Trusted Advisor',
            'Evaluate tradeoffs while managing benefits and risks',
          ],
          readingLinks: [{ label: 'Organization Best Practices', url: 'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/organization.html' }],
        },
      },
      {
        type: 'slide-content',
        note: 'Prepare: design for observability before you need it. You can\'t fix what you can\'t see. Mitigate deployment risks — small, reversible changes over big-bang releases.',
        content: {
          title: 'Prepare',
          description: 'Prepare and design workflows to provide deep insights into the status of various services of your infrastructure.',
          items: [
            'Implement Observability',
            'Design for operations',
            'Mitigate deployment risks',
            'Evaluate tradeoffs while managing benefits and risks',
          ],
          readingLinks: [{ label: 'Prepare Best Practices', url: 'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/prepare.html' }],
        },
      },
      {
        type: 'slide-content',
        note: 'Operate: measure success by business outcomes, not just uptime. Responding to events means having runbooks and on-call processes defined ahead of time.',
        content: {
          title: 'Operate',
          description: 'Successful operation of a workload is measured by the achievement of business and customer outcomes.',
          items: [
            'Utilizing Workload Observability',
            'Understanding operational health',
            'Responding to Events',
          ],
          readingLinks: [{ label: 'Operate Best Practices', url: 'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html' }],
        },
      },
      {
        type: 'slide-content',
        note: 'Evolve: failure is inevitable — what matters is what you learn. Game days, chaos engineering, blameless post-mortems. Key phrase: "Make frequent, small, reversible changes."',
        content: {
          title: 'Evolve',
          description: 'It\'s essential that you regularly provide time for analysis of operations activities, analysis of failures, experimentation, and making improvements. When things fail, ensure your team learns from those failures.',
          readingLinks: [{ label: 'Evolve Best Practices', url: 'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/evolve.html' }],
        },
      },
      {
        type: 'slide-content',
        note: 'Six design principles for OpEx. Ask which two they think are most important for a startup vs. an enterprise.',
        content: {
          title: 'Operational Excellence Pillar — Summary',
          items: [
            'Organize teams around business outcomes',
            'Implement observability for actionable insights',
            'Safely automate where possible',
            'Make frequent, small, reversible changes',
            'Refine operations procedures frequently',
            'Anticipate failure and learn from it',
          ],
          readingLinks: [
            { label: 'Full Operational Excellence Pillar Whitepaper', url: 'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html' },
            { label: 'Framework Overview', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/operational-excellence.html' },
          ],
        },
      },
      {
        type: 'slide-section-dark',
        note: 'Sustainability is the newest pillar (added 2021). Often overlooked but increasingly required by regulation and investors.',
        content: {
          title: 'Sustainability Pillar',
          readingLinks: [
            { label: 'Sustainability Pillar Whitepaper', url: 'https://docs.aws.amazon.com/wellarchitected/latest/sustainability-pillar/sustainability-pillar.html' },
            { label: 'Framework Overview', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/sustainability.html' },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'The sustainability shared responsibility model. AWS handles sustainability OF the cloud (the physical infrastructure); the customer is responsible for sustainability IN the cloud. Walk through the six customer-owned areas.',
        content: {
          subtitle: 'Sustainability Pillar',
          title: 'Shared Responsibility for Sustainability',
          highlight: 'AWS — sustainability OF the cloud: data centers, servers, cooling, water, electricity supply, building materials & waste.',
          description: 'You are responsible for sustainability IN the cloud:',
          securityItems: [
            { heading: 'Data Design & Usage', text: 'Collect and keep only the data you actually need, in the most efficient storage tier, to minimize the resources it consumes.' },
            { heading: 'Software Application Design', text: 'Architect apps to do the same work with fewer resources — lean patterns, managed services, and asynchronous processing.' },
            { heading: 'Platform Deployments & Scaling', text: 'Right-size infrastructure and scale to real demand so you are not powering idle capacity.' },
            { heading: 'Data Storage', text: 'Use lifecycle policies to tier and expire data, shrinking the storage footprint and the energy to maintain it.' },
            { heading: 'Code Efficiency', text: 'Optimize code to use less CPU, memory, and network — more efficient code directly lowers energy use.' },
            { heading: 'Utilization & Scaling', text: 'Maximize utilization of what you provision and scale down or switch off idle resources during low demand.' },
          ],
        },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { img: 13, ariaLabel: 'Sustainability design principles and best practices for cloud workloads' },
      },
      {
        type: 'slide-section-dark',
        note: 'Reliability: the ability to recover from failures and meet demand. Closely tied to HA which we cover in week 5.',
        content: {
          title: 'Reliability Pillar',
          readingLinks: [
            { label: 'Reliability Pillar Whitepaper', url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html' },
            { label: 'Framework Overview', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/a-reliability.html' },
          ],
        },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { img: 15, ariaLabel: 'Reliability pillar: foundations, workload architecture, change management, failure management' },
      },
      {
        type: 'slide-section-dark',
        note: 'Performance Efficiency: use resources efficiently. Key insight: the right resource for the job, not just the fastest or biggest.',
        content: {
          title: 'Performance Efficiency Pillar',
          readingLinks: [
            { label: 'Performance Efficiency Pillar Whitepaper', url: 'https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html' },
            { label: 'Design Principles', url: 'https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/design-principles.html' },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Architecture selection and compute: not all workloads are the same. General purpose (m-series), compute-optimized (c-series), memory-optimized (r-series). Right-sizing matters for both cost AND performance.',
        content: {
          title: 'Performance Efficiency Pillar',
          subtitle: 'Definition',
          description: 'Use cloud resources efficiently to meet performance requirements and maintain that efficiency as demand changes and technologies evolve.',
          items: [
            'Select efficient, high-performing cloud resources and architecture patterns',
            'Architecture Selection',
            'Identify and optimize compute options for performance efficiency in the cloud',
            'Compute & Hardware',
          ],
          readingLinks: [
            { label: 'Architecture Selection', url: 'https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/architecture-selection.html' },
            { label: 'Compute & Hardware', url: 'https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/compute-and-hardware.html' },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Data access patterns drive storage choices. Latency and throughput — different problems, different solutions. Culture: performance doesn\'t happen by accident.',
        content: {
          title: 'Performance Efficiency Pillar',
          subtitle: 'Data Management',
          description: 'Optimize data storage, movement and access patterns, and performance efficiency of data stores.',
          items: [
            'Design optimal networking that reduces latency, increases throughput and eliminates jitter',
            'Networking and Content Delivery',
            'Build a culture that fosters performance efficiency of cloud workloads',
            'Process & Culture',
          ],
          readingLinks: [
            { label: 'Data Management', url: 'https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/data-management.html' },
            { label: 'Networking & Content Delivery', url: 'https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/networking-and-content-delivery.html' },
          ],
        },
      },
      {
        type: 'slide-section-dark',
        note: 'Security: implement a strong identity foundation, enable traceability, apply security at all layers. Core principle: assume breach. Defense in depth.',
        content: {
          title: 'Security Pillar',
          readingLinks: [
            { label: 'Security Pillar Whitepaper', url: 'https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html' },
            { label: 'Framework Overview', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/security.html' },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Security design principles, part 1 of 3 — Identity & Traceability. These are AWS\'s own Well-Architected principles; the AWS services named map directly to the Security pillar labs (IAM least privilege, CloudTrail).',
        content: {
          subtitle: 'Security Pillar · Design Principles (1 of 3)',
          title: 'Identity & Traceability',
          sections: [
            {
              heading: 'Implement a strong identity foundation',
              items: [
                'Grant least privilege — authorize every interaction explicitly',
                'Enforce separation of duties',
                'Centralize identity with IAM Identity Center',
                'Use IAM roles + short-lived credentials; require MFA',
                'Eliminate long-term static keys; avoid the root user',
              ],
            },
            {
              heading: 'Maintain traceability',
              items: [
                'Monitor, alert, and audit changes in real time',
                'Integrate logs & metrics to investigate and act automatically',
                'CloudTrail — a record of every API call',
                'AWS Config — track configuration drift',
                'GuardDuty & Security Hub — detect and centralize findings',
              ],
            },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Security design principles, part 2 of 3 — Defense in Depth & Automation.',
        content: {
          subtitle: 'Security Pillar · Design Principles (2 of 3)',
          title: 'Defense in Depth & Automation',
          sections: [
            {
              heading: 'Apply security at all layers',
              items: [
                'Defense in depth — layer multiple controls',
                'Protect the edge with AWS WAF and Shield',
                'Isolate workloads in private VPC subnets',
                'Filter traffic with security groups & network ACLs',
                'Harden the OS, application, and code',
              ],
            },
            {
              heading: 'Automate security best practices',
              items: [
                'Software-based controls scale securely and cheaply',
                'Define guardrails as code in version-controlled templates',
                'CloudFormation / CDK / Terraform for secure architectures',
                'AWS Config rules flag non-compliant resources',
                'Security Hub automations remediate findings',
              ],
            },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Security design principles, part 3 of 3 — Data Protection & Response.',
        content: {
          subtitle: 'Security Pillar · Design Principles (3 of 3)',
          title: 'Data Protection & Response',
          securityItems: [
            {
              heading: 'Protect data in transit & at rest',
              items: [
                'Classify data into sensitivity levels',
                'Encrypt with AWS KMS; enforce TLS via ACM',
                'Enable default encryption on S3 and EBS',
                'Discover sensitive data with Amazon Macie',
              ],
            },
            {
              heading: 'Keep people away from data',
              items: [
                'Reduce or eliminate direct human access to data',
                'Use SSM Session Manager instead of SSH / bastions',
                'Prefer automation over manual data handling',
                'Gate elevated access behind audited break-glass',
              ],
            },
            {
              heading: 'Prepare for security events',
              items: [
                'Define incident response policies & processes',
                'Rehearse with simulations (GameDays)',
                'Speed detection with GuardDuty & Detective',
                'Automate containment and recovery',
              ],
            },
          ],
        },
      },
      {
        type: 'slide-section-dark',
        note: 'Cost Optimization: the most misunderstood pillar. It\'s NOT about spending the least — it\'s about getting the most value from every dollar.',
        content: {
          title: 'Cost Optimization Pillar',
          readingLinks: [
            { label: 'Cost Optimization Pillar Whitepaper', url: 'https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html' },
            { label: 'Framework Overview', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/cost-optimization.html' },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Cost Optimization design principle 1 of 5. AWS whitepaper: build cost management as an organizational capability, like Security or Operational Excellence.',
        content: {
          subtitle: 'Cost Optimization · Design Principle 1 of 5',
          title: 'Implement Cloud Financial Management',
          description: 'AWS: "Invest in Cloud Financial Management and cost optimization. Build capability through knowledge, programs, resources, and processes to become a cost-efficient organization."',
          items: [
            'Treat cost management as a discipline — a FinOps practice with owners',
            'Build cost awareness across both engineering and finance',
            'Set budgets and forecasts with AWS Budgets',
            'Report and dashboard spend with Cost Explorer & the Cost and Usage Report',
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Cost Optimization design principle 2 of 5.',
        content: {
          subtitle: 'Cost Optimization · Design Principle 2 of 5',
          title: 'Adopt a Consumption Model',
          description: 'AWS: "Pay only for the computing resources you require, and increase or decrease usage based on business requirements — not elaborate forecasting."',
          items: [
            'Stop idle dev/test resources — up to ~75% savings (8h/day vs 24/7)',
            'Scale to demand with Auto Scaling and serverless (Lambda, Fargate)',
            'Schedule start/stop for non-production environments',
            'Match capacity to actual usage instead of peak forecasts',
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Cost Optimization design principle 3 of 5.',
        content: {
          subtitle: 'Cost Optimization · Design Principle 3 of 5',
          title: 'Measure Overall Efficiency',
          description: 'AWS: "Measure the business output of the workload and the costs associated with delivering it. Use this to know the gains from increasing output and reducing costs."',
          items: [
            'Define a unit metric — cost per transaction, user, or order',
            'Track cost against business output over time, not in isolation',
            'Right-size using AWS Compute Optimizer and Cost Explorer',
            'Optimize for value delivered, not just the lowest bill',
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Cost Optimization design principle 4 of 5.',
        content: {
          subtitle: 'Cost Optimization · Design Principle 4 of 5',
          title: 'Stop Spending on Undifferentiated Heavy Lifting',
          description: 'AWS: "AWS does the heavy lifting of data center operations — racking, stacking, and powering servers — and managed services remove the burden of managing operating systems and applications, so you can focus on customers and business projects."',
          items: [
            'Prefer managed services (RDS, DynamoDB, Lambda, Fargate) over self-managed',
            'Offload patching, scaling, and backups to AWS',
            'Redirect saved engineering effort to customer-facing work',
            'Cut operational cost, not just infrastructure cost',
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Cost Optimization design principle 5 of 5.',
        content: {
          subtitle: 'Cost Optimization · Design Principle 5 of 5',
          title: 'Analyze and Attribute Expenditure',
          description: 'AWS: "The cloud makes it simple to accurately identify the usage and cost of systems, permitting transparent attribution of IT costs to individual workload owners — measuring ROI and letting owners optimize their resources."',
          items: [
            'Tag resources with cost allocation tags (team, project, environment)',
            'Break down spend by owner with Cost Explorer and the CUR',
            'Enable showback/chargeback per team or product',
            'Give workload owners the visibility to optimize their own costs',
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'The WAF Tool in the AWS Console. Walk through how it works: define a workload, answer questions per pillar, get a risk report. It\'s a framework, not a pass/fail test.',
        content: {
          title: 'AWS Well-Architected Tool',
          subtitle: 'Best practices and an action plan',
          description: 'Manual intervention and sound understanding of the business case is still needed.',
          items: [
            'Architectural Guidance',
            'Point-in-time milestones, track changes',
            'Measure improvements',
            'Not a silver bullet',
          ],
          readingLinks: [
            { label: 'AWS Well-Architected Tool', url: 'https://aws.amazon.com/well-architected-tool/' },
            { label: 'User Guide', url: 'https://docs.aws.amazon.com/wellarchitected/latest/userguide/intro.html' },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Skill Spotlight moment — name the actual job titles tied to each pillar before moving to labs. This is what makes the WAF feel less abstract.',
        content: {
          title: 'Career Connection',
          subtitle: 'Each pillar is somebody\'s job title',
          items: [
            'Operational Excellence → DevOps Engineer, Site Reliability Engineer',
            'Security → Security Engineer, Cloud Security Analyst',
            'Reliability & Performance Efficiency → Site Reliability Engineer, Solutions Architect',
            'Cost Optimization → Cloud FinOps Analyst',
            'Sustainability → Sustainability / Green IT Engineer (a fast-growing, newer specialty)',
          ],
        },
      },
      {
        type: 'slide-callout',
        note: '1-minute pair-share before labs. Helps them carry the framework into the hands-on work instead of treating it as separate.',
        content: {
          calloutTitle: 'Quick Reflection',
          calloutText: 'Which pillar feels closest to a role you\'d actually want? Tell the group why, in one sentence.',
        },
      },
      {
        type: 'slide-section-dark',
        note: 'Transition to labs. Today\'s labs cover all 6 pillars. Students pick 1–2 to complete now, finish the rest before next week.',
        content: { title: 'Labs', readingLabel: 'Hands-On Labs' },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { img: 27, ariaLabel: 'The Build Fellowship and OpenAvenues Foundation — closing branding slide' },
      },
    ],
  },

  // ─── WEEK 3 ─────────────────────────────────────────────────────────────────
  3: {
    title: 'Base Cloud Concepts',
    slides: [
      {
        type: 'slide-image-bg',
        note: null,
        content: { ariaLabel: 'The Build Fellowship — title slide with gradient logo and buildfellowship.com' },
      },
      {
        type: 'slide-section-light',
        note: 'Heaviest technical week. Tip: draw diagrams live as you explain each concept. Pause frequently and ask comprehension questions.',
        content: { title: 'Base Cloud Concepts', week: 'Week 3' },
      },
      {
        type: 'slide-toc',
        note: 'Four domains today, each building on the previous. Networking → Databases → Compute → Storage.',
        content: {
          title: 'Contents',
          items: [
            { number: '01', label: 'AWS Cloud Networking' },
            { number: '02', label: 'AWS Databases' },
            { number: '03', label: 'AWS Compute' },
            { number: '04', label: 'AWS Storage' },
          ],
        },
      },
      // {
      //   type: 'slide-agenda',
      //   note: 'Lab review first, then networking → databases → compute → storage.',
      //   content: {
      //     title: 'Agenda',
      //     items: ['Lab Review', 'AWS Cloud Networking', 'AWS Databases', 'AWS Compute', 'AWS Storage'],
      //   },
      // },
      {
        type: 'slide-content',
        note: 'This is the heaviest content week — anchor it with explicit outcomes upfront so it doesn\'t feel like a firehose of services. Remind them they don\'t need to memorize every pricing number, just the decision logic.',
        content: {
          title: 'Learning Outcomes',
          subtitle: 'By the end of today, you\'ll be able to...',
          items: [
            'Explain what a VPC, subnet, and security group are and how they relate',
            'Choose between RDS, Aurora, and DynamoDB for a given use case',
            'Choose between EC2, Lambda, ECS/EKS for a given compute workload',
            'Choose between S3, EBS, and EFS for a given storage need',
          ],
        },
      },
      {
        type: 'slide-section-dark',
        note: 'AWS Cloud Networking. Open with: "Before we put anything in the cloud, we need a network." Draw a basic VPC on screen.',
        content: { title: 'AWS Cloud Networking' },
      },
      {
        type: 'slide-content',
        note: 'Walk through each VPC concept. Emphasize: subnets are AZ-scoped; security groups are stateful. VPC itself is free but NAT gateway is not.',
        content: {
          title: 'AWS Cloud Networking — Virtual Private Cloud',
          definitionGrid: [
            { term: 'What is a VPC?', definition: 'A logically isolated section of the AWS Cloud spanning a whole region including multiple availability zones.' },
            { term: 'Default VPC & Subnet', definition: 'Each AWS Account has a default VPC with a default Public Subnet in each AZ of the region.' },
            { term: 'Subnets', definition: 'A range of IP Addresses in your VPC. Resides in a single AZ. Sort of like a partition on a hard drive.' },
            { term: 'Gateways', definition: 'Horizontally Scaled, Redundant, Highly available VPC components that allow communication between VPC and the internet.' },
            { term: 'Security Groups', definition: 'Controls traffic that is allowed to enter and leave the VPC. Associated with resources within a VPC.' },
            { term: 'Pricing', definition: 'VPC by itself is free; its components such as NAT gateways, IP Addresses, etc. may cost.' },
          ],
        },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { ariaLabel: 'AWS VPC architecture diagram: us-east-1 region with public and private subnets across two availability zones, internet gateway, and security groups' },
      },
      {
        type: 'slide-content',
        note: 'Cost slide — important. VPC itself is free. NAT Gateway is NOT free: $0.045/hr + $0.045/GB data. Common unexpected cost for beginners. Static IPs also cost money when idle.',
        content: {
          title: 'AWS Cloud Networking — Costs',
          subtitle: 'VPC, Subnets, Routing tables',
          items: [
            'NAT Gateway – Needed for external access from private subnets',
            '$0.045 per gateway per hour',
            '$0.045 per GB Data processed',
            'Static IP Address',
            'Hourly charge for in-use Public IPv4 Address: $0.005/hr',
            'Hourly charge for idle Public IPv4 Address: $0.005/hr',
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Data transfer costs are often the biggest surprise. 100 GB free per month across all services. Anything beyond that starts at $0.09/GB.',
        content: {
          title: 'AWS Cloud Networking — Costs',
          callout: 'Don\'t forget — Data Transfer Costs!',
          tableTitle: 'Data Transfer OUT From Amazon EC2 To Internet',
          tableNote: 'AWS customers receive 100 GB of data transfer out to the internet free each month, aggregated across all AWS Services and Regions.',
          rows: [
            { tier: 'All data transfer in', price: '$0.00 per GB' },
            { tier: 'First 10 TB / Month', price: '$0.09 per GB' },
            { tier: 'Next 40 TB / Month', price: '$0.085 per GB' },
            { tier: 'Next 100 TB / Month', price: '$0.07 per GB' },
            { tier: 'Greater than 150 TB / Month', price: '$0.05 per GB' },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Point them to the reference architecture link — a basic AWS Cloud Network diagram is the best visual aid. VPC User Guide is the authoritative source.',
        content: {
          title: 'Additional Reading',
          subtitle: 'AWS Cloud Networking',
          readingLinks: [
            { icon: '🗺️', label: 'Architecture diagram — Basic AWS Cloud Network', url: 'https://app.cloudcraft.co/view/4afc0880-fc20-41ec-b366-fafafb235795?key=6c615d73-3247-4ef8-a729-805e90ed608d' },
            { icon: '🌐', label: 'AWS VPC User Guide — Official Docs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html' },
            { icon: '🔧', label: 'VPC with Private Subnets & NAT Gateway — Reference Architecture', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-example-private-subnets-nat.html' },
            { icon: '📋', label: 'Amazon VPC Cheat Sheet — Tutorials Dojo', url: 'https://tutorialsdojo.com/amazon-vpc/' },
            { icon: '🎥', label: 'Amazon VPC Full Course — freeCodeCamp', url: 'https://www.freecodecamp.org/news/amazon-virtual-private-cloud-course/' },
          ],
        },
      },
      {
        type: 'slide-section-dark',
        note: 'AWS Databases. Open with: "What types of databases do you know?" RDS (relational), DynamoDB (NoSQL), Aurora (managed MySQL/PostgreSQL-compatible).',
        content: { title: 'AWS Databases' },
      },
      {
        type: 'slide-content',
        note: 'AWS has a wide array of DB options. Between fully managed vs fully configurable, SQL vs NoSQL — the right choice depends on access patterns and scale.',
        content: {
          title: 'AWS Databases',
          subtitle: 'Choose your DB wisely',
          description: 'AWS offers a wide array of options. Between fully managed vs fully configurable, SQL vs NoSQL, persistent vs temporary, etc. Each has its unique advantages and associated costs.',
          highlight: 'Most widely used: AWS RDS, AWS Aurora, AWS DynamoDB',
        },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { ariaLabel: 'AWS RDS features: No infrastructure management, Cost-effective, Application compatibility, Instant provisioning, Scale up/down' },
      },
      {
        type: 'slide-content',
        note: 'RDS supports 6 engines. Multi-AZ gives you 99.95% SLA. Automated backups make it easy. This is the default choice for relational workloads.',
        content: {
          title: 'AWS Relational Database Service (RDS)',
          subtitle: 'AWS Databases',
          items: [
            'Multi-engine support: Aurora, MySQL, MariaDB, PostgreSQL, Oracle, SQL Server',
            'Automated provisioning, Scaling, Patching, Backup/Restore',
            'High availability with RDS Multi-AZ, Auto-Failover',
            '99.95% SLA for Multi-AZ deployments',
            'Security and Monitoring built in',
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Aurora is 5x faster than MySQL at the same price — but fully managed. The distributed storage architecture means you get multi-AZ automatically.',
        content: {
          title: 'AWS Aurora',
          subtitle: 'AWS Databases',
          items: [
            'High Performance and Scalability',
            'Compatibility with MySQL and PostgreSQL',
            'Automated Backups and Point in Time recovery',
            'Multi AZ Deployment — Using a distributed storage architecture',
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'DynamoDB is for when you need unlimited scale on simple access patterns. NoSQL means no joins, no complex queries. But it scales to any size and is very fast.',
        content: {
          title: 'AWS DynamoDB',
          subtitle: 'AWS Databases',
          sections: [
            {
              heading: 'Advantages',
              items: [
                'NoSQL Database Service — Basically a bunch of JSON files',
                'Supports document and key-value store models',
                'Automatic data replication and backups to S3',
                'Highly scalable — only pay for what you use',
                'Fast, very fast!',
              ],
            },
            {
              heading: 'Limits',
              items: [
                '64 KB limit on row size',
                'Consistency is expensive',
                'No relational models, no joins',
                'Indexing can get expensive',
              ],
            },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Key resource: Aurora vs RDS comparison. Aurora is 5x faster than MySQL at the same price — but managed. DynamoDB is for when you need unlimited scale on simple access patterns.',
        content: {
          title: 'Additional Reading',
          subtitle: 'AWS Databases',
          readingLinks: [
            { icon: '📖', label: 'Difference between MySQL and Aurora', url: 'https://www.percona.com/blog/when-should-i-use-amazon-aurora-and-when-should-i-use-rds-mysql' },
            { icon: '🗄️', label: 'Getting Started with Amazon RDS — AWS Docs', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/gettingstartedguide/what-is-rds.html' },
            { icon: '📦', label: 'Getting Started with Amazon DynamoDB — AWS Docs', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStartedDynamoDB.html' },
            { icon: '⚡', label: 'Amazon Aurora vs Amazon RDS — Tutorials Dojo', url: 'https://tutorialsdojo.com/amazon-aurora-vs-amazon-rds/' },
            { icon: '📊', label: 'Amazon RDS vs DynamoDB — Digital Cloud Training', url: 'https://digitalcloud.training/amazon-rds-vs-dynamodb/' },
          ],
        },
      },
      {
        type: 'slide-section-dark',
        note: 'AWS Compute. Three main categories: EC2 (virtual machines), containers (ECS/EKS), serverless (Lambda). The trend is toward managed/serverless.',
        content: { title: 'AWS Compute' },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { ariaLabel: 'AWS Compute services overview: EC2, Containers (ECS/EKS), Serverless (Fargate/Lambda), Elastic Load Balancing' },
      },
      {
        type: 'slide-content',
        note: 'EC2 lets you rent virtual servers. You choose instance type — general purpose, memory-intensive, GPU. Full control over the OS and software.',
        content: {
          title: 'AWS Compute — EC2',
          description: 'Amazon Elastic Compute Cloud (EC2) is a web service that provides resizable compute capacity in the cloud. EC2 allows you to rent virtual servers (called instances) from Amazon\'s cloud infrastructure, which you can use to run your applications or services. You can choose the instance type based on your needs, whether it\'s for general-purpose computing, memory-intensive tasks, or high-performance computing.',
        },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { ariaLabel: 'Benefits of AWS EC2: Complete Control, Secure, Flexible, Low-cost, Dependable, Web-Scale Computing with Elasticity' },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { ariaLabel: 'AWS EC2 architecture: instance connected to an EBS root volume with partitions for root, swap, home, usr, var' },
      },
      {
        type: 'slide-content',
        note: 'Three pricing models. On-Demand is most flexible (pay by the hour). Savings Plans give up to 72% off with a 1 or 3-year commitment. Spot is up to 90% off but can be interrupted.',
        content: {
          title: 'AWS Compute — EC2 Pricing',
          pricingTiers: [
            { name: 'On-Demand', details: ['Pay by the Hour', 'No long-term commitments', 'Most expensive'] },
            { name: 'Saving Plans', details: ['Discounts of up to 72%', 'Committing use for 1-year / 3-year term', 'Steady availability'] },
            { name: 'Spot', details: ['Save up to 90% using unused EC2 capacity', 'Only for fault tolerant or stateless workloads', 'Plan for interruptions'] },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'Lambda: no servers to manage. Pay per execution (100ms resolution). Great for event-driven workloads — not for long-running processes. Mention cold start latency.',
        content: {
          title: 'AWS Compute — Lambda',
          subtitle: 'No need for managing servers or infrastructure',
          description: 'Each execution is independent. Scale from a dozen to hundreds of thousands per second.',
          items: [
            'Serverless — no infrastructure to manage',
            'Automatic Scaling',
            'Millisecond resolution pricing',
            'Pay as You Go',
            'Supports Node.js, Python, Java, Ruby, .NET, and more',
          ],
        },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { ariaLabel: 'AWS Lambda pricing calculator: 100 requests/sec, 50ms duration, 128MB memory. Free tier: 1M requests/month and 400,000 GB-seconds of compute time.' },
      },
      {
        type: 'slide-content',
        note: 'Walk through the Lambda pricing calculation. At 100 req/sec, the compute cost is ~$20/month and request cost is ~$52/month. Total ~$73/month with free tier.',
        content: {
          title: 'AWS Compute — Lambda Pricing',
          calcSections: [
            {
              heading: 'Unit Conversions',
              lines: [
                'Requests: 100/s × 60 × 60 × 730 = 262,800,000/mo',
                'Memory: 128 MB × 0.0009765625 = 0.125 GB',
                'Storage: 512 MB × 0.0009765625 = 0.5 GB',
              ],
            },
            {
              heading: 'Compute Charges',
              lines: [
                '262.8M × 50ms × 0.001 = 13,140,000 compute seconds',
                '0.125 GB × 13,140,000s = 1,642,500 GB-seconds',
                '1,642,500 − 400,000 (free) = 1,242,500 billable GB-s',
                '1,242,500 × $0.0000166667 = $20.71 / month',
              ],
            },
            {
              heading: 'Request Charges',
              lines: [
                '262,800,000 − 1,000,000 (free) = 261,800,000 billable',
                '261,800,000 × $0.0000002 = $52.36 / month',
              ],
            },
            {
              heading: 'Ephemeral Storage',
              lines: ['0.5 GB − 0.5 GB free = $0.00 / month'],
            },
          ],
          result: 'Lambda Cost (with Free Tier): $20.71 + $52.36 = $73.07 USD / month',
        },
      },
      {
        type: 'slide-content',
        note: 'Containers package an app with everything it needs to run. ECS and EKS are the two AWS services that run and orchestrate those containers at scale. ECS = simpler, AWS-native. EKS = managed Kubernetes, industry-standard but more complex. Both can run on EC2 you manage or on Fargate (serverless).',
        content: {
          title: 'AWS Compute — Containers: ECS & EKS',
          subtitle: 'Two ways to run and orchestrate containers on AWS',
          description: 'A container bundles your app with its dependencies so it runs the same everywhere. ECS and EKS are orchestrators — they schedule, scale, and keep those containers healthy:',
          definitionGrid: [
            {
              term: 'ECS — Elastic Container Service',
              definition: "AWS's own container orchestrator. Deeply integrated with AWS (IAM, ALB, CloudWatch) and simple to learn, with less to configure and operate. Best when you want to run containers on AWS without managing Kubernetes.",
            },
            {
              term: 'EKS — Elastic Kubernetes Service',
              definition: 'Managed Kubernetes — AWS runs the control plane for you. Uses the open-source, industry-standard Kubernetes API, so skills and tooling are portable across clouds. More powerful and more complex than ECS.',
            },
          ],
          highlight: 'Both can run on EC2 instances you manage, or on Fargate — serverless compute where AWS provisions the capacity and you never touch a server.',
        },
      },
      {
        type: 'slide-content',
        note: 'The decision framework. EC2 = full control / legacy / long-running. Lambda = short event-driven bursts, scale to zero. ECS = containers, AWS-native simplicity. EKS = containers, need Kubernetes / multi-cloud portability. Encourage students to reason about workload shape, not just pick what they know.',
        content: {
          title: 'AWS Compute — Which One Should You Use?',
          subtitle: 'Match the compute service to the shape of your workload',
          definitionGrid: [
            {
              term: 'EC2 — Virtual Machines',
              definition: 'Use when you need full control of the OS, long-running or steady workloads, custom software, or are lifting-and-shifting an existing app. Most flexible, but you patch and manage the servers.',
            },
            {
              term: 'Lambda — Functions',
              definition: 'Use for short, event-driven tasks: API endpoints, file/stream processing, scheduled jobs, and spiky traffic. Scales to zero (no cost when idle) but has time limits and cold starts — not for long-running work.',
            },
            {
              term: 'ECS — Containers, AWS-native',
              definition: 'Use when your app is containerized and you want orchestration without the Kubernetes learning curve. Great default for teams already all-in on AWS.',
            },
            {
              term: 'EKS — Containers, Kubernetes',
              definition: 'Use when you already run Kubernetes, need its ecosystem, or want multi-cloud/portable workloads. Worth the added complexity when those requirements are real.',
            },
          ],
          highlight: 'Rule of thumb: functions for events, containers (ECS/EKS) for services, EC2 when you need the whole machine.',
        },
      },
      {
        type: 'slide-content',
        note: 'EKS = Kubernetes on AWS. ECS = simpler, AWS-native container orchestration. Fargate = serverless containers (no EC2 to manage). All are relevant for modern web apps.',
        content: {
          title: 'Additional Reading',
          subtitle: 'AWS Compute',
          readingLinks: [
            { icon: '⚙️', label: 'AWS EKS — Amazon Elastic Kubernetes Service', url: 'https://www.geeksforgeeks.org/amazon-web-services-introduction-to-amazon-eks/' },
            { icon: '🐳', label: 'AWS ECS — How it works (Tutorial)', url: 'https://medium.com/boltops/gentle-introduction-to-how-aws-ecs-works-with-example-tutorial-cea3d27ce63d' },
            { icon: '☁️', label: 'AWS Fargate', url: 'https://aws.amazon.com/fargate/' },
            { icon: 'λ', label: 'AWS Lambda Pricing', url: 'https://aws.amazon.com/lambda/pricing/' },
            { icon: '🖥️', label: 'Launch Your First Amazon EC2 Instance', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/tutorial-launch-my-first-ec2-instance.html' },
            { icon: 'λ', label: 'Create Your First Lambda Function — AWS', url: 'https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html' },
          ],
        },
      },
      {
        type: 'slide-section-dark',
        note: 'AWS Storage. Three main options: S3 (object), EBS (block), EFS (file). Different use cases — the wrong choice can be expensive or cause performance issues.',
        content: { title: 'AWS Storage' },
      },
      {
        type: 'slide-content',
        note: 'S3: object storage, files up to 5TB. Storage classes: Standard → Standard-IA → Glacier. Each tier is cheaper but adds retrieval latency/cost. Lifecycle policies automate the tiering.',
        content: {
          title: 'AWS Storage — S3',
          subtitle: 'Object storage — any file type, up to 5 TB per object, pay as you go',
          description: 'Three families of storage classes — colder tiers cost less but take longer to retrieve. Storage prices are per GB-month (us-east-1):',
          pricingTiers: [
            {
              name: 'Standard',
              details: [
                'Frequent access · instant (ms) retrieval',
                'S3 Standard — $0.023/GB · no retrieval fee',
                'live sites, apps, analytics',
                'Intelligent-Tiering — $0.023/GB',
                'auto-tiers when access is unknown',
              ],
            },
            {
              name: 'Infrequent Access',
              details: [
                'Occasional access · instant (ms) retrieval',
                'Standard-IA — $0.0125/GB',
                'backups, disaster recovery',
                'One Zone-IA — $0.01/GB',
                'reproducible / non-critical data',
              ],
            },
            {
              name: 'Glacier',
              details: [
                'Archival · rarely accessed (~quarterly)',
                'Instant Retrieval — $0.004/GB · ms',
                'same ms speed as Standard, but ~6× cheaper storage + $0.03/GB retrieval fee',
                'Flexible — $0.0036/GB · mins–12 hrs',
                'Deep Archive — $0.00099/GB · 12–48 hrs',
              ],
            },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'EBS vs EFS side by side. EBS = block storage, a private disk for ONE EC2 instance (boot volumes, databases). EFS = shared file system for MANY instances at once (like a network drive). Deciding question: how many instances need the data at once? One → EBS; many sharing files → EFS. EBS is cheaper per GB; EFS costs more but auto-scales and is multi-AZ.',
        content: {
          title: 'AWS Storage — EBS vs EFS',
          subtitle: 'Block storage for one instance vs a shared file system for many',
          sections: [
            {
              heading: 'EBS — Elastic Block Store',
              items: [
                'Block storage — a private disk for ONE EC2 instance at a time',
                'Boot/OS volumes, databases, single-app data',
                'Highest, most consistent low-latency performance',
                'Single-AZ, with replication within that AZ',
                'Encryption + backups via EBS snapshots to S3 (snapshots cost too)',
                'Optimizable cost/performance; cheaper per GB but fixed provisioned size',
              ],
            },
            {
              heading: 'EFS — Elastic File System',
              items: [
                'File storage — a shared network drive for MANY instances at once',
                'Shared content, CMS, web farms, ML datasets, home dirs',
                'Unlimited, automatic scaling — no fixed size to manage',
                'Built-in multi-AZ redundancy',
                'Can scale to higher throughput than EBS',
                'Costs more per GB, priced for elasticity + concurrent access',
              ],
            },
          ],
          highlight: 'Choosing: how many instances need the data at once? One → EBS; many sharing files → EFS.',
        },
      },
      {
        type: 'slide-content',
        note: 'The "S3 vs EBS vs EFS" cheat sheet is the best quick reference. Common question: "When do I use S3 vs EBS?" S3 = files you access via URL or SDK. EBS = files your OS needs to mount.',
        content: {
          title: 'Additional Reading',
          subtitle: 'AWS Storage',
          readingLinks: [
            { icon: '🪣', label: 'AWS Storage Tutorial: S3 and EFS — DataCamp', url: 'https://www.datacamp.com/tutorial/aws-s3-efs-tutorial' },
            { icon: '📊', label: 'Amazon S3 vs EBS vs EFS — Tutorials Dojo', url: 'https://tutorialsdojo.com/amazon-s3-vs-ebs-vs-efs/' },
            { icon: '📖', label: 'Demystifying AWS Storage: S3, EBS, and EFS — Medium', url: 'https://neal-davis.medium.com/demystifying-aws-storage-s3-ebs-and-efs-e5b2257981c8' },
            { icon: '💡', label: 'EBS vs EFS vs S3: When to Use Each', url: 'https://www.justaftermidnight247.com/insights/ebs-efs-and-s3-when-to-use-awss-three-storage-solutions/' },
          ],
        },
      },
      {
        type: 'slide-content',
        note: 'These four domains are exactly what a Cloud/Solutions Architect or Backend/Platform Engineer is asked about in interviews. Worth naming explicitly before the quiz tease.',
        content: {
          title: 'Career Connection',
          subtitle: 'These four domains show up in nearly every cloud interview',
          items: [
            'Networking (VPC, subnets, security groups) → Cloud Engineer, Network Engineer',
            'Databases (RDS, Aurora, DynamoDB) → Database Administrator, Backend Engineer',
            'Compute (EC2, Lambda, containers) → Platform Engineer, Backend Engineer',
            'Storage (S3, EBS, EFS) → Solutions Architect, Cloud Engineer',
          ],
        },
      },
      {
        type: 'slide-callout',
        note: '1-minute reflection before the quiz tease — reinforces retention and gives a natural breather after a dense session.',
        content: {
          calloutTitle: 'Quick Reflection',
          calloutText: 'Of the four domains today, which one would you want to dig into deeper, and why?',
        },
      },
      {
        type: 'slide-section-dark',
        note: 'Tease next week\'s quiz to encourage them to review this week\'s material. The quiz covers WAF pillars + today\'s concepts.',
        content: { title: 'Coming next week…\nQuiz!' },
      },
      {
        type: 'slide-image-bg',
        note: null,
        content: { img: 33, ariaLabel: 'The Build Fellowship and OpenAvenues Foundation — closing branding slide' },
      },
    ],
  },

  // ─── WEEK 4 ─────────────────────────────────────────────────────────────────
  4: {
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
        type: 'slide-image-bg',
        note: null,
        content: { ariaLabel: 'Infrastructure as Code — definition, benefits, and multi-cloud environment diagram showing AWS, GCP, Azure with Dev, SIT, UAT, and Prod environments' },
      },
      {
        type: 'slide-image-bg',
        note: 'Terraform workflow: Write HCL → terraform init → terraform plan → terraform apply → terraform destroy. The plan step is critical — always review it.',
        content: { ariaLabel: 'Infrastructure as Code - Terraform — definition, benefits, and file structure: main.tf, provider.tf, variables.tf, output.tf, terraform.tfvars, terraform.tfstate' },
      },
      {
        type: 'slide-content',
        note: 'The HashiCorp Getting Started guide is the best entry point. The AWS Provider docs are the reference they\'ll use constantly during the assignment.',
        content: {
          title: 'Additional Reading',
          subtitle: 'Infrastructure as Code',
          readingLinks: [
            { icon: '🚀', label: 'Terraform AWS Get Started Tutorial — Official HashiCorp Guide', url: 'https://developer.hashicorp.com/terraform/tutorials/aws-get-started' },
            { icon: '☁️', label: 'What is Infrastructure as Code? — AWS', url: 'https://aws.amazon.com/what-is/iac/' },
            { icon: '📖', label: 'Terraform Language Documentation — HCL Syntax Reference', url: 'https://developer.hashicorp.com/terraform/language' },
            { icon: '📋', label: 'Terraform AWS Provider Documentation — Resource Reference', url: 'https://registry.terraform.io/providers/hashicorp/aws/latest/docs' },
            { icon: '✅', label: 'Terraform Best Practices — Spacelift', url: 'https://spacelift.io/blog/terraform-best-practices' },
            { icon: '🎥', label: 'Terraform Course for Beginners — freeCodeCamp (2.5 hrs)', url: 'https://www.youtube.com/watch?v=SLB_c_ayRMo' },
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
  },

  // ─── WEEK 5 ─────────────────────────────────────────────────────────────────
  5: {
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
  },

  // ─── WEEKS 6–8 (user will add content later) ─────────────────────────────
  6: {
    title: 'Introduction to Cloud Migration Project',
    slides: [],
  },
  7: {
    title: 'Design Review',
    slides: [],
  },
  8: {
    title: 'Final Presentation',
    slides: [],
  },
}

export default slides
