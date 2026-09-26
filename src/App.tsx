import React, { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  FileText,
  Flame,
  GraduationCap,
  Menu,
  MessageSquareText,
  MoonStar,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  X,
} from 'lucide-react'
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'

const levels = ['O-Level', 'A-Level'] as const
const difficultyLevels = ['Easy', 'Medium', 'Hard'] as const

type Level = (typeof levels)[number]
type Difficulty = (typeof difficultyLevels)[number]

type Subject = {
  id: string
  level: Level
  name: string
  slug: string
  description: string
  category: string
  topics: number
  practiceQuestions: number
  revisionResources: number
  accent: string
}

type Topic = {
  id: string
  subject: string
  level: Level
  name: string
  slug: string
  overview: string
  concepts: string[]
  definitions: string[]
  formulas: string[]
  examples: string[]
  mistakes: string[]
  notes: string[]
  related: string[]
  questions: Question[]
}

type Question = {
  id: string
  level: Level
  subject: string
  topic: string
  difficulty: Difficulty
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'structured'
  question: string
  options?: string[]
  correctAnswer?: string
  explanation: string
}

type PastPaper = {
  id: string
  title: string
  level: Level
  subject: string
  year: number
  paper: string
  link: string
  demo: boolean
}

type MockQuestion = {
  id: string
  subject: string
  topic: string
  question: string
  options: string[]
  correctAnswer: string
  difficulty: Difficulty
}

const STORAGE_KEYS = {
  bookmarks: 'exampilot-bookmarks',
  recent: 'exampilot-recent',
  practiceStats: 'exampilot-practice-stats',
  mockResults: 'exampilot-mock-results',
}

const subjects: Subject[] = [
  {
    id: 'mathematics',
    level: 'O-Level',
    name: 'Mathematics',
    slug: 'mathematics',
    description: 'Algebra, geometry, statistics and problem solving for everyday exam confidence.',
    category: 'Core',
    topics: 12,
    practiceQuestions: 86,
    revisionResources: 9,
    accent: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'physics',
    level: 'O-Level',
    name: 'Physics',
    slug: 'physics',
    description: 'Motion, electricity, waves and practical investigation in science.',
    category: 'Sciences',
    topics: 10,
    practiceQuestions: 72,
    revisionResources: 8,
    accent: 'from-indigo-500 to-violet-400',
  },
  {
    id: 'biology',
    level: 'O-Level',
    name: 'Biology',
    slug: 'biology',
    description: 'Cells, ecosystems, plants, human biology and life processes.',
    category: 'Sciences',
    topics: 11,
    practiceQuestions: 74,
    revisionResources: 8,
    accent: 'from-emerald-500 to-green-400',
  },
  {
    id: 'english-language',
    level: 'O-Level',
    name: 'English Language',
    slug: 'english-language',
    description: 'Language, comprehension, summary writing and literature support.',
    category: 'Languages',
    topics: 9,
    practiceQuestions: 68,
    revisionResources: 7,
    accent: 'from-rose-500 to-pink-400',
  },
  {
    id: 'accounting',
    level: 'A-Level',
    name: 'Accounting',
    slug: 'accounting',
    description: 'Financial statements, costing and management accounting foundations.',
    category: 'Business',
    topics: 14,
    practiceQuestions: 94,
    revisionResources: 10,
    accent: 'from-amber-500 to-yellow-400',
  },
  {
    id: 'economics',
    level: 'A-Level',
    name: 'Economics',
    slug: 'economics',
    description: 'Microeconomics, macroeconomics and theory application.',
    category: 'Business',
    topics: 12,
    practiceQuestions: 88,
    revisionResources: 9,
    accent: 'from-fuchsia-500 to-purple-400',
  },
  {
    id: 'chemistry',
    level: 'A-Level',
    name: 'Chemistry',
    slug: 'chemistry',
    description: 'Organic chemistry, balancing reactions and core calculations.',
    category: 'Sciences',
    topics: 13,
    practiceQuestions: 90,
    revisionResources: 9,
    accent: 'from-cyan-500 to-sky-400',
  },
  {
    id: 'history',
    level: 'A-Level',
    name: 'History',
    slug: 'history',
    description: 'Essay writing, source evaluation and key historical themes.',
    category: 'Humanities',
    topics: 10,
    practiceQuestions: 78,
    revisionResources: 8,
    accent: 'from-orange-500 to-red-400',
  },
]

