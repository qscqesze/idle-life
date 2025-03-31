<template>
  <div class="strategy-tab">
    <h2>自动策略系统</h2>
    
    <div class="strategy-section">
      <h3>自动装备策略</h3>
      <div class="strategy-toggle">
        <label class="switch">
          <input type="checkbox" :checked="player.strategies.autoEquip.enabled" @change="updateStrategy('autoEquip', 'enabled', $event.target.checked)">
          <span class="slider round"></span>
        </label>
        <span>启用自动装备</span>
      </div>
      
      <div class="strategy-options" v-if="player.strategies.autoEquip.enabled">
        <div class="option-group">
          <h4>装备优先级</h4>
          <div class="priority-option">
            <select :value="player.strategies.autoEquip.priorityType" @change="updateStrategy('autoEquip', 'priorityType', $event.target.value)">
              <option value="overall">总体评分优先</option>
              <option value="attack">攻击力优先</option>
              <option value="defense">防御力优先</option>
              <option value="custom">自定义属性权重</option>
            </select>
          </div>
          
          <div class="custom-weights" v-if="player.strategies.autoEquip.priorityType === 'custom'">
            <div class="weight-item" v-for="(weight, key) in player.strategies.autoEquip.weights" :key="key">
              <label>{{getWeightLabel(key)}}:</label>
              <input 
                type="number" 
                :value="weight" 
                min="0" 
                max="10" 
                step="0.1"
                @change="updateStrategy('autoEquip', 'weights', {...player.strategies.autoEquip.weights, [key]: Number($event.target.value)})"
              >
            </div>
          </div>

          <!-- 新增装备槽位优先级设置 -->
          <div class="slot-priorities">
            <h4>优先装备槽位</h4>
            <div class="priority-list">
              <div class="priority-item" v-for="(priority, index) in player.strategies.autoEquip.slotPriorities" :key="index">
                <span>{{index+1}}.</span>
                <select 
                  :value="priority" 
                  @change="updateSlotPriority(index, $event.target.value)"
                >
                  <option v-for="slot in availableSlots" :key="slot.key" :value="slot.key">
                    {{slot.name}}
                  </option>
                </select>
                <button class="small-btn" @click="moveSlotPriorityUp(index)" :disabled="index === 0">↑</button>
                <button class="small-btn" @click="moveSlotPriorityDown(index)" :disabled="index === player.strategies.autoEquip.slotPriorities.length - 1">↓</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="strategy-section">
      <h3>自动转生策略</h3>
      <div class="strategy-toggle">
        <label class="switch">
          <input type="checkbox" :checked="player.strategies.autoPrestige.enabled" @change="updateStrategy('autoPrestige', 'enabled', $event.target.checked)">
          <span class="slider round"></span>
        </label>
        <span>启用自动转生</span>
      </div>
      
      <div class="strategy-options" v-if="player.strategies.autoPrestige.enabled">
        <div class="option-group">
          <h4>转生策略</h4>
          <select :value="player.strategies.autoPrestige.strategy" @change="updateStrategy('autoPrestige', 'strategy', $event.target.value)">
            <option value="immediate">达到条件立即转生</option>
            <option value="delay">达到条件后延迟转生</option>
          </select>
          
          <div v-if="player.strategies.autoPrestige.strategy === 'delay'">
            <h4>延迟等级</h4>
            <div class="slider-container">
              <input 
                type="range" 
                :value="player.strategies.autoPrestige.delayLevels" 
                min="0" 
                max="20" 
                step="1"
                @input="updateStrategy('autoPrestige', 'delayLevels', Number($event.target.value))"
              >
              <span>{{player.strategies.autoPrestige.delayLevels}} 级</span>
            </div>
            <p class="strategy-info">将在达到转生条件后再提升 {{player.strategies.autoPrestige.delayLevels}} 级后转生</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="strategy-section">
      <h3>自动切换区域策略</h3>
      <div class="strategy-toggle">
        <label class="switch">
          <input type="checkbox" :checked="player.strategies.autoArea.enabled" @change="updateStrategy('autoArea', 'enabled', $event.target.checked)">
          <span class="slider round"></span>
        </label>
        <span>启用自动切换区域</span>
      </div>
      
      <div class="strategy-options" v-if="player.strategies.autoArea.enabled">
        <div class="option-group">
          <h4>切换策略</h4>
          <select :value="player.strategies.autoArea.strategy" @change="updateStrategy('autoArea', 'strategy', $event.target.value)">
            <option value="highest">选择可用最高区域</option>
            <option value="efficient">选择最高效率区域</option>
            <option value="levelBased">基于玩家等级选择</option>
            <option value="farmSpecific">特定区域掉落物品</option>
          </select>
          
          <div v-if="player.strategies.autoArea.strategy === 'levelBased'">
            <h4>等级偏移</h4>
            <div class="slider-container">
              <input 
                type="range" 
                :value="player.strategies.autoArea.levelOffset" 
                min="-10" 
                max="10" 
                step="1"
                @input="updateStrategy('autoArea', 'levelOffset', Number($event.target.value))"
              >
              <span>{{player.strategies.autoArea.levelOffset >= 0 ? '+' : ''}}{{player.strategies.autoArea.levelOffset}}</span>
            </div>
            <p class="strategy-info">选择 (玩家等级 {{player.strategies.autoArea.levelOffset >= 0 ? '+' : ''}}{{player.strategies.autoArea.levelOffset}}) 对应的区域</p>
          </div>
          
          <div v-if="player.strategies.autoArea.strategy === 'farmSpecific'">
            <h4>装备收集目标</h4>
            <div class="farm-equipment-targets">
              <div class="farm-target-section">
                <h5>物品类型:</h5>
                <select :value="player.strategies.autoArea.farmTarget.type" @change="updateFarmTarget('type', $event.target.value)">
                  <option value="any">任意物品</option>
                  <option value="weapon">武器</option>
                  <option value="offhand">副手</option>
                  <option value="helmet">头盔</option>
                  <option value="chest">胸甲</option>
                  <option value="shoulders">肩甲</option>
                  <option value="gloves">手套</option>
                  <option value="belt">腰带</option>
                  <option value="pants">裤子</option>
                  <option value="boots">靴子</option>
                  <option value="amulet">护符</option>
                  <option value="ring">戒指</option>
                </select>
              </div>
              
              <div class="farm-target-section">
                <h5>物品品质:</h5>
                <select :value="player.strategies.autoArea.farmTarget.quality" @change="updateFarmTarget('quality', $event.target.value)">
                  <option value="any">任意品质</option>
                  <option v-for="quality in itemConfig.rarityLevels" :key="quality" :value="quality">
                    {{ quality }}
                  </option>
                </select>
              </div>
              
              <div class="farm-target-section" v-if="player.strategies.autoArea.farmTarget.type !== 'any'">
                <h5>子类型:</h5>
                <select :value="player.strategies.autoArea.farmTarget.subType" @change="updateFarmTarget('subType', $event.target.value)">
                  <option value="any">任意子类型</option>
                  <option v-for="subType in getSubTypesForType(player.strategies.autoArea.farmTarget.type)" :key="subType" :value="subType">
                    {{ subType }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="strategy-section">
      <h3>自动出售策略</h3>
      <div class="strategy-toggle">
        <label class="switch">
          <input type="checkbox" :checked="player.strategies.autoSell.enabled" @change="updateStrategy('autoSell', 'enabled', $event.target.checked)">
          <span class="slider round"></span>
        </label>
        <span>启用自动出售</span>
      </div>
      
      <div class="strategy-options" v-if="player.strategies.autoSell.enabled">
        <div class="option-group">
          <h4>按品质自动出售:</h4>
          <div class="quality-options">
            <label v-for="quality in itemConfig.rarityLevels" :key="quality">
              <input 
                type="checkbox" 
                :checked="player.strategies.autoSell.byQuality[quality]"
                @change="updateStrategy('autoSell', 'byQuality', {...player.strategies.autoSell.byQuality, [quality]: $event.target.checked})"
              >
              <span :style="{color: itemConfig.rarityColors[quality]}">{{quality}}</span>
            </label>
          </div>
        </div>
        
        <div class="option-group">
          <h4>比较策略:</h4>
          <label>
            <input 
              type="checkbox" 
              :checked="player.strategies.autoSell.compareWithEquipped"
              @change="updateStrategy('autoSell', 'compareWithEquipped', $event.target.checked)"
            >
            与已装备物品比较
          </label>
          <br>
          <label>
            <input 
              type="checkbox" 
              :checked="player.strategies.autoSell.keepBetterItems"
              @change="updateStrategy('autoSell', 'keepBetterItems', $event.target.checked)"
            >
            保留属性更好的物品
          </label>
          <br>
          <label>
            <input 
              type="checkbox" 
              :checked="player.strategies.autoSell.keepSetItems"
              @change="updateStrategy('autoSell', 'keepSetItems', $event.target.checked)"
            >
            保留套装物品
          </label>
        </div>
      </div>
    </div>
    
    <div class="strategy-settings">
      <h3>策略执行设置</h3>
      <div class="setting-group">
        <label>策略检查间隔:</label>
        <select :value="player.strategies.checkInterval" @change="updateStrategy('checkInterval', null, Number($event.target.value))">
          <option value="1">非常频繁 (每1秒)</option>
          <option value="5">频繁 (每5秒)</option>
          <option value="10">普通 (每10秒)</option>
          <option value="30">较少 (每30秒)</option>
          <option value="60">稀少 (每60秒)</option>
        </select>
      </div>
      
      <div class="strategy-status">
        <div class="status-item">
          <span>上次执行:</span>
          <span>{{lastStrategyExecutionTime || '从未'}}</span>
        </div>
        <div class="status-item">
          <span>下次执行:</span>
          <span>{{nextStrategyExecutionTime}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EQUIPMENT_CONFIG } from '../config/equipment';

export default {
  name: 'StrategySystem',
  props: {
    player: {
      type: Object,
      required: true
    },
    itemConfig: {
      type: Object,
      required: true
    },
    lastStrategyExecution: {
      type: String,
      default: ''
    },
    lastStrategyExecutionTime: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      equipConfig: EQUIPMENT_CONFIG
    };
  },
  computed: {
    nextStrategyExecutionTime() {
      if (!this.lastStrategyExecutionTime) return '未知';
      const nextTime = new Date(this.lastStrategyExecutionTime);
      nextTime.setSeconds(nextTime.getSeconds() + this.player.strategies.checkInterval);
      return nextTime.toLocaleString();
    },
    availableSlots() {
      return [
        { key: 'weapon', name: '武器' },
        { key: 'offhand', name: '副手' },
        { key: 'helmet', name: '头盔' },
        { key: 'shoulders', name: '肩甲' },
        { key: 'chest', name: '胸甲' },
        { key: 'gloves', name: '手套' },
        { key: 'belt', name: '腰带' },
        { key: 'pants', name: '裤子' },
        { key: 'boots', name: '靴子' },
        { key: 'amulet', name: '护符' },
        { key: 'ring1', name: '戒指1' },
        { key: 'ring2', name: '戒指2' }
      ];
    }
  },
  methods: {
    updateStrategy(strategy, field, value) {
      this.$emit('update-strategy', {
        strategy,
        field,
        value
      });
    },
    
    updateSlotPriority(index, value) {
      const newPriorities = [...this.player.strategies.autoEquip.slotPriorities];
      newPriorities[index] = value;
      this.updateStrategy('autoEquip', 'slotPriorities', newPriorities);
    },
    
    moveSlotPriorityUp(index) {
      if (index === 0) return;
      const newPriorities = [...this.player.strategies.autoEquip.slotPriorities];
      const temp = newPriorities[index];
      newPriorities[index] = newPriorities[index - 1];
      newPriorities[index - 1] = temp;
      this.updateStrategy('autoEquip', 'slotPriorities', newPriorities);
    },
    
    moveSlotPriorityDown(index) {
      if (index === this.player.strategies.autoEquip.slotPriorities.length - 1) return;
      const newPriorities = [...this.player.strategies.autoEquip.slotPriorities];
      const temp = newPriorities[index];
      newPriorities[index] = newPriorities[index + 1];
      newPriorities[index + 1] = temp;
      this.updateStrategy('autoEquip', 'slotPriorities', newPriorities);
    },
    
    updateFarmTarget(field, value) {
      const newTarget = { ...this.player.strategies.autoArea.farmTarget };
      newTarget[field] = value;
      this.updateStrategy('autoArea', 'farmTarget', newTarget);
    },
    
    getSubTypesForType(type) {
      if (!type || type === 'any') return [];
      
      const slotConfig = this.equipConfig.slots[type];
      if (!slotConfig) return [];
      
      return slotConfig.types || [];
    },
    
    getWeightLabel(key) {
      const labels = {
        attack: '攻击力',
        defense: '防御力',
        strength: '力量',
        agility: '敏捷',
        vitality: '体力',
        intelligence: '智力',
        wisdom: '智慧',
        charisma: '魅力',
        luck: '幸运',
        critRate: '暴击率',
        critDamage: '暴击伤害',
        dodgeRate: '闪避率',
        blockRate: '格挡率',
        moveSpeed: '移动速度',
        attackSpeed: '攻击速度',
        allStats: '全属性',
        lifeSteal: '生命偷取',
        manaSteal: '法力偷取',
        expBonus: '经验加成',
        goldBonus: '金币加成'
      };
      return labels[key] || key;
    }
  }
}
</script>

