const quizData = [
    {
        sNo:1,
        question:"What is the Capital of England?",
        options:["Berlin", "Munich", "Paris", "London"],
        ans:"London"
    },
    {
        sNo:2,
        question:"Which country is located in Europe?",
        options:["Mexico", "Egypt", "Myanmar", "Poland"],
        ans:"Poland"
    },
    {
        sNo:3,
        question:"What is the Currency of Germany?",
        options:["Euro", "Yen", "Rupee", "Dollar"],
        ans:"Euro"
    },
    {
        sNo:4,
        question:"What is the National Animal of India",
        options:["Elephant", "Tiger", "Monkey", "Lion"],
        ans:"Tiger"
    },
    {
        sNo:5,
        question:"Which Country won the ICC Cricket World Cup in 2023?",
        options:["Australia", "South Africa", "India", "New Zealand"],
        ans:"Australia"
    },

    
]

let userAnswers = new Array(5).fill(null);

const quizContainer = document.getElementById('question-container');
const submitBtn = document.getElementById('submit-btn');

const loadQuestions = () => {

    quizContainer.innerHTML = "";

    quizData.forEach((ques, index) => {
        const questionElement = document.createElement('div');

        questionElement.classList.add('question');

        questionElement.innerHTML = `
            <p>${index + 1}. ${ques.question}</p>
            <div class="options-container" id="options-container-${index}"></div>
        `;
        quizContainer.appendChild(questionElement);

        const optionsContainer = document.getElementById(`options-container-${index}`);
        ques.options.forEach((option, optionIndex) => {
            const optionElement = document.createElement('label');
            optionElement.innerHTML = `
          <input type="radio" name="question-${index}" value="${optionIndex}">
          ${option}
        `;
            optionsContainer.appendChild(optionElement);

            optionElement.addEventListener('change', () => {
                userAnswers[index] = optionIndex;
            });
        });
    });
}

function calculateScore() {
    let score = 0;
    let results = [];

    userAnswers.forEach((answer, index) => {
        const correctAnswerIndex = quizData[index].options.indexOf(quizData[index].ans);
        const correctAnswer = quizData[index].options[correctAnswerIndex];
        const userAnswer = quizData[index].options[answer];

        results.push({ 
            question: quizData[index].question,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            isCorrect: answer != null && answer === correctAnswerIndex
        });

        if (answer != null && answer === correctAnswerIndex) {
            score++;
        }
    });

    return { score: score, results: results };
}
submitBtn.addEventListener('click', () => {
    try {
        if (userAnswers.includes(null)) {
            throw new Error("Please answer all questions before submitting!");
        }

        const { score, results } = calculateScore();

        let resultMessage =` Your score: ${score}/5\n\n`;
        results.forEach((result, index) => {
            resultMessage += `Question ${index + 1}:\n`;
            resultMessage += `   Your answer: ${result.userAnswer}\n`;
            resultMessage += `   Correct answer: ${result.correctAnswer}\n`;
            resultMessage += `   Result: ${result.isCorrect ? 'Correct' : 'Wrong'}\n\n`;
        });

        alert(resultMessage);
    } catch (error) {
        alert(error.message);
    }
});
loadQuestions();
