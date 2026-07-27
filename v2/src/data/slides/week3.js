// Week 3 slide data. See ./index.js for the shape of a slide
// and how images/notes are resolved.

export default {
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
}
