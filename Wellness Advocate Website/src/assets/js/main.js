// main.js


document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Initialize EmailJS
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key

    // Handle page navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    
    // Show initial page (home)
    showPage('home-page');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page') + '-page';
            
            // Update active state in navigation
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');

            showPage(pageId);
        });
    });

    function showPage(pageId) {
        // Hide all pages
        pages.forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });

        // Show selected page
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.style.display = 'block';
            // Use setTimeout to ensure display block is applied before adding active class
            setTimeout(() => {
                activePage.classList.add('active');
            }, 10);

            // Scroll to top with smooth behavior
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Show loading spinner
            const submitBtn = this.querySelector('button[type="submit"]');
            const submitText = document.getElementById('submitText');
            const loadingSpinner = document.getElementById('loadingSpinner');
            
            try {
                submitBtn.disabled = true;
                submitText.classList.add('d-none');
                loadingSpinner.classList.remove('d-none');

                // Prepare template parameters
                const templateParams = {
                    from_name: document.getElementById('userName').value,
                    from_email: document.getElementById('userEmail').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value,
                    to_name: 'Wellness Advocate Team', // Add recipient name
                    reply_to: document.getElementById('userEmail').value
                };

                // Send email using EmailJS
                const response = await emailjs.send(
                    'service_2y5rine', // Replace with your EmailJS service ID
                    'template_n28phsr', // Replace with your EmailJS template ID
                    templateParams
                );

                // Show success message
                showNotification('success', 'Thank you! Your message has been sent successfully.');
                contactForm.reset();

            } catch (error) {
                console.error('EmailJS Error:', error);
                showNotification('error', 'Oops! Something went wrong. Please try again later.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitText.classList.remove('d-none');
                loadingSpinner.classList.add('d-none');
            }
        });
    }

    // Notification function
    function showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} notification`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 15px 25px;
            border-radius: 8px;
            animation: slideIn 0.5s ease-out;
        `;
        notification.innerHTML = message;
        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // Add these styles to your custom.css
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Navbar scroll behavior
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.getElementById('mainNav').classList.add('navbar-shrink');
        } else {
            document.getElementById('mainNav').classList.remove('navbar-shrink');
        }
    });
});