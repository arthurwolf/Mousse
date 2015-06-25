// Creates new consolecontrol objects and attaches them to the controlscreen
var Consolewidget = Module.extend({
    on_populate_control_screen: function(machine){
        // Give the controlscreen the information it needs to add this
        kernel.call_event("add_widget", {html: this.asset("console"), sizex: 2, sizey: 2});
        
        // Save the machine and its config
        this.parent_machine = machine;
        
        var _that = this;
        // Add a listener for the send_command button
        $("#send_command").click(function(command_text){
            _that.on_send_console_command($("#command_text").val());
            $("#command_text").val("");
        });
        $("#command_text").keypress(function(e){
            if(e.keyCode == 13){
                _that.on_send_console_command($("#command_text").val());
                $("#command_text").val("");
            }
        });
    },
    
    on_send_console_command: function( command ){
        console.log("sending: " + command);
        
        this.parent_machine.interface.send_command({
            command: command + "\n",
            caller: this,
            done: this.on_received_response,
        });
    },
    
    on_received_response: function( request, answer ){
        $("#command_response").text(answer);
    }
    
});



