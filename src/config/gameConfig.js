// 游戏基础配置
export const gameConfig = {
  // 游戏默认设置
  defaultSettings: {
    tickRate: 1000,
    maxCombatLogs: 5,
    saveKey: 'idleGameSave',
    maxInventorySize: 20  // 添加背包最大容量
  }
};

// 角色属性配置
export const playerConfig = {
  // 初始角色属性
  initialStats: {
    level: 1,
    exp: 0,
    gold: 0,
    
    // 核心属性
    strength: 5,      // 力量：影响攻击力
    agility: 5,       // 敏捷：影响闪避率和暴击率
    vitality: 5,      // 体力：影响最大生命值
    intelligence: 5,  // 智力：影响魔法攻击和魔法防御
    luck: 5,          // 幸运：影响掉落率和暴击伤害
    
    // 战斗属性
    baseAttack: 5,
    baseDefense: 2,
    baseMaxHp: 100,
    baseMana: 50,
    currentHp: 100,
    currentMana: 50,
    
    // 附加战斗属性
    critRate: 5,       // 暴击率(%)
    critDamage: 150,   // 暴击伤害(%)
    dodgeRate: 3,      // 闪避率(%)
    lifeSteal: 0,      // 生命偷取(%)
    expBonus: 0,       // 经验加成(%)
    goldBonus: 0,      // 金币加成(%)
    itemFindBonus: 0,  // 物品发现加成(%)
    
    // 装备栏
    equipment: {
      weapon: null,
      armor: null,
      helmet: null,
      boots: null,
      accessory1: null,
      accessory2: null
    },
    
    // 背包
    inventory: [],
    inventorySize: 20,  // 初始背包大小
    
    // 自动售出设置
    autoSellConfig: {
      enabled: false,
      byQuality: {
        普通: true,
        优质: false,
        稀有: false,
        史诗: false,
        传说: false
      },
      compareWithEquipped: true, // 是否与已装备物品比较
      keepBetterItems: true      // 保留比当前装备更好的物品
    }
  },
  
  // 属性计算规则
  calculations: {
    // 升级所需经验
    expToNextLevel: (level) => Math.floor(100 * Math.pow(1.2, level - 1)),
    
    // 根据属性计算战斗属性
    maxHp: (vitality, level) => Math.floor(50 + (vitality * 10) * Math.pow(1.05, level - 1)),
    maxMana: (intelligence, level) => Math.floor(30 + (intelligence * 5) * Math.pow(1.05, level - 1)),
    attackPower: (strength, level) => Math.floor(strength * 2 * Math.pow(1.05, level - 1)),
    defensePower: (vitality, level) => Math.floor(vitality * 1.5 * Math.pow(1.05, level - 1)),
    magicPower: (intelligence, level) => Math.floor(intelligence * 2 * Math.pow(1.05, level - 1)),
    critRate: (agility, luck) => 5 + Math.floor(agility * 0.2 + luck * 0.3),
    critDamage: (luck) => 150 + luck * 3,
    dodgeRate: (agility) => 3 + Math.floor(agility * 0.25),
    itemFindRate: (luck) => luck * 2
  },
  
  // 属性描述 (用于显示提示)
  statDescriptions: {
    strength: "力量：增加物理攻击力",
    agility: "敏捷：增加闪避率和暴击率",
    vitality: "体力：增加最大生命值和物理防御",
    intelligence: "智力：增加魔法攻击和魔法防御",
    luck: "幸运：增加掉落率、暴击率和暴击伤害",
    critRate: "暴击率：攻击造成暴击的几率",
    critDamage: "暴击伤害：暴击时造成的额外伤害百分比",
    dodgeRate: "闪避率：完全回避敌人攻击的几率",
    lifeSteal: "生命偷取：攻击时回复生命的百分比",
    expBonus: "经验加成：获得额外经验的百分比",
    goldBonus: "金币加成：获得额外金币的百分比",
    itemFindBonus: "物品发现：获得物品的几率提升"
  }
};

