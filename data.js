/* ==========================================================================
   UCL Linguistics Short Courses 26/27 — THE ONE FILE TO EDIT
   --------------------------------------------------------------------------
   Every page (Home, Courses, Schedule, About) is generated from this file.
   Change something here once and it updates everywhere.

   Where things are
     1. QUICK SETTINGS ..... mailing-list link, notice banner, contact person
     2. COURSES ............ terms, courses, session dates, rooms, slides
     3. ONCE A YEAR ........ year, About page text, FAQ, photos, past years

   Editing tips
   • Text goes inside quotes "…" or backticks `…` (backticks allow line
     breaks and both kinds of quote inside).
   • Dates are always "YYYY-MM-DD", times "HH:MM–HH:MM".
   • In longer text you can use:
       **bold**   _italic_   [link text](https://…)
       a blank line to start a new paragraph
       {contact}       → the organiser's name, linked to their email
       {mailingList}   → the mailing-list link, e.g. [Sign up]({mailingList})
     A lone * (e.g. *ABA) is left alone, so linguistic stars are safe.
   • Unknown yet? Leave it out or as "" — pages show "to be announced".
   • Preview: open index.html in a browser. If the page shows a red box,
     there is a typo here (usually a missing comma or quote).
   ========================================================================== */

window.SITE = {

  /* ========================================================================
     1. QUICK SETTINGS
     ======================================================================== */

  // Mailing-list sign-up form (in Google Forms: Send → link icon → copy).
  // Set it to "" to hide every sign-up button and link on the site.
  mailingList: "https://docs.google.com/forms/d/e/1FAIpQLSdF-bVFgiBzeMM0ZXT24VVYr4GZOk9aAgQD70pqdMoVDBIY6w/viewform",

  // Notice shown at the top of every page, e.g. a room change.
  // Leave as "" to hide it.
  announcement: "",

  // Organiser: shown in the footer, sidebar, About page and FAQ.
  contact: { name: "Cathy Gao", email: "chenjia.gao.18@ucl.ac.uk" },

  // Set to true once the last course of the year has finished: the home
  // page switches to a thank-you message.
  complete: false,


  /* ========================================================================
     2. COURSES
     ======================================================================== */

  // UCL profile pages. Wherever one of these names appears on the site
  // (tutors, guest speakers, faculty, descriptions) it becomes a link.
  // To find someone's link:  python tools/find_profile.py "First Last"
  // People without a UCL profile can be listed with "" (or left out).
  people: {
    "Juliette van Steensel": "https://profiles.ucl.ac.uk/105772-juliette-van-steensel",
    "Youngjin Kim": "https://profiles.ucl.ac.uk/74283-youngjin-kim",
    "Alina Konradt": "https://profiles.ucl.ac.uk/53849-alina-konradt",
    "Yasutada Sudo": "https://profiles.ucl.ac.uk/40657-yasutada-sudo",
    "Cathy Gao": "",   // no UCL profile
  },

  // Terms, in the order they appear on the site.
  terms: [
    { id: "term1", name: "Term 1", note: "Courses start the week of 9 November 2026." },
    { id: "term2", name: "Term 2" },
    { id: "term3", name: "Term 3" },
  ],

  // Used when a course or session doesn't say otherwise.
  defaults: { format: "In-person", room: "TBC" },

  // Building addresses. When a room mentions one of these buildings, the
  // course page shows its address with a map link.
  places: {
    "Chandler House": "2 Wakefield Street, London, WC1N 1PF",
  },

  //   term         one of the term ids above (move a course = change this)
  //   time / room  apply to every session unless a session overrides them
  //   sessions     one line per session; add title, description, readings,
  //                materials (files go in the docs/ folder) as they arrive
  courses: [
    {
      id: "sign-language-phonology",  // used in links: courses.html#sign-language-phonology
      term: "term1",
      title: "Introduction to the Phonology of Sign Languages",
      area: "Phonology",
      audience: "Open to everyone. Some background in linguistics helps; no knowledge of sign languages needed.",
      time: "13:00–14:00",
      room: "Room 116, Chandler House",
      instructors: [
        {
          name: "Juliette van Steensel",
          role: "PhD student (Year 2), UCL Linguistics",
          email: "juliette.steensel.23@ucl.ac.uk",
          bio: "",  // research focus: British Sign Language phonology
        },
      ],
      description: `This course will provide an introduction to the phonology of sign languages. Yes, sign languages have phonology! No prior knowledge of sign languages is required. We will begin by exploring the unique sociolinguistic context of sign languages: they are almost always minority languages, and language access is often an issue for deaf children. These factors mean that little attention was paid to sign languages for a lot of the history of the field of linguistics. Then, we will explore the basic phonological building blocks of signs: handshapes, movements and locations. We'll look at different models of the phonology of sign languages, starting with generative models from the 1980s and ending with more recent approaches that consider the impact of the modality of sign languages on their phonological organisation. Throughout the course, we will be thinking about how the modality of sign languages might impact their phonological organisation.`,
      sessions: [
        { date: "2026-11-13" },
        { date: "2026-11-20" },
        { date: "2026-11-27" },
        { date: "2026-12-04" },
        { date: "2026-12-11" },
      ],
    },

    {
      id: "psych-verbs",
      term: "term1",
      title: "The Peculiarities of Psychological Verbs",
      area: "Syntax & Semantics",
      audience: "Open to everyone. No prerequisites.",
      time: "17:00–18:00",
      room: "Room 116, Chandler House",
      instructors: [
        {
          name: "Youngjin Kim",
          role: "Honorary Research Fellow, UCL",
          email: "youngjin.kim.17@ucl.ac.uk",
          bio: "",  // research focus: syntax and the syntax–semantics interface
        },
      ],
      description: `Psychological predicates such as fear, frighten, worry, and annoy look deceptively simple, but they raise some of the most persistent questions in linguistic theory. This course introduces some of the peculiar properties of psychological predicates and examines the empirical puzzles and theoretical challenges they pose in syntax and semantics. It also explores how these phenomena have been analysed in the literature, as well as a recent proposal that offers a new way of understanding them.`,
      sessions: [
        { date: "2026-11-11" },
        { date: "2026-11-18" },
        { date: "2026-11-25" },
        { date: "2026-12-02" },
        { date: "2026-12-09" },
      ],
    },

    /* Template: copy this block for a new course.
    {
      id: "short-unique-id",
      term: "term2",
      title: "",
      area: "",
      audience: "",
      time: "16:00–17:00",
      room: "Room 116, Chandler House",
      format: "In-person",
      instructors: [
        { name: "", role: "", email: "", bio: `` },  // add url: "…" only for a non-UCL web page
      ],
      description: ``,
      sessions: [
        {
          date: "2027-02-15",
          title: "",
          description: ``,
          time: "",        // only if different from the course time
          room: "",        // only if different from the course room
          guest: "",       // guest speaker, if any
          readings: [ "Author (Year) Title", ],
          materials: [ { label: "Slides", file: "docs/my-course-session-1.pdf" }, ],
        },
      ],
    },
    */
  ],


  /* ========================================================================
     3. ONCE A YEAR
     ======================================================================== */

  year: "26/27",
  academicYear: "2026/27",

  about: `UCL Linguistics Short Courses is a training programme organised by [UCL Linguistics]({department}) PhD students, introducing students of all levels to a broad range of linguistics topics.

Each course runs for five one-hour sessions. Courses are free to attend and open to everyone: whether you're accompanying your studies or just curious to dive deeper, you're welcome.`,

  // "At a glance" box on the home page.
  atAGlance: [
    "Free of charge",
    "Open to everyone, no prerequisites",
    "Five one-hour sessions per course",
    "Certificate of participation",
  ],

  // One-line introductions under the page titles.
  pageIntros: {
    courses: "Course outlines, session dates, rooms and materials.",
    schedule: "All sessions in date order. Rooms sometimes change, so please check here before each session.",
  },

  howItWorks: [
    { title: "Join the mailing list", text: "[Sign up]({mailingList}) to hear about new courses, schedules and room details." },
    { title: "Pick a course", text: "Browse this year's courses. No prerequisites unless a course says otherwise." },
    { title: "Come along", text: "Sessions are one hour, usually weekly, in person at UCL." },
    { title: "Get a certificate", text: "Attend most sessions of a course and we'll email you a certificate of participation." },
  ],

  faq: [
    { q: "Who can attend?", a: "Everyone, whatever your background or level of experience in linguistics. Complete beginners are very welcome." },
    { q: "Do I need to register?", a: "Join the [mailing list]({mailingList}): registration and room details are sent there before each term." },
    { q: "Do I need to attend every session?", a: "We encourage it, but we understand clashes happen. Certificates of participation go to those who attend the majority of a course's sessions." },
    { q: "Are sessions recorded?", a: "It depends on the course. Check with the instructor or look out for announcements on the mailing list." },
    { q: "How do I get my certificate?", a: "Certificates are emailed after the course ends, so make sure you sign up with the address you'd like it sent to." },
    { q: "Can I suggest a topic or offer to teach?", a: "Absolutely. Email {contact} with your ideas." },
  ],

  // Carried over from 25/26: confirm for this year. Titles as on UCL Profiles.
  faculty: [
    { name: "Dr Alina Konradt", role: "Executive Officer, Division of Psychology and Language Sciences" },
    { name: "Prof Yasutada Sudo", role: "Professor of Linguistics, UCL" },
  ],

  previousYears: [
    { label: "Short Courses 25/26", url: "https://ucl-linguistics-short-course.github.io/2025/" },
    { label: "Short Courses 24/25", url: "https://ucl-linguistics-short-course.github.io/2024/" },
    { label: "Autumn School 2023", url: "https://sites.google.com/view/ucllinguisticsautumnschool2023/" },
  ],

  // Photos live in the images/ folder. Keep the credit when swapping a photo.
  images: {
    banner: {
      src: "images/ucl-wilkins-building.jpg",
      alt: "The portico of the Wilkins Building, UCL",
      credit: "Wilkins Building, UCL. Photo: Tony Hisgett, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:UCL_2_Wilkins_building_%2832371569506%29.jpg)",
    },
    history: {
      src: "images/london-university-1827.jpg",
      alt: "Engraving of the London University, now UCL, in 1827–28",
      credit: "The London University (now UCL), engraved by Thomas Hosmer Shepherd, 1827–28. Public domain, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:The_London_University_by_Thomas_Hosmer_Shepherd_1827-28.JPG)",
    },
  },

  links: {
    department: "https://www.ucl.ac.uk/brain-sciences/pals/research/linguistics",
    programmeHome: "https://ucl-linguistics-short-course.github.io/",
  },

  webmaster: { name: "Patrick Wu", email: "me@patrickwu.uk" },
};
