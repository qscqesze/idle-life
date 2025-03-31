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
          <p class="character-hp">{{ Math.ceil(player.currentHp) }}/{{ player.maxHp }}</p>
        </div>
        <div class="character-name">{{ player.name || '玩家' }}</div>
      </div>
      
      <div class="battle-actions">
        <div class="battle-animation" v-if="attackAnimation">
          <div :class="[
            'animation-effect', 
            attackAnimation.attacker === 'player' ? 'player-attack' : 'monster-attack'
          ]">
            {{ attackAnimation.damage }}
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
          <p class="character-hp">{{ Math.ceil(currentMonster.currentHp) }}/{{ currentMonster.maxHp }}</p>
        </div>
        <div class="character-name">{{ currentMonster.name }}</div>
        <div class="monster-level">Lv.{{ currentMonster.level }}</div>
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
      <p v-for="(log, index) in combatLogs" :key="index" v-html="log"></p>
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
    }
  },
  computed: {
    monsterHealthPercentage() {
      if (!this.currentMonster) return 0;
      return (this.currentMonster.currentHp / this.currentMonster.maxHp) * 100;
    },
    
    playerHealthPercentage() {
      return (this.player.currentHp / this.player.maxHp) * 100;
    }
  },
  methods: {
    // 这些方法会通过emit触发父组件的方法
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
  height: 220px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.player-character, .monster-character {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px;
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
}

.health-bar {
  height: 10px;
  width: 100px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin: 8px 0;
}

.player-health .health-bar-fill {
  background-color: #2ecc71;
}

.monster-health .health-bar-fill {
  background-color: #e74c3c;
}

.character-name {
  margin-top: 8px;
  font-weight: bold;
}

.character-hp {
  margin: 2px 0;
  font-size: 12px;
}

.monster-level {
  font-size: 12px;
  color: #95a5a6;
}

.combat-log {
  height: 200px;
  overflow-y: auto;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #e0e0e0;
}

.combat-log p {
  margin: 5px 0;
  padding: 5px;
  border-bottom: 1px solid #ecf0f1;
}

/* 战斗动画 */
.battle-actions {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.battle-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.animation-effect {
  font-weight: bold;
  padding: 8px 15px;
  border-radius: 5px;
  animation-duration: 0.8s;
  animation-fill-mode: forwards;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.player-attack {
  color: #e74c3c;
  animation-name: playerAttackEffect;
}

.monster-attack {
  color: #3498db;
  animation-name: monsterAttackEffect;
}

@keyframes playerAttackEffect {
  0% { opacity: 0; transform: translateX(-100px); }
  30% { opacity: 1; transform: translateX(0); }
  70% { opacity: 1; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(100px); }
}

@keyframes monsterAttackEffect {
  0% { opacity: 0; transform: translateX(100px); }
  30% { opacity: 1; transform: translateX(0); }
  70% { opacity: 1; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(-100px); }
}
</style> 