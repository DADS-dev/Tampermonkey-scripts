// ==UserScript==
// @name         Toggle Ratings Cookie on Letterboxd
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Toggle the ratings visibility using a cookie on Letterboxd
// @author       DADS-dev
// @match        https://letterboxd.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to get a cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Function to set a cookie
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days*24*60*60*1000));
        const expires = `expires=${d.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }

    // Function to delete a cookie
    function deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    // Function to toggle the cookie
    function toggleCookie(button) {
        const cookieName = 'hideRatings';
        const cookieExists = getCookie(cookieName);

        if (cookieExists) {
            // If cookie exists, delete it
            deleteCookie(cookieName);
            console.log('Cookie deleted');
            button.style.backgroundColor = "#D37676";
            button.innerHTML = 'Toggle Ratings (OFF)';

        } else {
            // If cookie does not exist, create it
            setCookie(cookieName, 'true', 365);
            console.log('Cookie created');
            button.style.backgroundColor = "green";
            button.innerHTML = 'Toggle Ratings (ON)';

        }
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const targetDiv = document.querySelector('header section');
                if (targetDiv) {
                    const button = document.createElement('button');
                    button.style.color = '#fff';
                    button.style.border = 'none';
                    button.style.borderRadius = '5px';
                    button.style.cursor = 'pointer';
                    button.style.zIndex = '1000';
                    button.style.position = 'absolute';
                    button.style.bottom = '0';
                    button.style.right = '0';
                    targetDiv.appendChild(button);

                    const cookieName = 'hideRatings';
                    const cookieExists = getCookie(cookieName);
                    if(cookieExists){
                        button.style.backgroundColor = "green";
                        button.innerHTML = 'Toggle Ratings (ON)';

                    } else {
                        button.style.backgroundColor = "#D37676";
                        button.innerHTML = 'Toggle Ratings (OFF)';

                    }

                    // Add click event to the button
                    button.addEventListener('click', function() {
                        toggleCookie(button);
                    });

                    // Stop observing once the target div is found and modified
                    observer.disconnect();
                    break;
                }
            }
        }
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
})();
