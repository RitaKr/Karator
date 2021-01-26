const studentInput = document.getElementById("studentInput");
const addStudentBtn = document.getElementById("addStudent");
const generateMarksBtn = document.getElementById("generateMarks");
const studentsTable = document.getElementById("studentsTable");
const classInput = document.getElementById("classInput");
const addClassBtn = document.getElementById("addClass");
const classesListUl = document.getElementById("classesList");
const classNameSpan = document.getElementById("class-name-span");
const minMarkInput = document.getElementById("minMark");
const maxMarkInput = document.getElementById("maxMark");

let i = 0;

    //console.log(localStorage.karatorData)
    //localStorage.removeItem('karatorData')
if (localStorage.karatorData===null || localStorage.karatorData===undefined) {
        localStorage.setItem('karatorData', '{"classes":[]}');   
} 
    
let dataObj = JSON.parse(localStorage.karatorData);
console.log(dataObj);
console.log(i);
if (dataObj.classes.length>0) {
        i = dataObj.classes[dataObj.classes.length-1].id+1;
            
}
    
window.onload = init;
function init(){
    dataObj.classes.forEach(item => {
            addClassLi(item.className)
    });
    chooseClass(`cl${dataObj.classes[i-1].className}`);
    
}


function addClassLi(className){
    let li = document.createElement('li');
    li.innerHTML = `Класс ${className}`;
    li.setAttribute('id', 'cl'+className);
    li.setAttribute('class', 'classLi');
    li.setAttribute('onclick', 'chooseClass(this.id)');
    classesListUl.appendChild(li);
}

function addClass(e){
    let j = 0;
    e.preventDefault();
    let className= classInput.value;
    console.log(className);
    if (className!=null && className!=" " && className!="") {
        let classObj = {
            className: `${className}`,
            isChosen: true,
            students: [],
            marks: [],
            id: i,
        };
        dataObj.classes.push(classObj);
        //console.log(dataObj);
        //console.log(dataObj.classes);
        
        dataObj.classes.forEach(cl => {
            if (cl.id!=i) {
                cl.isChosen = false
            }
        })
                
        //console.log('i ',dataObj.classes[dataObj.classes.length-1].id)
        //console.log('i',i);
        addClassLi(className);
        chooseClass(`cl${dataObj.classes[i].className}`);

        i = dataObj.classes[dataObj.classes.length-1].id;
        i++;
        localStorage.karatorData = JSON.stringify(dataObj, 'classes');
    } else {
        alert('Введіть назву класу!')
    }
    classInput.value='';
 
}
addClassBtn.addEventListener('click', addClass);


function addStudent(e){
    e.preventDefault();

    let chossenClassId;
    chossenClassId = findChosenClass().id;
    
    let studentsArr = dataObj.classes[chossenClassId].students;
    
    let studentName= studentInput.value;
    console.log(studentName);
    if (studentName!=null && studentName!=" " && studentName!="") {
        /*let studentObj = {
            studentName: `${studentName}`,
            id: j,
        };
        studentsArr.push(studentObj);
        */
       studentsArr.push(studentName);
       findChosenClass().marks.push({student: `${studentName}`, mark: ''})
        console.log('this class ',dataObj.classes[chossenClassId]);
        console.log('this class students ',studentsArr);
        
                
        fillTable(dataObj.classes[chossenClassId], studentsArr, studentName);
        //chooseClass(`cl${dataObj.classes[i].className}`);
/*
        j = studentsArr[studentsArr.length-1].id;
        j++;*/
        localStorage.karatorData = JSON.stringify(dataObj, 'classes');
    } else {
        alert('Введіть хоча б прізвище учня!')
    }
    studentInput.value='';
}
addStudentBtn.addEventListener('click', addStudent);

function fillTable(cl, arr, name){
    let tr = document.createElement('tr');
    tr.innerHTML = `<td>${arr.indexOf(name)+1}</td>
    <td>${name}</td>
    <td class="mark-td"></td>
    `;
    tr.setAttribute('id', 'std'+arr.indexOf(name));
    tr.setAttribute('class', 'studentTr');
   // li.setAttribute('onclick', 'chooseClass(this.id)');
    studentsTable.appendChild(tr);
    let markTdArr = document.querySelectorAll('.mark-td');
    return markTdArr;
}

