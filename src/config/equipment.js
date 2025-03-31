export const EQUIPMENT_CONFIG = {
  // 装备品质
  rarity: {
    common: { name: '普通', color: '#ffffff', multiplier: 1.0 },
    magic: { name: '魔法', color: '#4444ff', multiplier: 1.5 },
    rare: { name: '稀有', color: '#ffff00', multiplier: 2.0 },
    epic: { name: '史诗', color: '#a335ee', multiplier: 2.5 },
    legendary: { name: '传说', color: '#ff8000', multiplier: 3.0 },
    set: { name: '套装', color: '#00ff00', multiplier: 2.8 },
    unique: { name: '独特', color: '#ff4500', multiplier: 3.2 },
    mythic: { name: '神话', color: '#ff00ff', multiplier: 3.5 },
    ancient: { name: '远古', color: '#00ffff', multiplier: 3.8 }
  },

  // 装备类型
  slots: {
    weapon: {
      name: '武器',
      types: ['sword', 'axe', 'bow', 'staff', 'dagger', 'wand', 'mace', 'spear', 'hammer', 'fist', 'scythe', 'crossbow'],
      baseValue: 100,
      prefixes: ['锋利的', '致命的', '毁灭的', '神圣的', '恶魔的', '锻造的', '雷霆', '猎杀', '夜影', '正义', '混沌'],
      suffixes: ['之刃', '之斧', '之弓', '之杖', '之匕', '之棒', '之矛', '之锤', '之拳', '之镰', '之弩']
    },
    offhand: {
      name: '副手',
      types: ['shield', 'orb', 'totem', 'book', 'quiver', 'focus'],
      baseValue: 80,
      prefixes: ['守护的', '魔法的', '灵魂的', '知识的', '箭袋的', '集中的'],
      suffixes: ['盾牌', '宝珠', '图腾', '典籍', '箭袋', '法器']
    },
    helmet: {
      name: '头盔',
      types: ['light', 'medium', 'heavy', 'cloth', 'leather', 'plate', 'crown', 'hat', 'helm'],
      baseValue: 60,
      prefixes: ['智慧的', '守护的', '神圣的', '恶魔的', '视野的', '启迪的', '英勇的'],
      suffixes: ['头盔', '头冠', '面具', '帽子', '首盔', '头饰']
    },
    shoulders: {
      name: '肩甲',
      types: ['light', 'medium', 'heavy', 'cloth', 'leather', 'plate', 'spikes', 'pauldrons'],
      baseValue: 50,
      prefixes: ['威武的', '坚实的', '魔法的', '支配的', '巨大的', '锋利的'],
      suffixes: ['肩甲', '护肩', '肩铠', '肩饰', '肩垫']
    },
    chest: {
      name: '胸甲',
      types: ['light', 'medium', 'heavy', 'cloth', 'leather', 'plate', 'robe', 'mail'],
      baseValue: 90,
      prefixes: ['坚固的', '防御的', '守护的', '神圣的', '恶魔的', '魔法的', '龙鳞'],
      suffixes: ['胸甲', '铠甲', '战甲', '法衣', '链甲', '护胸']
    },
    gloves: {
      name: '手套',
      types: ['light', 'medium', 'heavy', 'cloth', 'leather', 'plate', 'gauntlets'],
      baseValue: 40,
      prefixes: ['灵巧的', '握力的', '魔法的', '力量的', '精准的', '技巧的'],
      suffixes: ['手套', '指套', '护手', '拳套', '掌套']
    },
    belt: {
      name: '腰带',
      types: ['light', 'medium', 'heavy', 'cloth', 'leather', 'plate', 'sash'],
      baseValue: 40,
      prefixes: ['稳固的', '强化的', '魔法的', '支撑的', '储物的', '韧性的'],
      suffixes: ['腰带', '束带', '绑带', '飘带', '腰链']
    },
    pants: {
      name: '裤子',
      types: ['light', 'medium', 'heavy', 'cloth', 'leather', 'plate', 'leggings'],
      baseValue: 70,
      prefixes: ['稳健的', '迅速的', '防护的', '魔法的', '战术的', '冒险的'],
      suffixes: ['护腿', '裤子', '战裤', '绑腿', '腿甲']
    },
    boots: {
      name: '靴子',
      types: ['light', 'medium', 'heavy', 'cloth', 'leather', 'plate', 'sandals'],
      baseValue: 40,
      prefixes: ['迅捷的', '轻盈的', '神圣的', '恶魔的', '追踪的', '稳固的', '疾行的'],
      suffixes: ['靴子', '战靴', '长靴', '凉鞋', '足甲']
    },
    amulet: {
      name: '护符',
      types: ['necklace', 'pendant', 'locket', 'talisman', 'charm'],
      baseValue: 70,
      prefixes: ['神秘的', '增幅的', '魔力的', '守护的', '预言的', '元素的'],
      suffixes: ['项链', '坠饰', '挂坠', '护符', '符咒']
    },
    ring1: {
      name: '戒指1',
      types: ['ring', 'band', 'loop', 'signet', 'seal'],
      baseValue: 60,
      prefixes: ['幸运的', '力量的', '神圣的', '恶魔的', '灵动的', '契约的'],
      suffixes: ['戒指', '指环', '徽记', '印章']
    },
    ring2: {
      name: '戒指2',
      types: ['ring', 'band', 'loop', 'signet', 'seal'],
      baseValue: 60,
      prefixes: ['幸运的', '力量的', '神圣的', '恶魔的', '灵动的', '契约的'],
      suffixes: ['戒指', '指环', '徽记', '印章']
    }
  },

  // 装备属性
  attributes: {
    // 基础属性
    attack: { name: '攻击力', weight: 2, maxValue: 100 },
    defense: { name: '防御力', weight: 2, maxValue: 100 },
    strength: { name: '力量', weight: 3, maxValue: 50 },
    agility: { name: '敏捷', weight: 3, maxValue: 50 },
    vitality: { name: '体力', weight: 3, maxValue: 50 },
    intelligence: { name: '智力', weight: 3, maxValue: 50 },
    wisdom: { name: '智慧', weight: 3, maxValue: 50 },
    charisma: { name: '魅力', weight: 3, maxValue: 50 },
    luck: { name: '幸运', weight: 4, maxValue: 30 },
    
    // 高级属性
    critRate: { name: '暴击率', weight: 5, maxValue: 20, suffix: '%' },
    critDamage: { name: '暴击伤害', weight: 4, maxValue: 100, suffix: '%' },
    dodgeRate: { name: '闪避率', weight: 5, maxValue: 20, suffix: '%' },
    blockRate: { name: '格挡率', weight: 5, maxValue: 20, suffix: '%' },
    lifeSteal: { name: '生命偷取', weight: 4, maxValue: 10, suffix: '%' },
    manaSteal: { name: '法力偷取', weight: 4, maxValue: 10, suffix: '%' },
    
    // 回复相关属性
    healthRegen: { name: '生命恢复', weight: 3, maxValue: 20, suffix: '/秒' },
    manaRegen: { name: '法力恢复', weight: 3, maxValue: 15, suffix: '/秒' },
    healthOnHit: { name: '攻击回血', weight: 4, maxValue: 30 },
    manaOnHit: { name: '攻击回蓝', weight: 4, maxValue: 20 },
    
    // 特殊属性
    expBonus: { name: '经验加成', weight: 3, maxValue: 50, suffix: '%' },
    goldBonus: { name: '金币加成', weight: 3, maxValue: 50, suffix: '%' },
    itemFindBonus: { name: '掉落率', weight: 3, maxValue: 50, suffix: '%' },
    allStats: { name: '全属性', weight: 4, maxValue: 20 },
    moveSpeed: { name: '移动速度', weight: 4, maxValue: 30, suffix: '%' },
    attackSpeed: { name: '攻击速度', weight: 5, maxValue: 40, suffix: '%' },
    cooldownReduction: { name: '冷却减少', weight: 4, maxValue: 20, suffix: '%' },
    
    // 元素属性
    fireDamage: { name: '火焰伤害', weight: 4, maxValue: 100 },
    coldDamage: { name: '冰霜伤害', weight: 4, maxValue: 100 },
    lightningDamage: { name: '闪电伤害', weight: 4, maxValue: 100 },
    poisonDamage: { name: '毒素伤害', weight: 4, maxValue: 100 },
    arcaneDamage: { name: '奥术伤害', weight: 4, maxValue: 100 },
    holydamage: { name: '神圣伤害', weight: 4, maxValue: 100 },
    shadowDamage: { name: '暗影伤害', weight: 4, maxValue: 100 },
    
    // 元素抗性
    fireResistance: { name: '火焰抗性', weight: 3, maxValue: 75, suffix: '%' },
    coldResistance: { name: '冰霜抗性', weight: 3, maxValue: 75, suffix: '%' },
    lightningResistance: { name: '闪电抗性', weight: 3, maxValue: 75, suffix: '%' },
    poisonResistance: { name: '毒素抗性', weight: 3, maxValue: 75, suffix: '%' },
    arcaneResistance: { name: '奥术抗性', weight: 3, maxValue: 75, suffix: '%' },
    holyResistance: { name: '神圣抗性', weight: 3, maxValue: 75, suffix: '%' },
    shadowResistance: { name: '暗影抗性', weight: 3, maxValue: 75, suffix: '%' },
    
    // 状态效果抗性
    stunResistance: { name: '眩晕抗性', weight: 4, maxValue: 60, suffix: '%' },
    bleedResistance: { name: '流血抗性', weight: 4, maxValue: 60, suffix: '%' },
    poisonStatusResistance: { name: '中毒抗性', weight: 4, maxValue: 60, suffix: '%' },
    burnResistance: { name: '灼烧抗性', weight: 4, maxValue: 60, suffix: '%' },
    freezeResistance: { name: '冻结抗性', weight: 4, maxValue: 60, suffix: '%' },
    
    // 加成效果
    bossBonus: { name: '对Boss伤害', weight: 4, maxValue: 50, suffix: '%' },
    eliteBonus: { name: '对精英伤害', weight: 3, maxValue: 40, suffix: '%' },
    humanBonus: { name: '对人型伤害', weight: 3, maxValue: 30, suffix: '%' },
    beastBonus: { name: '对野兽伤害', weight: 3, maxValue: 30, suffix: '%' },
    undeadBonus: { name: '对亡灵伤害', weight: 3, maxValue: 30, suffix: '%' },
    demonBonus: { name: '对恶魔伤害', weight: 3, maxValue: 30, suffix: '%' }
  },

  // 套装系统
  sets: {
    warrior: {
      name: '战士套装',
      pieces: ['weapon', 'chest', 'helmet', 'boots', 'gloves', 'belt', 'pants'],
      bonus: {
        2: { allStats: 10 },
        3: { attack: 50, defense: 50 },
        4: { critRate: 10, critDamage: 50 },
        5: { lifeSteal: 5, blockRate: 10 },
        6: { strength: 30, vitality: 30 },
        7: { stunResistance: 40, coldResistance: 40, fireResistance: 40 }
      }
    },
    mage: {
      name: '法师套装',
      pieces: ['weapon', 'offhand', 'chest', 'helmet', 'boots', 'amulet', 'ring1'],
      bonus: {
        2: { intelligence: 20 },
        3: { fireDamage: 100, coldDamage: 100 },
        4: { manaSteal: 5 },
        5: { allStats: 15, itemFindBonus: 20 },
        6: { arcaneDamage: 80, lightningDamage: 80 },
        7: { cooldownReduction: 15, manaRegen: 10 }
      }
    },
    rogue: {
      name: '盗贼套装',
      pieces: ['weapon', 'offhand', 'chest', 'helmet', 'boots', 'gloves', 'belt'],
      bonus: {
        2: { agility: 20 },
        3: { critRate: 15 },
        4: { dodgeRate: 15 },
        5: { goldBonus: 50, itemFindBonus: 50 },
        6: { attackSpeed: 25, moveSpeed: 15 },
        7: { poisonDamage: 120, critDamage: 75 }
      }
    },
    hunter: {
      name: '猎人套装',
      pieces: ['weapon', 'offhand', 'chest', 'helmet', 'boots', 'gloves', 'pants'],
      bonus: {
        2: { agility: 15, dexterity: 15 },
        3: { attackSpeed: 20 },
        4: { critRate: 10, critDamage: 40 },
        5: { beastBonus: 25, eliteBonus: 25 },
        6: { dodgeRate: 12, moveSpeed: 12 },
        7: { allStats: 25, bossBonus: 30 }
      }
    },
    paladin: {
      name: '圣骑士套装',
      pieces: ['weapon', 'offhand', 'chest', 'helmet', 'boots', 'amulet', 'ring1'],
      bonus: {
        2: { strength: 15, vitality: 15 },
        3: { defense: 40, blockRate: 15 },
        4: { holydamage: 80, holyResistance: 50 },
        5: { healthRegen: 15, manaRegen: 10 },
        6: { allStats: 20, undeadBonus: 40 },
        7: { shadowResistance: 60, demonBonus: 40 }
      }
    },
    necromancer: {
      name: '死灵法师套装',
      pieces: ['weapon', 'offhand', 'chest', 'helmet', 'boots', 'amulet', 'ring1'],
      bonus: {
        2: { intelligence: 15, wisdom: 15 },
        3: { poisonDamage: 80, shadowDamage: 80 },
        4: { lifeSteal: 8, manaSteal: 8 },
        5: { cooldownReduction: 15, allStats: 15 },
        6: { undeadBonus: 30, poisonResistance: 40 },
        7: { shadowResistance: 50, shadowDamage: 100 }
      }
    }
  },

  // 装备生成规则
  generation: {
    // 每个品质可以拥有的属性数量
    attributeCount: {
      common: { min: 1, max: 2 },
      magic: { min: 2, max: 3 },
      rare: { min: 3, max: 4 },
      epic: { min: 4, max: 5 },
      legendary: { min: 5, max: 6 },
      set: { min: 4, max: 5 },
      unique: { min: 5, max: 7 },
      mythic: { min: 6, max: 8 },
      ancient: { min: 7, max: 9 }
    },
    
    // 属性值范围
    attributeRanges: {
      common: { min: 0.5, max: 1.0 },
      magic: { min: 0.8, max: 1.5 },
      rare: { min: 1.2, max: 2.0 },
      epic: { min: 1.8, max: 2.5 },
      legendary: { min: 2.5, max: 3.5 },
      set: { min: 2.0, max: 3.0 },
      unique: { min: 2.8, max: 3.8 },
      mythic: { min: 3.2, max: 4.2 },
      ancient: { min: 3.5, max: 5.0 }
    },
    
    // 特定装备种类的属性概率调整
    slotAttributeBiases: {
      weapon: {
        attack: 5.0, // 武器更可能有攻击力
        critRate: 2.0,
        critDamage: 2.0,
        elementalDamage: 1.5 // 更可能有元素伤害
      },
      offhand: {
        defense: 2.0,
        blockRate: 3.0,
        manaRegen: 2.0
      },
      helmet: {
        intelligence: 2.0,
        wisdom: 2.0
      },
      chest: {
        defense: 3.0,
        vitality: 2.0,
        elementalResistance: 1.5
      },
      gloves: {
        attackSpeed: 2.5,
        critRate: 1.5
      },
      boots: {
        moveSpeed: 3.0,
        dodgeRate: 2.0
      },
      amulet: {
        allStats: 2.0,
        elementalDamage: 1.5,
        manaRegen: 1.5
      },
      ring1: {
        critRate: 1.5,
        critDamage: 1.5,
        luck: 2.0
      },
      ring2: {
        critRate: 1.5,
        critDamage: 1.5,
        luck: 2.0
      }
    }
  }
}; 