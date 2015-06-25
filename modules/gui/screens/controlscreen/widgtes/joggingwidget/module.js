// Creates new joggingwidget objects and attaches them to the controlscreen
var Joggingwidget = Module.extend({
    on_populate_control_screen: function(machine){
        // We were asked to add the widget to the control screen
        kernel.call_event("add_widget", {html: this.asset("control"), sizex: 2, sizey: 2});
        
        // Save the machine and its config
        this.parent_machine = machine;
        
        var _that = this;
        
        // Initially set the jogging increment to 10mm because that is what is checked by default
        this.jogging_increment = "10";
        
        // Add a listener for the home all axes button
        $("#home_all").click(function(){
            kernel.call_event("on_send_command", "G28");
        });
        
        // Add a listener for the home x button
        $("#home_x").click(function(){
            kernel.call_event("on_send_command", "G28 X0");
        });
        
        // Add a listener for the home y button
        $("#home_y").click(function(){
            kernel.call_event("on_send_command", "G28 Y0");
        });
        
        // Add a listener for the home z button
        $("#home_z").click(function(){
            //console.log(jog_increment);
            var increment = _that.jogging_increment;
            kernel.call_event("on_send_command", "G28 Z0");
        });
        
        // Add a listener for the jog x buttons
        $("#positive_x").click(function(){
            kernel.call_event("on_send_command", "G91 G0 X"+_that.jogging_increment+" F"+$("#xy_velocity").val()+" G90");
        });
        $("#negative_x").click(function(){
            kernel.call_event("on_send_command", "G91 G0 X-"+_that.jogging_increment+" F"+$("#xy_velocity").val()+" G90");
        });
        
        // Add a listener for the jog y buttons
        $("#positive_y").click(function(){
            kernel.call_event("on_send_command", "G91 G0 Y"+_that.jogging_increment+" F"+$("#xy_velocity").val()+" G90");
        });
        $("#negative_y").click(function(){
            kernel.call_event("on_send_command", "G91 G0 Y-"+_that.jogging_increment+" F"+$("#xy_velocity").val()+" G90");
        });
        
        // Add a listener for the jog z buttons
        $("#positive_z").click(function(){
            kernel.call_event("on_send_command", "G91 G0 Z"+_that.jogging_increment+" F"+$("#z_velocity").val()+" G90");
        });
        $("#negative_z").click(function(){
            kernel.call_event("on_send_command", "G91 G0 Z-"+_that.jogging_increment+" F"+$("#z_velocity").val()+" G90");
        });
        
        // Add a listener for the motors off button
        $("#motors_off").click(function(){
            kernel.call_event("on_send_command", "M18");
        });
        
        // Add a listener to get the jogging increment when the user changes it
        $("input:radio[name=jogging_increments]").change(function(){
            _that.jogging_increment = this.value;
        });
    }
});



