export type Lang = "fr" | "ar" | "en";

export const LANGS: Array<{ id: Lang; label: string; dir: "ltr" | "rtl" }> = [
  { id: "fr", label: "FR", dir: "ltr" },
  { id: "ar", label: "ع", dir: "rtl" },
  { id: "en", label: "EN", dir: "ltr" },
];

export const DIR: Record<Lang, "ltr" | "rtl"> = { fr: "ltr", ar: "rtl", en: "ltr" };

const fr = {
  brand: "Tirage LP1",
  season: "Saison 2026 · 2027",
  league: "Ligue Professionnelle 1",

  heroTitle: "Le calendrier de la Ligue 1,",
  heroTitleAccent: "tiré au sort sous vos yeux.",
  heroLead:
    "Un tirage complet, équilibré et sans conflit de programmation, calculé dans votre navigateur en quelques millisecondes. Pas de serveur, pas de commission, pas de huis clos : la graine du tirage est publique, et n'importe qui peut le rejouer à l'identique.",
  cta: "Lancer le tirage",
  ctaAgain: "Relancer un tirage",
  ctaWorking: "Tirage en cours…",
  heroHint: "16 clubs · 30 journées · 240 matchs",

  pillars: [
    { t: "Instantané", d: "Le calendrier complet est calculé en moins de 50 ms, sur votre appareil." },
    { t: "Vérifiable", d: "Chaque contrainte est ré-auditée après coup et le résultat vous est affiché, même en cas d'échec." },
    { t: "Reproductible", d: "Une graine, un calendrier. Partagez le lien : tout le monde obtient exactement le même." },
    { t: "Gratuit", d: "Aucun coût d'infrastructure : le navigateur fait tout le travail." },
  ],

  statCompute: "Temps de calcul",
  statMatches: "Matchs programmés",
  statRounds: "Journées",
  statConflicts: "Conflits",
  statSeed: "Graine",
  statBreaks: "Breaks",
  statTravel: "Distance totale",
  statIterations: "Calendriers évalués",
  noConflict: "Aucun",

  tabRounds: "Journées",
  tabTeams: "Par club",
  tabGrid: "Grille",
  tabAudit: "Vérification",

  round: "Journée",
  roundShort: "J",
  firstLeg: "Aller",
  secondLeg: "Retour",
  home: "Domicile",
  away: "Extérieur",
  vs: "reçoit",
  at: "se déplace à",
  opponent: "Adversaire",
  allTeams: "Tous les clubs",
  filterTeam: "Filtrer par club",
  chooseTeam: "Choisir un club",
  homeMatches: "réceptions",
  awayMatches: "déplacements",
  travelSeason: "Kilomètres parcourus",
  derbyOf: "Affiche",
  approxDates: "Dates indicatives — susceptibles d'être ajustées par la LNFP.",

  auditTitle: "Ce que la machine s'est engagée à respecter",
  auditLead:
    "Ces contrôles sont exécutés APRÈS le tirage, sur la seule liste des matchs produite, sans rien supposer de la méthode. C'est la différence entre « faites-nous confiance » et « vérifiez vous-même ».",
  auditPassed: "Respectée",
  auditFailed: "Non respectée",
  auditAllGood: "Les 7 contraintes sont respectées.",
  auditProblem: "conflit(s) détecté(s) — relancez le tirage.",

  gridLegend: "Ligne = club recevant · Colonne = club visiteur · Cellule = journée du match aller",

  optionsTitle: "Réglages du tirage",
  optSeed: "Graine",
  optSeedHelp: "Saisissez un code pour rejouer un tirage précis.",
  optMetro: "Réceptions simultanées max. par agglomération",
  optProtect: "Protéger la 1re et la dernière journée des grandes affiches",
  strict: "strict",
  legNote:
    "Le retour rejoue l'aller à l'envers (J16 = J15 inversée). C'est la seule structure qui empêche un club d'enchaîner trois réceptions à la charnière aller/retour : le miroir classique (J16 = J1) en produit toujours au moins une, nous l'avons mesuré.",
  apply: "Appliquer",

  share: "Copier le lien",
  shared: "Lien copié !",
  csv: "Export CSV",
  ics: "Ajouter à l'agenda",
  print: "Imprimer / PDF",

  aboutTitle: "Comment ça marche",
  aboutBody:
    "Le moteur part d'une table de Berger : une construction mathématique qui garantit un championnat aller-retour complet avec le minimum de séries de réceptions ou de déplacements. Le hasard ne porte que sur l'attribution des 16 clubs aux 16 positions de cette table — plus de 20 000 milliards de combinaisons. Une recherche locale élimine ensuite les conflits : stade partagé de Radès, agglomération saturée, affiche mal placée, longs déplacements enchaînés. Le tout, sur votre téléphone, en quelques millisecondes.",
  aboutOpen: "Le code est ouvert et vérifiable.",

  footerNote:
    "Projet citoyen indépendant, sans lien avec la FTF ou la LNFP. Les noms de clubs appartiennent à leurs propriétaires respectifs.",
  footerData: "Composition 2026-2027 : 13 clubs maintenus + ES Hammam Sousse, PS Sakiet Eddaïer et CS Hammam Lif, promus de LP2.",

  /* ── page d'accueil ─────────────────────────────────────────────────── */
  whyTitle: "Pourquoi ce site existe",
  whyBody:
    "Le tirage de la Ligue Professionnelle 1 s'est fait à la main, à huis clos, et il a été contesté dès le lendemain. Ce site n'accuse personne : il montre simplement qu'un calendrier complet, équilibré et sans conflit de programmation se calcule en 25 millisecondes dans un navigateur, pour zéro dinar — et que n'importe qui peut le vérifier ligne par ligne.",
  howTitle: "Comment le tirage est fait",
  howSteps: [
    {
      t: "Une base mathématique",
      d: "Une table de Berger garantit un championnat aller-retour complet, avec le minimum de séries de réceptions ou de déplacements.",
    },
    {
      t: "Un hasard public",
      d: "Seule l'attribution des 16 clubs est tirée au sort, à partir d'une graine affichée à l'écran. Plus de 20 000 milliards de combinaisons possibles.",
    },
    {
      t: "Une vérification indépendante",
      d: "Le calendrier produit est ré-audité depuis zéro, sans rien supposer de la méthode qui l'a produit. Le résultat s'affiche, même en cas d'échec.",
    },
  ],
  clubsTitle: "Les 16 clubs engagés",
  clubsLead: "Composition de la saison 2026-2027, promus et relégués inclus.",
  scrollHint: "Découvrir",

  /* ── auteur / contact ───────────────────────────────────────────────── */
  contactKicker: "Qui a fait ça",
  contactTitle: "Réalisé par Moatez Litaiem",
  contactLead:
    "Développeur full-stack. Ce site a été conçu, développé, testé et mis en ligne en une journée : moteur de calcul, interface trilingue, export PDF et hébergement gratuit qui encaisse n'importe quel pic de trafic. Si vous avez besoin d'une application web rapide, soignée et qui tient la charge, écrivez-moi.",
  contactAvailable: "Disponible pour vos projets",
  contactRole: "Développeur full-stack freelance",
  contactEmail: "M'écrire",
  contactCode: "Voir le code source",
  contactLinkedin: "LinkedIn",
  ctaTitle: "Un projet web en tête ?",
  ctaBody:
    "Je suis freelance et disponible pour de nouvelles missions : application sur mesure, refonte, ou prototype à montrer vite.",
  ctaAction: "Discutons-en",
  backHome: "Accueil",
  exploreTitle: "Explorer le site",
  navClubs: "Les 16 clubs",
  navMap: "La carte",
  navSimulator: "Simulateur",
  navDerbies: "Derbys",
  navPalmares: "Palmarès",
  navQuiz: "Quiz",
  navMethod: "La méthode",
  kickoffIn: "Coup d'envoi de la saison dans",
  kickoffNow: "La saison a commencé.",
  unitDays: "j",
  unitHours: "h",
  unitMinutes: "min",

  langName: "Français",
};

