"use strict";
// слушатель нажатия кнопки начало
document.getElementById('startClick').addEventListener("click", startClick);

// функция для запуска функции новой игры и функции проверки имени
function startClick(){
  // различные действия (проверка корректности, вывод ошибки, взятие данных) для получения имени игрока
  let form = document.getElementById('startForm');
  let userName = form.userName.value;
  if (nameChecker(userName)){
    //ачинаем игру, передаем имя игрока
    form.onsubmit = newGame(userName);
    // удаление стартового окна
    //document.getElementById('startPanel').remove();
  }
}

function newGame(userName) {
  document.body.innerHTML=renderGame(userName);
  // добавляем чистое игровое поле
  document.body.innerHTML+=renderField();
  // основные правила игры
  // объявление и заполнение массива в 9 ячеек для хранения статуса
  let gameField=[];
  for (let i = 0; i <= 9; i++) {
    gameField[i]='';
  }
  // генерим рандомное число, если 0- первый ход за компом, если 1- пользователя
  let firstStep = randomInteger(1,2);
  // переменная шага (начинаем с 1), дальше и не нужна. Пока оставлю
  let stepNumber=1;
  // запускаем шаги игроков
  steps(gameField, firstStep, firstStep, stepNumber);
}

// формирование блоков (тег, id, класс, контент)
function composer(tag, id, clas, content) {
  let renderComposerString='';
  let identif='';
  if (id!='') identif+=`id=${id} `;
  if (clas!='') identif+=`class=${clas}`;
  renderComposerString+=`<${tag} ${identif}>${content}</${tag}>`
  return renderComposerString;
}

function renderGame(name) {
  let renderGameField='';
  // строка для шапки
  let helloString= `Привет, ${name}!  Это игра - "Крестики-нолики", она не имеет логического завершения.  Ты играешь против бота с развитым ИИ, ниже показан счет игры, попробуй выиграть больше раз, чем компьютер... УДАЧИ! =)`
  renderGameField+=composer('div', '', 'helloBlock', helloString);
  return renderGameField;
}

// функция обработки хода
async function steps(gameField, firstStep, whoStep,stepNumber) {
  if (stepNumber<=9) {
    if ( whoStep==1) {
      computerStep();
    } else
    if ( whoStep==2) userStep();
  } else {
    setTimeout(alertSay, 3000, "Ничья!");
  }

  // ход компьютера
  function computerStep() {
    // ход будет с паузой
    setTimeout(async function(){
    //  await sleep(2000);
      let step=0;
      let flag=false;
      while (flag==false) {
        step=randomInteger(1,9);
        if (gameField[step]=='') {
          flag=true;
          gameField[step]=1;
          stepNumber++;
          whoStep=2;
          if (winChecker(gameField)){
            whoStep=0;
          } else{
            steps(gameField, firstStep, whoStep, stepNumber);
          }
        }
      }
      if (firstStep==1) {
        renderCross(step);
      } else {
        renderCircle(step);
      }
    }, 2000);
  }


  // функция хода польхователя
  function userStep() {
    // активируем нажатия на игрове поле
    document.getElementById('gameBox').style.pointerEvents = "auto";
    let step;
    // добавляем слушатеелей на игровое поле, через делегирование
    document.getElementById('gameBox').onclick = async function(event) {
      // обработка нажатия
      step = event.target.id.slice(7);
      // проверка ячейки на незанятость и в соотвествии с фигурой игрока рисум ее в выбранной точке
      if (step=='' || gameField[step]!='') {
         alert("Выберите другую ячейку!");
      } else {
        if (gameField[step]=='' && firstStep==2) {
          document.getElementById(`cell-${step}`).addEventListener("click", renderCross(step));
        } else
        if (gameField[step]=='' && firstStep==1) {
          document.getElementById(`cell-${step}`).addEventListener("click", renderCircle(step));
        } else console.log("Ошибка в данных ячеек!");
        // блокируем нажатия на игровое поле
        document.getElementById('gameBox').style.pointerEvents = "none";
        // отмечаем ход игрока в общеигровом массиве
        gameField[step]=2;
        // увеличиваем номер ход
        stepNumber++;
        // даем флаг хода компьютера
        whoStep=1;
        // вызываем функцию хода
        if (winChecker(gameField)){
          whoStep=0;
        } else{
          steps(gameField, firstStep, whoStep, stepNumber);
        }
      }
    };
  }
}

