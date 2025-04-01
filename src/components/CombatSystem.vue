<template>
  <div class="combat-tab">
    <h2>战斗区域: {{ currentArea ? currentArea.name : '加载中...' }}</h2>
    
    <div class="battle-scene">
      <div class="player-character">
        <div class="character-avatar">
          <svg viewBox="0 0 50 50" class="player-icon">
            <circle cx="25" cy="15" r="10" fill="#3498db" />
            <rect x="15" y="25" width="20" height="25" fill="#3498db" />
          </svg>
          
          <!-- 玩家血条 -->
          <div class="health-bar player-health">
            <div class="health-bar-fill" :style="{ width: playerHealthPercentage + '%' }"></div>
          </div>
          <p class="character-hp" :title="`${player.currentHp.toFixed(1)}/${player.maxHp.toFixed(1)}`">
            {{ Math.floor(player.currentHp) }}/{{ Math.floor(player.maxHp) }}
          </p>
          
          <!-- 玩家状态效果 -->
          <div class="status-effects" v-if="player.statusEffects && player.statusEffects.length">
            <div v-for="(effect, index) in player.statusEffects" 
                 :key="index" 
                 class="status-effect"
                 :class="effect.type">
              {{ effect.name }}
            </div>
          </div>
        </div>
        <div class="character-name">{{ player.name || '玩家' }}</div>
        <div class="character-stats">
          <div class="stat-item">
            <span class="stat-label">攻击:</span>
            <span class="stat-value" :title="`${totalAttack.toFixed(1)}`">{{ Math.floor(totalAttack) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">防御:</span>
            <span class="stat-value" :title="`${totalDefense.toFixed(1)}`">{{ Math.floor(totalDefense) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 宠物角色 -->
      <div class="pet-character" v-if="activePet">
        <div class="character-avatar pet-avatar">
          <div class="pet-icon">{{ activePet.type.icon }}</div>
          
          <!-- 宠物血条 -->
          <div class="health-bar pet-health">
            <div class="health-bar-fill" :style="{ width: petHealthPercentage + '%' }"></div>
          </div>
          <p class="character-hp" :title="`${activePet.currentHp.toFixed(1)}/${activePet.maxHp.toFixed(1)}`">
            {{ Math.floor(activePet.currentHp) }}/{{ Math.floor(activePet.maxHp) }}
          </p>
        </div>
        <div class="character-name">{{ activePet.name }}</div>
        <div class="pet-level">Lv.{{ activePet.level }}</div>
      </div>
      
      <div class="battle-actions">
        <!-- 战斗动画区域 -->
        <div class="battle-animation" v-if="attackAnimation">
          <div :class="[
            'animation-effect', 
            attackAnimation.attacker === 'player' ? 'player-attack' : 'monster-attack',
            attackAnimation.isCritical ? 'critical-hit' : '',
            attackAnimation.targetPet ? 'target-pet' : ''
          ]">
            {{ attackAnimation.damage }}
            <span v-if="attackAnimation.isCritical" class="critical-text">暴击!</span>
          </div>
        </div>
        
        <!-- 战斗提示信息 -->
        <div class="battle-tips" v-if="battleTips">
          <div class="tip-message" :class="battleTips.type">
            {{ battleTips.message }}
          </div>
        </div>
      </div>
      
      <div class="monster-character" v-if="currentMonster">
        <div class="character-avatar">
          <svg viewBox="0 0 50 50" class="monster-icon">
            <circle cx="25" cy="18" r="12" fill="#e74c3c" />
            <path d="M15,30 L35,30 L40,45 L10,45 Z" fill="#e74c3c" />
            <circle cx="20" cy="15" r="3" fill="white" />
            <circle cx="30" cy="15" r="3" fill="white" />
          </svg>
          
          <!-- 怪物血条 -->
          <div class="health-bar monster-health">
            <div class="health-bar-fill" :style="{ width: monsterHealthPercentage + '%' }"></div>
          </div>
          <p class="character-hp" :title="`${currentMonster.currentHp.toFixed(1)}/${currentMonster.maxHp.toFixed(1)}`">
            {{ Math.floor(currentMonster.currentHp) }}/{{ Math.floor(currentMonster.maxHp) }}
          </p>
          
          <!-- 怪物状态效果 -->
          <div class="status-effects" v-if="currentMonster.statusEffects && currentMonster.statusEffects.length">
            <div v-for="(effect, index) in currentMonster.statusEffects" 
                 :key="index" 
                 class="status-effect"
                 :class="effect.type">
              {{ effect.name }}
            </div>
          </div>
        </div>
        <div class="character-name">{{ currentMonster.name }}</div>
        <div class="monster-level">Lv.{{ currentMonster.level }}</div>
        <div class="monster-stats">
          <div class="stat-item">
            <span class="stat-label">攻击:</span>
            <span class="stat-value" :title="`${currentMonster.attack.toFixed(1)}`">{{ Math.floor(currentMonster.attack) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">防御:</span>
            <span class="stat-value" :title="`${currentMonster.defense.toFixed(1)}`">{{ Math.floor(currentMonster.defense) }}</span>
          </div>
        </div>
      </div>
      <div class="monster-character" v-else>
        <div class="character-avatar searching">
          <svg viewBox="0 0 50 50" class="monster-icon faded">
            <circle cx="25" cy="18" r="12" fill="#999" />
            <path d="M15,30 L35,30 L40,45 L10,45 Z" fill="#999" />
          </svg>
          <p>寻找怪物中...</p>
        </div>
      </div>
    </div>

    <div class="combat-log">
      <p v-for="(log, index) in combatLogs" 
         :key="index" 
         v-html="log"
         :class="getLogClass(log)">
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CombatSystem',
  props: {
    player: {
      type: Object,
      required: true
    },
    currentArea: {
      type: Object,
      default: null
    },
    currentMonster: {
      type: Object,
      default: null
    },
    combatLogs: {
      type: Array,
      default: () => []
    },
    attackAnimation: {
      type: Object,
      default: null
    },
    battleTips: {
      type: Object,
      default: null
    },
    totalAttack: {
      type: Number,
      required: true
    },
    totalDefense: {
      type: Number,
      required: true
    },
    totalCritRate: {
      type: Number,
      required: true
    },
    totalCritDamage: {
      type: Number,
      required: true
    },
    totalDodgeRate: {
      type: Number,
      required: true
    },
    activePet: {
      type: Object,
      default: null
    }
  },
  computed: {
    monsterHealthPercentage() {
      if (!this.currentMonster) return 0;
      return (this.currentMonster.currentHp / this.currentMonster.maxHp) * 100;
    },
    
    playerHealthPercentage() {
      return (this.player.currentHp / this.player.maxHp) * 100;
    },
    
    petHealthPercentage() {
      if (!this.activePet) return 0;
      return (this.activePet.currentHp / this.activePet.maxHp) * 100;
    }
  },
  methods: {
    getLogClass(log) {
      if (log.includes('暴击')) return 'critical-log';
      if (log.includes('闪避')) return 'dodge-log';
      if (log.includes('受到伤害')) return 'damage-log';
      return '';
    },
    
    playerAttack() {
      this.$emit('player-attack');
    },
    
    monsterAttack() {
      this.$emit('monster-attack');
    },
    
    spawnMonster() {
      this.$emit('spawn-monster');
    },
    
    monsterDefeated() {
      this.$emit('monster-defeated');
    },
    
    playerDefeated() {
      this.$emit('player-defeated');
    }
  }
}
</script>

<style scoped>
/* 战斗区域样式 */
.battle-scene {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  height: 280px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.player-character, .monster-character, .pet-character {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
}

.character-avatar {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.player-icon, .monster-icon {
  width: 100px;
  height: 100px;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.player-icon:hover, .monster-icon:hover {
  transform: scale(1.05);
}

.health-bar {
  height: 10px;
  width: 100px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin: 8px 0;
  position: relative;
}

.health-bar-fill {
  transition: width 0.3s ease;
}

.player-health .health-bar-fill {
  background-color: #2ecc71;
}

.monster-health .health-bar-fill {
  background-color: #e74c3c;
}

.pet-health .health-bar-fill {
  background-color: #9b59b6;
}

.character-hp {
  font-size: 0.9rem;
  margin: 0;
  color: #333;
}

.character-name {
  font-weight: bold;
  margin: 5px 0;
}

.monster-level, .pet-level {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 5px;
}

.character-stats {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin: 3px 0;
}

.stat-label {
  color: #555;
}

.stat-value {
  font-weight: bold;
  color: #333;
}

.combat-log {
  height: 200px;
  overflow-y: auto;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.combat-log p {
  margin: 5px 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.critical-log {
  color: #e74c3c;
  font-weight: bold;
}

.dodge-log {
  color: #3498db;
  font-style: italic;
}

.damage-log {
  color: #e67e22;
}

.battle-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 240px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.battle-animation {
  position: relative;
  width: 100%;
  height: 80px;
}

.animation-effect {
  position: absolute;
  font-weight: bold;
  font-size: 1.5rem;
  animation: damage-animation 1.2s ease-out forwards;
  text-shadow: 0 0 5px white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-attack {
  color: #2ecc71;
  right: 50px;
}

.monster-attack {
  color: #e74c3c;
  left: 50px;
}

.critical-hit {
  font-size: 1.8rem;
  color: #e74c3c;
}

.critical-text {
  font-size: 0.8rem;
  margin-top: 3px;
}

/* 宠物特定样式 */
.pet-character {
  position: absolute;
  left: 25%;
  top: 70%;
  transform: translateX(-50%);
}

.pet-avatar {
  background-color: #f0f8ff;
  border-radius: 50%;
  padding: 8px;
  border: 2px solid #a0d0ff;
}

.pet-icon {
  font-size: 40px;
  text-align: center;
  margin: 0 auto;
}

.target-pet {
  position: absolute;
  top: 70%;
  left: 25%;
  transform: translateX(-50%);
}

@keyframes damage-animation {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.8);
  }
  30% {
    opacity: 1;
    transform: translateY(-20px) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scale(1);
  }
}

/* 适配小屏幕设备 */
@media (max-width: 768px) {
  .battle-scene {
    flex-direction: column;
    height: auto;
    padding: 15px;
  }

  .player-character, .monster-character {
    width: 100%;
    margin-bottom: 20px;
  }

  .battle-actions {
    position: relative;
    transform: none;
    top: auto;
    left: auto;
    width: 100%;
    margin: 10px 0;
  }
}
</style> 