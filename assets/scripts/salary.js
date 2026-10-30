(() => {
    const form = document.getElementById('salary-form')
    if (!form) return

    const field = (name) => form.elements[name]
    const output = (name) => document.querySelector(`[data-out="${name}"]`)

    const positive = (value) => {
        const number = parseFloat(String(value).replace(',', '.'))
        return Number.isFinite(number) && number > 0 ? number : 0
    }

    const money = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    const render = () => {
        const amount = positive(field('amount').value)
        const per = field('per').value
        const hours = positive(field('hours').value)
        const weeks = Math.min(positive(field('weeks').value), 52)
        const ready = amount > 0 && hours > 0 && weeks > 0
        document.querySelector('[data-salary-ready]').hidden = !ready
        document.querySelector('[data-salary-empty]').hidden = ready
        if (!ready) return
        const yearlyHours = hours * weeks
        const yearly = {
            hour: amount * yearlyHours,
            week: amount * weeks,
            month: amount * 12,
            year: amount
        }[per]
        const hourly = yearly / yearlyHours
        output('hourly').textContent = money(hourly)
        output('daily').textContent = money(hourly * hours / 5)
        output('weekly').textContent = money(yearly / weeks)
        output('biweekly').textContent = money(yearly / weeks * 2)
        output('monthly').textContent = money(yearly / 12)
        output('yearly').textContent = money(yearly)
        document.querySelector('[data-salary-link]').href = `/?w=${Math.round(hourly * 100) / 100}`
    }

    form.addEventListener('input', render)
    form.addEventListener('change', render)
    form.addEventListener('submit', (event) => event.preventDefault())
    render()
})()
