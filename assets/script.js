$("body").ready(()=>{
    showMain();
});

let Timer;
let myTimer;
function startTimer(){
    Timer = 50;
    $('.header-timer').addClass('show');
    showTimer();
    if (myTimer) clearInterval(myTimer);
    myTimer = setInterval(()=>{
        Timer--;
        showTimer();
        if(Timer <= 0) showScore();
    }, 1000);
}
function endTimer(){
    // hidden timer
    $('.header-timer').removeClass('show');
    clearInterval(myTimer);
}
function subtractTimer(){
    Timer -= 10;
    showTimer();
}
function showTimer(){
    $('#timer').text(Timer);
}
function showQuestion(idx, res){
    if(!idx){
        startTimer();
        resetScore();
    }
    if(questions.length <= idx){
        showScore();
    }
    if(questions[idx]){
        // get question information
        const { questionText, options, answer } = questions[idx];

        // get question template
        let $template = $($("#template").html());

        // set question title
        $(".question-border-header", $template).text(questionText);

        // get option DOM part from template
        let $option = $(".question-border-option", $template).remove();

        // check result of last question
        if(res !== undefined){
            $('.question-border-result', $template).addClass('show').text(res ? 'Correct!' : 'Incorrect!');
        }

        // set text into option DOM
        options.forEach((opt, i)=>{
            let $_optTemplate = $option.clone();
            $_optTemplate.text(opt);
            $_optTemplate.bind('click', (e)=>{
                // open next question and pass the result 
                if(opt === answer){
                    addScore();
                    showQuestion(idx+1, true);
                }else{
                    subtractTimer();
                    showQuestion(idx+1, false);
                }
            });
            $(".question-border-options", $template).append($_optTemplate);
        })
        
        // parse template into page
        $(".body-main").html($template);
    }
}

function showScore(){

    endTimer();
    // get score
    let score = storeGet('guest_score');

    // get question template
    let $template = $($("#score").html());

    // set question title
    $("#score", $template).text(score);

    // set button action
    $(".score-border-button", $template).bind('click', ()=>{
        let high_score = JSON.parse(storeGet('high_score'));
        if(high_score === null) high_score = {};
        let initials = $("#initials").val();
        // store score if higher than previous
        if(!high_score[initials] || score > high_score[initials]){
            high_score[initials] = score;
            storeSet('high_score', JSON.stringify(high_score));
        }
        showHighScore();
    });

    // parse template into page
    $(".body-main").html($template);
}

function showHighScore(){

    // get score list
    let high_score = JSON.parse(storeGet('high_score'));

    // get HighScore template
    let $template = $($("#highscore").html());

    // get row template
    let row = $(".highscore-border-text-line", $template).remove();

    let sorted = Object.keys(high_score||{});

    // sort the score or initials if score is same
    sorted = sorted?.sort((a,b)=>(high_score[b]-high_score[a])||(a>b?1:-1));

    $(".highscore-border-text", $template).append(sorted?.map((initials, idx)=>{
        const score = parseInt(high_score[initials]);
        let _row = row.clone();
        _row.text((idx+1) + ". " + initials + " - " + score);
        return _row;
    }));

    // parse template into page
    $(".body-main").html($template);
}

function clearHighScore(){
    // get score list
    let highScore = JSON.parse(storeGet('high_score'));

    // initial high score
    storeSet('high_score', "{}")

    // reload score list
    showHighScore()
}

function showMain(){
    // get main template
    let $template = $($("#main").html());

    // parse template into page
    $(".body-main").html($template);
}

function storeSet(name, val){
    return window.localStorage.setItem(name, val);
}
function storeGet(name){
    return window.localStorage.getItem(name);
}
function addScore(){
    storeSet('guest_score', parseInt(storeGet('guest_score')) + 1);
}
function resetScore(){
    storeSet('guest_score', 0);
}

const questions = [
  {
    questionText: "Commonly used data types DO NOT include:",
    options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
    answer: "3. alerts",
  },
  {
    questionText: "Arrays in JavaScript can be used to store ______.",
    options: [
      "1. numbers and strings",
      "2. other arrays",
      "3. booleans",
      "4. all of the above",
    ],
    answer: "4. all of the above",
  },
  {
    questionText:
      "String values must be enclosed within _____ when being assigned to variables.",
    options: ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
    answer: "3. quotes",
  },
  {
    questionText:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: [
      "1. JavaScript",
      "2. terminal/bash",
      "3. for loops",
      "4. console.log",
    ],
    answer: "4. console.log",
  },
  {
    questionText:
      "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
    options: ["1. break", "2. stop", "3. halt", "4. exit"],
    answer: "1. break",
  },
];
