// 宠物系统配置
export const petConfig = {
  // 初始宠物属性
  initialStats: {
    level: 1,
    exp: 0,
    
    // 核心属性
    strength: 3,       // 力量：影响攻击力
    agility: 3,        // 敏捷：影响闪避率和暴击率
    vitality: 3,       // 体力：影响最大生命值
    intelligence: 3,   // 智力：影响魔法攻击和魔法防御
    
    // 战斗属性
    baseAttack: 3,
    baseDefense: 1,
    baseMaxHp: 50,
    currentHp: 50,
    
    // 特殊宠物属性
    loyalty: 50,       // 忠诚度(0-100)
    happiness: 50,     // 快乐度(0-100)
    
    // 装备栽
    equipment: {
      collar: null,    // 项圈
      armor: null,     // 护甲  
      accessory: null  // 饰品
    }
  },
  
  // 宠物类型
  petTypes: [
    {
      id: 'dog',
      name: '小狗',
      icon: '🐕',
      description: '忠诚的伙伴，擅长增加主人的攻击力。',
      bonusType: 'attack', // 宠物提供的加成类型
      bonusValue: 10,      // 基础加成值
      growthRates: {       // 属性成长率
        strength: 1.2,
        agility: 1.1,
        vitality: 1.0,
        intelligence: 0.8
      },
      // 特殊技能
      specialAbility: {
        name: '忠诚守护',
        description: '有几率替主人承受伤害',
        triggerChance: 0.15, // 15%触发几率
        effect: 'takeDamage'
      }
    },
    {
      id: 'cat',
      name: '猫咪',
      icon: '🐈',
      description: '灵巧的伙伴，擅长增加主人的闪避率。',
      bonusType: 'dodgeRate',
      bonusValue: 5,
      growthRates: {
        strength: 0.9,
        agility: 1.3,
        vitality: 0.9,
        intelligence: 1.1
      },
      specialAbility: {
        name: '灵巧闪避',
        description: '有几率帮助主人一起闪避攻击',
        triggerChance: 0.2,
        effect: 'dodgeAttack'
      }
    },
    {
      id: 'bird',
      name: '小鸟',
      icon: '🐦',
      description: '机智的伙伴，擅长发现稀有物品。',
      bonusType: 'itemFindBonus',
      bonusValue: 15,
      growthRates: {
        strength: 0.7,
        agility: 1.2,
        vitality: 0.8,
        intelligence: 1.3
      },
      specialAbility: {
        name: '宝物探测',
        description: '战斗后有几率额外获得物品',
        triggerChance: 0.1,
        effect: 'findItem'
      }
    },
    {
      id: 'rabbit',
      name: '兔子',
      icon: '🐇',
      description: '幸运的伙伴，增加金币和经验获取。',
      bonusType: 'expBonus',
      bonusValue: 8,
      growthRates: {
        strength: 0.8,
        agility: 1.1,
        vitality: 1.0,
        intelligence: 1.1
      },
      specialAbility: {
        name: '幸运兔脚',
        description: '战斗后有几率获得额外金币和经验',
        triggerChance: 0.15,
        effect: 'bonusRewards'
      }
    },
    {
      id: 'dragon',
      name: '小龙',
      icon: '🐉',
      description: '稀有的宠物，全属性加成。',
      bonusType: 'allStats',
      bonusValue: 5,
      growthRates: {
        strength: 1.2,
        agility: 1.2,
        vitality: 1.2,
        intelligence: 1.2
      },
      specialAbility: {
        name: '龙息',
        description: '有几率对敌人造成额外伤害',
        triggerChance: 0.1,
        effect: 'extraDamage'
      }
    }
  ],
  
  // 宠物装备
  petEquipment: {
    // 项圈
    collar: [
      { name: "普通项圈", attack: 2, vitality: 1, rarity: "普通" },
      { name: "坚固项圈", attack: 4, vitality: 2, rarity: "魔法" },
      { name: "魔法项圈", attack: 7, vitality: 3, intelligence: 2, rarity: "稀有" },
      { name: "守护项圈", attack: 12, vitality: 5, defense: 5, rarity: "史诗" },
      { name: "传说项圈", attack: 20, allStats: 3, lifeSteal: 5, rarity: "传说" }
    ],
    
    // 护甲
    armor: [
      { name: "轻型宠物甲", defense: 3, vitality: 1, rarity: "普通" },
      { name: "增强宠物甲", defense: 6, vitality: 2, rarity: "魔法" },
      { name: "魔法宠物甲", defense: 10, vitality: 3, intelligence: 2, rarity: "稀有" },
      { name: "元素宠物甲", defense: 15, vitality: 5, allResistance: 10, rarity: "史诗" },
      { name: "神话宠物甲", defense: 25, vitality: 8, allStats: 3, rarity: "传说" }
    ],
    
    // 饰品
    accessory: [
      { name: "小铃铛", agility: 2, intelligence: 1, rarity: "普通" },
      { name: "幸运符", luck: 3, goldBonus: 5, rarity: "魔法" },
      { name: "魔法徽章", intelligence: 4, manaRegen: 3, rarity: "稀有" },
      { name: "元素宝石", allStats: 2, elemDamage: 10, rarity: "史诗" },
      { name: "命运护符", allStats: 4, critRate: 5, expBonus: 10, rarity: "传说" }
    ]
  },
  
  // 计算规则
  calculations: {
    // 宠物升级所需经验
    expToNextLevel: (level) => Math.floor(80 * Math.pow(1.15, level - 1)),
    
    // 根据属性计算战斗属性
    maxHp: (vitality, level, petType) => {
      const baseValue = 40 + (vitality * 8);
      const growthRate = petType.growthRates.vitality;
      return Math.floor(baseValue * Math.pow(growthRate, level - 1));
    },
    
    attackPower: (strength, level, petType) => {
      const baseValue = strength * 1.5;
      const growthRate = petType.growthRates.strength;
      return Math.floor(baseValue * Math.pow(growthRate, level - 1));
    },
    
    defensePower: (vitality, level, petType) => {
      const baseValue = vitality * 1.2;
      const growthRate = petType.growthRates.vitality;
      return Math.floor(baseValue * Math.pow(growthRate, level - 1));
    },
    
    critRate: (agility, level, petType) => {
      const baseValue = 3 + (agility * 0.2);
      const growthRate = petType.growthRates.agility;
      return Math.floor(baseValue * Math.pow(growthRate, level - 1));
    },
    
    // 宠物快乐度减少速率
    happinessDecayRate: 0.2,  // 每分钟减少的快乐度
    
    // 计算宠物对主人的属性加成
    calculateBonus: (petType, petLevel, petLoyalty) => {
      const loyaltyFactor = petLoyalty / 100;  // 忠诚度因子
      const levelFactor = 1 + (petLevel - 1) * 0.1;  // 等级因子
      return petType.bonusValue * loyaltyFactor * levelFactor;
    }
  },
  
  // 互动类型
  interactions: [
    {
      id: 'feed',
      name: '喂食',
      description: '增加宠物的快乐度',
      happinessGain: 15,
      loyaltyGain: 2,
      cooldown: 30 * 60 * 1000, // 30分钟冷却
      cost: { gold: 10 }
    },
    {
      id: 'play',
      name: '玩耍',
      description: '大幅增加宠物的快乐度和忠诚度',
      happinessGain: 25,
      loyaltyGain: 5,
      cooldown: 60 * 60 * 1000, // 1小时冷却
      cost: { gold: 0 }
    },
    {
      id: 'train',
      name: '训练',
      description: '增加宠物获取经验',
      expGain: 20,
      happinessGain: -5,
      loyaltyGain: 3,
      cooldown: 45 * 60 * 1000, // 45分钟冷却
      cost: { gold: 25 }
    },
    {
      id: 'groom',
      name: '梳理',
      description: '适度增加快乐度和忠诚度',
      happinessGain: 10,
      loyaltyGain: 3,
      cooldown: 40 * 60 * 1000, // 40分钟冷却
      cost: { gold: 5 }
    }
  ],
  
  // 宠物获取方式
  acquisitionMethods: [
    {
      id: 'purchase',
      name: '购买',
      description: '花费金币购买宠物',
      availablePets: ['dog', 'cat', 'rabbit'],
      cost: { gold: 1000 }
    },
    {
      id: 'quest',
      name: '冒险发现',
      description: '在冒险中有几率发现稀有宠物',
      availablePets: ['bird', 'dragon'],
      chance: 0.02  // 2%的概率在击败怪物后获得
    }
  ]
}; 