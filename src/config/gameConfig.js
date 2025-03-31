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
  },
  
  // 装备掉落系统
  drops: {
    // 基础掉落概率
    baseDropRate: 0.15,  // 基础掉落率15%
    
    // 随等级提升掉落概率系数
    levelDropRateModifier: 0.005, // 每级提升0.5%掉落率
    
    // 怪物类型掉落修正
    typeDropRateModifiers: {
      normal: 1.0,     // 普通怪物
      elite: 1.5,      // 精英怪物
      boss: 2.5,       // Boss
      unique: 3.0      // 特殊怪物
    },
    
    // 品质掉落概率（百分比）
    qualityDropRates: {
      common: 50,    // 普通品质
      magic: 30,     // 魔法品质
      rare: 15,      // 稀有品质
      epic: 4,       // 史诗品质
      legendary: 0.9, // 传说品质
      set: 0.5,      // 套装品质
      unique: 0.3,   // 独特品质
      mythic: 0.1,   // 神话品质
      ancient: 0.05  // 远古品质
    },
    
    // 不同品质怪物对应的品质加成
    monsterQualityBonus: {
      normal: {
        epic: 0.5,       // 普通怪物掉落史诗装备的加成系数
        legendary: 0.1,
        set: 0.1
      },
      elite: {
        epic: 2,
        legendary: 1,
        set: 0.5,
        unique: 0.2
      },
      boss: {
        epic: 5,
        legendary: 3,
        set: 2,
        unique: 1,
        mythic: 0.5,
        ancient: 0.1
      },
      unique: {
        epic: 10,
        legendary: 5,
        set: 4,
        unique: 3,
        mythic: 1,
        ancient: 0.5
      }
    },
    
    // 装备类型掉落权重
    equipmentTypeWeights: {
      weapon: 20,
      offhand: 15,
      helmet: 15,
      shoulders: 12,
      chest: 15,
      gloves: 12,
      belt: 12,
      pants: 12,
      boots: 15,
      amulet: 8,
      ring1: 10,
      ring2: 10
    },
    
    // 区域特定掉落调整
    areaDropAdjustments: {
      forest: {
        equipmentTypeWeights: {
          bow: 3,       // 森林区域弓的掉落权重提高
          dagger: 2,     // 森林区域匕首掉落权重提高
          leather: 2     // 森林区域皮甲掉落权重提高
        },
        qualityDropRates: {
          magic: 1.2    // 森林区域魔法品质掉落率提高20%
        }
      },
      cave: {
        equipmentTypeWeights: {
          mace: 2,      // 洞穴区域锤的掉落权重提高
          shield: 2,     // 洞穴区域盾牌掉落权重提高
          heavy: 2       // 洞穴区域重甲掉落权重提高
        },
        qualityDropRates: {
          rare: 1.2      // 洞穴区域稀有品质掉落率提高20%
        }
      },
      castle: {
        equipmentTypeWeights: {
          sword: 2,      // 城堡区域剑的掉落权重提高
          plate: 2,      // 城堡区域板甲掉落权重提高
          crown: 3       // 城堡区域皇冠掉落权重提高
        },
        qualityDropRates: {
          epic: 1.5      // 城堡区域史诗品质掉落率提高50%
        }
      },
      dungeon: {
        equipmentTypeWeights: {
          staff: 2,      // 地下城区域法杖掉落权重提高
          wand: 2,       // 地下城区域魔杖掉落权重提高
          orb: 3,        // 地下城区域法球掉落权重提高
          robe: 2        // 地下城区域法袍掉落权重提高
        },
        qualityDropRates: {
          legendary: 1.3, // 地下城区域传说品质掉落率提高30%
          set: 1.5       // 地下城区域套装品质掉落率提高50%
        }
      }
    },
    
    // 特殊掉落表（特定怪物掉落特定物品）
    specialDrops: {
      'Dragon': [
        { type: 'weapon', subType: 'sword', name: '龙息之剑', quality: 'legendary', chance: 0.1 },
        { type: 'chest', subType: 'plate', name: '龙鳞胸甲', quality: 'set', chance: 0.08 }
      ],
      'Necromancer': [
        { type: 'weapon', subType: 'staff', name: '亡灵法杖', quality: 'legendary', chance: 0.1 },
        { type: 'offhand', subType: 'book', name: '死灵书典', quality: 'set', chance: 0.08 }
      ],
      'Giant': [
        { type: 'weapon', subType: 'hammer', name: '巨人之锤', quality: 'epic', chance: 0.2 },
        { type: 'gloves', subType: 'gauntlets', name: '巨人手套', quality: 'epic', chance: 0.15 }
      ]
    }
  }
};

