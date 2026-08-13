// Week 6 slide data. See ./index.js for the shape of a slide
// and how images/notes are resolved.
//
// The GoGreen project deck itself lives in slides/FinalProject.pptx and is
// presented as-is — the project slides here are an outline of it, not a
// replacement for it.

export default {
  title: 'Introduction to Cloud Migration Project',
  slides: [
    {
      type: 'slide-section-light',
      note: 'Title slide. Open with the shape of the next three weeks: tonight you get the project and the tools, next week you present an architecture diagram, the week after you present the built thing. Tonight is the lightest lecture of the course — most of the value is in the tools demo and the project brief.',
      content: {
        brandHeader: 'The Build Fellowship',
        title: 'Introduction to Cloud Migration Project',
        week: 'Week 6',
        date: 'August 2026',
      },
    },
    {
      type: 'slide-agenda',
      note: 'Three tools first, then the project. The order matters — by the time they see the GoGreen requirements they should already know how they are going to draw the diagram, pick the CIDR ranges, and choose instance types. Otherwise the project brief lands as a wall of requirements with no method attached.',
      content: {
        title: 'Agenda',
        items: [
          'Architecture diagramming — Cloudcraft and the alternatives',
          'Subnetting and CIDR planning',
          'Right-sizing EC2 and RDS',
          'The final project: GoGreen Insurance',
          'Timeline and review sessions',
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'Everything tonight is in service of one deliverable: an architecture diagram you can defend out loud. Stress "defend" — next week is not a poster session, it is a design review where I ask why you picked each thing.',
      content: {
        title: 'Learning Outcomes',
        subtitle: 'By the end of today, you\'ll be able to...',
        items: [
          'Produce an AWS architecture diagram using Cloudcraft or a tool of your choice',
          'Plan a VPC CIDR range and split it into subnets across Availability Zones',
          'Pick EC2 and RDS instance types from stated CPU, memory, and IOPS requirements',
          'Explain the GoGreen migration requirements and what your deliverable is',
        ],
      },
    },

    // ── Architecture diagramming ─────────────────────────────────────────────
    {
      type: 'slide-section-dark',
      note: 'Section divider. Lead with: the diagram is not decoration, it is the artifact you hand a customer to get approval before anyone writes code. That is literally the framing of the GoGreen project — you present to the customer for sign-off.',
      content: { title: 'Architecture Diagramming' },
    },
    {
      type: 'slide-content',
      note: 'Ask them: who has drawn an architecture diagram before? Most will say no. The point of this slide is that the diagram does real work — it is how you find the holes in your own design before you spend money. Every time I have drawn one properly I have found something missing, usually the NAT gateway or the second load balancer.',
      content: {
        title: 'Why Diagram Before You Build',
        items: [
          'It is the deliverable customers approve — you present the design before you build it',
          'Drawing forces the decisions you would otherwise defer: which AZ, which subnet, which security group',
          'Gaps become obvious visually — a missing NAT gateway or a single-AZ database jumps out',
          'It is the shared language between you, the reviewer, and whoever maintains this later',
          'Your Terraform should fall out of the diagram, not the other way around',
        ],
        callout: 'If you cannot draw it, you do not understand it well enough to build it.',
      },
    },
    {
      type: 'slide-cards',
      note: 'Walk the landscape quickly — 30 seconds each. The message is that Cloudcraft is my recommendation, not a requirement. Some of them will already have Lucidchart through school or work, and that is completely fine. What matters is that the diagram shows VPC, AZ, subnet, and security group boundaries.',
      content: {
        cardsTitle: 'The Tool Landscape',
        cards: [
          { icon: '☁️', title: 'Cloudcraft', text: 'AWS-native, isometric, live cost estimates as you build. Free tier covers this project. My recommendation — what the demo uses.' },
          { icon: '📐', title: 'AWS Architecture Icons', text: 'AWS\'s official icon set for PowerPoint, Keynote, Figma, and draw.io. Free. Total control, zero automation.' },
          { icon: '✏️', title: 'diagrams.net / draw.io', text: 'Free, browser or desktop, ships the AWS icon library built in. The most common non-AWS answer.' },
          { icon: '📊', title: 'Lucidchart', text: 'Polished, strong collaboration, AWS shape libraries. Free tier is limited; many schools and employers have licences.' },
          { icon: '🧩', title: 'Excalidraw', text: 'Hand-drawn feel, instant, great for whiteboarding a design before you formalise it. No cost modelling.' },
          { icon: '💻', title: 'Diagram as code', text: 'Python `diagrams`, Mermaid. The diagram lives in your repo and reviews like code. Steeper start, but it never goes stale.' },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'The honest trade-off table. If someone asks "which should I use", the answer is: Cloudcraft if you want cost feedback while you design, draw.io if you want free and flexible, diagram-as-code if you already think like an engineer about version control. Any of them pass the assignment.',
      content: {
        title: 'Choosing a Tool',
        subtitle: 'Any of these are acceptable for your submission',
        matrix: {
          head: ['Tool', 'Cost estimates', 'AWS-aware', 'Best for'],
          rows: [
            ['Cloudcraft', 'Yes, live', 'Yes — models VPC/subnet/SG', 'Designing while watching the bill'],
            ['draw.io', 'No', 'Icons only', 'Free, flexible, no account needed'],
            ['Lucidchart', 'No', 'Icons only', 'Team collaboration, polish'],
            ['AWS Icons + PowerPoint', 'No', 'Icons only', 'Full control, slides you already own'],
            ['Excalidraw', 'No', 'No', 'Fast first draft, whiteboarding'],
            ['Python `diagrams`', 'No', 'Icons only', 'Keeping the diagram in version control'],
          ],
        },
        readingLinks: [
          { icon: '☁️', label: 'Cloudcraft — cloudcraft.co', url: 'https://www.cloudcraft.co/' },
          { icon: '📐', label: 'AWS Architecture Icons (official, free)', url: 'https://aws.amazon.com/architecture/icons/' },
          { icon: '✏️', label: 'diagrams.net', url: 'https://www.diagrams.net/' },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'Set up the demo before you switch windows. The thing that makes Cloudcraft different from a drawing tool is that it knows what an AWS resource is — drop an EC2 instance in and it wants to know the VPC, the subnet, and the security group, which is exactly the set of decisions the project is asking you to make.',
      content: {
        title: 'Cloudcraft: What It Gives You',
        items: [
          'Real AWS objects, not shapes — instance types, subnets, security groups, ASGs',
          'Visual boundaries for region, VPC, Availability Zone, and public vs. private subnet',
          'Security group rules defined on the diagram, the same rules you will write in Terraform',
          'A budget tab that prices the whole design per month and shows what dominates the bill',
          'Optional live AWS account connection to reverse-engineer what already exists (not required here)',
          'Also supports Azure, if you end up designing there later',
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'This is the live demo script — build it in front of them rather than reading the slide. Start with one EC2, pick the California region, create a default VPC, add a web security group, drop it in a public subnet, mark the subnet public. Then change the instance type and let them watch the cost move. Then add an ASG, add RDS, and deliberately draw the wrong thing first: connect the public instance straight to the database, then say "this would never happen" and fix it by moving RDS into a database security group in a private subnet. Finish on port 3306 and the auto-created connection.',
      content: {
        title: 'Cloudcraft — Live Walkthrough',
        sections: [
          {
            heading: 'Build it up',
            items: [
              'Drop one EC2 instance and choose a region',
              'Create the VPC, then a web security group, then a public subnet — mark it public',
              'Change the instance type and watch the cost estimate move',
              'Wrap the instance in an Auto Scaling Group; duplicate to show minimum capacity',
            ],
          },
          {
            heading: 'Then fix the mistake on purpose',
            items: [
              'Add RDS and connect it directly to the public instance — this is wrong',
              'Move RDS into its own database security group, in a private subnet',
              'Open port 3306 from the app tier only; Cloudcraft draws the connection for you',
              'Open the Budget tab: what costs the most? Usually NAT gateway and storage surprise people',
            ],
          },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'AWS\'s own tooling, for completeness. Infrastructure Composer is genuinely useful if you are in the console already; Workload Discovery is the one that draws your real account. Be honest that the CloudFormation-style diagrams in the project deck are not my favourite — I said so last year and it is still true — but they are perfectly acceptable.',
      content: {
        title: 'AWS\'s Own Diagramming Options',
        sections: [
          { heading: 'AWS Architecture Icons', text: 'The official icon set, free, for PowerPoint, Keynote, Figma, draw.io, and Visio. This is what the templates at the back of the project deck use. Most "AWS-looking" diagrams are just these icons placed by hand.' },
          { heading: 'AWS Infrastructure Composer', text: 'In-console visual designer that produces real CloudFormation/SAM templates. The diagram and the template stay in sync, which is its whole point — but it is serverless-oriented and will not model a classic three-tier VPC comfortably.' },
          { heading: 'Workload Discovery on AWS', text: 'A deployable solution that scans a live account and draws what is actually running. Useful for documenting an inherited environment; overkill for a greenfield design like this one.' },
        ],
        callout: 'You are designing something that does not exist yet — so a design tool beats a discovery tool here.',
      },
    },
    {
      type: 'slide-callout',
      note: 'This is the acceptance criteria for next week. Read it out slowly. If their diagram is missing any of these five things, the design review will stall on it. Tell them explicitly that this is what I will be looking at.',
      content: {
        calloutTitle: 'What Your Diagram Must Show',
        calloutText: 'Region and VPC boundary · at least two Availability Zones · public vs. private subnets · security groups and which one can talk to which · every tier from the internet down to the database. Whatever tool you use, if these five are legible, the diagram has done its job.',
      },
    },

    // ── Subnetting ───────────────────────────────────────────────────────────
    {
      type: 'slide-section-dark',
      note: 'Section divider. Framing: last year I told the cohort subnet addressing was "not super critical". That was true when the diagram was the only deliverable — but you are writing Terraform, and Terraform makes you type a real CIDR block. So this year we are doing it properly.',
      content: { title: 'Subnetting & CIDR Planning' },
    },
    {
      type: 'slide-content',
      note: 'Quick refresher — most of them have seen CIDR in week 3 but few can do the arithmetic under pressure. The one number to memorise is /24 = 256 addresses. Everything else is doubling or halving from there. Do not spend more than five minutes here; the calculator does the work.',
      content: {
        title: 'CIDR, Quickly',
        description: 'The number after the slash is how many bits are fixed. The rest are yours to hand out.',
        matrix: {
          head: ['Block', 'Addresses', 'Usable in AWS', 'Typical use'],
          rows: [
            ['/16', '65,536', '65,531', 'A whole VPC'],
            ['/20', '4,096', '4,091', 'A large subnet'],
            ['/24', '256', '251', 'A normal subnet — the workhorse'],
            ['/28', '16', '11', 'Smallest AWS allows'],
          ],
        },
        callout: 'AWS reserves 5 addresses in every subnet — the first four and the last one. A /28 gives you 11 usable, not 16.',
      },
    },
    {
      type: 'slide-content',
      note: 'Show the calculator live. Type 10.0.0.0/16 into it and let them see the range, then change it to /24 and watch the count collapse. The reason I like this particular tool is that it shows you the network address, broadcast address, and host range all at once, which is exactly what you need when you are writing a Terraform aws_subnet block and guessing at the range.',
      content: {
        title: 'Subnet Calculator',
        subtitle: 'mxtoolbox.com/subnetcalculator.aspx',
        items: [
          'Enter a network address and prefix — it returns the usable host range instantly',
          'Use it to check your subnets do not overlap before you write them into Terraform',
          'Sanity-check subnet size against how many instances the ASG might scale to',
          'Remember to subtract AWS\'s 5 reserved addresses from whatever it tells you',
        ],
        readingLinks: [
          { icon: '🧮', label: 'MxToolbox Subnet Calculator', url: 'https://mxtoolbox.com/subnetcalculator.aspx' },
          { icon: '📗', label: 'AWS — VPC CIDR blocks and subnet sizing', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html' },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'The AWS-specific rules that trip people up. The /16-to-/28 constraint and the "one subnet lives in exactly one AZ" rule are the two that cause real confusion. That second one is why multi-AZ means multiple subnets — you cannot stretch a subnet across AZs, so high availability forces subnet count up.',
      content: {
        title: 'The AWS-Specific Rules',
        definitionGrid: [
          { term: 'VPC CIDR: /16 to /28', definition: 'AWS will not accept anything outside that range. /16 is the conventional VPC size — plenty of room, no reason to be stingy with private address space.' },
          { term: 'One subnet = one AZ', definition: 'A subnet never spans Availability Zones. This is why multi-AZ designs need at least two of every subnet type.' },
          { term: '5 reserved addresses', definition: 'Network address, VPC router, DNS, future use, and broadcast. Every subnet, no exceptions.' },
          { term: 'Public vs. private is routing', definition: 'A subnet is "public" because its route table points at an Internet Gateway — not because of a checkbox. Private subnets reach the internet via NAT.' },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'A worked example on a deliberately unrelated workload — an internal reporting tool, not the project. The mechanics to teach: pick a /16 for the VPC, carve /24s out of it, one subnet per AZ, and leave gaps in the numbering so you can add a tier later without renumbering. Say explicitly that this is not the answer to the project — how many tiers they need and how many AZs is theirs to derive from the requirements.',
      content: {
        title: 'Worked Example — Splitting a VPC',
        subtitle: 'An internal reporting tool — not the project',
        matrix: {
          head: ['Subnet', 'CIDR', 'AZ', 'Purpose'],
          rows: [
            ['Edge A', '10.40.0.0/24', 'eu-west-1a', 'Load balancer, NAT gateway'],
            ['Edge B', '10.40.1.0/24', 'eu-west-1b', 'Load balancer, NAT gateway'],
            ['Compute A', '10.40.10.0/24', 'eu-west-1a', 'Application instances'],
            ['Compute B', '10.40.11.0/24', 'eu-west-1b', 'Application instances'],
          ],
        },
        highlight: 'VPC 10.40.0.0/16 — 251 usable addresses per /24 subnet',
        callout: 'Copy the method, not the numbers. How many tiers and how many AZs your design needs is something you derive from the requirements.',
      },
    },

    // ── Right-sizing ─────────────────────────────────────────────────────────
    {
      type: 'slide-section-dark',
      note: 'Section divider. This is the part of the project people hand-wave and then get asked about in the review. The GoGreen deck gives you exact CPU, memory, and IOPS numbers for a reason — they want to see you translate them into instance types with justification.',
      content: { title: 'Right-Sizing EC2 & RDS' },
    },
    {
      type: 'slide-content',
      note: 'A worked example on an unrelated workload — say that out loud so nobody mistakes it for the project answer. The point to land: a spec sheet is not a shopping list. This example is running hot on the web tier, so the right answer there is bigger than what it runs today, while the app tier at 45% is a candidate to shrink. That reasoning transfers to the project; these numbers do not.',
      content: {
        title: 'Reading a Current Environment',
        subtitle: 'Example workload — not the project',
        matrix: {
          head: ['Tier', 'Count', 'Per machine', 'Current utilisation'],
          rows: [
            ['Web', '4 VMs', '2 vCPU / 8 GB', '80% memory — target is 50–60%'],
            ['App', '3 VMs', '8 vCPU / 32 GB', '45% CPU, steady'],
            ['Database', '1 VM', '16 vCPU / 64 GB / 2 TB', '30,000 IOPS, sustained'],
          ],
        },
        callout: 'A spec sheet is not a shopping list. If a tier is running hot, the honest answer is bigger than what it runs today — and if it is idling, smaller.',
      },
    },
    {
      type: 'slide-content',
      note: 'Demo this live. Filter by memory and vCPU minimums, sort by cost, and walk down the list. The lesson is the one I gave last year: satisfy the requirement, then take the cheapest thing that does. Also point out the columns people forget — network performance and whether it is EBS-optimised.',
      content: {
        title: 'Finding the Instance — instances.vantage.sh',
        items: [
          'Filter on the minimums you actually need: vCPU, memory, network',
          'Sort by on-demand price and take the cheapest option that still clears the bar',
          'Compare families — a newer generation (m6i vs. m5) is often cheaper and faster',
          'Check the columns people skip: network performance, EBS-optimised, burstable vs. dedicated',
          'Note the Reserved and Spot columns — worth mentioning in your cost justification',
        ],
        readingLinks: [
          { icon: '💰', label: 'EC2 instance comparison — instances.vantage.sh', url: 'https://instances.vantage.sh/' },
          { icon: '🗄️', label: 'RDS instance comparison — instances.vantage.sh/rds', url: 'https://instances.vantage.sh/rds/' },
          { icon: '🧾', label: 'AWS Pricing Calculator', url: 'https://calculator.aws/' },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'Decision rules rather than a worked answer — deliberately. Walk each question and let them apply it to their own tiers out loud. The burstable question is the one that catches people: T-family looks cheap until you put a tier on it that runs at 90% forever and burns through its credits. The ASG question is the other one — people oversize a single instance when the group was going to scale anyway.',
      content: {
        title: 'Picking a Family',
        subtitle: 'The questions that narrow the list',
        matrix: {
          head: ['Ask', 'If yes', 'If no'],
          rows: [
            ['Is load spiky and mostly idle?', 'Burstable (T family) — cheap, credits absorb the spikes', 'Fixed performance (M, C, R) — credits will run out'],
            ['Is it memory-bound before CPU-bound?', 'Memory-optimised (R family)', 'General purpose (M) or compute-optimised (C)'],
            ['Is the tier behind an Auto Scaling Group?', 'Size for one instance, let the group add more', 'Size for peak on a single box'],
            ['Does it need high availability?', 'Multi-AZ, and the standby costs too', 'Single instance, but say why that is acceptable'],
          ],
        },
        callout: 'The instance type is not the answer — the justification is. Expect to be asked "why not one size smaller?"',
      },
    },
    {
      type: 'slide-content',
      note: 'Teach the shape of the decision, not the answer. The key structural fact is that gp2 ties IOPS to volume size, so past a certain point you simply cannot buy more throughput without buying storage you do not need — that is what pushes you to gp3 or provisioned IOPS. When a project states an IOPS number, it is stating it to force this comparison. Make them do it. Caveat worth saying out loud: exact ceilings shift by engine and volume size, so tell them to check current AWS docs before committing a number.',
      content: {
        title: 'Choosing a Storage Type',
        matrix: {
          head: ['Type', 'How you get IOPS', 'Cost shape', 'Use when'],
          rows: [
            ['gp2', 'Scales with volume size — 3 IOPS per GiB', 'Pay for capacity only', 'Modest, predictable needs where size and throughput happen to line up'],
            ['gp3', 'Baseline included, provision more independently', 'Pay for capacity + IOPS separately', 'You need more throughput than your storage size would give you — usually the cheaper route'],
            ['io1 / io2', 'Provision exactly what you ask for', 'Pay per provisioned IOPS', 'High sustained throughput where latency consistency matters enough to pay for it'],
          ],
        },
        callout: 'Cost climbs steeply with provisioned IOPS. When a requirement names a number, meet it and justify it — do not round up "to be safe".',
      },
    },
    {
      type: 'slide-content',
      note: 'A method slide, not an answer key. Teach them to read requirements for the vocabulary that points at a category of service — then it is on them to go find the specific one. Run it as call-and-response on generic phrasings; resist the urge to work their actual requirements for them, because that is the exercise.',
      content: {
        title: 'Reading a Requirement',
        description: 'Requirements are written in business language. Most of them contain a word that points straight at a category of AWS service — learn to spot it.',
        matrix: {
          head: ['When a requirement says…', 'It is pointing at…'],
          rows: [
            ['A number of hours or minutes of tolerable data loss', 'Backup frequency and retention — your interval has to beat the stated objective'],
            ['"Rarely accessed after…" or a retention period', 'Object storage with a lifecycle policy: a transition rule and an expiry rule'],
            ['Growth over a period, or unpredictable peaks', 'Elasticity — scaling groups and managed services, not a bigger box'],
            ['"Encrypted", "secured", "compliant"', 'Key management, plus transport security terminated somewhere specific'],
            ['"Without exposing…" or "internal only"', 'Network topology — private subnets and a controlled egress path'],
            ['"Highly available" or "no single point of failure"', 'Redundancy across Availability Zones, and the standby capacity it implies'],
          ],
        },
        callout: 'Every requirement should be traceable to something in your diagram. If you cannot point at it, you have not met it.',
      },
    },
    {
      type: 'slide-callout',
      note: 'Say this out loud and do not soften it. Two separate things: document real production sizes in the worksheets, but only ever apply free-tier sizes. And nobody runs terraform apply until I have looked at the code. Plans are free, applies are not.',
      content: {
        calloutTitle: 'Design Big, Apply Small',
        calloutText: 'Document the instance types the requirements actually justify. But when you build it, use only free-tier sizes — t2.micro and db.t2.micro. Run terraform plan as often as you like; do not run apply until I have reviewed your code.',
      },
    },

    // ── The project ──────────────────────────────────────────────────────────
    {
      type: 'slide-section-dark',
      note: 'Section divider — switch to the FinalProject.pptx here and present it directly. The slides that follow are an outline of that deck, not a replacement. Ask up front whether anyone has done the AWS Academy GoGreen project before; if so, offer them an alternative project.',
      content: { title: 'The Final Project\nGoGreen Insurance' },
    },
    {
      type: 'slide-content',
      note: 'Set the frame: you are the contractor. They have hired you to move them to AWS and they have handed you their current environment. The company details are fictitious and mostly do not matter — what matters is that every requirement in the deck has to show up somewhere in your design.',
      content: {
        title: 'The Scenario',
        description: 'GoGreen Insurance has hired you to architect their move from on-premises to AWS.',
        items: [
          'Regional insurance company — headquarters in Southern California, offices in Europe and South America',
          'A three-tier CRM web application: web front end, Java application tier, MySQL database',
          'Stores customer data and documents, and converts documents into multiple formats',
          'Goal: go fully paperless for all user data, documents, and pictures',
          'For our purposes, treat it as a simple HTTP three-tier app — the business detail is not the point',
        ],
        callout: 'HQ location is not trivia — it is how you justify your region choice.',
      },
    },
    {
      type: 'slide-content',
      note: 'Why they are moving. These are the textbook on-prem pain points and they map one-to-one onto cloud benefits — which is exactly the argument you will make in your presentation. The $100,000 and 20-day numbers are the ones to quote back at them when justifying elasticity.',
      content: {
        title: 'Why They Are Moving',
        items: [
          'Performance and reliability problems on-premises, hurting the user experience',
          'Continuously over-provisioned to try to absorb growth — and still running hot',
          'Upgraded three times in the last year just to keep up',
          'Procurement takes 20 days; deployment takes another week',
          'Each expansion costs upwards of $100,000',
        ],
        callout: 'Every one of these has a cloud answer. Your presentation should make that mapping explicit.',
      },
    },
    {
      type: 'slide-content',
      note: 'The requirements list, condensed from the deck. Tell them the full detailed requirements — the IAM groups, the password policy, the per-tier utilisation targets, the CloudWatch alarm on 400 errors — are in the pptx and they need to work through all of them, not just these headlines.',
      content: {
        title: 'The Requirements',
        dense: true,
        items: [
          'Infrastructure managed by the new Cloud Team — three IAM groups, MFA for administrators, a specific password policy',
          'Encryption for data in transit and at rest',
          'Stateless web servers; instances tagged by tier',
          'A baseline identified for the number and type of instances',
          'Recovery Point Objective of four hours',
          'Scalability for 90% user growth over three years',
          'Document storage for five years, infrequent access after three months',
          'Managed services preferred, to raise availability and lower cost',
          'Database: 21,000 IOPS sustained, high availability, no schema changes',
        ],
        callout: 'The detailed per-tier requirements are in the project deck. Work through all of them — the worksheets are the checklist.',
      },
    },
    {
      type: 'slide-content',
      note: 'What they actually hand in. The worksheets in the deck are the structure — they are fill-in-the-blank tables and working through them is what stops you from discovering an unanswered question halfway through writing Terraform. Tell them to download the pptx and make their own copy.',
      content: {
        title: 'Your Deliverables',
        sections: [
          {
            heading: 'Fill in the worksheets',
            items: [
              'Identify the AWS services you will use and why each one addresses a requirement',
              'Users, groups, roles, and the permissions attached to each',
              'A per-tier solution table: web, application, database',
              'Any additional services, with justification',
            ],
          },
          {
            heading: 'Then produce',
            items: [
              'An architecture diagram of the full solution — the main deliverable for next week',
              'Terraform code implementing the design, using free-tier sizes only',
              'A short presentation of your design and the decisions behind it',
            ],
          },
        ],
        callout: 'Download the project deck and make your own copy to work in.',
        readingLinks: [
          { icon: '📦', label: 'Download the project deck (.pptx)', url: 'slides/FinalProject.pptx' },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'Team formation. Keep this genuinely open — individually is fine, pairs and threes are fine, but I need to know who is working with whom so I can schedule reviews properly. Say explicitly: message me if you team up.',
      content: {
        title: 'Working Alone or Together',
        items: [
          'You can do this individually — that is completely fine',
          'Or partner up in a group of two or three, maximum',
          'If you team up, message me so I know who is working on which project',
          'Either way, everyone should be able to explain every decision in the design',
        ],
      },
    },

    // ── Timeline ─────────────────────────────────────────────────────────────
    {
      type: 'slide-section-dark',
      note: 'Timeline section. This is the slide to slow down on — the single biggest risk for this cohort is underestimating how much work next week is. Say it plainly: this is the highest time-demand stretch of the whole workshop.',
      content: { title: 'Timeline' },
    },
    {
      type: 'slide-two-column',
      note: 'Walk the three weeks. The key message is that next week is a design review, not a status update — they present, we discuss the decisions as a group, and they iterate afterwards. The week after is the implemented thing. Emphasise that the diagram needs to exist by next session, not be started next session.',
      content: {
        columnTitle: 'The Next Three Weeks',
        items: [
          { label: 'This week', desc: 'Work through the requirements and the worksheets. Produce your architecture diagram. Start your Terraform once the design is settled.' },
          { label: 'Next week', desc: 'Architecture review. You present your diagram and design decisions; we discuss them as a group — why this choice, how could it be better, does it meet every requirement.' },
          { label: 'In two weeks', desc: 'Final review. Present your complete migration strategy and the infrastructure you actually built. This is the last session.' },
        ],
      },
    },
    {
      type: 'slide-content',
      note: 'The offer of individual time — make this concrete rather than a vague "reach out". I want to book actual slots with each person or team before the next session, because refining the design one-to-one is where most of the learning happens. Ask them to message you this week rather than waiting.',
      content: {
        title: 'Individual Review Sessions',
        description: 'I want to book time with each of you — individually or as a team — before the next session.',
        items: [
          'Bring whatever you have: a half-finished diagram is a perfectly good starting point',
          'Good things to bring: region and AZ choice, subnet plan, instance sizing, anything you are stuck on',
          'Also the right place to have your Terraform reviewed before you run apply',
          'Message me this week to grab a slot — do not wait until the day before',
        ],
        callout: 'Next week is the highest time-demand stretch of the workshop. Start early, and use the office hours.',
      },
    },
    {
      type: 'slide-content',
      note: 'Closing checklist — what "done" looks like before the next session. Read the four items, then take questions. Mention that the recording goes up straight after the session.',
      content: {
        title: 'Before Next Session',
        items: [
          'Download the project deck and make your own copy',
          'Work through the requirements and fill in the solution worksheets',
          'Produce an architecture diagram showing region, VPC, AZs, subnets, and security groups',
          'Tell me if you are teaming up, and book a review slot',
        ],
        readingLinks: [
          { icon: '☁️', label: 'Cloudcraft', url: 'https://www.cloudcraft.co/' },
          { icon: '🧮', label: 'MxToolbox Subnet Calculator', url: 'https://mxtoolbox.com/subnetcalculator.aspx' },
          { icon: '💰', label: 'EC2 / RDS instance comparison', url: 'https://instances.vantage.sh/' },
          { icon: '📐', label: 'AWS Architecture Icons', url: 'https://aws.amazon.com/architecture/icons/' },
        ],
      },
    },
    {
      type: 'slide-section-light',
      note: 'Closing slide. Take questions, then remind them the recording will be published straight after the session and that they can message any time during the week.',
      content: {
        brandHeader: 'The Build Fellowship',
        title: 'Questions?',
        date: 'Architecture reviews next week — message me to book a slot',
      },
    },
  ],
}
