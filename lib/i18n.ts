export type Lang = "en" | "zh";

export const ui = {
  title1: { en: "World Cup", zh: "世界杯" },
  title2: { en: "Flashcards", zh: "闪卡" },
  teams: { en: "Teams", zh: "球队" },
  players: { en: "Players", zh: "球员" },
  all: { en: "All", zh: "全部" },
  group: { en: "Group", zh: "组" },
  mastered: { en: "Mastered", zh: "已掌握" },
  unmasteredOnly: { en: "Unlearned only", zh: "只看未掌握" },
  prev: { en: "← Prev", zh: "← 上一张" },
  next: { en: "Next →", zh: "下一张 →" },
  know: { en: "✓ Got it", zh: "✓ 认识" },
  unknow: { en: "Unmark", zh: "取消掌握" },
  shuffle: { en: "🔀 Shuffle", zh: "🔀 打乱顺序" },
  keysHint: { en: "Space flip · ←→ nav · M mark", zh: "空格翻面 · ←→ 切换 · M 标记" },
  tapHint: { en: "Tap card for details", zh: "点击卡片查看详情" },
  allDone: { en: "All mastered in this set!", zh: "这一组全部掌握了！" },
  showAll: { en: "Show all cards", zh: "查看全部卡片" },
  styleSection: { en: "⚙️ Tactical Profile", zh: "⚙️ 技术风格" },
  expectationSection: { en: "🔮 Expectations", zh: "🔮 外界期待" },
  keyPlayersSection: { en: "⭐ Key Players", zh: "⭐ 核心球员" },
  traitSection: { en: "⚡ Playing Style", zh: "⚡ 技术特点" },
  careerSection: { en: "📋 Career", zh: "📋 职业背景" },
  funFactSection: { en: "💡 Fun Fact", zh: "💡 冷知识" },
  bestResult: { en: "Best Result", zh: "历史最佳" },
  coach: { en: "Coach", zh: "主教练" },
  fifaRank: { en: "FIFA Rank", zh: "FIFA排名" },
  appearance: { en: "App.", zh: "参赛" },
  ageSuffix: { en: "y/o", zh: "岁" },
  natTeam: { en: "Nat. Team", zh: "国家队" },
  position: { en: "Position", zh: "位置" },
  club: { en: "Club", zh: "俱乐部" },
  searchPlaceholder: { en: "Search a country or a player…", zh: "搜索国家或球员…" },
  noResults: { en: "No team or player found", zh: "没有找到球队或球员" },
  teamsCount: { en: "teams", zh: "支球队" },
  playersCount: { en: "players", zh: "名球员" },
  premiumTitle: { en: "✨ That player isn't in our deck — yet", zh: "✨ 这名球员还不在卡组里" },
  premiumBody: {
    en: "Free covers 5–6 stars per team. Premium unlocks all 1,250+ tournament players with full cards, ratings and fun facts. Coming soon.",
    zh: "免费版收录每队5–6名核心球员。Premium 将解锁全部1,250+名参赛球员的完整卡片、评分与冷知识，即将上线。",
  },
  premiumCta: { en: "Notify me when it launches", zh: "上线时通知我" },
  premiumThanks: { en: "🎉 You're on the list!", zh: "🎉 已加入通知名单！" },
  premiumClose: { en: "Maybe later", zh: "以后再说" },
  premiumTeaser: { en: "✨ Unlock all 1,250+ players with Premium", zh: "✨ Premium 解锁全部1,250+球员" },
  signIn: { en: "Sign in", zh: "登录" },
  signOut: { en: "Sign out", zh: "退出登录" },
  premiumBuy: { en: "Get the Tournament Pass", zh: "购买赛事通行证" },
  premiumSignInFirst: { en: "Sign in with Google to continue", zh: "用 Google 登录后购买" },
  premiumOwned: { en: "✓ Premium active — full deck unlocking daily", zh: "✓ 会员已激活 — 完整卡组每日更新中" },
  loginGateTitle: { en: "⚽️ You're on a roll!", zh: "⚽️ 刷得正起劲！" },
  loginGateBody: {
    en: "Sign in free with Google to keep studying all 264 cards, save your progress across devices.",
    zh: "用 Google 免费登录即可继续刷全部264张卡片，进度跨设备保存",
  },
  loginGateCta: { en: "Continue with Google — it's free", zh: "Google 登录继续（免费）" },
  loginGateLater: { en: "Not now", zh: "暂不" },
  signInTitle: { en: "Sign in to your account", zh: "登录账户" },
  signInSub: {
    en: "Your progress syncs across all your devices",
    zh: "学习进度将在所有设备间同步",
  },
  continueGoogle: { en: "Continue with Google", zh: "使用 Google 继续" },
  orContinueWith: { en: "OR CONTINUE WITH", zh: "或使用邮箱" },
  continueEmail: { en: "Continue with Email", zh: "发送登录链接" },
  checkInbox: {
    en: "✉️ Check your inbox — we sent you a sign-in link.",
    zh: "✉️ 登录链接已发送，请查收邮箱。",
  },
  agreeNote: {
    en: "Free account · no password needed",
    zh: "免费账户 · 无需密码",
  },
  landingTag: { en: "Check out who's playing today", zh: "看看今天谁出场" },
  landingSub: {
    en: "Learn every player on the pitch — flip each card to reveal ratings, stories and fun facts.",
    zh: "认识今天每一位出场球员 —— 翻开卡片，看评分、故事与冷知识。",
  },
  getStarted: { en: "Get Started", zh: "开始" },
  todaysMatches: { en: "Today's Matches", zh: "今日比赛" },
  tomorrowLabel: { en: "Tomorrow", zh: "明天" },
  fullTime: { en: "FT", zh: "完场" },
  backMatches: { en: "‹ Matches", zh: "‹ 比赛列表" },
  studyMatch: { en: "Study this match", zh: "刷这场比赛" },
  browseAllLink: { en: "Browse all teams & players", zh: "浏览全部球队与球员" },
  noMatchesToday: { en: "No matches today — next up:", zh: "今天没有比赛 — 接下来：" },
  matchCards: { en: "cards", zh: "张卡" },
} as const;

