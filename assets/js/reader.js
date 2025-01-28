document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const chapterSelect = document.querySelector('.chapter-select');
    const prevButtons = document.querySelectorAll('.prev-chapter');
    const nextButtons = document.querySelectorAll('.next-chapter');
    const currentChapterSpan = document.getElementById('current-chapter');
    const chapterContent = document.querySelector('.chapter-content');
    
    let currentChapter = parseInt(urlParams.get('chapter')) || 3;
    const seriesName = urlParams.get('series') || 'hclw';
    const seriesId = urlParams.get('id') || '31868';
    const maxChapter = 3;
    const minChapter = 0;

    function updateChapterUI(chapter) {
        currentChapterSpan.textContent = chapter;
        chapterSelect.value = chapter;
        
        prevButtons.forEach(button => button.disabled = chapter <= minChapter);
        nextButtons.forEach(button => button.disabled = chapter >= maxChapter);
        
        const images = [];
        for (let i = 1; i <= 3; i++) {
            images.push(`
                <img 
                    src="chapter-${chapter}-page-${i}.jpg" 
                    alt="Chapter ${chapter} Page ${i}" 
                    class="chapter-image"
                    loading="${i === 1 ? 'eager' : 'lazy'}"
                >
            `);
        }
        
        chapterContent.innerHTML = images.join('');
        
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('chapter', chapter);
        newUrl.searchParams.set('series', seriesName);
        newUrl.searchParams.set('id', seriesId);
        
        history.pushState(
            {chapter}, 
            `Chapter ${chapter} - ${seriesName.toUpperCase()}`,
            newUrl.toString()
        );
        
        document.title = `Chapter ${chapter} - ${seriesName.toUpperCase()}`;
    }

    function navigateChapter(direction) {
        const newChapter = currentChapter + direction;
        if (newChapter >= minChapter && newChapter <= maxChapter) {
            currentChapter = newChapter;
            updateChapterUI(currentChapter);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    chapterSelect.addEventListener('change', (e) => {
        currentChapter = parseInt(e.target.value);
        updateChapterUI(currentChapter);
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => navigateChapter(-1));
    });

    nextButtons.forEach(button => {
        button.addEventListener('click', () => navigateChapter(1));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            navigateChapter(-1);
        } else if (e.key === 'ArrowRight') {
            navigateChapter(1);
        }
    });

    window.addEventListener('popstate', (e) => {
        if (e.state && typeof e.state.chapter === 'number') {
            currentChapter = e.state.chapter;
            updateChapterUI(currentChapter);
        }
    });

    updateChapterUI(currentChapter);
});

function toggleCommentOptions() {
    const options = document.getElementById('comment-options');
    const button = document.querySelector('.icon-button');
    const isHidden = options.hidden;

    options.hidden = !isHidden;
    button.setAttribute('aria-expanded', !isHidden);
}

function switchTab(type) {
    const tabs = document.querySelectorAll('[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');

    tabs.forEach(tab => {
        tab.setAttribute('aria-selected', 'false');
    });

    panels.forEach(panel => {
        panel.hidden = true;
    });

    const selectedTab = document.getElementById(`${type}-tab`);
    const selectedPanel = document.getElementById(`${type}-panel`);

    selectedTab.setAttribute('aria-selected', 'true');
    selectedPanel.hidden = false;
}

(function() {
    var d = document, s = d.createElement('script');
    s.src = 'https://EXAMPLE.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();
