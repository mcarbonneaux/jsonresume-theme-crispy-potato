var fs = require('fs');
var Handlebars = require('handlebars');
var sass = require('node-sass');

var language = 'no';

function render(resume) {

  var css = sass.renderSync({
    file: __dirname + './style.scss'
  }).css;

  var template = Handlebars.compile(fs.readFileSync('./resume.hbs', 'utf-8'));
  var translation = JSON.parse(fs.readFileSync('./i18n/' + language + '.json', 'utf-8'));

  function format_date(date_string) {
    var date = new Date(date_string);

    if (!date)
      return date_string;
    var output = '';

    return translation.months[date.getMonth()] + ' ' + date.getFullYear();
  }

  Handlebars.registerHelper('get_network_class', function (network) {
    return network.toLowerCase().replace(' ', '-');
  });

  Handlebars.registerHelper('get_work_date', function (work) {
    var date = "";

    if (work.startDate)
      date += format_date(work.startDate);

    date += " &ndash; ";

    if (work.endDate)
      date += format_date(work.endDate);

    return date;
  });

  return template({
    css: '<style>' + css + '</style>',
    resume: resume,
    t: translation,
    language: language
  });
}

module.exports = {
  render: render
};
