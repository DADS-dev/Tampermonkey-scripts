// ==UserScript==
// @name         letterboxd-hide-ratings
// @namespace    http://tampermonkey.net/
// @version      2024-07-20
// @description  Hide rattings for films not watched if the hideRatings cookie exists and == true
// @author       DADS-dev
// @match        https://letterboxd.com/film*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const cookieName = 'hideRatings';
    const cookieExists = getCookie(cookieName);

    if (cookieExists) {
        console.log('Cookie exists, checking for Watch button');

        // Observer for span.action-watch
        const observerWatch = new MutationObserver((mutationsList, observer) => {
            const watchSpan = document.querySelector('span.action');
            if (watchSpan && watchSpan.textContent.trim() === 'Watch') {
                console.log('Watch button detected with text "Watch"');

                // Observer for rating histogram
                const observerHistogram = new MutationObserver((mutationsList) => {
                    console.log('ObserverHistogram: Checking mutations...');
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            const targetDiv = document.querySelector('div.rating-histogram');
                            if (targetDiv) {
                                console.log('Hiding rating histogram');
                                targetDiv.innerHTML = 'Ratings hidden';
                                observerHistogram.disconnect();
                                break;
                            }
                        }
                    }
                });

                // Observer for average rating
                const observerRating = new MutationObserver((mutationsList) => {
                    console.log('ObserverRating: Checking mutations...');
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            const targetDiv = document.querySelector('span.average-rating');
                            if (targetDiv) {
                                console.log('Hiding average rating');
                                targetDiv.innerHTML = '';
                                observerRating.disconnect();
                                break;
                            }
                        }
                    }
                });
                observerHistogram.observe(document.body, { childList: true, subtree: true });
                observerRating.observe(document.body, { childList: true, subtree: true });

                setTimeout(() => {
                    observerRating.disconnect(); // Stop observing
                    observerHistogram.disconnect(); // Stop observing
                }, 5000); // Check after 5 seconds if the button hasn't appeared

                // Disconnect the observerWatch after detecting the 'Watch' button
                observerWatch.disconnect();
            }
        });

        // Start observing the document body for added nodes
        observerWatch.observe(document.body, { childList: true, subtree: true });

        // Optionally, add a fallback to handle the case where the element is never added
        setTimeout(() => {
            observerWatch.disconnect(); // Stop observing
        }, 5000); // Check after 5 seconds if the button hasn't appeared
    }

})();
