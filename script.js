/*
  This script handles:
  1. Initializing Lucide icons.
  2. The scroll-spy logic for active navigation link highlighting.
  3. The mobile menu toggle functionality.
  4. The project modal functionality.
*/

// Wait for the entire window (including scripts like Lucide) to load
window.addEventListener('load', () => {
    
    // 1. Initialize Lucide Icons
    try {
        lucide.createIcons();
    } catch (error) {
        console.error("Lucide icon initialization failed:", error);
    }

    // --- 2. Scroll-Spy Logic ---
    const sections = document.querySelectorAll('section[id]');
    
    // Select both desktop and mobile links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    const navLinksMap = new Map();
    navLinks.forEach(link => {
        // Use link.hash.substring(1) to get the section ID (e.g., 'home')
        const sectionId = link.hash.substring(1);
        if (!navLinksMap.has(sectionId)) {
            navLinksMap.set(sectionId, []);
        }
        navLinksMap.get(sectionId).push(link);
    });

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Center of the viewport
        threshold: 0 // Only check if the section's center is in the viewport
    };

    const observer = new IntersectionObserver((entries) => {
        let activeSectionId = null;

        entries.forEach(entry => {
            // Use the IntersectionObserver's built-in logic for efficiency
            if (entry.isIntersecting) {
                activeSectionId = entry.target.id;
            }
        });
        
        // Update ALL nav links (desktop and mobile)
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (activeSectionId && navLinksMap.has(activeSectionId)) {
            navLinksMap.get(activeSectionId).forEach(link => {
                link.classList.add('active');
            });
        }

    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
    
    
    // --- 3. Mobile Menu Logic ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuPanel = document.getElementById('mobileMenuPanel');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMobileMenu = () => {
        // Toggle the Tailwind utility class for translation
        mobileMenuPanel.classList.toggle('translate-x-full');
        
        // Toggle the icon (menu <-> x)
        const iconElement = mobileMenuBtn.querySelector('i');
        if (iconElement) {
            const isMenuOpen = !mobileMenuPanel.classList.contains('translate-x-full');
            iconElement.setAttribute('data-lucide', isMenuOpen ? 'x' : 'menu');
            // Re-render the new Lucide icon
            lucide.createIcons({ attrs: { width: 24, height: 24 } });
        }
    };
    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenuPanel.classList.contains('translate-x-full')) {
                toggleMobileMenu();
            }
        });
    });


    // --- 4. Project Modal Logic ---
    const modal = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalClose');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');

    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalImage = document.getElementById('modalImage');
    const modalTags = document.getElementById('modalTags');
    const modalGithub = document.getElementById('modalGithub');
    const modalWebsite = document.getElementById('modalWebsite');
    const modalPdf = document.getElementById('modalPdf');

    const openModal = (card) => {
        const data = card.dataset;
        
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modalImage.src = data.image; 
        
        // Populate tags
        modalTags.innerHTML = ''; 
        try {
            // Handle the tag parsing
            const tags = JSON.parse(data.tags.replace(/'/g, '"')); 
            tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'bg-slate-700 text-light-text py-1 px-3 rounded-full text-xs';
                tagEl.textContent = tag;
                modalTags.appendChild(tagEl);
            });
        } catch (e) {
            console.error("Failed to parse tags:", e, data.tags);
        }

        // Set links and hide buttons if link is '#'
        modalGithub.href = data.github;
        data.github === '#' || data.github === '' ? modalGithub.classList.add('hidden') : modalGithub.classList.remove('hidden');
        
        modalWebsite.href = data.website;
        data.website === '#' || data.website === '' ? modalWebsite.classList.add('hidden') : modalWebsite.classList.remove('hidden');

        modalPdf.href = data.pdf;
        data.pdf === '#' || data.pdf === '' ? modalPdf.classList.add('hidden') : modalPdf.classList.remove('hidden');

        // Show the modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Find the closest parent with the class 'project-card'
            const card = e.target.closest('.project-card');
            if (card) {
                openModal(card);
            }
        });
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

});