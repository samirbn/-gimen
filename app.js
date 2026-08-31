// ==========================================================================
// Gemini Pro 18M Landing Page - Interactive Scripts & Automations
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initAccordion();
    initOrderForm();
});

// 1. Countdown Timer (Persistent 8h 45m loop)
function initCountdown() {
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    if (!hoursEl || !minutesEl || !secondsEl) return;

    let targetTime = localStorage.getItem('gemini_promo_end');
    if (!targetTime || new Date(targetTime) <= new Date()) {
        // Set new target: 8 hours and 42 minutes from now
        targetTime = new Date(Date.now() + (8 * 3600 + 42 * 60 + 19) * 1000).toISOString();
        localStorage.setItem('gemini_promo_end', targetTime);
    }

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(targetTime).getTime() - now;

        if (distance <= 0) {
            clearInterval(interval);
            hoursEl.innerText = "00";
            minutesEl.innerText = "00";
            secondsEl.innerText = "00";
            return;
        }

        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        hoursEl.innerText = String(hours).padStart(2, '0');
        minutesEl.innerText = String(minutes).padStart(2, '0');
        secondsEl.innerText = String(seconds).padStart(2, '0');
    }, 1000);
}

// 2. Accordion for FAQ
function initAccordion() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => {
        const title = item.querySelector('.accordion-title');
        title.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Close all
            items.forEach(i => i.classList.remove('active'));
            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// 3. Copy to Clipboard Function
window.copyText = function(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHtml = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ!';
        btnElement.style.background = '#10b981';
        btnElement.style.color = '#fff';

        setTimeout(() => {
            btnElement.innerHTML = originalHtml;
            btnElement.style.background = '';
            btnElement.style.color = '';
        }, 2200);
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
};

// 4. Order Form -> WhatsApp Redirection Handler
function initOrderForm() {
    const form = document.getElementById('orderForm');
    if (!form) return;

    // Algerian WhatsApp number
    const whatsappPhone = "213664764206"; 

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phoneNumber').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const payment = document.getElementById('paymentMethod').value;

        let paymentLabel = "بريدي موب (BaridiMob)";
        if (payment === "DirectChat") paymentLabel = "استفسار ومفاهمة مباشرة";

        // Build formatted WhatsApp message
        const message = 
`🚀 *طلب اشتراك جديد - عرض Gemini Pro 18 شهر (1000 دج)*
-----------------------------------
👤 *الاسم الكامل:* ${name}
📞 *رقم الهاتف:* ${phone}
📧 *الإيميل للتفعيل:* ${email}
💳 *طريقة الدفع:* ${paymentLabel}
-----------------------------------
🎁 *الميزات المطلوبة:*
- حساب Gemini Pro رسمي 18 شهر (1000 دج)
- ميزة إضافة 5 حسابات (6 مستخدمين)
- مساحة 5TB سحابية
- Veo 3 + Imagen 3 + NotebookLM
- بونص Flow (1000 نقطة) + Antigravity
-----------------------------------
يرجى تأكيد التفعيل وإرسال بيانات الحساب. شكراً!`;

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;

        // Open WhatsApp in new tab
        window.open(waUrl, '_blank');
    });
}
