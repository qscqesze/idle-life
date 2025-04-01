<template>
  <div class="pet-system">
    <div class="pet-container" v-if="activePet">
      <div class="pet-header">
        <h2>我的宠物</h2>
        <div v-if="activePet" class="pet-switch-controls">
          <button @click="switchPet(-1)" :disabled="currentPetIndex === 0">◀</button>
          <span>{{ currentPetIndex + 1 }} / {{ playerPets.length }}</span>
          <button @click="switchPet(1)" :disabled="currentPetIndex >= playerPets.length - 1">▶</button>
        </div>
      </div>
      
      <div class="pet-details">
        <div class="pet-avatar">
          <div class="pet-icon">{{ activePet.type.icon }}</div>
          <div class="pet-level">Lv.{{ activePet.level }}</div>
          <div class="pet-health-bar">
            <div class="health-bar-fill" :style="{ width: petHealthPercentage + '%' }"></div>
          </div>
          <div class="pet-health-text">{{ Math.floor(activePet.currentHp) }} / {{ Math.floor(activePet.maxHp) }}</div>
        </div>
        
        <div class="pet-info">
          <h3>{{ activePet.name }} <span class="pet-type">({{ activePet.type.name }})</span></h3>
          <p class="pet-description">{{ activePet.type.description }}</p>
          
          <div class="pet-stats">
            <div class="pet-stat">
              <span class="stat-label">攻击:</span>
              <span class="stat-value">{{ totalPetAttack }}</span>
            </div>
            <div class="pet-stat">
              <span class="stat-label">防御:</span>
              <span class="stat-value">{{ totalPetDefense }}</span>
            </div>
            <div class="pet-stat">
              <span class="stat-label">生命值:</span>
              <span class="stat-value">{{ Math.floor(activePet.maxHp) }}</span>
            </div>
            <div class="pet-stat">
              <span class="stat-label">暴击率:</span>
              <span class="stat-value">{{ totalPetCritRate }}%</span>
            </div>
          </div>
          
          <div class="pet-attributes">
            <div class="pet-attribute">
              <span class="attribute-label">力量:</span>
              <span class="attribute-value">{{ activePet.strength }}</span>
            </div>
            <div class="pet-attribute">
              <span class="attribute-label">敏捷:</span>
              <span class="attribute-value">{{ activePet.agility }}</span>
            </div>
            <div class="pet-attribute">
              <span class="attribute-label">体力:</span>
              <span class="attribute-value">{{ activePet.vitality }}</span>
            </div>
            <div class="pet-attribute">
              <span class="attribute-label">智力:</span>
              <span class="attribute-value">{{ activePet.intelligence }}</span>
            </div>
          </div>
          
          <div class="pet-status">
            <div class="status-bar loyalty">
              <div class="status-label">忠诚度</div>
              <div class="status-bar-outer">
                <div class="status-bar-fill" :style="{ width: activePet.loyalty + '%', backgroundColor: getLoyaltyColor(activePet.loyalty) }"></div>
              </div>
              <div class="status-value">{{ Math.floor(activePet.loyalty) }}</div>
            </div>
            <div class="status-bar happiness">
              <div class="status-label">快乐度</div>
              <div class="status-bar-outer">
                <div class="status-bar-fill" :style="{ width: activePet.happiness + '%', backgroundColor: getHappinessColor(activePet.happiness) }"></div>
              </div>
              <div class="status-value">{{ Math.floor(activePet.happiness) }}</div>
            </div>
          </div>
          
          <div class="pet-exp-bar">
            <div class="exp-bar-fill" :style="{ width: petExpPercentage + '%' }"></div>
            <div class="exp-text">{{ activePet.exp }} / {{ expNeededForPetLevelUp }}</div>
          </div>
          
          <div class="pet-special-ability">
            <h4>特殊能力: {{ activePet.type.specialAbility.name }}</h4>
            <p>{{ activePet.type.specialAbility.description }}</p>
            <p class="ability-chance">触发几率: {{ activePet.type.specialAbility.triggerChance * 100 }}%</p>
          </div>
          
          <div class="pet-bonus">
            <h4>主人加成</h4>
            <p>{{ getPetBonusDescription(activePet) }}</p>
          </div>
        </div>
      </div>
      
      <div class="pet-equipment">
        <h3>宠物装备</h3>
        <div class="equipment-slots">
          <div class="equipment-slot" @click="openPetEquipmentSelection('collar')">
            <div v-if="activePet.equipment.collar" class="equipped-item" :class="getRarityClass(activePet.equipment.collar.rarity)">
              <div class="item-name">{{ activePet.equipment.collar.name }}</div>
              <div class="item-stats">{{ getItemStatsText(activePet.equipment.collar) }}</div>
            </div>
            <div v-else class="empty-slot">
              <span>项圈</span>
            </div>
          </div>
          
          <div class="equipment-slot" @click="openPetEquipmentSelection('armor')">
            <div v-if="activePet.equipment.armor" class="equipped-item" :class="getRarityClass(activePet.equipment.armor.rarity)">
              <div class="item-name">{{ activePet.equipment.armor.name }}</div>
              <div class="item-stats">{{ getItemStatsText(activePet.equipment.armor) }}</div>
            </div>
            <div v-else class="empty-slot">
              <span>护甲</span>
            </div>
          </div>
          
          <div class="equipment-slot" @click="openPetEquipmentSelection('accessory')">
            <div v-if="activePet.equipment.accessory" class="equipped-item" :class="getRarityClass(activePet.equipment.accessory.rarity)">
              <div class="item-name">{{ activePet.equipment.accessory.name }}</div>
              <div class="item-stats">{{ getItemStatsText(activePet.equipment.accessory) }}</div>
            </div>
            <div v-else class="empty-slot">
              <span>饰品</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="pet-interactions">
        <h3>互动</h3>
        <div class="interaction-buttons">
          <button 
            v-for="interaction in petConfig.interactions" 
            :key="interaction.id" 
            @click="interactWithPet(interaction)"
            :disabled="isInteractionOnCooldown(interaction) || (interaction.cost && interaction.cost.gold > player.gold)"
            class="interaction-button"
          >
            {{ interaction.name }}
            <span v-if="interaction.cost && interaction.cost.gold > 0" class="interaction-cost">({{ interaction.cost.gold }} 金币)</span>
            <span v-if="isInteractionOnCooldown(interaction)" class="cooldown-timer">
              {{ getInteractionCooldownText(interaction) }}
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="no-pet-container">
      <div class="no-pet-message">
        <h3>你还没有宠物</h3>
        <p>拥有一个宠物可以帮助你在战斗中获得额外的属性加成。</p>
        <button @click="openPetStore" class="get-pet-button">获取宠物</button>
      </div>
    </div>
    
    <!-- 宠物装备选择弹窗 -->
    <div v-if="showEquipmentSelection" class="equipment-selection-modal">
      <div class="modal-content">
        <h3>选择装备</h3>
        <div class="available-equipment">
          <div 
            v-for="(item, index) in availablePetEquipment" 
            :key="index" 
            class="equipment-item" 
            :class="getRarityClass(item.rarity)"
            @click="equipPetItem(item)"
          >
            <div class="item-name">{{ item.name }}</div>
            <div class="item-stats">{{ getItemStatsText(item) }}</div>
          </div>
        </div>
        <button @click="closeEquipmentSelection" class="close-button">关闭</button>
      </div>
    </div>
    
    <!-- 宠物商店弹窗 -->
    <div v-if="showPetStore" class="pet-store-modal">
      <div class="modal-content">
        <h3>宠物商店</h3>
        <div class="available-pets">
          <div 
            v-for="petType in availablePetsForPurchase" 
            :key="petType.id" 
            class="store-pet-item"
            @click="purchasePet(petType)"
            :disabled="player.gold < 1000"
          >
            <div class="store-pet-icon">{{ petType.icon }}</div>
            <div class="store-pet-info">
              <div class="store-pet-name">{{ petType.name }}</div>
              <div class="store-pet-description">{{ petType.description }}</div>
              <div class="store-pet-price">价格: 1000 金币</div>
            </div>
          </div>
        </div>
        <p v-if="player.gold < 1000" class="not-enough-gold">金币不足！需要1000金币购买宠物。</p>
        <button @click="closePetStore" class="close-button">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import { petConfig } from '../config/petConfig.js';

