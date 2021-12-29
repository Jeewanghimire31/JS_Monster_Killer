const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 30;

const MODE_ATTACK = 'ATTACK';//MODE_ATTACK=0;
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'; //MODE_STRONG_ATTACK=1;
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


const enteredValue =prompt('maximum life you and monster have.','100');

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if (isNaN(chosenMaxLife) || (chosenMaxLife <= 0)){
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth){
  let logEntry = {
      event: ev,
      value: val,
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth
    };
    switch (ev){
      case LOG_EVENT_PLAYER_ATTACK:
        logEntry.target = 'MONSTER';
        break;
      case LOG_EVENT_PLAYER_STRONG_ATTACK:
          log_Entry={
            event:ev,
            value:val,
            target:'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
          };
          break;
      case LOG_EVENT_MONSTER_ATTACK:
        log_Entry={
          event:ev,
          value:val,
          target:'PLAYER',
          finalMonsterHealth: monsterHealth,
          finalPlayerHealth: playerHealth
        };
        break;
     case LOG_EVENT_PLAYER_HEAL:
      log_Entry={
        event:ev,
        value:val,
        target:'PLAYER',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
      case LOG_EVENT_GAME_OVER:
        log_Entry={
          event: ev,
          value: val,
          finalMonsterHealth: monsterHealth,
          finalPlayerHealth: playerHealth
        };
        break;
        default :
        logentry = {};
    }

  // if (ev === LOG_EVENT_PLAYER_ATTACK){
  //   logEntry.target = 'MONSTER';
  // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
  //     log_Entry={
  //       event:ev,
  //       value:val,
  //       target:'MONSTER',
  //       finalMonsterHealth: monsterHealth,
  //       finalPlayerHealth: playerHealth
  //     };
  // } else if(ev === LOG_EVENT_MONSTER_ATTACK){
  //   log_Entry={
  //     event:ev,
  //     value:val,
  //     target:'PLAYER',
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth
  //   };
  // } else if(ev === LOG_EVENT_PLAYER_HEAL){
  //   log_Entry={
  //     event:ev,
  //     value:val,
  //     target:'PLAYER',
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth
  //   };
  // } else if (ev === LOG_EVENT_GAME_OVER){
  //   log_Entry={
  //     event: ev,
  //     value: val,
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth
  //   };
  // }
  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  // console.log("endRound");
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("You would be dead but the bonus life saved you!!!");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You Won!!!");
    writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON!!!', currentMonsterHealth, currentPlayerHealth);
    reset();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You Lost!!!");
    writeToLog(LOG_EVENT_MONSTER_ATTACK, 'MONSTER WON!!!', currentMonsterHealth, currentPlayerHealth);
    
    reset();
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("You have Draw!!!");
    writeToLog(LOG_EVENT_MONSTER_ATTACK, 'A DRAW', currentMonsterHealth, currentPlayerHealth);

    reset();
  }
}

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  let logEvent = mode === MODE_ATTACK? LOG_EVENT_PLAYER_ATTACK:LOG_EVENT_PLAYER_STRONG_ATTACK;
  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  // if (currentPlayerHealth <= 0) return;
  // if (currentMonsterHealth <= 0) return;
  // console.log(maxDamage);
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;  
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);

  endRound();
}

function attackHandler() {
  // console.log("Attack Handler");
    // if (currentPlayerHealth <= 0) return;
    // if (currentMonsterHealth <=0) return;
    // const damage = dealMonsterDamage(ATTACK_VALUE);
    // currentMonsterHealth -= damage;
    // const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    // currentPlayerHealth -= playerDamage;
    // if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    //   alert("You Won!!!");
    // } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    //   alert("You Lost!!!");
    // } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    //   alert("You have Draw!!!");
    // }
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal because you are already full!!!");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);

  endRound();
}

function printLogHandler(){
  console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
