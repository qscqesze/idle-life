<template>
  <div class="idle-game">
    <!-- 顶部导航栏 -->
    <div class="game-navbar">
      <h1 class="game-title">闲置挂机游戏</h1>
      
      <div class="game-controls">
        <div class="save-controls">
          <button @click="saveGame" class="control-btn">保存游戏</button>
          <button @click="loadGame" class="control-btn">加载游戏</button>
          <button @click="clearSave" class="control-btn danger">清除存档</button>
        </div>
        
        <div class="speed-controls">
          <span>游戏速度: {{gameSpeed}}倍速</span>
          <button @click="decreaseSpeed" :disabled="gameSpeed <= 1" class="speed-btn">-</button>
          <button @click="increaseSpeed" :disabled="gameSpeed >= 10" class="speed-btn">+</button>
        </div>
      </div>
    </div>

    <!-- 玩家状态栏 -->
    <div class="player-status-bar">
      <div class="player-core-stats">
        <div class="stat-item">
          <div class="stat-label">等级:</div>
          <div class="stat-value">{{ player.level }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">经验:</div>
          <div class="stat-value">{{ player.exp }}/{{ expNeededForLevelUp }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">金币:</div>
          <div class="stat-value">{{ player.gold }}</div>
        </div>
        <div class="stat-item prestige-stat">
          <div class="stat-label">转生等级:</div>
          <div class="stat-value">{{ prestige.level }}</div>
        </div>
        
        <!-- 生命值和魔法值进度条 -->
        <div class="resource-bars">
          <div class="resource-bar hp-bar">
            <div class="bar-label">HP: {{ Math.ceil(player.currentHp) }}/{{ player.maxHp }}</div>
            <div class="bar-container">
              <div class="bar-fill" :style="{ width: playerHealthPercentage + '%' }"></div>
            </div>
          </div>
          <div class="resource-bar mana-bar">
            <div class="bar-label">MP: {{ Math.ceil(player.currentMana) }}/{{ player.baseMana }}</div>
            <div class="bar-container">
              <div class="bar-fill" :style="{ width: (player.currentMana/player.baseMana) * 100 + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 详细属性信息按钮 -->
      <button @click="toggleStatsPanel" class="stats-toggle-btn">
        {{ showDetailedStats ? '隐藏详细属性' : '显示详细属性' }}
      </button>
    </div>
    
    <!-- 详细属性面板（可折叠） -->
    <div class="detailed-stats-panel" v-if="showDetailedStats">
      <div class="stats-grid">
        <div class="stat-item" title="力量：增加物理攻击力">
          <div class="stat-label">力量:</div>
          <div class="stat-value">{{ player.strength }}</div>
        </div>
        <div class="stat-item" title="敏捷：增加闪避率和暴击率">
          <div class="stat-label">敏捷:</div>
          <div class="stat-value">{{ player.agility }}</div>
        </div>
        <div class="stat-item" title="体力：增加最大生命值和物理防御">
          <div class="stat-label">体力:</div>
          <div class="stat-value">{{ player.vitality }}</div>
        </div>
        <div class="stat-item" title="智力：增加魔法攻击和魔法防御">
          <div class="stat-label">智力:</div>
          <div class="stat-value">{{ player.intelligence }}</div>
        </div>
        <div class="stat-item" title="幸运：增加掉落率、暴击率和暴击伤害">
          <div class="stat-label">幸运:</div>
          <div class="stat-value">{{ player.luck }}</div>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">攻击力:</div>
          <div class="stat-value">{{ totalAttack }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">防御力:</div>
          <div class="stat-value">{{ totalDefense }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">暴击率:</div>
          <div class="stat-value">{{ totalCritRate }}%</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">暴击伤害:</div>
          <div class="stat-value">{{ totalCritDamage }}%</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">闪避率:</div>
          <div class="stat-value">{{ totalDodgeRate }}%</div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域的标签页导航 -->
    <div class="game-tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'combat' }"
        @click="activeTab = 'combat'"
      >
        战斗
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'inventory' }"
        @click="activeTab = 'inventory'"
      >
        装备与背包
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'areas' }"
        @click="activeTab = 'areas'"
      >
        区域选择
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'strategy' }"
        @click="activeTab = 'strategy'"
      >
        自动策略
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="game-content">
      <!-- 战斗区域 -->
      <div v-show="activeTab === 'combat'">
        <combat-system
          :player="player"
          :current-area="currentArea"
          :current-monster="currentMonster"
          :combat-logs="combatLogs"
          :attack-animation="attackAnimation"
          :total-attack="totalAttack"
          :total-defense="totalDefense"
          :total-crit-rate="totalCritRate"
          :total-crit-damage="totalCritDamage"
          :total-dodge-rate="totalDodgeRate"
          @player-attack="playerAttack"
          @monster-attack="monsterAttack"
          @spawn-monster="spawnMonster"
          @monster-defeated="monsterDefeated"
          @player-defeated="playerDefeated"
        />
      </div>

      <!-- 背包与装备区域 -->
      <div class="tab-content inventory-tab" v-show="activeTab === 'inventory'">
        <inventory-system
          :player="player"
          :item-config="itemConfig"
          :open-auto-sell-config="openAutoSellConfig"
          @toggle-auto-sell-config="openAutoSellConfig = !openAutoSellConfig"
          @equip-item="equipItem"
          @unequip-item="unequipItem"
          @sell-item="sellItem"
          @sell-all-items="sellAllItems"
        />
      </div>

      <!-- 区域选择区域 -->
      <div class="tab-content areas-tab" v-show="activeTab === 'areas'">
        <h2>选择冒险区域 <span class="area-subtitle">当前最高：第{{maxReachedLevel}}层</span></h2>
        
        <div class="areas-pagination">
          <button @click="prevAreaPage" :disabled="currentAreaPage === 0">上一页</button>
          <span>第 {{currentAreaPage + 1}} 页</span>
          <button @click="nextAreaPage" :disabled="currentAreaPage >= Math.floor((maxReachedLevel - 1) / areasPerPage)">下一页</button>
        </div>
        
        <div class="prestige-section">
          <h3>转生系统</h3>
          <div class="prestige-info">
            <p>当前转生等级: <span class="prestige-level">{{prestige.level}}</span></p>
            <p>全局加成倍率: <span class="prestige-bonus">{{prestigeMultiplier.toFixed(2)}}x</span></p>
            <p>下次转生需要等级: <span>{{prestigeRequirement}}</span></p>
          </div>
          <button @click="performPrestige()" class="prestige-btn" :disabled="player.level < prestigeRequirement">
            转生
          </button>
        </div>
        
        <div class="areas-grid">
          <div v-for="area in displayedAreas" 
              :key="area.id"
              class="area-card"
              :class="{ 'area-locked': player.level < area.requiredLevel, 'area-active': currentArea && currentArea.id === area.id }"
              @click="player.level >= area.requiredLevel && changeArea(area)">
            <h3>{{ area.name }}</h3>
            <p>层级: {{ area.level }}</p>
            <p>需要等级: {{ area.requiredLevel }}</p>
            <div class="monster-list">
              <p>怪物:</p>
              <ul>
                <li v-for="(monster, mIndex) in area.monsters" :key="mIndex">
                  Lv.{{area.level}} {{ monster.name }}
                </li>
              </ul>
            </div>
            <div class="area-status" v-if="player.level < area.requiredLevel">
              <span class="locked-icon">🔒</span>
              <span>等级不足</span>
            </div>
            <div class="area-status" v-else-if="currentArea && currentArea.id === area.id">
              <span class="current-icon">✓</span>
              <span>当前区域</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 策略系统界面 -->
      <div class="tab-content strategy-tab" v-show="activeTab === 'strategy'">
        <h2>自动策略系统</h2>
        
        <div class="strategy-section">
          <h3>自动装备策略</h3>
          <div class="strategy-toggle">
            <label class="switch">
              <input type="checkbox" v-model="player.strategies.autoEquip.enabled">
              <span class="slider round"></span>
            </label>
            <span>启用自动装备</span>
          </div>
          
          <div class="strategy-options" v-if="player.strategies.autoEquip.enabled">
            <div class="option-group">
              <h4>装备优先级</h4>
              <div class="priority-option">
                <select v-model="player.strategies.autoEquip.priorityType">
                  <option value="overall">总体评分优先</option>
                  <option value="attack">攻击力优先</option>
                  <option value="defense">防御力优先</option>
                  <option value="custom">自定义属性权重</option>
                </select>
              </div>
              
              <div class="custom-weights" v-if="player.strategies.autoEquip.priorityType === 'custom'">
                <div class="weight-item">
                  <label>攻击力权重:</label>
                  <input type="number" v-model.number="player.strategies.autoEquip.weights.attack" min="0" max="10" step="0.1">
                </div>
                <div class="weight-item">
                  <label>防御力权重:</label>
                  <input type="number" v-model.number="player.strategies.autoEquip.weights.defense" min="0" max="10" step="0.1">
                </div>
                <div class="weight-item">
                  <label>力量权重:</label>
                  <input type="number" v-model.number="player.strategies.autoEquip.weights.strength" min="0" max="10" step="0.1">
                </div>
                <div class="weight-item">
                  <label>敏捷权重:</label>
                  <input type="number" v-model.number="player.strategies.autoEquip.weights.agility" min="0" max="10" step="0.1">
                </div>
                <div class="weight-item">
                  <label>体力权重:</label>
                  <input type="number" v-model.number="player.strategies.autoEquip.weights.vitality" min="0" max="10" step="0.1">
                </div>
                <div class="weight-item">
                  <label>智力权重:</label>
                  <input type="number" v-model.number="player.strategies.autoEquip.weights.intelligence" min="0" max="10" step="0.1">
                </div>
                <div class="weight-item">
                  <label>幸运权重:</label>
                  <input type="number" v-model.number="player.strategies.autoEquip.weights.luck" min="0" max="10" step="0.1">
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="strategy-section">
          <h3>自动转生策略</h3>
          <div class="strategy-toggle">
            <label class="switch">
              <input type="checkbox" v-model="player.strategies.autoPrestige.enabled">
              <span class="slider round"></span>
            </label>
            <span>启用自动转生</span>
          </div>
          
          <div class="strategy-options" v-if="player.strategies.autoPrestige.enabled">
            <div class="option-group">
              <h4>转生策略</h4>
              <select v-model="player.strategies.autoPrestige.strategy">
                <option value="immediate">达到条件立即转生</option>
                <option value="delay">达到条件后延迟转生</option>
              </select>
              
              <div v-if="player.strategies.autoPrestige.strategy === 'delay'">
                <h4>延迟等级</h4>
                <div class="slider-container">
                  <input 
                    type="range" 
                    v-model.number="player.strategies.autoPrestige.delayLevels" 
                    min="0" 
                    max="20" 
                    step="1"
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
              <input type="checkbox" v-model="player.strategies.autoArea.enabled">
              <span class="slider round"></span>
            </label>
            <span>启用自动切换区域</span>
          </div>
          
          <div class="strategy-options" v-if="player.strategies.autoArea.enabled">
            <div class="option-group">
              <h4>切换策略</h4>
              <select v-model="player.strategies.autoArea.strategy">
                <option value="highest">选择可用最高区域</option>
                <option value="efficient">选择最高效率区域</option>
                <option value="levelBased">基于玩家等级选择</option>
              </select>
              
              <div v-if="player.strategies.autoArea.strategy === 'levelBased'">
                <h4>等级偏移</h4>
                <div class="slider-container">
                  <input 
                    type="range" 
                    v-model.number="player.strategies.autoArea.levelOffset" 
                    min="-10" 
                    max="10" 
                    step="1"
                  >
                  <span>{{player.strategies.autoArea.levelOffset >= 0 ? '+' : ''}}{{player.strategies.autoArea.levelOffset}}</span>
                </div>
                <p class="strategy-info">选择 (玩家等级 {{player.strategies.autoArea.levelOffset >= 0 ? '+' : ''}}{{player.strategies.autoArea.levelOffset}}) 对应的区域</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="strategy-settings">
          <h3>策略执行设置</h3>
          <div class="setting-group">
            <label>策略检查间隔:</label>
            <select v-model="player.strategies.checkInterval">
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
    </div>
  </div>
</template>

<script>
// 导入游戏配置
import { gameConfig, playerConfig, itemConfig } from '../config/gameConfig';
import CombatSystem from './CombatSystem.vue';
import InventorySystem from './InventorySystem.vue';

export default {
  name: 'IdleGame',
  components: {
    CombatSystem,
    InventorySystem
  },
  data() {
    return {
      gameInterval: null,
      tickRate: gameConfig.defaultSettings.tickRate,
      gameSpeed: 1,
      combatLogs: [],
      maxCombatLogs: gameConfig.defaultSettings.maxCombatLogs,
      
      // 新增的数据属性
      activeTab: 'combat',
      showDetailedStats: false,
      
      // 使用配置中的初始玩家数据
      player: JSON.parse(JSON.stringify(playerConfig.initialStats)),
      
      currentMonster: null,
      currentArea: null,
      
      // 修改区域系统为无限层级
      currentLevel: 1,
      maxReachedLevel: 1,
      areasPerPage: 9,
      currentAreaPage: 0,
      
      // 添加转生/重生系统
      prestige: {
        level: 0,
        multiplier: 1,
        cost: 100
      },
      
      // 修改区域定义方式
      areas: [], // 将在created生命周期中动态生成
      
      // 使用配置中的物品类型
      itemTypes: itemConfig.itemTypes,
      
      openAutoSellConfig: false,
      itemConfig: itemConfig,
      attackAnimation: null,
      animationTimer: null,
      
      // 策略系统相关数据
      lastStrategyExecution: 0,
      lastStrategyExecutionTime: null,
    };
  },
  
  computed: {
    totalAttack() {
      // 基础攻击力 = 力量计算值 + 装备加成
      let attack = playerConfig.calculations.attackPower(
        this.player.strength, 
        this.player.level
      );
      
      // 装备加成
      for (const slot in this.player.equipment) {
        if (this.player.equipment[slot]) {
          if (this.player.equipment[slot].attack) {
            attack += this.player.equipment[slot].attack;
          }
          // 力量属性加成
          if (this.player.equipment[slot].strength) {
            attack += this.player.equipment[slot].strength * 2;
          }
          // 全属性加成
          if (this.player.equipment[slot].allStats) {
            attack += this.player.equipment[slot].allStats * 2;
          }
        }
      }
      
      return Math.floor(attack);
    },
    
    totalDefense() {
      // 基础防御力 = 体力计算值 + 装备加成
      let defense = playerConfig.calculations.defensePower(
        this.player.vitality, 
        this.player.level
      );
      
      // 装备加成
      for (const slot in this.player.equipment) {
        if (this.player.equipment[slot]) {
          if (this.player.equipment[slot].defense) {
            defense += this.player.equipment[slot].defense;
          }
          // 体力属性加成
          if (this.player.equipment[slot].vitality) {
            defense += this.player.equipment[slot].vitality * 1.5;
          }
          // 全属性加成
          if (this.player.equipment[slot].allStats) {
            defense += this.player.equipment[slot].allStats * 1.5;
          }
        }
      }
      
      return Math.floor(defense);
    },
    
    totalCritRate() {
      let critRate = playerConfig.calculations.critRate(
        this.player.agility,
        this.player.luck
      );
      
      // 装备加成
      for (const slot in this.player.equipment) {
        if (this.player.equipment[slot] && this.player.equipment[slot].critRate) {
          critRate += this.player.equipment[slot].critRate;
        }
      }
      
      return critRate;
    },
    
    totalCritDamage() {
      let critDamage = playerConfig.calculations.critDamage(this.player.luck);
      
      // 装备加成
      for (const slot in this.player.equipment) {
        if (this.player.equipment[slot] && this.player.equipment[slot].critDamage) {
          critDamage += this.player.equipment[slot].critDamage;
        }
      }
      
      return critDamage;
    },
    
    totalDodgeRate() {
      let dodgeRate = playerConfig.calculations.dodgeRate(this.player.agility);
      
      // 装备加成
      for (const slot in this.player.equipment) {
        if (this.player.equipment[slot] && this.player.equipment[slot].dodgeRate) {
          dodgeRate += this.player.equipment[slot].dodgeRate;
        }
      }
      
      return dodgeRate;
    },
    
    expNeededForLevelUp() {
      return Math.floor(100 * Math.pow(1.1, this.player.level));
    },
    
    monsterHealthPercentage() {
      if (!this.currentMonster) return 0;
      return (this.currentMonster.currentHp / this.currentMonster.maxHp) * 100;
    },
    
    playerHealthPercentage() {
      return (this.player.currentHp / this.player.maxHp) * 100;
    },
    
    // 添加当前页面可显示的区域
    displayedAreas() {
      const startIndex = this.currentAreaPage * this.areasPerPage;
      const endIndex = startIndex + this.areasPerPage;
      return this.areas.slice(startIndex, endIndex);
    },
    
    // 新增：获取转生需要的等级
    prestigeRequirement() {
      return 50 + (this.prestige.level * 10);
    },
    
    // 修改名称避免与方法名冲突
    prestigeMultiplier() {
      return this.prestige.multiplier * (1 + (this.prestige.level * 0.2));
    },
    
    // 计算下次策略执行时间
    nextStrategyExecutionTime() {
      if (!this.lastStrategyExecution) {
        return '立即';
      }
      
      const now = Date.now();
      const nextTime = this.lastStrategyExecution + (this.player.strategies.checkInterval * 1000);
      const timeLeft = Math.max(0, (nextTime - now) / 1000);
      
      if (timeLeft <= 0) {
        return '立即';
      } else if (timeLeft < 60) {
        return `${Math.ceil(timeLeft)}秒后`;
      } else {
        return `${Math.floor(timeLeft / 60)}分${Math.ceil(timeLeft % 60)}秒后`;
      }
    },
  },
  
  created() {
    console.log('IdleGame组件已创建');
    // 尝试加载存档
    this.loadGame();
    
    // 动态生成区域
    this.generateAreas();
    
    // 初始化玩家策略系统
    if (!this.player.strategies) {
      this.initializeStrategies();
    }
  },
  
  mounted() {
    console.log('IdleGame组件已挂载');
    // 开始游戏循环
    if (!this.currentArea) {
      this.changeArea(this.areas[0]);
    }
    console.log('当前区域:', this.currentArea);
    this.startGameLoop();
  },
  
  beforeUnmount() {
    // 清除游戏循环
    clearInterval(this.gameInterval);
  },
  
  methods: {
    startGameLoop() {
      // 清除旧的循环
      if (this.gameInterval) {
        clearInterval(this.gameInterval);
      }
      // 设置新的游戏循环，根据游戏速度调整
      const adjustedTickRate = Math.max(50, this.tickRate / this.gameSpeed);
      this.gameInterval = setInterval(this.gameTick, adjustedTickRate);
      console.log(`游戏循环已启动，速度: ${this.gameSpeed}倍，间隔: ${adjustedTickRate}ms`);
    },

    // 增加游戏速度
    increaseSpeed() {
      if (this.gameSpeed < 10) {
        this.gameSpeed++;
        this.startGameLoop();
      }
    },

    // 减少游戏速度
    decreaseSpeed() {
      if (this.gameSpeed > 1) {
        this.gameSpeed--;
        this.startGameLoop();
      }
    },

    // 保存游戏数据到本地存储
    saveGame() {
      try {
        const saveData = {
          player: this.player,
          currentArea: this.currentArea ? this.currentArea.id : 1,
          maxReachedLevel: this.maxReachedLevel,
          prestige: this.prestige,
          // 保存策略配置
          strategies: this.player.strategies,
          timestamp: new Date().toLocaleString()
        };
        localStorage.setItem(gameConfig.defaultSettings.saveKey, JSON.stringify(saveData));
        this.addCombatLog(`游戏已保存！`);
      } catch (error) {
        console.error('保存游戏失败:', error);
        this.addCombatLog(`保存游戏失败: ${error.message}`);
      }
    },

    // 从本地存储加载游戏数据
    loadGame() {
      try {
        const saveData = localStorage.getItem(gameConfig.defaultSettings.saveKey);
        if (saveData) {
          const parsedData = JSON.parse(saveData);
          
          // 恢复玩家数据
          this.player = parsedData.player;
          
          // 初始化策略系统（如果不存在）
          if (!this.player.strategies) {
            this.initializeStrategies();
          }
          
          // 恢复转生数据
          if (parsedData.prestige) {
            this.prestige = parsedData.prestige;
          }
          
          // 恢复最高层级
          if (parsedData.maxReachedLevel) {
            this.maxReachedLevel = parsedData.maxReachedLevel;
          }
          
          // 确保区域已生成
          this.generateAreas();
          
          // 恢复当前区域
          if (parsedData.currentArea) {
            const areaId = parsedData.currentArea;
            const area = this.areas.find(a => a.id === areaId);
            if (area) {
              this.currentArea = {...area};
            } else {
              this.changeArea(this.areas[0]);
            }
          }
          
          this.addCombatLog(`游戏已加载！上次保存时间: ${parsedData.timestamp}`);
          return true;
        }
        return false;
      } catch (error) {
        console.error('加载游戏失败:', error);
        this.addCombatLog(`加载游戏失败: ${error.message}`);
        return false;
      }
    },

    // 清除存档
    clearSave() {
      if (confirm('确定要清除存档吗？此操作不可恢复！')) {
        localStorage.removeItem(gameConfig.defaultSettings.saveKey);
        this.resetGame();
        this.addCombatLog(`存档已清除！游戏已重置。`);
      }
    },

    // 重置游戏状态
    resetGame() {
      // 使用配置中的初始玩家数据
      this.player = JSON.parse(JSON.stringify(playerConfig.initialStats));
      this.currentMonster = null;
      this.changeArea(this.areas[0]);
    },

    gameTick() {
      // 如果没有当前怪物，生成一个
      if (!this.currentMonster) {
        this.spawnMonster();
        return;
      }
      
      // 玩家攻击怪物
      this.playerAttack();
      
      // 检查怪物是否死亡
      if (this.currentMonster.currentHp <= 0) {
        this.monsterDefeated();
        return;
      }
      
      // 怪物攻击玩家
      this.monsterAttack();
      
      // 检查玩家是否死亡
      if (this.player.currentHp <= 0) {
        this.playerDefeated();
      }
      
      // 执行自动策略
      this.executeStrategies();
    },
    
    spawnMonster() {
      // 随机选择一个怪物
      const monsterTemplate = this.currentArea.monsters[Math.floor(Math.random() * this.currentArea.monsters.length)];
      
      // 根据区域等级和玩家属性动态调整怪物强度
      const monsterLevel = this.currentArea.level;
      const prestigeBonus = Math.pow(1.05, this.prestige.level);
      
      this.currentMonster = {
        ...monsterTemplate,
        level: monsterLevel,
        maxHp: monsterTemplate.baseHp * prestigeBonus,
        exp: monsterTemplate.baseExp * prestigeBonus,
        gold: monsterTemplate.baseGold * prestigeBonus,
        attack: 5 * Math.pow(1.1, monsterLevel) * prestigeBonus,
        defense: 2 * Math.pow(1.1, monsterLevel) * prestigeBonus
      };
      
      this.currentMonster.currentHp = this.currentMonster.maxHp;
      
      this.addCombatLog(`遇到了Lv.${this.currentMonster.level}${this.currentMonster.name}！`);
    },
    
    playerAttack() {
      // 计算玩家攻击伤害
      let damage = Math.max(1, this.totalAttack - this.currentMonster.defense / 2);
      
      // 检查是否暴击
      let isCrit = false;
      if (Math.random() * 100 < this.totalCritRate) {
        damage = damage * (this.totalCritDamage / 100);
        isCrit = true;
      }
      
      // 显示攻击动画
      this.showAttackAnimation('player', damage, isCrit);
      
      this.currentMonster.currentHp -= damage;
      
      if (isCrit) {
        this.addCombatLog(`暴击！你对${this.currentMonster.name}造成${damage.toFixed(1)}点伤害！`);
      } else {
        this.addCombatLog(`你对${this.currentMonster.name}造成${damage.toFixed(1)}点伤害！`);
      }
    },
    
    monsterAttack() {
      // 检查是否闪避
      if (Math.random() * 100 < this.totalDodgeRate) {
        this.addCombatLog(`你闪避了${this.currentMonster.name}的攻击！`);
        return;
      }
      
      // 计算怪物攻击伤害
      const damage = Math.max(1, this.currentMonster.attack - this.totalDefense / 2);
      
      // 显示攻击动画
      this.showAttackAnimation('monster', damage, false);
      
      this.player.currentHp -= damage;
      
      this.addCombatLog(`${this.currentMonster.name}对你造成${damage.toFixed(1)}点伤害！`);
    },
    
    monsterDefeated() {
      // 应用经验加成
      let expBonus = 0;
      for (const slot in this.player.equipment) {
        if (this.player.equipment[slot] && this.player.equipment[slot].expBonus) {
          expBonus += this.player.equipment[slot].expBonus;
        }
      }
      
      // 应用金币加成
      let goldBonus = 0;
      for (const slot in this.player.equipment) {
        if (this.player.equipment[slot] && this.player.equipment[slot].goldBonus) {
          goldBonus += this.player.equipment[slot].goldBonus;
        }
      }
      
      // 计算实际获得的经验和金币
      const expGain = Math.floor(this.currentMonster.exp * (1 + expBonus / 100));
      const goldGain = Math.floor(this.currentMonster.gold * (1 + goldBonus / 100));
      
      // 获得经验和金币
      this.player.exp += expGain;
      this.player.gold += goldGain;
      
      this.addCombatLog(`击败了${this.currentMonster.name}！获得${expGain}经验和${goldGain}金币！`);
      
      // 检查是否掉落装备
      this.checkItemDrop();
      
      // 检查是否升级
      this.checkLevelUp();
      
      // 移除当前怪物
      this.currentMonster = null;
      
      // 战斗胜利后自动保存游戏
      this.saveGame();
      
      // 在战斗结束时额外检查一次自动售出策略
      this.checkInventoryAndSell();
      
      // 添加层级解锁检查
      if (this.currentArea.level === this.maxReachedLevel && this.currentArea.level < this.areas.length) {
        this.maxReachedLevel++;
        this.addCombatLog(`解锁了新区域：${this.areas[this.maxReachedLevel - 1].name}！`);
        
        // 如果已经接近生成的区域上限，再生成一批
        if (this.maxReachedLevel >= this.areas.length - 5) {
          this.generateAreas();
        }
      }
    },
    
    playerDefeated() {
      this.addCombatLog(`你被${this.currentMonster.name}击败了！`);
      
      // 恢复生命值并失去一些金币
      this.player.currentHp = this.player.maxHp;
      this.player.gold = Math.floor(this.player.gold * 0.9);
      
      // 移除当前怪物
      this.currentMonster = null;
    },
    
    checkLevelUp() {
      let leveled = false;
      while (this.player.exp >= this.expNeededForLevelUp) {
        this.player.exp -= this.expNeededForLevelUp;
        this.player.level++;
        
        // 属性提升
        this.player.strength += 1;
        this.player.agility += 1;
        this.player.vitality += 1;
        this.player.intelligence += 1;
        this.player.luck += 1;
        
        // 根据新属性更新最大生命值
        this.player.maxHp = playerConfig.calculations.maxHp(this.player.vitality, this.player.level);
        this.player.currentHp = this.player.maxHp;
        
        // 更新魔法值
        this.player.baseMana = playerConfig.calculations.maxMana(this.player.intelligence, this.player.level);
        this.player.currentMana = this.player.baseMana;
        
        this.addCombatLog(`升级了！现在是${this.player.level}级！`);
        leveled = true;
      }
      
      // 升级后自动保存游戏
      if (leveled) {
        this.saveGame();
      }
    },
    
    checkItemDrop() {
      // 计算物品掉落率加成
      let itemFindBonus = playerConfig.calculations.itemFindRate(this.player.luck) / 100;
      
      // 装备加成
      for (const slot in this.player.equipment) {
        if (this.player.equipment[slot] && this.player.equipment[slot].itemFindBonus) {
          itemFindBonus += this.player.equipment[slot].itemFindBonus / 100;
        }
      }
      
      // 计算实际掉落率
      const dropRate = this.currentMonster.dropRate * (1 + itemFindBonus);
      
      // 判断是否掉落装备
      if (Math.random() < dropRate) {
        // 随机选择装备类型
        const equipmentSlots = Object.keys(this.player.equipment);
        const randomSlot = equipmentSlots[Math.floor(Math.random() * equipmentSlots.length)];
        
        // 根据玩家等级和区域确定装备品质
        let qualityIndex = 0;
        if (this.player.level >= 5) qualityIndex = 1;
        if (this.player.level >= 10) qualityIndex = 2;
        if (this.player.level >= 15) qualityIndex = 3;
        if (this.player.level >= 20) qualityIndex = 4;
        
        // 随机调整品质（可能上下浮动一级）
        qualityIndex = Math.max(0, Math.min(4, qualityIndex + (Math.random() > 0.7 ? 1 : 0) - (Math.random() > 0.7 ? 1 : 0)));
        
        // 获取对应品质的装备
        const itemList = this.itemTypes[randomSlot];
        if (itemList && qualityIndex < itemList.length) {
          const item = { ...itemList[qualityIndex], slot: randomSlot };
          
          // 添加到背包
          this.player.inventory.push(item);
          
          // 获取对应稀有度的颜色
          const qualityColor = itemConfig.rarityColors[item.quality] || "#ffffff";
          
          this.addCombatLog(`获得了<span style="color:${qualityColor}">【${item.quality}】${item.name}</span>！`);
          
          // 检查背包容量并应用自动售出策略
          this.checkInventoryAndSell();
        }
      }
    },
    
    equipItem(item, inventoryIndex) {
      // 如果已经装备了物品，先卸下并放入背包
      if (this.player.equipment[item.slot]) {
        this.player.inventory.push(this.player.equipment[item.slot]);
      }
      
      // 装备新物品
      this.player.equipment[item.slot] = item;
      
      // 从背包中移除
      this.player.inventory.splice(inventoryIndex, 1);
    },
    
    unequipItem(slot) {
      // 确认装备槽有物品
      if (this.player.equipment[slot]) {
        // 将物品添加到背包
        this.player.inventory.push(this.player.equipment[slot]);
        
        // 清空装备槽
        this.player.equipment[slot] = null;
      }
    },
    
    changeArea(area) {
      console.log('changeArea被调用', area);
      // 检查玩家等级是否符合要求
      if (this.player.level < area.requiredLevel) {
        this.addCombatLog(`等级不足，无法进入${area.name}！`);
        return;
      }
      
      this.currentArea = {...area};
      this.currentMonster = null;
      this.addCombatLog(`进入了${area.name}！`);
      this.currentLevel = area.level;
      console.log('区域切换完成:', this.currentArea);
    },
    
    getItemStats(item) {
      const qualityColor = itemConfig.rarityColors[item.quality] || "#ffffff";
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
    
    addCombatLog(message) {
      console.log('战斗日志:', message);
      this.combatLogs.unshift(message);
      if (this.combatLogs.length > this.maxCombatLogs) {
        this.combatLogs.pop();
      }
    },
    
    sellAllItems() {
      if (this.player.inventory.length === 0) {
        this.addCombatLog('背包为空，没有物品可出售');
        return;
      }
      
      let totalGold = 0;
      let itemCount = this.player.inventory.length;
      
      // 计算总售价
      for (const item of this.player.inventory) {
        totalGold += this.calculateSellPrice(item);
      }
      
      // 清空背包并增加金币
      this.player.inventory = [];
      this.player.gold += totalGold;
      
      this.addCombatLog(`出售了${itemCount}件物品，获得${totalGold}金币`);
    },
    
    sellItem(item, index) {
      const sellPrice = this.calculateSellPrice(item);
      this.player.gold += sellPrice;
      this.player.inventory.splice(index, 1);
      
      const qualityColor = itemConfig.rarityColors[item.quality] || "#ffffff";
      this.addCombatLog(`出售了<span style="color:${qualityColor}">【${item.quality}】${item.name}</span>，获得${sellPrice}金币`);
    },
    
    calculateSellPrice(item) {
      const baseValue = itemConfig.baseValue[item.slot] || 10;
      const qualityMultiplier = itemConfig.qualityValueMultiplier[item.quality] || 1;
      const sellMultiplier = itemConfig.sellPriceMultiplier[item.quality] || 0.5;
      
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
    
    // 检查并应用自动售出策略
    applyAutoSellStrategy() {
      // 如果自动售出未启用，直接返回
      if (!this.player.autoSellConfig.enabled) return;
      
      // 用于标记要售出的物品
      const itemsToSell = [];
      let totalValue = 0;
      
      // 遍历背包物品
      for (let i = 0; i < this.player.inventory.length; i++) {
        const item = this.player.inventory[i];
        
        // 检查品质自动售出
        if (this.player.autoSellConfig.byQuality[item.quality]) {
          itemsToSell.push(i);
          totalValue += this.calculateSellPrice(item);
          continue;
        }
        
        // 检查与装备比较售出
        if (this.player.autoSellConfig.compareWithEquipped) {
          const equippedItem = this.player.equipment[item.slot];
          
          // 如果存在相同槽位的装备，并且配置了保留更好物品
          if (equippedItem && this.player.autoSellConfig.keepBetterItems) {
            // 比较物品，如果当前物品不如已装备的，则售出
            if (!this.isItemBetter(item, equippedItem)) {
              itemsToSell.push(i);
              totalValue += this.calculateSellPrice(item);
            }
          }
        }
      }
      
      // 从后向前删除物品，避免索引混乱
      for (let i = itemsToSell.length - 1; i >= 0; i--) {
        this.player.inventory.splice(itemsToSell[i], 1);
      }
      
      // 如果有物品被售出，增加金币并记录日志
      if (itemsToSell.length > 0) {
        this.player.gold += totalValue;
        this.addCombatLog(`自动出售了${itemsToSell.length}件物品，获得${totalValue}金币`);
      }
    },
    
    // 比较两个物品，判断第一个是否比第二个更好
    isItemBetter(newItem, oldItem) {
      // 如果品质更高，肯定更好
      const qualityRank = {
        普通: 1,
        优质: 2,
        稀有: 3,
        史诗: 4,
        传说: 5
      };
      
      if (qualityRank[newItem.quality] > qualityRank[oldItem.quality]) {
        return true;
      }
      
      // 计算物品总属性值
      const getItemValue = (item) => {
        let value = 0;
        if (item.attack) value += item.attack * 1;
        if (item.defense) value += item.defense * 1;
        if (item.strength) value += item.strength * 1.2;
        if (item.agility) value += item.agility * 1.2;
        if (item.vitality) value += item.vitality * 1.2;
        if (item.intelligence) value += item.intelligence * 1.2;
        if (item.luck) value += item.luck * 1.5;
        if (item.critRate) value += item.critRate * 1.8;
        if (item.critDamage) value += item.critDamage * 0.2;
        if (item.dodgeRate) value += item.dodgeRate * 1.8;
        return value;
      };
      
      return getItemValue(newItem) > getItemValue(oldItem);
    },
    
    // 在获得物品后检查背包容量并应用自动售出
    checkInventoryAndSell() {
      // 应用自动售出策略
      this.applyAutoSellStrategy();
      
      // 背包已满时的处理
      if (this.player.inventory.length > this.player.inventorySize) {
        this.addCombatLog(`背包已满！最低价值的物品将被自动售出`);
        
        // 继续超出的部分按价值排序并售出
        while (this.player.inventory.length > this.player.inventorySize) {
          // 找出最低价值的物品
          let lowestValueIndex = 0;
          let lowestValue = this.calculateSellPrice(this.player.inventory[0]);
          
          for (let i = 1; i < this.player.inventory.length; i++) {
            const itemValue = this.calculateSellPrice(this.player.inventory[i]);
            if (itemValue < lowestValue) {
              lowestValue = itemValue;
              lowestValueIndex = i;
            }
          }
          
          // 售出最低价值物品
          this.sellItem(this.player.inventory[lowestValueIndex], lowestValueIndex);
        }
      }
    },
    
    // 新增方法：显示攻击动画
    showAttackAnimation(attacker, damage, isCrit) {
      // 清除现有动画计时器
      if (this.animationTimer) {
        clearTimeout(this.animationTimer);
      }
      
      // 设置攻击动画数据
      this.attackAnimation = {
        attacker,
        damage: isCrit ? `暴击！${damage.toFixed(1)}` : damage.toFixed(1)
      };
      
      // 设置动画持续时间
      this.animationTimer = setTimeout(() => {
        this.attackAnimation = null;
      }, 800);
    },
    
    // 新增的方法
    toggleStatsPanel() {
      this.showDetailedStats = !this.showDetailedStats;
    },
    
    // 动态生成无限区域
    generateAreas() {
      this.areas = [];
      // 生成足够多的区域
      for (let i = 1; i <= Math.max(50, this.maxReachedLevel + 10); i++) {
        this.areas.push(this.generateArea(i));
      }
    },
    
    generateArea(level) {
      const themes = [
        { prefix: "荒芜", suffix: "废土" },
        { prefix: "冰冻", suffix: "冰原" },
        { prefix: "灼热", suffix: "熔岩" },
        { prefix: "神秘", suffix: "森林" },
        { prefix: "幽暗", suffix: "洞窟" },
        { prefix: "远古", suffix: "遗迹" },
        { prefix: "天空", suffix: "岛屿" },
        { prefix: "诅咒", suffix: "城堡" },
      ];
      
      const theme = themes[Math.floor(level / 10) % themes.length];
      const areaName = `${theme.prefix}${level}层${theme.suffix}`;
      
      // 根据层级动态生成怪物
      const monsters = [];
      for (let i = 0; i < 3; i++) {
        monsters.push(this.generateMonster(level, i));
      }
      
      return {
        id: level,
        name: areaName,
        requiredLevel: Math.max(1, level - 5),
        level: level,
        monsters: monsters
      };
    },
    
    generateMonster(areaLevel, index) {
      const prefixes = ["小", "巨大", "疯狂", "狂暴", "诡异", "远古", "幽灵", "神圣", "黑暗"];
      const monsters = ["史莱姆", "骷髅", "蝙蝠", "石魔像", "巨龙", "狼人", "幽灵", "恶魔", "精灵"];
      const suffixes = ["", "王", "守卫", "首领", "统领", "大师"];
      
      const nameIndex = (areaLevel + index) % monsters.length;
      const prefixIndex = Math.floor(areaLevel / 10) % prefixes.length;
      const suffixIndex = Math.floor(areaLevel / 20) % suffixes.length;
      
      const name = `${prefixes[prefixIndex]}${monsters[nameIndex]}${suffixes[suffixIndex]}`;
      
      // 指数增长的怪物属性
      const baseMultiplier = Math.pow(1.1, areaLevel);
      
      return {
        name: name,
        baseHp: 20 * baseMultiplier * (index + 1),
        baseExp: 5 * baseMultiplier,
        baseGold: 2 * baseMultiplier,
        dropRate: 0.2 + (index * 0.05) + (Math.min(0.3, areaLevel * 0.005)),
        level: areaLevel
      };
    },
    
    // 新增：转生系统
    performPrestige(isAuto = false) {
      if (this.player.level < this.prestigeRequirement) {
        this.addCombatLog(`转生失败：需要达到${this.prestigeRequirement}级`);
        return;
      }
      
      // 如果不是自动转生，则显示确认对话框
      if (!isAuto && !confirm(`确定要转生吗？你将重置等级和装备，但获得${(this.prestige.level + 1) * 20}%的全局加成`)) {
        return;
      }
      
      // 增加转生等级
      this.prestige.level++;
      this.prestige.multiplier = 1 + (this.prestige.level * 0.2);
      
      // 重置玩家状态
      this.player = JSON.parse(JSON.stringify(playerConfig.initialStats));
      this.player.inventory = [];
      this.player.equipment = {
        weapon: null,
        armor: null,
        helmet: null,
        boots: null,
        accessory: null
      };
      
      // 恢复策略设置
      if (!this.player.strategies) {
        this.initializeStrategies();
      }
      
      // 重置当前区域
      this.currentLevel = 1;
      this.changeArea(this.areas[0]);
      
      this.addCombatLog(`${isAuto ? '自动策略: ' : ''}转生成功！转生等级提升到${this.prestige.level}，获得了${this.prestige.multiplier.toFixed(2)}倍全局加成！`);
      
      // 自动保存
      this.saveGame();
    },
    
    // 添加区域分页功能
    nextAreaPage() {
      const maxPage = Math.floor((this.maxReachedLevel - 1) / this.areasPerPage);
      if (this.currentAreaPage < maxPage) {
        this.currentAreaPage++;
      }
    },
    
    prevAreaPage() {
      if (this.currentAreaPage > 0) {
        this.currentAreaPage--;
      }
    },
    
    // 初始化策略系统
    initializeStrategies() {
      this.player.strategies = {
        checkInterval: 10, // 检查间隔（秒）
        
        // 自动装备策略
        autoEquip: {
          enabled: false,
          priorityType: 'overall', // 'overall', 'attack', 'defense', 'custom'
          weights: {
            attack: 1.0,
            defense: 1.0,
            strength: 1.0,
            agility: 1.0,
            vitality: 1.0,
            intelligence: 1.0,
            luck: 1.0,
            critRate: 1.0,
            critDamage: 1.0,
            dodgeRate: 1.0
          }
        },
        
        // 自动转生策略
        autoPrestige: {
          enabled: false,
          strategy: 'immediate', // 'immediate', 'delay'
          delayLevels: 5 // 达到转生条件后再提升多少级
        },
        
        // 自动切换区域策略
        autoArea: {
          enabled: false,
          strategy: 'highest', // 'highest', 'efficient', 'levelBased'
          levelOffset: 0 // 区域等级 = 玩家等级 + 偏移
        }
      };
    },
    
    // 执行自动策略
    executeStrategies() {
      // 检查是否需要执行策略
      const now = Date.now();
      if (this.lastStrategyExecution && 
          (now - this.lastStrategyExecution < this.player.strategies.checkInterval * 1000)) {
        return; // 还未到检查时间
      }
      
      // 记录本次执行时间
      this.lastStrategyExecution = now;
      this.lastStrategyExecutionTime = new Date().toLocaleTimeString();
      
      // 执行三个自动策略
      if (this.player.strategies.autoEquip.enabled) {
        this.executeAutoEquipStrategy();
      }
      
      if (this.player.strategies.autoPrestige.enabled) {
        this.executeAutoPrestigeStrategy();
      }
      
      if (this.player.strategies.autoArea.enabled) {
        this.executeAutoAreaStrategy();
      }
    },
    
    // 执行自动装备策略
    executeAutoEquipStrategy() {
      // 如果背包为空，无需继续
      if (this.player.inventory.length === 0) {
        return;
      }
      
      const priorityType = this.player.strategies.autoEquip.priorityType;
      const weights = this.player.strategies.autoEquip.weights;
      
      // 遍历背包中的每个物品，按照优先级评分
      for (let i = 0; i < this.player.inventory.length; i++) {
        const item = this.player.inventory[i];
        const currentEquipped = this.player.equipment[item.slot];
        
        // 如果当前装备槽为空，直接装备
        if (!currentEquipped) {
          this.equipItem(item, i);
          i--; // 因为装备后该物品会从背包移除，需要调整索引
          continue;
        }
        
        // 计算物品评分
        const itemScore = this.calculateItemScore(item, priorityType, weights);
        const equippedScore = this.calculateItemScore(currentEquipped, priorityType, weights);
        
        // 如果新物品评分更高，替换当前装备
        if (itemScore > equippedScore) {
          this.equipItem(item, i);
          i--; // 因为装备后该物品会从背包移除，需要调整索引
        }
      }
    },
    
    // 计算物品评分
    calculateItemScore(item, priorityType, weights) {
      let score = 0;
      
      if (priorityType === 'overall') {
        // 总体评分 - 所有属性都考虑
        if (item.attack) score += item.attack * 1;
        if (item.defense) score += item.defense * 1;
        if (item.strength) score += item.strength * 1.2;
        if (item.agility) score += item.agility * 1.2;
        if (item.vitality) score += item.vitality * 1.2;
        if (item.intelligence) score += item.intelligence * 1.2;
        if (item.luck) score += item.luck * 1.5;
        if (item.critRate) score += item.critRate * 0.5;
        if (item.critDamage) score += item.critDamage * 0.2;
        if (item.dodgeRate) score += item.dodgeRate * 0.5;
        if (item.allStats) score += item.allStats * 5;
      } 
      else if (priorityType === 'attack') {
        // 攻击优先
        if (item.attack) score += item.attack * 2;
        if (item.strength) score += item.strength * 2;
        if (item.critRate) score += item.critRate * 1;
        if (item.critDamage) score += item.critDamage * 0.5;
        // 其他属性权重较低
        if (item.defense) score += item.defense * 0.5;
        if (item.vitality) score += item.vitality * 0.5;
        if (item.agility) score += item.agility * 0.8;
        if (item.intelligence) score += item.intelligence * 0.5;
        if (item.luck) score += item.luck * 1;
        if (item.allStats) score += item.allStats * 3;
      }
      else if (priorityType === 'defense') {
        // 防御优先
        if (item.defense) score += item.defense * 2;
        if (item.vitality) score += item.vitality * 2;
        if (item.dodgeRate) score += item.dodgeRate * 1;
        // 其他属性权重较低
        if (item.attack) score += item.attack * 0.5;
        if (item.strength) score += item.strength * 0.5;
        if (item.agility) score += item.agility * 1;
        if (item.intelligence) score += item.intelligence * 0.8;
        if (item.luck) score += item.luck * 0.5;
        if (item.allStats) score += item.allStats * 3;
      }
      else if (priorityType === 'custom') {
        // 使用自定义权重
        if (item.attack) score += item.attack * weights.attack;
        if (item.defense) score += item.defense * weights.defense;
        if (item.strength) score += item.strength * weights.strength;
        if (item.agility) score += item.agility * weights.agility;
        if (item.vitality) score += item.vitality * weights.vitality;
        if (item.intelligence) score += item.intelligence * weights.intelligence;
        if (item.luck) score += item.luck * weights.luck;
      }
      
      // 给稀有度加成
      const rarityMultiplier = {
        '普通': 1,
        '优质': 1.1,
        '稀有': 1.2,
        '史诗': 1.4,
        '传说': 1.8
      };
      
      if (item.quality && rarityMultiplier[item.quality]) {
        score *= rarityMultiplier[item.quality];
      }
      
      return score;
    },
    
    // 执行自动转生策略
    executeAutoPrestigeStrategy() {
      const prestigeStrategy = this.player.strategies.autoPrestige.strategy;
      const delayLevels = this.player.strategies.autoPrestige.delayLevels;
      
      // 检查是否达到转生条件
      if (this.player.level < this.prestigeRequirement) {
        return; // 尚未达到转生条件
      }
      
      if (prestigeStrategy === 'immediate') {
        // 立即转生
        this.performPrestige(true); // 修改这里，传递true表示自动转生，避免确认对话框
      } 
      else if (prestigeStrategy === 'delay') {
        // 延迟转生
        const targetLevel = this.prestigeRequirement + delayLevels;
        if (this.player.level >= targetLevel) {
          this.performPrestige(true); // 修改这里
        }
      }
    },
    
    // 执行自动切换区域策略
    executeAutoAreaStrategy() {
      const areaStrategy = this.player.strategies.autoArea.strategy;
      const levelOffset = this.player.strategies.autoArea.levelOffset;
      
      // 确定目标区域
      let targetArea = null;
      
      if (areaStrategy === 'highest') {
        // 选择可用最高区域
        for (let i = this.areas.length - 1; i >= 0; i--) {
          if (this.player.level >= this.areas[i].requiredLevel) {
            targetArea = this.areas[i];
            break;
          }
        }
      } 
      else if (areaStrategy === 'efficient') {
        // 选择最高效率区域 (简化为玩家等级+2与最高可用区域的较小值)
        const playerLevel = this.player.level;
        let highestAvailable = null;
        
        // 找到最高可用区域
        for (let i = this.areas.length - 1; i >= 0; i--) {
          if (playerLevel >= this.areas[i].requiredLevel) {
            highestAvailable = this.areas[i];
            break;
          }
        }
        
        // 找到玩家等级+2的区域
        const efficientLevel = Math.min(playerLevel + 2, highestAvailable.level);
        for (const area of this.areas) {
          if (area.level <= efficientLevel && playerLevel >= area.requiredLevel) {
            targetArea = area;
          }
        }
      }
      else if (areaStrategy === 'levelBased') {
        // 基于玩家等级选择
        const targetLevel = Math.max(1, this.player.level + levelOffset);
        
        // 找到最接近目标等级的区域
        let closestArea = this.areas[0];
        let minDiff = Math.abs(closestArea.level - targetLevel);
        
        for (const area of this.areas) {
          if (this.player.level >= area.requiredLevel) {
            const diff = Math.abs(area.level - targetLevel);
            if (diff < minDiff) {
              minDiff = diff;
              closestArea = area;
            }
          }
        }
        
        targetArea = closestArea;
      }
      
      // 如果找到目标区域且与当前区域不同，则切换
      if (targetArea && (!this.currentArea || this.currentArea.id !== targetArea.id)) {
        this.changeArea(targetArea);
        this.addCombatLog(`自动策略: 切换到区域 ${targetArea.name}`);
      }
    },
  }
};
</script>

<style scoped>
/* 基础样式重置 */
.idle-game {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

/* 导航栏样式 */
.game-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #2c3e50;
  border-radius: 8px 8px 0 0;
  color: white;
}

.game-title {
  margin: 0;
  font-size: 1.5rem;
}

.game-controls {
  display: flex;
  gap: 15px;
}

.save-controls, .speed-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn, .speed-btn {
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.control-btn:hover, .speed-btn:hover {
  background-color: #2980b9;
}

.danger {
  background-color: #e74c3c;
}

.danger:hover {
  background-color: #c0392b;
}

/* 玩家状态栏 */
.player-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #34495e;
  color: white;
  border-radius: 0;
}

.player-core-stats {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.resource-bars {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  max-width: 300px;
}

.resource-bar {
  display: flex;
  flex-direction: column;
}

.bar-label {
  font-size: 12px;
  margin-bottom: 2px;
}

.bar-container {
  height: 10px;
  background-color: #2c3e50;
  border-radius: 5px;
  overflow: hidden;
}

.hp-bar .bar-fill {
  height: 100%;
  background-color: #2ecc71;
}

.mana-bar .bar-fill {
  height: 100%;
  background-color: #3498db;
}

.stats-toggle-btn {
  padding: 6px 12px;
  background-color: #7f8c8d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 详细属性面板 */
.detailed-stats-panel {
  background-color: #ecf0f1;
  padding: 15px;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 12px;
  color: #7f8c8d;
}

.stat-value {
  font-weight: bold;
  font-size: 16px;
  color: #2c3e50;
}

/* 标签页导航 */
.game-tabs {
  display: flex;
  background-color: #ecf0f1;
  border-radius: 0;
  overflow: hidden;
}

.tab-item {
  padding: 12px 20px;
  font-weight: bold;
  color: #7f8c8d;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tab-item:hover {
  background-color: #d6dbdf;
  color: #2c3e50;
}

.tab-item.active {
  color: #3498db;
  border-bottom-color: #3498db;
  background-color: #fff;
}

/* 内容区域 */
.game-content {
  flex: 1;
  background-color: white;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.tab-content {
  padding: 20px;
  min-height: 400px;
}

/* 区域选择 */
.areas-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.area-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
  position: relative;
}

.area-card:hover:not(.area-locked) {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.area-locked {
  opacity: 0.7;
  cursor: not-allowed;
}

.area-active {
  border: 2px solid #3498db;
  background-color: #ebf5fb;
}

.monster-list {
  margin-top: 10px;
}

.monster-list ul {
  padding-left: 20px;
  margin: 5px 0;
}

.area-status {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  font-size: 14px;
}

.locked-icon {
  color: #e74c3c;
}

.current-icon {
  color: #2ecc71;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-navbar {
    flex-direction: column;
    gap: 10px;
  }
  
  .player-status-bar {
    flex-direction: column;
    gap: 10px;
  }
  
  .player-core-stats {
    flex-wrap: wrap;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .equipment-grid,
  .inventory-items,
  .areas-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

/* 添加到style部分 */
.area-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: normal;
}

.areas-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.areas-pagination button {
  padding: 8px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.areas-pagination button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.prestige-section {
  background-color: #34495e;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.prestige-info {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 10px 0;
}

.prestige-level {
  font-weight: bold;
  color: #e74c3c;
}

.prestige-bonus {
  font-weight: bold;
  color: #2ecc71;
}

.prestige-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  margin-top: 10px;
}

.prestige-btn:hover:not(:disabled) {
  background-color: #c0392b;
  transform: scale(1.05);
}

.prestige-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.prestige-stat {
  background-color: #e74c3c;
}

.prestige-stat .stat-value {
  color: white;
}

/* 策略系统样式 */
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

select, input {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style> 