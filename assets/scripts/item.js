(() => {
    const form = document.getElementById('item-calculator')
    if (!form) return

    const input = form.querySelector('#item-wage')
    const output = form.querySelector('.try-result')
    const link = form.querySelector('[data-item-link]')
    const price = parseFloat(form.dataset.price)
    const name = output.textContent.split(' would cost you')[0]

    const hoursParts = (hours) => {
        const minutes = Math.round(hours * 60)
        if (minutes < 60) {
            const count = Math.max(1, minutes)
            return { figure: String(count), unit: count === 1 ? 'minute' : 'minutes' }
        }
        const rounded = Math.round(hours * 10) / 10
        const figure = hours < 100 ? rounded.toLocaleString('en-US', { maximumFractionDigits: 1 }) : Math.round(hours).toLocaleString('en-US')
        return { figure, unit: figure === '1' ? 'hour' : 'hours' }
    }

    const render = () => {
        const wage = parseFloat(String(input.value).replace(',', '.'))
        output.replaceChildren()
        if (!Number.isFinite(wage) || wage <= 0) {
            output.textContent = 'Type your hourly pay to see the hours.'
            return
        }
        const { figure, unit } = hoursParts(price / wage)
        const strong = document.createElement('strong')
        strong.textContent = `${figure} ${unit}`
        output.append(`${name} would cost you `, strong, ' of work.')
        link.href = `/?p=${price}&w=${wage}`
    }

    form.addEventListener('submit', (event) => event.preventDefault())
    input.addEventListener('input', render)
})()
