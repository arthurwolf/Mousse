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
            // Check if the machine has a name to be used in place of its IP address
            if(typeof current.configuration.machine_name !== "undefined"){
                var tab = $("<li><a href='#' id='machineindex_" + index.toString() + "'>" + current.configuration.machine_name + "</a></li>");
            }else {
                var tab = $("<li><a href='#' id='machineindex_" + index.toString() + "'>" + current.ip + "</a></li>");
            }

            // Display selected and unselected differently
            if( current === this.selected_machine ){ tab.addClass('active'); }
      
            // We open the folder if the link is clicked
            var _that = this;
            tab.click(function(machine, screen){
                return function(){
                    $(this).tab("show");
                    // Get the index of the machine that the user selected
                    var machine_index = parseInt($(this).find("a").attr("id").split("_")[1]);
                    _that.select_new_machine_tab(kernel.machines[machine_index]);
                }; 
            }(machine, this));
            
            // Append to the list 
            tab.appendTo("#control_machine_list");
        } 
        // Display this machine's interface
        this.display_control_interface( machine );
    },

    // Display the full machine interface
    display_control_interface: function( machine ){
        // Initialize the grid for thr configurable the interface
        this.gridster = $(".gridster").gridster({
                        widget_margins: [10, 10],
                        widget_base_dimensions: [140, 140],
                        widget_selector: "div",
                        
                        draggable: {
                            handle: "div .panel-heading",
                            stop: function(event, ui) {    
                             var positions = JSON.stringify(this.serialize());
                             localStorage.setItem("widget_positions", positions);
                             console.log("Dragged");
                             }
                        },
                        
                        resize: {
                            enabled: false,
                        }
                    }).data("gridster");
        // Empty all elements and widgets from the view
        this.gridster.remove_all_widgets();
        $("#widget_interface").empty();
        // Populate the interface with control widgets
        kernel.call_event("on_populate_control_screen", machine);
    },
    
    // We were asked to add a widget
    add_widget: function(widget){
        this.gridster.add_widget(widget.html, widget.sizex, widget.sizey);
    }
});



