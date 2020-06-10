"use strict";

document.getElementById('startClick').addEventListener("click", start);

function start() {
  // обнуляем поле и блок начального массива
  document.getElementById('sortingTree').innerHTML='';
  document.getElementById('arrayBlock').innerHTML='';
  canvasClear();
  // считываем данные инпутов
  let form = document.getElementById('startForm');
  // проверрка на корректное число
  if (form.numNums.value%1!=0 || form.numNums.value<=0 || form.speedT.value%1!=0 || form.speedT.value<=0){
    alert('Ошибка, вроверьте введенные данные!')
  } else {

    document.getElementById("startClick").style.pointerEvents = "none";
    // если данные прошли проверку присваивам начальные данные и поехали
    // число цифр в сортировке
    let charCount = Number(form.numNums.value);
    // скорость движения объектов
    let speed =  Number(form.speedT.value);
    // высота дерева, 1 по умолчанию
    let levelCount=1;
    //массив для сортировки, также выводим его на экран
    let arrayBefore=[];
    for (let i = 0; i < charCount; i++) {
      arrayBefore[i]=randomInteger(0,99);
      if (i!=charCount-1){
        document.getElementById('arrayBlock').innerHTML+=`${arrayBefore[i]}, `;
      } else {
        document.getElementById('arrayBlock').innerHTML+=`${arrayBefore[i]}`;
      }
    }
    // маасив для сбора данных по полученному массиву
    // itemNumber-порядковый номер; generatedArray-сам сгенерированный массив; sortPosition-позиция в отсортированном массиве;
    // levelPosition-позиция по вертикали (уровень размещения); leftChild, rightChild - дети в дереве; parent - родитель в дереве
    let arrayBase=[
      ['itemNumber    - '],
      ['generatedArray- '],
      ['sortPosition  - '],
      ['levelPosition - '],
      ['leftChild     - '],
      ['rightChild    - '],
      ['parent        - ']
    ];
    // все до след комментария - процесс заполнения "arrayBase"
    for (let i = 1; i <= charCount; i++) {
      arrayBase[0][i]=i;
      arrayBase[1][i]=arrayBefore[i-1];
      arrayBase[4][i]='';
      arrayBase[5][i]='';
      arrayBase[6][i]='';
    }
    let arrayPosition=bubbleSort(arrayBefore, charCount);
    for (let j = 0; j < charCount; j++)
      for (let i = 0; i < charCount; i++) {
        if (arrayPosition[i]+1==arrayBase[0][j+1]){
          arrayBase[2][j+1]=i+1;
          break;
      }
    }
    arrayBase=familyDistribution(arrayBase, charCount);
   // вывод в консоль сформированного массива
    /*for (let j = 0; j < 7; j++){
      console.log(j+' '+arrayBase[j]);
    }*/
    // вычисление высоты дерева (самой большой уровень)
    for (let i = 1; i <= charCount; i++) {
      if (arrayBase[3][i]!='' && arrayBase[3][i]>levelCount)
        levelCount=arrayBase[3][i]
    }
    // формируем строки и столбцы грида
    document.getElementById('sortingTree').style.setProperty('grid-template-columns', `repeat(${charCount}, 1fr)`);
    document.getElementById('sortingTree').style.setProperty('grid-template-rows', `repeat(${levelCount}, 1fr)`);
    // подстраиваем канвас под поле
    document.getElementById(`canvasField`).width=charCount*52;
    document.getElementById(`canvasField`).height=(levelCount+1)*52;
    // заполняем все ячейки пустыми блоками (на 1 уровень больше, чем дерево)
    for (let i = 1; i <= charCount*levelCount+charCount; i++) {
      document.getElementById('sortingTree').innerHTML+=`<div id='cell-${i}' class='cell'></div>`;
    }
    // вставка чисел на законные места. тестовый режис проверки работоспособнсти распреедления чисел по таблице
    /*for (let i = 1; i <= charCount; i++) {
      //console.log(`cell-${(arrayBase[3][i]-1)*charCount+arrayBase[2][i]+charCount}`);
      document.getElementById(`cell-${(arrayBase[3][i]-1)*charCount+arrayBase[2][i]+charCount}`).innerHTML=`<div id='pointTest-${i}' class='pointTest'><div class='inPoint'>${arrayBase[1][i]}</div></div>`;
    }*/
    // вычисляем центральную позицию (в большую сторону)
    let halfCharCount=Math.round(charCount/2);
    // вставляем все точки в центральную начальную позицию, задаем им разные z индексы
    for (let i = 1; i <= charCount; i++) {
      document.getElementById(`cell-${halfCharCount}`).innerHTML+=`<div id='point-${i}' class='point'><div class='inPoint'>${arrayBase[1][i]}</div></div>`;
      document.getElementById(`point-${i}`).style.setProperty('z-index', `${charCount-i+5}`);
    }
    let flag=0;
    // запускаем скрипт вижения точек
    flag = pointMove(arrayBase, 1, charCount, halfCharCount, speed, flag);
  }
}

