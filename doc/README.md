# Spaces SDK for JavaScript 1.3 #

## Introduction ##

The Spaces SDK (Software Development Kit) provides a set of handlers to make use of the MIRROR Spaces Service and connected services of the MIRROR Interoperability Framework.

The SDK provides three handlers:

* [*ConnectionHandler*](SpacesSDK.ConnectionHandler.html)
  A handler to establish and manage the connection to the XMPP server.
* [*SpaceHandler*](SpacesSDK.SpaceHandler.html)
  This handler provides a set of methods to manage the spaces you can access. There are methods for the access, creation, management, and deletion of spaces.
* [*DataHandler*](SpacesSDK.DataHandler.html)
  The data handler provides methods to register for notifications about newly published data, and with methods to send and retrieve it.

All objects provided by this SDK are encapsulated in a module named SpacesSDK. On order to keep in line with the [SDK API](http://docs.mirror-demo.eu/spaces-sdk/api/1.2/), we decided to used a class-based approached also in the JavaScript version of the SDK.

## Establish an Connection to the MSF Server ##

The SDK provides the connection handler to establish and manage connection to the XMPP server. The following lines show the minimal configuration required to prepare a connection using this handler:

	var domain = "mirror-demo.eu"; // If you don’t use the PTS, change this.
	var appId = "myApp"; // Adapt this so it fits the app you’re using.
	var httpBind = "../http-bind";
	var builder = new SpacesSDK.ConnectionConfigurationBuilder(domain, appId);
	var connectionConfig = builder.build();
	var connectionHandler = new SpacesSDK.ConnectionHandler(userName, userPass, connectionConfig, httpBind);

The connection handler expects four parameters:

1. The name of the user to log in, e.g. "alice".
2. The password of the user.
3. A configuration object specifying the properties of the connection.
4. The path to the HTTP-Binding (BOSH) service of the XMPP server (or the related proxy endpoint).

If you want to get notified whenever the connection status changes, you can add a ConnectionStatusListener as follows:

	var statusListener = new SpacesSDK.ConnectionStatusListener('listener01', function(status) {
		switch (status) {
		case SpacesSDK.ConnectionStatus.ONLINE:
			// The connection has been established. Now you can initialize the other handlers.
			console.log('Connection established.');
			break;
		case SpacesSDK.ConnectionStatus.OFFLINE:
			// The connection has been closed.
			console.log('Connection closed.');
			break;
		case SpacesSDK.ConnectionStatus.ERROR:
			// An error occured.
			console.log('The connection was closed by an error.');
			break;
	});

	connectionHandler.addConnectionStatusListener(statusListener);

At this point the connection is configured, but not established. To establish the connection call the connect() method.

	try {
		connectionHandler.connect();
	} catch (e) {
		console.log('Failed to connect to the server. Reason:', e);
	}

## Manage Spaces Using the Space Handler ##

To set up the space handler, only the previous created ConnectionHandler object is required as a parameter.

	var spaceHandler = new SpacesSDK.SpaceHandler(connectionHandler);

After verifying the connection is established (e.g. with a ConnectionStatusListener) lets try to fetch the list of spaces available to the user currently logged in and print their names. As all communication is asynchronous, we make use of callback functions.

	spaceHandler.getAllSpaces(function(result) {
		for (var i in result) {
			alert(result[i].getName());
		}
	}, function(error) {
		console.log('Failed to retrieve list of spaces. Reason:', error);
	});

The following example requests the private space of the current user. If the space doesn't exist, it is created. Finally, the JID of the current user (e.g. "alice@mirror-demo.eu") is printed, as a private space has exactly one user.

	spaceHandler.getDefaultSpace(function(myPrivateSpace) {
		if (myPrivateSpace == null) {
			spaceHandler.createDefaultSpace(function(result) {
				console.log('Owner of the private space: ' + result.getMembers()[0].getJID());
			}, function(error) {
				console.log('Failed to create private space. Reason:', error);
			);
		} else {
			console.log('Owner of the private space: ' + myPrivateSpace.getMembers()[0].getJID());
		}
	}, function(error) {
		console.log('Failed to retrieve private space. Reason:', error);
	});

In the last example a new team space with the current user and "bob" as members and and the name "Dream Team" is created.

	// create space configuration with the current user as space moderator
	var type = Type.TEAM;
	var name = "Dream Team";
	var owner = new SpacesSDK.SpaceMember(connectionHandler.getCurrentUser().getBareJID(), SpacesSDK.Role.MODERATOR);
	var persistenceType = SpacesSDK.PersistenceType.OFF;
	var spaceConfig = new SpacesSDK.SpaceConfiguration(type, name, [owner], persistenceType);
	
	// add the user bob as space member
	var bobsJID = "bob" + "@" + connectionHandler.getConfiguration().getDomain();
	spaceConfig.addMember(new SpacesSDK.SpaceMember(bobsJID, SpacesSDK.Role.MEMBER));
	
	spaceHandler.createSpace(spaceConfig, function(newTeamSpace) {
		// do something with the new team space
	}, function(error) {
		console.log('Failed to create team space. Reason:', error);
	});

## Receive and Send Data Using the Data Handler ##

The data handler is built on top of the other handlers. Initializing the handler is straight forward:

	var dataHandler = new SpacesSDK.DataHandler(connectionHandler, spaceHandler);

Next, we configure the space handler to listen to the team space we just created, and add a data object listener to be notified when a data object arrives on the space.

	dataHandler.registerSpace(myNewTeamSpace.getId());
	var myListener = new SpacesSDK.DataObjectListener('listener02', function(dataObject, spaceId) {
		var objectId = dataObject.getId();
		console.log('Received object ' + objectId + ' from space ' + spaceId + '.');
	});
	
	dataHandler.addDataObjectListener(myListener);

Multiple spaces can be registered at a single data handler instance. For all operations, the handler identifies the related space by its id.

Finally, we publish some data on the team space. The data should look like this:

    > <foo xmlns="mirror:application:myapp:foo" attr="value">
    > 	<bar>Some Content</bar>
    > </foo>

To create the data object you can use the `DataObjectBuilder`:

	// create the data object using the object builder
	var dataObjectBuilder = new SpacesSDK.DataObjectBuilder("foo", "mirror:application:myapp:foo");
	var attributes = {attr: "value"};

	dataObjectBuilder.addNewElement("bar", attributes, "Some Content", false);
	var dataObject = dataObjectBuilder.build();

	// publish the data
	dataHandler.publishDataObject(dataObject, myNewTeamSpace.getId(), function() {
		// Optional callback if the publishing succeeds.
		console.log('Successfully published a data object.');
	}, function(error) {
		// Optional callback if the publishing fails. Defaults to console output.
		console.log('Failed to publish data object. Reason:', error);
	});

__Note:__ As all requests are handled asynchronously, so it can happen in this example that the data object will be published before the handler is configured to receive any data objects from the related space.