const topics: Topic[] = [
  {
    id: 'quadratic-equations',
    subject: 'mathematics',
    level: 'O-Level',
    name: 'Quadratic Equations',
    slug: 'quadratic-equations',
    overview: 'Quadratic equations contain a squared variable and are solved by factorising, completing the square, or using the formula.',
    concepts: ['Standard form', 'Roots', 'Discriminant'],
    definitions: ['A quadratic equation is of the form ax² + bx + c = 0.', 'The roots are values of x that satisfy the equation.'],
    formulas: ['x = (-b ± √(b² - 4ac)) / 2a', 'ax² + bx + c = 0'],
    examples: ['Solve x² - 5x + 6 = 0 → (x - 2)(x - 3) = 0', 'Use the formula when factorisation is not straightforward'],
    mistakes: ['Forgetting to set the equation to zero', 'Mixing up signs in the formula'],
    notes: ['Check the discriminant before solving', 'A quadratic can have 0, 1 or 2 real roots'],
    related: ['Factorisation', 'Graphs', 'Simultaneous equations'],
    questions: [
      {
        id: 'math-q1',
        level: 'O-Level',
        subject: 'mathematics',
        topic: 'Quadratic Equations',
        difficulty: 'Easy',
        type: 'multiple-choice',
        question: 'What are the roots of x² - 9 = 0?',
        options: ['x = 3', 'x = 3 or -3', 'x = -3', 'x = 9'],
        correctAnswer: 'x = 3 or -3',
        explanation: 'The expression factors to (x - 3)(x + 3) = 0.',
      },
      {
        id: 'math-q2',
        level: 'O-Level',
        subject: 'mathematics',
        topic: 'Quadratic Equations',
        difficulty: 'Medium',
        type: 'multiple-choice',
        question: 'Which formula is used to solve ax² + bx + c = 0?',
        options: ['x = (-b ± √(b² - 4ac)) / 2a', 'x = (-b ± b² - 4ac) / 2a', 'x = (b ± √(b² - 4ac)) / a', 'x = (-b ± √(b² + 4ac)) / 2a'],
        correctAnswer: 'x = (-b ± √(b² - 4ac)) / 2a',
        explanation: 'This is the quadratic formula.',
      },
    ],
  },
  {
    id: 'photosynthesis',
    subject: 'biology',
    level: 'O-Level',
    name: 'Photosynthesis',
    slug: 'photosynthesis',
    overview: 'Photosynthesis is how green plants use light to make glucose and release oxygen.',
    concepts: ['Chlorophyll', 'Light energy', 'Glucose'],
    definitions: ['Photosynthesis occurs mainly in leaves.', 'Chlorophyll traps light energy.'],
    formulas: ['Carbon dioxide + water → glucose + oxygen', '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂'],
    examples: ['Plants use glucose for respiration and growth', 'Oxygen is released as a by-product'],
    mistakes: ['Confusing photosynthesis with respiration', 'Forgetting the role of light and chlorophyll'],
    notes: ['Photosynthesis is faster in bright light and warm conditions', 'Minerals are also needed for healthy growth'],
    related: ['Plant nutrition', 'Respiration', 'Transpiration'],
    questions: [
      {
        id: 'bio-q1',
        level: 'O-Level',
        subject: 'biology',
        topic: 'Photosynthesis',
        difficulty: 'Easy',
        type: 'true-false',
        question: 'Chlorophyll absorbs light energy for photosynthesis.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Chlorophyll is the green pigment that captures light energy.',
      },
    ],
  },
  {
    id: 'electricity',
    subject: 'physics',
    level: 'O-Level',
    name: 'Electricity',
    slug: 'electricity',
    overview: 'Electricity is the movement of charge and is described using current, voltage and resistance.',
    concepts: ['Current', 'Voltage', 'Resistance'],
    definitions: ['Current is the rate of flow of charge.', 'Voltage is the push that drives current around a circuit.'],
    formulas: ['V = IR', 'P = IV'],
    examples: ['If resistance rises, current falls when voltage is constant', 'Power is calculated by multiplying voltage and current'],
    mistakes: ['Mixing current and voltage', 'Forgetting to use units correctly'],
    notes: ['Fuses and circuit breakers protect devices', 'Series and parallel circuits behave differently'],
    related: ['Circuits', 'Power', 'Resistance'],
    questions: [
      {
        id: 'phy-q1',
        level: 'O-Level',
        subject: 'physics',
        topic: 'Electricity',
        difficulty: 'Medium',
        type: 'multiple-choice',
        question: 'Which formula matches Ohm’s law?',
        options: ['V = I / R', 'I = V / R', 'R = V + I', 'V = I²R'],
        correctAnswer: 'I = V / R',
        explanation: 'Ohm’s law states that current equals voltage divided by resistance.',
      },
    ],
  },
  {
    id: 'financial-statements',
    subject: 'accounting',
    level: 'A-Level',
    name: 'Financial Statements',
    slug: 'financial-statements',
    overview: 'Financial statements summarise the performance and position of a business.',
    concepts: ['Profit', 'Assets', 'Liabilities'],
    definitions: ['The income statement shows profit or loss over a period.', 'The statement of financial position shows assets and liabilities.'],
    formulas: ['Profit = Revenue - Expenses', 'Assets = Liabilities + Equity'],
    examples: ['Gross profit is sales less cost of sales', 'The balance sheet must balance total assets with liabilities and capital'],
    mistakes: ['Confusing revenue and cash inflow', 'Forgetting that balance sheet totals must match'],
    notes: ['Accruals matter in accounting', 'Financial statements are used by decision makers'],
    related: ['Costing', 'Cash flow', 'Budgets'],
    questions: [
      {
        id: 'acc-q1',
        level: 'A-Level',
        subject: 'accounting',
        topic: 'Financial Statements',
        difficulty: 'Medium',
        type: 'multiple-choice',
        question: 'Which accounting equation is correct?',
        options: ['Assets = Liabilities + Equity', 'Assets = Revenue - Expenses', 'Profit = Assets + Liabilities', 'Cash = Equity - Debt'],
        correctAnswer: 'Assets = Liabilities + Equity',
        explanation: 'This relationship underpins the statement of financial position.',
      },
    ],
  },
  {
    id: 'macroeconomics',
    subject: 'economics',
    level: 'A-Level',
    name: 'Macroeconomics',
    slug: 'macroeconomics',
    overview: 'Macroeconomics looks at national output, employment, inflation and government policy.',
    concepts: ['GDP', 'Inflation', 'Unemployment'],
    definitions: ['GDP is the total value of goods and services produced in a country.', 'Inflation is a sustained rise in the general price level.'],
    formulas: ['GDP = C + I + G + (X - M)', 'Inflation rate = ((current CPI - previous CPI) / previous CPI) × 100'],
    examples: ['Government spending can raise aggregate demand', 'High inflation can reduce consumers’ purchasing power'],
    mistakes: ['Confusing inflation with a one-off price rise', 'Assuming all growth is useful'],
    notes: ['Policy decisions often involve trade-offs', 'Recession and unemployment are linked'],
    related: ['Fiscal policy', 'Monetary policy', 'Microeconomics'],
    questions: [
      {
        id: 'eco-q1',
        level: 'A-Level',
        subject: 'economics',
        topic: 'Macroeconomics',
        difficulty: 'Easy',
        type: 'true-false',
        question: 'Inflation means a general rise in the price level.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Inflation is an increase in the average level of prices over time.',
      },
    ],
  },
]

const pastPapers: PastPaper[] = [
  { id: 'op-1', title: 'O-Level Mathematics Paper 1 Sample', level: 'O-Level', subject: 'Mathematics', year: 2024, paper: 'Paper 1', link: '#', demo: true },
  { id: 'op-2', title: 'O-Level Physics Paper 2 Sample', level: 'O-Level', subject: 'Physics', year: 2023, paper: 'Paper 2', link: '#', demo: true },
  { id: 'ap-1', title: 'A-Level Accounting Paper 1 Sample', level: 'A-Level', subject: 'Accounting', year: 2024, paper: 'Paper 1', link: '#', demo: true },
  { id: 'ap-2', title: 'A-Level Chemistry Paper 3 Sample', level: 'A-Level', subject: 'Chemistry', year: 2022, paper: 'Paper 3', link: '#', demo: true },
  { id: 'op-3', title: 'O-Level Biology Paper 1 Sample', level: 'O-Level', subject: 'Biology', year: 2021, paper: 'Paper 1', link: '#', demo: true },
  { id: 'ap-3', title: 'A-Level Economics Paper 2 Sample', level: 'A-Level', subject: 'Economics', year: 2023, paper: 'Paper 2', link: '#', demo: true },
]

const mockExamBank: MockQuestion[] = [
  { id: 'm-1', subject: 'mathematics', topic: 'Quadratic Equations', question: 'Solve x² - 7x + 12 = 0.', options: ['x = 3 or 4', 'x = 2 or 6', 'x = -3 or -4', 'x = 1 or 12'], correctAnswer: 'x = 3 or 4', difficulty: 'Easy' },
  { id: 'm-2', subject: 'physics', topic: 'Electricity', question: 'Which quantity is measured in amperes?', options: ['Voltage', 'Resistance', 'Current', 'Power'], correctAnswer: 'Current', difficulty: 'Easy' },
  { id: 'm-3', subject: 'biology', topic: 'Photosynthesis', question: 'The green pigment that captures light energy is called:', options: ['Nucleus', 'Chlorophyll', 'Cell wall', 'Stoma'], correctAnswer: 'Chlorophyll', difficulty: 'Easy' },
  { id: 'm-4', subject: 'accounting', topic: 'Financial Statements', question: 'Assets - Liabilities = ?', options: ['Revenue', 'Equity', 'Expenses', 'Cash'], correctAnswer: 'Equity', difficulty: 'Medium' },
  { id: 'm-5', subject: 'economics', topic: 'Macroeconomics', question: 'Inflation usually means:', options: ['Lower cost of living', 'Rising general prices', 'Falling employment', 'Higher wages only'], correctAnswer: 'Rising general prices', difficulty: 'Medium' },
  { id: 'm-6', subject: 'chemistry', topic: 'Acids and Bases', question: 'A substance that turns litmus red is usually:', options: ['Acidic', 'Basic', 'Neutral', 'Metallic'], correctAnswer: 'Acidic', difficulty: 'Easy' },
]

