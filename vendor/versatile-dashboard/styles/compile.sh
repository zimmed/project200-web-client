#!/bin/sh

hash node 2>/dev/null || { echo >&2 "nodejs required but not installed. Use: sudo apt-get install nodejs; sudo ln -s "'"$(which nodejs)"'" /usr/bin/node"; exit 1; }
hash npm 2>/dev/null || { echo >&2 "node package manager required, but not installed. Use: sudo apt-get install npm"; exit 1; }
hash bower 2>/dev/null || { echo >&2 "bower required, but not installed. Use: sudo npm install -g bower"; exit 1; }
hash yui-compressor 2>/dev/null || { echo >&2 "yui-compressor required, but not installed. Use: sudo apt-get install yui-compressor"; exit 1; }
hash lessc 2>/dev/null || { echo >&2 "less compiler required, but not installed. Use: sudo npm install -g less"; exit 1; }

SCRIPT=`realpath $0`
SCRIPTPATH=`dirname $SCRIPT`
cd $SCRIPTPATH

if ! [ -d "modified/bower_components" ]; then
	bower update
fi

rm -f ./versatile-theme-modified*

lessc modified/src/styles/main.less versatile-theme-modified.css
yui-compressor --type css -o versatile-theme-modified.min.css versatile-theme-modified.css

echo "Finished."
exit 0;