export type Dict = typeof fr;

const ar: Dict = {
  brand: "قرعة الرابطة 1",
  season: "موسم 2026 · 2027",
  league: "الرابطة المحترفة الأولى",

  heroTitle: "رزنامة الرابطة الأولى،",
  heroTitleAccent: "قرعة تجري أمام عينيك.",
  heroLead:
    "قرعة كاملة ومتوازنة وخالية من التعارضات، تُحتسب داخل متصفحك في أجزاء من الألف من الثانية. بلا خوادم، بلا تكاليف، وبلا أبواب مغلقة: بذرة القرعة معلنة، ويمكن لأي كان إعادة إجرائها والحصول على النتيجة ذاتها.",
  cta: "أطلق القرعة",
  ctaAgain: "أعد القرعة",
  ctaWorking: "جارٍ السحب…",
  heroHint: "16 ناديًا · 30 جولة · 240 مباراة",

  pillars: [
    { t: "فوري", d: "الرزنامة الكاملة تُحتسب في أقل من 50 جزءًا من الألف من الثانية، على جهازك." },
    { t: "قابل للتحقق", d: "كل شرط يُراجَع بعد السحب وتُعرض النتيجة عليك، حتى عند الإخفاق." },
    { t: "قابل للإعادة", d: "بذرة واحدة، رزنامة واحدة. شارك الرابط: الجميع يحصل على النتيجة نفسها." },
    { t: "مجاني", d: "لا كلفة بنية تحتية: المتصفح يقوم بكل العمل." },
  ],

  statCompute: "زمن الحساب",
  statMatches: "المباريات المبرمجة",
  statRounds: "الجولات",
  statConflicts: "التعارضات",
  statSeed: "البذرة",
  statBreaks: "التكرارات",
  statTravel: "المسافة الجملية",
  statIterations: "رزنامات مُقيَّمة",
  noConflict: "لا شيء",

  tabRounds: "الجولات",
  tabTeams: "حسب النادي",
  tabGrid: "الجدول",
  tabAudit: "التحقق",

  round: "الجولة",
  roundShort: "ج",
  firstLeg: "الذهاب",
  secondLeg: "الإياب",
  home: "أرضه",
  away: "خارج أرضه",
  vs: "يستقبل",
  at: "يتنقّل إلى",
  opponent: "المنافس",
  allTeams: "كل الأندية",
  filterTeam: "تصفية حسب النادي",
  chooseTeam: "اختر ناديًا",
  homeMatches: "مباريات على أرضه",
  awayMatches: "مباريات خارج أرضه",
  travelSeason: "الكيلومترات المقطوعة",
  derbyOf: "قمة",
  approxDates: "تواريخ استرشادية — قابلة للتعديل من طرف الرابطة الوطنية.",

  auditTitle: "ما التزمت به الآلة",
  auditLead:
    "تُنفَّذ هذه الاختبارات بعد القرعة، انطلاقًا من قائمة المباريات وحدها، دون أي افتراض حول الطريقة. هذا هو الفرق بين «ثِقوا بنا» و«تحقّقوا بأنفسكم».",
  auditPassed: "مُحترَم",
  auditFailed: "غير مُحترَم",
  auditAllGood: "الشروط السبعة كلها محترمة.",
  auditProblem: "تعارض(ات) — أعد إجراء القرعة.",

  gridLegend: "السطر = النادي المستقبِل · العمود = النادي الزائر · الخانة = جولة مباراة الذهاب",

  optionsTitle: "إعدادات القرعة",
  optSeed: "البذرة",
  optSeedHelp: "أدخل رمزًا لإعادة إجراء قرعة بعينها.",
  optMetro: "أقصى عدد استقبالات متزامنة في نفس الحاضرة",
  optProtect: "حماية الجولة الأولى والأخيرة من مباريات القمة",
  strict: "صارم",
  legNote:
    "يعيد الإياب ترتيب الذهاب معكوسًا (ج16 = ج15 مقلوبة). وهي البنية الوحيدة التي تمنع ناديًا من خوض ثلاث مباريات متتالية على أرضه عند مفصل الذهاب والإياب: أما المرآة الكلاسيكية (ج16 = ج1) فتُنتج واحدة على الأقل في كل مرة، وقد قِسنا ذلك.",
  apply: "تطبيق",

  share: "نسخ الرابط",
  shared: "تم نسخ الرابط!",
  csv: "تصدير CSV",
  ics: "أضف إلى التقويم",
  print: "طباعة / PDF",

  aboutTitle: "كيف يشتغل؟",
  aboutBody:
    "ينطلق المحرّك من جدول بيرغر: بناء رياضي يضمن بطولة ذهابًا وإيابًا كاملة بأقل عدد ممكن من الاستقبالات أو التنقلات المتتالية. لا يتدخل الحظ إلا في توزيع الأندية الستة عشر على مواقع الجدول الستة عشر — أكثر من عشرين ألف مليار احتمال. ثم يزيل بحث محلي التعارضات: ملعب رادس المشترك، الحاضرة المكتظة، القمة في غير موضعها، والتنقلات الطويلة المتتالية. كل ذلك على هاتفك، في أجزاء من الألف من الثانية.",
  aboutOpen: "الشفرة المصدرية مفتوحة وقابلة للتدقيق.",

  footerNote:
    "مشروع مواطني مستقل، لا علاقة له بالجامعة التونسية لكرة القدم أو بالرابطة الوطنية. أسماء الأندية ملك لأصحابها.",
  footerData: "تشكيلة 2026-2027: 13 ناديًا محافظًا على مكانه، إضافة إلى أمل حمام سوسة والتقدم الرياضي بساقية الدائر والنادي الرياضي بحمام الأنف الصاعدين من الرابطة الثانية.",

  /* ── الصفحة الرئيسية ────────────────────────────────────────────────── */
  whyTitle: "لماذا هذا الموقع",
  whyBody:
    "جرت قرعة الرابطة المحترفة الأولى يدويًا وخلف أبواب مغلقة، وأثارت الجدل في اليوم الموالي. هذا الموقع لا يتهم أحدًا: هو فقط يُثبت أن رزنامة كاملة ومتوازنة وخالية من التعارضات يمكن حسابها في 25 جزءًا من الألف من الثانية داخل المتصفّح، ودون أي كلفة — وأن أي شخص يستطيع التحقق منها سطرًا بسطر.",
  howTitle: "كيف تتم القرعة",
  howSteps: [
    {
      t: "أساس رياضي",
      d: "جدول بيرغر يضمن بطولة ذهابًا وإيابًا كاملة، بأقل عدد ممكن من سلاسل الاستقبال أو التنقّل.",
    },
    {
      t: "عشوائية معلنة",
      d: "القرعة تخصّ توزيع الأندية الستة عشر فقط، انطلاقًا من بذرة معروضة على الشاشة. أكثر من 20 ألف مليار توليفة ممكنة.",
    },
    {
      t: "تدقيق مستقل",
      d: "تُراجَع الرزنامة الناتجة من الصفر، دون أي افتراض حول طريقة إنتاجها. وتُعرض النتيجة حتى في حال الإخفاق.",
    },
  ],
  clubsTitle: "الأندية الستة عشر",
  clubsLead: "تشكيلة موسم 2026-2027، بما في ذلك الصاعدون والنازلون.",
  scrollHint: "اكتشف",

  /* ── صاحب المشروع ───────────────────────────────────────────────────── */
  contactKicker: "من أنجز هذا",
  contactTitle: "من إنجاز معتز الليتيم",
  contactLead:
    "مطوّر ويب متكامل. صُمّم هذا الموقع وطُوّر واختُبر ونُشر في يوم واحد: محرّك حساب، واجهة بثلاث لغات، تصدير PDF، واستضافة مجانية تتحمّل أي ذروة زيارات. إن كنت تحتاج تطبيق ويب سريعًا ومتقنًا وقادرًا على الصمود، راسلني.",
  contactAvailable: "متاح لمشاريعكم",
  contactRole: "مطوّر ويب متكامل مستقلّ",
  contactEmail: "راسلني",
  contactCode: "الاطّلاع على الشيفرة",
  contactLinkedin: "لينكد إن",
  ctaTitle: "هل لديك مشروع ويب؟",
  ctaBody:
    "أعمل بشكل مستقلّ وأنا متاح لمهام جديدة: تطبيق على المقاس، إعادة تصميم، أو نموذج أوّلي جاهز للعرض بسرعة.",
  ctaAction: "لنتحدّث",
  backHome: "الرئيسية",
  exploreTitle: "استكشف الموقع",
  navClubs: "الأندية الستة عشر",
  navMap: "الخريطة",
  navSimulator: "المحاكي",
  navDerbies: "الديربيات",
  navPalmares: "سجل الألقاب",
  navQuiz: "اختبار",
  navMethod: "المنهجية",
  kickoffIn: "انطلاق الموسم بعد",
  kickoffNow: "انطلق الموسم.",
  unitDays: "ي",
  unitHours: "س",
  unitMinutes: "د",

  langName: "العربية",
};

