
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


