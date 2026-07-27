// Week 1 slide data. See ./index.js for the shape of a slide
// and how images/notes are resolved.

export default {
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
}
