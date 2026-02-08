import "vanilla-cookieconsent/dist/cookieconsent.css";
import "~/assets/css/cookieconsent-custom.css"; // 自定义样式，在默认样式之后导入
import * as CookieConsent from "vanilla-cookieconsent";

// Type declarations for Google Analytics
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
        gtag_report_conversion: (url?: string) => boolean;
    }
}

// Helper function to load Google Analytics
function loadGoogleAnalytics() {
    // // Check if gtag is already loaded
    // if (typeof (window as any).gtag !== 'undefined') {
    //     return;
    // }

    // // Load gtag.js script
    // const script = document.createElement('script');
    // script.async = true;
    // script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-10801798623';
    // document.head.appendChild(script);

    // // Initialize gtag
    // script.onload = () => {
    //     (window as any).dataLayer = (window as any).dataLayer || [];
    //     function gtag(...args: any[]) {
    //         (window as any).dataLayer.push(args);
    //     }
    //     (window as any).gtag = gtag;
        
    //     gtag('js', new Date());
    //     gtag('config', 'AW-10801798623');
        
    //     // Define conversion helper
    //     (window as any).gtag_report_conversion = function(url?: string) {
    //         const callback = function() {
    //             if (typeof url !== 'undefined') {
    //                 window.location.href = url;
    //             }
    //         };
    //         gtag('event', 'conversion', {
    //             'send_to': 'AW-10801798623/mSIWCPH6iIMYEN-72Z4o',
    //             'event_callback': callback
    //         });
    //         return false;
    //     };
    // };
}

export default defineNuxtPlugin(() => {
    CookieConsent.run({
        // Cookie configuration
        cookie: {
            name: "minnuo_cookie_consent",
            // domain: location.hostname,
            // path: '/',
            // sameSite: "Lax",
            expiresAfterDays: 365,
        },

        // Revision management - increment this number to force users to reconsent
        // 版本管理 - 增加此数字可以强制用户重新选择（包括之前拒绝的用户）
        revision: 0,

        // UI configuration
        guiOptions: {
            consentModal: {
                layout: "box inline",
                position: "bottom right", // Display at bottom right
                equalWeightButtons: true,
                flipButtons: false,
            },
            preferencesModal: {
                layout: "box",
                position: "right",
                equalWeightButtons: true,
                flipButtons: false,
            },
        },

        // Callback functions
        onFirstConsent: ({ cookie }) => {
            console.log("First consent given:", cookie);
        },

        onConsent: ({ cookie }) => {
            console.log("Consent given:", cookie);
            
            // If user rejected all cookies (only necessary), set shorter expiration
            // 如果用户拒绝了所有非必要 Cookie，设置较短的过期时间（7天后重新询问）
            const acceptedCategories = cookie.categories;
            const onlyNecessary = acceptedCategories.length === 1 && acceptedCategories.includes('necessary');
            
            if (onlyNecessary) {
                // User rejected, ask again in 7 days
                // Note: This only modifies the minnuo_cookie_consent cookie, no other cookies are affected
                const cookieName = 'minnuo_cookie_consent';
                const cookieValue = document.cookie
                    .split('; ')
                    .find(row => row.startsWith(`${cookieName}=`))
                    ?.split('=')[1];
                
                if (cookieValue) {
                    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
                    document.cookie = `${cookieName}=${cookieValue}; max-age=${maxAge}; path=/; SameSite=Lax`;
                    console.log("User rejected cookies, will ask again in 7 days");
                }
            }
            
            // Load analytics scripts if user accepted analytics
            if (acceptedCategories.includes('analytics')) {
                loadGoogleAnalytics();
            }
        },

        onChange: ({ changedCategories, changedServices }) => {
            console.log("Cookie preferences changed:", changedCategories, changedServices);
            // Reload page if analytics category changed to apply changes
            if (changedCategories.includes('analytics')) {
                window.location.reload();
            }
        },

        // Cookie categories
        categories: {
            necessary: {
                enabled: true, // Necessary cookies enabled by default
                readOnly: true, // Users cannot disable
            },
            analytics: {
                autoClear: {
                    cookies: [
                        {
                            name: /^_ga/, // Match all cookies starting with _ga
                        },
                        {
                            name: "_gid",
                        },
                    ],
                },
            },
            marketing: {},
        },

        // Language configuration (English)
        language: {
            default: "en",
            translations: {
                en: {
                    consentModal: {
                        title: "We use cookies",
                        description:
                            "We use cookies to enhance your browsing experience, analyze site traffic, and provide personalized content. By clicking 'Accept all', you consent to our use of cookies.",
                        acceptAllBtn: "Accept all",
                        acceptNecessaryBtn: "Reject all",
                        showPreferencesBtn: "Manage preferences",
                        footer: `
                            <a href="/privacy-policy" target="_blank">Privacy Policy</a>
                        `,
                    },
                    preferencesModal: {
                        title: "Cookie Preferences",
                        acceptAllBtn: "Accept all",
                        acceptNecessaryBtn: "Reject all",
                        savePreferencesBtn: "Save settings",
                        closeIconLabel: "Close",
                        serviceCounterLabel: "Service|Services",
                        sections: [
                            {
                                title: "Cookie Usage",
                                description:
                                    "We use cookies to ensure the basic functionality of our website and, with your consent, for analytics and marketing purposes. You can change your preferences at any time.",
                            },
                            {
                                title: "Strictly Necessary Cookies",
                                description:
                                    "These cookies are essential for the proper functioning of the website and cannot be disabled. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in or filling in forms.",
                                linkedCategory: "necessary",
                            },
                            {
                                title: "Analytics Cookies",
                                description:
                                    "These cookies help us understand how visitors interact with our website. All data is anonymized and cannot be used to identify you.",
                                linkedCategory: "analytics",
                            },
                            {
                                title: "Marketing Cookies",
                                description:
                                    "These cookies are used to show you ads that are more relevant to you and your interests. They may also be used to limit the number of times you see an ad and help measure the effectiveness of advertising campaigns.",
                                linkedCategory: "marketing",
                            },
                            {
                                title: "More Information",
                                description:
                                    'For any questions regarding our cookie policy and your choices, please <a href="/contact">contact us</a>.',
                            },
                        ],
                    },
                },
            },
        },
    });

    // Provide CookieConsent instance to the app
    return {
        provide: {
            cookieConsent: CookieConsent,
        },
    };
});

