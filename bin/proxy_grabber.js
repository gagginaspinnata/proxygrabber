#! /usr/bin/env node

var shell = require('shelljs');
var program = require('commander');

var output = "result.txt"

program
 .option('-o, --output <output>', 'Where to save de result, default result.txt.')
 .parse(process.argv);


if (program.output) output = program.output;


shell.exec('\
	curl -s -connect-timeout 5 --retry 3 "http://www.sslproxies.org" | \
	grep -E "[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}" | \
	sed "s/<\\/td><td>/ /g" | \
	sed "s/<tr><td>/ /g" | \
	awk \'{print $1,$2}\' | \
	 sed "s/ /:/g" | \
	 grep -E "[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}:[0-9]{1,5}" \
	 | tee ' + output)
.stdout;

shell.exec('\
curl -s --connect-timeout 5 --retry 3 "http://gatherproxy.com/proxylist/port/8080" | \
  grep -Eo "([0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4})" | \
  while read var; do echo $var:8080; done\
  | tee ' + output,
{"silent": true})
.stdout;

shell.exec('curl -s --connect-timeout 5 --retry 3 "http://proxyrox.com/?p=9" | \
  grep "/proxy/" | \
  cut -f2 -d ">" | \
  cut -f3 -d"/" | \
  sed "s/-/:/g" | \
  sed \'s/"//g\' | \
  grep -E "[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}:[0-9]{1,5}"\
  | tee ' + output,{"silent":true}).stdout;

shell.exec('curl -s --connect-timeout 5 --retry 3 \
  "https://proxy-list.org/english/search.php?search=ssl-no&country=any&type=any&port=any&ssl=no" | \
  grep ">Proxy(" | \
  cut -f2 -d "\'" | \
  while read var; do\
    echo $var | base64 --decode ;\
    echo " ";\
  done\
  | tee ' + output,{"silent":true}).stdout;

shell.exec('curl -s --connect-timeout 5 --retry 3 "https://free-proxy-list.net/" | \
  grep -E "[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}" | \
  sed "s/<\\/td><td>/ /g" | \
  sed "s/<tr><td>/ /g" | \
  awk \'{print $1,$2}\' | \
  sed "s/ /:/g" | \
  grep -E "[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}:[0-9]{1,5}"\
  | tee ' + output,{"silent":true}).stdout;
