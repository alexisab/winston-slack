const Transport = require('winston-transport')
const { IncomingWebhook } = require('@slack/client')

class SlackTransport extends Transport {
    constructor(opts = {}) {
        super(opts)

        this.webhook = new IncomingWebhook(opts.webhookUrl)
        this.author_name = opts.author_name || 'slack webhook'

        this.formatter = opts.formatter || this._formatter
        this.fieldPicker = opts.fieldPicker || (info => [])
        this.titlePicker = opts.titlePicker || (info => info.level)
        this.textPicker = opts.textPicker || (info => info.message)

        this.levelColors = opts.levelColors || {
            emerg: '#ff0000',
            alert: '#ff0000',
            crit: '#ff5438',
            error: '#ff5438',
            warning: '#ff7536',
            notice: '#ffb200',
            info: '#46a3ff',
            debug: '#29cc61',
        }

        this.levelPretexts = opts.levelPretexts || {
            emerg: 'Une erreur critique est survenue',
            alert: 'Une erreur critique est survenue',
            crit: 'Une erreur critique est survenue',
            error: 'Une erreur est survenue',
            warning: "Quelque chose d'anormal s'est produit",
            notice: "Quelque méritant votre attention s'est produit",
            info: 'Info !',
            debug: 'Debug !',
        }
    }

    log(info, callback = () => {}) {
        const payload = this.formatter(info)

        this.webhook.send(payload, err => {
            if (err) {
                setImmediate(() => this.emit('error', err))
            } else {
                setImmediate(() => this.emit('logged', info))
            }
        })

        callback(null, true)
    }

    _formatter(info) {
        return {
            attachments: [
                {
                    color: this.levelColors[info.level] || '#46a3ff',
                    pretext: this.levelPretexts[info.level] || '#46a3ff',
                    title: this.titlePicker(info),
                    text: this.textPicker(info),

                    author_name: this.author_name,

                    fields: this.fieldPicker(info),

                    ts: info.timestamp,
                },
            ],
        }
    }
}

module.exports = SlackTransport
