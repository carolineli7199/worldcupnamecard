import { PlayerDetail } from "@/lib/types";

// 评分参考五大联赛同位置水准与近两季表现，仅供学习娱乐
export const detailsAC: Record<string, PlayerDetail> = {
  // ===== 墨西哥 =====
  "mexico:Santiago Giménez": {
    overall: 82, birthYear: 2001, height: 183,
    ratings: [
      { label: "速度", value: 80 }, { label: "射门", value: 84 },
      { label: "传球", value: 72 }, { label: "盘带", value: 76 },
      { label: "防守", value: 40 }, { label: "体魄", value: 79 },
    ],
    background: "出生于阿根廷布宜诺斯艾利斯，父亲是前阿根廷国脚『小巫师』克里斯蒂安·希门尼斯。在克鲁斯阿苏尔成名后登陆费耶诺德，单赛季荷甲23球加冕金靴，2025年初转会AC米兰。",
    funFact: "他本可代表阿根廷出战，但选择了自己成长的墨西哥——父亲当年正是在墨西哥踢球时生下了他。",
  },
  "mexico:Edson Álvarez": {
    overall: 82, birthYear: 1997, height: 187,
    ratings: [
      { label: "速度", value: 70 }, { label: "射门", value: 62 },
      { label: "传球", value: 78 }, { label: "盘带", value: 72 },
      { label: "防守", value: 85 }, { label: "体魄", value: 84 },
    ],
    background: "墨西哥美洲队青训出品，经阿贾克斯历练后加盟西汉姆联，是球队中场的绝对主力。两届世界杯经验，墨西哥战术体系中不可替代的单后腰。",
    funFact: "绰号『Machín』（小机器），因其永不停歇的拦截跑动得名；2019年金杯赛决赛对美国攻入制胜球一战成名。",
  },
  "mexico:Gilberto Mora": {
    overall: 75, birthYear: 2008, height: 170,
    ratings: [
      { label: "速度", value: 82 }, { label: "射门", value: 72 },
      { label: "传球", value: 78 }, { label: "盘带", value: 85 },
      { label: "防守", value: 38 }, { label: "体魄", value: 58 },
    ],
    background: "蒂华纳青训神童，16岁就坐稳墨甲主力并入选国家队，2025年金杯赛夺冠成员。被欧洲多家豪门球探列为重点追踪对象。",
    funFact: "若在揭幕战登场，他将以17岁8个月成为世界杯历史上最年轻的出场球员之一——比球王贝利1958年首秀时还要年轻。",
  },
  "mexico:Raúl Jiménez": {
    overall: 79, birthYear: 1991, height: 190,
    ratings: [
      { label: "速度", value: 70 }, { label: "射门", value: 81 },
      { label: "传球", value: 75 }, { label: "盘带", value: 74 },
      { label: "防守", value: 45 }, { label: "体魄", value: 82 },
    ],
    background: "墨西哥美洲队出道，经本菲卡转战狼队成为英超主力射手，后加盟富勒姆。国家队出场超百场，三届世界杯元老。",
    funFact: "2020年与大卫·路易斯相撞导致颅骨骨折，此后一直戴着保护头带踢球，奇迹般重返英超赛场并继续进球。",
  },
  "mexico:Johan Vásquez": {
    overall: 78, birthYear: 1998, height: 183,
    ratings: [
      { label: "速度", value: 74 }, { label: "射门", value: 50 },
      { label: "传球", value: 74 }, { label: "盘带", value: 68 },
      { label: "防守", value: 80 }, { label: "体魄", value: 80 },
    ],
    background: "经普马斯成名后登陆意甲，在热那亚逐步成长为主力中卫并戴上副队长袖标，是墨西哥防线的旅欧支柱。",
    funFact: "2021年东京奥运会随队夺得铜牌，那届奥运队被认为是墨西哥这一代黄金阵容的起点。",
  },
  "mexico:Guillermo Ochoa": {
    overall: 78, birthYear: 1985, height: 185,
    ratings: [
      { label: "扑救", value: 82 }, { label: "反应", value: 84 },
      { label: "出击", value: 70 }, { label: "站位", value: 78 },
      { label: "出球", value: 68 }, { label: "扑点", value: 80 },
    ],
    background: "美洲队青训传奇，效力过阿雅克肖、格拉纳达、标准列日、萨勒尼塔纳等欧洲多队，40岁仍在塞浦路斯联赛坚持，只为创纪录的第六次世界杯。",
    funFact: "2014年对巴西单场扑出内马尔等人的多次必进球被称为『奥乔亚之墙』——他将成为史上第六位参加六届世界杯的球员，墨西哥人叫他『Memo永不老』。",
  },

  // ===== 韩国 =====
  "south-korea:Son Heung-min": {
    overall: 85, birthYear: 1992, height: 183,
    ratings: [
      { label: "速度", value: 86 }, { label: "射门", value: 88 },
      { label: "传球", value: 82 }, { label: "盘带", value: 83 },
      { label: "防守", value: 42 }, { label: "体魄", value: 76 },
    ],
    background: "父亲孙雄正以『一天颠球三小时』的魔鬼训练亲手打造了他的基本功。汉堡出道，热刺十年成为队史传奇并以队长身份捧起欧联杯，2025年转会洛杉矶FC。亚洲球员历史最佳之一。",
    funFact: "2020年对伯恩利70米一条龙破门获得普斯卡什奖；他还是英超历史首位金靴亚洲得主，且整个职业生涯几乎从不染发纹身——父亲定的家规。",
  },
  "south-korea:Lee Kang-in": {
    overall: 82, birthYear: 2001, height: 173,
    ratings: [
      { label: "速度", value: 76 }, { label: "射门", value: 79 },
      { label: "传球", value: 85 }, { label: "盘带", value: 86 },
      { label: "防守", value: 50 }, { label: "体魄", value: 65 },
    ],
    background: "10岁举家搬到西班牙进入瓦伦西亚青训，是拉玛西亚式培养出的韩国技术流异类。经马略卡爆发后加盟巴黎圣日耳曼，随队夺得欧冠。",
    funFact: "小时候参加韩国综艺《飞吧足球小将》成为全国知名的足球神童，节目里的『袋鼠君』就是他。",
  },
  "south-korea:Kim Min-jae": {
    overall: 84, birthYear: 1996, height: 190,
    ratings: [
      { label: "速度", value: 82 }, { label: "射门", value: 45 },
      { label: "传球", value: 76 }, { label: "盘带", value: 70 },
      { label: "防守", value: 86 }, { label: "体魄", value: 88 },
    ],
    background: "经全北现代、北京国安、费内巴切一路升级，2023年作为那不勒斯意甲夺冠主力中卫荣膺联赛最佳后卫，随即转会拜仁慕尼黑。",
    funFact: "绰号『怪物』来自他在K联赛时期的统治级数据；在中超北京国安效力时中国球迷叫他『金一袋』——因为他一人能防一片。",
  },
  "south-korea:Hwang Hee-chan": {
    overall: 79, birthYear: 1996, height: 177,
    ratings: [
      { label: "速度", value: 85 }, { label: "射门", value: 79 },
      { label: "传球", value: 72 }, { label: "盘带", value: 76 },
      { label: "防守", value: 48 }, { label: "体魄", value: 78 },
    ],
    background: "红牛萨尔茨堡体系出品，与哈兰德做过队友，经莱比锡加盟狼队并曾单赛季英超12球。跑动凶狠的全能前锋。",
    funFact: "绰号『黄牛』（Hwangso），萨尔茨堡时期与哈兰德、南野拓实组成的三叉戟如今全部成为各自国家队的核心。",
  },
  "south-korea:Jo Hyeon-woo": {
    overall: 79, birthYear: 1991, height: 189,
    ratings: [
      { label: "扑救", value: 83 }, { label: "反应", value: 86 },
      { label: "出击", value: 72 }, { label: "站位", value: 76 },
      { label: "出球", value: 68 }, { label: "扑点", value: 80 },
    ],
    background: "大邱FC成名，2018年世界杯一战封神后加盟蔚山现代（蔚山HD），多次当选K联赛最佳门将，国家队与金承奎轮流镇守球门。",
    funFact: "2018年世界杯小组赛2-0击败卫冕冠军德国一役贡献多次神扑，韩国媒体称那场比赛为『喀山奇迹』，他是当晚的MVP。",
  },
  "south-korea:Bae Jun-ho": {
    overall: 75, birthYear: 2003, height: 180,
    ratings: [
      { label: "速度", value: 80 }, { label: "射门", value: 70 },
      { label: "传球", value: 75 }, { label: "盘带", value: 82 },
      { label: "防守", value: 45 }, { label: "体魄", value: 63 },
    ],
    background: "大田公民青训出品，2023年登陆英冠斯托克城后迅速站稳脚跟，盘带成功率位列联赛前茅，被韩媒视为孙兴慜之后的旗手。",
    funFact: "2023年U20世界杯韩国杀入四强，他是那支球队的进攻核心，决赛圈对阵意大利的盘带集锦在韩国疯传。",
  },

  // ===== 南非 =====
  "south-africa:Teboho Mokoena": {
    overall: 77, birthYear: 1997, height: 176,
    ratings: [
      { label: "速度", value: 72 }, { label: "射门", value: 78 },
      { label: "传球", value: 80 }, { label: "盘带", value: 74 },
      { label: "防守", value: 72 }, { label: "体魄", value: 74 },
    ],
    background: "超级体育联队出道，加盟马姆罗迪日落后成为非洲冠军联赛级别的中场核心，南非『黄金中场』的代表人物。",
    funFact: "他的远射是招牌——2024年非洲杯对阵摩洛哥的30米世界波入选当届最佳进球。",
  },
  "south-africa:Ronwen Williams": {
    overall: 78, birthYear: 1992, height: 184,
    ratings: [
      { label: "扑救", value: 80 }, { label: "反应", value: 82 },
      { label: "出击", value: 74 }, { label: "站位", value: 78 },
      { label: "出球", value: 75 }, { label: "扑点", value: 88 },
    ],
    background: "超级体育联队效力多年后加盟马姆罗迪日落，以队长身份带领南非夺得2024年非洲杯季军，当选赛事最佳门将。",
    funFact: "2024年非洲杯四分之一决赛点球大战，他一人扑出佛得角四个点球，创下非洲杯历史纪录，扑点视频全网播放过亿。",
  },
  "south-africa:Lyle Foster": {
    overall: 75, birthYear: 2000, height: 183,
    ratings: [
      { label: "速度", value: 78 }, { label: "射门", value: 75 },
      { label: "传球", value: 68 }, { label: "盘带", value: 72 },
      { label: "防守", value: 42 }, { label: "体魄", value: 80 },
    ],
    background: "奥兰多海盗青训，辗转摩纳哥、葡萄牙后在比利时韦斯特洛爆发，2023年以南非球员历史最高身价加盟伯恩利。",
    funFact: "他公开谈论自己的心理健康困扰并一度暂停比赛，复出后成为运动员心理健康议题在非洲的代言人，被视为更衣室里最勇敢的发声者。",
  },
  "south-africa:Relebohile Mofokeng": {
    overall: 76, birthYear: 2004, height: 173,
    ratings: [
      { label: "速度", value: 84 }, { label: "射门", value: 74 },
      { label: "传球", value: 76 }, { label: "盘带", value: 86 },
      { label: "防守", value: 38 }, { label: "体魄", value: 60 },
    ],
    background: "奥兰多海盗青训出品的超级新星，18岁即成为南超决赛级比赛的关键先生，连续入选非洲年度最佳青年球员候选，被视为南非足球的未来门面。",
    funFact: "他在奥兰多海盗的出场歌是球迷自创的专属配乐——南非媒体说『十年没有一个本土孩子让全国这么兴奋了』，欧洲多家豪门已派球探常驻约翰内斯堡。",
  },
  "south-africa:Themba Zwane": {
    overall: 75, birthYear: 1989, height: 173,
    ratings: [
      { label: "速度", value: 68 }, { label: "射门", value: 74 },
      { label: "传球", value: 82 }, { label: "盘带", value: 83 },
      { label: "防守", value: 40 }, { label: "体魄", value: 60 },
    ],
    background: "大器晚成的传奇，整个巅峰期都效力马姆罗迪日落并拿遍南非国内荣誉，35岁以上仍是国家队进攻组织的大脑。",
    funFact: "绰号『Mshishi』，南非球迷公认『他若早十年留洋，会是欧洲球队的宝藏』——如今他将以37岁高龄完成世界杯首秀。",
  },

  // ===== 捷克 =====
  "czechia:Patrik Schick": {
    overall: 82, birthYear: 1996, height: 191,
    ratings: [
      { label: "速度", value: 76 }, { label: "射门", value: 86 },
      { label: "传球", value: 70 }, { label: "盘带", value: 75 },
      { label: "防守", value: 38 }, { label: "体魄", value: 82 },
    ],
    background: "布拉格斯巴达出道，经桑普多利亚、罗马、莱比锡辗转后在勒沃库森找到归宿，是药厂不败夺冠赛季的重要拼图，德甲单赛季20+球的高效射手。",
    funFact: "2021年欧洲杯对苏格兰的中场吊射（49.7米）被官方评为当届最佳进球，也是欧洲杯历史上最远的运动战进球。",
  },
  "czechia:Pavel Šulc": {
    overall: 78, birthYear: 2000, height: 177,
    ratings: [
      { label: "速度", value: 78 }, { label: "射门", value: 80 },
      { label: "传球", value: 77 }, { label: "盘带", value: 78 },
      { label: "防守", value: 55 }, { label: "体魄", value: 70 },
    ],
    background: "比尔森胜利体系打磨出的得分型攻击中场，单赛季捷甲20+球参与的爆发让他登陆里昂，欧联杯赛场屡有高光，新一代捷克进攻的领军人。",
    funFact: "他在比尔森时期曾单赛季在各项赛事攻入20球——上一个做到这件事的捷克攻击中场，名字叫内德维德。",
  },
  "czechia:Tomáš Souček": {
    overall: 79, birthYear: 1995, height: 192,
    ratings: [
      { label: "速度", value: 65 }, { label: "射门", value: 75 },
      { label: "传球", value: 74 }, { label: "盘带", value: 65 },
      { label: "防守", value: 80 }, { label: "体魄", value: 87 },
    ],
    background: "布拉格斯拉维亚队长出身，2020年加盟西汉姆联后成为英超最稳定的后腰之一，随队夺得2023年欧协联冠军，国家队队长。",
    funFact: "英超单赛季后腰进球纪录保持者之一——他的头球得分数常年位列全队前二，定位球时他是『第二中锋』。",
  },
  "czechia:Vladimír Coufal": {
    overall: 76, birthYear: 1992, height: 179,
    ratings: [
      { label: "速度", value: 74 }, { label: "射门", value: 55 },
      { label: "传球", value: 76 }, { label: "盘带", value: 68 },
      { label: "防守", value: 78 }, { label: "体魄", value: 77 },
    ],
    background: "与苏切克同样出自布拉格斯拉维亚、同样加盟西汉姆联的『捷克双子星』之一，欧协联冠军成员，2025年转战霍芬海姆。",
    funFact: "他和苏切克在俱乐部和国家队并肩作战超过300场，是欧洲足坛著名的『连体婴』组合。",
  },
  "czechia:Adam Hložek": {
    overall: 77, birthYear: 2002, height: 188,
    ratings: [
      { label: "速度", value: 78 }, { label: "射门", value: 78 },
      { label: "传球", value: 74 }, { label: "盘带", value: 75 },
      { label: "防守", value: 40 }, { label: "体魄", value: 81 },
    ],
    background: "17岁就成为布拉格斯巴达史上最年轻队长候选的天才，转会勒沃库森后辗转霍芬海姆找回状态，能踢锋线所有位置。",
    funFact: "16岁2个月就在捷克顶级联赛进球，打破了由内德维德时代保持的多项青年纪录，捷克媒体叫他『新罗西基』。",
  },

  // ===== 加拿大 =====
  "canada:Alphonso Davies": {
    overall: 86, birthYear: 2000, height: 183,
    ratings: [
      { label: "速度", value: 96 }, { label: "射门", value: 72 },
      { label: "传球", value: 78 }, { label: "盘带", value: 85 },
      { label: "防守", value: 76 }, { label: "体魄", value: 80 },
    ],
    background: "出生于加纳难民营的利比里亚裔，5岁随家人移民加拿大。温哥华白浪出道，拜仁慕尼黑将他从边锋改造成世界级左后卫，欧冠冠军核心成员。",
    funFact: "保持着德甲有记录以来的最快冲刺纪录之一（36.51 km/h）；他还是百万粉丝的抖音红人，疫情期间靠搞笑视频出圈。",
  },
  "canada:Jonathan David": {
    overall: 84, birthYear: 2000, height: 180,
    ratings: [
      { label: "速度", value: 84 }, { label: "射门", value: 85 },
      { label: "传球", value: 76 }, { label: "盘带", value: 80 },
      { label: "防守", value: 45 }, { label: "体魄", value: 74 },
    ],
    background: "出生于纽约、成长于渥太华，根特出道后加盟里尔并连续五个赛季法甲15+球，2025年自由转会尤文图斯。加拿大队史射手王。",
    funFact: "绰号『冰人』（Iceman）——队友说他进球后心率都不会变；他是法甲近十年总进球最多的非法国球员之一。",
  },
  "canada:Stephen Eustáquio": {
    overall: 79, birthYear: 1996, height: 178,
    ratings: [
      { label: "速度", value: 68 }, { label: "射门", value: 70 },
      { label: "传球", value: 83 }, { label: "盘带", value: 76 },
      { label: "防守", value: 76 }, { label: "体魄", value: 74 },
    ],
    background: "生于加拿大、长于葡萄牙的双重背景，在波尔图坐稳主力后腰并夺得葡超冠军，是加拿大中场的组织核心。",
    funFact: "他曾入选葡萄牙各级青年队，最终在2019年选择为出生地加拿大效力——这个决定改变了加拿大足球的中场水准。",
  },
  "canada:Tajon Buchanan": {
    overall: 78, birthYear: 1999, height: 183,
    ratings: [
      { label: "速度", value: 88 }, { label: "射门", value: 72 },
      { label: "传球", value: 73 }, { label: "盘带", value: 82 },
      { label: "防守", value: 60 }, { label: "体魄", value: 72 },
    ],
    background: "新英格兰革命出道，经布鲁日、国际米兰历练后加盟比利亚雷亚尔重获稳定出场，速度与花式盘带兼备的右路爆点。",
    funFact: "他在国米时是队史第一位加拿大球员；小时候练过竞技体操，空翻庆祝是保留节目。",
  },
  "canada:Moïse Bombito": {
    overall: 76, birthYear: 2000, height: 191,
    ratings: [
      { label: "速度", value: 84 }, { label: "射门", value: 42 },
      { label: "传球", value: 72 }, { label: "盘带", value: 68 },
      { label: "防守", value: 78 }, { label: "体魄", value: 84 },
    ],
    background: "蒙特利尔出生的刚果裔，走美国大学足球路线被科罗拉多急流选中，2024年登陆法甲尼斯并迅速成为主力，新一代加拿大防线代表。",
    funFact: "他大学时主修的是刑事司法专业——队友开玩笑说他在禁区里执法也同样铁面无私。",
  },
  "canada:Cyle Larin": {
    overall: 76, birthYear: 1995, height: 188,
    ratings: [
      { label: "速度", value: 74 }, { label: "射门", value: 79 },
      { label: "传球", value: 68 }, { label: "盘带", value: 70 },
      { label: "防守", value: 44 }, { label: "体魄", value: 82 },
    ],
    background: "MLS状元秀出身，在贝西克塔斯夺得土超冠军并成为射手王级人物，后转战西甲马略卡，加拿大队史进球纪录的保持者之一。",
    funFact: "2015年他是MLS历史上第一位加拿大籍状元秀，新秀赛季17球的纪录保持了多年。",
  },

  // ===== 瑞士 =====
  "switzerland:Granit Xhaka": {
    overall: 84, birthYear: 1992, height: 186,
    ratings: [
      { label: "速度", value: 60 }, { label: "射门", value: 76 },
      { label: "传球", value: 89 }, { label: "盘带", value: 74 },
      { label: "防守", value: 78 }, { label: "体魄", value: 82 },
    ],
    background: "科索沃阿尔巴尼亚移民家庭出身，巴塞尔出道，阿森纳七年队长生涯毁誉参半，勒沃库森不败夺冠赛季完成生涯救赎，被评为德甲赛季最佳球员，2025年转会桑德兰。",
    funFact: "父亲曾因参加反南斯拉夫游行入狱三年半；哥哥陶兰特代表阿尔巴尼亚出战，兄弟俩在2016年欧洲杯同场对决创造历史。",
  },
  "switzerland:Breel Embolo": {
    overall: 79, birthYear: 1997, height: 187,
    ratings: [
      { label: "速度", value: 82 }, { label: "射门", value: 78 },
      { label: "传球", value: 70 }, { label: "盘带", value: 74 },
      { label: "防守", value: 48 }, { label: "体魄", value: 86 },
    ],
    background: "喀麦隆出生、瑞士长大，巴塞尔17岁成名后经沙尔克、门兴加盟摩纳哥，现效力雷恩。强壮的全能中锋，国家队主力九号位十年。",
    funFact: "2022年世界杯对阵祖国喀麦隆攻入制胜球，他拒绝庆祝并双手合十致歉——这一幕成为当届世界杯最动人的画面之一。",
  },
  "switzerland:Dan Ndoye": {
    overall: 79, birthYear: 2000, height: 180,
    ratings: [
      { label: "速度", value: 87 }, { label: "射门", value: 75 },
      { label: "传球", value: 73 }, { label: "盘带", value: 83 },
      { label: "防守", value: 55 }, { label: "体魄", value: 75 },
    ],
    background: "洛桑青训，经尼斯、巴塞尔到博洛尼亚爆发，2024年随队夺意大利杯并入选欧洲杯最佳阵容讨论，2025年加盟诺丁汉森林。塞内加尔裔瑞士边锋。",
    funFact: "2024年欧洲杯他是全场跑动距离最长的边锋之一，瑞士媒体称他『一个人就是一条边路』。",
  },
  "switzerland:Manuel Akanji": {
    overall: 84, birthYear: 1995, height: 188,
    ratings: [
      { label: "速度", value: 83 }, { label: "射门", value: 50 },
      { label: "传球", value: 84 }, { label: "盘带", value: 76 },
      { label: "防守", value: 85 }, { label: "体魄", value: 83 },
    ],
    background: "尼日利亚-瑞士混血，巴塞尔、多特蒙德历练后加盟曼城，瓜迪奥拉体系下夺得三冠王，能胜任后防所有位置，2025年转会国际米兰。",
    funFact: "他是足坛著名的『心算天才』，曾在节目里几秒内完成三位数乘法，队友测试从未难倒过他。",
  },
  "switzerland:Gregor Kobel": {
    overall: 86, birthYear: 1997, height: 194,
    ratings: [
      { label: "扑救", value: 88 }, { label: "反应", value: 87 },
      { label: "出击", value: 80 }, { label: "站位", value: 84 },
      { label: "出球", value: 78 }, { label: "扑点", value: 80 },
    ],
    background: "霍芬海姆体系出品，斯图加特证明自己后加盟多特蒙德成为德甲顶级门将，2024年欧冠决赛功臣，正式从索默手中接过瑞士一号手套。",
    funFact: "2024年欧冠半决赛对巴黎他单场多次神扑被评全场最佳——德媒统计那个赛季他为多特挽回的预期失球全联盟第一。",
  },
  "switzerland:Remo Freuler": {
    overall: 78, birthYear: 1992, height: 180,
    ratings: [
      { label: "速度", value: 70 }, { label: "射门", value: 70 },
      { label: "传球", value: 80 }, { label: "盘带", value: 74 },
      { label: "防守", value: 77 }, { label: "体魄", value: 78 },
    ],
    background: "亚特兰大时期是加斯佩里尼跑轰体系的发动机，参与了俱乐部史上首次欧冠之旅，后经诺丁汉森林加盟博洛尼亚并夺得意大利杯。",
    funFact: "他来自瑞士的钟表小镇格拉鲁斯，媒体最爱用的比喻是『瑞士钟表般精准的中场』。",
  },

  // ===== 卡塔尔 =====
  "qatar:Akram Afif": {
    overall: 78, birthYear: 1996, height: 177,
    ratings: [
      { label: "速度", value: 80 }, { label: "射门", value: 78 },
      { label: "传球", value: 83 }, { label: "盘带", value: 84 },
      { label: "防守", value: 35 }, { label: "体魄", value: 62 },
    ],
    background: "阿斯拜尔学院最得意的作品，曾在比利亚雷亚尔留洋，回归萨德后统治亚洲赛场：两届亚洲杯冠军、2023年亚洲杯MVP+金靴，三度当选亚洲足球先生。",
    funFact: "2023年亚洲杯决赛他独中三元——全部是点球，这是亚洲杯决赛历史上唯一的『点球帽子戏法』。",
  },
  "qatar:Almoez Ali": {
    overall: 76, birthYear: 1996, height: 180,
    ratings: [
      { label: "速度", value: 78 }, { label: "射门", value: 80 },
      { label: "传球", value: 68 }, { label: "盘带", value: 72 },
      { label: "防守", value: 38 }, { label: "体魄", value: 74 },
    ],
    background: "苏丹出生的归化射手，同样出自阿斯拜尔学院，2019年亚洲杯9球打破单届进球纪录并加冕MVP，杜海勒队史射手王。",
    funFact: "2019年亚洲杯决赛对日本的倒钩破门，让他成为单届亚洲杯进球纪录（9球）保持者，该纪录此前由伊朗传奇阿里·代伊保持。",
  },
  "qatar:Meshaal Barsham": {
    overall: 74, birthYear: 1998, height: 185,
    ratings: [
      { label: "扑救", value: 78 }, { label: "反应", value: 80 },
      { label: "出击", value: 68 }, { label: "站位", value: 72 },
      { label: "出球", value: 70 }, { label: "扑点", value: 74 },
    ],
    background: "萨德主力门将，2023年亚洲杯夺冠的主力国门，以敏捷的横向移动著称，正逐步接过卡塔尔门线的大旗。",
    funFact: "2022年世界杯他作为东道主门将出场时只有24岁，是那届赛事最年轻的首发门将之一。",
  },
  "qatar:Hassan Al-Haydos": {
    overall: 74, birthYear: 1990, height: 175,
    ratings: [
      { label: "速度", value: 68 }, { label: "射门", value: 76 },
      { label: "传球", value: 80 }, { label: "盘带", value: 78 },
      { label: "防守", value: 38 }, { label: "体魄", value: 62 },
    ],
    background: "萨德终身效力的卡塔尔足球旗帜，国家队出场纪录保持者（180+场），以队长身份捧起2019、2023两座亚洲杯，35岁为世界杯梦想再披战袍。",
    funFact: "他16岁就为萨德一线队出场，国家队生涯横跨近20年——卡塔尔孩子们的球衣印名里，Al-Haydos 常年是销量第一。",
  },
  "qatar:Edmilson Junior": {
    overall: 74, birthYear: 1994, height: 175,
    ratings: [
      { label: "速度", value: 82 }, { label: "射门", value: 74 },
      { label: "传球", value: 74 }, { label: "盘带", value: 80 },
      { label: "防守", value: 38 }, { label: "体魄", value: 64 },
    ],
    background: "巴西出生、比利时标准列日成名的归化边锋，在卡塔尔联赛多年保持顶级输出，为国家队提供稀缺的一对一爆破能力。",
    funFact: "他的父亲老埃德米尔森也是职业球员，父子俩都在比利时联赛留下过足迹。",
  },

  // ===== 波黑 =====
  "bosnia:Edin Džeko": {
    overall: 79, birthYear: 1986, height: 193,
    ratings: [
      { label: "速度", value: 55 }, { label: "射门", value: 84 },
      { label: "传球", value: 78 }, { label: "盘带", value: 72 },
      { label: "防守", value: 40 }, { label: "体魄", value: 84 },
    ],
    background: "萨拉热窝围城战中长大的孩子，从狼堡德甲金靴到曼城英超冠军，再到罗马、国米、佛罗伦萨，欧洲五大联赛进球超250个，波黑足球史上最伟大球员。",
    funFact: "儿时全家在战火中靠地下室避难，祖母不让他出门踢球时他就在楼道里颠球——40岁的他将以世界杯历史最年长出场球员之一的身份完成首届世界杯之外的夙愿。",
  },
  "bosnia:Ermedin Demirović": {
    overall: 78, birthYear: 1998, height: 185,
    ratings: [
      { label: "速度", value: 76 }, { label: "射门", value: 79 },
      { label: "传球", value: 72 }, { label: "盘带", value: 73 },
      { label: "防守", value: 50 }, { label: "体魄", value: 82 },
    ],
    background: "汉堡出生的波黑裔，经阿拉维斯、弗赖堡、奥格斯堡（队长）成长为德甲稳定输出的前锋，2024年加盟斯图加特，是哲科身边的接班人。",
    funFact: "他在奥格斯堡戴队长袖标时只有25岁，是德甲当时最年轻的外籍队长之一。",
  },
  "bosnia:Nikola Vasilj": {
    overall: 76, birthYear: 1995, height: 193,
    ratings: [
      { label: "扑救", value: 80 }, { label: "反应", value: 81 },
      { label: "出击", value: 75 }, { label: "站位", value: 77 },
      { label: "出球", value: 74 }, { label: "扑点", value: 72 },
    ],
    background: "莫斯塔尔出身，经泽尼特体系辗转后在圣保利成为绝对主力，随队冲上德甲并以稳定扑救帮助球队保级，波黑国门一号。",
    funFact: "圣保利球迷给他起的外号是『米尔顿之墙』——他单赛季的预期失球差（防出来的球）一度排名德甲第一。",
  },
  "bosnia:Sead Kolašinac": {
    overall: 77, birthYear: 1993, height: 183,
    ratings: [
      { label: "速度", value: 74 }, { label: "射门", value: 55 },
      { label: "传球", value: 72 }, { label: "盘带", value: 65 },
      { label: "防守", value: 80 }, { label: "体魄", value: 90 },
    ],
    background: "沙尔克青训，阿森纳五年后转战马赛，在亚特兰大转型三中卫体系的左中卫并迎来生涯第二春，随队夺得2024年欧联杯。",
    funFact: "2019年他赤手空拳击退持刀劫匪保护队友厄齐尔的视频震惊全网，从此外号『坦克』再无人质疑。",
  },
  "bosnia:Amar Dedić": {
    overall: 76, birthYear: 2002, height: 181,
    ratings: [
      { label: "速度", value: 84 }, { label: "射门", value: 60 },
      { label: "传球", value: 75 }, { label: "盘带", value: 77 },
      { label: "防守", value: 73 }, { label: "体魄", value: 75 },
    ],
    background: "红牛萨尔茨堡体系出品的攻击型右后卫，奥甲多冠后于2025年加盟本菲卡，是波黑阵中少有的正当打之年的旅欧主力。",
    funFact: "他出生在奥地利、在红牛体系长大，国籍选择时拒绝了奥地利队的多次邀请，坚持为父母的祖国波黑出战。",
  },

  // ===== 巴西 =====
  "brazil:Vinícius Júnior": {
    overall: 90, birthYear: 2000, height: 176,
    ratings: [
      { label: "速度", value: 95 }, { label: "射门", value: 84 },
      { label: "传球", value: 81 }, { label: "盘带", value: 93 },
      { label: "防守", value: 30 }, { label: "体魄", value: 70 },
    ],
    background: "弗拉门戈16岁被皇马以4500万欧锁定，从『只会过人不会射门』的争议新星成长为欧冠决赛进球的世界级杀器，两座欧冠+金球奖第二名，当世左边锋天花板。",
    funFact: "2024年金球奖以微弱差距落败后，皇马全队拒绝出席颁奖礼声援他；他基金会在巴西贫民窟资助的足球学校已超过20所。",
  },
  "brazil:Raphinha": {
    overall: 89, birthYear: 1996, height: 176,
    ratings: [
      { label: "速度", value: 87 }, { label: "射门", value: 86 },
      { label: "传球", value: 84 }, { label: "盘带", value: 86 },
      { label: "防守", value: 55 }, { label: "体魄", value: 72 },
    ],
    background: "从波尔图阿莱格里的街头足球走出，经葡体、雷恩、利兹联一路升级加盟巴萨，2024-25赛季以队长级表现轰出生涯巅峰数据，金球奖前三候选。",
    funFact: "他的偶像和导师是小罗——同样出身阿雷格里港，小罗亲自给他打电话劝他加盟巴萨『继承10号精神』。",
  },
  "brazil:Alisson": {
    overall: 88, birthYear: 1992, height: 193,
    ratings: [
      { label: "扑救", value: 90 }, { label: "反应", value: 88 },
      { label: "出击", value: 88 }, { label: "站位", value: 89 },
      { label: "出球", value: 87 }, { label: "扑点", value: 78 },
    ],
    background: "国际队出道，罗马证明自己后以当时门将世界纪录身价加盟利物浦，欧冠、英超、美洲杯冠军拿遍，多年蝉联世界最佳门将讨论的前三名。",
    funFact: "2021年他在补时第95分钟头球绝杀西布朗——门将运动战头球绝杀在英超历史上仅此一例。",
  },
  "brazil:Neymar": {
    overall: 84, birthYear: 1992, height: 175,
    ratings: [
      { label: "速度", value: 78 }, { label: "射门", value: 84 },
      { label: "传球", value: 88 }, { label: "盘带", value: 90 },
      { label: "防守", value: 30 }, { label: "体魄", value: 60 },
    ],
    background: "桑托斯出道惊艳世界，巴萨MSN组合染指一切，巴黎成为世界最贵球员，利雅得新月伤病蹉跎后回归母队桑托斯，用半个赛季的复苏赢回安切洛蒂的信任，第四次出征世界杯。",
    funFact: "他与贝利并列巴西队史射手王（77球级别）——14年前他在桑托斯穿着同样的球衣征服世界，如今从同一个更衣室出发，追逐生涯唯一缺失的大力神杯。",
  },
  "brazil:Marquinhos": {
    overall: 86, birthYear: 1994, height: 183,
    ratings: [
      { label: "速度", value: 80 }, { label: "射门", value: 50 },
      { label: "传球", value: 84 }, { label: "盘带", value: 75 },
      { label: "防守", value: 88 }, { label: "体魄", value: 80 },
    ],
    background: "科林蒂安青训，19岁经罗马加盟巴黎圣日耳曼，效力超过12年成为俱乐部历史出场王和队长，2025年率队夺得队史首座欧冠。",
    funFact: "他是巴黎队史出场纪录保持者，巴黎球迷叫他『O Capitão』；妻子是巴西歌手，两人的婚礼上内马尔是伴郎。",
  },
  "brazil:Bruno Guimarães": {
    overall: 85, birthYear: 1997, height: 182,
    ratings: [
      { label: "速度", value: 72 }, { label: "射门", value: 76 },
      { label: "传球", value: 86 }, { label: "盘带", value: 84 },
      { label: "防守", value: 78 }, { label: "体魄", value: 80 },
    ],
    background: "帕拉纳竞技出道，里昂证明实力后加盟纽卡斯尔成为队长与中场图腾，2025年随队夺得联赛杯——纽卡70年来首座国内冠军。",
    funFact: "他是著名的『点球区域外全能选手』——纽卡球迷统计他单赛季赢得的犯规数全英超第一，外号『争议制造者』兼『裁判最熟的人』。",
  },

  // ===== 摩洛哥 =====
  "morocco:Achraf Hakimi": {
    overall: 88, birthYear: 1998, height: 181,
    ratings: [
      { label: "速度", value: 94 }, { label: "射门", value: 78 },
      { label: "传球", value: 82 }, { label: "盘带", value: 84 },
      { label: "防守", value: 80 }, { label: "体魄", value: 80 },
    ],
    background: "马德里出生的摩洛哥移民之子，皇马青训，经多特、国米到巴黎，2025年作为欧冠冠军主力入围金球奖前三，公认的世界第一右后卫。",
    funFact: "母亲曾做保洁、父亲摆摊养家，他成名后那句『我把工资卡交给妈妈』感动全球；2022年世界杯对西班牙他用『勺子点球』淘汰了自己的出生国。",
  },
  "morocco:Brahim Díaz": {
    overall: 83, birthYear: 1999, height: 171,
    ratings: [
      { label: "速度", value: 82 }, { label: "射门", value: 80 },
      { label: "传球", value: 82 }, { label: "盘带", value: 88 },
      { label: "防守", value: 42 }, { label: "体魄", value: 60 },
    ],
    background: "马拉加出品，经曼城、AC米兰到皇马，2024年放弃西班牙国家队选择父亲血缘的摩洛哥，立刻成为阿特拉斯雄狮阵地战的破局钥匙。",
    funFact: "他曾代表西班牙成年队出场过1次，规则允许下改投摩洛哥——这桩『国籍倒戈』在西班牙引发巨大争论，但他说『为祖父的国家踢球是梦想』。",
  },
  "morocco:Yassine Bounou": {
    overall: 84, birthYear: 1991, height: 192,
    ratings: [
      { label: "扑救", value: 86 }, { label: "反应", value: 85 },
      { label: "出击", value: 80 }, { label: "站位", value: 84 },
      { label: "出球", value: 84 }, { label: "扑点", value: 90 },
    ],
    background: "加拿大蒙特利尔出生，威达竞技青训，塞维利亚时期夺得欧联杯并获扎莫拉奖（西甲最佳门将），2023年转会利雅得新月，世界杯四强的门线英雄。",
    funFact: "2022年世界杯1/8决赛点球大战，他对西班牙『一个没让进』（扑出两个+对方一个射飞），赛后他对着镜头用西班牙语喊话：『我也是在西甲踢球的！』",
  },
  "morocco:Sofyan Amrabat": {
    overall: 80, birthYear: 1996, height: 185,
    ratings: [
      { label: "速度", value: 74 }, { label: "射门", value: 60 },
      { label: "传球", value: 78 }, { label: "盘带", value: 76 },
      { label: "防守", value: 84 }, { label: "体魄", value: 86 },
    ],
    background: "荷兰出生的摩洛哥裔，乌得勒支、维罗纳、佛罗伦萨一路成长，2022年世界杯以恐怖的覆盖面积被评为当届最佳后腰之一，后经曼联转战费内巴切。",
    funFact: "2022年世界杯对西班牙一役，他在腰伤注射封闭的情况下跑了14公里——赛后照片里他扶着腰瘫坐在地，被称为『摩洛哥之盾』。",
  },
  "morocco:Noussair Mazraoui": {
    overall: 82, birthYear: 1997, height: 183,
    ratings: [
      { label: "速度", value: 80 }, { label: "射门", value: 60 },
      { label: "传球", value: 82 }, { label: "盘带", value: 80 },
      { label: "防守", value: 80 }, { label: "体魄", value: 74 },
    ],
    background: "荷兰出生的摩洛哥裔，阿贾克斯青训，经拜仁慕尼黑到曼联，左右边卫通吃的战术多面手，2022年世界杯四强防线的主力。",
    funFact: "他和哈基米一左一右组成的边路，是2022年那道让西班牙、葡萄牙束手无策的『摩洛哥城墙』的两扇门——四年后原班归来。",
  },
  "morocco:Bilal El Khannouss": {
    overall: 80, birthYear: 2004, height: 178,
    ratings: [
      { label: "速度", value: 76 }, { label: "射门", value: 75 },
      { label: "传球", value: 84 }, { label: "盘带", value: 85 },
      { label: "防守", value: 50 }, { label: "体魄", value: 64 },
    ],
    background: "比利时出生的摩洛哥裔，根克青训成名，经莱斯特城登陆斯图加特，狭小空间的持球创造力是摩洛哥阵地战进化的核心拼图，新一代10号。",
    funFact: "2022年世界杯四强战时他才18岁就已随队出征——更衣室里他被叫做『小教授』，因为赛后复盘他总是问战术问题最多的那个。",
  },

  // ===== 苏格兰 =====
  "scotland:Scott McTominay": {
    overall: 83, birthYear: 1996, height: 191,
    ratings: [
      { label: "速度", value: 72 }, { label: "射门", value: 84 },
      { label: "传球", value: 76 }, { label: "盘带", value: 74 },
      { label: "防守", value: 76 }, { label: "体魄", value: 86 },
    ],
    background: "曼联青训出身的兰开夏小伙（凭祖辈血缘代表苏格兰），2024年转会那不勒斯后彻底爆发：意甲夺冠赛季当选联赛MVP，从工兵后腰变身禁区杀手。",
    funFact: "他在曼联被诟病『高位工兵』，到那不勒斯第一个赛季就当选意甲MVP——那不勒斯街头给他画了和马拉多纳同一面墙的壁画。",
  },
  "scotland:Andy Robertson": {
    overall: 83, birthYear: 1994, height: 178,
    ratings: [
      { label: "速度", value: 80 }, { label: "射门", value: 60 },
      { label: "传球", value: 85 }, { label: "盘带", value: 76 },
      { label: "防守", value: 80 }, { label: "体魄", value: 78 },
    ],
    background: "被凯尔特人青训淘汰后一度在玛莎百货打工，从苏格兰第四级别联赛一路逆袭：女王公园、邓迪联、赫尔城到利物浦，成为英超历史助攻最多的后卫之一。",
    funFact: "19岁时他发推特抱怨『生活真难，找份工作都不容易』——如今这条推特已成为足坛最著名的逆袭梗，每年都被球迷翻出来庆祝。",
  },
  "scotland:John McGinn": {
    overall: 80, birthYear: 1994, height: 178,
    ratings: [
      { label: "速度", value: 72 }, { label: "射门", value: 78 },
      { label: "传球", value: 78 }, { label: "盘带", value: 76 },
      { label: "防守", value: 72 }, { label: "体魄", value: 84 },
    ],
    background: "圣米伦、希伯尼安成名，阿斯顿维拉队长，带队从英冠一路杀回欧冠。低重心护球和狡猾的对抗让他成为英超最难抢断的中场之一。",
    funFact: "他的屁股被英媒评为『英超最强武器』之一——独特的护球姿势让对手只能犯规，维拉球迷为此做了专属表情包。",
  },
  "scotland:Lewis Ferguson": {
    overall: 80, birthYear: 1999, height: 181,
    ratings: [
      { label: "速度", value: 74 }, { label: "射门", value: 78 },
      { label: "传球", value: 79 }, { label: "盘带", value: 76 },
      { label: "防守", value: 74 }, { label: "体魄", value: 80 },
    ],
    background: "阿伯丁青训，博洛尼亚队长，率队夺得意大利杯并重返欧冠——意甲赛季最佳中场候选级别的全能型领袖，苏格兰中场的新支柱。",
    funFact: "弗格森家族三代职业球员：祖父、父亲、叔叔都是苏格兰足坛名宿——他是家族第一个在意甲捧杯的人，颁奖那天全家飞到了博洛尼亚。",
  },
  "scotland:Ché Adams": {
    overall: 76, birthYear: 1996, height: 179,
    ratings: [
      { label: "速度", value: 78 }, { label: "射门", value: 77 },
      { label: "传球", value: 70 }, { label: "盘带", value: 72 },
      { label: "防守", value: 45 }, { label: "体魄", value: 80 },
    ],
    background: "英格兰出生（凭祖母血缘选择苏格兰），从第六级别联赛踢起，经伯明翰、南安普顿到都灵，蓝领气质十足的全能中锋。",
    funFact: "他16岁还在英格兰第六级业余联赛踢球兼职，是五大联赛少有的『从草根联赛每一级都踢过』的前锋。",
  },

  // ===== 海地 =====
  "haiti:Duckens Nazon": {
    overall: 71, birthYear: 1994, height: 184,
    ratings: [
      { label: "速度", value: 74 }, { label: "射门", value: 74 },
      { label: "传球", value: 62 }, { label: "盘带", value: 68 },
      { label: "防守", value: 35 }, { label: "体魄", value: 76 },
    ],
    background: "巴黎出生的海地裔，职业生涯辗转英格兰低级别、印度、希腊等十余家俱乐部，却始终是海地国家队最可靠的得分手，队史射手王。",
    funFact: "他曾在英乙的考文垂和狼队之间反复租借，自嘲是『足球吉普赛人』——但为海地出场时进球率超过每两场一球。",
  },
  "haiti:Danley Jean Jacques": {
    overall: 74, birthYear: 2000, height: 178,
    ratings: [
      { label: "速度", value: 74 }, { label: "射门", value: 62 },
      { label: "传球", value: 76 }, { label: "盘带", value: 74 },
      { label: "防守", value: 74 }, { label: "体魄", value: 76 },
    ],
    background: "海地本土天使竞技出道，经葡萄牙吉马良斯打进法甲梅斯并坐稳主力，是这支『流亡之队』中场运转的核心。",
    funFact: "他是近20年来第一位从海地本土联赛直接被欧洲球探签走并站稳五大联赛的球员，被海地媒体称为『道路开辟者』。",
  },
  "haiti:Johny Placide": {
    overall: 72, birthYear: 1988, height: 186,
    ratings: [
      { label: "扑救", value: 77 }, { label: "反应", value: 79 },
      { label: "出击", value: 68 }, { label: "站位", value: 73 },
      { label: "出球", value: 62 }, { label: "扑点", value: 74 },
    ],
    background: "法国出生，勒阿弗尔青训，经兰斯等法国俱乐部后转战希腊。37岁高龄仍是海地门线的精神领袖，2007年至今效力国家队近20年。",
    funFact: "2015年金杯赛他面对美国队做出9次扑救的比赛录像，至今仍是海地足球青训的教学素材。",
  },
  "haiti:Frantzdy Pierrot": {
    overall: 73, birthYear: 1995, height: 191,
    ratings: [
      { label: "速度", value: 70 }, { label: "射门", value: 75 },
      { label: "传球", value: 60 }, { label: "盘带", value: 62 },
      { label: "防守", value: 40 }, { label: "体魄", value: 86 },
    ],
    background: "经美国大学足球和法国甘冈成长，在希腊和以色列联赛（海法马卡比）成为高效中锋，国家队近年进球效率最高的攻击手。",
    funFact: "他在海法马卡比的欧冠资格赛对尤文图斯梅开二度，是海地球员在欧战正赛级别舞台的历史最佳表演。",
  },
  "haiti:Carlens Arcus": {
    overall: 71, birthYear: 1996, height: 180,
    ratings: [
      { label: "速度", value: 76 }, { label: "射门", value: 45 },
      { label: "传球", value: 68 }, { label: "盘带", value: 66 },
      { label: "防守", value: 74 }, { label: "体魄", value: 74 },
    ],
    background: "海地本土出道后登陆法国，在欧塞尔效力多年并随队升上法甲，后转战法国次级联赛，是国家队右路攻防的常驻主力。",
    funFact: "2023年金杯赛对阵墨西哥，他一人防住对方整条左路的表现被官方选入当轮最佳阵容——那是海地队史第一次有边后卫入选。",
  },
};
