// GitHub Integration for Portfolio
const GITHUB_USERNAME = 'Ogmane007'; // Your GitHub username

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Set current year in footer
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! This is a demo form. In production, this would send your message.');
        contactForm.reset();
    });
}

// ==========================================
// GITHUB API INTEGRATION
// ==========================================

// Fetch GitHub Repositories
async function fetchGitHubRepos() {
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) return;

    try {
        // Show loading state
        projectsGrid.innerHTML = '<div class="loading">Loading projects from GitHub...</div>';

        // Fetch repositories
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();
        
        // Filter out forked repos and sort by stars
        const filteredRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6); // Show top 6 projects

        if (filteredRepos.length === 0) {
            projectsGrid.innerHTML = '<p class="no-projects">No projects found. Check back soon!</p>';
            return;
        }

        // Clear loading state
        projectsGrid.innerHTML = '';

        // Create project cards
        filteredRepos.forEach(repo => {
            const card = createProjectCard(repo);
            projectsGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        projectsGrid.innerHTML = `
            <div class="error-message">
                <p>Unable to load projects. Please visit my <a href="https://github.com/${GITHUB_USERNAME}" target="_blank">GitHub profile</a> directly.</p>
            </div>
        `;
    }
}

// Create a project card from repository data
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    // Get primary language color
    const languageColor = getLanguageColor(repo.language);
    
    // Determine image source (use topics or default)
    const imageUrl = getProjectImage(repo);

    card.innerHTML = `
        <div class="project-image">
            <img src="${imageUrl}" alt="${repo.name}" onerror="this.src='https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'">
            ${repo.homepage ? '<div class="live-badge">Live Demo</div>' : ''}
        </div>
        <div class="project-content">
            <h3>${formatRepoName(repo.name)}</h3>
            <p>${repo.description || 'No description available'}</p>
            
            <div class="project-stats">
                ${repo.language ? `<span class="language" style="color: ${languageColor}"><i class="fas fa-circle"></i> ${repo.language}</span>` : ''}
                <span class="stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span class="forks"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            </div>
            
            ${repo.topics && repo.topics.length > 0 ? `
                <div class="project-tech">
                    ${repo.topics.slice(0, 4).map(topic => `<span>${topic}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="project-links">
                ${repo.homepage ? `<a href="${repo.homepage}" class="btn small" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                <a href="${repo.html_url}" class="btn small secondary" target="_blank"><i class="fab fa-github"></i> View Code</a>
            </div>
        </div>
    `;

    return card;
}

// Format repository name (convert hyphens to spaces, capitalize)
function formatRepoName(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Get language color for display
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'PHP': '#4F5D95',
        'TypeScript': '#2b7489',
        'C++': '#f34b7d',
        'C': '#555555',
        'C#': '#178600',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33'
    };
    return colors[language] || '#6a11cb';
}

// Get project image based on topics or use default
function getProjectImage(repo) {
    const images = {
        'web': 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        'mobile': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        'api': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        'database': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        'cloud': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        'ai': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        'game': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    };

    if (repo.topics && repo.topics.length > 0) {
        for (const topic of repo.topics) {
            if (images[topic]) {
                return images[topic];
            }
        }
    }

    // Default image based on language
    if (repo.language === 'Python') return images.ai;
    if (repo.language === 'JavaScript') return images.web;
    
    return 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
}

// Fetch GitHub stats for hero section
async function fetchGitHubStats() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!response.ok) return;
        
        const data = await response.json();
        
        // You can display these stats somewhere on your page
        console.log('GitHub Stats:', {
            public_repos: data.public_repos,
            followers: data.followers,
            following: data.following
        });
        
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubRepos();
    fetchGitHubStats();
});

// Add refresh button functionality (optional)
function addRefreshButton() {
    const projectsSection = document.querySelector('.projects .container');
    if (!projectsSection) return;

    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'btn primary refresh-btn';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Projects';
    refreshBtn.style.margin = '20px auto';
    refreshBtn.style.display = 'block';
    
    refreshBtn.addEventListener('click', () => {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        refreshBtn.disabled = true;
        fetchGitHubRepos().then(() => {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Projects';
            refreshBtn.disabled = false;
        });
    });
    
    projectsSection.appendChild(refreshBtn);
}

// Optionally add refresh button
// addRefreshButton();