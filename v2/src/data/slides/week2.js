// Week 2 slide data. See ./index.js for the shape of a slide
// and how images/notes are resolved.

export default {
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
}
