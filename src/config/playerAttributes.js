export const playerBaseStats = {
  // 基础属性
  baseHp: 100,
  baseAttack: 5,
  baseDefense: 2,
  baseSpeed: 10,
  baseCritRate: 0.05,
  baseCritDamage: 1.5,
  
  // 每级成长率
  hpGrowth: 1.1,
  attackGrowth: 1.08,
  defenseGrowth: 1.07,
  speedGrowth: 1.03,
  critRateGrowth: 0.01,
  critDamageGrowth: 0.05,
}

export const levelExpRequirements = {
  // 计算升级所需经验
  getExpNeededForLevel: (level) => {
    return Math.floor(100 * Math.pow(1.2, level - 1));
  },
  
  // 根据当前等级获取总共需要多少经验
  getTotalExpForLevel: (level) => {
    let total = 0;
    for (let i = 1; i < level; i++) {
      total += Math.floor(100 * Math.pow(1.2, i - 1));
    }
    return total;
  }
}

export const characterClasses = {
  fighter: {
    name: "战士",
    description: "耐久型角色，拥有更高生命值和防御力",
    attackMultiplier: 1.0,
    defenseMultiplier: 1.3,
    hpMultiplier: 1.4,
    speedMultiplier: 0.9,
    critRateMultiplier: 0.8,
    critDamageMultiplier: 1.0
  },
  rogue: {
    name: "盗贼",
    description: "敏捷型角色，拥有更高爆击率和速度",
    attackMultiplier: 1.1,
    defenseMultiplier: 0.8,
    hpMultiplier: 0.9,
    speedMultiplier: 1.4,
    critRateMultiplier: 1.5,
    critDamageMultiplier: 1.3
  },
  mage: {
    name: "法师",
    description: "输出型角色，拥有更高攻击力和爆伤",
    attackMultiplier: 1.4,
    defenseMultiplier: 0.7,
    hpMultiplier: 0.8,
    speedMultiplier: 1.0,
    critRateMultiplier: 1.2,
    critDamageMultiplier: 1.5
  }
}

export const calculatePlayerStats = (player) => {
  // 获取职业加成
  const classMultipliers = characterClasses[player.characterClass] || characterClasses.fighter;
  
  // 基础属性计算
  const level = player.level;
  const levelFactor = level - 1;
  
  // 计算基础属性值
  const maxHp = Math.floor(playerBaseStats.baseHp * Math.pow(playerBaseStats.hpGrowth, levelFactor) * classMultipliers.hpMultiplier);
  const baseAttack = Math.floor(playerBaseStats.baseAttack * Math.pow(playerBaseStats.attackGrowth, levelFactor) * classMultipliers.attackMultiplier);
  const baseDefense = Math.floor(playerBaseStats.baseDefense * Math.pow(playerBaseStats.defenseGrowth, levelFactor) * classMultipliers.defenseMultiplier);
  const speed = Math.floor(playerBaseStats.baseSpeed * Math.pow(playerBaseStats.speedGrowth, levelFactor) * classMultipliers.speedMultiplier);
  const critRate = (playerBaseStats.baseCritRate + levelFactor * playerBaseStats.critRateGrowth) * classMultipliers.critRateMultiplier;
  const critDamage = (playerBaseStats.baseCritDamage + levelFactor * playerBaseStats.critDamageGrowth) * classMultipliers.critDamageMultiplier;
  
  return {
    maxHp,
    baseAttack,
    baseDefense,
    speed,
    critRate,
    critDamage
  };
} 