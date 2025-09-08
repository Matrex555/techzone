// script.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('TechZone website loaded successfully!');
    
    const cards = document.querySelectorAll('.card');
    const formSection = document.getElementById('formSection');
    const formTitle = document.getElementById('formTitle');
    const helpForm = document.getElementById('helpForm');
    const successMsg = document.getElementById('successMsg');
    const contactInfo = document.getElementById('contactInfo');
    const animatedGuy = document.getElementById('animated-guy');
    
    const serviceTypes = {
        'windows': {
            title: '💻 Windows-ის გადაყენება',
            description: 'Windows ოპერაციული სისტემის პროფესიონალური გადაყენება'
        },
        'tech': {
            title: '🔧 ტექნიკური დახმარება',
            description: 'კომპიუტერული პრობლემების მოგვარება და კონსულტაცია'
        },
        'build': {
            title: '🧩 სისტემის აწყობა',
            description: 'კომპიუტერის კომპლექტაცია და აწყობა'
        }
    };
    
    let currentService = '';
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            currentService = serviceType;
            
            if (serviceTypes[serviceType]) {
                formTitle.textContent = serviceTypes[serviceType].title;
            }
            
            if (serviceType === 'build') {
                showContactInfo();
            } else {
                showForm();
            }
            
            setTimeout(() => {
                formSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);
            
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
        
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 25px 50px rgba(0, 123, 255, 0.6)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
    
    if (helpForm) {
        helpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                service: currentService,
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                address: document.getElementById('address').value.trim(),
                pcModel: document.getElementById('pcModel').value.trim(),
                timeSlot: document.getElementById('timeSlot').value.trim(),
                additional: document.getElementById('additional').value.trim(),
                timestamp: new Date().toISOString()
            };
            
            if (!formData.name || !formData.phone || !formData.address) {
                showNotification('გთხოვთ შეავსოთ ყველა სავალდებულო ველი', 'error');
                return;
            }
            
            const phoneRegex = /^(\+995|995|0)?[1-9]\d{8}$/;
            const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
            if (!phoneRegex.test(cleanPhone) && cleanPhone.length < 9) {
                showNotification('გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი (მაგ: 599123456)', 'error');
                return;
            }
            
            submitFormToServer(formData);
        });
    }
    
    if (animatedGuy) {
        animatedGuy.addEventListener('click', function() {
            showRandomTip();
        });
    }
    
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    function showForm() {
        formSection.style.display = 'block';
        formSection.classList.add('active');
        contactInfo.style.display = 'none';
        successMsg.style.display = 'none';
        helpForm.style.display = 'block';
    }
    
    function showContactInfo() {
        formSection.style.display = 'block';
        formSection.classList.add('active');
        contactInfo.style.display = 'block';
        successMsg.style.display = 'none';
        helpForm.style.display = 'none';
    }
    
    async function submitFormToServer(data) {
        const submitBtn = helpForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'იგზავნება...';
        submitBtn.disabled = true;

        const message = `
🔔 ახალი მოთხოვნა
სერვისი: ${serviceTypes[data.service]?.title || 'უცნობი'}
სახელი: ${data.name}
ტელეფონი: ${data.phone}
მისამართი: ${data.address}
თარიღი: ${data.pcModel || 'არ არის მითითებული'}
დროის სლოტი: ${data.timeSlot || 'არ არის მითითებული'}
დამატებითი ინფორმაცია: ${data.additional || 'არ არის მითითებული'}
გაგზავნის დრო: ${new Date(data.timestamp).toLocaleString('ka-GE')}
        `.trim();

        try {
            // const response = await fetch('http://localhost:3000/send', {
            const response = await fetch('techzone-beta.vercel.app/send', {
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });
            
            const result = await response.json();
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            if (result.success) {
                successMsg.style.display = 'block';
                helpForm.style.display = 'none';
                showNotification('✅ თქვენი მოთხოვნა წარმატებით გაიგზავნა! მალე დაგიკავშირდებით.', 'success');
                setTimeout(() => {
                    contactInfo.style.display = 'block';
                }, 2000);
                setTimeout(() => {
                    resetForm();
                }, 8000);
            } else {
                showNotification('❌ შეცდომა: ' + (result.error || 'გაუთვალისწინებელი შეცდომა'), 'error');
            }
        } catch (error) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            console.error('ფორმის გაგზავნის შეცდომა:', error);
            showNotification('❌ სერვერთან კავშირის შეცდომა. გთხოვთ სცადოთ მოგვიანებით.', 'error');
        }
    }
    
    function resetForm() {
        successMsg.style.display = 'none';
        helpForm.style.display = 'block';
        helpForm.reset();
        formSection.classList.add('active');
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const bgColor = type === 'error' ? '#ff4757' : 
                       type === 'success' ? '#2ed573' : '#2ed573';
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 600;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    function showRandomTip() {
        const tips = [
            'მე ვარ თქვენი ტექნიკური ასისტენტი! 🔧',
            'დაგეხმარებით ყველა კომპიუტერულ პრობლემაში! 💻',
            'ჩვენი სერვისი მუშაობს 24/7! ⏰',
            'უფასო კონსულტაცია ტელეფონით! 📞',
            'სწრაფი და ხარისხიანი მომსახურება! ⚡'
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        showNotification(randomTip, 'info');
    }
    
    function addInteractiveEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.getElementById('hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
        
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.classList.add('float-animation');
        });
    }
    
    addInteractiveEffects();
    
    setTimeout(() => {
        showNotification('მოგესალმებით TechZone-ში! 👋', 'info');
    }, 1000);
});

const style = document.createElement('style');
style.textContent = `
    .float-animation {
        animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    .card:nth-child(1) { animation-delay: 0s; }
    .card:nth-child(2) { animation-delay: 2s; }
    .card:nth-child(3) { animation-delay: 4s; }
`;
document.head.appendChild(style);
