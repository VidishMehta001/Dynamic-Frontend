import posthog from "posthog-js";

posthog.init(import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST,
    autocapture: true,
    capture_mode: 'debug',
});

posthog.identify('vidish-test-user', {
    email: 'vpm28@cornell.edu',
    project: 'LLM AB Test'
})

export default posthog