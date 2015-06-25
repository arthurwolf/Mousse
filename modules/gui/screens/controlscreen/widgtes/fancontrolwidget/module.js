// Creates new fancontrolwidget objects and attaches them to the controlscreen
var Fancontrolwidget = Module.extend({
    on_populate_control_screen: function(machine){
        // We were asked to add the widget to the control screen
        kernel.call_event("add_widget", {html: this.asset("control"), sizex: 2, sizey: 1});
        
        // Save the machine and its config
        this.parent_machine = machine;
        
        // Add a listener for the fans on button
        $("#fans_on").click(function(){
            kernel.call_event("on_send_command", "M106");
        });
        
        // Add a listener for the fans off button
        $("#fans_off").click(function(){
            kernel.call_event("on_send_command", "M107");
        });
    }
    
});



