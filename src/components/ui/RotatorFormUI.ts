interface RotatorFormUIProps {
	shortDomain?: string;
}

function renderRotatorFormUI({ shortDomain }: RotatorFormUIProps = {}): string {
	return `
<style>
  .gradient-text {
    background: linear-gradient(90deg, #FFC107, #FF8A00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .form-card {
    transition: all 0.3s ease;
    border-radius: 24px;
    border: 2px solid #FFF;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
  
  .input-focus:focus {
    border-color: transparent;
    box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.3);
  }
  
  .btn-gradient {
    background: #000;
    color: white;
    border-radius: 50px;
    transition: all 0.2s ease;
  }
  
  .btn-gradient:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
  
  .success-gradient {
    background: linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
    border: none;
    border-left: 4px solid #10b981;
  }
  
  .destination-item {
    background: #fff;
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }
  
  .destination-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #d1d5db;
  }
  
  .strategy-card {
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .strategy-card:hover {
    border-color: #FFC107;
    background: rgba(255, 193, 7, 0.05);
  }
  
  .strategy-card.selected {
    border-color: #FFC107;
    background: rgba(255, 193, 7, 0.1);
  }
</style>

<div class="bg-white shadow-xl rounded-xl p-6 md:p-8 max-w-4xl mx-auto form-card">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2 gradient-text">Create A/B Test Link</h1>
      <p class="text-gray-500">One short URL that rotates between multiple destinations</p>
    </div>
    
    <div class="success-gradient rounded-lg p-4 mb-6 hidden" id="success-alert">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span id="success-message" class="text-green-700 font-medium"></span>
        </div>
        <button id="copy-button" class="ml-4 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-sm rounded-md transition-colors duration-200 flex items-center gap-1" style="display: none;">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
          </svg>
          Copy
        </button>
      </div>
    </div>
    
    <form id="rotatorForm" class="space-y-6">
        <!-- Basic Info -->
        <div class="space-y-4">
            <div>
                <label for="rotatorName" class="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input type="text" id="rotatorName" name="rotatorName" required
                    placeholder="e.g., Landing Page A/B Test"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                <p class="text-xs text-gray-500 mt-1">Internal name to identify this rotator</p>
            </div>

            <div>
                <label for="customCode" class="block text-sm font-medium text-gray-700 mb-1">Short URL</label>
                <div class="flex items-start">
                    <div class="relative flex-grow">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-500 font-medium">
                        ${shortDomain}/
                      </div>
                      <input type="text" id="customCode" name="customCode" required
                        placeholder="your-test"
                        class="pl-[72px] block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                    </div>
                    <button type="button" class="ml-3 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-300"
                      onclick="document.querySelector('#customCode').value = 'test-' + Math.random().toString(36).substr(2, 6);">
                      Random
                    </button>
                </div>
            </div>

            <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea id="description" name="description" rows="2"
                    placeholder="What is this test for?"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition resize-none"></textarea>
            </div>
        </div>

        <!-- Strategy Selection -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Rotation Strategy</label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="strategy-card selected" data-strategy="round-robin" onclick="selectStrategy('round-robin')">
                    <div class="flex items-center mb-2">
                        <input type="radio" name="strategy" value="round-robin" checked class="mr-2">
                        <h3 class="font-semibold text-gray-800">Round Robin</h3>
                    </div>
                    <p class="text-sm text-gray-600">Cycles through destinations in order. Equal distribution.</p>
                </div>
                
                <div class="strategy-card" data-strategy="weighted" onclick="selectStrategy('weighted')">
                    <div class="flex items-center mb-2">
                        <input type="radio" name="strategy" value="weighted" class="mr-2">
                        <h3 class="font-semibold text-gray-800">Weighted</h3>
                    </div>
                    <p class="text-sm text-gray-600">Distribute by percentage. Great for A/B testing.</p>
                </div>
                
                <div class="strategy-card" data-strategy="random" onclick="selectStrategy('random')">
                    <div class="flex items-center mb-2">
                        <input type="radio" name="strategy" value="random" class="mr-2">
                        <h3 class="font-semibold text-gray-800">Random</h3>
                    </div>
                    <p class="text-sm text-gray-600">Truly random selection each time.</p>
                </div>
            </div>
        </div>

        <!-- Destinations -->
        <div>
            <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-medium text-gray-700">Destination URLs</label>
                <button type="button" id="addDestinationBtn" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                    + Add URL
                </button>
            </div>
            <div id="destinationsContainer" class="space-y-3">
                <!-- Destinations will be added here -->
            </div>
            <p class="text-xs text-gray-500 mt-2">Add at least 2 destination URLs</p>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
            <button type="submit"
                    class="w-full btn-gradient text-white font-medium py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-300">
                Create Rotator Link
            </button>
        </div>
    </form>
</div>

<!-- Destination Template -->
<template id="destinationTemplate">
    <div class="destination-item">
        <div class="flex items-start gap-4">
            <div class="flex-grow space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
                    <input type="url" class="destination-url w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                        placeholder="https://example.com/page-a" required>
                </div>
                <div class="weight-container hidden">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Weight (%)</label>
                    <input type="number" class="destination-weight w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                        min="1" max="100" value="50" placeholder="50">
                    <p class="text-xs text-gray-500 mt-1">Percentage of traffic to send here</p>
                </div>
            </div>
            <button type="button" class="remove-destination text-red-400 hover:text-red-600 mt-8" title="Remove">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    </div>
</template>
    `;
}

