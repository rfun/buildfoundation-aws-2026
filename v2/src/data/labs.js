const labs = {
  'opex-1': {
    pillar: 'Operational Excellence',
    pillarId: 'opex',
    pillarColor: '#4db6ac',
    num: 1,
    title: 'Exploring CloudTrail Event History',
    time: '~15 minutes',
    weekTieIn: 'Week 2',
    overview: `AWS CloudTrail records every API call made in your AWS account, providing a complete audit trail of activity. In this lab, you'll explore CloudTrail's Event History to understand who did what, when, and where in your account. This connects directly to the Organize & Operate phases of Operational Excellence — specifically the principle "Utilize workload observability."`,
    careerConnection: 'Reading CloudTrail logs to trace who-did-what is core day-to-day work for a Cloud Security Analyst or DevOps/SRE on-call rotation — this is what an incident investigation actually looks like.',
    objectives: [
      'Navigate to CloudTrail and understand its purpose as an audit and governance tool.',
      'Read and interpret CloudTrail event records (who, what, when, where).',
      'Apply filters to find specific events by source, user, and time range.',
      'Understand how CloudTrail supports the Operational Excellence pillar through observability.',
    ],
    prerequisites: [
      'An AWS account (free tier is sufficient).',
      'Signed in to the AWS Management Console.',
      'Some prior activity in your account (even just logging in creates events).',
    ],
    steps: [
      {
        title: 'Navigate to CloudTrail.',
        body: 'In the AWS Console, use the search bar at the top and type CloudTrail. Click on the CloudTrail service to open it.',
      },
      {
        title: 'Open Event History.',
        body: 'In the left sidebar, click Event history. This shows the last 90 days of management events in your account — completely free, no setup needed.',
      },
      {
        title: 'Examine a recent event.',
        body: 'Find a ConsoleLogin event (or any recent event) in the list. Click on it to expand the event details. Read through the JSON record and identify: who (userIdentity), what (eventName), when (eventTime), where (awsRegion).',
      },
      {
        title: 'Filter by Event source.',
        body: 'Use the filter dropdown to filter by "Event source" and enter signin.amazonaws.com. Observe how the list narrows to authentication events only.',
      },
      {
        title: 'Filter by User name.',
        body: 'Change the filter to "User name" and enter your IAM username or "root". See all actions taken by that identity.',
      },
      {
        title: 'Filter by time range.',
        body: 'Use the time picker to set a custom range — e.g., the last 24 hours. Observe how events are scoped to that window.',
      },
    ],
    note: 'CloudTrail Event History is read-only exploration. No resources are created or modified in this lab.',
    screenshot: {
      label: 'What to capture',
      body: 'The Event History page with a filter applied showing at least 3 events, with one event\'s detail panel expanded showing the userIdentity and eventName fields.',
    },
    cleanup: null,
    takeaways: [
      'CloudTrail is always-on for management events — you don\'t need to enable it for Event History.',
      'Every action in AWS (console, CLI, SDK) creates a CloudTrail event.',
      'Filtering by user, source, and time range is how you investigate incidents.',
      'This is the foundation of the "Utilize workload observability" principle in Operational Excellence.',
    ],
  },

  'security-1': {
    pillar: 'Security',
    pillarId: 'security',
    pillarColor: '#e53935',
    num: 3,
    title: 'IAM Users, Groups & Least Privilege',
    time: '~20 minutes',
    weekTieIn: 'Week 2',
    overview: `Identity and Access Management (IAM) is the foundation of AWS security. In this lab you'll create an IAM user, assign it to a group with a managed policy, and use the IAM Policy Simulator to validate what actions are allowed or denied — directly applying the principle of least privilege.`,
    careerConnection: 'Designing least-privilege IAM policies is one of the most common interview and on-the-job tasks for Cloud Security Engineers — it\'s the kind of work that directly prevents the breaches you\'ll see in Week 5.',
    objectives: [
      'Create an IAM user group with a managed read-only policy.',
      'Create an IAM user and add it to the group.',
      'Use the IAM Policy Simulator to test allowed and denied actions.',
      'Understand how least privilege is enforced through IAM policies.',
    ],
    prerequisites: [
      'An AWS account (free tier is sufficient).',
      'Signed in as root or an admin IAM user.',
    ],
    steps: [
      {
        title: 'Create a user group.',
        body: 'Navigate to IAM → User Groups → Create group. Name it ReadOnlyTeam. Attach the AWS managed policy ReadOnlyAccess to the group. Create the group.',
      },
      {
        title: 'Create an IAM user.',
        body: 'Navigate to IAM → Users → Create user. Name it lab-student. Do NOT enable console access — we\'re just creating the identity. Add the user to the ReadOnlyTeam group.',
      },
      {
        title: 'Open the Policy Simulator.',
        body: 'Navigate to IAM → Policy Simulator (or search "IAM Policy Simulator" in the console). Select the lab-student user as the entity to test.',
      },
      {
        title: 'Test an allowed action.',
        body: 'Select service: S3. Select action: GetObject. Click Run Simulation. Observe the result: Allowed.',
      },
      {
        title: 'Test a denied action.',
        body: 'Now test S3 → DeleteBucket. Run Simulation. Observe the result: Denied. ReadOnlyAccess does not permit write or delete actions.',
      },
      {
        title: 'Test more actions.',
        body: 'Try EC2 → DescribeInstances (allowed) and EC2 → TerminateInstances (denied). Notice the pattern: read actions pass, write/delete actions are blocked.',
      },
    ],
    warning: 'Do not use root account credentials for day-to-day work. Always create IAM users with the minimum permissions needed.',
    screenshot: {
      label: 'What to capture',
      body: 'The IAM Policy Simulator results page showing at least one "Allowed" and one "Denied" result for the lab-student user.',
    },
    cleanup: [
      'Navigate to IAM → Users → lab-student → Delete.',
      'Navigate to IAM → User Groups → ReadOnlyTeam → Delete.',
    ],
    takeaways: [
      'Groups make permissions manageable — assign policies to groups, not individual users.',
      'AWS managed policies like ReadOnlyAccess are a safe starting point for least privilege.',
      'The Policy Simulator lets you validate permissions before deploying — use it during code review.',
      'Least privilege means granting only the exact permissions needed, nothing more.',
    ],
  },
}

export default labs