export const tagMap: Record<string, string> = {
  夺冠热门: "Title Contender",
  潜在黑马: "Dark Horse",
  淘汰赛级别: "Knockout Level",
  小组赛搅局者: "Group Spoiler",
  重在参与: "Underdog",
};

export const confMap: Record<string, string> = {
  欧足联: "UEFA",
  南美足联: "CONMEBOL",
  中北美及加勒比: "CONCACAF",
  非足联: "CAF",
  亚足联: "AFC",
  大洋洲足联: "OFC",
};

export const posMap: Record<string, string> = {
  门将: "Goalkeeper",
  中后卫: "Centre-Back",
  左后卫: "Left-Back",
  右后卫: "Right-Back",
  翼卫: "Wing-Back",
  右翼卫: "Right Wing-Back",
  后腰: "Defensive Mid",
  中场: "Midfielder",
  攻击中场: "Attacking Mid",
  前腰: "Playmaker",
  边锋: "Winger",
  左边锋: "Left Winger",
  右边锋: "Right Winger",
  前锋: "Forward",
  中锋: "Striker",
};

export const ratingMap: Record<string, string> = {
  速度: "PAC",
  射门: "SHO",
  传球: "PAS",
  盘带: "DRI",
  防守: "DEF",
  体魄: "PHY",
  扑救: "SAV",
  反应: "REF",
  出击: "SWP",
  站位: "POS",
  出球: "DIS",
  扑点: "PEN",
};