export default {
  name: 'PetSystem',
  props: {
    player: {
      type: Object,
      required: true
    },
    playerPets: {
      type: Array,
      default: () => []
    },
    petEquipments: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      petConfig,
      currentPetIndex: 0,
      showEquipmentSelection: false,
      showPetStore: false,
      currentEquipmentSlot: null,
      availablePetEquipment: [],
      interactionCooldowns: {},
      lastHappinessDecay: Date.now()
    };
  },
  computed: {
    activePet() {
      if (this.playerPets.length === 0) return null;
      return this.playerPets[this.currentPetIndex];
    },
    
    petHealthPercentage() {
      if (!this.activePet) return 0;
      return (this.activePet.currentHp / this.activePet.maxHp) * 100;
    },
    
    petExpPercentage() {
      if (!this.activePet) return 0;
      const expNeeded = this.expNeededForPetLevelUp;
      return (this.activePet.exp / expNeeded) * 100;
    },
    
    expNeededForPetLevelUp() {
      if (!this.activePet) return 100;
      return petConfig.calculations.expToNextLevel(this.activePet.level);
    },
    
    totalPetAttack() {
      if (!this.activePet) return 0;
      
      // 基础攻击力计算
      let attack = petConfig.calculations.attackPower(
        this.activePet.strength, 
        this.activePet.level,
        this.activePet.type
      );
      
      // 装备加成
      for (const slot in this.activePet.equipment) {
        if (this.activePet.equipment[slot]) {
          if (this.activePet.equipment[slot].attack) {
            attack += this.activePet.equipment[slot].attack;
          }
          // 力量属性加成
          if (this.activePet.equipment[slot].strength) {
            attack += this.activePet.equipment[slot].strength * 1.5;
          }
          // 全属性加成
          if (this.activePet.equipment[slot].allStats) {
            attack += this.activePet.equipment[slot].allStats * 1.5;
          }
        }
      }
      
      return Math.floor(attack);
    },
    
    totalPetDefense() {
      if (!this.activePet) return 0;
      
      // 基础防御力计算
      let defense = petConfig.calculations.defensePower(
        this.activePet.vitality, 
        this.activePet.level,
        this.activePet.type
      );
      
      // 装备加成
      for (const slot in this.activePet.equipment) {
        if (this.activePet.equipment[slot]) {
          if (this.activePet.equipment[slot].defense) {
            defense += this.activePet.equipment[slot].defense;
          }
          // 体力属性加成
          if (this.activePet.equipment[slot].vitality) {
            defense += this.activePet.equipment[slot].vitality * 1.2;
          }
          // 全属性加成
          if (this.activePet.equipment[slot].allStats) {
            defense += this.activePet.equipment[slot].allStats * 1.2;
          }
        }
      }
      
      return Math.floor(defense);
    },
    
    totalPetCritRate() {
      if (!this.activePet) return 0;
      
      // 基础暴击率计算
      let critRate = petConfig.calculations.critRate(
        this.activePet.agility, 
        this.activePet.level,
        this.activePet.type
      );
      
      // 装备加成
      for (const slot in this.activePet.equipment) {
        if (this.activePet.equipment[slot] && this.activePet.equipment[slot].critRate) {
          critRate += this.activePet.equipment[slot].critRate;
        }
      }
      
      return Math.floor(critRate);
    },
    
    // 计算可购买的宠物列表
    availablePetsForPurchase() {
      const purchaseMethod = petConfig.acquisitionMethods.find(method => method.id === 'purchase');
      if (!purchaseMethod) return [];
      
      // 筛选出可购买的宠物类型
      return petConfig.petTypes.filter(petType => 
        purchaseMethod.availablePets.includes(petType.id) && 
        !this.playerPets.some(pet => pet.type.id === petType.id)
      );
    },
    
    // 宠物属性加成给玩家（暂时在这里计算，在上层组件中获取使用）
    petBonuses() {
      if (!this.activePet) return {};
      
      const bonuses = {};
      const petType = this.activePet.type;
      const bonusValue = petConfig.calculations.calculateBonus(
        petType, 
        this.activePet.level, 
        this.activePet.loyalty
      );
      
      bonuses[petType.bonusType] = bonusValue;
      
      return bonuses;
    }
  },
  
  watch: {
    'activePet.exp'(newExp) {
      if (!this.activePet) return;
      
      const expNeeded = this.expNeededForPetLevelUp;
      if (newExp >= expNeeded) {
        this.levelUpPet();
      }
    }
  },
  
  mounted() {
    // 初始化交互冷却时间
    this.initInteractionCooldowns();
    
    // 开始宠物状态定时更新
    this.startPetStatusInterval();
  },
  
  beforeUnmount() {
    // 清除定时器
    if (this.petStatusInterval) {
      clearInterval(this.petStatusInterval);
    }
  },
  
  methods: {
    // 切换当前显示的宠物
    switchPet(direction) {
      const newIndex = this.currentPetIndex + direction;
      if (newIndex >= 0 && newIndex < this.playerPets.length) {
        this.currentPetIndex = newIndex;
      }
    },
    
    // 打开宠物装备选择界面
    openPetEquipmentSelection(slot) {
      this.currentEquipmentSlot = slot;
      
      // 获取适合这个槽位的所有装备
      this.availablePetEquipment = this.petEquipments.filter(
        item => item.type === slot
      );
      
      this.showEquipmentSelection = true;
    },
    
    // 关闭宠物装备选择界面
    closeEquipmentSelection() {
      this.showEquipmentSelection = false;
      this.currentEquipmentSlot = null;
    },
    
    // 装备宠物物品
    equipPetItem(item) {
      if (!this.activePet || !this.currentEquipmentSlot) return;
      
      // 卸下当前装备(如果有)
      const currentEquipment = this.activePet.equipment[this.currentEquipmentSlot];
      if (currentEquipment) {
        this.$emit('pet-unequip-item', {
          pet: this.activePet,
          item: currentEquipment,
          slot: this.currentEquipmentSlot
        });
      }
      
      // 装备新物品
      this.$emit('pet-equip-item', {
        pet: this.activePet,
        item: item,
        slot: this.currentEquipmentSlot
      });
      
      this.closeEquipmentSelection();
    },
    
    // 宠物升级
    levelUpPet() {
      if (!this.activePet) return;
      
      // 减去升级所需经验
      this.activePet.exp -= this.expNeededForPetLevelUp;
      
      // 提升等级
      this.activePet.level++;
      
      // 提升属性
      const growthRates = this.activePet.type.growthRates;
      this.activePet.strength = Math.floor(this.activePet.strength * (1 + (growthRates.strength - 1) * 0.3));
      this.activePet.agility = Math.floor(this.activePet.agility * (1 + (growthRates.agility - 1) * 0.3));
      this.activePet.vitality = Math.floor(this.activePet.vitality * (1 + (growthRates.vitality - 1) * 0.3));
      this.activePet.intelligence = Math.floor(this.activePet.intelligence * (1 + (growthRates.intelligence - 1) * 0.3));
      
      // 重新计算最大生命值
      this.activePet.maxHp = petConfig.calculations.maxHp(
        this.activePet.vitality, 
        this.activePet.level,
        this.activePet.type
      );
      
      // 恢复满生命值
      this.activePet.currentHp = this.activePet.maxHp;
      
      // 通知升级事件
      this.$emit('pet-level-up', this.activePet);
    },
    
    // 与宠物互动
    interactWithPet(interaction) {
      if (!this.activePet) return;
      
      // 检查冷却时间
      if (this.isInteractionOnCooldown(interaction)) {
        return;
      }
      
      // 检查金币(如果需要)
      if (interaction.cost && interaction.cost.gold > this.player.gold) {
        this.$emit('show-notification', {
          message: '金币不足！',
          type: 'error'
        });
        return;
      }
      
      // 扣除金币(如果需要)
      if (interaction.cost && interaction.cost.gold > 0) {
        this.$emit('update-player-gold', -interaction.cost.gold);
      }
      
      // 应用互动效果
      if (interaction.happinessGain) {
        this.activePet.happiness = Math.min(100, this.activePet.happiness + interaction.happinessGain);
      }
      
      if (interaction.loyaltyGain) {
        this.activePet.loyalty = Math.min(100, this.activePet.loyalty + interaction.loyaltyGain);
      }
      
      if (interaction.expGain) {
        this.activePet.exp += interaction.expGain;
      }
      
      // 设置冷却时间
      this.interactionCooldowns[interaction.id] = Date.now() + interaction.cooldown;
      
      // 保存宠物数据
      this.$emit('save-pet-data');
      
      // 显示互动通知
      this.$emit('show-notification', {
        message: `与宠物${this.activePet.name}进行了${interaction.name}互动！`,
        type: 'success'
      });
    },
    
    // 检查互动是否在冷却中
    isInteractionOnCooldown(interaction) {
      const cooldownTime = this.interactionCooldowns[interaction.id];
      if (!cooldownTime) return false;
      
      return Date.now() < cooldownTime;
    },
    
    // 获取互动冷却时间文本
    getInteractionCooldownText(interaction) {
      const cooldownTime = this.interactionCooldowns[interaction.id];
      if (!cooldownTime) return '';
      
      const remainingTime = Math.max(0, cooldownTime - Date.now());
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      
      return `(${minutes}:${seconds.toString().padStart(2, '0')})`;
    },
    
    // 初始化互动冷却时间
    initInteractionCooldowns() {
      petConfig.interactions.forEach(interaction => {
        this.interactionCooldowns[interaction.id] = 0;
      });
    },
    
    // 开启宠物状态定时更新
    startPetStatusInterval() {
      this.petStatusInterval = setInterval(() => {
        this.updatePetStatus();
      }, 60000); // 每分钟更新一次
    },
    
    // 更新宠物状态(快乐度等)
    updatePetStatus() {
      if (!this.activePet) return;
      
      const now = Date.now();
      const minutesPassed = (now - this.lastHappinessDecay) / 60000;
      
      if (minutesPassed > 0) {
        // 降低快乐度
        const happinessDecay = petConfig.calculations.happinessDecayRate * minutesPassed;
        this.activePet.happiness = Math.max(0, this.activePet.happiness - happinessDecay);
        
        // 低快乐度会影响忠诚度
        if (this.activePet.happiness < 30) {
          this.activePet.loyalty = Math.max(0, this.activePet.loyalty - (happinessDecay * 0.5));
        }
        
        this.lastHappinessDecay = now;
        
        // 保存宠物数据
        this.$emit('save-pet-data');
      }
    },
    
    // 打开宠物商店
    openPetStore() {
      this.showPetStore = true;
    },
    
    // 关闭宠物商店
    closePetStore() {
      this.showPetStore = false;
    },
    
    // 购买宠物
    purchasePet(petType) {
      // 检查金币
      if (this.player.gold < 1000) {
        this.$emit('show-notification', {
          message: '金币不足！需要1000金币购买宠物。',
          type: 'error'
        });
        return;
      }
      
      // 扣除金币
      this.$emit('update-player-gold', -1000);
      
      // 创建新宠物
      const newPet = this.createNewPet(petType);
      
      // 添加到玩家宠物列表
      this.$emit('add-pet', newPet);
      
      // 关闭商店
      this.closePetStore();
      
      // 显示通知
      this.$emit('show-notification', {
        message: `成功购买了宠物：${petType.name}！`,
        type: 'success'
      });
    },
    
    // 创建新宠物
    createNewPet(petType) {
      // 复制基础属性
      const newPet = {...petConfig.initialStats};
      
      // 设置宠物类型和名称
      newPet.type = petType;
      newPet.name = petType.name;
      
      // 计算基于类型的最大生命值
      newPet.maxHp = petConfig.calculations.maxHp(
        newPet.vitality, 
        newPet.level,
        petType
      );
      newPet.currentHp = newPet.maxHp;
      
      return newPet;
    },
    
    // 获取忠诚度颜色
    getLoyaltyColor(loyalty) {
      if (loyalty < 30) return '#e74c3c'; // 红色
      if (loyalty < 60) return '#f39c12'; // 橙色
      return '#27ae60'; // 绿色
    },
    
    // 获取快乐度颜色
    getHappinessColor(happiness) {
      if (happiness < 30) return '#e74c3c'; // 红色
      if (happiness < 60) return '#f39c12'; // 橙色
      return '#27ae60'; // 绿色
    },
    
    // 获取物品稀有度样式类
    getRarityClass(rarity) {
      return `rarity-${rarity}`;
    },
    
    // 获取物品属性文本
    getItemStatsText(item) {
      const stats = [];
      
      if (item.attack) stats.push(`攻击+${item.attack}`);
      if (item.defense) stats.push(`防御+${item.defense}`);
      if (item.strength) stats.push(`力量+${item.strength}`);
      if (item.agility) stats.push(`敏捷+${item.agility}`);
      if (item.vitality) stats.push(`体力+${item.vitality}`);
      if (item.intelligence) stats.push(`智力+${item.intelligence}`);
      if (item.critRate) stats.push(`暴击率+${item.critRate}%`);
      if (item.allStats) stats.push(`全属性+${item.allStats}`);
      
      return stats.join(', ');
    },
    
    // 获取宠物加成描述
    getPetBonusDescription(pet) {
      if (!pet) return '';
      
      const bonusType = pet.type.bonusType;
      const bonusValue = petConfig.calculations.calculateBonus(
        pet.type, 
        pet.level, 
        pet.loyalty
      );
      
      let description = '';
      
      switch (bonusType) {
        case 'attack':
          description = `增加主人攻击力 ${Math.floor(bonusValue)} 点`;
          break;
        case 'defense':
          description = `增加主人防御力 ${Math.floor(bonusValue)} 点`;
          break;
        case 'dodgeRate':
          description = `增加主人闪避率 ${Math.floor(bonusValue)}%`;
          break;
        case 'critRate':
          description = `增加主人暴击率 ${Math.floor(bonusValue)}%`;
          break;
        case 'itemFindBonus':
          description = `增加物品发现率 ${Math.floor(bonusValue)}%`;
          break;
        case 'expBonus':
          description = `增加经验获取 ${Math.floor(bonusValue)}%`;
          break;
        case 'goldBonus':
          description = `增加金币获取 ${Math.floor(bonusValue)}%`;
          break;
        case 'allStats':
          description = `增加主人所有属性 ${Math.floor(bonusValue)} 点`;
          break;
        default:
          description = `提供${Math.floor(bonusValue)}点${bonusType}加成`;
      }
      
      return description;
    }
  }
};
</script>

