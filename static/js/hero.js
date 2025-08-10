document.addEventListener('DOMContentLoaded', function() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  const blogPosts = document.querySelectorAll('.blog-post');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const selectedCategory = this.dataset.category;
      
      filterPosts(selectedCategory);
      
      animateButton(this);
    });
  });
  
  function filterPosts(category) {
    if (!blogPosts.length) return;
    
    blogPosts.forEach((post, index) => {
      const postCategories = post.dataset.categories ? post.dataset.categories.split(',') : [];
      
      if (category === 'all') {
        showPost(post, index * 50);
      } else {
        const categoryMap = {
          'ooi': '大井競馬',
          'funabashi': '船橋競馬',
          'kawasaki': '川崎競馬',
          'urawa': '浦和競馬'
        };
        
        if (postCategories.includes(categoryMap[category])) {
          showPost(post, index * 50);
        } else {
          hidePost(post);
        }
      }
    });
  }
  
  function showPost(post, delay = 0) {
    setTimeout(() => {
      post.style.display = 'block';
      post.style.opacity = '0';
      post.style.transform = 'translateY(20px)';
      
      requestAnimationFrame(() => {
        post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        post.style.opacity = '1';
        post.style.transform = 'translateY(0)';
      });
    }, delay);
  }
  
  function hidePost(post) {
    post.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    post.style.opacity = '0';
    post.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      post.style.display = 'none';
    }, 200);
  }
  
  function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
  }
  
  const progressCircles = document.querySelectorAll('.progress-fill');
  progressCircles.forEach(circle => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          circle.style.strokeDashoffset = '42.412';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    if (circle) {
      observer.observe(circle);
    }
  });
  
  const floatingCards = document.querySelectorAll('.card');
  floatingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.animationPlayState = 'paused';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.animationPlayState = 'running';
    });
  });
  
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      
      const decorationCircles = document.querySelectorAll('.decoration-circle');
      decorationCircles.forEach((circle, index) => {
        const speed = parallaxSpeed * (index + 1) * 0.5;
        circle.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }
  
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const finalValue = parseInt(stat.textContent);
    let currentValue = 0;
    const increment = finalValue / 50;
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= finalValue) {
        currentValue = finalValue;
        clearInterval(timer);
      }
      stat.textContent = Math.floor(currentValue);
    }, 30);
  });
  
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.querySelector('.title-main').textContent;
    const words = text.split('');
    heroTitle.querySelector('.title-main').innerHTML = words.map((char, index) => 
      `<span style="animation-delay: ${index * 0.05}s" class="char-animate">${char}</span>`
    ).join('');
  }
});

const heroStyle = document.createElement('style');
heroStyle.textContent = `
  .char-animate {
    display: inline-block;
    opacity: 0;
    animation: charFadeIn 0.5s ease forwards;
  }
  
  @keyframes charFadeIn {
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(heroStyle);