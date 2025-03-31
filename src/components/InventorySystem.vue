<template>
  <div class="inventory-tab">
    <div class="inventory-container">
      <!-- 左侧装备区域 -->
      <div class="equipment-section">
        <div class="character-frame">
          <div class="character-silhouette"></div>
          <div class="equipment-slots">
            <div class="slot helmet" :class="{ empty: !player.equipment.helmet }" data-slot="头盔">
              <div v-if="player.equipment.helmet" class="item" @click="unequipItem('helmet')"
                   :class="[player.equipment.helmet.quality]">
                <div class="item-frame">
                  <div class="item-icon" :style="{ color: getQualityColor(player.equipment.helmet) }">
                    {{ getItemSymbol(player.equipment.helmet) }}
                  </div>
                  <div class="item-hover">
                    <div class="item-name" :style="{ color: getQualityColor(player.equipment.helmet) }">
                      {{ player.equipment.helmet.name }}
                    </div>
                    <div class="item-type">{{ player.equipment.helmet.type }}</div>
                    <div class="item-stats" v-html="getItemStats(player.equipment.helmet)"></div>
                    <div class="item-requirements" v-if="hasRequirements(player.equipment.helmet)">
                      需求: {{ getRequirementsText(player.equipment.helmet) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-slot"></div>
            </div>

            <div class="slot shoulders" :class="{ empty: !player.equipment.shoulders }" data-slot="肩甲">
              <div v-if="player.equipment.shoulders" class="item" @click="unequipItem('shoulders')"
                   :class="[player.equipment.shoulders.quality]">
                <div class="item-frame">
                  <div class="item-icon" :style="{ color: getQualityColor(player.equipment.shoulders) }">
                    {{ getItemSymbol(player.equipment.shoulders) }}
                  </div>
                  <div class="item-hover">
                    <div class="item-name" :style="{ color: getQualityColor(player.equipment.shoulders) }">
                      {{ player.equipment.shoulders.name }}
                    </div>
                    <div class="item-type">{{ player.equipment.shoulders.type }}</div>
                    <div class="item-stats" v-html="getItemStats(player.equipment.shoulders)"></div>
                    <div class="item-requirements" v-if="hasRequirements(player.equipment.shoulders)">
                      需求: {{ getRequirementsText(player.equipment.shoulders) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-slot"></div>
            </div>

            <div class="slot amulet" :class="{ empty: !player.equipment.amulet }" data-slot="护符">
              <div v-if="player.equipment.amulet" class="item" @click="unequipItem('amulet')"
                   :class="[player.equipment.amulet.quality]">
                <div class="item-frame">
                  <div class="item-icon" :style="{ color: getQualityColor(player.equipment.amulet) }">
                    {{ getItemSymbol(player.equipment.amulet) }}
                  </div>
                  <div class="item-hover">
                    <div class="item-name" :style="{ color: getQualityColor(player.equipment.amulet) }">
                      {{ player.equipment.amulet.name }}
                    </div>
                    <div class="item-type">{{ player.equipment.amulet.type }}</div>
                    <div class="item-stats" v-html="getItemStats(player.equipment.amulet)"></div>
                    <div class="item-requirements" v-if="hasRequirements(player.equipment.amulet)">
                      需求: {{ getRequirementsText(player.equipment.amulet) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-slot"></div>
            </div>

            <div class="slot chest" :class="{ empty: !player.equipment.chest }" data-slot="胸甲">
              <div v-if="player.equipment.chest" class="item" @click="unequipItem('chest')"
                   :class="[player.equipment.chest.quality]">
                <div class="item-frame">
                  <div class="item-icon" :style="{ color: getQualityColor(player.equipment.chest) }">
                    {{ getItemSymbol(player.equipment.chest) }}
                  </div>
                  <div class="item-hover">
                    <div class="item-name" :style="{ color: getQualityColor(player.equipment.chest) }">
                      {{ player.equipment.chest.name }}
                    </div>
                    <div class="item-type">{{ player.equipment.chest.type }}</div>
                    <div class="item-stats" v-html="getItemStats(player.equipment.chest)"></div>
                    <div class="item-requirements" v-if="hasRequirements(player.equipment.chest)">
                      需求: {{ getRequirementsText(player.equipment.chest) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-slot"></div>
            </div>

            <div class="slot gloves" :class="{ empty: !player.equipment.gloves }" data-slot="手套">
              <div v-if="player.equipment.gloves" class="item" @click="unequipItem('gloves')"
                   :class="[player.equipment.gloves.quality]">
                <div class="item-frame">
                  <div class="item-icon" :style="{ color: getQualityColor(player.equipment.gloves) }">
                    {{ getItemSymbol(player.equipment.gloves) }}
                  </div>
                  <div class="item-hover">
                    <div class="item-name" :style="{ color: getQualityColor(player.equipment.gloves) }">
                      {{ player.equipment.gloves.name }}
                    </div>
                    <div class="item-type">{{ player.equipment.gloves.type }}</div>
                    <div class="item-stats" v-html="getItemStats(player.equipment.gloves)"></div>
                    <div class="item-requirements" v-if="hasRequirements(player.equipment.gloves)">
                      需求: {{ getRequirementsText(player.equipment.gloves) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-slot"></div>
            </div>

            <div class="slot belt" :class="{ empty: !player.equipment.belt }" data-slot="腰带">
              <div v-if="player.equipment.belt" class="item" @click="unequipItem('belt')"
                   :class="[player.equipment.belt.quality]">
                <div class="item-frame">
                  <div class="item-icon" :style="{ color: getQualityColor(player.equipment.belt) }">
                    {{ getItemSymbol(player.equipment.belt) }}
                  </div>
                  <div class="item-hover">
                    <div class="item-name" :style="{ color: getQualityColor(player.equipment.belt) }">
                      {{ player.equipment.belt.name }}
                    </div>
                    <div class="item-type">{{ player.equipment.belt.type }}</div>
                    <div class="item-stats" v-html="getItemStats(player.equipment.belt)"></div>
                    <div class="item-requirements" v-if="hasRequirements(player.equipment.belt)">
                      需求: {{ getRequirementsText(player.equipment.belt) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-slot"></div>
            </div>

            <div class="slot ring1" :class="{ empty: !player.equipment.ring1 }" data-slot="戒指1">
              <div v-if="player.equipment.ring1" class="item" @click="unequipItem('ring1')"
                   :class="[player.equipment.ring1.quality]">
                <div class="item-frame">
                  <div class="item-icon" :style="{ color: getQualityColor(player.equipment.ring1) }">
                    {{ getItemSymbol(player.equipment.ring1) }}
                  </div>
                  <div class="item-hover">
                    <div class="item-name" :style="{ color: getQualityColor(player.equipment.ring1) }">
                      {{ player.equipment.ring1.name }}
                    </div>
                    <div class="item-type">{{ player.equipment.ring1.type }}</div>
                    <div class="item-stats" v-html="getItemStats(player.equipment.ring1)"></div>
                    <div class="item-requirements" v-if="hasRequirements(player.equipment.ring1)">
                      需求: {{ getRequirementsText(player.equipment.ring1) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-slot"></div>
            </div>

            <div class="slot ring2" :class="{ empty: !player.equipment.ring2 }" data-slot="戒指2">
              <div v-if="player.equipment.ring2" class="item" @click="unequipItem('ring2')"
                   :class="[player.equipment.ring2.quality]">
                <div class="item-frame">
                  <div class="item-icon" :style="{ color: getQualityColor(player.equipment.ring2) }">
                    {{ getItemSymbol(player.equipment.ring2) }}
                  </div>
                  <div class="item-hover">
                    <div class="item-name" :style="{ color: getQualityColor(player.equipment.ring2) }">
                      {{ player.equipment.ring2.name }}
                    </div>
                    <div class="item-type">{{ player.equipment.ring2.type }}</div>
                    <div class="item-stats" v-html="getItemStats(player.equipment.ring2)"></div>
                    <div class="item-requirements" v-if="hasRequirements(player.equipment.ring2)">
                      需求: {{ getRequirementsText(player.equipment.ring2) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-slot"></div>
            </div>

            <div class="slot pants" :class="{ empty: !player.equipment.pants }" data-slot="裤子">
              <div v-if="player.equipment.pants" class="item" @click="unequipItem('pants')"
                   :class="[player.equipment.pants.quality]">
                <div class="item-frame">
                  <div class="item-icon" :style="{ color: getQualityColor(player.equipment.pants) }">
                    {{ getItemSymbol(player.equipment.pants) }}
                  </div>
                  <div class="item-hover">
                    <div class="item-name" :style="{ color: getQualityColor(player.equipment.pants) }">
                      {{ player.equipment.pants.name }}
                    </div>
                    <div class="item-type">{{ player.equipment.pants.type }}</div>
                    <div class="item-stats" v-html="getItemStats(player.equipment.pants)"></div>
                    <div class="item-requirements" v-if="hasRequirements(player.equipment.pants)">
                      需求: {{ getRequirementsText(player.equipment.pants) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-slot"></div>
            </div>

            <div class="slot boots" :class="{ empty: !player.equipment.boots }" data-slot="靴子">
              <div v-if="player.equipment.boots" class="item" @click="unequipItem('boots')"
                   :class="[player.equipment.boots.quality]">
                <div class="item-frame">
                  <div class="item-icon" :style="{ color: getQualityColor(player.equipment.boots) }">
                    {{ getItemSymbol(player.equipment.boots) }}
                  </div>
                  <div class="item-hover">
                    <div class="item-name" :style="{ color: getQualityColor(player.equipment.boots) }">
                      {{ player.equipment.boots.name }}
                    </div>
                    <div class="item-type">{{ player.equipment.boots.type }}</div>
                    <div class="item-stats" v-html="getItemStats(player.equipment.boots)"></div>
                    <div class="item-requirements" v-if="hasRequirements(player.equipment.boots)">
                      需求: {{ getRequirementsText(player.equipment.boots) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-slot"></div>
            </div>

            <div class="slot weapon" :class="{ empty: !player.equipment.weapon }" data-slot="武器">
              <div v-if="player.equipment.weapon" class="item" @click="unequipItem('weapon')"
                   :class="[player.equipment.weapon.quality]">
                <div class="item-frame">
                  <div class="item-icon" :style="{ color: getQualityColor(player.equipment.weapon) }">
                    {{ getItemSymbol(player.equipment.weapon) }}
                  </div>
                  <div class="item-hover">
                    <div class="item-name" :style="{ color: getQualityColor(player.equipment.weapon) }">
                      {{ player.equipment.weapon.name }}
                    </div>
                    <div class="item-type">{{ player.equipment.weapon.type }}</div>
                    <div class="item-stats" v-html="getItemStats(player.equipment.weapon)"></div>
                    <div class="item-requirements" v-if="hasRequirements(player.equipment.weapon)">
                      需求: {{ getRequirementsText(player.equipment.weapon) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-slot"></div>
            </div>

            <div class="slot offhand" :class="{ empty: !player.equipment.offhand }" data-slot="副手">
              <div v-if="player.equipment.offhand" class="item" @click="unequipItem('offhand')"
                   :class="[player.equipment.offhand.quality]">
                <div class="item-frame">
                  <div class="item-icon" :style="{ color: getQualityColor(player.equipment.offhand) }">
                    {{ getItemSymbol(player.equipment.offhand) }}
                  </div>
                  <div class="item-hover">
                    <div class="item-name" :style="{ color: getQualityColor(player.equipment.offhand) }">
                      {{ player.equipment.offhand.name }}
                    </div>
                    <div class="item-type">{{ player.equipment.offhand.type }}</div>
                    <div class="item-stats" v-html="getItemStats(player.equipment.offhand)"></div>
                    <div class="item-requirements" v-if="hasRequirements(player.equipment.offhand)">
                      需求: {{ getRequirementsText(player.equipment.offhand) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-slot"></div>
            </div>
          </div>
        </div>

        <!-- 套装效果显示 -->
        <div class="set-bonus-panel" v-if="activeSetBonuses.length > 0">
          <h3>套装效果</h3>
          <div v-for="(bonus, index) in activeSetBonuses" :key="index" 
               class="set-bonus" :class="{ active: bonus.active }">
            {{ bonus }}
          </div>
        </div>
      </div>

      <!-- 右侧背包区域 -->
      <div class="inventory-section">
        <div class="inventory-header">
          <h2>背包 ({{player.inventory.length}}/{{player.inventorySize}})</h2>
          <div class="inventory-controls">
            <button @click="sortInventory" class="control-btn">
              <i class="fas fa-sort"></i>
            </button>
            <button @click="sellAllItems" class="control-btn">
              <i class="fas fa-coins"></i> 出售全部
            </button>
          </div>
        </div>

        <div class="inventory-grid">
          <div v-for="(item, index) in player.inventory" :key="index" 
               class="inventory-slot" :class="[item.quality]">
            <div class="item" @mouseover="showItemTooltip(item, $event)" 
                 @mouseleave="hideItemTooltip">
              <div class="item-frame">
                <div class="item-icon" :style="{ color: getQualityColor(item) }">
                  {{ getItemSymbol(item) }}
                </div>
                <div class="item-actions">
                  <button @click="equipItem(item, index)" class="action-btn equip-btn" 
                          v-if="canEquip(item)">装备</button>
                  <button @click="sellItem(item, index)" class="action-btn sell-btn">
                    卖出 ({{calculateSellPrice(item)}}金币)
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- 空背包格子 -->
          <div v-for="i in (player.inventorySize - player.inventory.length)" 
               :key="'empty-'+i" class="inventory-slot empty"></div>
        </div>
      </div>
    </div>

    <!-- 物品详情悬浮框 -->
    <div class="item-tooltip" v-if="hoveredItem" :style="tooltipStyle">
      <div class="tooltip-header" :style="{ color: getQualityColor(hoveredItem) }">
        {{ hoveredItem.name }}
      </div>
      <div class="tooltip-type">{{ hoveredItem.type }}</div>
      <div class="tooltip-stats" v-html="getItemStats(hoveredItem)"></div>
      <div class="tooltip-requirements" v-if="hasRequirements(hoveredItem)">
        需求: {{ getRequirementsText(hoveredItem) }}
      </div>
      <div class="tooltip-compare" v-if="getCompareStats(hoveredItem)">
        <div class="compare-header">对比装备中的:</div>
        <div class="compare-stats" v-html="getCompareStats(hoveredItem)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { EQUIPMENT_CONFIG } from '../config/equipment';

export default {
  name: 'InventorySystem',
  props: {
    player: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      itemConfig: EQUIPMENT_CONFIG,
      hoveredItem: null,
      tooltipStyle: {
        top: '0px',
        left: '0px'
      }
    };
  },
  computed: {
    activeSetBonuses() {
      const bonuses = [];
      const equippedItems = Object.values(this.player.equipment).filter(item => item);
      
      // 检查每个套装
      for (const [setKey, set] of Object.entries(this.itemConfig.sets)) {
        const equippedSetItems = equippedItems.filter(item => item.set === setKey);
        const equippedCount = equippedSetItems.length;
        
        if (equippedCount >= 2) {
          for (let i = 2; i <= equippedCount; i++) {
            if (set.bonus[i]) {
              const bonusText = this.formatSetBonus(set.bonus[i]);
              bonuses.push(`${set.name} (${i}件): ${bonusText}`);
            }
          }
        }
      }
      
      return bonuses;
    }
  },
  methods: {
    equipItem(item, index) {
      this.$emit('equip-item', item, index);
    },
    
    unequipItem(slot) {
      this.$emit('unequip-item', slot);
    },
    
    sellItem(item, index) {
      this.$emit('sell-item', item, index);
    },
    
    sellAllItems() {
      this.$emit('sell-all-items');
    },
    
    getItemStats(item) {
      if (!item) {
        return '';
      }
      
      let qualityColor = '#ffffff'; // 默认颜色
      
      // 检查item.quality是否存在且在itemConfig.rarity中有定义
      if (item.quality && this.itemConfig.rarity[item.quality]) {
        qualityColor = this.itemConfig.rarity[item.quality].color;
      }
      
      let stats = item.quality ? `<span style="color:${qualityColor}">${item.quality}</span> ` : '';
      
      // 基础属性
      if (item.attack) stats += `攻击力+${item.attack} `;
      if (item.defense) stats += `防御力+${item.defense} `;
      if (item.strength) stats += `力量+${item.strength} `;
      if (item.agility) stats += `敏捷+${item.agility} `;
      if (item.vitality) stats += `体力+${item.vitality} `;
      if (item.intelligence) stats += `智力+${item.intelligence} `;
      
      // 高级属性
      if (item.critRate) stats += `暴击率+${item.critRate}% `;
      if (item.critDamage) stats += `暴击伤害+${item.critDamage}% `;
      if (item.dodgeRate) stats += `闪避率+${item.dodgeRate}% `;
      if (item.blockRate) stats += `格挡率+${item.blockRate}% `;
      if (item.lifeSteal) stats += `生命偷取+${item.lifeSteal}% `;
      if (item.manaSteal) stats += `法力偷取+${item.manaSteal}% `;
      
      // 特殊属性
      if (item.expBonus) stats += `经验+${item.expBonus}% `;
      if (item.goldBonus) stats += `金币+${item.goldBonus}% `;
      if (item.itemFindBonus) stats += `掉落率+${item.itemFindBonus}% `;
      if (item.allStats) stats += `全属性+${item.allStats} `;
      
      // 元素属性
      if (item.fireDamage) stats += `火焰伤害+${item.fireDamage} `;
      if (item.coldDamage) stats += `冰霜伤害+${item.coldDamage} `;
      if (item.lightningDamage) stats += `闪电伤害+${item.lightningDamage} `;
      if (item.poisonDamage) stats += `毒素伤害+${item.poisonDamage} `;
      
      // 元素抗性
      if (item.fireResistance) stats += `火焰抗性+${item.fireResistance}% `;
      if (item.coldResistance) stats += `冰霜抗性+${item.coldResistance}% `;
      if (item.lightningResistance) stats += `闪电抗性+${item.lightningResistance}% `;
      if (item.poisonResistance) stats += `毒素抗性+${item.poisonResistance}% `;
      
      return stats;
    },
    
    getSlotName(slot) {
      const names = {
        weapon: "武器",
        armor: "护甲",
        helmet: "头盔",
        boots: "靴子",
        accessory: "饰品"
      };
      return names[slot] || slot;
    },
    
    calculateSellPrice(item) {
      if (!item) {
        return 0;
      }
      
      // 使用正确的路径获取baseValue
      const baseValue = (item.slot && this.itemConfig.slots && this.itemConfig.slots[item.slot]) 
        ? this.itemConfig.slots[item.slot].baseValue || 10 
        : 10;
      
      // 使用rarity中的multiplier属性代替不存在的qualityValueMultiplier
      const qualityMultiplier = (item.quality && this.itemConfig.rarity && this.itemConfig.rarity[item.quality]) 
        ? this.itemConfig.rarity[item.quality].multiplier || 1 
        : 1;
      
      // 由于没有sellPriceMultiplier配置，使用固定值
      const sellMultiplier = 0.5;
      
      // 根据物品等级和属性增加价值
      let totalValue = baseValue * qualityMultiplier;
      
      // 附加属性增加价值
      if (item.attack) totalValue += item.attack * 2;
      if (item.defense) totalValue += item.defense * 2;
      if (item.strength) totalValue += item.strength * 3;
      if (item.agility) totalValue += item.agility * 3;
      if (item.vitality) totalValue += item.vitality * 3;
      if (item.intelligence) totalValue += item.intelligence * 3;
      if (item.luck) totalValue += item.luck * 4;
      if (item.critRate) totalValue += item.critRate * 5;
      if (item.critDamage) totalValue += item.critDamage * 0.5;
      if (item.dodgeRate) totalValue += item.dodgeRate * 5;
      
      // 应用出售折扣
      return Math.floor(totalValue * sellMultiplier);
    },
    
    hasRequirements(item) {
      if (!item) {
        return false;
      }
      
      return item.requirements && (
        item.requirements.level ||
        item.requirements.strength ||
        item.requirements.agility ||
        item.requirements.vitality ||
        item.requirements.intelligence
      );
    },
    
    getRequirementsText(item) {
      if (!item.requirements) return '';
      
      const reqs = [];
      if (item.requirements.level) reqs.push(`等级 ${item.requirements.level}`);
      if (item.requirements.strength) reqs.push(`力量 ${item.requirements.strength}`);
      if (item.requirements.agility) reqs.push(`敏捷 ${item.requirements.agility}`);
      if (item.requirements.vitality) reqs.push(`体力 ${item.requirements.vitality}`);
      if (item.requirements.intelligence) reqs.push(`智力 ${item.requirements.intelligence}`);
      
      return reqs.join(', ');
    },
    
    canEquip(item) {
      if (!item || !item.requirements) return true;
      
      return (
        (!item.requirements.level || this.player.level >= item.requirements.level) &&
        (!item.requirements.strength || this.player.strength >= item.requirements.strength) &&
        (!item.requirements.agility || this.player.agility >= item.requirements.agility) &&
        (!item.requirements.vitality || this.player.vitality >= item.requirements.vitality) &&
        (!item.requirements.intelligence || this.player.intelligence >= item.requirements.intelligence)
      );
    },
    
    formatSetBonus(bonus) {
      const parts = [];
      for (const [stat, value] of Object.entries(bonus)) {
        const statConfig = this.itemConfig.attributes[stat];
        if (statConfig) {
          parts.push(`${statConfig.name}+${value}${statConfig.suffix || ''}`);
        }
      }
      return parts.join(', ');
    },

    getItemSymbol(item) {
      if (!item || !item.type) {
        return '📦'; // 使用盒子替代问号
      }
      
      // 根据物品类型返回对应的符号
      const typeSymbols = {
        // 主要装备类型
        helmet: '⛑️',
        shoulders: '💪',
        chest: '👕',
        gloves: '🧤',
        belt: '⚜️',
        pants: '👖',
        boots: '👢',
        
        // 武器类型
        weapon: '⚔️',
        sword: '🗡️',
        axe: '🪓',
        bow: '🏹',
        staff: '🪄',
        dagger: '🔪',
        wand: '✨',
        
        // 副手类型
        offhand: '🛡️',
        shield: '🛡️',
        
        // 饰品类型
        amulet: '📿',
        necklace: '📿',
        ring: '💍',
        
        // 护甲类型
        light: '☁️',
        medium: '⚙️',
        heavy: '🔷',
        
        // 元素类型
        fire: '🔥',
        ice: '❄️',
        lightning: '⚡',
        poison: '☠️',
        
        // 通用类型
        armor: '🛡️',
        accessory: '💎',
        robe: '👘',
        cloak: '🧥',
        hat: '🎩',
        crown: '👑',
        gauntlet: '🥊',
        book: '📕',
        potion: '🧪',
        scroll: '📜',
        gem: '💎',
        rune: '🔮'
      };
      
      // 从物品类型中提取基本类型（去掉可能的后缀）
      const baseType = item.type.split(' ')[0].toLowerCase();
      
      // 如果找到匹配的符号，使用它；否则使用第一个字母
      return typeSymbols[baseType] || '📦';
    },

    getQualityColor(item) {
      if (!item || !item.quality) {
        return '#ffffff';  // 默认白色
      }
      return this.itemConfig.rarity[item.quality] 
        ? this.itemConfig.rarity[item.quality].color 
        : '#ffffff';
    },

    showItemTooltip(item, event) {
      this.hoveredItem = item;
      // 计算tooltip位置，确保不超出视窗
      const rect = event.target.getBoundingClientRect();
      const tooltipWidth = 300;
      const tooltipHeight = 400;
      
      let left = rect.right + 10;
      let top = rect.top;
      
      if (left + tooltipWidth > window.innerWidth) {
        left = rect.left - tooltipWidth - 10;
      }
      
      if (top + tooltipHeight > window.innerHeight) {
        top = window.innerHeight - tooltipHeight;
      }
      
      this.tooltipStyle = {
        top: `${top}px`,
        left: `${left}px`
      };
    },

    hideItemTooltip() {
      this.hoveredItem = null;
    },

    getCompareStats(item) {
      if (!item || !item.slot || !this.player.equipment[item.slot]) {
        return null;
      }

      const equippedItem = this.player.equipment[item.slot];
      let comparison = '';

      // 比较基础属性
      const stats = ['attack', 'defense', 'strength', 'agility', 'vitality', 'intelligence'];
      stats.forEach(stat => {
        if (item[stat] || equippedItem[stat]) {
          const diff = (item[stat] || 0) - (equippedItem[stat] || 0);
          if (diff !== 0) {
            const color = diff > 0 ? '#00ff00' : '#ff0000';
            comparison += `<div style="color: ${color}">${stat}: ${diff > 0 ? '+' : ''}${diff}</div>`;
          }
        }
      });

      // 比较高级属性
      const advancedStats = ['critRate', 'critDamage', 'dodgeRate', 'blockRate', 'lifeSteal', 'manaSteal'];
      advancedStats.forEach(stat => {
        if (item[stat] || equippedItem[stat]) {
          const diff = (item[stat] || 0) - (equippedItem[stat] || 0);
          if (diff !== 0) {
            const color = diff > 0 ? '#00ff00' : '#ff0000';
            comparison += `<div style="color: ${color}">${stat}: ${diff > 0 ? '+' : ''}${diff}%</div>`;
          }
        }
      });

      return comparison || null;
    },

    sortInventory() {
      // 按照品质和类型排序
      this.$emit('sort-inventory', {
        sortBy: ['quality', 'type']
      });
    }
  }
}
</script>

<style scoped>
.inventory-tab {
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  color: #fff;
}

.inventory-container {
  display: flex;
  gap: 20px;
  height: 600px;
}

.equipment-section {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 15px;
  overflow: auto;
}

.character-frame {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  position: relative;
}

.character-frame::before {
  content: "装备";
  position: absolute;
  top: -10px;
  left: 15px;
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 0.9em;
  color: #ffd700;
}

/* 添加角色示意图 */
.character-silhouette {
  position: absolute;
  width: 80px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.1;
  pointer-events: none;
  border-radius: 50% 50% 0 0;
  border: 2px dashed rgba(255, 255, 255, 0.3);
}

.equipment-slots {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  position: relative;
  width: 100%;
  height: 500px;
}

.slot {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  transition: all 0.3s ease;
  position: relative;
}

.slot::before {
  content: attr(data-slot);
  position: absolute;
  top: -8px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 0 5px;
  border-radius: 3px;
  font-size: 0.7em;
  color: #aaa;
}

.slot.helmet {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}

.slot.shoulders {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
}

.slot.amulet {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}

.slot.chest {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}

.slot.gloves {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}

.slot.belt {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
}

.slot.ring1 {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
}

.slot.ring2 {
  grid-column: 3 / 4;
  grid-row: 3 / 4;
}

.slot.pants {
  grid-column: 2 / 3;
  grid-row: 4 / 5;
}

.slot.boots {
  grid-column: 3 / 4;
  grid-row: 4 / 5;
}

.slot.weapon {
  grid-column: 1 / 2;
  grid-row: 4 / 5;
}

.slot.offhand {
  grid-column: 4 / 5;
  grid-row: 4 / 5;
}

.slot:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  transform: translateY(-2px);
}

.empty-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.05) 75%, transparent 75%, transparent);
  background-size: 4px 4px;
  border-radius: 4px;
  position: relative;
}

.empty-slot::before {
  content: '';
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(40, 40, 40, 0.6);
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

.slot.helmet .empty-slot::after { content: '⛑️'; opacity: 0.2; font-size: 1.5em; }
.slot.shoulders .empty-slot::after { content: '💪'; opacity: 0.2; font-size: 1.5em; }
.slot.amulet .empty-slot::after { content: '📿'; opacity: 0.2; font-size: 1.5em; }
.slot.chest .empty-slot::after { content: '👕'; opacity: 0.2; font-size: 1.5em; }
.slot.gloves .empty-slot::after { content: '🧤'; opacity: 0.2; font-size: 1.5em; }
.slot.belt .empty-slot::after { content: '⚜️'; opacity: 0.2; font-size: 1.5em; }
.slot.ring1 .empty-slot::after, .slot.ring2 .empty-slot::after { content: '💍'; opacity: 0.2; font-size: 1.5em; }
.slot.pants .empty-slot::after { content: '👖'; opacity: 0.2; font-size: 1.5em; }
.slot.boots .empty-slot::after { content: '👢'; opacity: 0.2; font-size: 1.5em; }
.slot.weapon .empty-slot::after { content: '⚔️'; opacity: 0.2; font-size: 1.5em; }
.slot.offhand .empty-slot::after { content: '🛡️'; opacity: 0.2; font-size: 1.5em; }

.item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.item:hover {
  transform: scale(1.02);
}

.item h4 {
  margin: 0 0 10px 0;
  color: #ffd700;
  font-size: 1.1em;
}

.item p {
  margin: 0;
  font-size: 0.9em;
  line-height: 1.4;
}

.inventory-controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: rgba(255, 215, 0, 0.3);
  transform: translateY(-1px);
}

.inventory-section {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.inventory-header h2 {
  margin: 0;
  font-size: 1.5em;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  overflow-y: auto;
  max-height: 500px;
  padding: 5px;
}

.inventory-slot {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  transition: all 0.3s ease;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inventory-slot:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.item-frame {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.item-actions {
  display: none;
  position: absolute;
  bottom: -40px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 5px;
  border-radius: 0 0 8px 8px;
  z-index: 5;
  flex-direction: column;
  gap: 5px;
}

.item:hover .item-actions {
  display: flex;
}

.action-btn {
  padding: 3px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8em;
  transition: all 0.3s ease;
  width: 100%;
  text-align: center;
}

.equip-btn {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
}

.sell-btn {
  background: rgba(255, 0, 0, 0.2);
  color: #ff4444;
}

.action-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.2);
}

.empty-inventory {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.5);
}

input[type="checkbox"] {
  accent-color: #ffd700;
}

.set-bonus-panel {
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}

.set-bonus {
  color: #00ff00;
  font-size: 0.9em;
  margin: 5px 0;
}

.item-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.item-type {
  color: #888;
  font-size: 0.9em;
  margin-bottom: 5px;
}

.item-requirements {
  color: #ff6b6b;
  font-size: 0.9em;
  margin-top: 5px;
}

.unidentified {
  opacity: 1;
}

.identify-btn {
  display: none;
}

.item-tooltip {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 15px;
  z-index: 1000;
  pointer-events: none;
  transition: all 0.2s ease;
}

.tooltip-header {
  font-size: 1.2em;
  font-weight: bold;
  padding: 5px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 8px;
}

.tooltip-type {
  color: #888;
  font-size: 0.9em;
  margin-bottom: 8px;
  padding: 0 10px;
}

.tooltip-stats {
  margin-bottom: 10px;
  padding: 5px 10px;
  line-height: 1.4;
}

.tooltip-requirements {
  color: #ff6b6b;
  font-size: 0.9em;
  padding: 5px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.tooltip-compare {
  margin-top: 10px;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}

.compare-header {
  color: #ffd700;
  font-weight: bold;
  margin-bottom: 5px;
}

.compare-stats {
  color: #00ff00;
  font-size: 0.9em;
}

.tooltip-style {
  max-width: 300px;
  max-height: 400px;
  overflow: auto;
}

.item-hover {
  display: none;
  position: absolute;
  top: 105%;
  left: 0;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 10px;
  min-width: 200px;
  z-index: 10;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.item:hover .item-hover {
  display: block;
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  margin: 0 auto 8px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  font-size: 1.8em;
  font-weight: normal;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 0 15px currentColor;
  position: relative;
  overflow: hidden;
  filter: drop-shadow(0 0 2px currentColor);
  transition: all 0.3s ease;
}

.item:hover .item-icon {
  transform: scale(1.05);
  filter: drop-shadow(0 0 4px currentColor);
}

/* 给图标添加立体感 */
.item-icon::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 70%);
  pointer-events: none;
  z-index: 1;
}

/* 品质标志 */
.item-icon::before {
  content: "";
  position: absolute;
  bottom: 2px;
  right: 2px;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
  opacity: 0.7;
  z-index: 2;
}

.common .item-icon::before {
  background-color: #aaa;
  box-shadow: 0 0 3px #aaa;
}

.magic .item-icon::before {
  background-color: #4444ff;
  box-shadow: 0 0 4px #4444ff;
}

.rare .item-icon::before {
  background-color: #ffff00;
  box-shadow: 0 0 5px #ffff00;
}

.epic .item-icon::before {
  background-color: #a335ee;
  box-shadow: 0 0 6px #a335ee;
}

.legendary .item-icon::before {
  background-color: #ff8000;
  box-shadow: 0 0 7px #ff8000;
  animation: pulse 1.5s infinite;
}

.set .item-icon::before {
  background-color: #00ff00;
  box-shadow: 0 0 7px #00ff00;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
}

.item-icon::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 70%);
  pointer-events: none;
  z-index: 1;
}

.common .item-icon {
  border-color: #aaa;
  color: #f0f0f0;
}

.magic .item-icon {
  border-color: #4444ff;
  color: #8888ff;
  box-shadow: inset 0 0 15px rgba(68, 68, 255, 0.5);
}

.rare .item-icon {
  border-color: #ffff00;
  color: #ffff88;
  box-shadow: inset 0 0 15px rgba(255, 255, 0, 0.5);
}

.epic .item-icon {
  border-color: #a335ee;
  color: #d8a2ff;
  box-shadow: inset 0 0 15px rgba(163, 53, 238, 0.5);
}

.legendary .item-icon {
  border-color: #ff8000;
  color: #ffcc88;
  box-shadow: inset 0 0 15px rgba(255, 128, 0, 0.5);
  animation: legendary-glow 2s infinite alternate;
}

.set .item-icon {
  border-color: #00ff00;
  color: #88ff88;
  box-shadow: inset 0 0 15px rgba(0, 255, 0, 0.5);
  animation: set-glow 2s infinite alternate;
}

@keyframes legendary-glow {
  from { 
    box-shadow: inset 0 0 15px rgba(255, 128, 0, 0.5);
    border-color: #ff8000;
  }
  to { 
    box-shadow: inset 0 0 25px rgba(255, 128, 0, 0.8), 0 0 15px rgba(255, 128, 0, 0.5);
    border-color: #ffaa44;
  }
}

@keyframes set-glow {
  from { 
    box-shadow: inset 0 0 15px rgba(0, 255, 0, 0.5);
    border-color: #00ff00;
  }
  to { 
    box-shadow: inset 0 0 25px rgba(0, 255, 0, 0.8), 0 0 15px rgba(0, 255, 0, 0.5);
    border-color: #44ff44;
  }
}
</style> 