// функция для внесения паузы в код (использую до подъема шаров)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// функция подъема точек ввверх
function finalMove(arrayBase,halfCharCount, pointID,charCount, speed) {
  let xFin=arrayBase[2][pointID]*52;
  let yFin=arrayBase[3][pointID]*52;
  let xDis=xFin-(halfCharCount)*52;
  let yDis=0;
  let point = document.getElementById(`point-${pointID}`);
  let animation = point.animate([
    {transform: `translate(${xDis}px, ${yFin}px)`},
    {transform: `translate(${xDis}px, ${yDis}px)`}
  ], 3000); // !!!!! время подъема шаров, не уменьшается от показателя скорости
  animation.addEventListener('finish', function() {
    point.style.transform = `translate(${xDis}px, ${yDis}px)`;
    document.getElementById("startClick").style.pointerEvents = "auto";
  });
}


//функция движения точек на свои места в дереве
function pointMove(arrayBase, pointID, charCount, halfCharCount, speed, flag) {
  let xFin=arrayBase[2][pointID]*52;
  let yFin=arrayBase[3][pointID]*52;
  let xDis=xFin-(halfCharCount)*52;
  let point = document.getElementById(`point-${pointID}`);
  point.style.setProperty('z-index', `${charCount-arrayBase[2][pointID]+5}`);
  let animation = point.animate([
    {transform: 'translate(0)'},
    {transform: `translate(${xDis}px, ${yFin}px)`}
  ], 3000/speed);
  animation.addEventListener('finish', async function() {
    flag++; // планировал, но не использовал
    point.style.transform = `translate(${xDis}px, ${yFin}px)`;
    if (pointID<charCount) {
      pointID++;
      pointMove(arrayBase, pointID, charCount, halfCharCount, speed, flag); // перезапуск для другой точки
      // если дошли до конца запускаем анимаацию общего подъема
      if (pointID>1){
        lineDraw( arrayBase[2][arrayBase[6][pointID]]*52-26, (arrayBase[3][arrayBase[6][pointID]]+1)*52-26, (arrayBase[2][pointID]*52-26), (arrayBase[3][pointID]+1)*52-26);
      }
    }
    // проверяю флаг, если он равен числу элементов массива, стираю линии с канваса и через 2 сек поднимаем шарики
    if (flag==charCount) {
      await sleep(2000); // время паузы до разрушения дерева !!! не уменьшается от показателя скорости
      for (let i = 1; i <= charCount; i++) {
        finalMove(arrayBase,halfCharCount, i, charCount, speed);
        canvasClear();
      }
    }
  });

  return flag;
}
// функция очистки канваса
function canvasClear() {
  var canvas=document.getElementById('canvasField');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// отрисовка линий на дереве от родителя к детям, если они есть
function lineDraw(xP, yP, xC, yC) {
  var canvas=document.getElementById('canvasField');
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = "#008B8B";
  ctx.moveTo(xP,yP);
  ctx.lineWidth = 3; // толщина линии
  ctx.lineTo(xC, yC);
  ctx.stroke();
}

// заполняем строки детей, родителей и уровни в дереве
function familyDistribution(arrayBase, charCount) {
  arrayBase[3][1]=1;
  for (let i = 2; i<= charCount; i++) {
    for (let j = 1; j <i; ) {
      if (arrayBase[1][i]<arrayBase[1][j]){
        if (arrayBase[4][j]=="") {
          arrayBase[4][j]=i;
          arrayBase[3][i]=arrayBase[3][j]+1;
          arrayBase[6][i]=j;
          break;
        } else {
          j=arrayBase[4][j];
        }
      } else{
        if (arrayBase[5][j]=="") {
          arrayBase[5][j]=i;
          arrayBase[3][i]=arrayBase[3][j]+1;
          arrayBase[6][i]=j;
          break;
        } else j=arrayBase[5][j];
      }
    }
  }
  return arrayBase;
}


// сортировка пузырьком, модернезирована под вывод результатов изменения позиций чисел (на ее основе строится sortPosition)
function bubbleSort(arr, charCount) {
  let arrayB=[];
  let arrayS=[];
  for (let i = 0; i < charCount; i++) {
    arrayB[i]=i;
    arrayS[i]=arr[i];
  }
  for (let i = 0, endI = charCount - 1; i < endI; i++) {
    let wasSwap = false;
    for (let j = 0, endJ = endI - i; j < endJ; j++) {
      if (arrayS[j] > arrayS[j + 1]){
        let swap1 = arrayB[j];
        let swap2 = arrayS[j];
        arrayB[j] = arrayB[j + 1];
        arrayB[j + 1] = swap1;
        arrayS[j] = arrayS[j + 1];
        arrayS[j + 1] = swap2;
        wasSwap = true;
      }
    }
    if (!wasSwap) break;
  }
  return arrayB;
}

// рандомное число от числа до числа
function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
