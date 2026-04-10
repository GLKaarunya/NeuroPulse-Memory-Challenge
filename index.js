var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var level = 0;
var started = false;

var playerName = "";

function formatName(name) {
    return name
        .toLowerCase()
        .split(" ")
        .map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}

function startGame() {

    var inputName = $("#player-name").val().trim();

    if (inputName === "") {
        alert("Enter your name!");
        return;
    }

    playerName = formatName(inputName);

    $("#start-screen").addClass("hidden");
    $("#game-screen").removeClass("hidden");

    started = true;
    gameSequence();
}

$("#start-btn").click(startGame);

$("#player-name").keypress(function (e) {
    if (e.which === 13) startGame();
});

function playSound(name) {
    new Audio("assets/sounds/" + name + ".mp3").play();
}

function flashButton(color) {
    $("#" + color).fadeOut(100).fadeIn(100);
}

function animatePress(color) {
    $("#" + color).addClass("pressed");

    setTimeout(function () {
        $("#" + color).removeClass("pressed");
    }, 100);
}

function gameSequence() {

    userClickedPattern = [];

    level++;

    $("#level-title").text(playerName + " - Level " + level);
    $("#score").text("Score: " + level);

    var randomColour = buttonColours[Math.floor(Math.random() * 4)];
    gamePattern.push(randomColour);

    flashButton(randomColour);
    playSound(randomColour);
}

$(".btn").click(function () {

    if (!started) return;

    var colour = $(this).attr("id");

    userClickedPattern.push(colour);

    playSound(colour);
    animatePress(colour);

    checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel) {

    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {

        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function () {
                gameSequence();
            }, 1000);
        }

    } else {

        playSound("wrong");

        updateLeaderboard(playerName, level);

        showGameOver();
    }
}

function showGameOver() {

    $("#game-screen").addClass("hidden");
    $("#gameover-screen").removeClass("hidden");

    $("#final-score").text(playerName + "'s Score: " + level);

    displayLeaderboard();

    startOver();
}

function startOver() {
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    started = false;
}

$("#restart-btn").click(function () {
    $("#gameover-screen").addClass("hidden");
    $("#start-screen").removeClass("hidden");
});

function updateLeaderboard(name, score) {

    let data = JSON.parse(localStorage.getItem("leaderboard")) || [];

    data.push({ name: name, score: score });

    data.sort(function (a, b) {
        return b.score - a.score;
    });

    data = data.slice(0, 5);

    localStorage.setItem("leaderboard", JSON.stringify(data));
}

function displayLeaderboard() {

    let data = JSON.parse(localStorage.getItem("leaderboard")) || [];

    $("#leaderboard").empty();

    data.forEach(function (entry, index) {

        let medal = "";
        if (index === 0) medal = "🥇 ";
        else if (index === 1) medal = "🥈 ";
        else if (index === 2) medal = "🥉 ";

        $("#leaderboard").append(
            "<li>" + medal + (index + 1) + ". " + entry.name + " — " + entry.score + "</li>"
        );
    });
}

displayLeaderboard();