<style scoped>
.strategy-tab {
  padding: 20px;
}

.strategy-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
}

.strategy-toggle {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin-right: 10px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

.strategy-options {
  margin-left: 15px;
  padding: 10px;
  background-color: #ecf0f1;
  border-radius: 5px;
}

.option-group {
  margin-bottom: 15px;
}

.option-group h4 {
  margin-top: 0;
  margin-bottom: 8px;
}

.priority-option, .setting-group {
  margin-bottom: 10px;
}

.custom-weights {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.weight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weight-item input {
  width: 60px;
  padding: 5px;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider-container input[type="range"] {
  flex: 1;
}

.strategy-info {
  font-size: 14px;
  color: #7f8c8d;
  font-style: italic;
  margin-top: 5px;
}

.strategy-settings {
  background-color: #34495e;
  color: white;
  padding: 15px;
  border-radius: 8px;
}

.strategy-status {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.status-item {
  display: flex;
  flex-direction: column;
}

.status-item span:first-child {
  font-size: 12px;
  color: #bdc3c7;
}

.quality-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.quality-options label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

select, input {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.slot-priorities {
  margin-top: 15px;
}

.priority-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.priority-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.priority-item select {
  flex: 1;
}

.small-btn {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: none;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.small-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.farm-equipment-targets {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.farm-target-section {
  background-color: rgba(255,255,255,0.1);
  padding: 8px;
  border-radius: 4px;
}

.farm-target-section h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.farm-target-section select {
  width: 100%;
}
</style> 