<style scoped>
/* 宠物系统容器 */
.pet-system {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 宠物信息区域 */
.pet-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.pet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.pet-header h2 {
  margin: 0;
  color: #333;
}

.pet-switch-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pet-switch-controls button {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 3px 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pet-switch-controls button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.pet-switch-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 宠物详情区域 */
.pet-details {
  display: flex;
  gap: 20px;
}

.pet-avatar {
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pet-icon {
  font-size: 60px;
  margin-bottom: 5px;
}

.pet-level {
  background-color: #3498db;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.pet-health-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 5px 0;
}

.health-bar-fill {
  height: 100%;
  background-color: #2ecc71;
  transition: width 0.3s ease;
}

.pet-health-text {
  font-size: 12px;
  color: #666;
}

.pet-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pet-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.pet-type {
  color: #666;
  font-size: 0.9em;
  font-weight: normal;
}

.pet-description {
  margin: 0;
  color: #666;
  font-size: 0.9em;
}

/* 宠物属性栏 */
.pet-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.pet-stat {
  display: flex;
  justify-content: space-between;
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 4px;
}

.stat-label {
  color: #555;
}

.stat-value {
  font-weight: bold;
  color: #333;
}

/* 宠物核心属性 */
.pet-attributes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  margin-top: 10px;
}

.pet-attribute {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0;
  padding: 5px;
  border-radius: 4px;
}

.attribute-label {
  font-size: 0.8em;
  color: #555;
}

.attribute-value {
  font-weight: bold;
  color: #333;
}

/* 宠物状态条 */
.pet-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label {
  width: 60px;
  font-size: 0.9em;
  color: #555;
}

.status-bar-outer {
  flex: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.status-bar-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.status-value {
  width: 30px;
  text-align: right;
  font-size: 0.9em;
  font-weight: bold;
  color: #333;
}

/* 宠物经验条 */
.pet-exp-bar {
  width: 100%;
  height: 12px;
  background-color: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0;
  position: relative;
}

.exp-bar-fill {
  height: 100%;
  background-color: #9b59b6;
  transition: width 0.3s ease;
}

.exp-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8em;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
}

/* 宠物特殊能力 */
.pet-special-ability, .pet-bonus {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}

.pet-special-ability h4, .pet-bonus h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 0.95em;
}

.pet-special-ability p, .pet-bonus p {
  margin: 0;
  font-size: 0.9em;
  color: #555;
}

.ability-chance {
  font-size: 0.8em;
  color: #888;
  margin-top: 5px;
}

/* 宠物装备区域 */
.pet-equipment {
  margin-top: 15px;
}

.pet-equipment h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.1em;
}

