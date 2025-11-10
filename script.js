document.addEventListener("DOMContentLoaded", () => {
  initScrollAnimations()
  initGalleryLightbox()
  initCounterAnimation()
  initFormSubmission()
  initSmoothScroll()
  initNavbarScroll()
  initChatbot()
  handleBodyPadding()
})

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

function initNavbarScroll() {
  const navLinks = document.querySelectorAll(".nav-link")

  window.addEventListener("scroll", () => {
    let current = ""

    document.querySelectorAll("section").forEach((section) => {
      const sectionTop = section.offsetTop
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active")
      }
    })
  })
}

function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll(".gallery-item")
  const lightbox = document.getElementById("lightboxModal")
  const lightboxImage = document.querySelector(".lightbox-image")
  const closeBtn = document.querySelector(".lightbox-close")
  const prevBtn = document.querySelector(".lightbox-prev")
  const nextBtn = document.querySelector(".lightbox-next")

  let currentIndex = 0
  const images = Array.from(galleryItems).map((item) => item.getAttribute("data-image"))

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      currentIndex = index
      showLightbox()
    })
  })

  function showLightbox() {
    lightboxImage.src = images[currentIndex]
    lightbox.classList.add("active")
  }

  function hideLightbox() {
    lightbox.classList.remove("active")
  }

  closeBtn.addEventListener("click", hideLightbox)

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length
    showLightbox()
  })

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length
    showLightbox()
  })

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      hideLightbox()
    }
  })

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return
    if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + images.length) % images.length
      showLightbox()
    } else if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % images.length
      showLightbox()
    } else if (e.key === "Escape") {
      hideLightbox()
    }
  })
}

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "slideUp 0.8s ease-out forwards"
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  document
    .querySelectorAll(".program-card, .impact-stat-card, .about-image-wrapper, .contact-form, .contact-info-card")
    .forEach((el) => {
      el.style.opacity = "0"
      observer.observe(el)
    })
}

function initCounterAnimation() {
  const counters = document.querySelectorAll(".counter")

  const observerOptions = {
    threshold: 0.5,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target
        const target = Number.parseInt(counter.getAttribute("data-target"))

        if (!counter.classList.contains("counted")) {
          animateCounter(counter, target)
          counter.classList.add("counted")
        }
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => observer.observe(counter))
}

function animateCounter(element, target) {
  let current = 0
  const increment = target / 30
  const duration = 1500

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      element.textContent = target + "+"
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(current) + "+"
    }
  }, duration / 30)
}

function initFormSubmission() {
  const form = document.getElementById("contactForm")

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault()

      const data = {
        name: this.querySelector('input[type="text"]').value,
        email: this.querySelector('input[type="email"]').value,
        phone: this.querySelector('input[type="tel"]').value,
        subject: this.querySelectorAll('input[type="text"]')[1].value,
        message: this.querySelector("textarea").value,
      }

      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
      submitBtn.disabled = true

      setTimeout(() => {
        showNotification("Thank you! We will respond to your message soon.", "success")
        this.reset()
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }, 1500)
    })
  }
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `alert alert-${type === "success" ? "success" : "danger"} position-fixed`
  notification.style.cssText = `
        top: 120px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideUp 0.5s ease-out;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `

  const backgroundColor = type === "success" ? "#1d7a4e" : "#dc3545"
  notification.style.backgroundColor = backgroundColor
  notification.style.color = "#ffffff"
  notification.style.border = "none"

  notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
            <span>${message}</span>
        </div>
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "fadeOut 0.5s ease-out forwards"
    setTimeout(() => notification.remove(), 500)
  }, 4000)
}

function initChatbot() {
  const chatbotMessages = [
    "I'd love to help! What would you like to know?",
    "We offer programs in education, skills training, and community support.",
    "You can donate to support our mission directly through this page!",
    "Feel free to contact us or fill out the contact form above.",
    "Thank you for your interest in OGEN! Is there anything else?",
  ]

  window.chatbotResponses = chatbotMessages
}

function toggleChatbot() {
  const chatbotWindow = document.getElementById("chatbotWindow")
  chatbotWindow.classList.toggle("active")
}

function sendChatMessage() {
  const input = document.getElementById("chatbotInput")
  const messagesContainer = document.getElementById("chatbotMessages")
  const message = input.value.trim()

  if (message === "") return

  // Add user message
  const userMsg = document.createElement("div")
  userMsg.className = "user-message"
  userMsg.innerHTML = `<p>${escapeHtml(message)}</p>`
  messagesContainer.appendChild(userMsg)

  input.value = ""
  messagesContainer.scrollTop = messagesContainer.scrollHeight

  // Simulate bot response
  setTimeout(() => {
    const responses = window.chatbotResponses
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    const botMsg = document.createElement("div")
    botMsg.className = "bot-message"
    botMsg.innerHTML = `<p>${randomResponse}</p>`
    messagesContainer.appendChild(botMsg)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }, 500)
}

function handleChatInput(event) {
  if (event.key === "Enter") {
    sendChatMessage()
  }
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

function handleBodyPadding() {
  const adjustPadding = () => {
    const contactBar = document.querySelector(".top-contact-bar")
    const navbar = document.querySelector(".navbar-custom")
    if (window.innerWidth <= 576) {
      document.body.style.paddingTop = "4rem"
    } else {
      document.body.style.paddingTop = "5rem"
    }
  }

  adjustPadding()
  window.addEventListener("resize", adjustPadding)
}

const style = document.createElement("style")
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
`
document.head.appendChild(style)

console.log("[v0] Website initialization complete")
