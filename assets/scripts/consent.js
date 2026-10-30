window.googlefc = window.googlefc || {}
window.googlefc.callbackQueue = window.googlefc.callbackQueue || []

document.querySelectorAll('[data-consent-settings]').forEach((button) => {
    button.addEventListener('click', () => {
        window.googlefc.callbackQueue.push(() => window.googlefc.showRevocationMessage())
    })
})
