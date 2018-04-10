console.clear();

window.onload = () => {
    const terminalUser = 'matthewbowen@pop-os:';
    const terminalLines = document.getElementById('shell-body');
    var currentPath = "/Documents";

    document.getElementById("shell-header").innerHTML = terminalUser + currentPath;

    function appendNewElement() {
        var command = document.createElement('li');
        command.appendChild(document.createTextNode(terminalUser));
    
        var input = document.createElement('input');
        input.type = 'text';
        input.addEventListener('keydown', function(event) {
            if(event.code === 'Enter') {
                input.disabled = true;
                respondToCommand(input.value);
                appendNewElement();
            } else {
                appendContInputIfNeeded(input);
                return;
            }
        });
        //input.className = "css-class-name"; 
        command.appendChild(input); 
        terminalLines.appendChild(command); 
        input.focus();  
    }

    function appendContInputIfNeeded(input) {
        if(getTextWidth(input.value, '12px monospace') > input.offsetWidth - 5) {
            var commandCont = document.createElement('li');
            var inputCont = document.createElement('input');
            inputCont.type = 'text';
            inputCont.style.width = '100%';

            inputCont.addEventListener('keydown', function(event) {
                if(inputCont.value.length === 0) {
                    inputCont.parentNode.removeChild(inputCont);
                    input.focus();

                    return;
                }

                if(event.code !== 'Enter') {
                    appendContInputIfNeeded(inputCont);

                    return;
                } else {
                    respondToCommand();
                }
            });

            commandCont.appendChild(inputCont);
            terminalLines.appendChild(commandCont);
            inputCont.focus();
        }
    }

    function respondToCommand(cmd) {
        var response = document.createElement('li');

        if (cmd.indexOf("cd") > -1) {
            if(cmd.indexOf("projects") > -1 && currentPath.indexOf("projects") == -1) {
                currentPath = currentPath + "/projects";
                document.getElementById("shell-header").innerHTML = terminalUser + currentPath;
            } else if (cmd.indexOf("desktop") > -1 && currentPath.indexOf("desktop") == -1) {
                currentPath = currentPath + "/desktop";
                document.getElementById("shell-header").innerHTML = terminalUser + currentPath;
            } else {
                response.appendChild(document.createTextNode("Invalide file path"));
                terminalLines.appendChild(response);
                return;
            }
            response.appendChild(document.createTextNode(terminalUser + "changed directory to: " + cmd.split(' ')[1]));
        } else if (cmd.indexOf("./faceDetection.js") > -1) {
            window.open("pages/facedetection.html", "_self");
        } else if (cmd.indexOf("help") > -1) {
            response.appendChild(document.createTextNode("cd <change directory>"));
            response.appendChild(document.createElement("br"));
            response.appendChild(document.createTextNode("./<application> to run application"));
            response.appendChild(document.createElement("br"));
            response.appendChild(document.createTextNode("ls <to list folders/files in directory>"));
        } else if (cmd.indexOf("ls") > -1) {
            if(currentPath.indexOf("projects") > -1) {
                response.appendChild(document.createTextNode("faceDetection.js"));

            } else {
                response.appendChild(document.createTextNode("projects"));
                response.appendChild(document.createElement("br"));
                response.appendChild(document.createTextNode("desktop"));
            }
        } else {
            response.appendChild(document.createTextNode(terminalUser + "Command not recognized ('help' for list of commands)"));
        }

        terminalLines.appendChild(response);
    }

    function openNewURLInTheSameWindow(targetURL) {
        var a = document.createElement('a');
        a.href = targetURL;
        fireClickEvent(a);
    }

    function getTextWidth(text, font) {

        var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }

    appendNewElement();
}