/* Futureonics Custom Premium Interactive JS Logic */
/* Client-side simulations for advanced configurator and carousels */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DYNAMIC CABLE CONFIGURATOR LOGIC
    const configTabs = document.querySelectorAll('.config-tab-btn');
    const cableTypeSelect = document.getElementById('cable-type');
    const strandSelect = document.getElementById('strand-count');
    const lengthInput = document.getElementById('cable-length');
    const connASelect = document.getElementById('connector-a');
    const connBSelect = document.getElementById('connector-b');
    const pullingEyeSelect = document.getElementById('pulling-eye');
    const priceDisplay = document.getElementById('config-price');
    const specSummary = document.getElementById('config-spec-details');

    // Base pricing configuration structure (mock business logic)
    const pricingConfig = {
        // base cost per assembly
        baseCost: {
            'singlemode': 25.00,
            'om3': 35.00,
            'om4': 40.00,
            'om1': 20.00
        },
        // cost per foot
        perFootCost: {
            'singlemode': 0.12, // 9/125
            'om3': 0.28,        // 10G Multimode
            'om4': 0.38,        // 40G/100G Multimode
            'om1': 0.18         // Legacy Multimode
        },
        // connector multipliers/cost
        connectorCost: {
            'lc-upc': 4.50,
            'lc-apc': 5.50,
            'sc-upc': 4.00,
            'sc-apc': 5.00,
            'st-upc': 3.50,
            'mtp': 35.00
        },
        // pulling eye surcharge
        pullingEyeCost: 15.00
    };

    function calculatePrice() {
        const type = cableTypeSelect.value;
        const strands = parseInt(strandSelect.value) || 2;
        const length = parseFloat(lengthInput.value) || 0;
        const connA = connASelect.value;
        const connB = connBSelect.value;
        const pullingEye = pullingEyeSelect.value === 'yes';

        // Calculate Cost
        let base = pricingConfig.baseCost[type] || 25.00;
        let ftRate = pricingConfig.perFootCost[type] || 0.15;
        let connARate = pricingConfig.connectorCost[connA] || 4.00;
        let connBRate = pricingConfig.connectorCost[connB] || 4.00;

        // Multistrand cable factor
        let strandMultiplier = 1.0;
        if (strands === 4) strandMultiplier = 1.3;
        else if (strands === 6) strandMultiplier = 1.6;
        else if (strands === 12) strandMultiplier = 2.2;
        else if (strands === 24) strandMultiplier = 3.5;
        else if (strands === 48) strandMultiplier = 6.0;

        // Formulas
        let connectorSum = (connARate * strands) + (connBRate * strands);
        let cableCost = length * ftRate * strandMultiplier;
        let setupCost = base * (strands / 2);
        let pullingEyeCost = pullingEye ? pricingConfig.pullingEyeCost : 0;

        let total = setupCost + cableCost + connectorSum + pullingEyeCost;
        
        // Display animated price count
        animatePriceChange(total);

        // Update Spec Text
        let fiberLabel = cableTypeSelect.options[cableTypeSelect.selectedIndex].text;
        let connALabel = connASelect.options[connASelect.selectedIndex].text;
        let connBLabel = connBSelect.options[connBSelect.selectedIndex].text;
        
        specSummary.textContent = `${strands} Strands ${fiberLabel} Custom Cable, Connectors: ${connALabel} to ${connBLabel}, ${length}ft`;
    }

    function animatePriceChange(targetPrice) {
        let startPrice = parseFloat(priceDisplay.textContent.replace('$', '')) || 0;
        let duration = 300; // ms
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            let progress = Math.min((timestamp - startTime) / duration, 1);
            let current = startPrice + progress * (targetPrice - startPrice);
            priceDisplay.textContent = `$${current.toFixed(2)}`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    // Tab Switch Logic
    configTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            configTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Adjust presets based on tab type
            const presetType = tab.getAttribute('data-type');
            if (presetType === 'mtp') {
                cableTypeSelect.value = 'om4';
                strandSelect.value = '12';
                connASelect.value = 'mtp';
                connBSelect.value = 'mtp';
            } else if (presetType === 'patch') {
                cableTypeSelect.value = 'om3';
                strandSelect.value = '2';
                connASelect.value = 'lc-upc';
                connBSelect.value = 'lc-upc';
            } else {
                cableTypeSelect.value = 'singlemode';
                strandSelect.value = '6';
                connASelect.value = 'lc-upc';
                connBSelect.value = 'lc-upc';
            }
            calculatePrice();
        });
    });

    // Add listeners to fields
    [cableTypeSelect, strandSelect, lengthInput, connASelect, connBSelect, pullingEyeSelect].forEach(element => {
        if(element) {
            element.addEventListener('change', calculatePrice);
        }
    });

    if (lengthInput) {
        lengthInput.addEventListener('input', calculatePrice);
    }

    // Initialize configurator calculation
    if (priceDisplay) {
        calculatePrice();
    }


    // 2. TESTIMONIALS CAROUSEL SLIDER
    const testimonials = [
        {
            text: "Futureonics pre-terminated fiber assemblies saved our team three days of field termination work on our new server room expansion. The LC connectors were pristine, and test reports were included in the package. Industry-standard quality, indeed!",
            author: "Marcus Vance",
            company: "Lead Network Architect, Enterprise Systems Corp"
        },
        {
            text: "Finding high-quality USA-assembled optical reels on short notice is tough. We ordered three 500ft tactical spools and they shipped out the next business day. Performance metrics are phenomenal, with sub-0.2dB insertion loss.",
            author: "Sarah Lin",
            company: "Infrastructure Deployment Mgr, TelcoGroup Global"
        },
        {
            text: "The customized cable builder is incredibly efficient. We can calculate B2B quotes instantly, place orders directly, and receive consistent updates. Our clients have been extremely impressed with the quality.",
            author: "David Ross",
            company: "Senior Telecomm Contractor, Ross Cabling LLC"
        }
    ];

    let currentTestimonial = 0;
    const testimonialContainer = document.querySelector('.testimonial-carousel');
    
    function updateTestimonial() {
        if (!testimonialContainer) return;
        const textEl = testimonialContainer.querySelector('.testimonial-text');
        const authorEl = testimonialContainer.querySelector('.testimonial-author');
        const companyEl = testimonialContainer.querySelector('.testimonial-company');

        // Apply a quick fade transition
        testimonialContainer.style.opacity = '0.3';
        setTimeout(() => {
            textEl.textContent = `"${testimonials[currentTestimonial].text}"`;
            authorEl.textContent = testimonials[currentTestimonial].author;
            companyEl.textContent = testimonials[currentTestimonial].company;
            testimonialContainer.style.opacity = '1';
        }, 200);
    }

    // Auto rotate testimonials every 6 seconds
    if (testimonialContainer) {
        testimonialContainer.style.transition = 'opacity 0.2s ease';
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            updateTestimonial();
        }, 6000);
    }


    // 3. CART SIMULATOR & NOTIFICATIONS
    const addToCartBtn = document.querySelector('.btn-accent');
    const cartBadge = document.querySelector('.utility-badge');

    if(addToCartBtn && cartBadge) {
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create a toast notification
            const toast = document.createElement('div');
            toast.style.position = 'fixed';
            toast.style.bottom = '24px';
            toast.style.right = '24px';
            toast.style.backgroundColor = '#10b981'; // Emerald Green
            toast.style.color = '#ffffff';
            toast.style.padding = '16px 24px';
            toast.style.borderRadius = '8px';
            toast.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.2)';
            toast.style.zIndex = '9999';
            toast.style.fontWeight = '600';
            toast.style.display = 'flex';
            toast.style.alignItems = 'center';
            toast.style.gap = '10px';
            toast.innerHTML = '⚡ Custom assembly added to cart successfully!';
            
            document.body.appendChild(toast);
            
            // Update cart item count badge
            let currentItems = parseInt(cartBadge.textContent) || 0;
            cartBadge.textContent = currentItems + 1;
            
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.5s ease';
                setTimeout(() => toast.remove(), 500);
            }, 3000);
        });
    }

    // 4. INSTANT SEARCH SIMULATION
    const searchInput = document.querySelector('.search-bar');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                alert(`Search query: "${searchInput.value}"\n\n(In production, this triggers WooCommerce / Porto product searches)`);
            }
        });
    }

});

// 5. INDUSTRIES CAROUSEL SLIDER LOGIC
function slideIndustries(direction) {
    const track = document.getElementById('industries-track');
    if (!track) return;
    
    const card = track.querySelector('.industry-card');
    if (!card) return;
    
    const cardWidth = card.getBoundingClientRect().width;
    const gap = 16; // CSS gap
    const scrollAmount = cardWidth + gap;
    
    if (direction === 'left') {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}
