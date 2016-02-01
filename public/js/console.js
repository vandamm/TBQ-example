(function ($) {

  var help = '<div class="help">Добро пожаловать в систему анализа и предсказания преступлений департамента полиции г. Пилтовер.\n\nВы можете использовать следующие команды:\n\n- <span class="cmd">пойти/подойти</span> к <...> (напр: подойти к дивану, пойти в зал)\n- <span class="cmd">использовать</span> <...> (напр: использовать дверь)\n- <span class="cmd">осмотреть</span> <...> (напр: осмотреть зал)\n- <span class="cmd">вернуться</span> (пользуйтесь этой командой чтобы вернуться в центр комнаты)\n- в некоторых случаях от вас может потребоваться прямой ввод информации\n\nСовет: если вы застряли, попробуйте оглядеться по сторонам и поискать подсказки в реальности.. И наоборот.\nИ еще: символ Cоны на одежде поможет вам найти других детективов.\nЕсли вы совсем застряли, воспользуйтесь командой "сброс" чтобы начать сначала.</div>';
  var init = '\nИнициализируется система экзистенциального проецирования...\nЗапуск нелинейного анализа...\nОтклонение от закона причинности 10...20...50...100%\nАллокация следственных связей завершена.\nНачало проекции через 3...2...1...';
  var projectionStart = '===== ПРОЕКЦИЯ ЗАПУЩЕНА ====>';


  function m(message) {
    return message;
  }


  var Terminal = {
    focus: function () {
      this.$input.focus();
    },

    suspend: function () {
      this.$input.hide();
    },

    sendText: function (text, cssClass, color) {
      if (color) {
        color = 'style="color:#' + color + ';"';
      } else {
        color = '';
      }
      text = text.replace(/\n/g, '<br/>');
      this.$screen.append('<p class="' + cssClass + '" ' + color + ' >' + text + '</p>');
      this.$screen.scrollTop(this.$screen[0].scrollHeight);

      this.focus();
    },

    echo: function (text, color) {
      this.sendText(text, 'text', color);
    },

    command: function (text) {
      this.sendText(text, 'command');
    },

    registerCommandHandler: function(cb) {
      this.onCommand = cb.bind(this);
    },

    processCommand: function (command) {
      this.lastCommand = command;
      this.command(command);

      if (typeof(this.onCommand) == 'function') {
        this.onCommand(this.lastCommand);
      }
    },

    onKeyPress: function (e) {
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;

      if (keyCode == '13' && this.$input.val().length > 0) {
        this.processCommand(this.$input.val());
        this.$input.val('');
        return false;
      }
    },

    init: function (screen, input) {
      this.$screen = screen;
      this.$input = input;
      this.$input.on('keypress', this.onKeyPress.bind(this));
    }

  };

  var createTerminal = function (screen, input) {
    var terminal = Object.create(Terminal);

    terminal.init(screen, input);
    terminal.focus();

    return terminal;
  };


  function sendQuestRequest(term, command) {
    command = command || '';

    $.ajax({
      url: '/quest/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({command: command})
    })
      .done(function (response) {
        if (response.text === null) {
          term.echo(m(help));
        } else {
          term.echo(m(response.text));
          if (response.end) {
            term.suspend();
          }
        }
      })
      .fail(function (response) {
        term.echo(m('Ошибка системы. Попробуйте позже.'));
      })
  }



  $(document).ready(function () {
    var terminal = createTerminal($('#console'), $('#quest-command'));
    terminal.registerCommandHandler(function (command) {
      if (command == '?' || command == 'помощь') {
        this.echo(m(help));
      } else if (command == 'сброс') {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i];
          var eqPos = cookie.indexOf("=");
          var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        location.reload();
      } else if (command !== '') {
        sendQuestRequest(this, command)
      }
    });

    terminal.echo(help);
    terminal.echo(init);
    terminal.echo(projectionStart, 'CACA24');
    sendQuestRequest(terminal, 'GAMELOADED');
  });

})(jQuery);
