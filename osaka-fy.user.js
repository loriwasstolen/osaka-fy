// ==UserScript==
// @name         Osaka-fy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  replaces every image and text into osaka.
// @author       loriwasstolen
// @match        *://*/*
// @icon         https://i.pinimg.com/736x/83/10/d3/8310d3a888d87d83633691d0cdf077d3.jpg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // --- LOAD SETTINGS ---
    const config = {
        replaceImages: GM_getValue('replaceImages', true),
        replaceText: GM_getValue('replaceText', true),
        replaceBackgrounds: GM_getValue('replaceBackgrounds', false),
        replaceFavicon: GM_getValue('replaceFavicon', true),
        replaceTitle: GM_getValue('replaceTitle', true)
    };

    // --- ASSETS ---
    const osakaImages = [
        "https://i.pinimg.com/736x/13/f3/15/13f315301c28e43af8413b4dd6937983.jpg",
        "https://i.pinimg.com/736x/37/32/57/373257cb9b4e800cb5e5cbef0484bcf8.jpg",
        "https://i.pinimg.com/474x/40/16/29/40162974d1f56f07eb1b0435c17d1144.jpg",
        "https://i.pinimg.com/736x/8f/9b/7f/8f9b7f5c930075a713d5370149ec3d18.jpg",
        "https://i.pinimg.com/736x/83/10/d3/8310d3a888d87d83633691d0cdf077d3.jpg",
        "https://i.pinimg.com/736x/78/8b/f3/788bf3b7848b606cf6602dfc3cd4035e.jpg",
        "https://i.pinimg.com/736x/03/03/88/0303880ad162277e65c37019c2819a3d.jpg"
    ];

    const osakaQuotes = [
        "Sata Andagi!", "SATA ANDAGI", "Oh my gah!", "Nande!?", "America ya :D", "HALLO :D", "Osaka.",
        "That's not grains of truth... that's the truth about grain!",
        "I was all alone in my room... when suddenly, outta nowhere... The smell of a fart that wasn't mine wafted into my nose.",
        "I always wanted to go to the ocean and ride a dolphin.",
        "Maybe it's a ghost?", "Do you think Chiyo-chan can fly if she takes her pigtails off?",
        "Chiyo-chan!", "Tomo-chan?", "I'll wake her up.", "Just give me the knife.", "Woof!",
        "Ah!", "My eyes are swimming...", "I guess I'm just an airhead.", "Hiccups... won't stop.",
        "Why is it... that you are a cat?", "Are you hallucinating again?"
    ];

    // Short quotes specifically for the tab title so it fits
    const shortQuotes = [
        "Sata Andagi!", "Oh my gah!", "Nande!?", "Osaka.",
        "America ya :D", "HALLO :D", "Woof!", "Ah!", "Chiyo-chan!"
    ];

    // --- MENU LOGIC ---
    function createSettingsMenu() {
        if (document.getElementById('osaka-settings-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'osaka-settings-modal';
        modal.style.cssText = `
            position: fixed; top: 20px; right: 20px; width: 300px;
            background: #fff; border: 3px solid #000; z-index: 2147483647;
            padding: 15px; font-family: sans-serif;
            box-shadow: 8px 8px 0px #000; color: black; text-align: left;
        `;

        modal.innerHTML = `
            <h2 style="margin-top:0; border-bottom: 2px solid #eee; padding-bottom: 10px;">Osaka Settings :D</h2>
            <div style="display:flex; flex-direction: column; gap: 10px;">
                <label><input type="checkbox" id="osaka-img" ${config.replaceImages ? 'checked' : ''}> Replace Images</label>
                <label><input type="checkbox" id="osaka-txt" ${config.replaceText ? 'checked' : ''}> Replace Text</label>
                <label><input type="checkbox" id="osaka-bg" ${config.replaceBackgrounds ? 'checked' : ''}> Replace Backgrounds</label>
                <label><input type="checkbox" id="osaka-fav" ${config.replaceFavicon ? 'checked' : ''}> Osaka Favicon (Rotates)</label>
                <label><input type="checkbox" id="osaka-tit" ${config.replaceTitle ? 'checked' : ''}> Tab Title (Rotates)</label>
            </div>
            <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                <button id="osaka-save" style="width: 100%; padding: 8px; background: #000; color: #fff; border: none; cursor: pointer; font-weight: bold;">SAVE & RELOAD</button>
            </div>
            <button id="osaka-close" style="margin-top: 5px; width: 100%; padding: 5px; background: transparent; color: #555; border: none; cursor: pointer; font-size: 0.8em;">close</button>
        `;

        document.body.appendChild(modal);

        document.getElementById('osaka-save').onclick = () => {
            GM_setValue('replaceImages', document.getElementById('osaka-img').checked);
            GM_setValue('replaceText', document.getElementById('osaka-txt').checked);
            GM_setValue('replaceBackgrounds', document.getElementById('osaka-bg').checked);
            GM_setValue('replaceFavicon', document.getElementById('osaka-fav').checked);
            GM_setValue('replaceTitle', document.getElementById('osaka-tit').checked);
            location.reload();
        };

        document.getElementById('osaka-close').onclick = () => modal.remove();
    }

    GM_registerMenuCommand("Open Osaka Settings", createSettingsMenu);

    // --- CORE LOGIC ---

    function getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getAssignedOsaka(element) {
        if (!element.dataset.assignedOsaka) {
            element.dataset.assignedOsaka = getRandom(osakaImages);
        }
        return element.dataset.assignedOsaka;
    }

    // --- TAB & FAVICON LOGIC ---
    function updateFavicon() {
        if (!config.replaceFavicon) return;

        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
            link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            document.head.appendChild(link);
        }
        // Remove other icons
        document.querySelectorAll("link[rel*='icon']").forEach(el => {
            if (el !== link) el.remove();
        });
        link.href = getRandom(osakaImages);
    }

    function updateTitle() {
        if (!config.replaceTitle) return;
        document.title = getRandom(shortQuotes);
    }

    // --- DOM LOGIC ---

    function osakaFyImage(img) {
        if (!config.replaceImages) return;
        if (img.closest('#osaka-settings-modal')) return;

        const targetSrc = getAssignedOsaka(img);
        if (img.src !== targetSrc) {
            img.src = targetSrc;
        }

        if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
        if (img.hasAttribute('data-thumb')) img.removeAttribute('data-thumb');

        img.style.objectFit = "cover";
        img.style.opacity = "1";
    }

    function osakaFyText(node) {
        if (!config.replaceText) return;
        if (node.parentElement && node.parentElement.closest('#osaka-settings-modal')) return;

        const text = node.nodeValue.trim();
        if (text.length > 0 && !osakaQuotes.includes(text)) {
            node.nodeValue = getRandom(osakaQuotes);
        }
    }

    function osakaFyPlaceholder(input) {
         if (!config.replaceText) return;
         if(input.placeholder && input.placeholder !== "Sata Andagi") {
             input.placeholder = "Sata Andagi...";
         }
    }

    function osakaFyBackground(element) {
        if (!config.replaceBackgrounds) return;
        if (element.closest('#osaka-settings-modal')) return;

        try {
            const style = window.getComputedStyle(element);
            if (style.backgroundImage !== 'none' && style.backgroundImage.includes('url') && !element.dataset.osakafiedBg) {
                element.style.backgroundImage = `url(${getRandom(osakaImages)})`;
                element.dataset.osakafiedBg = "true";
            }
        } catch(e) {}
    }

    function traverseAndOsakafy(root) {
        if (config.replaceImages) {
            const images = root.tagName === 'IMG' ? [root] : root.querySelectorAll('img');
            images.forEach(img => osakaFyImage(img));
        }

        if (config.replaceBackgrounds) {
            const divs = root.querySelectorAll('div, section, header, footer');
            divs.forEach(div => osakaFyBackground(div));
        }

        if (config.replaceText) {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                if (node.parentElement &&
                    ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'CODE'].indexOf(node.parentElement.tagName) === -1) {
                    osakaFyText(node);
                }
            }
            const inputs = root.querySelectorAll('input, textarea');
            inputs.forEach(input => osakaFyPlaceholder(input));
        }
    }

    // --- OBSERVERS ---

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) traverseAndOsakafy(node);
                });
            } else if (mutation.type === 'attributes' && config.replaceImages) {
                if (mutation.target.tagName === 'IMG') {
                    const img = mutation.target;
                    const assigned = getAssignedOsaka(img);
                    if (img.src !== assigned || img.hasAttribute('srcset')) {
                        osakaFyImage(img);
                    }
                }
            }
        });
    });

    function init() {
        if (!document.body) {
            window.requestAnimationFrame(init);
            return;
        }

        // Initial setup
        traverseAndOsakafy(document.body);
        updateTitle();
        updateFavicon();

        // Rotation Interval (15 seconds) for Favicon and Title
        setInterval(() => {
            updateTitle();
            updateFavicon();
        }, 15000);

        // Observer for dynamic content
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'srcset', 'data-thumb']
        });

        // Backup Interval (2 seconds) for missed elements
        setInterval(() => {
            traverseAndOsakafy(document.body);
        }, 2000);
    }

    init();

})();