// 物品属性配置
export const itemConfig = {
  // 更新稀有度列表与equipment.js保持一致
  rarityLevels: ["普通", "魔法", "稀有", "史诗", "传说", "套装", "独特", "神话", "远古"],
  
  // 各稀有度的颜色代码
  rarityColors: {
    "普通": "#9d9d9d",
    "魔法": "#4444ff",
    "稀有": "#ffff00",
    "史诗": "#a335ee",
    "传说": "#ff8000",
    "套装": "#00ff00",
    "独特": "#ff4500",
    "神话": "#ff00ff",
    "远古": "#00ffff"
  },
  
  // 物品类型 (更新为与equipment.js一致)
  itemTypes: {
    // 武器类型
    weapon: [
      { name: "木剑", type: "sword", attack: 3, strength: 1, quality: "普通" },
      { name: "铁剑", type: "sword", attack: 8, strength: 2, quality: "魔法" },
      { name: "钢剑", type: "sword", attack: 15, strength: 3, quality: "稀有" },
      { name: "魔法剑", type: "sword", attack: 25, strength: 5, intelligence: 3, quality: "史诗" },
      { name: "龙骨剑", type: "sword", attack: 40, strength: 8, critRate: 5, quality: "传说" },
      
      { name: "木弓", type: "bow", attack: 2, agility: 2, quality: "普通" },
      { name: "长弓", type: "bow", attack: 7, agility: 4, quality: "魔法" },
      { name: "复合弓", type: "bow", attack: 14, agility: 6, quality: "稀有" },
      { name: "精灵弓", type: "bow", attack: 22, agility: 8, critRate: 3, quality: "史诗" },
      { name: "风暴弓", type: "bow", attack: 35, agility: 10, critRate: 7, quality: "传说" },
      
      { name: "学徒法杖", type: "staff", attack: 5, intelligence: 3, quality: "普通" },
      { name: "精制法杖", type: "staff", attack: 10, intelligence: 5, quality: "魔法" },
      { name: "秘银法杖", type: "staff", attack: 18, intelligence: 8, quality: "稀有" },
      { name: "奥术法杖", type: "staff", attack: 28, intelligence: 12, manaRegen: 5, quality: "史诗" },
      { name: "元素王杖", type: "staff", attack: 45, intelligence: 15, allStats: 5, quality: "传说" }
    ],
    
    // 副手类型
    offhand: [
      { name: "木盾", type: "shield", defense: 5, vitality: 2, quality: "普通" },
      { name: "铁盾", type: "shield", defense: 10, vitality: 4, blockRate: 3, quality: "魔法" },
      { name: "骑士盾", type: "shield", defense: 20, vitality: 6, blockRate: 5, quality: "稀有" },
      { name: "守护者盾", type: "shield", defense: 35, vitality: 10, blockRate: 8, quality: "史诗" },
      { name: "圣殿盾", type: "shield", defense: 55, vitality: 15, blockRate: 12, quality: "传说" },
      
      { name: "水晶球", type: "orb", intelligence: 3, wisdom: 3, quality: "普通" },
      { name: "预言球", type: "orb", intelligence: 6, wisdom: 6, manaRegen: 3, quality: "魔法" },
      { name: "秘术球", type: "orb", intelligence: 10, wisdom: 8, manaRegen: 5, quality: "稀有" },
      { name: "星辰球", type: "orb", intelligence: 15, wisdom: 12, manaRegen: 8, quality: "史诗" },
      { name: "命运球", type: "orb", intelligence: 22, wisdom: 18, manaRegen: 12, quality: "传说" }
    ],
    
    // 头盔类型
    helmet: [
      { name: "布帽", type: "cloth", defense: 2, intelligence: 1, quality: "普通" },
      { name: "皮帽", type: "leather", defense: 5, vitality: 1, agility: 1, quality: "魔法" },
      { name: "铁盔", type: "plate", defense: 10, vitality: 3, quality: "稀有" },
      { name: "魔法头冠", type: "crown", defense: 18, intelligence: 5, mana: 20, quality: "史诗" },
      { name: "龙骨头盔", type: "helm", defense: 28, strength: 7, vitality: 7, quality: "传说" }
    ],
    
    // 肩甲类型
    shoulders: [
      { name: "布料肩垫", type: "cloth", defense: 2, intelligence: 1, quality: "普通" },
      { name: "皮革护肩", type: "leather", defense: 4, agility: 2, quality: "魔法" },
      { name: "锁链肩甲", type: "medium", defense: 8, vitality: 3, quality: "稀有" },
      { name: "尖刺肩铠", type: "spikes", defense: 15, strength: 4, attack: 5, quality: "史诗" },
      { name: "巨龙肩甲", type: "pauldrons", defense: 25, strength: 6, vitality: 6, intimidation: 3, quality: "传说" }
    ],
    
    // 胸甲类型
    chest: [
      { name: "布衣", type: "cloth", defense: 3, intelligence: 2, quality: "普通" },
      { name: "皮甲", type: "leather", defense: 8, agility: 3, quality: "魔法" },
      { name: "链甲", type: "mail", defense: 15, vitality: 4, strength: 5, quality: "稀有" },
      { name: "符文板甲", type: "plate", defense: 25, strength: 6, vitality: 8, quality: "史诗" },
      { name: "龙鳞胸甲", type: "plate", defense: 40, strength: 10, vitality: 12, fireResistance: 25, quality: "传说" }
    ],
    
    // 手套类型
    gloves: [
      { name: "布手套", type: "cloth", defense: 1, intelligence: 1, quality: "普通" },
      { name: "皮手套", type: "leather", defense: 3, agility: 2, quality: "魔法" },
      { name: "锁链护手", type: "medium", defense: 6, strength: 2, quality: "稀有" },
      { name: "战斗拳套", type: "gauntlets", defense: 12, strength: 5, critRate: 2, quality: "史诗" },
      { name: "泰坦护手", type: "gauntlets", defense: 20, strength: 8, attackSpeed: 5, quality: "传说" }
    ],
    
    // 腰带类型
    belt: [
      { name: "布腰带", type: "cloth", defense: 1, intelligence: 1, quality: "普通" },
      { name: "皮革束带", type: "leather", defense: 3, agility: 2, quality: "魔法" },
      { name: "战士腰带", type: "heavy", defense: 6, strength: 3, quality: "稀有" },
      { name: "巨人束腰", type: "heavy", defense: 12, vitality: 5, strength: 5, quality: "史诗" },
      { name: "不朽腰带", type: "plate", defense: 18, allStats: 3, healthRegen: 5, quality: "传说" }
    ],
    
    // 裤子类型
    pants: [
      { name: "布裤", type: "cloth", defense: 2, intelligence: 1, quality: "普通" },
      { name: "皮裤", type: "leather", defense: 6, agility: 3, quality: "魔法" },
      { name: "链甲护腿", type: "medium", defense: 12, vitality: 3, quality: "稀有" },
      { name: "符文护腿", type: "plate", defense: 20, vitality: 6, strength: 5, quality: "史诗" },
      { name: "守护者战裤", type: "heavy", defense: 32, vitality: 10, strength: 7, moveSpeed: 5, quality: "传说" }
    ],
    
    // 靴子类型
    boots: [
      { name: "布鞋", type: "cloth", defense: 1, moveSpeed: 1, quality: "普通" },
      { name: "皮靴", type: "leather", defense: 3, agility: 2, moveSpeed: 2, quality: "魔法" },
      { name: "钢铁战靴", type: "plate", defense: 8, vitality: 3, quality: "稀有" },
      { name: "疾风靴", type: "light", defense: 15, agility: 7, moveSpeed: 10, quality: "史诗" },
      { name: "时空行者", type: "light", defense: 22, agility: 10, moveSpeed: 15, dodgeRate: 5, quality: "传说" }
    ],
    
    // 项链类型
    amulet: [
      { name: "普通挂坠", type: "pendant", intelligence: 1, wisdom: 1, quality: "普通" },
      { name: "魔力项链", type: "necklace", intelligence: 3, manaRegen: 2, quality: "魔法" },
      { name: "守护符石", type: "talisman", vitality: 3, allResistance: 5, quality: "稀有" },
      { name: "元素之心", type: "amulet", intelligence: 8, elementalDamage: 15, quality: "史诗" },
      { name: "命运之眼", type: "amulet", allStats: 5, cooldownReduction: 10, itemFindBonus: 20, quality: "传说" }
    ],
    
    // 戒指类型
    ring1: [
      { name: "铜戒指", type: "ring", luck: 1, quality: "普通" },
      { name: "银戒指", type: "ring", intelligence: 2, manaRegen: 1, quality: "魔法" },
      { name: "金戒指", type: "signet", strength: 3, vitality: 2, quality: "稀有" },
      { name: "魔法指环", type: "band", critRate: 3, critDamage: 15, quality: "史诗" },
      { name: "权力之戒", type: "ring", allStats: 3, attackSpeed: 5, quality: "传说" }
    ],
    
    ring2: [
      { name: "简易戒指", type: "ring", vitality: 1, quality: "普通" },
      { name: "宝石戒指", type: "ring", strength: 2, quality: "魔法" },
      { name: "守护指环", type: "band", defense: 8, blockRate: 3, quality: "稀有" },
      { name: "法师印记", type: "signet", intelligence: 7, manaRegen: 5, quality: "史诗" },
      { name: "暗影之戒", type: "ring", attackSpeed: 8, lifeSteal: 5, shadowDamage: 15, quality: "传说" }
    ]
  },
  
  // 售出价格系数 (按品质)
  sellPriceMultiplier: {
    "普通": 0.4,
    "魔法": 0.5,
    "稀有": 0.6, 
    "史诗": 0.7,
    "传说": 0.8,
    "套装": 0.8,
    "独特": 0.85,
    "神话": 0.9,
    "远古": 0.95
  },
  
  // 物品基础价值 (扩展为包含所有装备槽位)
  baseValue: {
    weapon: 10,
    offhand: 8,
    helmet: 8,
    shoulders: 7,
    chest: 12,
    gloves: 6,
    belt: 6,
    pants: 9,
    boots: 8,
    amulet: 10,
    ring1: 9,
    ring2: 9
  },
  
  // 品质价值倍数
  qualityValueMultiplier: {
    "普通": 1,
    "魔法": 2,
    "稀有": 5,
    "史诗": 10,
    "传说": 25,
    "套装": 30,
    "独特": 40,
    "神话": 60,
    "远古": 100
  }
}; 