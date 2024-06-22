//Select Element
let countSpan = document.querySelector(".count span");
let bulletsSpanContiner = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContiner = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");



//set options
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;


function getQuestion() {
    let myRequest = new XMLHttpRequest()
    myRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200){
            let qeustionObject = JSON.parse(this.responseText);   //I had a json object and converted it to a javascript object
            let qeustionCount = qeustionObject.length;
            //create bullets + set question count
            creatBullets (qeustionCount)

            // add question data
            addQuestionData(qeustionObject[currentIndex], qeustionCount)

            //start countdown
            countdown(5, qeustionCount)

            //click on submit
            submitButton.onclick = () => {  
                //get right answer
                let theRightAnswer = qeustionObject[currentIndex].right_answer;
                
                //increase index 
                currentIndex++;

                //chack the answer
                chackAnswer(theRightAnswer, qeustionCount)

                //remove previous question
                quizArea.innerHTML = ""
                answersArea.innerHTML = ""
            addQuestionData(qeustionObject[currentIndex], qeustionCount)
            
            //handle bullets class
            handleBullets();

             //start countdown
             clearInterval(countdownInterval)
             countdown(5, qeustionCount);

            //show results
            showResults(qeustionCount);



            };
        };
    };
    myRequest.open("GET", "html_qeustion.json", true);
    myRequest.send();
}
getQuestion();

function creatBullets (num){
    countSpan.innerHTML = num;

    //creat bullet
for(let i =0; i < num; i++){
     // creat span
     let theBullet = document.createElement("span")

     //check is its first span 
     if(i === 0){
        theBullet.className = "on"
     }

     // Append to bullets to main bullet container
     bulletsSpanContiner.appendChild(theBullet);

  }

}

function addQuestionData(obj, count){
    if(currentIndex < count){
          //creat h2 question title
  let qeusionTitle = document.createElement("h2")

  //creat question text
  let questionText = document.createTextNode(obj.title)

  //appding text to h2
  qeusionTitle.appendChild(questionText)

  //append the h2 to the quiz area
  quizArea.appendChild(qeusionTitle) 

  //creat the answer 
  for (let i = 1; i <= 4; i++){

    //creat main the answer div
    let mainDiv = document.createElement("div")

    //add class to main div 
    mainDiv.className = 'answer'

    //creat radio input
    let radioInput = document.createElement("input")

    //add type + name + id + data-attribute
    radioInput.name = 'question';
    radioInput.type = 'radio';
    radioInput.id = `answer_${i}`;
    radioInput.dataset.answer = obj[`answer_${i}`];

    //make first option selected
    if(i === 1){
        radioInput.checked = true ; 
    }
      

    //creat label
    let theLabel = document.createElement("label")

    //add for attribute
    theLabel.htmlFor = `answer_${i}`;

    //creat label text
    let thelabeltext = document.createTextNode(obj[`answer_${i}`]);

    //add the text label
    theLabel.appendChild(thelabeltext);

    //add input + label to main div
    mainDiv.appendChild(radioInput);
    mainDiv.appendChild(theLabel);

    //append all divs to answer area
    answersArea.appendChild(mainDiv);
  }
    }


}

function chackAnswer(rAnswer, count){
   let answer = document.getElementsByName("question");
   let  theChoosenAnswer;

   for(let i = 0; i < answer.length; i++){
    if(answer[i].checked){
        theChoosenAnswer = answer[i].dataset.answer

    }

   }
        if(rAnswer === theChoosenAnswer){
            rightAnswer++;
            console.log("good answer")
        }

}

function handleBullets(){
    let bulletsSpan = document.querySelectorAll(".bullets .spans span");
    let areaOfSpan = Array.from(bulletsSpan)
    areaOfSpan.forEach((span, index) => {
        if(currentIndex === index){
            span.className = 'on'
        }
    })
    
}

function showResults(count){
    let theResults;
    if(currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
       if(rightAnswer > (count / 2) && rightAnswer < count){
        theResults = `<span class="good">Good</span>, ${rightAnswer} From ${count} Is Good.`;
       }else if(rightAnswer === count){
        theResults = `<span class="perfect">Perfect</span>, All Answer Is Good`;
       }else{
        theResults = `<span class="bad">Bad</span>, ${rightAnswer} From ${count} `;
       }

       resultsContiner.innerHTML = theResults;
       resultsContiner.style.padding = '10px'
       resultsContiner.style.backgroundColor = 'white'
       resultsContiner.style.marginTop = '10px'
     }
}


function countdown(duration, count){
    if(currentIndex < count){
        let minutes, seconds;
        countdownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            
            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds = minutes < 10 ? `0${seconds}` : seconds
            countdownElement.innerHTML = `${minutes}:${seconds}`;
            if(--duration < 0){
                clearInterval(countdownInterval);
                submitButton.click();

            }

        },1000)

    }
}