.equipment-slots {
  display: flex;
  gap: 10px;
}

.equipment-slot {
  flex: 1;
  height: 80px;
  background-color: #f0f0f0;
  border: 1px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.equipment-slot:hover {
  background-color: #e0e0e0;
}

.empty-slot {
  color: #999;
  font-size: 0.9em;
}

.equipped-item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 7px;
  border: 1px solid;
}

.item-name {
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
  font-size: 0.9em;
}

.item-stats {
  font-size: 0.8em;
  text-align: center;
  color: #555;
}

/* 宠物互动区域 */
.pet-interactions {
  margin-top: 15px;
}

.pet-interactions h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.1em;
}

.interaction-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.interaction-button {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  font-size: 0.9em;
}

.interaction-button:hover:not(:disabled) {
  background-color: #2980b9;
}

.interaction-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.interaction-cost {
  display: block;
  font-size: 0.8em;
  margin-top: 3px;
  opacity: 0.9;
}

.cooldown-timer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

/* 未拥有宠物时的显示 */
.no-pet-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
}

.no-pet-message {
  text-align: center;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  max-width: 300px;
}

.no-pet-message h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.no-pet-message p {
  margin: 0 0 15px 0;
  color: #666;
}

.get-pet-button {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.get-pet-button:hover {
  background-color: #2980b9;
}

/* 装备选择弹窗 */
.equipment-selection-modal, .pet-store-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin: 0 0 15px 0;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.available-equipment {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
}

.equipment-item {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}

.equipment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.close-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #c0392b;
}

