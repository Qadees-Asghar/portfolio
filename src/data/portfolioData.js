export const personalData = {
  name: "Qadees Asghar",
  title: "Software Engineer & AI Specialist",
  taglines: [
    "Building Intelligent AI Systems",
    "Training & Fine-Tuning LLMs",
    "Developing Scalable Full-Stack & ASP.NET Apps",
    "Applying Deep Learning to Real-World Problems"
  ],
  bio: "Software Engineering student at UET Lahore with a passion for building high-performance AI models, machine learning workflows, and scalable full-stack applications. Experienced in neural networks, C#/.NET architecture, Python systems, and 3-Layer database design.",
  location: "Lahore, Pakistan",
  university: "University of Engineering & Technology (UET) Lahore",
  department: "Department of Computer Science",
  degree: "Bachelor of Science in Software Engineering",
  batch: "2025 – 2029 (Batch 2025)",
  emails: {
    primary: "theqadees@gmail.com",
    secondary: "qadeesasghar404@gmail.com"
  },
  socials: {
    github: "https://github.com/Qadees-Asghar",
    linkedin: "https://www.linkedin.com/in/qadees-asghar-734307316",
    emailPrimary: "mailto:theqadees@gmail.com",
    emailSecondary: "mailto:qadeesasghar404@gmail.com"
  },
  stats: [
    { label: "Projects Completed", value: "5+" },
    { label: "Tech Stack Tools", value: "15+" },
    { label: "UET SE Batch", value: "2025-29" },
    { label: "AI & ML Frameworks", value: "PyTorch / TF" }
  ]
};

export const educationData = {
  university: "University of Engineering & Technology (UET), Lahore",
  degree: "Bachelor of Science in Software Engineering",
  department: "Department of Computer Science",
  years: "2025 – 2029",
  location: "Lahore, Pakistan",
  courses: [
    "Object-Oriented Programming (OOP)",
    "Data Structures & Algorithms",
    "Database Management Systems & 3NF",
    "Software Architecture & Design Patterns",
    "Operating Systems & Multithreading",
    "Machine Learning & Deep Neural Networks",
    "Web Application Development"
  ]
};

export const projectsData = [
  {
    id: "servigo-2",
    title: "SERVIGO 2.0 Web Platform",
    category: "Full-Stack / Web",
    badge: "ASP.NET Core MVC",
    status: "Production Ready",
    summary: "Modern ASP.NET Core MVC 2.0 Web Application for on-demand service bookings, provider scheduling, and claims-based auth.",
    description: "SERVIGO 2.0 is an enterprise-level web migration built using ASP.NET Core MVC and Razor Views. It features multi-role portals (Admin, Customer, Service Provider), claims-based authentication, appointment scheduling workflows, real-time feedback systems, and a data-access layer (DAL) communicating with SQL Server.",
    tech: ["ASP.NET Core MVC", "C#", "SQL Server", "Razor Views", "Claims Auth", "Bootstrap/CSS"],
    highlights: [
      "Role-based access for Customers, Providers, and System Administrators",
      "Repository & DAL Architecture separating DB logic from Controllers",
      "Secure Cookie & Claims-based Authentication",
      "Dynamic booking workflow with status tracking (Pending, Approved, Completed)"
    ],
    github: "https://github.com/Qadees-Asghar/SERVIGO-2.0",
    icon: "Globe"
  },
  {
    id: "chess-ai",
    title: "Minimax Chess Engine & AI",
    category: "AI & Algorithms",
    badge: "C# / Minimax AI",
    status: "Featured",
    summary: "Single-file OOP Chess Engine featuring Minimax lookahead AI, complete move validation, and PGN move history.",
    description: "A complete Chess Game Engine built in C# with a custom GDI+ Windows Forms interface. Implements strict FIDE rules including castling, en-passant, pawn promotion, check/checkmate detection, along with a 2-ply Minimax AI bot with position evaluation scoring.",
    tech: ["C#", ".NET Framework", "Minimax Algorithm", "OOP Design", "GDI+ Graphics", "PGN History"],
    highlights: [
      "Deep OOP hierarchy for piece movement vectors (King, Queen, Rook, Bishop, Knight, Pawn)",
      "Minimax AI algorithm evaluating material balance & board positioning",
      "Complete check, checkmate, stalemate, and illegal move prevention",
      "Game Save/Load functionality with algebraic move notation history"
    ],
    github: "https://github.com/Qadees-Asghar/ChessGame",
    icon: "Cpu"
  },
  {
    id: "servigo-1",
    title: "SERVIGO 1.0 Desktop Platform",
    category: "Desktop & Systems",
    badge: "C# WinForms / SQL",
    status: "Completed",
    summary: "Desktop service booking system using C# Windows Forms, SQL Server 3NF relational database, and BCrypt password security.",
    description: "A desktop management suite for on-demand home and technical services. Designed around a strict 3-layer architecture (UI, DAL, Database) with 3NF normalized tables, BCrypt password hashing, session management, and custom theme rendering.",
    tech: ["C#", "Windows Forms", "SQL Server", "ADO.NET", "BCrypt", "3-Layer Arch"],
    highlights: [
      "3-Layer Architecture separating UI Forms, Data Access Objects, and SQL Database",
      "Third Normal Form (3NF) relational database schema with audit logs and triggers",
      "BCrypt password hashing & SQL injection protection via parameterized queries",
      "Built-in rating & review system with provider analytics"
    ],
    github: "https://github.com/Qadees-Asghar/SERVIGO",
    icon: "Monitor"
  },
  {
    id: "linquora-cli",
    title: "Linquora 2.0 Hospital System",
    category: "Python Systems",
    badge: "Python CLI",
    status: "Active",
    summary: "Smart command-line Hospital Management System in Python with room auto-capacity enforcement and persistent flat file storage.",
    description: "Linquora 2.0 is a modular Python CLI application that streamlines hospital operations. It manages patient records, doctor departments, appointment scheduling, and room allocations with auto-enforced room capacity limits.",
    tech: ["Python 3.x", "File I/O", "Modular Architecture", "CLI Systems", "Flat-File DB"],
    highlights: [
      "Auto-enforcement of room limits (ICU, Private, Semi-Private, General)",
      "Automatic patient-room discharge linking upon deletion",
      "Pipe-delimited text storage ensuring zero database dependency",
      "Clean menu-driven command interface for hospital staff"
    ],
    github: "https://github.com/Qadees-Asghar/Linquora2.0",
    icon: "Terminal"
  },
  {
    id: "linquora-web",
    title: "Linquora Web Portal",
    category: "Full-Stack / Web",
    badge: "Web UI / JS",
    status: "Completed",
    summary: "Responsive web portal for patient support, doctor listings, department catalogs, and healthcare consultation.",
    description: "Front-end web portal created for hospital administration, featuring clean UI layout, department exploration, doctor & nurse directories, interactive appointment request UI, and customer reviews.",
    tech: ["HTML5", "CSS3", "JavaScript", "FontAwesome", "Flexbox/Grid"],
    highlights: [
      "Responsive navigation for desktop and mobile healthcare users",
      "Interactive portal for patient vs doctor entry pathways",
      "Multi-department overview cards and emergency hotline header"
    ],
    github: "https://github.com/Qadees-Asghar/Linquora-Web",
    icon: "Layout"
  }
];

