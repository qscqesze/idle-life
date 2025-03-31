<template>
  <div class="inventory-tab">
    <div class="inventory-header">
      <h2>装备</h2>
    </div>
    <div class="equipment-grid">
      <div v-for="(item, slot) in player.equipment" :key="slot" class="equipment-slot">
        <div v-if="item" class="item" @click="unequipItem(slot)">
          <h4>{{ item.name }}</h4>
          <p v-html="getItemStats(item)"></p>
        </div>
        <div v-else class="empty-slot">{{ getSlotName(slot) }}</div>
      </div>
    </div>

    <div class="inventory-header">
      <h2>背包 ({{player.inventory.length}}/{{player.inventorySize}})</h2>
      <div class="inventory-controls">
        <button @click="sellAllItems" class="small-btn">出售全部</button>
        <button @click="toggleAutoSellConfig" class="small-btn">
          {{ openAutoSellConfig ? '关闭自动出售设置' : '自动出售设置' }}
        </button>
      </div>
    </div>
    
    <!-- 自动出售配置面板 -->
    <div v-if="openAutoSellConfig" class="auto-sell-config">
      <h3>自动出售设置</h3>
      <div class="config-row">
        <label>
          <input type="checkbox" v-model="localAutoSellConfig.enabled" @change="updateAutoSellConfig">
          启用自动出售
        </label>
      </div>
      
      <div class="config-section">
        <h4>按品质自动出售:</h4>
        <div class="quality-options">
          <label v-for="quality in itemConfig.rarityLevels" :key="quality">
            <input 
              type="checkbox" 
              v-model="localAutoSellConfig.byQuality[quality]"
              @change="updateAutoSellConfig"
            >
            <span :style="{color: itemConfig.rarityColors[quality]}">{{quality}}</span>
          </label>
        </div>
      </div>
      
      <div class="config-section">
        <h4>比较策略:</h4>
        <label>
          <input 
            type="checkbox" 
            v-model="localAutoSellConfig.compareWithEquipped"
            @change="updateAutoSellConfig"
          >
          与已装备物品比较
        </label>
        <br>
        <label>
          <input 
            type="checkbox" 
            v-model="localAutoSellConfig.keepBetterItems"
            @change="updateAutoSellConfig"
          >
          保留属性更好的物品
        </label>
      </div>
    </div>
    
    <div class="inventory-items">
      <div v-for="(item, index) in player.inventory" :key="index" 
           class="inventory-item">
        <div class="item-header">
          <h4>{{ item.name }}</h4>
          <div class="item-actions">
            <button @click="equipItem(item, index)" class="action-btn equip-btn">装备</button>
            <button @click="sellItem(item, index)" class="action-btn sell-btn">
              卖出 ({{calculateSellPrice(item)}}金币)
            </button>
          </div>
        </div>
        <p v-html="getItemStats(item)"></p>
      </div>
      <div v-if="player.inventory.length === 0" class="empty-inventory">
        <p>背包为空</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InventorySystem',
  props: {
    player: {
      type: Object,
      required: true
    },
    itemConfig: {
      type: Object,
      required: true
    },
    openAutoSellConfig: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localAutoSellConfig: {
        enabled: false,
        byQuality: {},
        compareWithEquipped: false,
        keepBetterItems: false
      }
    }
  },
  watch: {
    'player.autoSellConfig': {
      handler(newConfig) {
        this.localAutoSellConfig = JSON.parse(JSON.stringify(newConfig));
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    toggleAutoSellConfig() {
      this.$emit('toggle-auto-sell-config');
    },
    
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
      const qualityColor = this.itemConfig.rarityColors[item.quality] || "#ffffff";
      let stats = `<span style="color:${qualityColor}">${item.quality}</span> `;
      
      if (item.attack) stats += `攻击力+${item.attack} `;
      if (item.defense) stats += `防御力+${item.defense} `;
      if (item.strength) stats += `力量+${item.strength} `;
      if (item.agility) stats += `敏捷+${item.agility} `;
      if (item.vitality) stats += `体力+${item.vitality} `;
      if (item.intelligence) stats += `智力+${item.intelligence} `;
      if (item.luck) stats += `幸运+${item.luck} `;
      if (item.critRate) stats += `暴击率+${item.critRate}% `;
      if (item.critDamage) stats += `暴击伤害+${item.critDamage}% `;
      if (item.dodgeRate) stats += `闪避率+${item.dodgeRate}% `;
      if (item.expBonus) stats += `经验+${item.expBonus}% `;
      if (item.goldBonus) stats += `金币+${item.goldBonus}% `;
      if (item.itemFindBonus) stats += `掉落率+${item.itemFindBonus}% `;
      if (item.allStats) stats += `全属性+${item.allStats} `;
      
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
      const baseValue = this.itemConfig.baseValue[item.slot] || 10;
      const qualityMultiplier = this.itemConfig.qualityValueMultiplier[item.quality] || 1;
      const sellMultiplier = this.itemConfig.sellPriceMultiplier[item.quality] || 0.5;
      
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
    
    updateAutoSellConfig() {
      this.$emit('update-auto-sell-config', JSON.parse(JSON.stringify(this.localAutoSellConfig)));
    }
  }
}
</script>

<style scoped>
/* 装备与背包样式 */
/* ... 从原组件复制相关样式 ... */
</style> 