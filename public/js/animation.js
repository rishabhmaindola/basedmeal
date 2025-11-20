function runAnimations() {
    gsap.to("#splashLogo", {
        opacity: 1,
        scale: 1.2,
        duration: 1.5,
        ease: "power2.out"
    });

    gsap.to("#splashScreen", {
        opacity: 0,
        duration: 1,
        delay: 2,
        ease: "power2.out",
        onComplete: () => {
            document.getElementById("splashScreen").style.display = "none";
        }
    });

    gsap.from('#headline', {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power2.out'
    });

    gsap.from('#subhead', {
        opacity: 0,
        y: -20,
        duration: 1,
        delay: 0.3,
        ease: 'power2.out'
    });

    gsap.from('#optinForm', {
        opacity: 0,
        scale: 0.95,
        duration: 1,
        delay: 0.6,
        ease: 'power2.out'
    });
}

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const splash = document.getElementById("splashScreen");
        splash.style.display = "block";
        splash.style.opacity = "1";
        document.getElementById("splashLogo").style.opacity = "0";
        document.getElementById("splashLogo").style.transform = "scale(1)";
    }
    runAnimations();
});


document.addEventListener('DOMContentLoaded', function () {
    const swapArrow = document.getElementById('swapArrow');

    const arrowTimeline = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    arrowTimeline
        .to(swapArrow, {
            y: -15,
            duration: 1,
            ease: "sine.inOut"
        })
        .to(swapArrow, {
            y: 0,
            duration: 1,
            ease: "sine.inOut"
        })
        .to(swapArrow, {
            rotation: 360,
            duration: 1,
            ease: "power2.inOut"
        })
        .to(swapArrow, {
            scale: 1.1,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });

    // Click animation
    swapArrow.addEventListener('click', function () {
        gsap.to(this, {
            scale: 0.8,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });

        // Add a glow effect on click
        gsap.to(this, {
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
            duration: 0.3,
            yoyo: true,
            ease: "power2.inOut"
        });
    });
});