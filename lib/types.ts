export interface KeyPlayer {
  name: string; // 中文名
  nameEn: string;
  position: string;
  club: string;
  blurb: string; // 一两句技术特点
}

export type ExpectationTag =
  | "夺冠热门"
  | "潜在黑马"
  | "淘汰赛级别"
  | "小组赛搅局者"
  | "重在参与";

export interface Team {
  id: string;
  name: string; // 中文名
  nameEn: string;
  flag: string; // emoji
  group: string; // A-L
  confederation: string; // 欧足联 / 南美足联 / ...
  ranking: number; // FIFA 排名（约 2025 年末）
  appearances: number; // 第几次参加世界杯（含本届）
  bestResult: string; // 历史最佳战绩
  coach: string;
  tag: ExpectationTag;
  style: string; // 技术风格分析
  expectation: string; // 球界/大众期待
  keyPlayers: KeyPlayer[];
}

export interface PlayerCard extends KeyPlayer {
  teamId: string;
  teamName: string;
  teamFlag: string;
  group: string;
}

export interface PlayerDetail {
  overall: number; // 综合评分 0-99
  birthYear?: number;
  height?: number; // cm
  ratings: { label: string; value: number }[]; // 六维评分
  background: string; // 职业背景
  funFact?: string; // 冷知识（无可靠轶事时省略）
}
