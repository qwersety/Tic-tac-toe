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

function newGame() {
  // добавляем чистое игровое поле
  document.body.innerHTML=renderField();



  // основные правила игры
  // объявление и заполнение массива в 9 ячеек для хранения статуса
  let gameField=[];
  for (let i = 1; i <= 9; i++) {
    gameField[i]='';
  }

  // генерим рандомное число, если 0- первый ход за компом, если 1- пользователя
  let firstStep = randomInteger(1,2);
  if (firstStep==1) {
    gameField=computerStep(gameField, firstStep);
  } else {
    userStep(gameField, firstStep);
  }


}

// ход компьютера
function computerStep(gameField, firstStep) {
  console.log("ПК");
  let flag=false;
  let step=0;
  while (flag==false) {
    step=randomInteger(1,9);
    if (gameField[step]=='') {
      flag=true;
      gameField[step]==0;
    }
  }
  if (firstStep==1) {
    renderCross(step);
  } else {
    renderCircle(step);
  }

  console.log(gameField);
  return gameField;
}

function userStep(gameField, firstStep) {
  console.log('Я');
  let step;
  // добавляем слушатеелей на игровое поле, через делегирование
  document.getElementById('gameBox').onclick = function(event) {
    // обработка нажатия
    step = event.target.id.slice(7);
    if (step!='') {
      if (firstStep==1) document.getElementById(`cell-${step}`).addEventListener("click", renderCircle(step));
      if (firstStep==2) document.getElementById(`cell-${step}`).addEventListener("click", renderCross(step));
      gameField[step]==1;
    }
  };
  gameField[step]==1;

  console.log(gameField);
  return step
}

//Функция определения победителя
function winChecker() {

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
    console.log(part);
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

// рандомное число от числа до числа
function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