function sortAlphabet() {
    findChosenClass().students.sort();
    //findChosenClass().marks.sort();
    let students = findChosenClass().students;
    let marks = findChosenClass().marks;
    console.log('do ',marks);
    marks.sort((a, b) => a.student > b.student ? 1 : -1);

    console.log(students);
    console.log('posle ',marks);
    studentsTable.innerHTML='';
    students.forEach((item, i) => {
        marksTdArr = fillTable(findChosenClass(), students, item)//cl, arr, name
        //console.log(marksTdArr);
        
        marksTdArr.forEach((td, i)=> {
            td.innerHTML=marks[i].mark;
            colorMarks(findChosenClass(), td, i)
        })
        //appendMarks(thisClass, marksTdArr)
    });
}


function findChosenClass(){
    let chossenClass;
    dataObj.classes.forEach(cl =>{
        if (cl.isChosen==true) {
            chossenClass = cl;
    
        }
    });
    return chossenClass;
}



function chooseClass(clName){
    //console.log(dataObj.classes[i-1])
    let thisClass;
    let marksTdArr;
    
    dataObj.classes.forEach(cl => {
        //console.log(cl)
        //console.log(cl.className, clName);
        if (`cl${cl.className}`!=clName) {
            //console.log( document.querySelector(`#cl${cl.className}`));
            //console.log('unchosen')
            document.querySelector(`#cl${cl.className}`).style.background = 'rgb(78, 76, 92)';
            cl.isChosen=false;
        } else  {
            cl.isChosen=true;
            thisClass=cl;
            //console.log('chosen')
        }
    })
    //console.log('chosen class ', dataObj.classes[id]);
    console.log(clName);
    let chosenLi = document.querySelector(`#${clName}`);
    chosenLi.style.background = 'rgb(129, 124, 160)'
    openClassList(clName);

    
    studentsTable.innerHTML='';
    thisClass.students.forEach(item => {
        marksTdArr = fillTable(thisClass, thisClass.students, item)//cl, arr, name
        console.log(marksTdArr);
        console.log(thisClass.marks);
        marksTdArr.forEach((td, i)=> {
            console.log(thisClass.marks[i]);
            td.innerHTML=thisClass.marks[i].mark;
            colorMarks(thisClass, td, i)
        })
        //appendMarks(thisClass, marksTdArr)
    });
    localStorage.karatorData = JSON.stringify(dataObj, 'classes');
    return marksTdArr;
    
}
generateMarksBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    let chossenClass;
    let chossenClassName;
    chossenClass = findChosenClass();
    chossenClassName = `cl${chossenClass.className}`;
     if (chossenClass.students.length>0) {
        let marksTdArr = chooseClass(chossenClassName);
        //console.log(chossenClass, marksTdArr);
        appendMarks(chossenClass, marksTdArr);
    } else {
        alert('У цьому класі ще нема учнів!')
    }
})

function openClassList(clName){
    classNameSpan.innerHTML = clName.slice(2);
}

function appendMarks(cl, marksTdArr) {
    marksTdArr.forEach((td, i) => {
        cl.marks[i]= {
            student: cl.students[i],
            mark: generateMark()
        };
        colorMarks(cl, td, i);
        td.innerHTML=cl.marks[i].mark;
    })
}
function colorMarks(cl, td, i) {
    clearTdClasses(td);
    td.classList.add(`mark${cl.marks[i].mark}`);
    /*
    if (cl.marks[i].mark==1 || cl.marks[i].mark==2) td.classList.add('mark1-2');
    if (cl.marks[i].mark==3 || cl.marks[i].mark==4) td.classList.add('mark3-4');
    if (cl.marks[i].mark==5 || cl.marks[i].mark==6) td.classList.add('mark5-6');
    if (cl.marks[i].mark==7 || cl.marks[i].mark==8) td.classList.add('mark7-8');
    if (cl.marks[i].mark==9 || cl.marks[i].mark==10) td.classList.add('mark9-10');
    if (cl.marks[i].mark==11 || cl.marks[i].mark==12) td.classList.add('mark11-12');
    */
}
function clearTdClasses(td){
    for (let i=0; i<=12; i++) {
        td.classList.remove(`mark${i}`);
    }
    /*
    td.classList.remove('mark1-2');
    td.classList.remove('mark3-4');
    td.classList.remove('mark5-6');
    td.classList.remove('mark7-8');
    td.classList.remove('mark9-10');
    td.classList.remove('mark11-12');
    */
}
function generateMark() {
    let min = +minMark.value;
    let max = +maxMark.value;
    let mark = Math.floor(Math.random()*(max-min+1))+min;
    return mark
    
}








