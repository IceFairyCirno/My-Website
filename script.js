document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.style.transform = 'scale(1.1)';
            setTimeout(() => {
                tag.style.transform = 'translateY(-2px)';
            }, 200);
        });
    });

    const subtitle = document.querySelector('.subtitle');
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    typeWriter();

    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (currentTheme === 'light') {
        document.body.classList.remove('dark-theme');
    }

    prefersDarkScheme.addListener((e) => {
        if (e.matches) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.textContent = '☀️';
    }

    // 主题切换功能
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        // 更新图标
        if (document.body.classList.contains('light-theme')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    });
}); 