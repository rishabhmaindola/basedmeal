const words = ["stronger.", "healthier.", "happier."];
const el = document.getElementById("typewriter-text");
let currentWord = 0;
function typeWord(word) {
    return gsap.to({}, {
        duration: word.length * 0.08,
        onUpdate: function () {
            const progress = this.progress();
            const length = Math.floor(progress * word.length);
            el.textContent = word.substring(0, length);
        },
        onComplete: function () {
            gsap.delayedCall(1, deleteWord, [word]);
        }
    });
}

function deleteWord(word) {
    return gsap.to({}, {
        duration: word.length * 0.05,
        onUpdate: function () {
            const progress = this.progress();
            const length = Math.floor(word.length * (1 - progress));
            el.textContent = word.substring(0, length);
        },
        onComplete: function () {
            currentWord = (currentWord + 1) % words.length;
            gsap.delayedCall(0.5, typeWord, [words[currentWord]]);
        }
    });
}

typeWord(words[currentWord]);