const allQuestions = topics.flatMap((topic) => topic.questions)

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <AppShell />
    </div>
  )
}

function AppShell() {
  const location = useLocation()

  useEffect(() => {
    const routeTitles: Record<string, string> = {
      '/': 'ExamPilot | ZIMSEC O-Level & A-Level Exam Preparation',
      '/o-level': 'O-Level Preparation | ExamPilot',
      '/a-level': 'A-Level Preparation | ExamPilot',
      '/subjects': 'Subjects | ExamPilot',
      '/past-papers': 'Past Papers | ExamPilot',
      '/practice': 'Practice Questions | ExamPilot',
      '/mock-exams': 'Mock Exams | ExamPilot',
      '/study-tools': 'Study Tools | ExamPilot',
      '/about': 'About ExamPilot',
      '/privacy': 'Privacy | ExamPilot',
      '/disclaimer': 'Disclaimer | ExamPilot',
      '/dashboard': 'Your ExamPilot Dashboard',
      '/search': 'Search | ExamPilot',
      '/ai-assistant': 'AI Study Assistant | ExamPilot',
    }
    document.title = routeTitles[location.pathname] ?? 'ExamPilot'
  }, [location.pathname])

  return (
    <>
      <Navbar />
      <main className="pb-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/o-level" element={<LevelPage level="O-Level" />} />
          <Route path="/a-level" element={<LevelPage level="A-Level" />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:level" element={<LevelSubjectsPage />} />
          <Route path="/subjects/:level/:subject" element={<SubjectDetailPage />} />
          <Route path="/revision" element={<RevisionPage />} />
          <Route path="/revision/:subject/:topic" element={<RevisionTopicPage />} />
          <Route path="/past-papers" element={<PastPapersPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/mock-exams" element={<MockExamPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/study-tools" element={<StudyToolsPage />} />
          <Route path="/ai-assistant" element={<AIStudyAssistantPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'O-Level', to: '/o-level' },
    { label: 'A-Level', to: '/a-level' },
    { label: 'Subjects', to: '/subjects' },
    { label: 'Past Papers', to: '/past-papers' },
    { label: 'Practice', to: '/practice' },
    { label: 'Mock Exams', to: '/mock-exams' },
    { label: 'Study Tools', to: '/study-tools' },
    { label: 'About', to: '/about' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <div>
            <div className="text-lg font-extrabold tracking-tight text-slate-900">ExamPilot</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Navigate Your Way</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-navy-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/search" className="secondary-btn !px-4 !py-2.5">
            <Search className="mr-2 h-4 w-4" /> Search
          </Link>
          <Link to="/subjects" className="primary-btn">Start Preparing</Link>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 lg:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-shell space-y-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `block rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-navy-50 text-navy-700' : 'text-slate-700 hover:bg-slate-50'}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-3 flex gap-3 pt-2">
              <Link to="/search" className="secondary-btn flex-1" onClick={() => setIsOpen(false)}>Search</Link>
              <Link to="/subjects" className="primary-btn flex-1" onClick={() => setIsOpen(false)}>Start Preparing</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function Logo() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 via-navy-700 to-electric-500 shadow-lg shadow-blue-200">
      <div className="relative">
        <GraduationCap className="h-5 w-5 text-white" />
        <Compass className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-white p-0.5 text-navy-700" />
      </div>
    </div>
  )
}

function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_35%)]" />
        <div className="container-shell relative grid gap-10 py-16 md:grid-cols-2 md:items-center lg:py-24">
          <div>
            <span className="chip mb-5 bg-navy-50 text-navy-700 ring-1 ring-navy-200">Independent ZIMSEC exam prep platform</span>
            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">Your ZIMSEC Exam Success Starts Here.</h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">Prepare smarter with syllabus-based revision, practice questions, past-paper resources, mock examinations and powerful study tools for Zimbabwean O-Level and A-Level candidates.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/subjects" className="primary-btn">Start Preparing</Link>
              <Link to="/subjects" className="secondary-btn">Explore Subjects</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600">
              <div><span className="font-bold text-slate-900">O-Level</span> support</div>
              <div><span className="font-bold text-slate-900">A-Level</span> revision</div>
              <div><span className="font-bold text-slate-900">Guest</span> ready</div>
            </div>
          </div>

          <div className="section-card overflow-hidden border-navy-100 bg-gradient-to-br from-navy-900 via-slate-800 to-slate-900 p-6 text-white shadow-2xl shadow-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Study dashboard</p>
                <h2 className="mt-2 text-2xl font-bold">ExamPilot Progress</h2>
              </div>
              <div className="rounded-full bg-white/10 p-3"><TrendingUp className="h-6 w-6 text-electric-300" /></div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <StatCard label="Topics revised" value="24" accent="bg-blue-500/20 text-blue-200" />
              <StatCard label="Practice score" value="82%" accent="bg-emerald-500/20 text-emerald-200" />
              <StatCard label="Study streak" value="6 days" accent="bg-amber-500/20 text-amber-200" />
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between text-sm text-slate-200"><span>English Language revision</span><span>72%</span></div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-electric-400 to-cyan-300" />
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Next focus</p>
                <p className="mt-2 text-lg font-semibold">Quadratic Equations</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Mock exam</p>
                <p className="mt-2 text-lg font-semibold">Physics · 35 mins</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <LevelPromoCard level="O-Level" description="Prepare for your ZIMSEC O-Level examinations with structured revision, practice and mock examinations." features={['Subjects', 'Syllabus topics', 'Revision materials', 'Practice questions', 'Past-paper resources', 'Mock examinations']} buttonLabel="Explore O-Level" to="/o-level" />
          <LevelPromoCard level="A-Level" description="Prepare for your ZIMSEC A-Level examinations with focused revision and examination practice." features={['Subjects', 'Syllabus topics', 'Revision materials', 'Practice questions', 'Past-paper resources', 'Mock examinations']} buttonLabel="Explore A-Level" to="/a-level" />
        </div>
      </section>

      <section className="container-shell py-12">
        <SectionHeading eyebrow="How ExamPilot works" title="A simple study system for real results" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { step: '01', title: 'Choose Your Level', description: 'Select O-Level or A-Level based on your exam needs.', icon: Target },
            { step: '02', title: 'Choose Your Subject', description: 'Pick the subject you want to master this week.', icon: BookOpen },
            { step: '03', title: 'Learn & Practise', description: 'Review concepts, notes and answer practice questions.', icon: Sparkles },
            { step: '04', title: 'Test Yourself', description: 'Use mock exams to measure your readiness.', icon: Trophy },
          ].map(({ step, title, description, icon: Icon }) => (
            <div key={step} className="section-card p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50 text-navy-700"><Icon className="h-5 w-5" /></div>
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-electric-600">{step}</div>
              <h3 className="mt-3 text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function LevelPage({ level }: { level: Level }) {
  const filtered = subjects.filter((subject) => subject.level === level)

  return (
    <div className="container-shell py-12">
      <div className="mb-8 flex items-center gap-3 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-700">{level}</span>
      </div>

      <div className="section-card overflow-hidden bg-gradient-to-r from-navy-900 via-navy-800 to-electric-700 p-8 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-200">{level} preparation</p>
        <h1 className="mt-3 text-4xl font-black">{level} Learning Path</h1>
        <p className="mt-4 max-w-2xl text-blue-100">Build strong understanding with revision, focused practice and mock exams tailored for Zimbabwean students.</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((subject) => <SubjectCard key={subject.id} subject={subject} />)}
      </div>
    </div>
  )
}

function SubjectsPage() {
  const [selectedLevel, setSelectedLevel] = useState<Level>('O-Level')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const categories = ['All', ...new Set(subjects.map((subject) => subject.category))]
  const filtered = subjects.filter((subject) => {
    const matchesLevel = subject.level === selectedLevel
    const matchesSearch = subject.name.toLowerCase().includes(search.toLowerCase()) || subject.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || subject.category === category
    return matchesLevel && matchesSearch && matchesCategory
  })

  return (
    <div className="container-shell py-12">
      <div className="mb-8 flex items-center gap-3 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-700">Subjects</span>
      </div>

      <SectionHeading eyebrow="Subjects" title="Choose a subject to begin" />

      <div className="mt-8 section-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 rounded-full bg-slate-100 p-1">
            {levels.map((level) => (
              <button
                key={level}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedLevel === level ? 'bg-white text-navy-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                onClick={() => setSelectedLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-navy-400 focus:outline-none sm:w-64" placeholder="Search subjects" />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-full border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-navy-400 focus:outline-none">
              {categories.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length > 0 ? filtered.map((subject) => <SubjectCard key={subject.id} subject={subject} />) : (
          <div className="section-card p-6 text-center md:col-span-2 xl:col-span-3">
            <p className="text-lg font-semibold text-slate-900">No subjects match your filters.</p>
            <p className="mt-2 text-slate-600">Try another search keyword or switch level.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function LevelSubjectsPage() {
  const { level } = useParams()
  const resolvedLevel = level === 'o-level' ? 'O-Level' : 'A-Level'
  return <LevelPage level={resolvedLevel as Level} />
}

function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <div className="section-card p-6">
      <div className={`mb-4 h-2 w-full rounded-full bg-gradient-to-r ${subject.accent}`} />
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{subject.level}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{subject.name}</h3>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{subject.category}</div>
      </div>
      <p className="mt-4 text-slate-600">{subject.description}</p>
      <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-slate-600">
        <div className="rounded-2xl bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Topics</div><div className="mt-1 font-bold text-slate-900">{subject.topics}</div></div>
        <div className="rounded-2xl bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Practice</div><div className="mt-1 font-bold text-slate-900">{subject.practiceQuestions}</div></div>
        <div className="rounded-2xl bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Resources</div><div className="mt-1 font-bold text-slate-900">{subject.revisionResources}</div></div>
      </div>
      <Link to={`/subjects/${subject.level.toLowerCase().replace(/\s+/g, '-')}/${subject.slug}`} className="primary-btn mt-6 w-full">Open Subject <ArrowRight className="ml-2 h-4 w-4" /></Link>
    </div>
  )
}

function SubjectDetailPage() {
  const { level, subject } = useParams()
  const currentLevel = level === 'o-level' ? 'O-Level' : 'A-Level'
  const targetSubject = subjects.find((item) => item.level === currentLevel && item.slug === subject)

  if (!targetSubject) return <NotFoundPage />

  const relatedTopicList = topics.filter((topic) => topic.subject === targetSubject.id)

  return (
    <div className="container-shell py-12">
      <div className="mb-8 flex items-center gap-3 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/subjects" className="hover:text-slate-800">Subjects</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-700">{targetSubject.name}</span>
      </div>

      <div className="section-card overflow-hidden bg-gradient-to-r from-slate-900 via-navy-800 to-navy-700 p-8 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-200">{targetSubject.level}</p>
        <h1 className="mt-3 text-4xl font-black">{targetSubject.name}</h1>
        <p className="mt-4 max-w-3xl text-blue-100">{targetSubject.description}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="section-card p-6">
            <h2 className="text-2xl font-bold text-slate-900">Topics in this subject</h2>
            <div className="mt-5 space-y-3">
              {relatedTopicList.map((item) => (
                <Link key={item.id} to={`/revision/${targetSubject.slug}/${item.slug}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-navy-200 hover:bg-white">
                  <div>
                    <div className="font-semibold text-slate-900">{item.name}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.overview}</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-500" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="section-card p-6">
            <h3 className="text-xl font-bold text-slate-900">Study snapshot</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between"><span>Topics</span><span className="font-bold text-slate-900">{targetSubject.topics}</span></div>
              <div className="flex items-center justify-between"><span>Practice questions</span><span className="font-bold text-slate-900">{targetSubject.practiceQuestions}</span></div>
              <div className="flex items-center justify-between"><span>Revision resources</span><span className="font-bold text-slate-900">{targetSubject.revisionResources}</span></div>
            </div>
            <Link to="/practice" className="primary-btn mt-5 w-full">Practice questions</Link>
          </div>
          <div className="section-card p-6">
            <h3 className="text-xl font-bold text-slate-900">Demo notice</h3>
            <p className="mt-2 text-sm text-slate-600">ExamPilot-created content should be checked against trusted learning material and relevant syllabus guidance.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function RevisionPage() {
  return (
    <div className="container-shell py-12">
      <SectionHeading eyebrow="Revision system" title="Level → Subject → Topic → Subtopic → Revision Material → Practice" />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {topics.map((topic) => (
          <div key={topic.id} className="section-card p-6">
            <div className="flex items-center justify-between">
              <span className="chip">{topic.level}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{topic.subject}</span>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-slate-900">{topic.name}</h3>
            <p className="mt-2 text-slate-600">{topic.overview}</p>
            <Link to={`/revision/${topic.subject}/${topic.slug}`} className="secondary-btn mt-5">Open revision notes</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

function RevisionTopicPage() {
  const { subject, topic } = useParams()
  const selectedTopic = topics.find((item) => item.subject === subject && item.slug === topic)

  if (!selectedTopic) return <NotFoundPage />

  const [bookmarks, setBookmarks] = useState<string[]>([])

  useEffect(() => {
    setBookmarks(readJSON<string[]>(STORAGE_KEYS.bookmarks, []))
  }, [])

  const toggleBookmark = () => {
    const next = bookmarks.includes(selectedTopic.id) ? bookmarks.filter((id) => id !== selectedTopic.id) : [...bookmarks, selectedTopic.id]
    setBookmarks(next)
    saveJSON(STORAGE_KEYS.bookmarks, next)
  }

  return (
    <div className="container-shell py-12">
      <div className="mb-8 flex items-center gap-3 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/revision" className="hover:text-slate-800">Revision</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-700">{selectedTopic.name}</span>
      </div>

      <div className="section-card p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-electric-600">{selectedTopic.level}</p>
            <h1 className="mt-2 text-4xl font-black text-slate-900">{selectedTopic.name}</h1>
          </div>
          <button className="secondary-btn" onClick={toggleBookmark}>{bookmarks.includes(selectedTopic.id) ? 'Saved' : 'Bookmark topic'}</button>
        </div>

        <p className="mt-5 max-w-3xl text-slate-600">{selectedTopic.overview}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <InfoPanel title="Key concepts" items={selectedTopic.concepts} />
          <InfoPanel title="Definitions" items={selectedTopic.definitions} />
          <InfoPanel title="Important formulas" items={selectedTopic.formulas} />
          <InfoPanel title="Worked examples" items={selectedTopic.examples} />
          <InfoPanel title="Common mistakes" items={selectedTopic.mistakes} />
          <InfoPanel title="Quick revision notes" items={selectedTopic.notes} />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900">Practice questions</h2>
          <div className="mt-4 space-y-3">
            {selectedTopic.questions.map((question) => (
              <div key={question.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="chip">{question.type}</span>
                  <span className="text-sm font-medium text-slate-600">{question.difficulty}</span>
                </div>
                <p className="mt-3 text-slate-800">{question.question}</p>
                <p className="mt-2 text-sm font-medium text-electric-600">Answer: {question.correctAnswer}</p>
                <p className="mt-2 text-sm text-slate-600">{question.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900">Related topics</h2>
          <div className="mt-4 flex flex-wrap gap-2">{selectedTopic.related.map((title) => <span key={title} className="chip">{title}</span>)}</div>
        </div>
      </div>
    </div>
  )
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <ul className="mt-4 space-y-3 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric-600" /><span>{item}</span></li>
        ))}
      </ul>
    </div>
  )
}

function PastPapersPage() {
  const [level, setLevel] = useState<Level>('O-Level')
  const [subject, setSubject] = useState('All')
  const [year, setYear] = useState('All')
  const [paper, setPaper] = useState('All')
  const [search, setSearch] = useState('')

  const subjectOptions = ['All', ...new Set(subjects.filter((item) => item.level === level).map((item) => item.name))]
  const filtered = pastPapers.filter((entry) => {
    const matchesLevel = entry.level === level
    const matchesSubject = subject === 'All' || entry.subject === subject
    const matchesYear = year === 'All' || String(entry.year) === year
    const matchesPaper = paper === 'All' || entry.paper === paper
    const matchesSearch = entry.title.toLowerCase().includes(search.toLowerCase())
    return matchesLevel && matchesSubject && matchesYear && matchesPaper && matchesSearch
  })

  return (
    <div className="container-shell py-12">
      <SectionHeading eyebrow="Past papers" title="Demo paper library" />
      <div className="mt-6 section-card p-5">
        <div className="grid gap-4 md:grid-cols-5">
          <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200">
            {levels.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200">
            {subjectOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200">
            <option value="All">Year</option>
            {['2021', '2022', '2023', '2024'].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={paper} onChange={(e) => setPaper(e.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200">
            <option value="All">Paper</option>
            {['Paper 1', 'Paper 2', 'Paper 3'].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search papers" className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200" />
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Demo/sample resources are displayed until legitimate materials are supplied. Examination materials may be copyrighted and should only be distributed where legally permitted.
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((paperItem) => (
          <div key={paperItem.id} className="section-card p-6">
            <div className="flex items-center justify-between">
              <span className="chip">{paperItem.level}</span>
              {paperItem.demo && <span className="chip bg-amber-100 text-amber-800">Demo</span>}
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">{paperItem.title}</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between"><span>Subject</span><span className="font-medium text-slate-900">{paperItem.subject}</span></div>
              <div className="flex justify-between"><span>Year</span><span className="font-medium text-slate-900">{paperItem.year}</span></div>
              <div className="flex justify-between"><span>Paper</span><span className="font-medium text-slate-900">{paperItem.paper}</span></div>
            </div>
            <div className="mt-5 flex gap-3">
              <a href={paperItem.link} className="secondary-btn flex-1">View</a>
              <button className="primary-btn flex-1">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PracticePage() {
  const [level, setLevel] = useState<Level>('O-Level')
  const [subjectId, setSubjectId] = useState('mathematics')
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [attempted, setAttempted] = useState(0)

  const subjectChoices = subjects.filter((item) => item.level === level)
  const questions = allQuestions.filter((question) => question.level === level && question.subject === subjectId && question.difficulty === difficulty)
  const currentQuestion = questions[currentIndex] ?? null

  useEffect(() => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }, [level, subjectId, difficulty])

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return
    setSelectedAnswer(answer)
    setShowFeedback(true)
    setAttempted((prev) => prev + 1)
    if (answer === currentQuestion.correctAnswer) {
      setCorrectCount((prev) => prev + 1)
    }
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setShowFeedback(false)
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  useEffect(() => {
    saveJSON(STORAGE_KEYS.practiceStats, {
      level,
      subjectId,
      totalCorrect: correctCount,
      totalAttempted: attempted,
      updatedAt: new Date().toISOString(),
    })
  }, [attempted, correctCount, level, subjectId])

  return (
    <div className="container-shell py-12">
      <SectionHeading eyebrow="Practice questions" title="Build confidence with topic-based practice" />
      <div className="mt-8 section-card p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm">
            {levels.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm">
            {subjectChoices.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm">
            {difficultyLevels.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">Progress: {Math.min(currentIndex + 1, questions.length || 0)} / {questions.length || 0}</div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="section-card p-6">
          {currentQuestion ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="chip">{currentQuestion.type}</div>
                <div className="text-sm font-medium text-slate-500">{currentIndex + 1} / {questions.length}</div>
              </div>
              <h3 className="mt-5 text-2xl font-bold text-slate-900">{currentQuestion.question}</h3>
              <div className="mt-5 space-y-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${selectedAnswer === option ? (option === currentQuestion.correctAnswer ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-rose-300 bg-rose-50 text-rose-900') : 'border-slate-200 bg-white text-slate-700 hover:border-navy-300 hover:bg-slate-50'}`}
                    disabled={showFeedback}
                    onClick={() => handleAnswer(option)}
                  >
                    <span>{option}</span>
                    {showFeedback && option === currentQuestion.correctAnswer && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                  </button>
                ))}
              </div>

              {showFeedback && (
                <div className={`mt-6 rounded-2xl border p-4 ${selectedAnswer === currentQuestion.correctAnswer ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-rose-200 bg-rose-50 text-rose-900'}`}>
                  <div className="font-semibold">{selectedAnswer === currentQuestion.correctAnswer ? 'Correct answer' : 'Incorrect answer'}</div>
                  <p className="mt-2 text-sm">{currentQuestion.explanation}</p>
                </div>
              )}

              <div className="mt-6 flex justify-between gap-3">
                <button className="secondary-btn" onClick={() => { setCurrentIndex(0); setSelectedAnswer(null); setShowFeedback(false) }}>Reset</button>
                <button className="primary-btn" onClick={nextQuestion}>{currentIndex < questions.length - 1 ? 'Next question' : 'Finish'}</button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-xl font-bold">No questions available</p>
              <p className="mt-2 text-slate-600">Try a different subject or difficulty level.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="section-card p-6">
            <h3 className="text-xl font-bold text-slate-900">Progress</h3>
            <div className="mt-5">
              <div className="flex justify-between text-sm text-slate-600"><span>Correct</span><span>{correctCount}</span></div>
              <div className="mt-2 h-2.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${attempted ? (correctCount / attempted) * 100 : 0}%` }} /></div>
            </div>
            <div className="mt-4 text-sm text-slate-600">Practice stats are stored locally on this device and not synced between devices.</div>
          </div>

          <div className="section-card p-6">
            <h3 className="text-xl font-bold text-slate-900">Local study data</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-3"><BookOpen className="h-4 w-4 text-electric-600" /> Improvement tracking</li>
              <li className="flex items-center gap-3"><Flame className="h-4 w-4 text-orange-500" /> Study streak</li>
              <li className="flex items-center gap-3"><Star className="h-4 w-4 text-amber-500" /> Bookmarks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function MockExamPage() {
  const [level, setLevel] = useState<Level>('O-Level')
  const [subjectId, setSubjectId] = useState('mathematics')
  const [paper, setPaper] = useState('Paper 1')
  const [duration, setDuration] = useState(35)
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const subjectChoices = subjects.filter((item) => item.level === level)
  const examQuestions = mockExamBank.filter((question) => question.subject === subjectId).slice(0, 5)

  useEffect(() => {
    if (!started || submitted) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setSubmitted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [started, submitted])

  const handleSubmit = () => {
    setSubmitted(true)
    const result = {
      level,
      subjectId,
      paper,
      duration,
      score: calculateMockScore(examQuestions, answers),
      submittedAt: new Date().toISOString(),
    }
    const prev = readJSON<any[]>(STORAGE_KEYS.mockResults, [])
    saveJSON(STORAGE_KEYS.mockResults, [result, ...prev].slice(0, 6))
  }

  const selectAnswer = (questionId: string, option: string) => setAnswers((prev) => ({ ...prev, [questionId]: option }))
  const score = submitted ? calculateMockScore(examQuestions, answers) : 0
  const unansweredCount = examQuestions.filter((question) => !answers[question.id]).length

  return (
    <div className="container-shell py-12">
      <SectionHeading eyebrow="Mock examinations" title="Practice examinations designed for student revision" />
      <div className="mt-8 section-card p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm">
            {levels.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm">
            {subjectChoices.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select value={paper} onChange={(e) => setPaper(e.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm">
            {['Paper 1', 'Paper 2', 'Paper 3'].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm">
            {[20, 35, 45, 60].map((item) => <option key={item} value={item}>{item} min</option>)}
          </select>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">ExamPilot mock examinations are clearly marked as practice examinations and are not official ZIMSEC examinations.</div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="section-card p-6">
          {!started && !submitted ? (
            <div className="space-y-5">
              <h3 className="text-2xl font-bold text-slate-900">Ready to begin?</h3>
              <p className="text-slate-600">This mock exam contains {examQuestions.length} questions and a {duration}-minute timer. You can complete it in guest mode and review performance locally.</p>
              <button className="primary-btn" onClick={() => { setStarted(true); setTimeLeft(duration * 60) }}>Start examination</button>
            </div>
          ) : (
            <div className="space-y-6">
              {examQuestions.map((question, index) => (
                <div key={question.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Question {index + 1}</p>
                    <span className="chip">{question.difficulty}</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-slate-800">{question.question}</p>
                  <div className="mt-4 space-y-2">
                    {question.options.map((option) => (
                      <button key={option} className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left ${answers[question.id] === option ? 'border-navy-300 bg-white text-slate-900' : 'border-slate-200 bg-white text-slate-700'}`} onClick={() => selectAnswer(question.id, option)} disabled={submitted}>
                        <span>{option}</span>
                        {answers[question.id] === option && <CheckCircle2 className="h-4 w-4 text-electric-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {!submitted && <button className="primary-btn" onClick={handleSubmit}>Submit examination</button>}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="section-card p-6">
            <h3 className="text-xl font-bold text-slate-900">Timer</h3>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-100 p-4 text-2xl font-black text-slate-900"><Clock3 className="h-6 w-6 text-electric-600" /> {formatTime(timeLeft)}</div>
            <div className="mt-4 text-sm text-slate-600">Questions answered: {Object.keys(answers).length}</div>
          </div>

          <div className="section-card p-6">
            <h3 className="text-xl font-bold text-slate-900">Results</h3>
            {submitted ? (
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between"><span>Total score</span><span className="font-bold text-slate-900">{score}</span></div>
                <div className="flex justify-between"><span>Percentage</span><span className="font-bold text-slate-900">{Math.round((score / examQuestions.length) * 100)}%</span></div>
                <div className="flex justify-between"><span>Correct</span><span className="font-bold text-slate-900">{countCorrect(examQuestions, answers)}</span></div>
                <div className="flex justify-between"><span>Incorrect</span><span className="font-bold text-slate-900">{Math.max(examQuestions.length - countCorrect(examQuestions, answers) - unansweredCount, 0)}</span></div>
                <div className="flex justify-between"><span>Unanswered</span><span className="font-bold text-slate-900">{unansweredCount}</span></div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">Submit your work to unlock results and recommended revision areas.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function DashboardPage() {
  const [progress, setProgress] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    setProgress(readJSON(STORAGE_KEYS.practiceStats, null))
    setBookmarks(readJSON(STORAGE_KEYS.bookmarks, []))
    setRecent(readJSON(STORAGE_KEYS.recent, []))
  }, [])

  const resetLocalProgress = () => {
    localStorage.clear()
    setProgress(null)
    setBookmarks([])
    setRecent([])
  }

  if (!progress && bookmarks.length === 0 && recent.length === 0) {
    return (
      <div className="container-shell py-16">
        <div className="section-card p-10 text-center">
          <h1 className="text-4xl font-black text-slate-900">Your ExamPilot Dashboard</h1>
          <p className="mt-4 text-slate-600">Start your preparation journey by exploring subjects and saving topics you want to revisit.</p>
          <Link to="/subjects" className="primary-btn mt-6">Explore Subjects</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-shell py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-black text-slate-900">Your ExamPilot Dashboard</h1>
        <button className="secondary-btn" onClick={resetLocalProgress}>Reset Local Progress</button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="Continue studying" value="Mathematics" icon={<BookOpen className="h-5 w-5" />} />
        <MiniStat label="Practice score" value={progress ? `${Math.round((progress.totalCorrect / Math.max(progress.totalAttempted, 1)) * 100)}%` : '0%'} icon={<Target className="h-5 w-5" />} />
        <MiniStat label="Study streak" value="6 days" icon={<Flame className="h-5 w-5" />} />
        <MiniStat label="Bookmarks" value={String(bookmarks.length)} icon={<Star className="h-5 w-5" />} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="section-card p-6">
          <h2 className="text-2xl font-bold text-slate-900">Recently viewed topics</h2>
          <div className="mt-5 space-y-3">
            {recent.length ? recent.map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-3 text-slate-700">{item}</div>) : <div className="text-slate-500">No recent items yet.</div>}
          </div>
        </div>

        <div className="section-card p-6">
          <h2 className="text-2xl font-bold text-slate-900">Recommended revision</h2>
          <div className="mt-5 space-y-3">
            {['Quadratic Equations', 'Photosynthesis', 'Electricity'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-slate-700"><span>{item}</span><ArrowRight className="h-4 w-4" /></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StudyToolsPage() {
  const [percentage, setPercentage] = useState(78)
  const [seconds, setSeconds] = useState(25 * 60)
  const [scientificInput, setScientificInput] = useState('42')

  const grade = useMemo(() => {
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B'
    if (percentage >= 60) return 'C'
    if (percentage >= 50) return 'D'
    return 'F'
  }, [percentage])

  const squareResult = useMemo(() => {
    const value = Number(scientificInput)
    return Number.isFinite(value) ? Number(value * value).toFixed(2) : 'invalid'
  }, [scientificInput])

  useEffect(() => {
    const timer = setInterval(() => setSeconds((prev) => (prev > 0 ? prev - 1 : 0)), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="container-shell py-12">
      <SectionHeading eyebrow="Study tools" title="Useful helper tools for exam preparation" />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ToolCard title="Grade Calculator" icon={<Calculator className="h-5 w-5" />}>
          <input type="number" value={percentage} onChange={(e) => setPercentage(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" />
          <div className="mt-3 text-sm text-slate-600">Score: {percentage}% &nbsp; Grade: <span className="font-bold text-slate-900">{grade}</span></div>
        </ToolCard>

        <ToolCard title="Scientific Calculator" icon={<Calculator className="h-5 w-5" />}>
          <input value={scientificInput} onChange={(e) => setScientificInput(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" />
          <div className="mt-3 text-sm text-slate-600">Square: <span className="font-bold text-slate-900">{squareResult}</span></div>
        </ToolCard>

        <ToolCard title="Study Timer" icon={<Clock3 className="h-5 w-5" />}>
          <div className="text-3xl font-black text-slate-900">{formatTime(seconds)}</div>
          <div className="mt-3 flex gap-2">
            <button className="secondary-btn flex-1" onClick={() => setSeconds(25 * 60)}>Pomodoro</button>
            <button className="secondary-btn flex-1" onClick={() => setSeconds(5 * 60)}>Break</button>
          </div>
        </ToolCard>

        <ToolCard title="Exam Countdown" icon={<MoonStar className="h-5 w-5" />}>
          <CountdownBox targetDate="2026-11-15T00:00:00" />
        </ToolCard>

        <ToolCard title="Percentage Calculator" icon={<Target className="h-5 w-5" />}>
          <div className="text-sm text-slate-600">45 out of 60 = <span className="font-bold text-slate-900">75%</span></div>
        </ToolCard>

        <ToolCard title="Fraction Calculator" icon={<Sparkles className="h-5 w-5" />}>
          <div className="text-sm text-slate-600">1/2 + 1/4 = <span className="font-bold text-slate-900">3/4</span></div>
        </ToolCard>
      </div>
    </div>
  )
}

function AIStudyAssistantPage() {
  const suggestions = ['Explain quadratic equations.', 'Give me five O-Level questions on acids and bases.', 'Explain photosynthesis.', 'Help me revise electricity.', 'Create a revision quiz on organic chemistry.']

  return (
    <div className="container-shell py-12">
      <SectionHeading eyebrow="AI study assistant" title="Your future-ready study companion" />
      <div className="mt-8 section-card overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap gap-2">{suggestions.map((item) => <button key={item} className="chip hover:bg-white">{item}</button>)}</div>
        </div>
        <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-r border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-bold text-slate-900">Study prompts</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-white p-3">Explain a concept in simple steps.</div>
              <div className="rounded-2xl bg-white p-3">Generate a quick quiz.</div>
              <div className="rounded-2xl bg-white p-3">Summarise revision notes.</div>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-electric-100 text-electric-700"><MessageSquareText className="h-5 w-5" /></div>
              <div>
                <div className="font-semibold text-slate-900">ExamPilot Assistant</div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Demo mode</div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-gradient-to-br from-navy-900 to-slate-800 p-5 text-white">
              <p className="text-sm uppercase tracking-[0.2em] text-blue-200">Example response</p>
              <p className="mt-4 text-lg font-medium">Quadratic equations are equations in which the highest power of the variable is two. They are often solved by factorising or by using the quadratic formula.</p>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">AI-generated educational information should be checked against trusted learning materials and the relevant syllabus. ExamPilot does not provide official ZIMSEC answers or official examination content.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="container-shell py-12">
      <SectionHeading eyebrow="About ExamPilot" title="Independent educational support for Zimbabwean students" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="section-card p-8">
          <p className="text-slate-700">ExamPilot is an independent educational platform created to help Zimbabwean O-Level and A-Level candidates organize and improve their examination preparation.</p>
          <p className="mt-4 text-slate-700">The platform brings revision, practice, study tools and mock examinations together in one place.</p>
          <p className="mt-4 text-slate-700">ExamPilot is not the official ZIMSEC website and is not affiliated with ZIMSEC unless an official relationship is established.</p>
        </div>

        <div className="section-card p-8">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-white"><GraduationCap className="h-8 w-8" /></div>
          <h2 className="text-2xl font-bold text-slate-900">Meet the Creator</h2>
          <p className="mt-4 text-slate-700">Created by Tinashe Zuka</p>
          <p className="mt-2 text-slate-600">Tinashe Zuka is a Form 4 student at Silveira High School in Bikita District, Masvingo Province, Zimbabwe. He created ExamPilot as a student-led educational technology project designed to help fellow Zimbabwean students prepare more effectively for O-Level and A-Level examinations.</p>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-electric-600">Form 4 Student | Aspiring Software Engineer | Zimbabwe</p>
          <p className="mt-4 text-slate-600">Tinashe has a strong interest in technology and software development and aspires to become a Software Engineer in the future.</p>
          <blockquote className="mt-5 border-l-4 border-electric-500 pl-4 text-slate-700">“ExamPilot was created to make examination preparation more accessible, organized and engaging for Zimbabwean students.”</blockquote>
        </div>
      </div>
    </div>
  )
}

function PrivacyPage() {
  return (
    <div className="container-shell py-12">
      <SectionHeading eyebrow="Privacy" title="Your guest experience stays simple" />
      <div className="section-card p-8">
        <ul className="space-y-4 text-slate-700">
          <li>No account is required.</li>
          <li>No password is required.</li>
          <li>Guest progress may be stored locally in the browser.</li>
          <li>Local data can be reset at any time.</li>
          <li>Personal information should not be unnecessarily collected.</li>
          <li>Local progress is not automatically synchronized between devices.</li>
        </ul>
        <button className="primary-btn mt-6" onClick={() => localStorage.clear()}>Reset Local Progress</button>
      </div>
    </div>
  )
}

function DisclaimerPage() {
  return (
    <div className="container-shell py-12">
      <SectionHeading eyebrow="Disclaimer" title="Important information" />
      <div className="section-card p-8 text-slate-700">
        <p>ExamPilot is an independent educational platform and is not the official ZIMSEC website. It is not affiliated with or endorsed by ZIMSEC unless explicitly stated through an established official relationship.</p>
        <ul className="mt-5 space-y-3">
          <li>Practice questions may be created by ExamPilot.</li>
          <li>Mock examinations are practice materials.</li>
          <li>AI-generated explanations should be verified.</li>
          <li>Official examination materials remain subject to applicable copyright and usage permissions.</li>
        </ul>
      </div>
    </div>
  )
}

function SearchPage() {
  const [query, setQuery] = useState('')
  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const subjectHits = subjects.filter((item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)).map((item) => ({ type: 'Subject', title: item.name, path: `/subjects/${item.level.toLowerCase().replace(/\s+/g, '-')}/${item.slug}` }))
    const topicHits = topics.filter((item) => item.name.toLowerCase().includes(q) || item.overview.toLowerCase().includes(q)).map((item) => ({ type: 'Topic', title: item.name, path: `/revision/${item.subject}/${item.slug}` }))
    const toolHits = [
      { type: 'Study Tool', title: 'Grade Calculator', path: '/study-tools' },
      { type: 'Study Tool', title: 'Study Timer', path: '/study-tools' },
      { type: 'Study Tool', title: 'Exam Countdown', path: '/study-tools' },
    ].filter((item) => item.title.toLowerCase().includes(q))
    return [...subjectHits, ...topicHits, ...toolHits]
  }, [query])

  return (
    <div className="container-shell py-12">
      <div className="section-card p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-navy-200" placeholder="Search subjects, topics, study tools and resources" />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {query && searchResults.length === 0 ? (
          <div className="section-card p-8 text-center text-slate-600">
            <p className="text-xl font-semibold text-slate-900">No results found.</p>
            <p className="mt-2">Try a different keyword or explore a subject directly.</p>
          </div>
        ) : (
          searchResults.map((item, index) => (
            <Link key={`${item.type}-${index}`} to={item.path} className="section-card block p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.type}</div>
                  <div className="mt-2 text-xl font-bold text-slate-900">{item.title}</div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-500" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="container-shell py-16">
      <div className="section-card p-10 text-center">
        <h1 className="text-4xl font-black text-slate-900">Page not found</h1>
        <p className="mt-4 text-slate-600">The page you are looking for does not exist.</p>
        <Link to="/" className="primary-btn mt-6">Back to home</Link>
      </div>
    </div>
  )
}

function Footer() {
  const footerLinks = ['Home', 'O-Level', 'A-Level', 'Subjects', 'Past Papers', 'Practice', 'Mock Exams', 'Study Tools', 'About', 'Privacy', 'Disclaimer']
  const routeMap: Record<string, string> = {
    Home: '/',
    'O-Level': '/o-level',
    'A-Level': '/a-level',
    Subjects: '/subjects',
    'Past Papers': '/past-papers',
    Practice: '/practice',
    'Mock Exams': '/mock-exams',
    'Study Tools': '/study-tools',
    About: '/about',
    Privacy: '/privacy',
    Disclaimer: '/disclaimer',
  }

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-200">
      <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <div className="text-xl font-black text-white">ExamPilot</div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Navigate Your Way to Exam Success.</div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-slate-400">Independent educational platform for Zimbabwean students.</p>
          <p className="mt-3 text-sm text-slate-400">Created by Tinashe Zuka</p>
        </div>

        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            {footerLinks.map((item) => <Link key={item} to={routeMap[item]} className="text-sm text-slate-300 hover:text-white">{item}</Link>)}
          </div>
        </div>
      </div>
    </footer>
  )
}

function ToolCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="section-card p-6">
      <div className="flex items-center gap-3 text-slate-900">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-100 text-electric-700">{icon}</div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function MiniStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="section-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-500">{label}</div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-700">{icon}</div>
      </div>
      <div className="mt-4 text-2xl font-black text-slate-900">{value}</div>
    </div>
  )
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <div className="text-sm font-bold uppercase tracking-[0.2em] text-electric-700">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
    </div>
  )
}

function LevelPromoCard({ level, description, features, buttonLabel, to }: { level: 'O-Level' | 'A-Level'; description: string; features: string[]; buttonLabel: string; to: string }) {
  return (
    <div className="section-card overflow-hidden p-6">
      <div className={`mb-5 h-2 w-full rounded-full bg-gradient-to-r ${level === 'O-Level' ? 'from-electric-500 to-blue-500' : 'from-violet-500 to-purple-500'}`} />
      <h3 className="text-3xl font-black text-slate-900">{level} Preparation</h3>
      <p className="mt-3 text-slate-600">{description}</p>
      <ul className="mt-5 space-y-2 text-sm text-slate-600">
        {features.map((feature) => <li key={feature} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-electric-600" /> {feature}</li>)}
      </ul>
      <Link to={to} className="primary-btn mt-6">{buttonLabel}</Link>
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className={`rounded-2xl p-4 ${accent}`}>
      <div className="text-xs uppercase tracking-[0.2em]">{label}</div>
      <div className="mt-2 text-2xl font-black">{value}</div>
    </div>
  )
}

function CountdownBox({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate))

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeRemaining(targetDate)), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="rounded-2xl bg-slate-100 p-3">
          <div className="text-xl font-black text-slate-900">{value}</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
        </div>
      ))}
    </div>
  )
}

function getTimeRemaining(deadline: string) {
  const target = new Date(deadline).getTime()
  const now = Date.now()
  const diff = Math.max(target - now, 0)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { Days: days, Hours: hours, Minutes: minutes, Seconds: seconds }
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function calculateMockScore(questions: MockQuestion[], answers: Record<string, string>) {
  return questions.reduce((total, question) => total + (answers[question.id] === question.correctAnswer ? 1 : 0), 0)
}

function countCorrect(questions: MockQuestion[], answers: Record<string, string>) {
  return questions.filter((question) => answers[question.id] === question.correctAnswer).length
}

function saveJSON<T>(key: string, value: T) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export default App
