$('#welcome-terminal').terminal(function(command, term){
    var items = ["yes", "no", "maybe", "definitely", "good luck", "you wish", "ha ha", "time will tell"];
    if (command !== '') {
        try {
            
            if(command==="options"){
                this.echo("hello\nflag\ninfo\n8-ball\n");
            }
            else if(command==="hello"){
                this.echo("Hello! :)");
            }
            else if(command==="flag"){
                this.echo("flag{adm1n5_n3w_web51te}")
            }else if(command==="8-ball"){
                this.echo("Ask me a question");
            }else if(command.substring(0,6)==="8-ball"){
                this.echo(items[items.length * Math.random() | 0]);
            }else if(command=="info"){
                this.echo("Hello there! Welcome to the Carleton Cybersecurity Club, we are a group of students from Carleton University dedicated to learning about cybersecurity. Look around to learn about what we do!");
            }else{
                this.echo("Command not found, use options to list options");
            }
        } catch(e) {
            this.error(new String(e));
        }
    } else {
       this.echo('');
    }
}, {
    greetings: '[[;green;]Welcome Terminal, Enter options for help',
    name: 'js_demo',
    prompt: '[[;green;]$ '
});