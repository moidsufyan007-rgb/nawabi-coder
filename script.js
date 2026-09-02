// JavaScript file for DIOM AI Website interactive features

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // ---------------- HEADER / SCROLL BEHAVIOR ----------------
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  });

  // ---------------- MOBILE DRAWER MENU ----------------
  const menuBtn = document.getElementById("menu-btn");
  const closeMenuBtn = document.getElementById("close-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  const toggleMobileMenu = (open) => {
    if (open) {
      mobileMenu.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
    } else {
      mobileMenu.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }
  };

  menuBtn.addEventListener("click", () => toggleMobileMenu(true));
  closeMenuBtn.addEventListener("click", () => toggleMobileMenu(false));
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMobileMenu(false));
  });

  // ---------------- SCROLL REVEAL STAGGER OBSERVER ----------------
  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.15 // trigger when 15% visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // stop observing once animated
      }
    });
  }, observerOptions);

  // Observe items
  document.querySelectorAll(".reveal-fade-up, .stagger-reveal").forEach((el) => {
    revealObserver.observe(el);
  });

  // ---------------- CONTACT FORM SUBMISSION ----------------
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const formFeedback = document.getElementById("form-feedback");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Reset feedback and errors
    formFeedback.className = "p-4 rounded-[8px] text-sm hidden";
    formFeedback.textContent = "";
    document.querySelectorAll("[id^='error-']").forEach((el) => {
      el.classList.add("hidden");
      el.textContent = "";
    });

    // Form values
    const name = document.getElementById("name").value.trim();
    const businessName = document.getElementById("businessName").value.trim();
    const email = document.getElementById("email").value.trim();
    const industry = document.getElementById("industry").value;
    const phone = document.getElementById("phone").value.trim();
    const serviceInterest = document.getElementById("serviceInterest").value;
    const message = document.getElementById("message").value.trim();

    let hasErrors = false;

    // Validate fields
    if (!name) {
      showError("name", "Name is required");
      hasErrors = true;
    }
    if (!businessName) {
      showError("businessName", "Business name is required");
      hasErrors = true;
    }
    if (!email) {
      showError("email", "Email address is required");
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("email", "Provide a valid email address (e.g. rahul@gmail.com)");
      hasErrors = true;
    }
    if (!industry) {
      showError("industry", "Please select your industry");
      hasErrors = true;
    }
    if (!phone) {
      showError("phone", "WhatsApp number is required");
      hasErrors = true;
    } else if (!/^\+?[0-9\s\-()]{10,20}$/.test(phone)) {
      showError("phone", "Provide a valid phone number (e.g. +91 98480 22338)");
      hasErrors = true;
    }
    if (!serviceInterest) {
      showError("serviceInterest", "Please select a service interest");
      hasErrors = true;
    }
    if (!message) {
      showError("message", "Please provide a brief message");
      hasErrors = true;
    }

    if (hasErrors) return;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></span> Sending...`;

    try {
      const formData = new FormData(contactForm);
      formData.append("access_key", "711203df-ac8f-4e14-a6b1-67f22717974a");
      formData.append("subject", `New Strategy Call Request: ${businessName} (${name})`);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        formFeedback.classList.remove("hidden");
        formFeedback.classList.add("bg-emerald-500/10", "text-emerald-400", "border", "border-emerald-500/20");
        formFeedback.textContent = "Success! Your strategy call request has been received. We will get back to you shortly.";
        contactForm.reset();
      } else {
        formFeedback.classList.remove("hidden");
        formFeedback.classList.add("bg-red-500/10", "text-red-400", "border", "border-red-500/20");
        formFeedback.textContent = data.message || "An error occurred. Please check your inputs and try again.";
      }
    } catch (err) {
      console.error(err);
      formFeedback.classList.remove("hidden");
      formFeedback.classList.add("bg-red-500/10", "text-red-400", "border", "border-red-500/20");
      formFeedback.textContent = "Something went wrong. Please check your internet connection and try again.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i data-lucide="send" class="h-4 w-4 mr-2"></i> Book a 15-Minute Strategy Call`;
      // Re-initialize Lucide icon inside button
      lucide.createIcons();
    }
  });

  const showError = (fieldId, errorMsg) => {
    const errorEl = document.getElementById(`error-${fieldId}`);
    if (errorEl) {
      errorEl.classList.remove("hidden");
      errorEl.textContent = errorMsg;
    }
  };
});

