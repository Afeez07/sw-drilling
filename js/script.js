document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Sticky Header Shrink Effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0 20px';
            header.style.boxShadow = '0 10px 30px rgba(10, 22, 40, 0.1)';
        } else {
            header.style.padding = '0 40px';
            header.style.boxShadow = '0 10px 30px rgba(10, 22, 40, 0.05)';
        }
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Modal Accessibility Engine
    const modal = document.getElementById('quote-modal');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtn = document.querySelector('.modal-close');
    let previouslyFocusedElement = null;

    if(modal) {
        // Add ARIA attributes dynamically if missing
        if (!modal.hasAttribute('role')) modal.setAttribute('role', 'dialog');
        if (!modal.hasAttribute('aria-modal')) modal.setAttribute('aria-modal', 'true');
        
        const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
        
        function openModal() {
            previouslyFocusedElement = document.activeElement;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // prevent scrolling
            
            // Set focus to the first focusable element inside the modal
            const focusableElements = modal.querySelectorAll(focusableElementsString);
            if (focusableElements.length > 0) {
                // Focus the first input instead of the close button for better UX
                const firstInput = modal.querySelector('input');
                if (firstInput) firstInput.focus();
                else focusableElements[0].focus();
            }
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (previouslyFocusedElement) {
                previouslyFocusedElement.focus();
            }
        }

        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        });

        closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if(e.target === modal) {
                closeModal();
            }
        });

        // Trap focus inside modal & handle Escape key
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
                return;
            }

            if (e.key === 'Tab') {
                let focusableElements = modal.querySelectorAll(focusableElementsString);
                focusableElements = Array.prototype.slice.call(focusableElements);
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });

        // Form Submission Logic
        const quoteForm = document.querySelector('.quote-form');
        if (quoteForm) {
            quoteForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = quoteForm.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                
                // Show loading state
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.8';
                submitBtn.style.cursor = 'not-allowed';

                const formData = new FormData(quoteForm);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                try {
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: json
                    });
                    
                    const result = await response.json();
                    
                    if (response.status === 200) {
                        const modalContainer = document.querySelector('.modal-container');
                        
                        // Save the form content so we can restore it later if needed, or just reset it
                        quoteForm.reset();
                        
                        // Replace form with success message (without hard reload)
                        modalContainer.innerHTML = `
                            <button class="modal-close" onclick="document.getElementById('quote-modal').classList.remove('active'); document.body.style.overflow = '';"><i aria-hidden="true" class="fa-solid fa-xmark"></i></button>
                            <div class="modal-header" style="text-align: center; padding: 40px 20px;">
                                <div style="font-size: 60px; color: #00b4d8; margin-bottom: 25px;"><i aria-hidden="true" class="fa-solid fa-circle-check"></i></div>
                                <h2 style="margin-bottom: 15px;">Request Sent!</h2>
                                <p style="font-size: 16px; line-height: 1.6; color: #6c7a92;">Thank you for reaching out to SW Drilling. Our water experts have received your details and will contact you shortly.</p>
                                <button class="submit-btn" style="margin-top: 30px; max-width: 200px; margin-left: auto; margin-right: auto;" onclick="document.getElementById('quote-modal').classList.remove('active'); document.body.style.overflow = '';">Done</button>
                            </div>
                        `;
                    } else {
                        throw new Error(result.message || 'Submission failed');
                    }
                } catch (error) {
                    console.error('Frontend caught error:', error);
                    alert('Error sending email: ' + error.message);
                    
                    submitBtn.textContent = 'Error! Try Again';
                    submitBtn.style.backgroundColor = '#e63946'; // Red error color
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.cursor = 'pointer';
                        submitBtn.style.backgroundColor = ''; // Reset color
                    }, 3000);
                }
            });
        }
    }
});
