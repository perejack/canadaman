// Job-specific data for different positions
export interface JobSpecificData {
  companies: Array<{
    name: string;
    logo: string;
    position: string;
    location: string;
    salary: string;
    type: string;
    benefits: string[];
  }>;
  messages: Array<{
    id: number;
    company: string;
    position: string;
    message: string;
    time: string;
    isNew: boolean;
    avatar: string;
  }>;
  notifications: Array<{
    id: number;
    title: string;
    message: string;
    type: string;
    time: string;
    isNew: boolean;
    priority: string;
  }>;
}

export const jobSpecificData: Record<string, JobSpecificData> = {
  chef: {
    companies: [
      {
        name: "Tim Hortons",
        logo: "/images/companies/tim-hortons.jpg",
        position: "Head Chef",
        location: "Toronto, ON",
        salary: "$65,000 - $75,000",
        type: "Full-time",
        benefits: ["Health Insurance", "Paid Vacation", "Training Programs"]
      },
      {
        name: "McDonald's Canada",
        logo: "/images/companies/mcdonalds.jpg",
        position: "Kitchen Manager",
        location: "Vancouver, BC",
        salary: "$55,000 - $65,000",
        type: "Full-time",
        benefits: ["Employee Discounts", "Flexible Hours", "Career Growth"]
      },
      {
        name: "Swiss Chalet",
        logo: "/images/companies/generic-canadian-3.jpg",
        position: "Line Cook",
        location: "Calgary, AB",
        salary: "$45,000 - $55,000",
        type: "Full-time",
        benefits: ["Tips", "Meal Allowance", "Uniform Provided"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Tim Hortons",
        position: "Head Chef",
        message: "We're impressed with your culinary experience! We'd like to schedule an interview for our Head Chef position.",
        time: "2 minutes ago",
        isNew: true,
        avatar: "🍩"
      },
      {
        id: 2,
        company: "McDonald's Canada",
        position: "Kitchen Manager",
        message: "Your application for Kitchen Manager has been reviewed. Can you start next month?",
        time: "1 hour ago",
        isNew: true,
        avatar: "🍟"
      },
      {
        id: 3,
        company: "Swiss Chalet",
        position: "Line Cook",
        message: "We have an opening for Line Cook. Your experience with Canadian cuisine is exactly what we need!",
        time: "3 hours ago",
        isNew: false,
        avatar: "🍗"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'New Interview Request! 🎉',
        message: 'Tim Hortons wants to interview you for Head Chef position',
        type: 'interview_request',
        time: '2 minutes ago',
        isNew: true,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Job Match Found! 🔥',
        message: 'McDonald\'s Canada has a Kitchen Manager role that matches your skills',
        type: 'job_match',
        time: '1 hour ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  driver: {
    companies: [
      {
        name: "Canada Post",
        logo: "/images/companies/generic-canadian-1.jpg",
        position: "Delivery Driver",
        location: "Ottawa, ON",
        salary: "$50,000 - $60,000",
        type: "Full-time",
        benefits: ["Government Benefits", "Pension Plan", "Job Security"]
      },
      {
        name: "UberEats Canada",
        logo: "/images/companies/uber.jpg",
        position: "Delivery Partner",
        location: "Montreal, QC",
        salary: "$40,000 - $55,000",
        type: "Flexible",
        benefits: ["Flexible Hours", "Weekly Pay", "Vehicle Support"]
      },
      {
        name: "FedEx Canada",
        logo: "/images/companies/generic-canadian-2.jpg",
        position: "Courier Driver",
        location: "Edmonton, AB",
        salary: "$45,000 - $58,000",
        type: "Full-time",
        benefits: ["Health Coverage", "Overtime Pay", "Training Provided"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Canada Post",
        position: "Delivery Driver",
        message: "Your driving record is excellent! We'd like to offer you a Delivery Driver position with full benefits.",
        time: "5 minutes ago",
        isNew: true,
        avatar: "📮"
      },
      {
        id: 2,
        company: "UberEats Canada",
        position: "Delivery Partner",
        message: "Start earning immediately! Your application for Delivery Partner has been approved.",
        time: "2 hours ago",
        isNew: true,
        avatar: "🚗"
      },
      {
        id: 3,
        company: "FedEx Canada",
        position: "Courier Driver",
        message: "We need experienced drivers like you. Competitive salary and benefits package available!",
        time: "4 hours ago",
        isNew: false,
        avatar: "📦"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Driving Job Available! 🚛',
        message: 'Canada Post has a Delivery Driver position with government benefits',
        type: 'job_offer',
        time: '5 minutes ago',
        isNew: true,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Quick Start Opportunity! ⚡',
        message: 'UberEats Canada - Start earning today as a Delivery Partner',
        type: 'quick_start',
        time: '2 hours ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  babysitter: {
    companies: [
      {
        name: "Bright Horizons",
        logo: "👶",
        position: "Childcare Provider",
        location: "Toronto, ON",
        salary: "$35,000 - $45,000",
        type: "Full-time",
        benefits: ["Childcare Discount", "Health Benefits", "Professional Development"]
      },
      {
        name: "Kids & Company",
        logo: "🧸",
        position: "Nanny",
        location: "Vancouver, BC",
        salary: "$40,000 - $50,000",
        type: "Live-in",
        benefits: ["Accommodation", "Meals Provided", "Paid Vacation"]
      },
      {
        name: "YMCA Canada",
        logo: "🏃",
        position: "Youth Program Assistant",
        location: "Calgary, AB",
        salary: "$32,000 - $42,000",
        type: "Part-time",
        benefits: ["Flexible Schedule", "Training Programs", "Community Impact"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Bright Horizons",
        position: "Childcare Provider",
        message: "Your experience with children is wonderful! We have a Childcare Provider role perfect for you.",
        time: "10 minutes ago",
        isNew: true,
        avatar: "👶"
      },
      {
        id: 2,
        company: "Kids & Company",
        position: "Nanny",
        message: "A lovely family is looking for a live-in nanny. Your profile matches their requirements perfectly!",
        time: "1 hour ago",
        isNew: true,
        avatar: "🧸"
      },
      {
        id: 3,
        company: "YMCA Canada",
        position: "Youth Program Assistant",
        message: "Join our team helping youth in the community. Part-time position with flexible hours available.",
        time: "3 hours ago",
        isNew: false,
        avatar: "🏃"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Childcare Opportunity! 👶',
        message: 'Bright Horizons needs a Childcare Provider with your experience',
        type: 'childcare_job',
        time: '10 minutes ago',
        isNew: true,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Live-in Nanny Position! 🏠',
        message: 'Kids & Company has a live-in nanny role with accommodation provided',
        type: 'live_in_job',
        time: '1 hour ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  cleaner: {
    companies: [
      {
        name: "Molly Maid",
        logo: "/images/companies/molly-maid.jpg",
        position: "House Cleaner",
        location: "Toronto, ON",
        salary: "$35,000 - $45,000",
        type: "Full-time",
        benefits: ["Flexible Hours", "Equipment Provided", "Client Tips"]
      },
      {
        name: "The Cleaning Authority",
        logo: "✨",
        position: "Residential Cleaner",
        location: "Vancouver, BC",
        salary: "$32,000 - $42,000",
        type: "Part-time",
        benefits: ["Training Provided", "Uniform Included", "Bonuses"]
      },
      {
        name: "Office Pride",
        logo: "🏢",
        position: "Commercial Cleaner",
        location: "Calgary, AB",
        salary: "$38,000 - $48,000",
        type: "Full-time",
        benefits: ["Night Shift Premium", "Health Benefits", "Stable Hours"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Molly Maid",
        position: "House Cleaner",
        message: "We need reliable cleaners like you! Flexible schedule and great pay. Join our team today!",
        time: "15 minutes ago",
        isNew: true,
        avatar: "🧹"
      },
      {
        id: 2,
        company: "The Cleaning Authority",
        position: "Residential Cleaner",
        message: "Part-time position available with training provided. Perfect for work-life balance!",
        time: "2 hours ago",
        isNew: true,
        avatar: "✨"
      },
      {
        id: 3,
        company: "Office Pride",
        position: "Commercial Cleaner",
        message: "Night shift commercial cleaning with premium pay. Stable hours and benefits included.",
        time: "4 hours ago",
        isNew: false,
        avatar: "🏢"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Cleaning Job Available! 🧹',
        message: 'Molly Maid offers flexible hours and equipment provided',
        type: 'cleaning_job',
        time: '15 minutes ago',
        isNew: true,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Part-time Opportunity! ⏰',
        message: 'The Cleaning Authority has part-time residential cleaning roles',
        type: 'part_time_job',
        time: '2 hours ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  bartender: {
    companies: [
      {
        name: "Boston Pizza",
        logo: "/images/companies/boston-pizza.jpg",
        position: "Bartender",
        location: "Toronto, ON",
        salary: "$35,000 - $52,000",
        type: "Part-time",
        benefits: ["Tips", "Flexible Hours", "Staff Discounts"]
      },
      {
        name: "The Keg Restaurants",
        logo: "/images/companies/generic-canadian-4.jpg",
        position: "Mixologist",
        location: "Vancouver, BC",
        salary: "$38,000 - $55,000",
        type: "Full-time",
        benefits: ["Health Benefits", "Training Programs", "Career Growth"]
      },
      {
        name: "Earls Restaurant",
        logo: "🥃",
        position: "Bar Server",
        location: "Calgary, AB",
        salary: "$32,000 - $48,000",
        type: "Part-time",
        benefits: ["Tips", "Employee Meals", "Flexible Schedule"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Boston Pizza",
        position: "Bartender",
        message: "Your bartending experience is impressive! We have an immediate opening for a Bartender with competitive tips.",
        time: "12 minutes ago",
        isNew: true,
        avatar: "🍺"
      },
      {
        id: 2,
        company: "The Keg Restaurants",
        position: "Mixologist",
        message: "Join our team as a Mixologist! Great atmosphere and excellent earning potential with tips.",
        time: "1 hour ago",
        isNew: true,
        avatar: "🍸"
      },
      {
        id: 3,
        company: "Earls Restaurant",
        position: "Bar Server",
        message: "Part-time Bar Server position available. Perfect for flexible work-life balance!",
        time: "2 hours ago",
        isNew: false,
        avatar: "🥃"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Bartender Position Open! 🍺',
        message: 'Boston Pizza needs experienced bartenders with immediate start',
        type: 'bartender_job',
        time: '12 minutes ago',
        isNew: true,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Mixologist Opportunity! 🍸',
        message: 'The Keg Restaurants offers full-time mixologist role with benefits',
        type: 'mixologist_job',
        time: '1 hour ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  caretaker: {
    companies: [
      {
        name: "Canadian Tire",
        logo: "/images/companies/canadian-tire.jpg",
        position: "Building Superintendent",
        location: "Toronto, ON",
        salary: "$36,000 - $48,000",
        type: "Full-time",
        benefits: ["Health Benefits", "Pension Plan", "Tool Allowance"]
      },
      {
        name: "Property Management Plus",
        logo: "🏢",
        position: "Caretaker",
        location: "Montreal, QC",
        salary: "$34,000 - $46,000",
        type: "Full-time",
        benefits: ["On-site Housing", "Utilities Included", "Flexible Hours"]
      },
      {
        name: "Residential Properties Inc.",
        logo: "🏠",
        position: "Maintenance Supervisor",
        location: "Vancouver, BC",
        salary: "$38,000 - $50,000",
        type: "Full-time",
        benefits: ["Company Vehicle", "Training Programs", "Overtime Pay"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Canadian Tire",
        position: "Building Superintendent",
        message: "Your maintenance skills are exactly what we need! Building Superintendent role with excellent benefits.",
        time: "20 minutes ago",
        isNew: true,
        avatar: "🔧"
      },
      {
        id: 2,
        company: "Property Management Plus",
        position: "Caretaker",
        message: "Caretaker position with on-site housing included. Great opportunity for stable employment!",
        time: "45 minutes ago",
        isNew: true,
        avatar: "🏢"
      },
      {
        id: 3,
        company: "Residential Properties Inc.",
        position: "Maintenance Supervisor",
        message: "Supervisory role available! Lead a maintenance team with competitive compensation.",
        time: "2 hours ago",
        isNew: false,
        avatar: "🏠"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Superintendent Role Available! 🔧',
        message: 'Canadian Tire needs a Building Superintendent with maintenance experience',
        type: 'superintendent_job',
        time: '20 minutes ago',
        isNew: true,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Housing Included Position! 🏠',
        message: 'Property Management Plus offers caretaker role with on-site housing',
        type: 'housing_included_job',
        time: '45 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  electrician: {
    companies: [
      {
        name: "Home Depot Canada",
        logo: "/images/companies/home-depot.jpg",
        position: "Licensed Electrician",
        location: "Toronto, ON",
        salary: "$62,000 - $83,000",
        type: "Full-time",
        benefits: ["Health Benefits", "Tool Allowance", "Overtime Pay"]
      },
      {
        name: "Hydro One",
        logo: "🔌",
        position: "Power Line Technician",
        location: "Ottawa, ON",
        salary: "$65,000 - $88,000",
        type: "Full-time",
        benefits: ["Government Benefits", "Pension Plan", "Safety Training"]
      },
      {
        name: "ElectriCorp Services",
        logo: "💡",
        position: "Industrial Electrician",
        location: "Calgary, AB",
        salary: "$58,000 - $78,000",
        type: "Full-time",
        benefits: ["Certification Support", "Career Growth", "Health Coverage"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Home Depot Canada",
        position: "Licensed Electrician",
        message: "Your electrical certification is perfect! We need licensed electricians with competitive pay and benefits.",
        time: "5 minutes ago",
        isNew: true,
        avatar: "⚡"
      },
      {
        id: 2,
        company: "Hydro One",
        position: "Power Line Technician",
        message: "Join Ontario's power utility! Power Line Technician role with government benefits and pension.",
        time: "30 minutes ago",
        isNew: true,
        avatar: "🔌"
      },
      {
        id: 3,
        company: "ElectriCorp Services",
        position: "Industrial Electrician",
        message: "Industrial electrician needed! Work on large-scale projects with excellent compensation.",
        time: "1 hour ago",
        isNew: false,
        avatar: "💡"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Licensed Electrician Needed! ⚡',
        message: 'Home Depot Canada offers electrician role with tool allowance',
        type: 'electrician_job',
        time: '5 minutes ago',
        isNew: true,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Government Utility Job! 🔌',
        message: 'Hydro One has Power Line Technician position with pension benefits',
        type: 'utility_job',
        time: '30 minutes ago',
        isNew: true,
        priority: 'high'
      }
    ]
  },

  nanny: {
    companies: [
      {
        name: "Bright Horizons",
        logo: "👶",
        position: "Live-in Nanny",
        location: "Toronto, ON",
        salary: "$31,000 - $52,000",
        type: "Live-in",
        benefits: ["Accommodation", "Meals Provided", "Health Benefits"]
      },
      {
        name: "Kids & Company",
        logo: "🧸",
        position: "Full-time Nanny",
        location: "Vancouver, BC",
        salary: "$35,000 - $48,000",
        type: "Full-time",
        benefits: ["Childcare Discount", "Paid Vacation", "Professional Development"]
      },
      {
        name: "Family Care Plus",
        logo: "👨‍👩‍👧‍👦",
        position: "Parent's Helper",
        location: "Calgary, AB",
        salary: "$28,000 - $42,000",
        type: "Part-time",
        benefits: ["Flexible Hours", "Transportation Allowance", "Bonus Pay"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Bright Horizons",
        position: "Live-in Nanny",
        message: "Perfect match for our live-in nanny position! Accommodation and meals provided with lovely family.",
        time: "8 minutes ago",
        isNew: true,
        avatar: "👶"
      },
      {
        id: 2,
        company: "Kids & Company",
        position: "Full-time Nanny",
        message: "Full-time nanny role available! Professional family seeking experienced childcare provider.",
        time: "25 minutes ago",
        isNew: true,
        avatar: "🧸"
      },
      {
        id: 3,
        company: "Family Care Plus",
        position: "Parent's Helper",
        message: "Part-time parent's helper needed! Flexible schedule perfect for work-life balance.",
        time: "1 hour ago",
        isNew: false,
        avatar: "👨‍👩‍👧‍👦"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Live-in Nanny Position! 👶',
        message: 'Bright Horizons offers live-in nanny role with accommodation included',
        type: 'live_in_nanny',
        time: '8 minutes ago',
        isNew: true,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Professional Family Seeking Nanny! 🧸',
        message: 'Kids & Company has full-time nanny position with benefits',
        type: 'professional_nanny',
        time: '25 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  housekeeper: {
    companies: [
      {
        name: "Molly Maid",
        logo: "🧽",
        position: "Residential Housekeeper",
        location: "Toronto, ON",
        salary: "$31,000 - $35,000",
        type: "Part-time",
        benefits: ["Flexible Hours", "Equipment Provided", "Client Tips"]
      },
      {
        name: "Best Western Hotels",
        logo: "🏨",
        position: "Hotel Housekeeper",
        location: "Vancouver, BC",
        salary: "$33,000 - $37,000",
        type: "Full-time",
        benefits: ["Health Benefits", "Employee Discounts", "Paid Training"]
      },
      {
        name: "Elite Cleaning Services",
        logo: "✨",
        position: "Housekeeping Supervisor",
        location: "Calgary, AB",
        salary: "$36,000 - $42,000",
        type: "Full-time",
        benefits: ["Leadership Role", "Team Management", "Performance Bonuses"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Molly Maid",
        position: "Residential Housekeeper",
        message: "Join our residential housekeeping team! Flexible hours and equipment provided.",
        time: "18 minutes ago",
        isNew: true,
        avatar: "🧽"
      },
      {
        id: 2,
        company: "Best Western Hotels",
        position: "Hotel Housekeeper",
        message: "Hotel housekeeping position with full benefits! Join our hospitality team.",
        time: "40 minutes ago",
        isNew: true,
        avatar: "🏨"
      },
      {
        id: 3,
        company: "Elite Cleaning Services",
        position: "Housekeeping Supervisor",
        message: "Supervisory role in housekeeping! Lead a team with competitive compensation.",
        time: "1.5 hours ago",
        isNew: false,
        avatar: "✨"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Flexible Housekeeping Job! 🧽',
        message: 'Molly Maid offers part-time housekeeping with flexible schedule',
        type: 'flexible_housekeeping',
        time: '18 minutes ago',
        isNew: true,
        priority: 'medium'
      },
      {
        id: 2,
        title: 'Hotel Housekeeping Role! 🏨',
        message: 'Best Western Hotels needs housekeepers with full benefits',
        type: 'hotel_housekeeping',
        time: '40 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  security: {
    companies: [
      {
        name: "Securitas Canada",
        logo: "🛡️",
        position: "Security Guard",
        location: "Toronto, ON",
        salary: "$40,000 - $50,000",
        type: "Full-time",
        benefits: ["Security Training", "Uniform Provided", "Health Benefits"]
      },
      {
        name: "Paladin Security",
        logo: "🔒",
        position: "Site Security Officer",
        location: "Vancouver, BC",
        salary: "$38,000 - $48,000",
        type: "Shift Work",
        benefits: ["Shift Premiums", "Career Advancement", "Training Programs"]
      },
      {
        name: "Commissionaires",
        logo: "👮",
        position: "Security Supervisor",
        location: "Ottawa, ON",
        salary: "$45,000 - $55,000",
        type: "Full-time",
        benefits: ["Leadership Role", "Government Contracts", "Pension Plan"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Securitas Canada",
        position: "Security Guard",
        message: "Your security background is impressive! We have immediate openings for Security Guards with full training.",
        time: "8 minutes ago",
        isNew: true,
        avatar: "🛡️"
      },
      {
        id: 2,
        company: "Paladin Security",
        position: "Site Security Officer",
        message: "Night shift security position available. Great for those who prefer evening work with shift premiums!",
        time: "1.5 hours ago",
        isNew: true,
        avatar: "🔒"
      },
      {
        id: 3,
        company: "Commissionaires",
        position: "Security Supervisor",
        message: "Leadership opportunity! We're looking for experienced security professionals for supervisor roles.",
        time: "3 hours ago",
        isNew: false,
        avatar: "👮"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Security Position Open! 🛡️',
        message: 'Securitas Canada needs Security Guards with immediate start',
        type: 'security_job',
        time: '8 minutes ago',
        isNew: true,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Supervisor Role Available! 👮',
        message: 'Commissionaires has a Security Supervisor position with leadership opportunities',
        type: 'supervisor_job',
        time: '3 hours ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  welder: {
    companies: [
      {
        name: "Canadian Steel Works",
        logo: "🔥",
        position: "Certified Welder",
        location: "Toronto, ON",
        salary: "$52,000 - $73,000",
        type: "Full-time",
        benefits: ["Safety Training", "Tool Allowance", "Overtime Pay"]
      },
      {
        name: "Bombardier Inc.",
        logo: "/images/companies/bombardier.jpg",
        position: "Industrial Welder",
        location: "Montreal, QC",
        salary: "$55,000 - $78,000",
        type: "Full-time",
        benefits: ["Health Benefits", "Pension Plan", "Skills Training"]
      },
      {
        name: "Pipeline Construction Ltd.",
        logo: "🔧",
        position: "Pipeline Welder",
        location: "Calgary, AB",
        salary: "$58,000 - $82,000",
        type: "Full-time",
        benefits: ["Travel Allowance", "Accommodation", "High Pay"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Canadian Steel Works",
        position: "Certified Welder",
        message: "Your welding certification is exactly what we need! Certified Welder position with excellent benefits.",
        time: "3 minutes ago",
        isNew: true,
        avatar: "🔥"
      },
      {
        id: 2,
        company: "Bombardier Inc.",
        position: "Industrial Welder",
        message: "Join Canada's aerospace leader! Industrial Welder role with pension and benefits.",
        time: "22 minutes ago",
        isNew: true,
        avatar: "⚙️"
      },
      {
        id: 3,
        company: "Pipeline Construction Ltd.",
        position: "Pipeline Welder",
        message: "High-paying pipeline welder position! Travel and accommodation provided.",
        time: "1 hour ago",
        isNew: false,
        avatar: "🔧"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Certified Welder Needed! 🔥',
        message: 'Canadian Steel Works offers welder position with tool allowance',
        type: 'welder_job',
        time: '3 minutes ago',
        isNew: true,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Aerospace Welding Job! ⚙️',
        message: 'Bombardier Inc. needs industrial welders with pension benefits',
        type: 'aerospace_job',
        time: '22 minutes ago',
        isNew: true,
        priority: 'high'
      }
    ]
  },

  plumber: {
    companies: [
      {
        name: "Lowe's Canada",
        logo: "/images/companies/lowes.jpg",
        position: "Licensed Plumber",
        location: "Toronto, ON",
        salary: "$62,000 - $83,000",
        type: "Full-time",
        benefits: ["Health Benefits", "Tool Allowance", "Training Programs"]
      },
      {
        name: "Home Depot Canada",
        logo: "/images/companies/home-depot.jpg",
        position: "Residential Plumber",
        location: "Vancouver, BC",
        salary: "$58,000 - $78,000",
        type: "Full-time",
        benefits: ["Company Vehicle", "Overtime Pay", "Career Growth"]
      },
      {
        name: "Municipal Water Works",
        logo: "💧",
        position: "Water Systems Technician",
        location: "Ottawa, ON",
        salary: "$55,000 - $75,000",
        type: "Full-time",
        benefits: ["Government Benefits", "Pension Plan", "Job Security"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Lowe's Canada",
        position: "Licensed Plumber",
        message: "Your plumbing license is perfect! Licensed Plumber position with competitive pay and benefits.",
        time: "7 minutes ago",
        isNew: true,
        avatar: "🔧"
      },
      {
        id: 2,
        company: "Home Depot Canada",
        position: "Residential Plumber",
        message: "Residential plumber needed! Company vehicle and overtime opportunities available.",
        time: "35 minutes ago",
        isNew: true,
        avatar: "🚿"
      },
      {
        id: 3,
        company: "Municipal Water Works",
        position: "Water Systems Technician",
        message: "Government position available! Water Systems Technician with pension and job security.",
        time: "1.2 hours ago",
        isNew: false,
        avatar: "💧"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Licensed Plumber Position! 🔧',
        message: 'Lowe\'s Canada needs licensed plumbers with tool allowance',
        type: 'plumber_job',
        time: '7 minutes ago',
        isNew: true,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Government Plumbing Job! 💧',
        message: 'Municipal Water Works offers technician role with pension',
        type: 'government_job',
        time: '1.2 hours ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  receptionist: {
    companies: [
      {
        name: "Professional Services Inc.",
        logo: "📞",
        position: "Front Desk Receptionist",
        location: "Toronto, ON",
        salary: "$32,000 - $45,000",
        type: "Full-time",
        benefits: ["Health Benefits", "Paid Vacation", "Professional Environment"]
      },
      {
        name: "Medical Center Plus",
        logo: "🏥",
        position: "Medical Receptionist",
        location: "Vancouver, BC",
        salary: "$35,000 - $48,000",
        type: "Full-time",
        benefits: ["Health Coverage", "Training Provided", "Career Growth"]
      },
      {
        name: "Corporate Solutions",
        logo: "🏢",
        position: "Administrative Assistant",
        location: "Calgary, AB",
        salary: "$33,000 - $46,000",
        type: "Full-time",
        benefits: ["Flexible Hours", "Professional Development", "Bonuses"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Professional Services Inc.",
        position: "Front Desk Receptionist",
        message: "Your communication skills are excellent! Front Desk Receptionist position in professional environment.",
        time: "14 minutes ago",
        isNew: true,
        avatar: "📞"
      },
      {
        id: 2,
        company: "Medical Center Plus",
        position: "Medical Receptionist",
        message: "Medical receptionist needed! Healthcare environment with training provided.",
        time: "50 minutes ago",
        isNew: true,
        avatar: "🏥"
      },
      {
        id: 3,
        company: "Corporate Solutions",
        position: "Administrative Assistant",
        message: "Administrative assistant role available! Professional development opportunities included.",
        time: "2 hours ago",
        isNew: false,
        avatar: "🏢"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Receptionist Position Open! 📞',
        message: 'Professional Services Inc. needs front desk receptionist',
        type: 'receptionist_job',
        time: '14 minutes ago',
        isNew: true,
        priority: 'medium'
      },
      {
        id: 2,
        title: 'Medical Receptionist Role! 🏥',
        message: 'Medical Center Plus offers receptionist position with training',
        type: 'medical_job',
        time: '50 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  hostess: {
    companies: [
      {
        name: "Tim Hortons",
        logo: "☕",
        position: "Restaurant Hostess",
        location: "Toronto, ON",
        salary: "$28,000 - $37,000",
        type: "Part-time",
        benefits: ["Tips", "Flexible Hours", "Employee Discounts"]
      },
      {
        name: "The Keg Restaurants",
        logo: "🍽️",
        position: "Front of House Host",
        location: "Vancouver, BC",
        salary: "$30,000 - $40,000",
        type: "Part-time",
        benefits: ["Tips", "Staff Meals", "Training Programs"]
      },
      {
        name: "Earls Restaurant",
        logo: "🎉",
        position: "Guest Services Host",
        location: "Calgary, AB",
        salary: "$29,000 - $38,000",
        type: "Part-time",
        benefits: ["Tips", "Flexible Schedule", "Career Growth"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Tim Hortons",
        position: "Restaurant Hostess",
        message: "Your hospitality skills are perfect! Restaurant Hostess position with tips and flexible hours.",
        time: "11 minutes ago",
        isNew: true,
        avatar: "☕"
      },
      {
        id: 2,
        company: "The Keg Restaurants",
        position: "Front of House Host",
        message: "Front of house host needed! Great atmosphere with tips and staff meals included.",
        time: "28 minutes ago",
        isNew: true,
        avatar: "🍽️"
      },
      {
        id: 3,
        company: "Earls Restaurant",
        position: "Guest Services Host",
        message: "Guest services host position available! Flexible schedule with career growth opportunities.",
        time: "1.5 hours ago",
        isNew: false,
        avatar: "🎉"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Hostess Position Available! ☕',
        message: 'Tim Hortons needs restaurant hostess with flexible hours',
        type: 'hostess_job',
        time: '11 minutes ago',
        isNew: true,
        priority: 'medium'
      },
      {
        id: 2,
        title: 'Front of House Role! 🍽️',
        message: 'The Keg Restaurants offers host position with tips and meals',
        type: 'front_house_job',
        time: '28 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  // Add aliases for positions with different naming conventions
  caretakerbuildingsuperintendent: {
    companies: [
      {
        name: "Canadian Tire",
        logo: "🔧",
        position: "Building Superintendent",
        location: "Toronto, ON",
        salary: "$36,000 - $48,000",
        type: "Full-time",
        benefits: ["Health Benefits", "Pension Plan", "Tool Allowance"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Canadian Tire",
        position: "Building Superintendent",
        message: "Your maintenance skills are exactly what we need! Building Superintendent role with excellent benefits.",
        time: "20 minutes ago",
        isNew: true,
        avatar: "🔧"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Superintendent Role Available! 🔧',
        message: 'Canadian Tire needs a Building Superintendent with maintenance experience',
        type: 'superintendent_job',
        time: '20 minutes ago',
        isNew: true,
        priority: 'high'
      }
    ]
  },

  securityguard: {
    companies: [
      {
        name: "Securitas Canada",
        logo: "🛡️",
        position: "Security Guard",
        location: "Toronto, ON",
        salary: "$40,000 - $50,000",
        type: "Full-time",
        benefits: ["Security Training", "Uniform Provided", "Health Benefits"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Securitas Canada",
        position: "Security Guard",
        message: "Your security background is impressive! We have immediate openings for Security Guards with full training.",
        time: "8 minutes ago",
        isNew: true,
        avatar: "🛡️"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Security Position Open! 🛡️',
        message: 'Securitas Canada needs Security Guards with immediate start',
        type: 'security_job',
        time: '8 minutes ago',
        isNew: true,
        priority: 'high'
      }
    ]
  },

  casinoworker: {
    companies: [
      {
        name: "Great Northern Casino",
        logo: "🎰",
        position: "Casino Dealer",
        location: "Toronto, ON",
        salary: "$32,000 - $45,000",
        type: "Full-time",
        benefits: ["Tips", "Flexible Hours", "Training Provided"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Great Northern Casino",
        position: "Casino Dealer",
        message: "Join Canada's exciting gaming industry! Casino dealer position with tips and training provided.",
        time: "15 minutes ago",
        isNew: true,
        avatar: "🎰"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Casino Position Available! 🎰',
        message: 'Great Northern Casino needs dealers with training provided',
        type: 'casino_job',
        time: '15 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  drycleaningworker: {
    companies: [
      {
        name: "Maple Cleaners",
        logo: "/images/companies/maple-cleaners.jpg",
        position: "Dry Cleaning Operator",
        location: "Toronto, ON",
        salary: "$30,000 - $42,000",
        type: "Full-time",
        benefits: ["Health Benefits", "Training Provided", "Flexible Hours"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Maple Cleaners",
        position: "Dry Cleaning Operator",
        message: "Help keep clothes fresh and clean! Dry cleaning operator position with competitive wages.",
        time: "25 minutes ago",
        isNew: true,
        avatar: "👔"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Dry Cleaning Job Available! 👔',
        message: 'Maple Cleaners needs dry cleaning operators with training',
        type: 'dry_cleaning_job',
        time: '25 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  fishplantworker: {
    companies: [
      {
        name: "Atlantic Seafood Co.",
        logo: "/images/companies/atlantic-seafood.jpg",
        position: "Fish Processing Worker",
        location: "Halifax, NS",
        salary: "$36,000 - $52,000",
        type: "Full-time",
        benefits: ["Health Benefits", "Overtime Pay", "Seasonal Bonuses"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Atlantic Seafood Co.",
        position: "Fish Processing Worker",
        message: "Join Canada's seafood industry! Fish processing worker position with competitive wages.",
        time: "30 minutes ago",
        isNew: true,
        avatar: "🐟"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Seafood Industry Job! 🐟',
        message: 'Atlantic Seafood Co. needs fish processing workers',
        type: 'seafood_job',
        time: '30 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  gardener: {
    companies: [
      {
        name: "Northern Landscapes",
        logo: "/images/companies/northern-landscapes.jpg",
        position: "Landscape Gardener",
        location: "Toronto, ON",
        salary: "$31,000 - $42,000",
        type: "Full-time",
        benefits: ["Outdoor Work", "Seasonal Employment", "Equipment Provided"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Northern Landscapes",
        position: "Landscape Gardener",
        message: "Cultivate beautiful landscapes! Gardener position with outdoor work and competitive pay.",
        time: "35 minutes ago",
        isNew: true,
        avatar: "🌱"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Gardening Position Open! 🌱',
        message: 'Northern Landscapes needs gardeners for outdoor work',
        type: 'gardening_job',
        time: '35 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  // Additional missing positions
  hotelfrontdeskclerk: {
    companies: [
      {
        name: "Marriott Hotels",
        logo: "/images/companies/marriott.jpg",
        position: "Front Desk Clerk",
        location: "Toronto, ON",
        salary: "$34,000 - $45,000",
        type: "Full-time",
        benefits: ["Health Benefits", "Employee Discounts", "Career Growth"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Marriott Hotels",
        position: "Front Desk Clerk",
        message: "Be the first point of contact for guests! Front desk clerk position with career growth opportunities.",
        time: "12 minutes ago",
        isNew: true,
        avatar: "🏨"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Hotel Front Desk Position! 🏨',
        message: 'Marriott Hotels needs front desk clerks with benefits',
        type: 'hotel_job',
        time: '12 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  hotelvalet: {
    companies: [
      {
        name: "Hilton Hotels",
        logo: "/images/companies/hilton.jpg",
        position: "Hotel Valet",
        location: "Vancouver, BC",
        salary: "$28,000 - $37,000",
        type: "Part-time",
        benefits: ["Tips", "Flexible Hours", "Training Provided"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Hilton Hotels",
        position: "Hotel Valet",
        message: "Provide premium service at Canadian hotels! Valet position with tips and flexible hours.",
        time: "18 minutes ago",
        isNew: true,
        avatar: "🚗"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Hotel Valet Position! 🚗',
        message: 'Hilton Hotels needs valets with tip earning potential',
        type: 'valet_job',
        time: '18 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  housekeepingstaff: {
    companies: [
      {
        name: "Best Western Hotels",
        logo: "/images/companies/best-western.jpg",
        position: "Housekeeping Staff",
        location: "Calgary, AB",
        salary: "$31,000 - $37,000",
        type: "Full-time",
        benefits: ["Health Benefits", "Employee Discounts", "Flexible Schedule"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Best Western Hotels",
        position: "Housekeeping Staff",
        message: "Join our professional housekeeping team! Full-time position with benefits and advancement opportunities.",
        time: "22 minutes ago",
        isNew: true,
        avatar: "🧽"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Housekeeping Staff Needed! 🧽',
        message: 'Best Western Hotels offers housekeeping positions with benefits',
        type: 'housekeeping_job',
        time: '22 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  parentshelper: {
    companies: [
      {
        name: "Family Care Plus",
        logo: "👨‍👩‍👧‍👦",
        position: "Parent's Helper",
        location: "Toronto, ON",
        salary: "$28,000 - $42,000",
        type: "Part-time",
        benefits: ["Flexible Hours", "Transportation Allowance", "Bonus Pay"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Family Care Plus",
        position: "Parent's Helper",
        message: "Support families with childcare and household duties! Parent's helper position with flexible schedule.",
        time: "26 minutes ago",
        isNew: true,
        avatar: "👨‍👩‍👧‍👦"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Parent Helper Position! 👨‍👩‍👧‍👦',
        message: 'Family Care Plus needs parent helpers with flexible hours',
        type: 'parent_helper_job',
        time: '26 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  // Missing positions from auth system
  janitorbuildingsuperintendent: {
    companies: [
      {
        name: "Canadian Properties",
        logo: "🧹",
        position: "Janitor & Building Superintendent",
        location: "Toronto, ON",
        salary: "$36,000 - $48,000",
        type: "Full-time",
        benefits: ["Health Benefits", "Stable Employment", "Varied Responsibilities"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Canadian Properties",
        position: "Janitor & Building Superintendent",
        message: "Ensure facilities are clean and well-maintained! Janitor & Building Superintendent role with stable employment.",
        time: "16 minutes ago",
        isNew: true,
        avatar: "🧹"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Janitor & Superintendent Role! 🧹',
        message: 'Canadian Properties needs janitor with building maintenance duties',
        type: 'janitor_job',
        time: '16 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  kitchenhelper: {
    companies: [
      {
        name: "McDonald's Canada",
        logo: "🍟",
        position: "Kitchen Helper",
        location: "Toronto, ON",
        salary: "$31,000 - $35,000",
        type: "Part-time",
        benefits: ["Food Safety Training", "Team Work", "Flexible Hours"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "McDonald's Canada",
        position: "Kitchen Helper",
        message: "Support the kitchen team! Kitchen helper position to start your culinary journey with training provided.",
        time: "19 minutes ago",
        isNew: true,
        avatar: "🍟"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Kitchen Helper Position! 🍟',
        message: 'McDonald\'s Canada needs kitchen helpers with training provided',
        type: 'kitchen_job',
        time: '19 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  lightdutycleaner: {
    companies: [
      {
        name: "Clean Pro Services",
        logo: "✨",
        position: "Light Duty Cleaner",
        location: "Vancouver, BC",
        salary: "$28,000 - $37,000",
        type: "Part-time",
        benefits: ["Flexible Hours", "Basic Cleaning Training", "Reliable Work"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Clean Pro Services",
        position: "Light Duty Cleaner",
        message: "Help maintain cleanliness with flexible hours! Light duty cleaner position that fits your schedule.",
        time: "21 minutes ago",
        isNew: true,
        avatar: "✨"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Light Duty Cleaning Job! ✨',
        message: 'Clean Pro Services offers flexible cleaning positions',
        type: 'light_cleaning_job',
        time: '21 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  machineoperator: {
    companies: [
      {
        name: "Bombardier Inc.",
        logo: "/images/companies/bombardier.jpg",
        position: "Machine Operator",
        location: "Montreal, QC",
        salary: "$38,000 - $52,000",
        type: "Full-time",
        benefits: ["Technical Training", "Safety Programs", "Manufacturing Experience"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Bombardier Inc.",
        position: "Machine Operator",
        message: "Operate equipment in Canadian manufacturing! Machine operator position with technical training and competitive pay.",
        time: "24 minutes ago",
        isNew: true,
        avatar: "⚙️"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Machine Operator Position! ⚙️',
        message: 'Bombardier Inc. needs machine operators with technical training',
        type: 'machine_operator_job',
        time: '24 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  secretary: {
    companies: [
      {
        name: "Corporate Solutions",
        logo: "📋",
        position: "Secretary",
        location: "Calgary, AB",
        salary: "$32,000 - $45,000",
        type: "Full-time",
        benefits: ["Administrative Experience", "Professional Development", "Career Advancement"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Corporate Solutions",
        position: "Secretary",
        message: "Provide administrative support in professional environments! Secretary position with career advancement opportunities.",
        time: "27 minutes ago",
        isNew: true,
        avatar: "📋"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Secretary Position Available! 📋',
        message: 'Corporate Solutions needs secretary with administrative experience',
        type: 'secretary_job',
        time: '27 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  specializedcleaner: {
    companies: [
      {
        name: "Elite Cleaning Services",
        logo: "🧽",
        position: "Specialized Cleaner",
        location: "Toronto, ON",
        salary: "$35,000 - $52,000",
        type: "Full-time",
        benefits: ["Specialized Training", "Safety Protocols", "Competitive Pay"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Elite Cleaning Services",
        position: "Specialized Cleaner",
        message: "Use your skills for unique cleaning challenges! Specialized cleaner position with competitive pay in specialized environments.",
        time: "29 minutes ago",
        isNew: true,
        avatar: "🧽"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Specialized Cleaning Role! 🧽',
        message: 'Elite Cleaning Services needs specialized cleaners with training',
        type: 'specialized_cleaning_job',
        time: '29 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  },

  storekeeper: {
    companies: [
      {
        name: "Loblaws",
        logo: "/images/companies/loblaws.jpg",
        position: "Store Keeper",
        location: "Toronto, ON",
        salary: "$30,000 - $42,000",
        type: "Full-time",
        benefits: ["Inventory Management", "Customer Service", "Retail Experience"]
      }
    ],
    messages: [
      {
        id: 1,
        company: "Loblaws",
        position: "Store Keeper",
        message: "Manage inventory and operations in retail! Store keeper position with competitive compensation and benefits.",
        time: "32 minutes ago",
        isNew: true,
        avatar: "🏪"
      }
    ],
    notifications: [
      {
        id: 1,
        title: 'Store Keeper Position! 🏪',
        message: 'Loblaws needs store keepers for inventory management',
        type: 'store_keeper_job',
        time: '32 minutes ago',
        isNew: true,
        priority: 'medium'
      }
    ]
  }
};

// Helper function to get job-specific data
export const getJobSpecificData = (jobPosition: string): JobSpecificData => {
  const normalizedPosition = jobPosition.toLowerCase().replace(/\s+/g, '').replace(/'/g, '').replace(/&/g, '');
  
  // Debug logging
  console.log('Original position:', jobPosition);
  console.log('Normalized position:', normalizedPosition);
  console.log('Available positions:', Object.keys(jobSpecificData));
  console.log('Match found:', !!jobSpecificData[normalizedPosition]);
  
  return jobSpecificData[normalizedPosition] || jobSpecificData.chef; // Default to chef if position not found
};

// Helper function to get available job positions
export const getAvailablePositions = (): string[] => {
  return Object.keys(jobSpecificData);
};