const en: Dict = {
  brand: "LP1 Draw",
  season: "2026 · 2027 season",
  league: "Ligue Professionnelle 1",

  heroTitle: "The Tunisian Ligue 1 fixture list,",
  heroTitleAccent: "drawn in front of you.",
  heroLead:
    "A complete, balanced, conflict-free season draw computed inside your browser in a few milliseconds. No server, no fee, no closed doors: the draw seed is public, and anyone can replay it and get exactly the same calendar.",
  cta: "Run the draw",
  ctaAgain: "Draw again",
  ctaWorking: "Drawing…",
  heroHint: "16 clubs · 30 matchdays · 240 fixtures",

  pillars: [
    { t: "Instant", d: "The full season is computed in under 50 ms, on your own device." },
    { t: "Verifiable", d: "Every constraint is re-audited afterwards and the result is shown to you — failures included." },
    { t: "Reproducible", d: "One seed, one calendar. Share the link and everyone gets the same draw." },
    { t: "Free", d: "Zero infrastructure cost: the browser does all the work." },
  ],

  statCompute: "Compute time",
  statMatches: "Fixtures scheduled",
  statRounds: "Matchdays",
  statConflicts: "Conflicts",
  statSeed: "Seed",
  statBreaks: "Breaks",
  statTravel: "Total distance",
  statIterations: "Calendars evaluated",
  noConflict: "None",

  tabRounds: "Matchdays",
  tabTeams: "By club",
  tabGrid: "Grid",
  tabAudit: "Audit",

  round: "Matchday",
  roundShort: "MD",
  firstLeg: "First leg",
  secondLeg: "Second leg",
  home: "Home",
  away: "Away",
  vs: "host",
  at: "travel to",
  opponent: "Opponent",
  allTeams: "All clubs",
  filterTeam: "Filter by club",
  chooseTeam: "Pick a club",
  homeMatches: "home games",
  awayMatches: "away games",
  travelSeason: "Kilometres travelled",
  derbyOf: "Marquee tie",
  approxDates: "Indicative dates — subject to adjustment by the league.",

  auditTitle: "What the machine committed to",
  auditLead:
    "These checks run AFTER the draw, on the produced fixture list alone, assuming nothing about the method. That is the difference between “trust us” and “check for yourself”.",
  auditPassed: "Satisfied",
  auditFailed: "Violated",
  auditAllGood: "All 7 constraints are satisfied.",
  auditProblem: "conflict(s) found — run the draw again.",

  gridLegend: "Row = home club · Column = away club · Cell = first-leg matchday",

  optionsTitle: "Draw settings",
  optSeed: "Seed",
  optSeedHelp: "Enter a code to replay a specific draw.",
  optMetro: "Max simultaneous home games per metro area",
  optProtect: "Keep marquee ties off matchday 1 and 30",
  strict: "strict",
  legNote:
    "The second leg replays the first one backwards (MD16 = MD15 reversed). It is the only structure that stops a club from playing three straight home games across the first-leg/second-leg junction: the classic mirror (MD16 = MD1) always produces at least one — we measured it.",
  apply: "Apply",

  share: "Copy link",
  shared: "Link copied!",
  csv: "Export CSV",
  ics: "Add to calendar",
  print: "Print / PDF",

  aboutTitle: "How it works",
  aboutBody:
    "The engine starts from a Berger table: a mathematical construction guaranteeing a complete home-and-away season with the minimum number of consecutive home or away runs. Randomness only decides which of the 16 clubs sits in which of the 16 table positions — over 20 trillion combinations. A local search then removes the conflicts: the shared Radès stadium, an overloaded metro area, a marquee tie in the wrong week, back-to-back long trips. All of it on your phone, in milliseconds.",
  aboutOpen: "The code is open and auditable.",

  footerNote:
    "Independent citizen project, not affiliated with the FTF or the LNFP. Club names belong to their respective owners.",
  footerData: "2026-27 line-up: 13 clubs retained plus ES Hammam Sousse, PS Sakiet Eddaïer and CS Hammam Lif, promoted from LP2.",

  /* ── landing page ───────────────────────────────────────────────────── */
  whyTitle: "Why this site exists",
  whyBody:
    "The Ligue Professionnelle 1 draw was made by hand, behind closed doors, and was disputed the very next day. This site accuses no one: it simply shows that a complete, balanced, conflict-free fixture list can be computed in 25 milliseconds inside a browser, at zero cost — and that anyone can check it line by line.",
  howTitle: "How the draw works",
  howSteps: [
    {
      t: "A mathematical base",
      d: "A Berger table guarantees a full home-and-away season with the minimum number of consecutive home or away runs.",
    },
    {
      t: "Public randomness",
      d: "Only the assignment of the 16 clubs is drawn, from a seed shown on screen. Over 20 trillion possible combinations.",
    },
    {
      t: "Independent verification",
      d: "The resulting fixture list is re-audited from scratch, assuming nothing about how it was produced. The verdict is shown, even on failure.",
    },
  ],
  clubsTitle: "The 16 clubs",
  clubsLead: "2026-2027 line-up, promoted and relegated sides included.",
  scrollHint: "Explore",

  /* ── author / contact ───────────────────────────────────────────────── */
  contactKicker: "Who built this",
  contactTitle: "Built by Moatez Litaiem",
  contactLead:
    "Full-stack developer. This site was designed, built, tested and shipped in a single day: computation engine, trilingual interface, PDF export, and free hosting that absorbs any traffic spike. If you need a web app that is fast, polished and holds up under load, get in touch.",
  contactAvailable: "Available for your projects",
  contactRole: "Freelance full-stack developer",
  contactEmail: "Email me",
  contactCode: "View the source",
  contactLinkedin: "LinkedIn",
  ctaTitle: "Got a web project?",
  ctaBody:
    "I work freelance and I'm available for new engagements: custom applications, rebuilds, or a prototype you can show quickly.",
  ctaAction: "Let's talk",
  backHome: "Home",
  exploreTitle: "Explore",
  navClubs: "The 16 clubs",
  navMap: "Map",
  navSimulator: "Simulator",
  navDerbies: "Derbies",
  navPalmares: "Honours",
  navQuiz: "Quiz",
  navMethod: "The method",
  kickoffIn: "Season kicks off in",
  kickoffNow: "The season has started.",
  unitDays: "d",
  unitHours: "h",
  unitMinutes: "m",

  langName: "English",
};

export const T: Record<Lang, Dict> = { fr, ar, en };

export function isLang(v: string | null | undefined): v is Lang {
  return v === "fr" || v === "ar" || v === "en";
}

/** Chiffres en écriture locale (l'arabe tunisien utilise les chiffres latins). */
export function nf(lang: Lang, value: number, opts?: Intl.NumberFormatOptions) {
  const locale = lang === "ar" ? "ar-TN-u-nu-latn" : lang === "en" ? "en-GB" : "fr-FR";
  return new Intl.NumberFormat(locale, opts).format(value);
}
