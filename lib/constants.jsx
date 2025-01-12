// import {
//   LayoutDashboard,
//   Shapes,
//   ShoppingBag,
//   Tag,
//   UsersRound,
// } from "lucide-react";

export const navLinks = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/find",
    label: "Find",
  },
  {
    url: "/manage",
    label: "Manage",
  },

];

// data/constants.js

export const jobs = [
  {
    id:1,
    title: "Software Engineer",
    category: "Engineering",
    description: "An exciting opportunity to work with cutting-edge technology at a fast-growing startup.",
    responsibilities: "Develop and maintain scalable software solutions.",
    requirements: "Bachelor’s degree in Computer Science. 3+ years of experience in software development.",
    salary: 120000,
    experience: 3, // 3+ years experience required
    location: "New York, USA",
    images: ["/mechanical.jpg", "/softeng.png"],
    deadline: new Date("2024-12-31"),
    recruiterId: {
      _id :"609bde7e2a1fbb00159b83f2",
      fullName : "John doe"  // John doe ObjectId
    }
  },
  {
    id:2,
    title: "Product Manager",
    category: "Management",
    description: "Lead the development of innovative products in a collaborative environment.",
    responsibilities: "Manage product lifecycle and collaborate with cross-functional teams.",
    requirements: "5+ years of experience in product management.",
    salary: 95000,
    experience: 5,
    location: "San Francisco, USA",
    images: ["/softeng.png"],
    deadline: new Date("2024-11-15"),
    recruiterId: {
      _id :"609bde7e2a1fbb00159b83f2",
      fullName : "John doe"  // John doe ObjectId
    }
  },
  {
    id:3,
    title: "Marketing Specialist",
    category: "Marketing",
    description: "Help create and implement marketing campaigns for a growing brand.",
    responsibilities: "Plan, execute, and optimize marketing campaigns across various platforms.",
    requirements: "2+ years of experience in marketing.",
    salary: 70000,
    experience: 2,
    location: "Los Angeles, USA",
    images: ["/mechanical.jpg"],
    deadline: new Date("2024-10-30"),
    recruiterId: {
      _id :"609bde7e2a1fbb00159b83f2",
      fullName : "John doe"  // John doe ObjectId
    }
  },
  {
    id:4,
    title: "HR Manager",
    category: "Human Resources",
    description: "Manage recruitment and foster a positive workplace culture.",
    responsibilities: "Oversee hiring processes and manage employee relations.",
    requirements: "5+ years of experience in HR management.",
    salary: 85000,
    experience: 5,
    location: "Chicago, USA",
    images: ["/softeng.png"],
    deadline: new Date("2024-11-20"),
    recruiterId: {
      _id :"609bde7e2a1fbb00159b83f2",
      fullName : "john doe"  // Alex Johnson's ObjectId
    }
  },
  {
    id:5,
    title: "UX Designer",
    category: "Design",
    description: "Design user experiences that delight customers and drive engagement.",
    responsibilities: "Create wireframes, prototypes, and high-fidelity designs.",
    requirements: "3+ years of experience in UX design.",
    salary: 80000,
    experience: 3,
    location: "Seattle, USA",
    images: ["/mechanical.jpg", "/softeng.png"],
    deadline: new Date("2024-12-10"),
    recruiterId: {
      _id :"609bde7e2a1fbb00159b83f3",
      fullName : "Alex Johnson's"  // Alex Johnson's ObjectId
    } // Alex Johnson's ObjectId
  },
  {
    id:6,
    title: "UX Designer",
    category: "Design",
    description: "Design user experiences that delight customers and drive engagement.",
    responsibilities: "Create wireframes, prototypes, and high-fidelity designs.",
    requirements: "3+ years of experience in UX design.",
    salary: 80000,
    experience: 3,
    location: "Seattle, USA",
    images: ["/mechanical.jpg", "/softeng.png"],
    deadline: new Date("2024-12-10"),
    recruiterId: {
      _id :"609bde7e2a1fbb00159b83f3",
      fullName : "Alex Johnson's"  // Alex Johnson's ObjectId
    }
    },
];

// propertyCategories.js

export const jobCategories = [
  { name: "Software Development", description: "Roles focused on creating and maintaining software applications." },
  { name: "Marketing", description: "Positions related to promoting products and services." },
  { name: "Sales", description: "Jobs focused on selling products and services to customers." },
  { name: "Human Resources", description: "Roles related to managing employee relations and company culture." },
  { name: "Finance", description: "Positions involving financial planning, analysis, and management." },
  { name: "Operations", description: "Roles focused on overseeing day-to-day business activities." },
  { name: "Customer Support", description: "Jobs dedicated to assisting customers and addressing their needs." },
  { name: "Data Science", description: "Positions involving data analysis and interpretation to drive business decisions." },
  { name: "Project Management", description: "Roles that oversee projects from initiation to completion." },
  { name: "Design", description: "Positions related to graphic design, user experience, and product design." },
  { name: "Consulting", description: "Jobs providing expert advice in specific industries." },
  { name: "Healthcare", description: "Roles focused on patient care, medical research, and healthcare services." },
];
