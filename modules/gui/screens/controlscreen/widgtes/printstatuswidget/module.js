// Creates new printstatuswidget objects and attaches them to the controlscreen
var Printstatuswidget = Module.extend({
    on_populate_control_screen: function(machine){
        // We were asked to add the widget to the control screen
        kernel.call_event("add_widget", {html: this.asset("status"), sizex: 2, sizey: 2});
        
        // Save the machine and its config
        this.parent_machine = machine;
        
        // Add a listener for the abort print button
        $("#abort_print").click(function(){
            // Confirm that the user wants to abort the print
            bootbox.dialog("Abort the print?", [{
                "label" : "Abort",
                "class" : "btn-danger",
                "callback": function() {
                    kernel.call_event("on_send_command", "abort");
                }
            },{
                "class" : "btn-default",
                "label" : "Cancel"
            }]);
        });
    },
    
    // Update the print progress when there are new values
    on_value_update: function(result){
        // Display print progress
        if (result.progress.playing){
            //$("#print_progress").text(result.progress.string);
            $("#print_progress_bar").css("width", result.progress.percent_complete);
            $("#elapsed_print_time").text("Elapsed: " + result.progress.time_elapsed + " seconds");
            // Make sure that there is an estimated time
            if(result.progress.est_time.match(/complete/g)){
                $("#estimated_print_time").text("Estimated Time: Calculating...");
            }else {
                $("#estimated_print_time").text("Estimated Time: " + result.progress.est_time + " seconds");    
            }
            // Enable the print control buttons
            $("#abort_print").prop("disabled", false);
        }else {
            //$("#print_progress").text("No print in progress");
            $("#elapsed_print_time").text("Elapsed: ");
            $("#estimated_print_time").text("Estimated: ");
            $("#print_progress_bar").css("width", "0%");
            // Disable the print control buttons
            $("#abort_print").prop("disabled", true);
        }
    }
    
});



