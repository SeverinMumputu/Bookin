 // --- 1. DATA: CATALOGUE DES LIVRES ---
        const books = [
            { id: 1, title: "L'art de l'éloquence", author: "Jean-Marie B.", category: "sciences", price: 15, desc: "Développez votre capacité à convaincre et à parler en public avec aisance.", img: "https://placehold.co/300x400/FFFFFF/0B1F3B?text=Science" },
            { id: 2, title: "Les Contes de la Savane", author: "Amina K.", category: "jeunesse", price: 10, desc: "Des histoires magiques pour endormir les enfants, tirées des légendes congolaises.", img: "https://placehold.co/300x400/FFFFFF/0B1F3B?text=Jeunesse" },
            { id: 3, title: "Kinshasa sous la pluie", author: "Patrick M.", category: "roman", price: 20, desc: "Un roman captivant sur la vie tumultueuse dans la capitale durant les années 90.", img: "https://placehold.co/300x400/FFFFFF/0B1F3B?text=Roman" },
            { id: 4, title: "Guerrier Ndoki Vol. 1", author: "Studio K.", category: "manga", price: 12, desc: "Un manga explosif mélangeant mythes anciens et action moderne.", img: "https://placehold.co/300x400/FFFFFF/0B1F3B?text=Manga" },
            { id: 5, title: "Psychologie Sociale", author: "Dr. Lumumba", category: "sciences", price: 25, desc: "Une analyse profonde des comportements sociaux dans la société congolaise moderne.", img: "https://placehold.co/300x400/FFFFFF/0B1F3B?text=Savoir" },
            { id: 6, title: "Le dernier Roi", author: "Franck L.", category: "roman", price: 18, desc: "Une fiction historique retraçant la chute d'un royaume oublié.", img: "https://placehold.co/300x400/FFFFFF/0B1F3B?text=Litt%C3%A9rature" },
        ];

        // --- 2. GENERATE CATALOGUE & FILTERS ---
        const bookGrid = document.getElementById('book-grid');
        
        function renderBooks(filter = 'all') {
            bookGrid.innerHTML = '';
            const filteredBooks = filter === 'all' ? books : books.filter(b => b.category === filter);
            
            filteredBooks.forEach(book => {
                const bookHTML = `
                    <div class="bg-bookinWhite text-bookinBlack rounded-sm overflow-hidden flex flex-col h-full group shadow-lg">
                        <div class="h-64 overflow-hidden relative border-b border-gray-200">
                            <img src="${book.img}" alt="${book.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        </div>
                        <div class="p-6 flex flex-col flex-grow">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-serif text-xl font-bold leading-tight">${book.title}</h3>
                                <span class="font-bold text-bookinGold whitespace-nowrap ml-2">${book.price}$</span>
                            </div>
                            <p class="text-sm font-semibold text-gray-500 mb-3">${book.author}</p>
                            <p class="text-sm text-gray-600 line-clamp-3 mb-6 flex-grow">${book.desc}</p>
                            <button onclick="addToCart(${book.id})" class="mt-auto w-full border border-bookinBlue text-bookinBlue py-2 hover:bg-bookinBlue hover:text-bookinWhite transition-colors flex justify-center items-center gap-2 font-medium text-sm">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                `;
                bookGrid.insertAdjacentHTML('beforeend', bookHTML);
            });
        }

        // Init Filter Buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => {
                    b.classList.remove('active', 'bg-bookinGold', 'text-bookinWhite');
                    b.classList.add('border-bookinGold/50', 'text-gray-300');
                });
                e.target.classList.add('active', 'bg-bookinGold', 'text-bookinWhite');
                e.target.classList.remove('border-bookinGold/50', 'text-gray-300');
                renderBooks(e.target.dataset.filter);
            });
        });

        renderBooks(); // Initial render

        // --- 3. CART LOGIC ---
        let cart = [];
        const cartModal = document.getElementById('cart-modal');
        const cartDrawer = document.getElementById('cart-drawer');
        const cartBadge = document.getElementById('cart-badge');
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotalSpan = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        function toggleCart() {
            if (cartModal.classList.contains('hidden')) {
                cartModal.classList.remove('hidden');
                setTimeout(() => {
                    cartDrawer.classList.remove('translate-x-full');
                }, 10);
            } else {
                cartDrawer.classList.add('translate-x-full');
                setTimeout(() => {
                    cartModal.classList.add('hidden');
                }, 300);
            }
        }

        function addToCart(bookId) {
            const book = books.find(b => b.id === bookId);
            const existingItem = cart.find(item => item.id === bookId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...book, quantity: 1 });
            }
            
            updateCartUI();
            
            // Visual feedback (Open cart automatically or show small toast, here we open cart)
            if(cartModal.classList.contains('hidden')) toggleCart();
        }

        function removeFromCart(bookId) {
            cart = cart.filter(item => item.id !== bookId);
            updateCartUI();
        }

        function updateCartUI() {
            // Update Badge
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems;
            cartBadge.classList.toggle('opacity-0', totalItems === 0);

            // Update List
            cartItemsDiv.innerHTML = '';
            if (cart.length === 0) {
                cartItemsDiv.innerHTML = '<div class="text-center text-gray-500 mt-10">Votre panier est vide.</div>';
                checkoutBtn.disabled = true;
                cartTotalSpan.textContent = '0 $';
                return;
            }

            let total = 0;
            cart.forEach(item => {
                total += item.price * item.quantity;
                cartItemsDiv.insertAdjacentHTML('beforeend', `
                    <div class="flex gap-4 border-b border-gray-100 pb-4">
                        <img src="${item.img}" alt="${item.title}" class="w-16 h-20 object-cover rounded-sm">
                        <div class="flex-grow">
                            <h4 class="font-bold text-sm line-clamp-1">${item.title}</h4>
                            <p class="text-xs text-gray-500">${item.author}</p>
                            <div class="flex justify-between items-center mt-2">
                                <span class="font-bold text-bookinBlue">${item.price}$ x ${item.quantity}</span>
                                <button onclick="removeFromCart(${item.id})" class="text-red-500 text-xs hover:underline">Retirer</button>
                            </div>
                        </div>
                    </div>
                `);
            });

            cartTotalSpan.textContent = `${total} $`;
            checkoutBtn.disabled = false;
        }

        // --- 4. WHATSAPP CHECKOUT LOGIC ---
        function checkoutWhatsApp() {
            if (cart.length === 0) return;

            let message = "Bonjour l'équipe *BOOKIN* !%0A%0AJe souhaite passer une commande pour les livres suivants :%0A%0A";
            let total = 0;

            cart.forEach(item => {
                message += `- *${item.title}* par ${item.author} (x${item.quantity}) - ${item.price * item.quantity}$%0A`;
                total += item.price * item.quantity;
            });

            message += `%0A*Total de la commande : ${total}$*%0A%0AMerci de m'indiquer les modalités de paiement et de livraison.`;

            // Remplacer par le numéro WhatsApp réel de Bookin
            const phoneNumber = "243825879013"; 
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            
            window.open(whatsappUrl, '_blank');
        }

        // --- 5. HERO CAROUSEL LOGIC ---
        let currentSlide = 0;
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        
        function setSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('bg-bookinGold');
            dots[currentSlide].classList.add('bg-white/50');
            
            currentSlide = index;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.remove('bg-white/50');
            dots[currentSlide].classList.add('bg-bookinGold');
        }

        setInterval(() => {
            let nextSlide = (currentSlide + 1) % slides.length;
            setSlide(nextSlide);
        }, 5000);

        // --- 6. HEADER SCROLL EFFECT ---
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-lg');
                header.classList.replace('py-4', 'py-2');
            } else {
                header.classList.remove('shadow-lg');
                header.classList.replace('py-2', 'py-4');
            }
        });

        // --- 7. MOBILE MENU LOGIC ---
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

let menuOpen = false;

function toggleMobileMenu() {
    menuOpen = !menuOpen;

    if (menuOpen) {
        mobileMenu.classList.remove('translate-x-full');
        document.body.classList.add('overflow-hidden');
    } else {
        mobileMenu.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
    }
}

// Ouverture / fermeture via bouton
menuBtn.addEventListener('click', toggleMobileMenu);

// Fermeture lors du clic sur un lien
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
        menuOpen = false;
    });
});

// Fermeture automatique si écran desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        mobileMenu.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
        menuOpen = false;
    }
});