//Функция определения победителя
function winChecker(gameField) {
  // заводим две строки и расспределяем по ним номера клеток с шагами игроков
  let playerSteps='';
  let computerSteps='';
  let globalFlag=false;
  for (let i = 1; i < 10; i++) {
    if (gameField[i]==1){
      computerSteps+=`${i}`;
    }
    if (gameField[i]==2){
      playerSteps+=`${i}`;
    }
  }

  if (checkSteps(playerSteps)) {
    setTimeout(alertSay, 1000, "Вы победили!");
    globalFlag=true;
  }
  if (checkSteps(computerSteps)) {
    setTimeout(alertSay, 1000, "Вы проиграли!");
    globalFlag=true;
  }

  // массив для проверки строк на выигрыш
  function checkSteps(stringSteps) {
    // победный массив
    let winArray=[[1,2,3],[4,5,6],[7,8,9],[7,4,1],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
    let flag=false;
    for (let i = 0; i < winArray.length; i++) {
      console.log('----');
      let counter=0;
      for (let j = 0; j < winArray[i].length; j++) {
        for (let x = 0; x < stringSteps.length; x++) {
          if (stringSteps[x]==winArray[i][j]){
            console.log('чекаю '+winArray[i][j]+'с '+stringSteps[x]);
            counter++;
            console.log('счетчик'+counter);
            break;
          }
        }
        if (counter>=3){
          flag=true;
          break;
          break;
        }
      }
    }
    return flag;
  }
return globalFlag;
}


function renderCircle(canvasID) {
  let canvas = document.getElementById(`canvas-${canvasID}`);
  let ctx = canvas.getContext("2d");
  let x=1.9;
  let speed=1/20;
  render();
  function render()
  {
    if (x>0) x-=speed;
    drawLine(x);
    let req = requestAnimationFrame(render);
    if (x<=0) {
      cancelAnimationFrame(req);
    }
  }
  function drawLine(part)
  {
    ctx.beginPath();
    ctx.arc(75, 75, 60,  part*Math.PI, 2* Math.PI);
    ctx.lineWidth = 20; // толщина линии
    ctx.strokeStyle = "#4B0082";
    ctx.stroke();
  }
}

// функция отрисовки крестика на поле
function renderCross(canvasID) {
  let canvas = document.getElementById(`canvas-${canvasID}`);
  let ctx = canvas.getContext("2d");
  let speed = 4;
  let prevLX=10, prevLY=10, prevRX=140,prevRY=10;
  let xL = 10, yL = 10, xR = 140, yR = 10;
  render();
  function render()
  {
    if (xL <140) xL += speed;
    if (yL <140) yL += speed;
    if (xR >10) xR -= speed;
    if (yR <140) yR += speed;
    drawLine(xL, yL, prevLX ,prevLY);
    drawLine(xR, yR, prevRX ,prevRY);
    let req = requestAnimationFrame(render);
    if (xL>=140 || yL>=140 ||xR<=10 || yL>=140) {
      cancelAnimationFrame(req);
    }
  }
  function drawLine(X, Y, prevX ,prevY)
  {
    ctx.beginPath();
    ctx.moveTo(prevX,prevY);
    ctx.lineTo(X,Y);
    ctx.lineWidth = 20; // толщина линии
    ctx.strokeStyle = "#800080";
    ctx.stroke();
  }
}

// функция проверки имени. вернет true, если все OK
function nameChecker(userName) {
  let corrector=true;
  let bans=["","<",">","{","}","[","]","`","/","\\","!",".",",","#","~","&","$",":","*","\'","\"","@","^","%"," "," ","  ",""];
  if (userName=="") corrector=false;
  for (let char of userName){
    for (let i=0;i<bans.length;i++){
      if (char==bans[i]) {
        corrector=false;
        alert("Ошибка ввода, повторите!");
        break;
      }
    }
    if (corrector==false) break;
  }
  return corrector;
}

// функкция построения игрового поля
function renderField() {
  let fieldString='';
  fieldString='<div id="gameBox" class="fieldBox">';
  for (let i = 1; i <= 9; i++) {
    fieldString+=`<div id="cell-${i}" class="fieldCell"><canvas id="canvas-${i}" class="canvas"></canvas></div>`;
  }
  fieldString+='</div>';
  return fieldString;
}

// функция собирает и приписывает в начало textarea информации боя.
function debagText(string) {
  let bebagString=`${string}\n${document.getElementById('debagArea').value}`;
  document.getElementById('debagArea').value=bebagString;
}

// функция объявления результата игры
function alertSay(rezult) {
  alert(rezult);
}
// функция для внесения паузы в код
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// рандомное число от числа до числа
function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
