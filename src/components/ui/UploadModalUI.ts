function renderUploadModalUI(): string {
	return `
<!-- Add gradient styles -->
<style>
  .gradient-text {
    background: linear-gradient(90deg, #0ea5e9, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .btn-gradient {
    background: linear-gradient(90deg, #0ea5e9, #ec4899);
    transition: all 0.3s ease;
  }
  
  .btn-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .modal-card {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-top: 4px solid transparent;
    border-image: linear-gradient(to right, #0ea5e9, #ec4899);
    border-image-slice: 1;
    transform: translateY(0);
    transition: transform 0.3s ease-out;
  }
  
  .modal-enter {
    animation: modalEnter 0.3s forwards;
  }
  
  @keyframes modalEnter {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

<!-- Custom Modal -->
<div id="customModal" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center hidden transition-opacity duration-300">
    <div class="bg-white rounded-github-md p-6 max-w-md w-full mx-4 modal-card">
        <div class="flex justify-between items-start mb-4">
            <h3 id="modalTitle" class="text-2xl font-bold gradient-text"></h3>
            <button id="closeModal" class="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <div id="modalContent" class="mb-6 text-gray-600"></div>
        <div id="modalActions" class="flex justify-end space-x-3">
            <a id="modalLink" href="#" target="_blank" class="btn-gradient text-white px-5 py-2 rounded-github-md transition hidden">
                Open Link
            </a>
            <button id="modalDismiss" class="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-github-md hover:bg-gray-50 hover:shadow-md transition">
                Dismiss
            </button>
        </div>
    </div>
</div>
    `;
}

function renderUploadModalScripts(): string {
	return `
    // Modal functions
    function showModal(title, message, linkUrl = null) {
        const modal = document.getElementById('customModal');
        const modalCard = document.querySelector('.modal-card');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        const modalLink = document.getElementById('modalLink');
        
        modalTitle.textContent = title;
        modalContent.textContent = message;
        
        if (linkUrl) {
            modalLink.href = linkUrl;
            modalLink.classList.remove('hidden');
        } else {
            modalLink.classList.add('hidden');
        }
        
        modal.classList.remove('hidden');
        modalCard.classList.add('modal-enter');
        
        // Focus trap for accessibility
        setTimeout(() => {
            document.getElementById('closeModal').focus();
        }, 100);
    }
    
    function hideModal() {
        const modal = document.getElementById('customModal');
        const modalCard = document.querySelector('.modal-card');
        
        modalCard.style.transform = 'translateY(10px)';
        modalCard.style.opacity = '0';
        
        setTimeout(() => {
            modal.classList.add('hidden');
            modalCard.style.transform = '';
            modalCard.style.opacity = '';
            modalCard.classList.remove('modal-enter');
        }, 200);
    }
    
    // Modal event listeners
    document.getElementById('closeModal').addEventListener('click', hideModal);
    document.getElementById('modalDismiss').addEventListener('click', hideModal);
    
    // Close modal when clicking outside
    document.getElementById('customModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('customModal')) {
            hideModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !document.getElementById('customModal').classList.contains('hidden')) {
            hideModal();
        }
    });
    `;
}

export { renderUploadModalUI, renderUploadModalScripts };
