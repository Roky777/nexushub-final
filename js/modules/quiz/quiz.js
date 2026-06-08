
// QUIZ DATA


const quizData = [
  {
    question: "Which method adds one or more elements to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: "push()"
  },
  {
    question: "Which method removes the last element from an array?",
    options: ["push()", "splice()", "pop()", "slice()"],
    answer: "pop()"
  },
  {
    question: "Which keyword creates a block scoped variable?",
    options: ["var", "let", "const", "Both let and const"],
    answer: "Both let and const"
  },
  {
    question: "Which method selects the first matching CSS selector?",
    options: [
      "getElementById()",
      "querySelector()",
      "querySelectorAll()",
      "innerHTML"
    ],
    answer: "querySelector()"
  },
  {
    question: "Which array method returns a new filtered array?",
    options: ["forEach()", "filter()", "reduce()", "find()"],
    answer: "filter()"
  },
  {
    question: "Where is browser data stored permanently?",
    options: [
      "Session Storage",
      "Local Storage",
      "Cookies",
      "Variables"
    ],
    answer: "Local Storage"
  },
  {
    question: "Which event occurs when a button is pressed?",
    options: ["mouseover", "keydown", "click", "submit"],
    answer: "click"
  },
  {
    question: "What does JSON.stringify() do?",
    options: [
      "Converts JSON to Object",
      "Converts Object to JSON String",
      "Deletes JSON",
      "Formats HTML"
    ],
    answer: "Converts Object to JSON String"
  },
  {
    question: "Which loop is commonly used to iterate arrays?",
    options: ["for...of", "for...in", "while", "do while"],
    answer: "for...of"
  },
  {
    question: "Which method converts JSON string to JavaScript object?",
    options: [
      "JSON.parse()",
      "JSON.stringify()",
      "Object.assign()",
      "Object.create()"
    ],
    answer: "JSON.parse()"
  }
];


// VARIABLES


let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

let timer = 0;
let intervalId;

// =========================
// DOM ELEMENTS


const questionNumber =
  document.getElementById("question-number");

const questionText =
  document.getElementById("question-text");

const optionsContainer =
  document.getElementById("options-container");

const nextBtn =
  document.getElementById("next-btn");

const scoreElement =
  document.getElementById("score");

const progressCount =
  document.getElementById("progress-count");

const progressFill =
  document.getElementById("progress-fill");

const correctCount =
  document.getElementById("correct-count");

const wrongCount =
  document.getElementById("wrong-count");

const remainingCount =
  document.getElementById("remaining-count");

const percentage =
  document.getElementById("percentage");

const timerElement =
  document.getElementById("timer");

const recentAnswers =
  document.getElementById("recent-answers");


// LOAD QUESTION


function loadQuestion() {

  const question = quizData[currentQuestion];

  questionNumber.textContent =
    `Question ${currentQuestion + 1} of ${quizData.length}`;

  questionText.textContent =
    question.question;

  progressCount.textContent =
    `${currentQuestion + 1} / ${quizData.length}`;

  progressFill.style.width =
    `${((currentQuestion + 1) / quizData.length) * 100}%`;

  optionsContainer.innerHTML = "";

  selectedAnswer = null;

  question.options.forEach((option, index) => {

    const optionDiv =
      document.createElement("div");

    optionDiv.classList.add("option");

    optionDiv.textContent =
      `${String.fromCharCode(65 + index)}. ${option}`;

    optionDiv.addEventListener("click", () => {

      document
        .querySelectorAll(".option")
        .forEach(opt =>
          opt.classList.remove("selected")
        );

      optionDiv.classList.add("selected");

      selectedAnswer = option;
    });

    optionsContainer.appendChild(optionDiv);
  });

  updateSummary();
}


// UPDATE SUMMARY


function updateSummary() {

  scoreElement.textContent = score;

  const correct = score / 10;

  correctCount.textContent = correct;

  wrongCount.textContent =
    currentQuestion - correct;

  remainingCount.textContent =
    quizData.length - currentQuestion;

  percentage.textContent =
    `${Math.round(
      (score / (quizData.length * 10)) * 100
    )}%`;
}


// NEXT QUESTION


nextBtn.addEventListener("click", () => {

  if (!selectedAnswer) {

    alert("Please select an answer");

    return;
  }

  const current =
    quizData[currentQuestion];

  const answerStatus =
    selectedAnswer === current.answer;

  if (answerStatus) {
    score += 10;
  }

  const answerDiv =
    document.createElement("div");

  answerDiv.classList.add("answer-item");

  answerDiv.innerHTML = `
      <span>Q${currentQuestion + 1}</span>
      <span style="color:${
        answerStatus ? "green" : "red"
      }">
        ${answerStatus ? "Correct" : "Wrong"}
      </span>
  `;

  recentAnswers.appendChild(answerDiv);

  currentQuestion++;

  if (currentQuestion < quizData.length) {

    loadQuestion();

  } else {

    showResult();

  }

});


// TIMER


function startTimer() {

  intervalId = setInterval(() => {

    timer++;

    const minutes =
      String(Math.floor(timer / 60))
      .padStart(2, "0");

    const seconds =
      String(timer % 60)
      .padStart(2, "0");

    timerElement.textContent =
      `${minutes}:${seconds}`;

  }, 1000);

}


// RESULT SCREEN


function showResult() {

  clearInterval(intervalId);

  const totalPercentage =
    Math.round(
      (score / (quizData.length * 10)) * 100
    );

  document.querySelector(".quiz-card")
    .innerHTML = `
    
      <h2>Quiz Completed 🎉</h2>

      <br>

      <h3>Final Score : ${score}</h3>

      <br>

      <h3>${totalPercentage}%</h3>

      <br>

      <button id="restart-btn">
        Restart Quiz
      </button>

  `;

  document
    .getElementById("restart-btn")
    .addEventListener("click", () => {

      location.reload();

    });

}


// START QUIZ


loadQuestion();
startTimer();
