"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Transport = require('winston-transport');

var _require = require('@slack/client'),
    IncomingWebhook = _require.IncomingWebhook;

var SlackTransport =
/*#__PURE__*/
function (_Transport) {
  _inherits(SlackTransport, _Transport);

  function SlackTransport() {
    var _this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SlackTransport);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SlackTransport).call(this, opts));
    _this.webhook = new IncomingWebhook(opts.webhookUrl);
    _this.author_name = opts.author_name || 'slack webhook';
    _this.formatter = opts.formatter || _this._formatter;

    _this.fieldPicker = opts.fieldPicker || function (info) {
      return [];
    };

    _this.titlePicker = opts.titlePicker || function (info) {
      return info.level;
    };

    _this.textPicker = opts.textPicker || function (info) {
      return info.message;
    };

    return _this;
  }

  _createClass(SlackTransport, [{
    key: "log",
    value: function log(info) {
      var _this2 = this;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
      var payload = this.formatter(info);
      this.webhook.send(payload, function (err) {
        if (err) {
          setImmediate(function () {
            return _this2.emit('error', err);
          });
        } else {
          setImmediate(function () {
            return _this2.emit('logged', info);
          });
        }
      });
      callback(null, true);
    }
  }, {
    key: "_formatter",
    value: function _formatter(info) {
      return {
        attachments: [{
          color: this._getLevelColor(info.level),
          pretext: this._getLevelPretext(info.level),
          title: this.titlePicker(info),
          text: this.textPicker(info),
          author_name: this.author_name,
          fields: this.fieldPicker(info),
          ts: info.timestamp
        }]
      };
    }
  }, {
    key: "_getLevelPretext",
    value: function _getLevelPretext(level) {
      var pretexts = {
        emerg: 'Une erreur critique est survenue',
        alert: 'Une erreur critique est survenue',
        crit: 'Une erreur critique est survenue',
        error: 'Une erreur est survenue',
        warning: "Quelque chose d'anormal s'est produit",
        notice: "Quelque méritant votre attention s'est produit",
        info: 'Info !',
        debug: 'Debug !'
      };
      return pretexts[level];
    }
  }, {
    key: "_getLevelColor",
    value: function _getLevelColor(level) {
      var colors = {
        emerg: '#ff5438',
        alert: '#ff5438',
        crit: '#ff5438',
        error: '#ff7536',
        warning: '#ffb200',
        notice: '#ffb200',
        info: '#46a3ff',
        debug: '#29cc61'
      };
      return colors[level];
    }
  }]);

  return SlackTransport;
}(Transport);

module.exports = SlackTransport;