// 怪物属性配置
export const monsterConfig = {
  // 怪物属性计算规则
  calculations: {
    hp: (baseHp, level) => Math.floor(baseHp * Math.pow(1.1, level - 1)),
    exp: (baseExp, level) => Math.floor(baseExp * Math.pow(1.1, level - 1)),
    gold: (baseGold, level) => Math.floor(baseGold * Math.pow(1.1, level - 1)),
    attack: (level) => Math.floor(3 * Math.pow(1.1, level - 1)),
    defense: (level) => Math.floor(1 * Math.pow(1.1, level - 1))
  }
};

// 物品属性配置
export const itemConfig = {
  rarityLevels: ["普通", "优质", "稀有", "史诗", "传说"],
  
  // 各稀有度的颜色代码
  rarityColors: {
    "普通": "#9d9d9d",
    "优质": "#2e8b57",
    "稀有": "#0070dd",
    "史诗": "#a335ee",
    "传说": "#ff8000"
  },
  
  // 物品类型
  itemTypes: {
    weapon: [
      { name: "木剑", attack: 3, strength: 1, quality: "普通" },
      { name: "铁剑", attack: 8, strength: 2, quality: "优质" },
      { name: "钢剑", attack: 15, strength: 3, quality: "稀有" },
      { name: "魔法剑", attack: 25, strength: 5, intelligence: 3, quality: "史诗" },
      { name: "龙骨剑", attack: 40, strength: 8, critRate: 5, quality: "传说" }
    ],
    armor: [
      { name: "布甲", defense: 3, vitality: 1, quality: "普通" },
      { name: "皮甲", defense: 8, vitality: 2, quality: "优质" },
      { name: "铁甲", defense: 15, vitality: 3, quality: "稀有" },
      { name: "魔法铠甲", defense: 25, vitality: 5, intelligence: 3, quality: "史诗" },
      { name: "龙鳞甲", defense: 40, vitality: 8, dodgeRate: 3, quality: "传说" }
    ],
    helmet: [
      { name: "布帽", defense: 2, intelligence: 1, quality: "普通" },
      { name: "皮帽", defense: 5, intelligence: 2, quality: "优质" },
      { name: "铁盔", defense: 10, vitality: 2, quality: "稀有" },
      { name: "魔法头盔", defense: 18, intelligence: 4, mana: 20, quality: "史诗" },
      { name: "智慧王冠", defense: 25, intelligence: 7, mana: 50, quality: "传说" }
    ],
    boots: [
      { name: "布鞋", defense: 1, agility: 1, quality: "普通" },
      { name: "皮靴", defense: 3, agility: 2, quality: "优质" },
      { name: "铁靴", defense: 7, vitality: 2, quality: "稀有" },
      { name: "魔法靴", defense: 12, agility: 4, dodgeRate: 2, quality: "史诗" },
      { name: "疾风靴", defense: 18, agility: 7, dodgeRate: 5, quality: "传说" }
    ],
    accessory1: [
      { name: "幸运符", luck: 1, quality: "普通" },
      { name: "力量护符", strength: 2, quality: "优质" },
      { name: "守护石", defense: 5, vitality: 2, quality: "稀有" },
      { name: "英雄勋章", attack: 8, defense: 8, quality: "史诗" },
      { name: "龙心宝石", allStats: 3, goldBonus: 10, quality: "传说" }
    ],
    accessory2: [
      { name: "铜戒指", luck: 1, quality: "普通" },
      { name: "银戒指", itemFindBonus: 5, quality: "优质" },
      { name: "金戒指", goldBonus: 10, quality: "稀有" },
      { name: "魔法戒指", expBonus: 15, quality: "史诗" },
      { name: "命运之戒", critRate: 5, critDamage: 30, quality: "传说" }
    ]
  },
  
  // 售出价格系数 (按品质)
  sellPriceMultiplier: {
    "普通": 0.4,
    "优质": 0.5,
    "稀有": 0.6, 
    "史诗": 0.7,
    "传说": 0.8
  },
  
  // 物品基础价值
  baseValue: {
    weapon: 10,
    armor: 12,
    helmet: 8,
    boots: 8,
    accessory1: 15,
    accessory2: 15
  },
  
  // 品质价值倍数
  qualityValueMultiplier: {
    "普通": 1,
    "优质": 2,
    "稀有": 5,
    "史诗": 10,
    "传说": 25
  }
}; 