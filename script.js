//JS for DNS Quiz

// Get the HTML elements we need
const quizForm = document.getElementById("dns-quiz");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const submitButton = document.getElementById("submit-button");
const resetButton = document.getElementById("reset-button");
const statusMessage = document.getElementById("quiz-status");

const resultsSection = document.getElementById("quiz-results");
const scoreSummary = document.getElementById("score-summary");
const answerReview = document.getElementById("answer-review");

// Quiz settings
const totalTime = 600; // 10 minutes in seconds
const passingScore = 7;
const totalQuestions = 10;

// Timer variables
let timeRemaining = totalTime;
let timerInterval = null;
let quizStarted = false;
let quizFinished = false;

const answers = {
    q1: {
        answer: "domain name system",
        display: "Domain Name System",
        explanation: "DNS stands for Domain Name System."
    },
    q2: {
        answer: "top-level domain",
        display: "Top-Level Domain (TLD)",
        explanation: "The TLD is the final part of a domain name, such as .com or .edu."
    },
    q3: {
        answer: "B",
        display: "To provide a human-readable name for an Internet resource",
        explanation: "Domain names provide names that are easier for people to remember."
    },
    q4: {
        answer: "B",
        display: "Receives DNS requests and searches for the requested information",
        explanation: "A recursive resolver receives DNS requests and searches for the requested information."
    },
    q5: {
        answer: "C",
        display: "Official DNS information and records for a domain",
        explanation: "An authoritative DNS server stores the official DNS information for a domain."
    },
    q6: {
        answer: ["A", "AAAA", "CNAME", "MX"],
        display: "A, AAAA, CNAME, and MX",
        explanation: "These are DNS record types. HTML is not a DNS record type."
    },
    q7: {
        answer: "B",
        display: "Identifies the mail servers responsible for receiving email",
        explanation: "An MX record identifies the mail servers responsible for receiving email for a domain."
    },
    q8: {
        answer: "True",
        display: "True",
        explanation: "DNS caching temporarily stores DNS information to reduce repeated lookups."
    },
    q9: {
        answer: "B",
        display: "Time to Live",
        explanation: "TTL determines how long DNS information can remain in a cache."
    },
    q10: {
        answer: "True",
        display: "True",
        explanation: "DNS translates domain names into IP addresses."
    }
};

// Start the quiz and countdown
startButton.addEventListener("click", function () {
    if (quizStarted || quizFinished) {
        return;
    }

    quizStarted = true;

    // Enable all quiz questions
    const inputs = quizForm.querySelectorAll("input");
    inputs.forEach(function (input) {
        input.disabled = false;
    });

    submitButton.disabled = false;
    startButton.disabled = true;

    statusMessage.textContent = "Quiz in progress. Good luck!";

    // Start the countdown
    updateTimer();

    timerInterval = setInterval(function () {
        timeRemaining--;
        updateTimer();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitQuiz(true);
        }
    }, 1000);
});

// Display the countdown timer
function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

// Get the selected answer for a question
function getSelectedAnswer(questionName) {
    const selected = quizForm.querySelectorAll(
        'input[name="' + questionName + '"]:checked'
    );

    return Array.from(selected).map(function (input) {
        return input.value;
    });
}

// Get the visible text of the selected choice
function getSelectedText(questionName) {
    const selected = quizForm.querySelectorAll(
        'input[name="' + questionName + '"]:checked'
    );

    return Array.from(selected).map(function (input) {
        return input.parentElement.textContent.trim();
    });
}

// Check whether an answer is correct
function checkAnswer(questionName) {
    const correctAnswer = answers[questionName].answer;
    const userAnswer = getSelectedAnswer(questionName);

    if (questionName === "q1" || questionName === "q2") {
        const typedAnswer = document.getElementById(questionName).value
            .trim()
            .toLowerCase();

        return typedAnswer === correctAnswer;
    }

    if (questionName === "q6") {
        if (userAnswer.length !== correctAnswer.length) {
            return false;
        }

        return correctAnswer.every(function (answer) {
            return userAnswer.includes(answer);
        });
    }

    return userAnswer.length === 1 &&
        userAnswer[0] === correctAnswer;
}

// Submit and grade the quiz
quizForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!quizStarted || quizFinished) {
        return;
    }

    submitQuiz(false);
});

function submitQuiz(timeExpired) {
    if (quizFinished) {
        return;
    }

    quizFinished = true;
    clearInterval(timerInterval);

    // Calculate time spent
    const timeSpent = totalTime - timeRemaining;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;

    const formattedTime =
        minutes + " minute(s) and " + seconds + " second(s)";

    let score = 0;
    let reviewHTML = "";

    // Check all 10 questions
    for (let i = 1; i <= totalQuestions; i++) {
        const questionName = "q" + i;
        const correct = checkAnswer(questionName);

        if (correct) {
            score++;
        }

        let userAnswer;

        if (questionName === "q1" || questionName === "q2") {
            userAnswer =
                document.getElementById(questionName).value.trim() ||
                "No answer provided";
        } else {
            const selectedText = getSelectedText(questionName);
            userAnswer = selectedText.length > 0
                ? selectedText.join(", ")
                : "No answer selected";
        }

        reviewHTML += `
            <div class="answer-result ${correct ? "correct-answer" : "incorrect-answer"}">
                <h3>Question ${i}: ${correct ? "Correct" : "Incorrect"}</h3>
                <p><strong>Your answer:</strong> ${escapeHTML(userAnswer)}</p>
                <p><strong>Correct answer:</strong> ${answers[questionName].display}</p>
                <p>${answers[questionName].explanation}</p>
            </div>
        `;
    }

    const passed = score >= passingScore;

    // Display overall results
    scoreSummary.innerHTML = `
        <div class="score-card ${passed ? "passed" : "failed"}">
            <h3>${passed ? "Congratulations! You Passed!" : "You Did Not Pass"}</h3>
            <p><strong>Score:</strong> ${score} / ${totalQuestions}</p>
            <p><strong>Result:</strong> ${passed ? "PASS" : "FAIL"}</p>
            <p><strong>Time spent:</strong> ${formattedTime}</p>
            ${timeExpired ? "<p><strong>Time limit reached.</strong></p>" : ""}
        </div>
    `;

    answerReview.innerHTML = `
        <h2>Review Your Answers</h2>
        ${reviewHTML}
    `;

    // Show results and lock the quiz
    resultsSection.hidden = false;

    quizForm.querySelectorAll("input").forEach(function (input) {
        input.disabled = true;
    });

    submitButton.disabled = true;
    startButton.disabled = true;

    statusMessage.textContent = "Quiz completed.";

    resultsSection.scrollIntoView({ behavior: "smooth" });
}

// Prevent user-entered text from being interpreted as HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return replacements[character];
    });
}

// Reset the quiz and timer
resetButton.addEventListener("click", function () {
    clearInterval(timerInterval);

    quizForm.reset();

    quizStarted = false;
    quizFinished = false;
    timeRemaining = totalTime;

    updateTimer();

    // Disable questions until the quiz starts again
    quizForm.querySelectorAll("input").forEach(function (input) {
        input.disabled = true;
    });

    submitButton.disabled = true;
    startButton.disabled = false;

    resultsSection.hidden = true;
    scoreSummary.innerHTML = "";
    answerReview.innerHTML = "";

    statusMessage.textContent = "Select Start Quiz when you are ready.";
});