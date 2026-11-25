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