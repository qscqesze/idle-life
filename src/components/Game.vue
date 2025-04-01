<template>
  <div class="game-container">
    <div v-if="!gameStarted" class="start-screen">
      <h1>🧛 吸血鬼幸存者 🧛‍♀️</h1>
      <button @click="startGame" class="start-button">开始游戏</button>
    </div>
    
    <div v-else class="game-area">
      <div class="game-header">
        <div class="stats">
          <div>❤️ 生命: {{ player.health }}</div>
          <div>⚔️ 攻击: {{ player.attack }}</div>
          <div>🛡️ 防御: {{ player.defense }}</div>
          <div>⏱️ 时间: {{ gameTime }}s</div>
          <div>💀 击杀: {{ killCount }}</div>
          <div>✨ 经验: {{ player.exp }}</div>
          <div>📊 等级: {{ player.level }}</div>
          <div>🌊 波数: {{ waveNumber }}</div>
        </div>
      </div>
      
      <div class="game-field" ref="gameField" @keydown="handleKeyDown" @keyup="handleKeyUp" tabindex="0">
        <div class="player" :style="playerStyle">{{ player.icon }}</div>
        
        <div 
          v-for="(enemy, index) in enemies" 
          :key="index" 
          class="enemy"
          :style="{ top: enemy.y + 'px', left: enemy.x + 'px' }"
        >
          <div class="enemy-health-bar">
            <div class="enemy-health-fill" :style="{ width: (enemy.health / enemy.originalHealth * 100) + '%' }"></div>
          </div>
          {{ enemy.icon }}
        </div>
        
        <div 
          v-for="(weapon, index) in weapons" 
          :key="'weapon-'+index" 
          class="weapon"
          :style="{ top: weapon.y + 'px', left: weapon.x + 'px', transform: `rotate(${weapon.rotation}deg)` }"
        >
          {{ weapon.icon }}
        </div>
        
        <div 
          v-for="(exp, index) in expGems" 
          :key="'exp-'+index" 
          class="exp-gem"
          :style="{ top: exp.y + 'px', left: exp.x + 'px' }"
        >
          ✨
        </div>
        
        <div
          v-for="(damage, index) in damageTexts"
          :key="'damage-'+index"
          class="damage-text"
          :style="{ top: damage.y + 'px', left: damage.x + 'px', opacity: damage.opacity }"
        >
          {{ damage.value }}
        </div>
        
        <!-- 技能面板 -->
        <div class="skills-panel">
          <div class="skills-section">
            <h4>主动技能</h4>
            <div class="skills-grid">
              <div v-for="(weapon, index) in activeWeapons" :key="'active-'+index" class="skill-item">
                <div class="skill-icon">{{ weapon.icon }}</div>
                <div class="skill-level">Lv.{{ weapon.level }}</div>
              </div>
            </div>
          </div>
          <div class="skills-section">
            <h4>被动技能</h4>
            <div class="skills-grid">
              <div v-for="(skill, index) in passiveSkills" :key="'passive-'+index" class="skill-item">
                <div class="skill-icon">{{ skill.icon }}</div>
                <div class="skill-level">Lv.{{ skill.level }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 暂停菜单 -->
      <div v-if="isPaused && !levelUp && !gameOver" class="pause-menu">
        <h2>游戏暂停</h2>
        <p>按下 ESC 继续游戏</p>
        
        <div class="pause-skills-list">
          <h3>技能列表</h3>
          <div class="pause-skills-section">
            <h4>主动技能</h4>
            <div class="pause-skill-items">
              <div v-for="(weapon, index) in activeWeapons" :key="'pause-active-'+index" class="pause-skill-item">
                <div class="pause-skill-icon">{{ weapon.icon }}</div>
                <div class="pause-skill-details">
                  <div class="pause-skill-title">{{ weapon.title }}</div>
                  <div class="pause-skill-level">等级: {{ weapon.level }}/{{ weapon.maxLevel }}</div>
                  <div class="pause-skill-stats">伤害: {{ Math.round(weapon.damage) }}</div>
                  <div class="pause-skill-stats">冷却: {{ (weapon.cooldown / 1000).toFixed(1) }}秒</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="pause-skills-section">
            <h4>被动技能</h4>
            <div class="pause-skill-items">
              <div v-for="(skill, index) in passiveSkills" :key="'pause-passive-'+index" class="pause-skill-item">
                <div class="pause-skill-icon">{{ skill.icon }}</div>
                <div class="pause-skill-details">
                  <div class="pause-skill-title">{{ skill.title }}</div>
                  <div class="pause-skill-level">等级: {{ skill.level }}/{{ skill.maxLevel }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button @click="restartGame" class="restart-button">重新开始</button>
      </div>
      
      <div v-if="gameOver" class="game-over">
        <h2>游戏结束</h2>
        <p>你存活了 {{ gameTime }} 秒</p>
        <p>击杀了 {{ killCount }} 个敌人</p>
        <p>达到了 {{ player.level }} 级</p>
        <button @click="restartGame" class="restart-button">重新开始</button>
      </div>
      
      <div v-if="levelUp" class="level-up">
        <h3>升级了！</h3>
        <div class="upgrade-options">
          <div 
            v-for="(upgrade, index) in upgradeOptions" 
            :key="index"
            class="upgrade-option"
            @click="selectUpgrade(upgrade)"
          >
            <div class="upgrade-icon">{{ upgrade.icon }}</div>
            <div class="upgrade-title">{{ upgrade.title }}</div>
            <div class="upgrade-desc">{{ upgrade.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameComponent',
  data() {
    return {
      gameStarted: false,
      gameOver: false,
      levelUp: false,
      isPaused: false, // 添加暂停状态变量
      gameTime: 0,
      gameTimer: null,
      killCount: 0,
      waveNumber: 1, // 当前波数
      player: {
        x: 0,
        y: 0,
        speed: 5,
        health: 100,
        maxHealth: 100,
        attack: 10,
        defense: 5,
        exp: 0,
        level: 1,
        expToNextLevel: 50, // 降低初始升级所需经验
        icon: '🧛‍♂️'
      },
      enemies: [],
      weapons: [],
      expGems: [],
      damageTexts: [], // 存储伤害数字
      enemySpawnRate: 2000, // 毫秒
      enemySpawnTimer: null,
      upgradeOptions: [],
      gamePaused: false, // 游戏暂停状态
      activeWeapons: [], // 主动技能列表，初始为空数组
      passiveSkills: [], // 被动技能列表
      maxActiveSkills: 6, // 最大主动技能数量
      maxPassiveSkills: 6, // 最大被动技能数量
      enemyTypes: [
        { icon: '👻', health: 30, damage: 10, speed: 2, expValue: 10 },
        { icon: '🧟', health: 50, damage: 15, speed: 1, expValue: 20 },
        { icon: '💀', health: 20, damage: 20, speed: 3, expValue: 15 },
        { icon: '👹', health: 80, damage: 25, speed: 1.5, expValue: 30 },
      ],
      weaponTypes: [
        { icon: '🗡️', damage: 20, speed: 1, range: 100, cooldown: 1000 },
        { icon: '🪓', damage: 30, speed: 0.7, range: 150, cooldown: 1500 },
        { icon: '🔪', damage: 15, speed: 1.5, range: 80, cooldown: 800 },
      ],
      currentWeapon: { icon: '🗡️', damage: 20, speed: 1, range: 100, cooldown: 1000 },
      lastAttackTime: 0,
      direction: { x: 0, y: 0 },
      fieldWidth: 0,
      fieldHeight: 0
    };
  },
  computed: {
    playerStyle() {
      return {
        top: this.player.y + 'px',
        left: this.player.x + 'px'
      };
    }
  },
  methods: {
    startGame() {
      this.gameStarted = true;
      this.gameOver = false;
      this.isPaused = false;
      
      // 初始化玩家武器
      if (this.activeWeapons.length === 0) {
        this.activeWeapons = [{
          id: 'sword',
          icon: '🗡️',
          title: '短剑',
          damage: 20, 
          speed: 1,
          range: 100,
          cooldown: 1000,
          pattern: 'single',
          level: 1, // 初始等级
          maxLevel: 8  // 最大等级
        }];
        
        this.currentWeapon = this.activeWeapons[0];
      }
      
      // 确保DOM更新后再初始化游戏
      this.$nextTick(() => {
        this.initGame();
        this.$refs.gameField.focus();
      });
    },
    initGame() {
      // 初始化游戏场景和玩家位置
      const field = this.$refs.gameField;
      if (!field) {
        console.error('游戏区域元素未找到');
        return;
      }
      
      this.fieldWidth = field.clientWidth;
      this.fieldHeight = field.clientHeight;
      
      this.player.x = this.fieldWidth / 2;
      this.player.y = this.fieldHeight / 2;
      
      // 重置波数
      this.waveNumber = 1;
      
      // 启动游戏计时器
      this.gameTimer = setInterval(() => {
        this.gameTime++;
        
        // 每30秒增加一个波数，增加难度
        if (this.gameTime % 30 === 0) {
          this.increaseWave();
        }
      }, 1000);
      
      // 启动敌人生成器
      this.startEnemySpawner();
      
      // 启动游戏循环
      requestAnimationFrame(this.gameLoop);
    },
    startEnemySpawner() {
      this.enemySpawnTimer = setInterval(() => {
        this.spawnEnemy(false); // 正常生成
      }, this.enemySpawnRate);
    },
    clearEnemySpawnTimer() {
      if (this.enemySpawnTimer) {
        clearInterval(this.enemySpawnTimer);
      }
    },
    spawnEnemy(isWaveSpawn = false) {
      // 选择敌人类型，后期波次有更高概率出现强力敌人
      let enemyTypes = [...this.enemyTypes];
      
      // 根据波数增加怪物强度
      const powerMultiplier = 1 + (this.waveNumber - 1) * 0.1; // 每波增加10%的强度
      
      // 在较高波次时增加强力敌人的出现概率
      let enemyPool;
      if (this.waveNumber >= 5) {
        // 波数大于等于5后，更多强力敌人
        enemyPool = [0, 1, 1, 2, 2, 3, 3, 3];
      } else if (this.waveNumber >= 3) {
        // 波数大于等于3后，出现更多中等强度敌人
        enemyPool = [0, 0, 1, 1, 2, 2, 3];
      } else {
        // 初始波次，均匀分布
        enemyPool = [0, 0, 1, 1, 2, 3];
      }
      
      const enemyTypeIndex = enemyPool[Math.floor(Math.random() * enemyPool.length)];
      const baseEnemyType = enemyTypes[enemyTypeIndex];
      
      // 在屏幕外随机位置生成敌人
      let x, y;
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      
      switch (side) {
        case 0: // top
          x = Math.random() * this.fieldWidth;
          y = -20;
          break;
        case 1: // right
          x = this.fieldWidth + 20;
          y = Math.random() * this.fieldHeight;
          break;
        case 2: // bottom
          x = Math.random() * this.fieldWidth;
          y = this.fieldHeight + 20;
          break;
        case 3: // left
          x = -20;
          y = Math.random() * this.fieldHeight;
          break;
      }
      
      // 复制基础敌人属性，并根据波数增强
      const health = Math.round(baseEnemyType.health * powerMultiplier);
      const damage = Math.round(baseEnemyType.damage * powerMultiplier);
      const speed = baseEnemyType.speed * (1 + (this.waveNumber - 1) * 0.05); // 速度增加较慢
      const expValue = Math.round(baseEnemyType.expValue * (1 + (this.waveNumber - 1) * 0.05)); // 经验值也略微提高
      
      // 如果是波次生成的怪物，有几率出现精英怪
      let isElite = false;
      if (isWaveSpawn && Math.random() < 0.2) { // 20%几率出现精英怪
        isElite = true;
      }
      
      // 创建敌人对象
      const enemy = {
        icon: isElite ? '👺' : baseEnemyType.icon, // 精英怪使用不同图标
        health: isElite ? health * 2 : health,
        damage: isElite ? damage * 1.5 : damage,
        speed: isElite ? speed * 0.9 : speed, // 精英怪稍微慢一点
        expValue: isElite ? expValue * 3 : expValue,
        x,
        y,
        originalHealth: isElite ? health * 2 : health,
        isElite // 标记是否为精英怪
      };
      
      // 为精英怪添加视觉效果
      if (isElite) {
        enemy.scale = 1.3; // 精英怪体型更大
      }
      
      this.enemies.push(enemy);
    },
    gameLoop(timestamp) {
      if (this.gameOver || this.gamePaused || this.isPaused) return; // 添加暂停检查
      
      // 移动玩家
      this.movePlayer();
      
      // 移动敌人
      this.moveEnemies();
      
      // 移动武器
      this.moveWeapons();
      
      // 攻击判定
      this.checkAttacks(timestamp);
      
      // 收集经验
      this.collectExp();
      
      // 继续游戏循环
      requestAnimationFrame(this.gameLoop);
    },
    movePlayer() {
      if (this.direction.x !== 0 || this.direction.y !== 0) {
        // 标准化向量，确保对角线移动速度不会更快
        const length = Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2);
        const normalizedX = this.direction.x / length;
        const normalizedY = this.direction.y / length;
        
        const newX = this.player.x + normalizedX * this.player.speed;
        const newY = this.player.y + normalizedY * this.player.speed;
        
        // 确保玩家不会移出界面
        this.player.x = Math.max(0, Math.min(this.fieldWidth - 20, newX));
        this.player.y = Math.max(0, Math.min(this.fieldHeight - 20, newY));
      }
    },
    moveEnemies() {
      for (let i = 0; i < this.enemies.length; i++) {
        const enemy = this.enemies[i];
        
        // 计算敌人到玩家的向量
        const dx = this.player.x - enemy.x;
        const dy = this.player.y - enemy.y;
        
        // 标准化向量
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normalizedX = dx / distance;
        const normalizedY = dy / distance;
        
        // 更新敌人位置
        enemy.x += normalizedX * enemy.speed;
        enemy.y += normalizedY * enemy.speed;
        
        // 敌人伤害玩家（当接触到玩家时）
        if (distance < 20) {
          this.damagePlayer();
        }
      }
    },
    checkAttacks(timestamp) {
      const now = timestamp;
      
      // 遍历所有激活的武器
      for (const weapon of this.activeWeapons) {
        // 应用冷却减少效果
        let finalCooldown = weapon.cooldown;
        const cooldownSkill = this.passiveSkills.find(skill => skill.id === 'cooldown');
        if (cooldownSkill) {
          const effect = cooldownSkill.effect(cooldownSkill.level);
          finalCooldown = weapon.cooldown * (1 - effect.cooldownReduction);
        }
        
        // 冷却时间检查（使用调整后的冷却时间）
        if (now - (weapon.lastAttackTime || 0) < finalCooldown) continue;
        
        // 如果没有敌人则不攻击
        if (this.enemies.length === 0) continue;
        
        // 更新上次攻击时间
        weapon.lastAttackTime = now;
        
        // 根据武器图案创建不同的攻击模式
        switch(weapon.pattern) {
          case 'single':
            this.createSingleProjectile(weapon, now);
            break;
          case 'triple':
            this.createTripleProjectile(weapon, now);
            break;
          case 'radial':
            this.createRadialProjectile(weapon, now);
            break;
          case 'orbit':
            this.createOrbitProjectile(weapon, now);
            break;
          case 'chain':
            this.createChainProjectile(weapon, now);
            break;
          default:
            this.createSingleProjectile(weapon, now);
        }
      }
    },
    dropExp(enemy) {
      this.expGems.push({
        x: enemy.x,
        y: enemy.y,
        value: enemy.expValue
      });
    },
    collectExp() {
      // 获取经验磁铁效果的收集范围加成
      let expCollectRange = 40; // 默认收集范围
      
      // 应用被动技能-经验磁铁效果
      const magnetSkill = this.passiveSkills.find(skill => skill.id === 'magnet');
      if (magnetSkill) {
        const effect = magnetSkill.effect(magnetSkill.level);
        expCollectRange += effect.expRangeBonus;
      }
      
      for (let i = this.expGems.length - 1; i >= 0; i--) {
        const exp = this.expGems[i];
        const dx = this.player.x - exp.x;
        const dy = this.player.y - exp.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 玩家靠近经验宝石时收集
        if (distance < expCollectRange) {
          this.player.exp += exp.value;
          this.expGems.splice(i, 1);
          
          // 检查升级
          if (this.player.exp >= this.player.expToNextLevel) {
            this.levelUpPlayer();
          }
        } else {
          // 经验宝石向玩家移动
          const moveSpeed = 3;
          const moveDistance = Math.min(distance, moveSpeed);
          const moveX = (dx / distance) * moveDistance;
          const moveY = (dy / distance) * moveDistance;
          
          exp.x += moveX;
          exp.y += moveY;
        }
      }
    },
    damagePlayer() {
      // 直接死亡，不考虑防御
      this.endGame();
    },
    levelUpPlayer() {
      this.player.level++;
      this.player.exp -= this.player.expToNextLevel;
      
      // 调整的经验曲线，前期比较容易升级
      if (this.player.level < 10) {
        // 前10级，每级增加50%经验需求
        this.player.expToNextLevel = Math.floor(this.player.expToNextLevel * 1.3);
      } else if (this.player.level < 20) {
        // 10-20级，每级增加70%经验需求
        this.player.expToNextLevel = Math.floor(this.player.expToNextLevel * 1.4);
      } else {
        // 20级以上，每级增加100%经验需求
        this.player.expToNextLevel = Math.floor(this.player.expToNextLevel * 1.5);
      }
      
      this.player.maxHealth += 20;
      this.player.health = this.player.maxHealth;
      
      // 暂停游戏
      this.gamePaused = true;
      
      // 显示升级选项
      this.showUpgradeOptions();
    },
    showUpgradeOptions() {
      // 暂停游戏
      this.levelUp = true;
      
      // 武器类型列表 - 可以作为新技能解锁
      const weaponTypes = [
        { 
          id: 'dagger', 
          icon: '🔪', 
          title: '飞刀', 
          description: '快速发射三把飞刀', 
          damage: 15, 
          speed: 1.5, 
          range: 80, 
          cooldown: 800,
          pattern: 'triple',
          type: 'active'
        },
        { 
          id: 'axe', 
          icon: '🪓', 
          title: '旋转斧', 
          description: '环绕玩家旋转的斧头', 
          damage: 30, 
          speed: 0.7, 
          range: 150, 
          cooldown: 1500,
          pattern: 'orbit',
          type: 'active'
        },
        { 
          id: 'fireball', 
          icon: '🔥', 
          title: '火球术', 
          description: '发射强大的火球', 
          damage: 40, 
          speed: 0.5, 
          range: 200, 
          cooldown: 2000,
          pattern: 'single',
          type: 'active'
        },
        { 
          id: 'lightning', 
          icon: '⚡', 
          title: '闪电链', 
          description: '击中敌人后弹射到其他敌人', 
          damage: 25, 
          speed: 1, 
          range: 120, 
          cooldown: 1200,
          pattern: 'chain',
          type: 'active'
        },
        { 
          id: 'star', 
          icon: '✴️', 
          title: '忍者镖', 
          description: '朝八个方向同时发射', 
          damage: 20, 
          speed: 1, 
          range: 100, 
          cooldown: 1800,
          pattern: 'radial',
          type: 'active'
        }
      ];
      
      // 被动技能列表
      const passiveTypes = [
        {
          id: 'vitality',
          icon: '💗',
          title: '生命强化',
          description: '增加最大生命值',
          effect: (level) => {
            return { 
              maxHealth: 20 + (level - 1) * 10
            };
          },
          type: 'passive'
        },
        {
          id: 'strength',
          icon: '💪',
          title: '力量强化',
          description: '增加所有武器伤害',
          effect: (level) => {
            return { 
              damageMult: 0.05 + (level - 1) * 0.03
            };
          },
          type: 'passive'
        },
        {
          id: 'agility',
          icon: '🏃',
          title: '敏捷强化',
          description: '增加移动速度',
          effect: (level) => {
            return { 
              speedBonus: 0.5 + (level - 1) * 0.25
            };
          },
          type: 'passive'
        },
        {
          id: 'cooldown',
          icon: '⏱️',
          title: '冷却缩减',
          description: '减少所有武器冷却时间',
          effect: (level) => {
            return { 
              cooldownReduction: 0.05 + (level - 1) * 0.03
            };
          },
          type: 'passive'
        },
        {
          id: 'magnet',
          icon: '🧲',
          title: '经验磁铁',
          description: '增加经验收集范围',
          effect: (level) => {
            return { 
              expRangeBonus: 10 + (level - 1) * 5
            };
          },
          type: 'passive'
        },
      ];
      
      // 提供三个随机升级选项
      const allUpgrades = [];
      
      // 为现有技能添加升级选项
      if (this.activeWeapons.length > 0) {
        this.activeWeapons.forEach(weapon => {
          if (weapon.level < weapon.maxLevel || weapon.level < 8) {
            allUpgrades.push({
              icon: weapon.icon,
              title: `${weapon.title} Lv.${weapon.level} → Lv.${weapon.level + 1}`,
              description: `升级${weapon.title}：伤害 +20%，冷却 -5%`,
              type: 'weaponUpgrade',
              effect: () => {
                weapon.level++;
                weapon.damage *= 1.2;
                weapon.cooldown *= 0.95;
              }
            });
          }
        });
      }
      
      // 为现有被动技能添加升级选项
      if (this.passiveSkills.length > 0) {
        this.passiveSkills.forEach(skill => {
          if (skill.level < skill.maxLevel || skill.level < 8) {
            allUpgrades.push({
              icon: skill.icon,
              title: `${skill.title} Lv.${skill.level} → Lv.${skill.level + 1}`,
              description: `升级${skill.title}`,
              type: 'passiveUpgrade',
              effect: () => {
                skill.level++;
                this.applyPassiveEffects(); // 重新应用被动效果
              }
            });
          }
        });
      }
      
      // 添加基础属性升级选项
      allUpgrades.push(
        { icon: '❤️', title: '生命提升', description: '增加最大生命值30点', effect: () => { 
          this.player.maxHealth += 30; 
          this.player.health += 30; 
        }},
        { icon: '⚔️', title: '攻击提升', description: '增加攻击力15点', effect: () => { 
          this.player.attack += 15; 
        }},
        { icon: '👟', title: '速度提升', description: '增加移动速度1点', effect: () => { 
          this.player.speed += 1; 
        }}
      );
      
      // 如果主动技能未达到上限，添加解锁新武器的选项
      if (this.activeWeapons.length < this.maxActiveSkills) {
        const ownedWeaponIds = this.activeWeapons.map(w => w.id);
        const unlockedWeapons = weaponTypes.filter(w => !ownedWeaponIds.includes(w.id));
        
        if (unlockedWeapons.length > 0) {
          // 随机选择一个未解锁的武器
          const randomWeapon = unlockedWeapons[Math.floor(Math.random() * unlockedWeapons.length)];
          
          allUpgrades.push({
            icon: randomWeapon.icon,
            title: '获得新技能: ' + randomWeapon.title,
            description: randomWeapon.description,
            type: 'newActiveSkill',
            effect: () => {
              // 添加新武器到主动技能列表
              this.activeWeapons.push({
                ...randomWeapon,
                level: 1,
                maxLevel: 8
              });
            }
          });
        }
      }
      
      // 如果被动技能未达到上限，添加解锁新被动技能的选项
      if (this.passiveSkills.length < this.maxPassiveSkills) {
        const ownedPassiveIds = this.passiveSkills.map(p => p.id);
        const unlockedPassives = passiveTypes.filter(p => !ownedPassiveIds.includes(p.id));
        
        if (unlockedPassives.length > 0) {
          // 随机选择一个未解锁的被动技能
          const randomPassive = unlockedPassives[Math.floor(Math.random() * unlockedPassives.length)];
          
          allUpgrades.push({
            icon: randomPassive.icon,
            title: '获得被动: ' + randomPassive.title,
            description: randomPassive.description,
            type: 'newPassiveSkill',
            effect: () => {
              // 添加新被动技能
              this.passiveSkills.push({
                ...randomPassive,
                level: 1,
                maxLevel: 8
              });
              
              // 应用被动效果
              this.applyPassiveEffects();
            }
          });
        }
      }
      
      // 洗牌算法
      const shuffled = [...allUpgrades].sort(() => 0.5 - Math.random());
      this.upgradeOptions = shuffled.slice(0, 3);
    },
    
    // 应用所有被动技能效果
    applyPassiveEffects() {
      // 重置基础速度和攻击属性
      this.player.baseSpeed = this.player.baseSpeed || this.player.speed;
      this.player.speed = this.player.baseSpeed;
      
      // 应用每个被动技能
      this.passiveSkills.forEach(skill => {
        const effect = skill.effect(skill.level);
        
        // 应用生命强化
        if (effect.maxHealth) {
          // 记录生命值百分比
          const healthPercent = this.player.health / this.player.maxHealth;
          // 更新最大生命值
          this.player.maxHealth += effect.maxHealth;
          // 保持相同的生命百分比
          this.player.health = Math.ceil(this.player.maxHealth * healthPercent);
        }
        
        // 应用速度加成
        if (effect.speedBonus) {
          this.player.speed += effect.speedBonus;
        }
      });
    },
    
    selectUpgrade(upgrade) {
      upgrade.effect();
      this.levelUp = false;
      this.gamePaused = false; // 恢复游戏
      
      // 重新开始游戏循环
      requestAnimationFrame(this.gameLoop);
    },
    handleKeyDown(e) {
      // ESC - 暂停游戏
      if (e.key === 'Escape') {
        this.togglePause();
        return;
      }
      
      // 如果游戏暂停，忽略其他按键
      if (this.isPaused) return;
      
      // W/↑ - 上
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        this.direction.y = -1;
      }
      // S/↓ - 下
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        this.direction.y = 1;
      }
      // A/← - 左
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        this.direction.x = -1;
      }
      // D/→ - 右
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        this.direction.x = 1;
      }
    },
    handleKeyUp(e) {
      // W/↑ - 上
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp' || e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        this.direction.y = 0;
      }
      // A/← - 左
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft' || e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        this.direction.x = 0;
      }
    },
    endGame() {
      this.gameOver = true;
      
      // 清除所有计时器
      clearInterval(this.gameTimer);
      this.clearEnemySpawnTimer();
    },
    restartGame() {
      // 重置游戏状态
      this.gameTime = 0;
      this.killCount = 0;
      this.enemies = [];
      this.weapons = [];
      this.expGems = [];
      this.damageTexts = [];
      this.enemySpawnRate = 2000;
      this.gamePaused = false;
      this.isPaused = false;
      this.passiveSkills = []; // 重置被动技能
      
      this.player = {
        x: 0,
        y: 0,
        speed: 5,
        baseSpeed: 5, // 基础速度
        health: 100,
        maxHealth: 100,
        attack: 10,
        exp: 0,
        level: 1,
        expToNextLevel: 50, // 重置为较低的初始经验需求
        icon: '🧛‍♂️'
      };
      
      // 重置武器
      this.activeWeapons = [{
        id: 'sword',
        icon: '🗡️',
        title: '短剑',
        damage: 20,
        speed: 1,
        range: 100,
        cooldown: 1000,
        pattern: 'single',
        level: 1,
        maxLevel: 8
      }];
      
      this.currentWeapon = this.activeWeapons[0];
      
      // 重新开始游戏
      this.startGame();
    },
    // 添加移动武器的方法
    moveWeapons() {
      const now = performance.now();
      
      for (let i = this.weapons.length - 1; i >= 0; i--) {
        const weapon = this.weapons[i];
        
        // 如果武器存在超过生命周期，则移除
        if (now - weapon.startTime > weapon.lifeTime) {
          this.weapons.splice(i, 1);
          continue;
        }
        
        // 处理特殊的轨道武器逻辑
        if (weapon.isOrbiting) {
          const orbitAngle = ((now - weapon.startTime) * weapon.orbitSpeed / 1000) % (2 * Math.PI);
          weapon.x = this.player.x + weapon.orbitRadius * Math.cos(orbitAngle);
          weapon.y = this.player.y + weapon.orbitRadius * Math.sin(orbitAngle);
          weapon.rotation = orbitAngle * 180 / Math.PI;
        } else {
          // 移动普通武器
          const moveSpeed = 10 * (weapon.speed || 1); // 根据武器速度属性调整
          weapon.x += weapon.directionX * moveSpeed;
          weapon.y += weapon.directionY * moveSpeed;
        }
        
        // 武器碰撞检测 - 每帧都进行检测
        // 对每个敌人检查碰撞
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j];
          const dx = enemy.x - weapon.x;
          const dy = enemy.y - weapon.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // 只有当距离小于30时才判定为碰撞
          if (distance < 30) {
            // 计算基础伤害
            let damage = Math.round(weapon.damage * (1 + (this.player.attack / 100)));
            
            // 应用伤害加成被动效果
            const strengthSkill = this.passiveSkills.find(skill => skill.id === 'strength');
            if (strengthSkill) {
              const effect = strengthSkill.effect(strengthSkill.level);
              damage = Math.round(damage * (1 + effect.damageMult));
            }
            
            enemy.health -= damage;
            
            // 创建伤害数字
            this.createDamageText(enemy.x, enemy.y - 20, damage);
            
            // 检查敌人是否死亡
            if (enemy.health <= 0) {
              // 敌人死亡，掉落经验
              this.dropExp(enemy);
              this.enemies.splice(j, 1);
              this.killCount++;
            }
            
            // 如果是链式武器并且还有链接次数，继续寻找下一个目标
            if (weapon.chainLeft > 0) {
              weapon.chainLeft--;
              
              // 寻找范围内最近的下一个敌人
              let nextTarget = null;
              let minNextDistance = weapon.chainRange;
              
              for (const nextEnemy of this.enemies) {
                if (nextEnemy === enemy) continue; // 跳过当前敌人
                
                const nextDx = nextEnemy.x - weapon.x;
                const nextDy = nextEnemy.y - weapon.y;
                const nextDistance = Math.sqrt(nextDx * nextDx + nextDy * nextDy);
                
                if (nextDistance < minNextDistance) {
                  minNextDistance = nextDistance;
                  nextTarget = nextEnemy;
                }
              }
              
              if (nextTarget) {
                // 更新方向指向下一个目标
                const nextDx = nextTarget.x - weapon.x;
                const nextDy = nextTarget.y - weapon.y;
                const nextLength = Math.sqrt(nextDx * nextDx + nextDy * nextDy);
                
                weapon.directionX = nextDx / nextLength;
                weapon.directionY = nextDy / nextLength;
                weapon.rotation = Math.atan2(weapon.directionY, weapon.directionX) * 180 / Math.PI;
                continue; // 继续移动而不移除武器
              }
            }
            
            // 轨道武器不会被击中后移除
            if (!weapon.isOrbiting) {
              // 一旦击中敌人，移除武器
              this.weapons.splice(i, 1);
            }
            break; // 跳出内循环，因为武器可能已经被移除
          }
        }
        
        // 如果武器飞出屏幕，移除它
        if (!weapon.isOrbiting && (
          weapon.x < -20 || 
          weapon.x > this.fieldWidth + 20 || 
          weapon.y < -20 || 
          weapon.y > this.fieldHeight + 20
        )) {
          this.weapons.splice(i, 1);
        }
      }
      
      // 更新伤害数字
      this.updateDamageTexts();
    },
    
    // 创建单个朝向最近敌人的弹射物
    createSingleProjectile(weapon, now) {
      // 寻找最近的敌人
      let closestEnemy = null;
      let minDistance = Infinity;
      
      for (const enemy of this.enemies) {
        const dx = enemy.x - this.player.x;
        const dy = enemy.y - this.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestEnemy = enemy;
        }
      }
      
      // 计算朝向最近敌人的方向
      let directionX = 0;
      let directionY = 0;
      let rotation = 0;
      
      if (closestEnemy) {
        // 计算方向向量
        directionX = closestEnemy.x - this.player.x;
        directionY = closestEnemy.y - this.player.y;
        
        // 标准化方向向量
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        directionX = directionX / length;
        directionY = directionY / length;
        
        // 计算角度（用于旋转武器图标）
        rotation = Math.atan2(directionY, directionX) * 180 / Math.PI;
      } else {
        // 如果没有敌人，使用随机方向
        rotation = Math.random() * 360;
        directionX = Math.cos(rotation * Math.PI / 180);
        directionY = Math.sin(rotation * Math.PI / 180);
      }
      
      // 创建武器实例
      this.weapons.push({
        ...weapon,
        x: this.player.x,
        y: this.player.y,
        rotation: rotation,
        lifeTime: 500,
        startTime: now,
        directionX: directionX,
        directionY: directionY,
        hasHit: false  // 标记是否已经击中敌人
      });
    },
    
    // 创建三个扇形分布的弹射物
    createTripleProjectile(weapon, now) {
      // 寻找最近的敌人以确定基础方向
      let closestEnemy = null;
      let minDistance = Infinity;
      
      for (const enemy of this.enemies) {
        const dx = enemy.x - this.player.x;
        const dy = enemy.y - this.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestEnemy = enemy;
        }
      }
      
      // 基础角度
      let baseRotation = 0;
      
      if (closestEnemy) {
        const dx = closestEnemy.x - this.player.x;
        const dy = closestEnemy.y - this.player.y;
        baseRotation = Math.atan2(dy, dx) * 180 / Math.PI;
      } else {
        baseRotation = Math.random() * 360;
      }
      
      // 创建三个不同角度的弹射物
      for (let i = -1; i <= 1; i++) {
        const rotation = baseRotation + (i * 30); // 30度间隔
        const radians = rotation * Math.PI / 180;
        const directionX = Math.cos(radians);
        const directionY = Math.sin(radians);
        
        this.weapons.push({
          ...weapon,
          x: this.player.x,
          y: this.player.y,
          rotation: rotation,
          lifeTime: 500,
          startTime: now,
          directionX: directionX,
          directionY: directionY,
          hasHit: false
        });
      }
    },
    
    // 创建8个方向的弹射物
    createRadialProjectile(weapon, now) {
      // 创建8个方向的弹射物
      for (let i = 0; i < 8; i++) {
        const rotation = i * 45; // 均匀分布360度
        const radians = rotation * Math.PI / 180;
        const directionX = Math.cos(radians);
        const directionY = Math.sin(radians);
        
        this.weapons.push({
          ...weapon,
          x: this.player.x,
          y: this.player.y,
          rotation: rotation,
          lifeTime: 500,
          startTime: now,
          directionX: directionX,
          directionY: directionY,
          hasHit: false
        });
      }
    },
    
    // 创建环绕玩家的弹射物
    createOrbitProjectile(weapon, now) {
      // 计算轨道弹射物的位置
      const orbitRadius = 60;
      const orbitSpeed = 0.3;
      const orbitAngle = (now * orbitSpeed / 1000) % (2 * Math.PI);
      
      const x = this.player.x + orbitRadius * Math.cos(orbitAngle);
      const y = this.player.y + orbitRadius * Math.sin(orbitAngle);
      
      this.weapons.push({
        ...weapon,
        x: x,
        y: y,
        rotation: orbitAngle * 180 / Math.PI,
        lifeTime: 1000,
        startTime: now,
        directionX: 0, // 轨道武器不移动
        directionY: 0,
        isOrbiting: true,
        orbitRadius: orbitRadius,
        orbitSpeed: orbitSpeed,
        orbitCenter: { x: this.player.x, y: this.player.y },
        hasHit: false
      });
    },
    
    // 创建能够链式弹射的弹射物
    createChainProjectile(weapon, now) {
      // 类似于单一弹射物，但有链接属性
      this.createSingleProjectile({
        ...weapon,
        chainLeft: 3, // 可以链接3次
        chainRange: 150 // 链接范围
      }, now);
    },
    
    // 创建伤害数字
    createDamageText(x, y, value) {
      this.damageTexts.push({
        x: x,
        y: y,
        value: value,
        opacity: 1,
        startTime: performance.now()
      });
    },
    
    // 更新伤害数字
    updateDamageTexts() {
      const now = performance.now();
      
      for (let i = this.damageTexts.length - 1; i >= 0; i--) {
        const damageText = this.damageTexts[i];
        const elapsed = now - damageText.startTime;
        
        // 伤害数字持续时间为1000毫秒
        if (elapsed > 1000) {
          this.damageTexts.splice(i, 1);
          continue;
        }
        
        // 更新位置和透明度
        damageText.y -= 0.5; // 向上飘动
        damageText.opacity = 1 - (elapsed / 1000); // 逐渐消失
      }
    },
    // 增加波数和难度
    increaseWave() {
      this.waveNumber++;
      
      // 减少怪物生成间隔
      if (this.enemySpawnRate > 500) {
        this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 200);
        this.clearEnemySpawnTimer();
        this.startEnemySpawner();
      }
      
      // 创建一大波怪物
      this.spawnWave();
      
      // 显示新波数提示
      this.showWaveNotification();
    },
    
    // 显示新波数提示
    showWaveNotification() {
      // 可以在此添加波数提示的视觉效果
      console.log("第 " + this.waveNumber + " 波怪物来袭！");
    },
    
    // 生成一波怪物
    spawnWave() {
      // 根据当前波数决定生成的怪物数量
      const spawnCount = Math.min(5 + this.waveNumber, 20);
      
      for (let i = 0; i < spawnCount; i++) {
        setTimeout(() => {
          this.spawnEnemy(true); // 传递参数表示这是波次生成
        }, i * 200); // 间隔200毫秒生成，形成波次感
      }
    },
    // 添加暂停/恢复功能
    togglePause() {
      if (this.gameOver || this.levelUp) return; // 游戏结束或升级时不能暂停
      
      this.isPaused = !this.isPaused;
      
      if (!this.isPaused) {
        // 恢复游戏
        requestAnimationFrame(this.gameLoop);
      }
    }
  },
  mounted() {
    // 添加全局键盘事件监听
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  },
  beforeUnmount() {
    // 清除所有计时器
    clearInterval(this.gameTimer);
    this.clearEnemySpawnTimer();
    
    // 移除事件监听器
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0a0a0a;
  color: #fff;
}

