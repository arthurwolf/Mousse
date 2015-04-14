var Controlscreen = Module.extend({

    // Some defaults we need
    create: function(){
        this.selected_machine = false;
    },

    // The "Explore" button was clicked in the navigation bar
    on_main_menu_open_control: function(){
        // Append the asset to the main frame
        this.asset("control").appendTo("#main");

        // Configure machine tabs
        this.add_machine_tabs();
    },

    // We were asked to exit this screen
    on_main_menu_close_control: function(){
        $("#main").empty();
    },

    // Add the machine tabs
    add_machine_tabs: function(){
        // If a machine is selected, display with that machine selected
        if( this.selected_machine ){
            this.select_new_machine_tab( this.selected_machine );
        }

        // Add the tabs only if a machine is available
        if( kernel.machines.length > 0 ){
            // Select the first machine by default
            this.select_new_machine_tab( kernel.machines[0] );
            
            // Hide the no machines message
            $("#no_machines").hide();

            // Show the control interface
            $("#control_interface").show();
        }else{
            // TODO : display a nice message explaining there is no machine available
            $("#control_interface").hide();

            // Show the no machines message
            $("#no_machines").show();

            // Set up the scan network button
            $("#control_start_network_scan").click(function(){
               networkdetectmodal.display_modal(true); 
            });

        }
    },

    // The user selected a tab ( or we selected the first one automatically )
    select_new_machine_tab: function( machine ){
        // TODO : Hide the tab bar if there is only one machine
        // Generate a new tab bar, with the passed machine selected
        this.selected_machine = machine;

        console.log(machine);

        // Clear the tab bar
        $("#control_machine_list").empty();

        // For each machine
        for( var index in kernel.machines ){
            var current = kernel.machines[index]; 

            // Create a new tab
            var tab = $("<li><a href='#'>" + current.ip + "</a></li>");

            // Display selected and unselected differently
            if( current === this.selected_machine ){ tab.addClass('active'); }
      
            // We open the folder if the link is clicked 
            tab.click(function(machine, screen){
                return function(){
                    screen.select_new_machine_tab( machine ); 
                }; 
            }(machine, this));
            
            // Append to the list 
            tab.appendTo("#control_machine_list");

        } 

        // Display this machine's interface
        this.display_control_interface( machine );
        
        // Get the automatic update defaults
        this.get_update_defaults();
        
        // Get the machine's temperature
        this.update_temperature();
        
        // Add a timer for updating temperature automatically
        window.setInterval(this.auto_update, 1000); // run auto_update every second

        // Add a listener for the update temperature button
        $("#update_temperature").click(function(){
            kernel.call_event("update_temperature");
        });
        
        // Add a listener for the home all axes button
        $("#home_all").click(function(){
            kernel.call_event("send_gcode_silent", "G28");
        });
        
        // Add a listener for the home x button
        $("#home_x").click(function(){
            kernel.call_event("send_gcode_silent", "G28 X0");
        });
        
        // Add a listener for the home y button
        $("#home_y").click(function(){
            kernel.call_event("send_gcode_silent", "G28 Y0");
        });
        
        // Add a listener for the home z button
        $("#home_z").click(function(){
            kernel.call_event("send_gcode_silent", "G28 Z0");
        });
        
        // Add a listener for the jog x buttons
        $("#positive_x").click(function(){
            kernel.call_event("send_gcode_silent", "G91 G0 X"+$('#jog_increment').val()+" F"+$("#xy_velocity").val()+" G90");
        });
        $("#negative_x").click(function(){
            kernel.call_event("send_gcode_silent", "G91 G0 X-"+$('#jog_increment').val()+" F"+$("#xy_velocity").val()+" G90");
        });
        
        // Add a listener for the jog y buttons
        $("#positive_y").click(function(){
            kernel.call_event("send_gcode_silent", "G91 G0 Y"+$('#jog_increment').val()+" F"+$("#xy_velocity").val()+" G90");
        });
        $("#negative_y").click(function(){
            kernel.call_event("send_gcode_silent", "G91 G0 Y-"+$('#jog_increment').val()+" F"+$("#xy_velocity").val()+" G90");
        });
        
        // Add a listener for the jog z buttons
        $("#positive_z").click(function(){
            kernel.call_event("send_gcode_silent", "G91 G0 Z"+$('#jog_increment').val()+" F"+$("#z_velocity").val()+" G90");
        });
        $("#negative_z").click(function(){
            kernel.call_event("send_gcode_silent", "G91 G0 Z-"+$('#jog_increment').val()+" F"+$("#z_velocity").val()+" G90");
        });
        
        // Add a listener for the send command button
        $("#send_command").click(function(){
            var command = $("#command_text").val();
            kernel.call_event("send_gcode", {command: command, send_response: true});
            $("#command_response").empty();
        });
        
        // Add a listener for the motors off button
        $("#motors_off").click(function(){
            kernel.call_event("send_gcode_silent", "M18");
        });
        
        // Add a listener for the fans on button
        $("#fans_on").click(function(){
            kernel.call_event("send_gcode_silent", "M106");
        });
        
        // Add a listener for the fans off button
        $("#fans_off").click(function(){
            kernel.call_event("send_gcode_silent", "M107");
        });
        
        // Add a listener for the set extruder temperature button
        $("#set_extruder_temperature").click(function(){
            kernel.call_event("send_gcode_silent", "M104 S"+$("#extruder_temperature_input").val());
        });
        
        // Add a listener for the set bed temperature button
        $("#set_bed_temperature").click(function(){
            kernel.call_event("send_gcode_silent", "M140 S"+$("#bed_temperature_input").val());
        });
        
        // Add a listener for the set extruder temperature button
        $("#extruder_heat_off").click(function(){
            kernel.call_event("send_gcode_silent", "M104 S0");
        });
        
        // Add a listener for the set bed temperature button
        $("#bed_heat_off").click(function(){
            kernel.call_event("send_gcode_silent", "M140 S0");
        });
        
        // Add a listener for the extrude button
        $("#extrude").click(function(){
            kernel.call_event("send_gcode_silent", "G91 G0 E"+$("#extrude_length").val()+" F"+$("#e_velocity").val()+" G90");
        });
        
        // Add a listener for the retract button
        $("#retract").click(function(){
            kernel.call_event("send_gcode_silent", "G91 G0 E-"+$("#extrude_length").val()+" F"+$("#e_velocity").val()+" G90");
        });
        
        // Add a listener for the abort print button
        $("#abort_print").click(function(){
            bootbox.dialog({
                message: "Are you sure you want to abort your print?",
                title: "Abort Print",
                buttons: {
                    main: {
                        label: "No",
                        className: "btn-default",
                        callback: function() {
                            return;
                        }
                    },
                    danger: {
                        label: "Abort",
                        className: "btn-danger",
                        callback: function() {
                            kernel.call_event("send_gcode_silent", "abort");
                        }
                    }
                }
            });
        });
        
        // Add a listener for the update print progress button
        $("#update_print_progress").click(function(){
            kernel.call_event("update_print_progress");
        });
    },

    // Display the full machine interface
    display_control_interface: function( machine ){
        console.log("test");
        $(".gridster").gridster({
            widget_margins: [10, 10],
            widget_base_dimensions: [140, 140],
            widget_selector: "div",
            
            draggable: {
                handle: "div .panel-heading",
                stop: function(event, ui) {    
                 var positions = JSON.stringify(this.serialize());
                 localStorage.setItem("widget_positions", positions);
                 console.log("DRAGGED");
                 }
            },
            
            resize: {
                enabled: true,
            },
            
            serialize_params: function($w, wgd){
                return {
                    id: $($w).attr('id'),
                    col: wgd.col,
                    row: wgd.row,
                    size_x: wgd.size_x,
                    size_y: wgd.size_y,
                };
              }
        });
    },
    
    // Update the extruder and bed temperature
    update_temperature: function(){
        // Get the machine's IP address
        this.ip = this.selected_machine.ip;
        
        // Send M105 to get the machine's temperature
        $.ajax({ 
          url: "http://" + this.ip + '/command',
          caller: this,
          type: "POST",
          data: "M105\n",
          async: true,
      }).done(function(result){console.log("success! : "+result);$("#tempReport").text(result);}).fail(function(){console.log("Failed to send gcode.");});
    },
    
    // Update the print progress
    update_print_progress: function(){
        // Get the machine's IP address
        this.ip = this.selected_machine.ip;
        
        // Send "progress" to get the machine's temperature
        $.ajax({ 
          url: "http://" + this.ip + '/command',
          caller: this,
          type: "POST",
          data: "progress\n",
          async: true,
      }).done(function(result){console.log("success! : "+result);$("#print_progress").text(result);}).fail(function(){console.log("Failed to send gcode.");});
    },
    
    // Send gcode to the machine
    send_gcode: function( command ){
        // Get the machine's IP address
        this.ip = this.selected_machine.ip;

        // Add a new line to the command
        this.command = command.command + "\n";

        console.log("sending: "+this.command);
        // Send the command
        if(command.send_response){
            $.ajax({ 
                url: "http://" + this.ip + '/command',
                caller: this,
                type: "POST",
                data: this.command,
                async: true,
            }).done(function(result){console.log("gcode successfully sent."); kernel.call_event("update_console", result);}).fail(function(){console.log("Failed to send gcode.");});
        }else {
            $.ajax({ 
                url: "http://" + this.ip + '/command',
                caller: this,
                type: "POST",
                data: this.command,
                async: true,
            }).done(function(result){console.log("gcode successfully sent.");}).fail(function(){console.log("Failed to send gcode.");});
        }
    },
    
    // Send gcode without displaying a response
    send_gcode_silent: function( command ){
        this.send_gcode( {command: command, send_response: false} );
    },
    
    // Display the machine's response to the sent command
    update_console: function( response ){
        $("#command_response").text( response );
    },
  
    // Retrieve user's auto update preferences
    get_update_defaults: function(){
        var auto_update_temperature = $.localStorage.getItem("auto_update_temperature");
        if(auto_update_temperature == "true"){
            $("#auto_update_temperature").prop("checked", true);
        }else {
            $("#auto_update_temperature").prop("checked", false);
            $.localStorage.setItem("auto_update_temp", "false");
        }
    },
  
    // Update machine's temperature automatically
    // Save auto update preferences so that they will appear on reload
    auto_update: function(){
        if($("#auto_update_temperature").prop("checked")){
            $.localStorage.setItem("auto_update_temperature", "true");
            kernel.call_event("update_temperature");
        }else {
            $.localStorage.setItem("auto_update_temperature", "false");
        }
    }

});