export const skillsMatrix = [
  {
    category: "Programming Languages",
    skills: [
      { name: "Python", level: "Advanced", icon: "python" },
      { name: "C++", level: "Proficient", icon: "cpp" },
      { name: "C# / .NET", level: "Advanced", icon: "csharp" },
      { name: "JavaScript", level: "Proficient", icon: "javascript" },
      { name: "SQL", level: "Advanced", icon: "sql" },
      { name: "HTML5 / CSS3", level: "Advanced", icon: "html" }
    ]
  },
  {
    category: "Machine Learning & AI",
    skills: [
      { name: "PyTorch", level: "Intermediate", icon: "pytorch" },
      { name: "TensorFlow", level: "Intermediate", icon: "tensorflow" },
      { name: "NumPy & Pandas", level: "Advanced", icon: "pandas" },
      { name: "Jupyter Notebooks", level: "Advanced", icon: "jupyter" },
      { name: "LLM Fine-Tuning", level: "Exploring", icon: "ai" },
      { name: "Minimax Algorithm", level: "Proficient", icon: "algorithm" }
    ]
  },
  {
    category: "Frameworks & Architecture",
    skills: [
      { name: "ASP.NET Core MVC", level: "Advanced", icon: "dotnet" },
      { name: "Windows Forms", level: "Advanced", icon: "winforms" },
      { name: "React + Vite", level: "Proficient", icon: "react" },
      { name: "Tailwind CSS", level: "Proficient", icon: "tailwind" },
      { name: "3-Layer Architecture", level: "Advanced", icon: "architecture" },
      { name: "3NF Database Design", level: "Advanced", icon: "database" }
    ]
  },
  {
    category: "Tools & Environments",
    skills: [
      { name: "Git & GitHub", level: "Advanced", icon: "git" },
      { name: "SQL Server", level: "Advanced", icon: "sqlserver" },
      { name: "VS Code", level: "Advanced", icon: "vscode" },
      { name: "Visual Studio", level: "Advanced", icon: "visualstudio" },
      { name: "Linux CLI", level: "Intermediate", icon: "linux" }
    ]
  }
];

export const terminalCommands = {
  help: `Available Commands:
  - whoami       : View quick bio & background
  - education    : Display university & degree details
  - projects     : List all projects & repositories
  - skills       : Show technical stack & AI tools
  - contact      : Display emails, LinkedIn & GitHub
  - sudo hire    : Trigger recruiter confirmation 🎉
  - clear        : Clear terminal output`,
  
  whoami: `Qadees Asghar | Software Engineering @ UET Lahore
Focus Areas: AI/ML, Deep Learning, LLMs, ASP.NET Core & C# Architecture.
Location   : Lahore, Pakistan`,
  
  education: `University of Engineering & Technology (UET) Lahore
Degree : Bachelor of Science in Software Engineering
Batch  : 2025 - 2029 (Batch 2025)
Dept   : Department of Computer Science`,
  
  projects: `1. SERVIGO 2.0     - ASP.NET Core MVC Web Booking Portal
2. Chess Engine    - Minimax AI & C# FIDE Rules Engine
3. SERVIGO 1.0     - C# .NET WinForms & SQL Server 3NF App
4. Linquora 2.0    - Python Hospital Management CLI
5. Linquora Web    - Healthcare UI Portal`,
  
  skills: `Languages : Python, C++, C#, SQL, JS, HTML/CSS
AI / ML   : PyTorch, TensorFlow, NumPy, Pandas, Minimax
Frameworks: ASP.NET Core MVC, .NET WinForms, React, Tailwind`,
  
  contact: `Email 1  : theqadees@gmail.com
Email 2  : qadeesasghar404@gmail.com
LinkedIn : https://www.linkedin.com/in/qadees-asghar-734307316
GitHub   : https://github.com/Qadees-Asghar`
};
