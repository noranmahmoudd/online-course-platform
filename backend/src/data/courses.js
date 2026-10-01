// Static course catalog used by the seed script.
// Images come from picsum.photos (a stable placeholder service, seeded by name).
const img = (seed) => `https://picsum.photos/seed/${seed}/600/340`;

const courses = [
  {
    title: "Python Programming Essentials",
    description: "Start programming with Python: syntax, control flow, functions and simple projects.",
    category: "Programming",
    price: 29,
    image: "https://explore-feed.github.com/topics/python/python.png",
    lessons: [
      { title: "Getting Started with Python", description: "Install Python and run your first script.", content: "Python is known for readable syntax. Install Python 3, create a file called hello.py containing print('Hello, world!') and run it with python hello.py." },
      { title: "Control Flow", description: "if statements and loops.", content: "Use if, elif and else to make decisions. Use for loops to iterate over sequences and while loops to repeat until a condition changes." },
      { title: "Functions and Modules", description: "Organize code into reusable pieces.", content: "Define functions with def. Import code from the standard library, such as math and random, with the import statement." },
    ],
  },
  {
    title: "SQL Fundamentals",
    description: "Learn relational databases and write SQL queries with joins, grouping and subqueries.",
    category: "Database",
    price: 0,
    image: "https://www.softfluent.fr/wp-content/uploads/2019/10/SQL-800x420.png",
    lessons: [
      { title: "Tables and SELECT", description: "Reading data from tables.", content: "A relational database stores data in tables of rows and columns. SELECT columns FROM table WHERE condition retrieves the rows you need." },
      { title: "Joins", description: "Combine data from several tables.", content: "A JOIN connects tables using related columns, such as orders.customer_id = customers.id. INNER JOIN keeps only matching rows." },
      { title: "Grouping and Aggregates", description: "Summarize data.", content: "Use COUNT, SUM and AVG with GROUP BY to calculate totals per category. HAVING filters the grouped results." },
    ],
  },
  {
    title: "Web Security Basics",
    description: "Learn the most common web vulnerabilities and how to defend against them.",
    category: "Cyber Security",
    price: 45,
    image: "https://cdn.educba.com/academy/wp-content/uploads/2015/10/Basics-of-Cybersecurity.jpg",
    lessons: [
      { title: "The Security Mindset", description: "Threats, attackers and defense in depth.", content: "Security is about protecting confidentiality, integrity and availability. Assume user input is hostile and add several layers of defense." },
      { title: "Injection and XSS", description: "Two classic attacks.", content: "Injection attacks trick an application into running attacker-supplied commands. Cross-site scripting injects scripts into pages. Validate input, escape output and use parameterized queries." },
      { title: "Authentication and Passwords", description: "Store and verify credentials safely.", content: "Never store plain-text passwords. Hash them with bcrypt, use HTTPS, set token expiry and enforce strong password rules." },
    ],
  },
  {
    title: "Ethical Hacking for Beginners",
    description: "An introduction to penetration testing concepts, tools and responsible disclosure.",
    category: "Cyber Security",
    price: 69,
    image:"https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/185C6/production/_96028799_istock-622184706.jpg.webp",
    lessons: [
      { title: "What is Ethical Hacking?", description: "Legal and ethical foundations.", content: "Ethical hackers test systems with explicit permission to find weaknesses before criminals do. Always work within a written scope." },
      { title: "Reconnaissance", description: "Gathering information.", content: "The first step is learning about the target: public information, domains and exposed services. Good notes make later steps easier." },
      { title: "Reporting Findings", description: "Responsible disclosure.", content: "A good report explains the issue, its impact, how to reproduce it and how to fix it. Report privately and give the owner time to respond." },
    ],
  },
];

export default courses;
