# MIRROR Spaces SDK for JavaScript
This SDK provides high-level interfaces for the services of the [MIRROR Spaces Framework (MSF)][1]. It allows developers without deeper knowledge of the XMPP protocol to connect their web applications to the MSF with only a few lines of code. The javascript SDK runs completely in the browser and is therefore the best choice for single page web applications.

The implementation is build on top of [Stophe.js][2].

## Build and Deploy
To build the SDK, run the build task with ant:

    $ ant build

To integrate the SDK in your application, include akk scripts provided in your web project, keeping up the following order:

    <html>
    	<head>
    		[...]
    		<script type="text/javascript" src="js/jquery-1.11.0.min.js"></script>
    		<script type="text/javascript" src="js/strophe.min.js"></script>
    		<script type="text/javascript" src="js/strophe.x.js"></script>
    		<script type="text/javascript" src="js/strophe.disco.js"></script>
    		<script type="text/javascript" src="js/strophe.pubsub.js"></script>
    		<script type="text/javascript" src="js/strophe.register.js"></script>			
    		<script type="text/javascript" src="js/strophe.spaces.js"></script>
    		<script type="text/javascript" src="js/spaces-sdk-javascript.js"></script>
    		[...]
    	</head>
    	[...]
    </html>


## Usage
The SDK for Java implements the [Space SDK API][3]. Three major handlers are provided to use the MSF:

1. **[ConnectionHandler][4]**
  A handler to establish and manage the connection to the XMPP server.
2. **[SpaceHandler][5]**
  This handler provides a set of methods to manage the spaces you can access. There are methods for the access, creation, management, and deletion of spaces. For space management operations the application has to be online. Retrieving space information is also possible in offline mode, as long as the information is available in the handler's cache. 
3. **[DataHandler][6]**
  The data handler provides methods to register for notifications about newly published data, and with methods to send and retrieve it. Additionally it allows queries to the [persistence service][7] to retrieve and manage persisted data.

Details about the usage of the handlers and connected classes are available of the API documentation.
http://docs.mirror-demo.eu/spaces-sdk/javascript/1.3/

## Upgrade
An upgrade guide is available [here][8].

## License
The Spaces SDK for Java is provided under the [Apache License 2.0][9].
License information for third party libraries is provided with the JS files.

## Changelog
v1.3 RC1 - February 14, 2014

- Implements Spaces SDK API 1.3. See migration guide for updates.
- [UPDATE] Updated Strophe.js and jQuery to latest version.
- [UPDATE] Updated Strophe.js plugins. 
- [NEW] Implemented CDM version 2.0. Changed CDM default version to 2.0.
- [NEW] DataObjectBuilder: Added methods to add attachments in CDT namespace.
- [NEW] DataObjectBuilder: Added getRootElement() to allow direct modification.

v1.2 - October 21, 2013

- [FIX] Fixed data object serialization to work properly in IE 9+.

v1.2 RC2 - September 3, 2013

- [FIX] DataHandler.retrieveDataObjects() is now implemented properly to handle asynchronous requests.

v1.2 RC1 - June 6, 2013

- Implements Spaces SDK API 1.2
- Added strophe.register.js as dependency.
- [FIX] Fixed critical bug causing all data object to share the same CDM data reference.
- [UPDATE] DataHandler.publishDataObject() improved error handling.
- [FIX] DataHandler.retrieveDataObjects() is now implemented properly to handle asynchronous requests.

v1.1.2 - May 29, 2013

- Fixed bug causing a wrong mapping of space member roles when a space is requested.

v1.1.1 - April 4, 2013

- Fixed bug preventing access to persisted data objects.

v1.1 - February 27, 2013

- Several bug fixes.
- Updated documentation.

v1.1_BETA1 - January 23, 2013

- Implements Spaces SDK API 1.1.
- Compatible with MIRROR Spaces Service 0.4.x.


  [1]: https://github.com/MirrorIP
  [2]: http://strophe.im/strophejs/
  [3]: %28https://github.com/MirrorIP/msf-spaces-sdk-api
  [4]: http://docs.mirror-demo.eu/spaces-sdk/javascript/1.3/SpacesSDK.ConnectionHandler.html
  [5]: http://docs.mirror-demo.eu/spaces-sdk/javascript/1.3/SpacesSDK.SpaceHandler.html
  [6]: http://docs.mirror-demo.eu/spaces-sdk/javascript/1.3/SpacesSDK.DataHandler.html
  [7]: https://github.com/MirrorIP/msf-persistence-service
  [8]: https://github.com/MirrorIP/msf-spaces-sdk-javascript/wiki/Upgrade-Guide
  [9]: http://www.apache.org/licenses/LICENSE-2.0.html