function renderRotatorFormScripts(shortDomain: string): string {
	return `
    // Load clipboard.js
    const clipboardScript = document.createElement('script');
    clipboardScript.src = '/assets/clipboard.min.js';
    document.head.appendChild(clipboardScript);

    let currentStrategy = 'round-robin';

    // Strategy selection
    function selectStrategy(strategy) {
        currentStrategy = strategy;
        document.querySelectorAll('.strategy-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(\`[data-strategy="\${strategy}"]\`).classList.add('selected');
        document.querySelector(\`input[value="\${strategy}"]\`).checked = true;
        
        // Show/hide weight inputs
        const weightContainers = document.querySelectorAll('.weight-container');
        if (strategy === 'weighted') {
            weightContainers.forEach(container => container.classList.remove('hidden'));
        } else {
            weightContainers.forEach(container => container.classList.add('hidden'));
        }
    }
    window.selectStrategy = selectStrategy;

    // Add destination
    function addDestination(url = '', weight = 50) {
        const template = document.getElementById('destinationTemplate');
        const clone = template.content.cloneNode(true);
        const destinationItem = clone.querySelector('.destination-item');
        
        if (url) {
            destinationItem.querySelector('.destination-url').value = url;
        }
        if (weight) {
            destinationItem.querySelector('.destination-weight').value = weight;
        }
        
        // Show weight input if weighted strategy
        if (currentStrategy === 'weighted') {
            destinationItem.querySelector('.weight-container').classList.remove('hidden');
        }
        
        // Remove button handler
        destinationItem.querySelector('.remove-destination').addEventListener('click', function() {
            const container = document.getElementById('destinationsContainer');
            const itemCount = container.querySelectorAll('.destination-item').length;
            
            // Prevent removing if only 2 destinations left
            if (itemCount <= 2) {
                alert('You must have at least 2 destinations');
                return;
            }
            
            destinationItem.remove();
        });
        
        document.getElementById('destinationsContainer').appendChild(clone);
    }

    // Add initial destinations
    addDestination();
    addDestination();

    // Add destination button
    document.getElementById('addDestinationBtn').addEventListener('click', () => {
        addDestination();
    });

    // Form submission
    document.getElementById('rotatorForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const rotatorName = document.getElementById('rotatorName').value.trim();
        const customCode = document.getElementById('customCode').value.trim();
        const description = document.getElementById('description').value.trim();
        const strategy = document.querySelector('input[name="strategy"]:checked').value;
        
        // Collect destinations
        const destinations = [];
        document.querySelectorAll('.destination-item').forEach(item => {
            const url = item.querySelector('.destination-url').value.trim();
            const weight = parseInt(item.querySelector('.destination-weight').value) || 1;
            
            if (url) {
                destinations.push({ url, weight });
            }
        });
        
        // Validation
        if (destinations.length < 2) {
            alert('Please add at least 2 destination URLs');
            return;
        }
        
        if (!customCode) {
            alert('Please enter a short URL');
            return;
        }
        
        // Validate weights for weighted strategy
        if (strategy === 'weighted') {
            const totalWeight = destinations.reduce((sum, dest) => sum + dest.weight, 0);
            if (totalWeight !== 100) {
                alert(\`Weights must add up to 100% (currently \${totalWeight}%)\`);
                return;
            }
        }
        
        const submitButton = document.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Creating...';
        submitButton.disabled = true;

        try {
            const response = await fetch('/api/rotator/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shortcode: customCode,
                    name: rotatorName,
                    description: description || null,
                    strategy: strategy,
                    destinations: destinations
                }),
            });

            const data = await response.json();
            const successAlert = document.querySelector('#success-alert');
            const successMessage = document.querySelector('#success-message');
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to create rotator');
            }
            
            const shortUrl = 'https://${shortDomain}/' + data.shortcode;
            successMessage.textContent = 'Rotator link created: ' + shortUrl;
            successAlert.classList.remove('hidden');
            
            // Show and setup copy button
            const copyButton = document.querySelector('#copy-button');
            copyButton.style.display = 'flex';
            copyButton.setAttribute('data-clipboard-text', shortUrl);
            
            // Initialize clipboard.js when available
            const initClipboard = () => {
                if (typeof ClipboardJS !== 'undefined') {
                    const clipboard = new ClipboardJS('#copy-button');
                    clipboard.on('success', function(e) {
                        const originalText = copyButton.innerHTML;
                        copyButton.innerHTML = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Copied!';
                        setTimeout(() => {
                            copyButton.innerHTML = originalText;
                        }, 2000);
                    });
                } else {
                    setTimeout(initClipboard, 100);
                }
            };
            initClipboard();
            
            // Clear form
            document.getElementById('rotatorForm').reset();
            document.getElementById('destinationsContainer').innerHTML = '';
            addDestination();
            addDestination();
            selectStrategy('round-robin');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error creating rotator:', error);
            alert('Error creating rotator: ' + error.message);
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
    `;
}

export { renderRotatorFormUI, renderRotatorFormScripts };
