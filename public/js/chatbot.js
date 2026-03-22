// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
  
  // Get elements
  const chatbotIcon = document.getElementById('chatbotIcon');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSend = document.getElementById('chatbotSend');
  const chatbotMessages = document.getElementById('chatbotMessages');

  // Open chatbot when clicking icon
  chatbotIcon.addEventListener('click', function() {
    chatbotWindow.classList.add('active');
  });

  // Close chatbot when clicking X
  chatbotClose.addEventListener('click', function() {
    chatbotWindow.classList.remove('active');
  });

  // Send message function
  function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message === '') return;

    // Add user message to chat
    addMessage(message, 'user');
    chatbotInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Get bot response after 1 second
    setTimeout(function() {
      removeTypingIndicator();
      getBotResponse(message);
    }, 1000);
  }

  // Add message to chat window
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + sender;
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Remove typing indicator
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Bot response logic
  function getBotResponse(message) {
    const msg = message.toLowerCase();
    let response = '';

    if (msg.includes('hello') || msg.includes('hi')) {
      response = 'Hello! How can I help you today?';
    }
    else if (msg.includes('product') || msg.includes('shop')) {
      response = 'Check out our products page for the latest smart wear collection!';
    }
    else if (msg.includes('price') || msg.includes('cost')) {
      response = 'Our products range from $49.99 to $199.99. Visit the products page for details!';
    }
    else if (msg.includes('discount') || msg.includes('offer')) {
      response = 'We have ongoing promotions! Check our offers page for current discounts.';
    }
    else if (msg.includes('shipping')) {
      response = 'Free shipping on orders over $50. Delivery takes 3-5 business days.';
    }
    else if (msg.includes('return')) {
      response = '30-day return policy. Items must be unused and in original packaging.';
    }
    else if (msg.includes('help')) {
      response = 'I can help with: products, prices, discounts, shipping, returns. What would you like to know?';
    }
    else {
      response = 'Thanks for your message! For immediate help, email support@smartwear.com';
    }

    addMessage(response, 'bot');
  }

  // Send button click
  chatbotSend.addEventListener('click', sendMessage);

  // Enter key press
  chatbotInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Close when clicking outside (optional)
  document.addEventListener('click', function(e) {
    if (!chatbotWindow.contains(e.target) && !chatbotIcon.contains(e.target)) {
      if (chatbotWindow.classList.contains('active')) {
        chatbotWindow.classList.remove('active');
      }
    }
  });

});