/* 宠物商店样式 */
.available-pets {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.store-pet-item {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.store-pet-item:hover:not([disabled]) {
  background-color: #e0e0e0;
}

.store-pet-item[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.store-pet-icon {
  font-size: 40px;
  margin-right: 15px;
}

.store-pet-info {
  flex: 1;
}

.store-pet-name {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.store-pet-description {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 8px;
}

.store-pet-price {
  font-size: 0.9em;
  font-weight: bold;
  color: #e67e22;
}

.not-enough-gold {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 15px;
}

/* 稀有度颜色 */
.rarity-普通 {
  color: #9d9d9d;
  border-color: #9d9d9d;
}

.rarity-魔法 {
  color: #4444ff;
  border-color: #4444ff;
}

.rarity-稀有 {
  color: #ffff00;
  border-color: #ffff00;
}

.rarity-史诗 {
  color: #a335ee;
  border-color: #a335ee;
}

.rarity-传说 {
  color: #ff8000;
  border-color: #ff8000;
}

.rarity-套装 {
  color: #00ff00;
  border-color: #00ff00;
}

.rarity-独特 {
  color: #ff4500;
  border-color: #ff4500;
}

.rarity-神话 {
  color: #ff00ff;
  border-color: #ff00ff;
}

.rarity-远古 {
  color: #00ffff;
  border-color: #00ffff;
}
</style> 