export const clubMap: Record<string, string> = {
  AC米兰: "AC Milan", PSV埃因霍温: "PSV Eindhoven", 乌得勒支: "FC Utrecht",
  亚特兰大: "Atalanta", 亚特兰大联: "Atlanta United", 伊拉克联赛: "Iraqi league",
  伊斯坦布尔巴萨克谢希尔: "Istanbul Başakşehir", 伊普斯维奇: "Ipswich Town",
  伯恩利: "Burnley", 伯恩茅斯: "Bournemouth", 佛罗伦萨: "Fiorentina",
  切尔西: "Chelsea", 利物浦: "Liverpool", 利雅得新月: "Al-Hilal",
  利雅得胜利: "Al-Nassr", 利雅得青年人: "Al-Shabab", 加拉塔萨雷: "Galatasaray",
  勒沃库森: "Bayer Leverkusen", 博洛尼亚: "Bologna", 卡塔尔联赛: "Qatari league",
  吉达国民: "Al-Ahli Jeddah", 国际米兰: "Inter Milan", 国际队: "SC Internacional",
  土超联赛: "Turkish league", 圣保利: "St. Pauli", 埃弗顿: "Everton",
  墨西哥联赛: "Liga MX", 多特蒙德: "Borussia Dortmund", 奥林匹亚科斯: "Olympiacos",
  富勒姆: "Fulham", 尤文图斯: "Juventus", 尼斯: "OGC Nice",
  巴塞罗那: "Barcelona", 巴黎圣日耳曼: "Paris Saint-Germain",
  布拉格斯拉维亚: "Slavia Prague", 布莱顿: "Brighton", 帕尔梅拉斯: "Palmeiras",
  帕尔马: "Parma", 恩波利: "Empoli", 意甲联赛: "Serie A club",
  托特纳姆热刺: "Tottenham Hotspur", 拜仁慕尼黑: "Bayern Munich", 摩纳哥: "AS Monaco",
  斯图加特: "VfB Stuttgart", 斯托克城: "Stoke City", 斯特拉斯堡: "Strasbourg",
  "斯特拉斯堡（切尔西所有）": "Strasbourg (Chelsea-owned)", 昂热: "Angers",
  曼城: "Manchester City", 曼联: "Manchester United", 本菲卡: "Benfica",
  杜海勒: "Al-Duhail", 桑德兰: "Sunderland", 梅斯: "FC Metz",
  比利亚雷亚尔: "Villarreal", 毕尔巴鄂竞技: "Athletic Bilbao", 水晶宫: "Crystal Palace",
  沃尔夫斯堡: "Wolfsburg", 沃特福德: "Watford", 沙巴布阿赫利: "Shabab Al-Ahli",
  法兰克福: "Eintracht Frankfurt", 法国联赛: "French league", 波尔图: "FC Porto",
  波斯波利斯: "Persepolis", 洛杉矶FC: "Los Angeles FC", 洛里昂: "FC Lorient",
  海外联赛: "Overseas club", 海湾联赛: "Gulf league", 热刺: "Tottenham Hotspur",
  热那亚: "Genoa", 狼队: "Wolves", 皇家社会: "Real Sociedad",
  皇家马德里: "Real Madrid", 科林蒂安: "Corinthians", 科莫: "Como 1907",
  突尼斯联赛: "Tunisian league", 米德尔斯堡: "Middlesbrough", 约旦联赛: "Jordanian league",
  纽卡斯尔联: "Newcastle United", "经验丰富的英系联赛老将": "Veteran (UK leagues)",
  罗马: "AS Roma", 美洲联赛: "Americas league", 美洲队: "Club América",
  美职联: "MLS", "自由球员/流浪生涯": "Free agent / journeyman",
  英冠联赛: "EFL Championship", 荷甲老将: "Eredivisie veteran",
  莱斯特城: "Leicester City", 莱比锡红牛: "RB Leipzig", 萨德: "Al-Sadd",
  蒂华纳: "Club Tijuana", 蔚山HD: "Ulsan HD", 西汉姆联: "West Ham United",
  西甲联赛: "La Liga club", 诺丁汉森林: "Nottingham Forest", 谢周三: "Sheffield Wednesday",
  谢菲尔德联: "Sheffield United", 贝尔格莱德红星: "Red Star Belgrade",
  贝西克塔斯: "Beşiktaş", 费内巴切: "Fenerbahçe", 迈阿密国际: "Inter Miami",
  那不勒斯: "Napoli", 都灵: "Torino", 里昂: "Lyon", 阿斯顿维拉: "Aston Villa",
  阿森纳: "Arsenal", 阿赫利: "Al Ahly", 雷恩: "Stade Rennais",
  霍芬海姆: "Hoffenheim", 马姆罗迪日落: "Mamelodi Sundowns",
  马德里竞技: "Atlético Madrid", 马略卡: "RCD Mallorca", 马赛: "Marseille",
  南安普顿: "Southampton", 沙尔克04: "Schalke 04", 皇家贝蒂斯: "Real Betis",
  费城联合: "Philadelphia Union", 新英格兰革命: "New England Revolution",
  莱万特: "Levante", 河床: "River Plate", 里泽体育: "Caykur Rizespor",
  大不里士拖拉机: "Tractor", 雷克斯汉姆: "Wrexham", 卡迪西亚: "Al-Qadsiah",
  阿尔乌拉: "Al-Ula", 兹沃勒: "PEC Zwolle", 奈季玛: "Al-Najma",
  明尼苏达联: "Minnesota United", 萨格勒布迪纳摩: "Dinamo Zagreb",
  普马斯: "Pumas UNAM", 布拉迪斯拉发斯洛万: "Slovan Bratislava",
  桑托斯: "Santos", 利马索尔AEL: "AEL Limassol", 奥兰多海盗: "Orlando Pirates",
  圣吉罗斯联: "Union Saint-Gilloise", 柏林联合: "Union Berlin",
  利雅得国民: "Al-Nassr Dubai", 沙迦联赛: "UAE league", FC首尔: "FC Seoul",
  根克: "Genk", 阿赫利开罗: "Al Ahly", 吉达联合: "Al-Ittihad",
  侯赛因竞技: "Al-Hussein", 埃斯特格拉尔: "Esteghlal",
  凯尔特人: "Celtic", 登德尔: "Dender", 芝加哥火焰: "Chicago Fire",
  赫尔城: "Hull City", 流浪者: "Rangers", 奥兰多城: "Orlando City",
  巴恩斯利: "Barnsley", 诺维奇: "Norwich City", 多伦多FC: "Toronto FC",
  哈伊杜克: "Hajduk Split", 安德莱赫特: "Anderlecht", 奥斯汀FC: "Austin FC",
  加济安泰普: "Gaziantep", 桑普多利亚: "Sampdoria", 萨索洛: "Sassuolo",
  布伦比: "Brondby", 年轻人: "Young Boys", 比亚韦斯托克亚盖隆尼亚: "Jagiellonia",
  巴尼亚卢卡战士: "Borac Banja Luka", 阿斯塔纳: "Astana", 帕福斯: "Pafos",
  比尔森胜利: "Viktoria Plzen", 卡尔斯鲁厄: "Karlsruher SC",
  萨尔茨堡红牛: "Red Bull Salzburg", 里耶卡: "Rijeka",
  门兴格拉德巴赫: "Borussia Monchengladbach", 格拉茨风暴: "Sturm Graz",
  克卢日大学: "Universitatea Cluj", 利贝雷茨斯洛万: "Slovan Liberec",
  辛辛那提FC: "FC Cincinnati", 夏洛特FC: "Charlotte FC",
  温哥华白浪: "Vancouver Whitecaps", 西雅图海湾人: "Seattle Sounders",
  哥伦布机员: "Columbus Crew", 考文垂: "Coventry City", 图卢兹: "Toulouse",
  纽约城: "New York City FC", 利兹联: "Leeds United",
  塞罗波特尼奥: "Cerro Porteno", 莫斯科迪纳摩: "Dynamo Moscow",
  格雷米奥: "Gremio", 米内罗竞技: "Atletico Mineiro",
  圣洛伦索: "San Lorenzo", 拉努斯: "Lanus", 圣保罗: "Sao Paulo",
  阿尔艾因: "Al Ain", 独立里瓦达维亚: "Independiente Rivadavia",
  独立队: "Independiente", 奥林匹亚: "Olimpia", 朴茨茅斯: "Portsmouth",
  红牛布拉甘蒂诺: "RB Bragantino", 塔列雷斯: "Talleres",
};

// 英文模式将带变音符号的人名/词汇转写为美式 ASCII 拼写（Yıldız→Yildiz, Ødegaard→Odegaard）
const specialChars: Record<string, string> = {
  ı: "i", İ: "I", ø: "o", Ø: "O", æ: "ae", Æ: "Ae",
  ß: "ss", đ: "d", Đ: "D", ł: "l", Ł: "L", þ: "th",
  Þ: "Th", ð: "d", Ð: "D", œ: "oe", Œ: "Oe",
};

export function anglicize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ıİøØæÆßđĐłŁþÞðÐœŒ]/g, (c) => specialChars[c] ?? c);
}

export function trPosition(pos: string): string {
  return pos.split("/").map((p) => posMap[p] ?? p).join(" / ");
}

export function trClub(club: string): string {
  return clubMap[club] ?? club;
}

// 从 "哈维尔·阿吉雷 (Javier Aguirre)" 提取英文名
export function trCoach(coach: string): string {
  const m = coach.match(/\(([^)]+)\)/);
  return m ? m[1] : coach;
}
