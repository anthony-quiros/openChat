[![Build Status](https://travis-ci.org/anthony-quiros/openChat.svg?branch=master)](https://travis-ci.org/anthony-quiros/openChat)
# openChat
OpenChat is a web application based on nodeJS.
It was initially meant to send snippets of code and small files the easiest & fastest way.


##Main Features :

1. Web & mobile compliant 
2. (**Web**) : Insert WYSIWYG emojis
3. (**Web**) : Sound notification when a new message is posted
4. (**Web**/**Mobile**) : Historic of the last messages sent
5. (**Web**) : Send Files using a drag'n'drop or a simple click.
6. (**Web**) : Send code with syntax highlighting.
7. (**Web**) : Nicknames management (with cookie persistence)
8. (**Web**) : List of the connected members
9. (**Web**) : Send messages with CTRL + ENTER

##Installation

1. Clone the project to your server using the command : ```git clone https://github.com/AntSoft/openChat.git```
2. Go to the root of the project and use the command : ```npm update```    This step requires that NodeJS is already installed of your server.
3. Change the default port in the file /config/development.json
4. Launch the application of the server using the command ```node main.js```
5. You can access your chat with the url : ```YOUR_SERVER_IP:YOUR_CUSTOM_PORT```
