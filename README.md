Mousse
======

Mousse is a project for a Web-based control interface for CNC machines ( 3D printers, laser cutters, CNC mills, etc )

This is initially intended to be used with Smoothieboard using it's on-board Ethernet connector. However, future plans include support for other boards, and an executable serving the interface.

*NOTE* : THIS IS PRE-ALPHA AT THE MOMENT, we are only building the framework this will be built upon, do not expect it to be functional 

## Project goals

* Universal controller interface for 3D printers, Lasers, and CNC mills
* Incorporate design tools and G-Code generation
* Oriented towards ease of use and ergonomy
* Ability to fully redesign/configure the interface, and design vendor-specific interfaces
* Wizards for everything
* Fully modular code ( on the model of the Smoothie firmware ) to make it as easy as possible to contribute
* Dashboard
* Multiple-machines support

## Design

* HMTL5 + CSS + JS ( Bootstrap ) + SVG
* Everything is a module, contribute without having to understand ( too much ) or read the rest of the project
* Workflow-based interface ( Design/File -> Operation configuration -> Operation monitoring )
* Wizards and forms to configure interface, G-Code generation and the controller itself
* Adaptive interface reads controller's configuration file and adjusts the interface to the machine's capabilities
* File upload and execution only, does not stream G-code
* SVG-based design tools for 2D and G-code generation ( as well as simple 3D design and G-code generation, and complex 3D G-code generation when Slic3r gets full C++ ).

## Things to do

For now : 

* Code base modular system
* Code Kernel
* Code board discovery
* Code block HTML files compiler

## License

GPL v3

## Contributing

Contact the Smoothie community or wolf.arthur@gmail.com

Contributions are very welcome !
