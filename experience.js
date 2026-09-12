document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       PARTICLE EXPERIENCE
    ========================================= */

    const intro = document.getElementById("particle-intro")
    const canvas = document.getElementById("particleCanvas")
    const hint = document.getElementById("particleHint")

    if (!intro || !canvas) return

    const ctx = canvas.getContext("2d")

    let width = 0
    let height = 0
    let dpr = 1

    let particles = []
    let targetParticles = []

    let particleState = "smoke"
    let clickLocked = false
    let particleText = ""

    const PARTICLE_COUNT = 900

    function resizeCanvas() {

        dpr = Math.min(window.devicePixelRatio || 1, 2)

        width = window.innerWidth
        height = window.innerHeight

        canvas.width = width * dpr
        canvas.height = height * dpr

        canvas.style.width = width + "px"
        canvas.style.height = height + "px"

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        if (particleState === "heart") {
            createHeartTargets()
        }

        if (particleState === "text") {
            createTextTargets(particleText)
        }
    }

    window.addEventListener("resize", resizeCanvas)


    function random(min, max) {
        return Math.random() * (max - min) + min
    }


    function createParticle() {

        return {
            x: random(0, width),
            y: random(height * .82, height + 40),

            vx: random(-.45, .45),
            vy: random(-1.8, -.35),

            size: random(.7, 2.2),
            alpha: random(.25, .85),

            drift: random(.0015, .006),
            phase: random(0, Math.PI * 2),

            tx: 0,
            ty: 0,

            color: Math.random() > .5
                ? "255,220,238"
                : "255,255,255"
        }
    }


    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle())
    }


    function heartPoint(t, scale) {

        const x = 16 * Math.pow(Math.sin(t), 3)
        const y =
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t)

        return {
            x: width / 2 + x * scale,
            y: height / 2 - y * scale
        }
    }


    function createHeartTargets() {

        targetParticles = []

        const scale = Math.min(width, height) / 42

        for (let i = 0; i < particles.length; i++) {

            const t = (i / particles.length) * Math.PI * 2
            const point = heartPoint(t, scale)

            const thickness = random(.75, 1.15)

            targetParticles.push({
                x: width / 2 + (point.x - width / 2) * thickness,
                y: height / 2 + (point.y - height / 2) * thickness
            })
        }

        particles.forEach((p, i) => {
            p.tx = targetParticles[i].x
            p.ty = targetParticles[i].y
        })
    }


    function createTextTargets(text) {

        targetParticles = []

        const offscreen = document.createElement("canvas")
        const offCtx = offscreen.getContext("2d")

        offscreen.width = width
        offscreen.height = height

        const fontSize = Math.min(
            width * .18,
            height * .18,
            145
        )

        offCtx.font = `600 ${fontSize}px Georgia`
        offCtx.textAlign = "center"
        offCtx.textBaseline = "middle"

        offCtx.fillStyle = "#fff"
        offCtx.fillText(text, width / 2, height / 2)

        const image = offCtx.getImageData(
            0,
            0,
            width,
            height
        )

        const points = []

        const step = Math.max(3, Math.floor(width / 180))

        for (let y = 0; y < height; y += step) {

            for (let x = 0; x < width; x += step) {

                const index = (y * width + x) * 4

                if (image.data[index + 3] > 80) {
                    points.push({
                        x,
                        y
                    })
                }
            }
        }

        for (let i = 0; i < particles.length; i++) {

            if (points.length) {

                const point = points[i % points.length]

                particles[i].tx = point.x + random(-1.5, 1.5)
                particles[i].ty = point.y + random(-1.5, 1.5)

            }
        }
    }


    function scatterParticles() {

        particles.forEach(p => {

            const angle = Math.random() * Math.PI * 2
            const force = random(3, 10)

            p.vx += Math.cos(angle) * force
            p.vy += Math.sin(angle) * force

        })
    }


    function updateParticles(time) {

        particles.forEach((p, i) => {

            if (particleState === "smoke") {

                p.x += p.vx + Math.sin(time * p.drift + p.phase) * .45
                p.y += p.vy

                p.vx *= .998
                p.vy *= .999

                if (p.y < -30) {
                    p.x = random(0, width)
                    p.y = height + random(0, 50)
                    p.vx = random(-.45, .45)
                    p.vy = random(-1.8, -.35)
                }

                if (p.x < -30) p.x = width + 20
                if (p.x > width + 30) p.x = -20

            } else {

                const dx = p.tx - p.x
                const dy = p.ty - p.y

                p.vx += dx * .012
                p.vy += dy * .012

                p.vx *= .88
                p.vy *= .88

                p.x += p.vx
                p.y += p.vy
            }

            if (
                particleState === "scatter" ||
                Math.abs(p.vx) > 8 ||
                Math.abs(p.vy) > 8
            ) {

                p.vx *= .985
                p.vy *= .985

                p.x += p.vx
                p.y += p.vy
            }

        })
    }


    function drawParticles() {

        ctx.clearRect(0, 0, width, height)

        particles.forEach(p => {

            ctx.beginPath()

            ctx.fillStyle =
                `rgba(${p.color},${p.alpha})`

            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI * 2
            )

            ctx.fill()
        })
    }


    let startTime = performance.now()

    function animate(time) {

        updateParticles(time)

        drawParticles()

        requestAnimationFrame(animate)
    }


    function setHeart() {

        particleState = "heart"

        createHeartTargets()

        hint.classList.add("show")
    }


    function setText(text) {

        particleState = "text"
        particleText = text

        createTextTargets(text)

        hint.classList.add("show")
    }


    function revealWebsite() {

        particleState = "scatter"

        scatterParticles()

        hint.classList.remove("show")

        setTimeout(() => {

            intro.classList.add("hidden")

            const existingIntro =
                document.getElementById("intro-screen")

            if (existingIntro) {
                existingIntro.style.display = ""
            }

        }, 1200)

    }


    intro.addEventListener("click", () => {

        if (clickLocked) return

        clickLocked = true

        if (particleState === "smoke") {

            setHeart()

            setTimeout(() => {
                clickLocked = false
            }, 1200)

            return
        }


        if (particleState === "heart") {

            scatterParticles()

            setTimeout(() => {
                setText("Patricia")
            }, 500)

            setTimeout(() => {
                clickLocked = false
            }, 1400)

            return
        }


        if (
            particleState === "text" &&
            particleText === "Patricia"
        ) {

            scatterParticles()

            setTimeout(() => {
                setText("Je t'aime Sauveur Patricia")
            }, 500)

            setTimeout(() => {
                clickLocked = false
            }, 1500)

            return
        }


        if (
            particleState === "text" &&
            particleText === "Je t'aime Sauveur Patricia"
        ) {

            revealWebsite()

            setTimeout(() => {
                clickLocked = false
            }, 1500)
        }

    })


    resizeCanvas()

    requestAnimationFrame(animate)


    /* =========================================
       MEMORY BOOK
    ========================================= */

    const memoryBook =
        document.getElementById("memory-book")

    const memoryPhoto =
        document.getElementById("memoryPhoto")

    const memoryNumber =
        document.getElementById("memoryNumber")

    const souvenirPanel =
        document.getElementById("souvenirPanel")


    if (!memoryBook || !memoryPhoto || !souvenirPanel) {
        return
    }


    /*
       METE FOTO YO NAN DOSYE

       assets/photos/photo01.jpg
       assets/photos/photo02.jpg
       ...
       assets/photos/photo42.jpg
    */

    const photos = []

    for (let i = 1; i <= 42; i++) {

        const number =
            String(i).padStart(2, "0")

        photos.push(
            `assets/photos/photo${number}.jpg`
        )
    }


    let currentPhoto = 0
    let photoTimer = null

    let photoStart = 0
    let remainingTime = 7000

    let photoPaused = false
    let bookStarted = false


    function showBook() {

        if (bookStarted) return

        bookStarted = true

        memoryBook.classList.add("show")

    }


    function loadPhoto(index) {

        if (index >= photos.length) {
            currentPhoto = 0
            index = 0
        }

        currentPhoto = index

        clearTimeout(photoTimer)

        memoryPhoto.classList.remove(
            "memory-enter",
            "memory-leave"
        )

        memoryPhoto.src = photos[index]

        memoryNumber.textContent = index + 1

        requestAnimationFrame(() => {

            memoryPhoto.classList.add("memory-enter")

            photoStart = performance.now()
            remainingTime = 7000

            photoPaused = false

            photoTimer = setTimeout(
                nextPhoto,
                remainingTime
            )
        })
    }


    function nextPhoto() {

        if (photoPaused) return

        memoryPhoto.classList.remove(
            "memory-enter"
        )

        memoryPhoto.classList.add(
            "memory-leave"
        )

        setTimeout(() => {

            currentPhoto++

            if (currentPhoto >= photos.length) {
                currentPhoto = 0
            }

            loadPhoto(currentPhoto)

        }, 1050)
    }


    function pausePhoto() {

        if (photoPaused) return

        photoPaused = true

        clearTimeout(photoTimer)

        const elapsed =
            performance.now() - photoStart

        remainingTime =
            Math.max(0, remainingTime - elapsed)
    }


    function resumePhoto() {

        if (!photoPaused) return

        photoPaused = false

        photoStart = performance.now()

        photoTimer = setTimeout(
            nextPhoto,
            remainingTime
        )
    }


    function startMemoryExperience() {

        showBook()

        if (!memoryPhoto.src || memoryPhoto.src.endsWith("/")) {
            loadPhoto(0)
        }
    }


    souvenirPanel.addEventListener(
        "pointerdown",
        pausePhoto,
        { passive: true }
    )

    souvenirPanel.addEventListener(
        "pointerup",
        resumePhoto,
        { passive: true }
    )

    souvenirPanel.addEventListener(
        "pointercancel",
        resumePhoto,
        { passive: true }
    )

    souvenirPanel.addEventListener(
        "pointerleave",
        resumePhoto,
        { passive: true }
    )


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {
                        startMemoryExperience()
                    }

                })

            },
            {
                threshold: .35
            }
        )

    observer.observe(memoryBook)


    memoryPhoto.addEventListener(
        "error",
        () => {

            memoryPhoto.style.display = "none"

        }
    )

})