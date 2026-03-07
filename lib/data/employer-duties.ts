import type { EmployerDuty } from '@/types'

/**
 * Standard employer duties/responsibilities for Canadian businesses.
 * These are the tasks an employer must complete for each employee.
 */
export const EMPLOYER_DUTIES: Omit<EmployerDuty, 'isComplete' | 'completedAt'>[] = [
  // Legal & Documentation
  {
    id: 'collect-sin',
    title: 'Collect Social Insurance Number (SIN)',
    description: 'Obtain and verify the employee\'s SIN for tax reporting purposes. Required within 3 days of hire.',
    category: 'legal',
    url: 'https://www.canada.ca/en/employment-social-development/services/sin.html',
  },
  {
    id: 'td1-federal',
    title: 'Complete TD1 Federal Form',
    description: 'Have employee complete the TD1 Personal Tax Credits Return to determine federal tax withholdings.',
    category: 'documentation',
    url: 'https://www.canada.ca/en/revenue-agency/services/forms-publications/td1-personal-tax-credits-returns.html',
  },
  {
    id: 'td1-provincial',
    title: 'Complete TD1 Provincial Form',
    description: 'Have employee complete the provincial TD1 form for provincial tax credit claims.',
    category: 'documentation',
    url: 'https://www.canada.ca/en/revenue-agency/services/forms-publications/td1-personal-tax-credits-returns.html',
  },
  {
    id: 'employment-contract',
    title: 'Sign Employment Contract',
    description: 'Execute a written employment agreement outlining terms, compensation, benefits, and termination clauses.',
    category: 'legal',
  },
  {
    id: 'direct-deposit',
    title: 'Set Up Direct Deposit',
    description: 'Collect banking information (institution, transit, account number) for payroll deposits.',
    category: 'payroll',
  },
  
  // Payroll
  {
    id: 'register-payroll',
    title: 'Register for CRA Payroll Account',
    description: 'If not already registered, set up a payroll account with CRA to remit source deductions (CPP, EI, income tax).',
    category: 'payroll',
    url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll.html',
  },
  {
    id: 'cpp-contributions',
    title: 'Calculate CPP Contributions',
    description: 'Deduct Canada Pension Plan contributions from employee pay and remit employer portion.',
    category: 'payroll',
  },
  {
    id: 'ei-premiums',
    title: 'Calculate EI Premiums',
    description: 'Deduct Employment Insurance premiums from employee pay and remit employer portion (1.4x employee rate).',
    category: 'payroll',
  },
  {
    id: 'income-tax-deductions',
    title: 'Set Up Income Tax Deductions',
    description: 'Configure payroll system to withhold federal and provincial income taxes based on TD1 forms.',
    category: 'payroll',
  },

  // Benefits
  {
    id: 'benefits-enrollment',
    title: 'Enroll in Benefits Plan',
    description: 'If offering group benefits, enroll employee in health, dental, and other benefit programs.',
    category: 'benefits',
  },
  {
    id: 'rrsp-matching',
    title: 'Set Up RRSP Matching (if applicable)',
    description: 'Configure employer RRSP matching contributions if offered as part of compensation package.',
    category: 'benefits',
  },
  {
    id: 'vacation-policy',
    title: 'Communicate Vacation Policy',
    description: 'Inform employee of vacation entitlement (minimum 2 weeks/year in most provinces) and accrual policy.',
    category: 'benefits',
  },

  // Safety
  {
    id: 'safety-training',
    title: 'Complete Health & Safety Training',
    description: 'Ensure employee completes mandatory workplace health and safety awareness training within first week.',
    category: 'safety',
    url: 'https://www.ontario.ca/page/workplace-health-and-safety',
  },
  {
    id: 'wsib-coverage',
    title: 'Verify WSIB/WCB Coverage',
    description: 'Ensure workplace insurance covers the new employee. Update headcount with provincial workers\' compensation board.',
    category: 'safety',
  },
  {
    id: 'emergency-procedures',
    title: 'Review Emergency Procedures',
    description: 'Train employee on emergency exits, first aid locations, and workplace emergency protocols.',
    category: 'safety',
  },

  // Documentation
  {
    id: 'employee-handbook',
    title: 'Provide Employee Handbook',
    description: 'Give employee access to company policies, code of conduct, and workplace expectations.',
    category: 'documentation',
  },
  {
    id: 'confidentiality-agreement',
    title: 'Sign Confidentiality/NDA',
    description: 'Have employee sign non-disclosure agreement to protect proprietary business information.',
    category: 'legal',
  },
  {
    id: 'work-eligibility',
    title: 'Verify Work Eligibility',
    description: 'Confirm employee is legally authorized to work in Canada (citizen, PR, valid work permit).',
    category: 'legal',
  },
]

/**
 * Tax document types with descriptions
 */
export const TAX_DOCUMENT_TYPES = [
  {
    type: 'T4',
    name: 'T4 - Statement of Remuneration Paid',
    description: 'Annual slip showing employment income and deductions. Issue by end of February.',
    url: 'https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t4.html',
  },
  {
    type: 'T4A',
    name: 'T4A - Statement of Pension, Retirement, Annuity',
    description: 'For payments like commissions to self-employed individuals, fees, or other income.',
    url: 'https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t4a.html',
  },
  {
    type: 'T2200',
    name: 'T2200 - Declaration of Conditions of Employment',
    description: 'Required for employees claiming work-from-home or employment expenses on their tax return.',
    url: 'https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t2200.html',
  },
  {
    type: 'TD1',
    name: 'TD1 - Personal Tax Credits Return',
    description: 'Employee completes to determine tax withholding based on their personal credits.',
    url: 'https://www.canada.ca/en/revenue-agency/services/forms-publications/td1-personal-tax-credits-returns.html',
  },
  {
    type: 'ROE',
    name: 'ROE - Record of Employment',
    description: 'Issue when employee stops working (layoff, termination, leave). Required for EI claims.',
    url: 'https://www.canada.ca/en/employment-social-development/programs/ei/ei-list/ei-roe.html',
  },
] as const
