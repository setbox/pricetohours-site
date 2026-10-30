(() => {
    const root = document.getElementById('calculator')
    if (!root) return

    const form = document.getElementById('calc-form')
    const result = document.getElementById('result')
    const find = (selector) => document.querySelector(selector)
    const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const CURRENCIES = ['$', 'R$', '€', '£']
    const PERIODS = ['year', 'month', 'week', 'day']
    const FIELDS = ['p', 'c', 'm', 'w', 's', 'per', 'h', 'd', 't', 'n', 'e']
    const MAX_YEARS = 100
    const LIMIT_KEY = 'pth-limit-rotation'
    const LIMIT_MESSAGES = [
        {
            art: "<svg width=\"120\" height=\"132\" viewBox=\"0 0 120 132\" aria-hidden=\"true\"><ellipse cx=\"60\" cy=\"124\" rx=\"34\" ry=\"6\" fill=\"#363330\" opacity=\"0.12\"></ellipse><path d=\"M22 104 V54 a38 38 0 0 1 76 0 V104 l-12.7 -10 l-12.7 10 l-12.6 -10 l-12.7 10 l-12.6 -10 z\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"3\" stroke-linejoin=\"round\"></path><ellipse cx=\"46\" cy=\"56\" rx=\"5.5\" ry=\"7.5\" fill=\"#363330\"></ellipse><ellipse cx=\"74\" cy=\"56\" rx=\"5.5\" ry=\"7.5\" fill=\"#363330\"></ellipse><ellipse cx=\"60\" cy=\"76\" rx=\"6\" ry=\"7\" fill=\"#363330\"></ellipse><path d=\"M88 20 l4 -9 l4 9 l9 4 l-9 4 l-4 9 l-4 -9 l-9 -4 z\" fill=\"#FF7816\"></path></svg>",
            title: () => 'You would be a ghost by then.',
            body: (t) => `At your hourly rate, that is ${t.years} years of work. Double it and it is ${t.half}. Every raise brings this closer.`
        },
        {
            art: "<svg width=\"140\" height=\"132\" viewBox=\"0 0 140 132\" aria-hidden=\"true\"><path d=\"M38 116 V52 a32 32 0 0 1 64 0 V116 z\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"3\" stroke-linejoin=\"round\"></path><path d=\"M58 62 h24 M70 50 v38\" stroke=\"#363330\" stroke-width=\"3\" stroke-linecap=\"round\"></path><path d=\"M50 100 h40\" stroke=\"#E3D9C2\" stroke-width=\"3\" stroke-linecap=\"round\"></path><path d=\"M14 116 h112\" stroke=\"#363330\" stroke-width=\"3\" stroke-linecap=\"round\"></path><path d=\"M24 116 q3 -10 6 0 M110 116 q3 -12 6 0 M30 116 q2 -7 4 0\" stroke=\"#363330\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"></path><g transform=\"translate(96 84) rotate(-18)\"><path d=\"M0 6 a6 6 0 0 1 6 -6 h18 l10 12 l-10 12 h-18 a6 6 0 0 1 -6 -6 z\" fill=\"#FF7816\" stroke=\"#363330\" stroke-width=\"2.5\" stroke-linejoin=\"round\"></path><circle cx=\"24\" cy=\"12\" r=\"2.5\" fill=\"#FFFFFF\"></circle></g></svg>",
            title: () => 'Here lies the plan to buy this.',
            body: () => 'Plans can come back to life. Raise what your hour is worth and this number shrinks.'
        },
        {
            art: "<svg width=\"120\" height=\"132\" viewBox=\"0 0 120 132\" aria-hidden=\"true\"><path d=\"M30 14 h60 M30 118 h60\" stroke=\"#363330\" stroke-width=\"5\" stroke-linecap=\"round\"></path><path d=\"M36 18 c0 30 22 36 22 48 c0 12 -22 18 -22 48 h48 c0 -30 -22 -36 -22 -48 c0 -12 22 -18 22 -48 z\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"3\" stroke-linejoin=\"round\"></path><path d=\"M40 112 c2 -14 10 -20 20 -24 c10 4 18 10 20 24 z\" fill=\"#FF7816\"></path><path d=\"M60 70 v14\" stroke=\"#FF7816\" stroke-width=\"2.5\" stroke-dasharray=\"2 4\" stroke-linecap=\"round\"></path></svg>",
            title: () => 'The sand runs out first.',
            body: () => 'You can\'t buy time, but what your hour is worth can grow. Start with your next raise.'
        },
        {
            art: "<svg width=\"170\" height=\"132\" viewBox=\"0 0 170 132\" aria-hidden=\"true\"><path d=\"M40 92 V48 a30 30 0 0 1 60 0 V92\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"3\" stroke-linejoin=\"round\"></path><ellipse cx=\"60\" cy=\"50\" rx=\"4.5\" ry=\"6\" fill=\"#363330\"></ellipse><ellipse cx=\"80\" cy=\"50\" rx=\"4.5\" ry=\"6\" fill=\"#363330\"></ellipse><path d=\"M62 68 q8 -5 16 0\" stroke=\"#363330\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"></path><path d=\"M88 68 l26 -2 l10 22 h-34 z\" fill=\"#C4E1FE\" stroke=\"#363330\" stroke-width=\"3\" stroke-linejoin=\"round\"></path><path d=\"M12 92 h150\" stroke=\"#363330\" stroke-width=\"5\" stroke-linecap=\"round\"></path><path d=\"M28 94 v30 M146 94 v30\" stroke=\"#363330\" stroke-width=\"4\" stroke-linecap=\"round\"></path><rect x=\"128\" y=\"70\" width=\"18\" height=\"22\" rx=\"3\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"3\"></rect><path d=\"M131 66 q2 -6 0 -10 M137 66 q2 -6 0 -10\" stroke=\"#363330\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"></path></svg>",
            title: (t) => `Still clocking in at age ${t.age}.`,
            body: () => 'Or get there sooner: learn something new, charge more for your work, invest the difference.'
        },
        {
            art: "<svg width=\"140\" height=\"132\" viewBox=\"0 0 140 132\" aria-hidden=\"true\"><rect x=\"22\" y=\"70\" width=\"96\" height=\"46\" rx=\"8\" fill=\"#FFCDAB\" stroke=\"#363330\" stroke-width=\"3\"></rect><path d=\"M22 86 q12 10 24 0 q12 10 24 0 q12 10 24 0 q12 10 24 0\" stroke=\"#363330\" stroke-width=\"3\" fill=\"#FFFFFF\" stroke-linejoin=\"round\"></path><path d=\"M12 118 h116\" stroke=\"#363330\" stroke-width=\"3\" stroke-linecap=\"round\"></path><rect x=\"38\" y=\"44\" width=\"8\" height=\"26\" rx=\"2\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"2.5\"></rect><rect x=\"66\" y=\"44\" width=\"8\" height=\"26\" rx=\"2\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"2.5\"></rect><rect x=\"94\" y=\"44\" width=\"8\" height=\"26\" rx=\"2\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"2.5\"></rect><path d=\"M42 40 c-5 -6 0 -12 0 -16 c4 4 6 10 0 16 z M70 40 c-5 -6 0 -12 0 -16 c4 4 6 10 0 16 z M98 40 c-5 -6 0 -12 0 -16 c4 4 6 10 0 16 z\" fill=\"#FF7816\" stroke=\"#363330\" stroke-width=\"2\" stroke-linejoin=\"round\"></path></svg>",
            title: (t) => `Happy ${t.ageOrdinal} birthday. Back to work.`,
            body: () => 'Bring the party forward. Every raise cuts years off this.'
        },
        {
            art: "<svg width=\"200\" height=\"132\" viewBox=\"0 0 200 132\" aria-hidden=\"true\"><g><path d=\"M10 104 V64 a24 24 0 0 1 48 0 V104 l-8 -7 l-8 7 l-8 -7 l-8 7 l-8 -7 z\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"3\" stroke-linejoin=\"round\"></path><circle cx=\"26\" cy=\"66\" r=\"3.5\" fill=\"#363330\"></circle><circle cx=\"42\" cy=\"66\" r=\"3.5\" fill=\"#363330\"></circle></g><g transform=\"translate(0 -14)\"><path d=\"M76 104 V64 a24 24 0 0 1 48 0 V104 l-8 -7 l-8 7 l-8 -7 l-8 7 l-8 -7 z\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"3\" stroke-linejoin=\"round\"></path><circle cx=\"92\" cy=\"66\" r=\"3.5\" fill=\"#363330\"></circle><circle cx=\"108\" cy=\"66\" r=\"3.5\" fill=\"#363330\"></circle><path d=\"M94 80 q6 4 12 0\" stroke=\"#363330\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"></path></g><g><path d=\"M142 104 V64 a24 24 0 0 1 48 0 V104 l-8 -7 l-8 7 l-8 -7 l-8 7 l-8 -7 z\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"3\" stroke-linejoin=\"round\"></path><circle cx=\"158\" cy=\"66\" r=\"3.5\" fill=\"#363330\"></circle><circle cx=\"174\" cy=\"66\" r=\"3.5\" fill=\"#363330\"></circle></g><path d=\"M10 122 h180\" stroke=\"#E3D9C2\" stroke-width=\"3\" stroke-linecap=\"round\"></path></svg>",
            title: (t) => `${t.careers} whole careers, back to back.`,
            body: () => 'Or one career worth three. People who grow fast cut this line short.'
        },
        {
            art: "<svg width=\"150\" height=\"132\" viewBox=\"0 0 150 132\" aria-hidden=\"true\"><ellipse cx=\"56\" cy=\"124\" rx=\"30\" ry=\"5\" fill=\"#363330\" opacity=\"0.12\"></ellipse><path d=\"M22 104 V54 a34 34 0 0 1 68 0 V104 l-11.3 -9 l-11.3 9 l-11.4 -9 l-11.3 9 l-11.4 -9 z\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"3\" stroke-linejoin=\"round\"></path><ellipse cx=\"44\" cy=\"54\" rx=\"5\" ry=\"7\" fill=\"#363330\"></ellipse><ellipse cx=\"68\" cy=\"54\" rx=\"5\" ry=\"7\" fill=\"#363330\"></ellipse><path d=\"M48 76 q8 -6 16 0\" stroke=\"#363330\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"></path><path d=\"M88 74 q14 -2 22 4\" stroke=\"#363330\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"></path><path d=\"M104 78 h34 l-4 40 h-26 z\" fill=\"#FF7816\" stroke=\"#363330\" stroke-width=\"3\" stroke-linejoin=\"round\"></path><path d=\"M113 78 v-6 a8 8 0 0 1 16 0 v6\" stroke=\"#363330\" stroke-width=\"3\" fill=\"none\"></path></svg>",
            title: () => 'You can\'t take it with you.',
            body: () => 'But you can get there alive. Fortunes aren\'t built by the hour: learn, build, invest.'
        },
        {
            art: "<svg width=\"160\" height=\"132\" viewBox=\"0 0 160 132\" aria-hidden=\"true\"><rect x=\"96\" y=\"22\" width=\"52\" height=\"84\" rx=\"8\" fill=\"#C4E1FE\" stroke=\"#363330\" stroke-width=\"3\"></rect><circle cx=\"122\" cy=\"46\" r=\"14\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"3\"></circle><path d=\"M122 38 v8 l6 4\" stroke=\"#363330\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"></path><rect x=\"108\" y=\"70\" width=\"28\" height=\"6\" rx=\"2\" fill=\"#363330\"></rect><path d=\"M14 108 V56 a30 30 0 0 1 60 0 V108 l-10 -8 l-10 8 l-10 -8 l-10 8 l-10 -8 z\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"3\" stroke-linejoin=\"round\"></path><ellipse cx=\"34\" cy=\"56\" rx=\"4.5\" ry=\"6.5\" fill=\"#363330\"></ellipse><ellipse cx=\"54\" cy=\"56\" rx=\"4.5\" ry=\"6.5\" fill=\"#363330\"></ellipse><path d=\"M72 72 l30 -2\" stroke=\"#363330\" stroke-width=\"3\" stroke-linecap=\"round\"></path><rect x=\"100\" y=\"60\" width=\"16\" height=\"22\" rx=\"2\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"2.5\" transform=\"rotate(8 108 71)\"></rect></svg>",
            title: () => 'Your shift ends after you do.',
            body: () => 'Change what your hour is worth and you change the story. Every big purchase started as an impossible number.'
        },
        {
            art: "<svg width=\"120\" height=\"132\" viewBox=\"0 0 120 132\" aria-hidden=\"true\"><path d=\"M22 104 V54 a38 38 0 0 1 76 0 V104 l-12.7 -10 l-12.7 10 l-12.6 -10 l-12.7 10 l-12.6 -10 z\" fill=\"#FFFFFF\" fill-opacity=\"0.55\" stroke=\"#363330\" stroke-width=\"3\" stroke-dasharray=\"8 7\" stroke-linejoin=\"round\" stroke-linecap=\"round\"></path><path d=\"M40 56 q6 -6 12 0 M68 56 q6 -6 12 0\" stroke=\"#363330\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"></path><path d=\"M50 76 q10 7 20 0\" stroke=\"#363330\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"></path><path d=\"M100 40 q10 -4 12 -14 M102 52 q12 0 16 -8\" stroke=\"#363330\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"></path></svg>",
            title: () => 'Gone before payday.',
            body: () => 'It looks impossible today. Taking that profitable idea out of the drawer could be the shortcut.'
        },
        {
            art: "<svg width=\"200\" height=\"140\" viewBox=\"0 -8 200 140\" aria-hidden=\"true\"><path d=\"M14 124 V52 M186 124 V52\" stroke=\"#363330\" stroke-width=\"4\" stroke-linecap=\"round\"></path><path d=\"M14 60 Q100 124 186 60 Q100 100 14 60 z\" fill=\"#FFCDAB\" stroke=\"#363330\" stroke-width=\"3\" stroke-linejoin=\"round\"></path><ellipse cx=\"100\" cy=\"85\" rx=\"22\" ry=\"3.5\" fill=\"#363330\" opacity=\"0.15\"></ellipse><g transform=\"translate(100 31) rotate(-10) scale(0.72) translate(-60 -60)\"><path d=\"M22 104 V54 a38 38 0 0 1 76 0 V104 l-12.7 -10 l-12.7 10 l-12.6 -10 l-12.7 10 l-12.6 -10 z\" fill=\"#FFFFFF\" stroke=\"#363330\" stroke-width=\"4\" stroke-linejoin=\"round\"></path><path d=\"M38 56 q7 7 14 0 M68 56 q7 7 14 0\" stroke=\"#363330\" stroke-width=\"3.5\" fill=\"none\" stroke-linecap=\"round\"></path><path d=\"M52 74 q8 6 16 0\" stroke=\"#363330\" stroke-width=\"3.5\" fill=\"none\" stroke-linecap=\"round\"></path></g><text x=\"140\" y=\"26\" font-family=\"Poppins, sans-serif\" font-weight=\"700\" font-size=\"16\" fill=\"#363330\">z</text><text x=\"154\" y=\"14\" font-family=\"Poppins, sans-serif\" font-weight=\"700\" font-size=\"12\" fill=\"#363330\">z</text></svg>",
            title: () => 'Retirement? Not in this life.',
            body: () => 'In this life you can, if your hour is worth more. Keep climbing.'
        }
    ]

    const positive = (value) => {
        const number = parseFloat(String(value).replace(',', '.'))
        return Number.isFinite(number) && number > 0 ? number : 0
    }

    const oneDecimal = (value) => {
        const rounded = Math.round(value * 10) / 10
        return rounded.toLocaleString('en-US', { maximumFractionDigits: 1 })
    }

    const hoursParts = (hours) => {
        const minutes = Math.round(hours * 60)
        if (minutes < 60) {
            const count = Math.max(1, minutes)
            return { figure: String(count), unit: count === 1 ? 'minute' : 'minutes' }
        }
        const figure = hours < 100 ? oneDecimal(hours) : Math.round(hours).toLocaleString('en-US')
        return { figure, unit: figure === '1' ? 'hour' : 'hours' }
    }

    const hoursLabel = (hours) => {
        const { figure, unit } = hoursParts(hours)
        return `${figure} ${unit}`
    }

    const field = (name) => form.elements[name]

    const readState = () => ({
        price: positive(field('p').value),
        currency: field('c').value,
        mode: form.querySelector('input[name="m"]:checked').value,
        wage: positive(field('w').value),
        salary: positive(field('s').value),
        period: field('per').value,
        hoursRaw: positive(field('h').value),
        daysRaw: positive(field('d').value),
        trueCost: field('t').checked,
        takeHome: positive(field('n').value),
        essentials: positive(field('e').value)
    })

    const applyParams = () => {
        const params = new URLSearchParams(window.location.search)
        if (params.has('p')) field('p').value = params.get('p')
        if (CURRENCIES.includes(params.get('c'))) field('c').value = params.get('c')
        if (params.get('m') === 'salary') form.querySelector('input[name="m"][value="salary"]').checked = true
        if (params.has('w')) field('w').value = params.get('w')
        if (params.has('s')) field('s').value = params.get('s')
        if (PERIODS.includes(params.get('per'))) field('per').value = params.get('per')
        if (params.has('h')) field('h').value = params.get('h')
        if (params.has('d')) field('d').value = params.get('d')
        if (params.get('t') === '1') field('t').checked = true
        if (params.has('n')) field('n').value = params.get('n')
        if (params.has('e')) field('e').value = params.get('e')
    }

    const payRate = (state, hours, days) => {
        if (state.mode === 'wage') return state.wage
        const weekly = {
            year: state.salary / 52,
            month: state.salary * 12 / 52,
            week: state.salary,
            day: state.salary * days
        }[state.period]
        return weekly / (days * hours)
    }

    const sentence = (total, hours, days) => {
        let fullDays = Math.floor(total / hours)
        let rest = Math.round((total - fullDays * hours) * 10) / 10
        if (rest >= hours) {
            fullDays += 1
            rest = 0
        }
        let text = fullDays === 0
            ? 'Less than one workday.'
            : `${fullDays.toLocaleString('en-US')} full workday${fullDays === 1 ? '' : 's'}${rest > 0 ? ` and ${oneDecimal(rest)} ${rest === 1 ? 'hour' : 'hours'} more` : ''}, working ${oneDecimal(hours)} hours a day.`
        const weeks = total / (hours * days)
        if (weeks >= 52) text += ` That is ${oneDecimal(weeks / 52)} years of work.`
        else if (weeks >= 1) text += ` That is ${oneDecimal(weeks)} work weeks.`
        return text
    }

    const gridSpec = (total, hours, days) => {
        const columns = Math.min(7, Math.max(1, Math.round(days)))
        const rows = Math.min(16, Math.max(1, Math.round(hours)))
        if (total <= columns * rows) {
            return {
                columns, rows, labels: DAY_NAMES.slice(0, columns), scale: 'hour',
                caption: 'Your work week, one square per hour',
                fill: (row, column) => total - (column * rows + row),
                filled: total, of: columns * rows, unit: 'hours'
            }
        }
        const workdays = total / hours
        if (workdays <= columns * 13) {
            const weekRows = Math.ceil(workdays / columns)
            return {
                columns, rows: weekRows, labels: DAY_NAMES.slice(0, columns), scale: 'day',
                caption: 'One square per workday, one row per week',
                fill: (row, column) => workdays - (row * columns + column),
                filled: workdays, of: weekRows * columns, unit: 'workdays'
            }
        }
        const weeks = total / (hours * days)
        if (weeks <= 13 * 8) {
            const quarterRows = Math.ceil(weeks / 13)
            return {
                columns: 13, rows: quarterRows, labels: [], scale: 'week',
                caption: 'One square per work week, 13 weeks per row',
                fill: (row, column) => weeks - (row * 13 + column),
                filled: weeks, of: quarterRows * 13, unit: 'work weeks'
            }
        }
        const months = weeks * 12 / 52
        const yearRows = Math.min(30, Math.ceil(months / 12))
        return {
            columns: 12, rows: yearRows, labels: [], scale: 'month',
            caption: months > 360 ? 'One square per month of work, first 30 years shown' : 'One square per month of work, one row per year',
            fill: (row, column) => months - (row * 12 + column),
            filled: Math.min(months, 360), of: yearRows * 12, unit: 'months'
        }
    }

    const renderGrid = (total, hours, days) => {
        const spec = gridSpec(total, hours, days)
        const grid = find('[data-grid]')
        const fragment = document.createDocumentFragment()
        let index = 0
        for (let row = 0; row < spec.rows; row += 1) {
            for (let column = 0; column < spec.columns; column += 1) {
                const cell = document.createElement('div')
                cell.className = 'cell'
                const inner = document.createElement('div')
                inner.className = 'cell-fill'
                inner.style.width = `${Math.round(Math.min(1, Math.max(0, spec.fill(row, column))) * 100)}%`
                inner.style.transitionDelay = `${Math.min(index, 60) * 6}ms`
                cell.appendChild(inner)
                fragment.appendChild(cell)
                index += 1
            }
        }
        spec.labels.forEach((name) => {
            const label = document.createElement('span')
            label.className = 'day-name'
            label.textContent = name
            fragment.appendChild(label)
        })
        grid.replaceChildren(fragment)
        grid.dataset.scale = spec.scale
        grid.style.gridTemplateColumns = `repeat(${spec.columns}, minmax(0, 1fr))`
        grid.setAttribute('aria-label', `Grid with ${oneDecimal(spec.filled)} of ${spec.of} ${spec.unit} filled`)
        find('[data-grid-caption]').textContent = spec.caption
    }

    let liveTimer = null
    const announce = (text) => {
        clearTimeout(liveTimer)
        liveTimer = setTimeout(() => { find('[data-live]').textContent = text }, 600)
    }

    const ordinal = (number) => {
        const text = number.toLocaleString('en-US')
        const tens = number % 100
        if (tens >= 11 && tens <= 13) return `${text}th`
        return `${text}${{ 1: 'st', 2: 'nd', 3: 'rd' }[number % 10] || 'th'}`
    }

    const shuffled = (count, avoidFirst) => {
        const order = Array.from({ length: count }, (_, index) => index)
        for (let index = count - 1; index > 0; index -= 1) {
            const pick = Math.floor(Math.random() * (index + 1))
            ;[order[index], order[pick]] = [order[pick], order[index]]
        }
        if (count > 1 && order[0] === avoidFirst) [order[0], order[1]] = [order[1], order[0]]
        return order
    }

    let fallbackRotation = null
    const nextLimitMessage = () => {
        let rotation = fallbackRotation
        try { rotation = JSON.parse(window.localStorage.getItem(LIMIT_KEY)) || rotation } catch (error) {}
        const valid = rotation && Array.isArray(rotation.order) && rotation.order.length === LIMIT_MESSAGES.length && Number.isInteger(rotation.next)
        if (!valid || rotation.next >= rotation.order.length) {
            const last = valid ? rotation.order[rotation.order.length - 1] : -1
            rotation = { order: shuffled(LIMIT_MESSAGES.length, last), next: 0 }
        }
        const index = rotation.order[rotation.next]
        rotation.next += 1
        fallbackRotation = rotation
        try { window.localStorage.setItem(LIMIT_KEY, JSON.stringify(rotation)) } catch (error) {}
        return LIMIT_MESSAGES[index]
    }

    let limitShown = false
    let limitMessage = null
    const showLimit = (years) => {
        if (!limitShown) {
            limitMessage = nextLimitMessage()
            limitShown = true
            find('[data-limit-art]').innerHTML = limitMessage.art
        }
        const whole = Math.round(years)
        const age = 20 + whole
        const facts = {
            years: whole.toLocaleString('en-US'),
            half: Math.round(years / 2).toLocaleString('en-US'),
            age: age.toLocaleString('en-US'),
            ageOrdinal: ordinal(age),
            careers: Math.max(3, Math.round(years / 40)).toLocaleString('en-US')
        }
        const title = limitMessage.title(facts)
        find('[data-limit-title]').textContent = title
        find('[data-limit-body]').textContent = limitMessage.body(facts)
        announce(title)
    }

    const render = () => {
        const state = readState()
        const hours = Math.min(state.hoursRaw, 16)
        const days = Math.min(state.daysRaw, 7)
        find('#hours-hint').hidden = state.hoursRaw <= 16
        find('#days-hint').hidden = state.daysRaw <= 7
        form.querySelectorAll('[data-mode]').forEach((block) => { block.hidden = block.dataset.mode !== state.mode })
        find('[data-true-cost]').hidden = !state.trueCost

        const valid = hours > 0 && days > 0
        const pay = valid ? payRate(state, hours, days) : 0
        const left = state.takeHome - state.essentials
        const free = valid && left > 0 ? left * 12 / 52 / (days * hours) : 0
        const filled = state.price > 0 && pay > 0 && (!state.trueCost || free > 0)
        const years = filled ? state.price / (state.trueCost ? free : pay) / (hours * days * 52) : 0
        const tooLong = years > MAX_YEARS
        const ready = filled && !tooLong

        find('[data-result-ready]').hidden = !ready
        find('[data-result-empty]').hidden = ready || tooLong
        find('[data-result-limit]').hidden = !tooLong
        if (tooLong) showLimit(years)
        else limitShown = false
        if (!ready) {
            let title = 'Enter a price and your pay.'
            let hint = 'The answer shows up here as you type.'
            if (!valid) hint = 'Hours per workday and workdays per week need to be above zero.'
            else if (state.trueCost && left <= 0) hint = 'Your bills are equal to or higher than your take-home pay, so there is no free money to divide. Check both amounts.'
            find('[data-empty-title]').textContent = title
            find('[data-empty-hint]').textContent = hint
            find('[data-result-bar]').hidden = true
            return
        }

        const payHours = state.price / pay
        const shown = state.trueCost ? state.price / free : payHours
        const { figure, unit } = hoursParts(shown)
        find('[data-figure]').textContent = figure
        find('[data-unit]').textContent = `${unit} of work`
        find('[data-sentence]').textContent = sentence(shown, hours, days)
        find('[data-bar-figure]').textContent = `${figure} ${unit}`

        const compare = find('[data-compare]')
        compare.hidden = !state.trueCost
        if (state.trueCost) {
            find('[data-pay-figure]').textContent = hoursLabel(payHours)
            find('[data-true-figure]').textContent = hoursLabel(shown)
            find('[data-compare-note]').textContent = `Bills take their share first: the same price costs ${oneDecimal(shown / payHours)} times more of your time than your pay suggests.`
        }

        const rate = state.trueCost ? free : pay
        find('[data-basis]').textContent = state.trueCost
            ? `Based on ${state.currency}${rate.toFixed(2)} an hour left after essential bills, from ${state.currency}${pay.toFixed(2)} an hour of pay.`
            : `Based on ${state.currency}${rate.toFixed(2)} an hour before taxes.`

        renderGrid(shown, hours, days)
        announce(`${figure} ${unit} of work`)
        updateBar()
    }

    const shareUrl = () => {
        const params = new URLSearchParams()
        FIELDS.forEach((name) => {
            if (name === 'm') params.set('m', form.querySelector('input[name="m"]:checked').value)
            else if (name === 't') params.set('t', field('t').checked ? '1' : '0')
            else params.set(name, field(name).value)
        })
        return `${window.location.origin}${window.location.pathname}?${params.toString()}`
    }

    const share = async () => {
        const url = shareUrl()
        const status = find('[data-share-status]')
        window.history.replaceState(null, '', url)
        const coarse = window.matchMedia('(pointer: coarse)').matches
        if (coarse && navigator.share) {
            try {
                await navigator.share({ title: 'Price to Hours', text: `This costs me ${find('[data-bar-figure]').textContent} of work.`, url })
                status.textContent = ''
                return
            } catch (error) {
                if (error.name === 'AbortError') return
            }
        }
        try {
            await navigator.clipboard.writeText(url)
            status.textContent = 'Link copied.'
        } catch (error) {
            status.textContent = 'Could not copy automatically. The link is now in your address bar: copy it from there.'
        }
    }

    let resultVisible = true
    const updateBar = () => {
        const narrow = window.matchMedia('(max-width: 480px)').matches
        find('[data-result-bar]').hidden = !narrow || resultVisible || find('[data-result-ready]').hidden
    }

    if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
            resultVisible = entries[0].isIntersecting
            updateBar()
        }, { threshold: 0.15 }).observe(result)
    }

    applyParams()
    form.addEventListener('input', () => {
        find('[data-share-status]').textContent = ''
        render()
    })
    form.addEventListener('change', render)
    form.addEventListener('submit', (event) => event.preventDefault())
    find('[data-share]').addEventListener('click', share)
    window.addEventListener('resize', updateBar)
    render()
})()