.start-screen {
  text-align: center;
}

.start-button, .restart-button {
  padding: 12px 24px;
  font-size: 18px;
  background-color: #4a004a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.start-button:hover, .restart-button:hover {
  background-color: #6a006a;
}

.game-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.game-header {
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
}

.stats {
  display: flex;
  justify-content: space-around;
  font-size: 16px;
}

.game-field {
  flex: 1;
  position: relative;
  background-color: #111;
  overflow: hidden;
}

.player, .enemy, .weapon, .exp-gem {
  position: absolute;
  font-size: 24px;
  user-select: none;
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.9);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  z-index: 100;
}

.level-up {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.9);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  z-index: 100;
  width: 80%;
  max-width: 600px;
}

.upgrade-options {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.upgrade-option {
  background-color: #2a002a;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  width: 30%;
}

.upgrade-option:hover {
  background-color: #4a004a;
  transform: scale(1.05);
}

.upgrade-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.upgrade-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.upgrade-desc {
  font-size: 12px;
  color: #ccc;
}

.enemy {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  transform-origin: center;
}

.enemy-health-bar {
  width: 30px;
  height: 4px;
  background-color: #333;
  border-radius: 2px;
  margin-bottom: 2px;
  overflow: hidden;
}

.enemy-health-fill {
  height: 100%;
  background-color: #f00;
  transition: width 0.2s;
}

.damage-text {
  position: absolute;
  color: #ff0;
  font-weight: bold;
  font-size: 16px;
  text-shadow: 1px 1px 2px #000;
  pointer-events: none;
  z-index: 10;
}

/* 暂停菜单样式 */
.pause-menu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.9);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  z-index: 100;
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.pause-skills-list {
  margin-top: 20px;
  text-align: left;
}

.pause-skills-section {
  margin-bottom: 20px;
}

.pause-skills-section h4 {
  border-bottom: 1px solid #444;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.pause-skill-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pause-skill-item {
  display: flex;
  align-items: center;
  background-color: #222;
  padding: 10px;
  border-radius: 5px;
}

.pause-skill-icon {
  font-size: 32px;
  margin-right: 15px;
}

.pause-skill-details {
  flex: 1;
}

.pause-skill-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 3px;
}

.pause-skill-level {
  color: #aaa;
  margin-bottom: 5px;
}

.pause-skill-stats {
  font-size: 14px;
  color: #999;
}

/* 游戏中技能面板 */
.skills-panel {
  position: absolute;
  right: 20px;
  top: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  padding: 10px;
  width: 120px;
  z-index: 5;
}

.skills-section {
  margin-bottom: 10px;
}

.skills-section h4 {
  margin: 5px 0;
  font-size: 14px;
  text-align: center;
  color: #ddd;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
}

.skill-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333;
  border-radius: 5px;
  width: 30px;
  height: 30px;
  font-size: 16px;
}

.skill-level {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background-color: #000;
  border-radius: 3px;
  padding: 0 2px;
  font-size: 8px;
  color: #fff;
}
</style> 