// ---------------- PACKAGE SELECTOR GLOBAL FUNCTION ----------------
window.selectPackage = (packageName) => {
  const serviceDropdown = document.getElementById("serviceInterest");
  const messageArea = document.getElementById("message");
  const nameInput = document.getElementById("name");

  let interest = "Website";
  let msg = `Hi Nawabi Coder, I am interested in the ${packageName} Package for my business.`;

  if (packageName === "Growth") {
    interest = "All";
  } else if (packageName === "Pro") {
    interest = "All";
  }

  if (serviceDropdown) serviceDropdown.value = interest;
  if (messageArea) messageArea.value = msg;

  // Scroll to contact form
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: "smooth" });
  }

  // Focus on name input field
  setTimeout(() => {
    if (nameInput) nameInput.focus();
  }, 800);
};

// ---------------- NAWAB AI CHATBOT ENGINE ----------------
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("nawab-toggle-btn");
  const chatWindow = document.getElementById("nawab-chat-window");
  const closeBtn = document.getElementById("nawab-close-btn");
  const greetingBubble = document.getElementById("nawab-greeting-bubble");
  const closeGreetingBtn = document.getElementById("close-greeting-btn");
  const voiceBtn = document.getElementById("nawab-voice-btn");
  const voiceIcon = document.getElementById("voice-icon");
  const chatForm = document.getElementById("nawab-form");
  const chatInput = document.getElementById("nawab-input");
  const messagesContainer = document.getElementById("nawab-messages");
  const quickChips = document.querySelectorAll(".nawab-chip");

  if (!toggleBtn || !chatWindow) return;

  let voiceEnabled = false;

  // Toggle Chat Window
  toggleBtn.addEventListener("click", () => {
    const isHidden = chatWindow.classList.contains("hidden");
    if (isHidden) {
      chatWindow.classList.remove("hidden");
      if (greetingBubble) greetingBubble.classList.add("hidden");
      if (chatInput) chatInput.focus();
      scrollChatToBottom();
    } else {
      chatWindow.classList.add("hidden");
    }
  });

  // Close Chat Window
  closeBtn.addEventListener("click", () => {
    chatWindow.classList.add("hidden");
  });

  // Dismiss Greeting Bubble
  if (closeGreetingBtn && greetingBubble) {
    closeGreetingBtn.addEventListener("click", () => {
      greetingBubble.classList.add("hidden");
    });
  }

  // Voice Toggle
  if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
      voiceEnabled = !voiceEnabled;
      if (voiceEnabled) {
        voiceBtn.classList.add("text-brand-accent");
        voiceBtn.title = "Voice Responses Enabled (Click to Mute)";
        if (voiceIcon) {
          voiceIcon.setAttribute("data-lucide", "volume-2");
        }
      } else {
        voiceBtn.classList.remove("text-brand-accent");
        voiceBtn.title = "Voice Responses Muted (Click to Enable)";
        if (voiceIcon) {
          voiceIcon.setAttribute("data-lucide", "volume-x");
        }
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      }
      lucide.createIcons();
    });
  }

  // Quick Chips
  quickChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const query = chip.getAttribute("data-query") || chip.textContent.trim();
      handleUserQuery(query);
    });
  });

  // Form Submit
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;
    chatInput.value = "";
    handleUserQuery(query);
  });

  // Query Handler
  const handleUserQuery = (query) => {
    appendUserMessage(query);
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const responseHTML = generateNawabResponse(query);
      appendBotMessage(responseHTML);
    }, 450);
  };

  // Append User Bubble
  const appendUserMessage = (text) => {
    const msgDiv = document.createElement("div");
    msgDiv.className = "flex items-start justify-end gap-2.5";
    msgDiv.innerHTML = `
      <div class="bg-brand-accent text-white p-3 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed shadow-sm text-xs font-medium">
        ${escapeHTML(text)}
      </div>
    `;
    messagesContainer.appendChild(msgDiv);
    scrollChatToBottom();
  };

  // Append Bot Bubble
  const appendBotMessage = (htmlContent) => {
    const msgDiv = document.createElement("div");
    msgDiv.className = "flex items-start gap-2.5";
    msgDiv.innerHTML = `
      <div class="h-7 w-7 rounded-full bg-brand-accent flex items-center justify-center text-white text-xs shrink-0 mt-0.5 shadow-sm">
        👑
      </div>
      <div class="bg-slate-800/80 border border-slate-700/60 text-slate-200 p-3.5 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed shadow-sm text-xs">
        ${htmlContent}
      </div>
    `;
    messagesContainer.appendChild(msgDiv);
    scrollChatToBottom();
    lucide.createIcons();

    // Voice reading if enabled
    if (voiceEnabled && 'speechSynthesis' in window) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      const plainText = tempDiv.textContent || tempDiv.innerText || "";
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  // Typing Indicator
  const showTypingIndicator = () => {
    const typingDiv = document.createElement("div");
    typingDiv.id = "nawab-typing-indicator";
    typingDiv.className = "flex items-start gap-2.5";
    typingDiv.innerHTML = `
      <div class="h-7 w-7 rounded-full bg-brand-accent flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
        👑
      </div>
      <div class="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
        <span class="h-2 w-2 bg-brand-accent rounded-full animate-bounce"></span>
        <span class="h-2 w-2 bg-brand-accent rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span class="h-2 w-2 bg-brand-accent rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    scrollChatToBottom();
  };

  const removeTypingIndicator = () => {
    const indicator = document.getElementById("nawab-typing-indicator");
    if (indicator) indicator.remove();
  };

  const scrollChatToBottom = () => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  };

  // ---------------- NAWAB SMART INTENT ENGINE ----------------
  const generateNawabResponse = (query) => {
    const q = query.toLowerCase().trim();

    // 1. Pricing / Plans / Cost
    if (q.includes("price") || q.includes("pricing") || q.includes("cost") || q.includes("how much") || q.includes("package") || q.includes("plan") || q.includes("rate") || q.includes("starter") || q.includes("growth") || q.includes("pro")) {
      return `
        <p class="font-bold text-white mb-2">Here are our 3 clear, all-inclusive packages:</p>
        <ul class="space-y-2 mb-3">
          <li class="p-2 rounded-lg bg-slate-900/60 border border-slate-700/60">
            <div class="flex justify-between items-center mb-0.5">
              <strong class="text-white">🚀 Starter</strong>
              <span class="text-brand-accent font-bold">₹4,999</span>
            </div>
            <p class="text-[11px] text-slate-300">4-5 page website, mobile optimized, contact form, Google Business setup.</p>
          </li>
          <li class="p-2 rounded-lg bg-slate-900/60 border border-brand-accent/40">
            <div class="flex justify-between items-center mb-0.5">
              <strong class="text-white">⭐ Growth (Most Popular)</strong>
              <span class="text-brand-accent font-bold">₹8,999</span>
            </div>
            <p class="text-[11px] text-slate-300">Everything in Starter + WhatsApp integration, AI auto-replies, industry features & 30-day support.</p>
          </li>
          <li class="p-2 rounded-lg bg-slate-900/60 border border-slate-700/60">
            <div class="flex justify-between items-center mb-0.5">
              <strong class="text-white">👑 Pro</strong>
              <span class="text-brand-accent font-bold">₹13,999 <span class="text-[10px] text-slate-400">+ ₹3,999/mo</span></span>
            </div>
            <p class="text-[11px] text-slate-300">Full AI chatbot, lead CRM dashboard, monthly SEO ranking, review automation & strategy calls.</p>
          </li>
        </ul>
        <div class="flex flex-wrap gap-1.5 mt-2">
          <a href="#pricing" onclick="document.getElementById('nawab-chat-window').classList.add('hidden')" class="inline-flex items-center gap-1 px-3 py-1 bg-brand-accent text-white font-semibold rounded-md text-[11px]">
            View Pricing Cards <i data-lucide="arrow-right" class="h-3 w-3"></i>
          </a>
          <a href="#contact" onclick="document.getElementById('nawab-chat-window').classList.add('hidden')" class="inline-flex items-center gap-1 px-3 py-1 bg-slate-700 text-white rounded-md text-[11px]">
            Book Strategy Call
          </a>
        </div>
      `;
    }

    // 2. Payment Terms / Advance / Deposit
    if (q.includes("payment") || q.includes("advance") || q.includes("deposit") || q.includes("installment") || q.includes("milestone") || q.includes("terms") || q.includes("20%")) {
      return `
        <p class="font-bold text-white mb-1.5">💳 Flexible & Safe Payment Terms</p>
        <p class="mb-2 text-slate-300">We keep it completely low-risk for your business:</p>
        <ul class="space-y-1.5 mb-3 text-slate-300 text-[11px]">
          <li class="flex items-start gap-1.5">
            <span class="text-emerald-400 font-bold">✓</span>
            <span><strong>20% Friendly Deposit:</strong> To kick off your project design and development.</span>
          </li>
          <li class="flex items-start gap-1.5">
            <span class="text-emerald-400 font-bold">✓</span>
            <span><strong>Remaining Balance:</strong> Payable only after you review, test, and approve your completed website before launch.</span>
          </li>
        </ul>
        <p class="text-[11px] text-slate-400">All payments are transparent with zero hidden fees.</p>
      `;
    }

    // 3. Domain & Hosting / Server Costs
    if (q.includes("domain") || q.includes("hosting") || q.includes("server") || q.includes("godaddy") || q.includes("hostinger") || q.includes("ssl") || q.includes(".com") || q.includes(".in")) {
      return `
        <p class="font-bold text-white mb-1.5">🌐 Domain & Hosting Setup</p>
        <p class="mb-2 text-slate-300">Here is how we save you thousands every year:</p>
        <div class="space-y-2 mb-3 text-[11px]">
          <div class="p-2 bg-slate-900/60 rounded-lg border border-slate-700/60">
            <strong class="text-emerald-400">☁️ Cloud Hosting is ₹0 (FREE Forever):</strong>
            <p class="text-slate-300 mt-0.5">We deploy on high-speed global cloud servers (Netlify/Vercel) with lifetime free SSL 🔒 security. Zero monthly hosting bills.</p>
          </div>
          <div class="p-2 bg-slate-900/60 rounded-lg border border-slate-700/60">
            <strong class="text-blue-400">🏷️ Domain Registration (~₹399 - ₹499/year):</strong>
            <p class="text-slate-300 mt-0.5">You purchase your domain (.in or .com) directly in your name on Hostinger/GoDaddy so you retain 100% legal ownership. We configure everything for free!</p>
          </div>
        </div>
      `;
    }

    // 4. Projects / Portfolio / Past Work / PGL / Fairies
    if (q.includes("project") || q.includes("portfolio") || q.includes("work") || q.includes("pgl") || q.includes("fairies") || q.includes("crochet") || q.includes("example") || q.includes("sample") || q.includes("client")) {
      return `
        <p class="font-bold text-white mb-2">🚀 Live Production Projects Built by Moid:</p>
        <div class="space-y-2 mb-3 text-[11px]">
          <div class="p-2.5 bg-slate-900/60 rounded-lg border border-slate-700/60">
            <div class="flex justify-between items-center mb-1">
              <strong class="text-white">🏢 PGL Corporate Platform</strong>
              <a href="https://www.perfectgulf.com/" target="_blank" rel="noopener noreferrer" class="text-brand-accent hover:underline inline-flex items-center gap-1 font-bold">
                Live Site <i data-lucide="external-link" class="h-3 w-3"></i>
              </a>
            </div>
            <p class="text-slate-300">Multi-page enterprise architecture with structured industry verticals and SEO infrastructure.</p>
          </div>
          <div class="p-2.5 bg-slate-900/60 rounded-lg border border-slate-700/60">
            <div class="flex justify-between items-center mb-1">
              <strong class="text-white">🛍️ Fairies Crochet Nest</strong>
              <a href="https://fairy-crochet-nest.netlify.app/" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline inline-flex items-center gap-1 font-bold">
                Live Site <i data-lucide="external-link" class="h-3 w-3"></i>
              </a>
            </div>
            <p class="text-slate-300">Custom e-commerce storefront with dynamic cart and automated Google Sheets order dispatch.</p>
          </div>
        </div>
        <a href="#projects" onclick="document.getElementById('nawab-chat-window').classList.add('hidden')" class="inline-flex items-center gap-1 px-3 py-1 bg-brand-accent text-white font-semibold rounded-md text-[11px]">
          Explore Projects Section <i data-lucide="arrow-right" class="h-3 w-3"></i>
        </a>
      `;
    }

    // 5. Timeline / Turnaround / Delivery Speed
    if (q.includes("time") || q.includes("how long") || q.includes("days") || q.includes("turnaround") || q.includes("fast") || q.includes("delivery") || q.includes("when")) {
      return `
        <p class="font-bold text-white mb-1.5">⏱️ Fast 7-Day Turnaround</p>
        <p class="text-slate-300 mb-2">We build and deploy production systems in just 1 week:</p>
        <ul class="space-y-1.5 text-[11px] text-slate-300 mb-3">
          <li><strong>Day 1:</strong> Strategy & Technical Blueprint</li>
          <li><strong>Days 2-3:</strong> Wireframing & Responsive UI Design</li>
          <li><strong>Days 4-5:</strong> Custom Code, AI/Form Integrations & Databases</li>
          <li><strong>Day 6:</strong> Review, Revisions & Speed Optimization</li>
          <li><strong>Day 7:</strong> Production Launch & Handover</li>
        </ul>
        <a href="#process" onclick="document.getElementById('nawab-chat-window').classList.add('hidden')" class="text-brand-accent hover:underline font-bold text-[11px]">
          See full 7-day timeline breakdown →
        </a>
      `;
    }

    // 6. Founder / Moid / Sufiyan / Team / Solo
    if (q.includes("founder") || q.includes("owner") || q.includes("who is") || q.includes("moid") || q.includes("sufiyan") || q.includes("team") || q.includes("agency") || q.includes("about")) {
      return `
        <p class="font-bold text-white mb-1.5">👨‍💻 About the Founder</p>
        <p class="text-slate-300 mb-2"><strong>M.A. MOID SUFIYAN</strong> is the Founder & Lead Engineer at Nawabi Coder.</p>
        <p class="text-slate-300 text-[11px] mb-2 leading-relaxed">
          He operates with <strong>The Solo Advantage</strong>: zero junior account managers, zero bureaucracy, and 100% personal accountability for every line of code and AI workflow.
        </p>
        <a href="#about" onclick="document.getElementById('nawab-chat-window').classList.add('hidden')" class="inline-flex items-center gap-1 text-brand-accent hover:underline font-bold text-[11px]">
          Read Founder Story & Direct Guarantee →
        </a>
      `;
    }

    // 7. WhatsApp / Direct Message
    if (q.includes("whatsapp") || q.includes("chat on whatsapp") || q.includes("number") || q.includes("message") || q.includes("call me") || q.includes("direct")) {
      return `
        <p class="font-bold text-white mb-1.5">💬 Direct WhatsApp Connect</p>
        <p class="text-slate-300 mb-2">You can chat directly with <strong>Moid</strong> on WhatsApp to discuss your project right away:</p>
        <div class="p-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl mb-3 text-center">
          <p class="text-xs font-bold text-white mb-1">📱 +91 86881 12676</p>
          <p class="text-[11px] text-slate-300 mb-2">Typically replies in a few minutes</p>
          <a href="https://wa.me/918688112676?text=Hi%20Nawabi%20Coder%2C%20I%20would%20like%20to%20discuss%20a%20website%20%26%20AI%20project." target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-lg text-xs transition-colors shadow-md">
            <span>Open WhatsApp Chat</span> 💬
          </a>
        </div>
      `;
    }

    // 8. Services / What do you do / AI / SEO
    if (q.includes("service") || q.includes("what do you do") || q.includes("offer") || q.includes("ai") || q.includes("seo") || q.includes("automation") || q.includes("chatbot")) {
      return `
        <p class="font-bold text-white mb-2">🛠️ Our Core Capabilities:</p>
        <ul class="space-y-2 text-[11px] text-slate-300 mb-3">
          <li><strong class="text-white">1. High-Performance Web Development:</strong> Fast, mobile-first business sites and custom e-commerce stores.</li>
          <li><strong class="text-white">2. AI & WhatsApp Automation:</strong> 24/7 auto-replies, lead capture, CRM database pipelines.</li>
          <li><strong class="text-white">3. Local Growth Systems:</strong> Google Business Profile optimization, local SEO ranking, and review automation.</li>
        </ul>
        <a href="#services" onclick="document.getElementById('nawab-chat-window').classList.add('hidden')" class="text-brand-accent hover:underline font-bold text-[11px]">
          Explore all service verticals →
        </a>
      `;
    }

    // 9. Contact / Book Strategy Call / Hire / Meeting
    if (q.includes("contact") || q.includes("book") || q.includes("call") || q.includes("meet") || q.includes("hire") || q.includes("phone") || q.includes("email") || q.includes("audit") || q.includes("talk") || q.includes("consult")) {
      return `
        <p class="font-bold text-white mb-1.5">📞 Let's Connect With Moid</p>
        <p class="text-slate-300 mb-2">You can book a free 15-minute strategy call or reach out directly on WhatsApp:</p>
        <div class="flex flex-col gap-2 mb-3">
          <a href="https://wa.me/918688112676?text=Hi%20Nawabi%20Coder%2C%20I%20would%20like%20to%20schedule%20a%20strategy%20call." target="_blank" rel="noopener noreferrer" class="w-full py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-lg text-center text-xs transition-colors shadow-md flex items-center justify-center gap-1.5">
            <span>Direct WhatsApp: +91 86881 12676</span> 💬
          </a>
          <button onclick="document.getElementById('nawab-chat-window').classList.add('hidden'); document.getElementById('contact').scrollIntoView({behavior:'smooth'}); setTimeout(()=>document.getElementById('name').focus(), 700);" class="w-full py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-lg text-center text-xs transition-colors shadow-md cursor-pointer">
            Open 15-Minute Strategy Call Form
          </button>
        </div>
        <p class="text-[11px] text-slate-400">📧 Email: <a href="mailto:hello@nawabicoder.com" class="text-brand-accent underline">hello@nawabicoder.com</a></p>
      `;
    }

    // 9. Revisions / Support / Maintenance / Updates
    if (q.includes("revision") || q.includes("change") || q.includes("support") || q.includes("maintenance") || q.includes("update") || q.includes("after launch")) {
      return `
        <p class="font-bold text-white mb-1.5">🛡️ Revisions & Ongoing Support</p>
        <ul class="space-y-1.5 text-[11px] text-slate-300 mb-2">
          <li><strong>Revision Rounds:</strong> Included in every package to ensure your website is 100% pixel-perfect.</li>
          <li><strong>Post-Launch Support:</strong> 30-day technical warranty included in Growth & Pro packages.</li>
          <li><strong>Monthly Care:</strong> Ongoing feature updates, backups, and SEO optimization covered under our Pro tier.</li>
        </ul>
      `;
    }

    // 10. Greetings
    if (q === "hi" || q === "hello" || q === "hey" || q === "adaab" || q === "salam" || q === "namaste" || q.startsWith("hi ") || q.startsWith("hello ")) {
      return `
        <p class="font-bold text-white mb-1">Adaab & Welcome! 👑</p>
        <p class="text-slate-300 mb-2">I am <strong>Nawab</strong>, your AI guide for Nawabi Coder. How can I assist your business today?</p>
        <p class="text-[11px] text-slate-400">You can ask me about our <strong>₹4,999 Starter package</strong>, view live projects like <strong>PGL</strong> & <strong>Fairies Crochet</strong>, or schedule a strategy call!</p>
      `;
    }

    // 11. Polite Thanks
    if (q.includes("thank") || q.includes("thx") || q.includes("great") || q.includes("awesome") || q.includes("ok") || q === "cool") {
      return `
        <p class="font-bold text-white mb-1">You're most welcome! 👑</p>
        <p class="text-slate-300 text-[11px] mb-2">Whenever you're ready to build or automate your business, click below to schedule a quick 15-minute call with Moid.</p>
        <a href="#contact" onclick="document.getElementById('nawab-chat-window').classList.add('hidden')" class="inline-flex items-center gap-1 text-brand-accent hover:underline font-bold text-[11px]">
          Book a 15-Minute Strategy Call →
        </a>
      `;
    }

    // 12. Smart Fallback for Unique/Custom Questions
    return `
      <p class="font-bold text-white mb-1.5">Thank you for asking! 👑</p>
      <p class="text-slate-300 text-[11px] mb-2 leading-relaxed">
        Because every business has unique workflows, Moid will be happy to answer this specifically and design a custom blueprint for you.
      </p>
      <div class="p-2.5 bg-slate-900/60 rounded-lg border border-slate-700/60 mb-3 text-[11px]">
        <p class="text-slate-300">💡 <strong>Quick Next Step:</strong> Book a free 15-minute strategy call with Moid to get an exact custom plan and quote.</p>
      </div>
      <button onclick="document.getElementById('nawab-chat-window').classList.add('hidden'); document.getElementById('contact').scrollIntoView({behavior:'smooth'}); setTimeout(()=>document.getElementById('name').focus(), 700);" class="w-full py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-lg text-center text-xs transition-colors shadow-md cursor-pointer">
        Book a 15-Minute Strategy Call
      </button>
    `;
  };
});

