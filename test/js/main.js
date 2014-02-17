var SpacesSDKTest = (function() {
	var testCounter = 0;
	var testObjects = {};
	var testSuites = {};
	
	function assertEquals(message, expected, value, object) {
		if (expected != value) {
			console.warn('Test failed: '+ message , 'Expected:', expected, 'Value:', value);
			if (object) {
				testObjects[testCounter] = object;
				console.log('Related object stored as SpacesSDKTest.testObjects[' + testCounter + '].');
				testCounter = testCounter + 1;
			}
		}
	}
	
	function assertNotNull(message, value) {
		if (value == null) {
			console.warn('Test failed: ' + message);
		}
	}
	
	function fail(message) {
		console.warn('Test failed: ' + message);
	}
	
	testSuites['CDMDataTests'] = function() {
		var tests = {};
		
		var init = function(onComplete) {
			onComplete();
		};
		
		var destroy = function(onComplete) {
			onComplete();
		};
				
		tests['SpacesSDK.cdm.Reference'] = function(onComplete) {
			var reference = new SpacesSDK.cdm.Reference('12345', SpacesSDK.cdm.Reference.ReferenceType.WEAK);
			assertEquals('ID of the referenced data object is invalid.', '12345', reference.getId(), reference);
			assertEquals('Type of the reference is wrong.', SpacesSDK.cdm.Reference.ReferenceType.WEAK, reference.getReferenceType(), reference);
			var rootElement = SpacesSDK.Utils.createXMLDocument('root','mirror:spaces:sdk:test').firstChild;
			reference.addToElement(rootElement);
			console.debug(SpacesSDK.Utils.generateXMLString(rootElement.firstChild));
			assertEquals('XML element name is wrong.', 'reference', rootElement.firstChild.nodeName, rootElement);
			assertEquals('ID of the referenced data object is not applied correctly.', '12345', rootElement.firstChild.getAttribute('id'), rootElement);
			assertEquals('Type of the reference is not applied correctly.', SpacesSDK.cdm.Reference.ReferenceType.WEAK, rootElement.firstChild.getAttribute('type'), rootElement);
			reference = new SpacesSDK.cdm.Reference('54321', SpacesSDK.cdm.Reference.ReferenceType.DEPENDENCY);
			reference.addToElement(rootElement);
			console.debug(SpacesSDK.Utils.generateXMLString(rootElement.childNodes[1]));
			assertEquals('Type of the reference is not applied correctly.', null, rootElement.childNodes[1].getAttribute('type'), rootElement);
			reference = new SpacesSDK.cdm.Reference('54321');
			reference.addToElement(rootElement);
			console.debug(SpacesSDK.Utils.generateXMLString(rootElement.childNodes[2]));
			assertEquals('Type of the reference is not applied correctly.', null, rootElement.childNodes[2].getAttribute('type'), rootElement);
			onComplete();
		};
		
		tests['SpacesSDK.cdm.CreationInfo'] = function(onComplete) {
			var creationInfo = new SpacesSDK.cdm.CreationInfo('2014-02-06T14:10+01:00', 'alice', 'jstest');
			assertEquals('Wrong date returned.', '2014-02-06T14:10+01:00', creationInfo.getCreationDate(), creationInfo);
			assertEquals('Wrong creator returned.', 'alice', creationInfo.getCreator(), creationInfo);
			assertEquals('Wrong application returned.', 'jstest', creationInfo.getApplication(), creationInfo);
			var rootElement = SpacesSDK.Utils.createXMLDocument('root','mirror:spaces:sdk:test').firstChild;
			creationInfo.addToElement(rootElement);
			var expectedXMLString = '<creationInfo><date>2014-02-06T14:10+01:00</date><person>alice</person><application>jstest</application></creationInfo>';
			assertEquals('Generated XML does not match expected string.', expectedXMLString, SpacesSDK.Utils.generateXMLString(rootElement.firstChild), rootElement);
			onComplete();
		};
		
		tests['SpacesSDK.CDMDataBuilder'] = function(onComplete) {
			var cdmBuilder = new SpacesSDK.CDMDataBuilder(SpacesSDK.cdm.CDMVersion.CDM_2_0);
			cdmBuilder.setCustomId('custom01');
			cdmBuilder.setModelVersion('0.2');
			cdmBuilder.setPublisher('alice');
			cdmBuilder.setRef('11111');
			cdmBuilder.setCopyOf('54321');
			cdmBuilder.setUpdates('12345');
			cdmBuilder.setSummary('my summary');
			cdmBuilder.addReference(new SpacesSDK.cdm.Reference('22222'));
			cdmBuilder.setCreationInfo(new SpacesSDK.cdm.CreationInfo('2014-02-06T14:10+01:00'));
			var cdmData = cdmBuilder.build();
			assertEquals('Wrong CDM version returned.', SpacesSDK.cdm.CDMVersion.CDM_2_0, cdmData.getCDMVersion(), cdmData);
			var rootElement = SpacesSDK.Utils.createXMLDocument('root','mirror:spaces:sdk:test').firstChild;
			cdmData.applyToElement(rootElement);
			var expectedXMLString = "<root cdmVersion='2.0' customId='custom01' modelVersion='0.2' ref='11111' publisher='alice' copyOf='54321' updates='12345'><summary>my summary</summary><references><reference id='22222'/></references><creationInfo><date>2014-02-06T14:10+01:00</date></creationInfo></root>";
			assertEquals('Generated XML does not match expected string.', expectedXMLString, SpacesSDK.Utils.generateXMLString(rootElement));
			cdmBuilder = new SpacesSDK.CDMDataBuilder(SpacesSDK.cdm.CDMVersion.CDM_1_0);
			cdmBuilder.setModelVersion('0.2');
			cdmData = cdmBuilder.build();
			assertEquals('Wrong CDM version returned.', SpacesSDK.cdm.CDMVersion.CDM_1_0, cdmData.getCDMVersion(), cdmData);
			onComplete();
		};


		return {
			'tests' : tests,
			'init' : init,
			'destroy' : destroy
		};
	};
	
	testSuites['ConnectionHandlerTests'] = function() {
		var tests = {};
		
		var init = function(onComplete) {
			onComplete();
			// nothing
		};
		
		var destroy = function(onComplete) {
			onComplete();
			// nothing
		};
		
		tests['SpacesSDK.NetworkInformation'] = function(onComplete) {
			var networkInfo = new SpacesSDK.NetworkInformation('spaces.mydomain.com', '0.5', 'persistence.mydomain.com');
			assertEquals('The returned spaces service JID does not match.', 'spaces.mydomain.com', networkInfo.getSpacesServiceJID(), networkInfo);
			assertEquals('The returned spaces service version does not match.', '0.5', networkInfo.getSpacesServiceVersion(), networkInfo);
			assertEquals('The returned persistence service JID does not match.', 'persistence.mydomain.com', networkInfo.getPersistenceServiceJID(), networkInfo);
			onComplete();
		};
		
		tests['SpacesSDK.ConnectionHandler.getNetworkInformation'] = function(onComplete) {
			var conConfigBuilder = new SpacesSDK.ConnectionConfigurationBuilder(PROPERTIES.xmpp.domain, PROPERTIES.xmpp.appId);
			var conConfig = conConfigBuilder.build();
			var connectionHandler = new SpacesSDK.ConnectionHandler(PROPERTIES.data.users.user01.id, PROPERTIES.data.users.user01.password, conConfig, PROPERTIES.xmpp.service);
			
			connectionHandler.addConnectionStatusListener(new SpacesSDK.ConnectionStatusListener('testlistener', function(newStatus) {
				switch (newStatus) {
					case SpacesSDK.ConnectionStatus.ONLINE:
						console.debug('Connection established.');
						var networkInfo = connectionHandler.getNetworkInformation();
						assertNotNull('Failed to retrieve network information.', networkInfo);
						assertEquals('Wrong space service JID returned.', PROPERTIES.msf.spacesService.subdomain + '.' + PROPERTIES.xmpp.domain, networkInfo.getSpacesServiceJID(), networkInfo);
						assertEquals('Wrong spaces service version returned.', PROPERTIES.msf.spacesService.version, networkInfo.getSpacesServiceVersion(), networkInfo);
						assertEquals('Wrong persistence service JID returned.', PROPERTIES.msf.persistenceService.subdomain + '.' + PROPERTIES.xmpp.domain, networkInfo.getPersistenceServiceJID(), networkInfo);
						onComplete();
						break;
					case SpacesSDK.ConnectionStatus.ERROR:
						console.error('Failed to establish connection. Test aborted.');
						onComplete();
						break;
					default:
						console.debug('Connection status changed: ' + newStatus);
				}
			}));
			
			connectionHandler.connect();			
		};
		
		tests['SpacesSDK.ConnectionHandler.connectAndCreateUser'] = function(onComplete) {
			var conConfigBuilder = new SpacesSDK.ConnectionConfigurationBuilder(PROPERTIES.xmpp.domain, PROPERTIES.xmpp.appId);
			var conConfig = conConfigBuilder.build();
			var userId = 'system.test.' + (new Date()).getTime();
			var connectionHandler = new SpacesSDK.ConnectionHandler(userId, userId + '#MIRROR', conConfig, PROPERTIES.xmpp.service);
			
			connectionHandler.addConnectionStatusListener(new SpacesSDK.ConnectionStatusListener('testlistener', function(newStatus) {
				switch (newStatus) {
					case SpacesSDK.ConnectionStatus.ONLINE:
						console.debug('Connection established and user created.');
						connectionHandler.disconnect();
						onComplete();
						break;
					case SpacesSDK.ConnectionStatus.ERROR:
						console.error('Failed to establish connection. Test aborted.');
						onComplete();
						break;
					default:
						console.debug('Connection status changed: ' + newStatus);
				}
			}));
			
			connectionHandler.connectAndCreateUser();			
		};

		return {
			'tests' : tests,
			'init' : init,
			'destroy' : destroy
		};
	};
	
	testSuites['DataObjectFilterTests'] = function() {
		var dataObject = null;
		var tests = {};
		
		var init = function(onComplete) {
			var cdmBuilder = new SpacesSDK.CDMDataBuilder(SpacesSDK.cdm.CDMVersion.CDM_2_0);
			cdmBuilder.setId('12345');
			cdmBuilder.setModelVersion('0.2');
			cdmBuilder.setPublisher('alice@mirror-demo.eu/myapp');
			cdmBuilder.setTimestamp('2014-02-09T09:23:58+01:00');
			cdmBuilder.setRef('54321');
			var dataObjectBuilder = new SpacesSDK.DataObjectBuilder('test', 'ns:test');
			dataObjectBuilder.setCDMData(cdmBuilder.build());
			dataObject = dataObjectBuilder.build();
			console.debug('Data object for filter testing: ' + dataObject.toString());
			onComplete();
		};
		
		var destroy = function(onComplete) {
			onComplete();
		};
		
		tests['SpacesSDK.filter.DataModelFilter'] = function(onComplete) {
			var filter = new SpacesSDK.filter.DataModelFilter('ns:test','0.2');
			console.debug('DateModelFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should pass the filter.', true, filter.isDataObjectValid(dataObject));
			filter = new SpacesSDK.filter.DataModelFilter('ns:test','0.3');
			console.debug('DateModelFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should NOT pass the filter.', false, filter.isDataObjectValid(dataObject));
			filter = new SpacesSDK.filter.DataModelFilter('ns:other');
			console.debug('DateModelFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should NOT pass the filter.', false, filter.isDataObjectValid(dataObject));
			onComplete();
		};
		
		tests['SpacesSDK.filter.NamespaceFilter'] = function(onComplete) {
			var filter = new SpacesSDK.filter.NamespaceFilter('ns:test', SpacesSDK.filter.NamespaceFilter.CompareType.STRICT);
			console.debug('NamespaceFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should pass the filter.', true, filter.isDataObjectValid(dataObject));
			filter = new SpacesSDK.filter.NamespaceFilter('ns:test');
			console.debug('NamespaceFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should pass the filter.', true, filter.isDataObjectValid(dataObject));
			filter = new SpacesSDK.filter.NamespaceFilter('test', SpacesSDK.filter.NamespaceFilter.CompareType.CONTAINS);
			console.debug('NamespaceFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should pass the filter.', true, filter.isDataObjectValid(dataObject));
			filter = new SpacesSDK.filter.NamespaceFilter('ns:t..t', SpacesSDK.filter.NamespaceFilter.CompareType.REGEX);
			console.debug('NamespaceFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should pass the filter.', true, filter.isDataObjectValid(dataObject));
			
			filter = new SpacesSDK.filter.NamespaceFilter('ns:tes', SpacesSDK.filter.NamespaceFilter.CompareType.STRICT);
			console.debug('NamespaceFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should NOT pass the filter.', false, filter.isDataObjectValid(dataObject));
			filter = new SpacesSDK.filter.NamespaceFilter('tset', SpacesSDK.filter.NamespaceFilter.CompareType.CONTAINS);
			console.debug('NamespaceFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should NOT pass the filter.', false, filter.isDataObjectValid(dataObject));
			filter = new SpacesSDK.filter.NamespaceFilter('ns:t.t', SpacesSDK.filter.NamespaceFilter.CompareType.REGEX);
			console.debug('NamespaceFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should NOT pass the filter.', false, filter.isDataObjectValid(dataObject));
			onComplete();
		};
		
		tests['SpacesSDK.filter.PeriodFilter'] = function(onComplete) {
			var filter = new SpacesSDK.filter.PeriodFilter(new Date('2014-02-08T09:23:58+01:00'), new Date('2014-02-10T09:23:58+01:00'));
			console.debug('PeriodFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should pass the filter.', true, filter.isDataObjectValid(dataObject));
			filter = new SpacesSDK.filter.PeriodFilter(new Date('2014-02-08T09:23:58+01:00'));
			console.debug('PeriodFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should pass the filter.', true, filter.isDataObjectValid(dataObject));
			filter = new SpacesSDK.filter.PeriodFilter(null, new Date('2014-02-10T09:23:58+01:00'));
			console.debug('PeriodFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should pass the filter.', true, filter.isDataObjectValid(dataObject));
			
			filter = new SpacesSDK.filter.PeriodFilter(new Date('2014-02-07T09:23:58+01:00'), new Date('2014-02-08T09:23:58+01:00'));
			console.debug('PeriodFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should NOT pass the filter.', false, filter.isDataObjectValid(dataObject));
			filter = new SpacesSDK.filter.PeriodFilter(new Date('2014-02-10T08:23:58+01:00'));
			console.debug('PeriodFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should NOT pass the filter.', false, filter.isDataObjectValid(dataObject));
			filter = new SpacesSDK.filter.PeriodFilter(null, new Date('2014-02-08T09:23:58+01:00'));
			console.debug('PeriodFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should NOT pass the filter.', false, filter.isDataObjectValid(dataObject));
			onComplete();
		};
		
		tests['SpacesSDK.filter.PublisherFilter'] = function(onComplete) {
			var filter = new SpacesSDK.filter.PublisherFilter('alice@mirror-demo.eu');
			console.debug('PublisherFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should pass the filter.', true, filter.isDataObjectValid(dataObject));
			filter = new SpacesSDK.filter.PublisherFilter('alice@mirror-demo.eu/myapp');
			console.debug('PeriodFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should pass the filter.', true, filter.isDataObjectValid(dataObject));
			
			filter = new SpacesSDK.filter.PublisherFilter('bob@mirror-demo.eu');
			console.debug('PeriodFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should NOT pass the filter.', false, filter.isDataObjectValid(dataObject));
			onComplete();
		};
		
		tests['SpacesSDK.filter.ReferencesFilter'] = function(onComplete) {
			var filter = new SpacesSDK.filter.ReferencesFilter('54321');
			console.debug('ReferencesFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should pass the filter.', true, filter.isDataObjectValid(dataObject));
			
			filter = new SpacesSDK.filter.ReferencesFilter('11111');
			console.debug('ReferencesFilter generated: ' + SpacesSDK.Utils.generateXMLString(filter.getFilterAsXML('urn:xmpp:spaces:persistence')));
			assertEquals('Data object should NOT pass the filter.', false, filter.isDataObjectValid(dataObject));
			onComplete();
		};
		
		tests['SpacesSDK.filter.AndFilter'] = function(onComplete) {
			var filterA = new SpacesSDK.filter.ReferencesFilter('54321');
			var filterB = new SpacesSDK.filter.PublisherFilter('alice@mirror-demo.eu');
			var filterC = new SpacesSDK.filter.ReferencesFilter('11111');
			var andFilter = new SpacesSDK.filter.AndFilter();
			andFilter.addFilter(filterA);
			assertEquals('Data object should pass the filter.', true, andFilter.isDataObjectValid(dataObject));

			andFilter.addFilter(filterB);
			assertEquals('Data object should pass the filter.', true, andFilter.isDataObjectValid(dataObject));
			
			andFilter.addFilter(filterC);
			assertEquals('Data object should NOT pass the filter.', false, andFilter.isDataObjectValid(dataObject));
			
			onComplete();
		};
		
		tests['SpacesSDK.filter.OrFilter'] = function(onComplete) {
			var filterA = new SpacesSDK.filter.ReferencesFilter('11111');
			var filterB = new SpacesSDK.filter.PublisherFilter('alice@mirror-demo.eu');
			var orFilter = new SpacesSDK.filter.OrFilter();
			orFilter.addFilter(filterA);
			assertEquals('Data object should NOT pass the filter.', false, orFilter.isDataObjectValid(dataObject));

			orFilter.addFilter(filterB);
			assertEquals('Data object should pass the filter.', true, orFilter.isDataObjectValid(dataObject));
			
			onComplete();
		};	
		
		return {
			'tests' : tests,
			'init' : init,
			'destroy' : destroy
		};
	};
	
	testSuites['DataHandlerTests'] = function() {
		var tests = {};
		var connectionHandler, spaceHandler, dataHandler;
		var dataObject;
		var testSpaceId = PROPERTIES.data.users.user01.id;
		
		var init = function(onComplete) {
			var cdmBuilder = new SpacesSDK.CDMDataBuilder(SpacesSDK.cdm.CDMVersion.CDM_2_0);
			cdmBuilder.setId('12345');
			cdmBuilder.setModelVersion('0.2');
			cdmBuilder.setPublisher('auto');
			cdmBuilder.setTimestamp('2014-02-09T09:23:58+01:00');
			cdmBuilder.setRef('54321');
			cdmBuilder.setCustomId('12345');
			var dataObjectBuilder = new SpacesSDK.DataObjectBuilder('ping', 'mirror:application:ping:ping');
			dataObjectBuilder.setCDMData(cdmBuilder.build());
			dataObject = dataObjectBuilder.build();
			console.debug('Data object for filter testing: ' + dataObject.toString());
			
			var connectionStatusHandler = function(newStatus) {
				console.debug('Connection status changed: ' + newStatus);
				switch (newStatus) {
					case SpacesSDK.ConnectionStatus.ONLINE:
						spaceHandler = new SpacesSDK.SpaceHandler(connectionHandler);
						dataHandler = new SpacesSDK.DataHandler(connectionHandler, spaceHandler);
						dataHandler.registerSpace(testSpaceId);
						console.debug('DataHandler initialized.');
						onComplete();
						break;
					case SpacesSDK.ConnectionStatus.ERROR:
						console.error('Failed to establish XMPP connection. Test aborted.');
						onComplete();
						break;
				}
			};
			
			var conConfigBuilder = new SpacesSDK.ConnectionConfigurationBuilder(PROPERTIES.xmpp.domain, PROPERTIES.xmpp.appId);
			var conConfig = conConfigBuilder.build();
			connectionHandler = new SpacesSDK.ConnectionHandler(PROPERTIES.data.users.user01.id, PROPERTIES.data.users.user01.password, conConfig, PROPERTIES.xmpp.service);
			
			connectionHandler.addConnectionStatusListener(new SpacesSDK.ConnectionStatusListener('testlistener', connectionStatusHandler));
			
			connectionHandler.connect();
		};
		
		var destroy = function(onComplete) {
			connectionHandler.disconnect();
			onComplete();
		};
		
		tests['SpacesSDK.DataHandler.(set/get)DataObjectFilter'] = function(onComplete) {
			var dataObjectFilter = new SpacesSDK.filter.PublisherFilter(connectionHandler.getCurrentUser().getBareJID());
			dataHandler.setDataObjectFilter(dataObjectFilter);
			var retrievedFilter = dataHandler.getDataObjectFilter();
			assertEquals('Data object filter received does not match with the one set.', dataObjectFilter, retrievedFilter);
			
			
			dataHandler.addDataObjectListener(new SpacesSDK.DataObjectListener('firstListener', function(dataObjectReceived, spaceId) {
				console.debug('Received object on space ' + spaceId + '.');
				assertEquals('Received data object does not match test object.', '12345', dataObjectReceived.getCDMData().getCustomId(), dataObjectReceived);
				dataHandler.removeDataObjectListener({name: 'firstListener'});
				
				dataHandler.setDataObjectFilter(new SpacesSDK.filter.PublisherFilter('noone@mirror-demo.eu'));
				dataHandler.addDataObjectListener(new SpacesSDK.DataObjectListener('secondListener', function(dataObjectReceived, spaceId) {
					console.debug('Received object on space ' + spaceId + '.');
					fail('The data object should have been filtered.');
					dataHandler.removeDataObjectListener({name: 'secondListener'});
					onComplete();
				}));
				
				dataHandler.publishDataObject(dataObject, testSpaceId, function() {
					console.debug('Second test object published.');
				}, function(error) {
					console.debug('Publishing failed. Error:', error);
					throw 'Failed to publish test data object.'; 
				});
				window.setTimeout(function() {
					// Nothing received. Good! 
					onComplete();
				}, PROPERTIES.params.timeout + 500);
				
			}));
			
			dataHandler.publishDataObject(dataObject, testSpaceId, function() {
				console.debug('Test object published.');
			}, function(error) {
				console.debug('Publishing failed. Error:', error);
				throw 'Failed to publish test data object.'; 
			});
			
			var dataObjectFilter = new SpacesSDK.filter.PublisherFilter(connectionHandler.getCurrentUser().getBareJID());
		};
		
		tests['SpacesSDK.DataHandler.receiveDataObjects'] = function(onComplete) {
			assertEquals('An initial call should return an emtpy list.', 0 , dataHandler.retrieveDataObjects(testSpaceId).length);
			 
			dataHandler.addDataObjectListener(new SpacesSDK.DataObjectListener('secondListener', function(dataObjectReceived, spaceId) {
				console.debug('Received object on space ' + spaceId + '.');
				if (spaceId == testSpaceId) {
					var dataObjectsCached = dataHandler.retrieveDataObjects(testSpaceId);
					assertEquals('The list of data objects returned should contain a single element.', 1, dataObjectsCached.length, dataObjectsCached);
					onComplete();
				}
				
			}));
			
			dataHandler.publishDataObject(dataObject, testSpaceId, function() {
				console.debug('Test object published.');
			}, function(error) {
				console.debug('Publishing failed. Error:', error);
				throw 'Failed to publish test data object.'; 
			});
		};
		
		tests['SpacesSDK.DataHandler.queryDataObjectById'] = function(onComplete) {
			
			dataHandler.addDataObjectListener(new SpacesSDK.DataObjectListener('mylistener', function(receivedDataObject, spaceId) {
				console.debug('Received object on space ' + spaceId + '.');
				
				dataHandler.queryDataObjectById(receivedDataObject.getId(), function(queriedObject) {
					console.debug('Received query result.');
					assertEquals('Data objects to not match.', receivedDataObject.getId(), queriedObject.getId(), queriedObject);
					onComplete();
				}, function(error) {
					fail('Request error: ' + error);
					onComplete();
				});
			}));
			
			dataHandler.publishDataObject(dataObject, testSpaceId, function(receivedDataObject) {
				console.debug('Test object published.');
			}, function(error) {
				console.debug('Publishing failed. Error:', error);
				throw 'Failed to publish test data object.'; 
			});
		};
		
		tests['SpacesSDK.DataHandler.queryDataObjectsById'] = function(onComplete) {
			
			var receivedDataObjectIds = [];
			dataHandler.addDataObjectListener(new SpacesSDK.DataObjectListener('mylistener', function(receivedDataObject, spaceId) {
				console.debug('Received object on space ' + spaceId + '.');
				receivedDataObjectIds.push(receivedDataObject.getId());
				
				if (receivedDataObjectIds.length == 2) {
					var filters = [
						new SpacesSDK.filter.PublisherFilter(connectionHandler.getCurrentUser().getBareJID()),
						new SpacesSDK.filter.PeriodFilter(null, new Date())
					];
					dataHandler.queryDataObjectsById(receivedDataObjectIds, filters, function(queriedObject) {
						console.debug('Received query result.');
						assertEquals('Invalid number of data objects.', 2, queriedObject.length, queriedObject);
						assertEquals('Returned unrequested object.', true, receivedDataObjectIds.indexOf(queriedObject[0].getId()) >= 0, queriedObject);
						assertEquals('Returned unrequested object.', true, receivedDataObjectIds.indexOf(queriedObject[1].getId()) >= 0, queriedObject);
						onComplete();
					}, function(error) {
						fail('Request error: ' + error);
						onComplete();
					});
				}
			}));
			
			var onError = function(error) {
				console.debug('Publishing failed. Error:', error);
				throw 'Failed to publish test data object.'; 
			};
			
			dataHandler.publishDataObject(dataObject, testSpaceId, function(receivedDataObject) {
				console.debug('First object published.');
				dataHandler.publishDataObject(dataObject, testSpaceId, function(receivedDataObject) {
					console.debug('Second object published.');
				}, onError);
			}, onError);
		};
		
		tests['SpacesSDK.DataHandler.queryDataObjectsBySpace'] = function(onComplete) {
			dataHandler.addDataObjectListener(new SpacesSDK.DataObjectListener('mylistener', function(receivedDataObject, spaceId) {
				console.debug('Received object on space ' + spaceId + '.');
				
				var now = new Date();
				var filters = [
					new SpacesSDK.filter.PublisherFilter(connectionHandler.getCurrentUser().getBareJID()),
					new SpacesSDK.filter.PeriodFilter(new Date(now.getTime() - 5000))
				];
				dataHandler.queryDataObjectsBySpace(testSpaceId, filters, function(queriedObject) {
					console.debug('Received filtered query result, stored as SpacesSDKTest.testObjects[' + testCounter + '].');
					testObjects[testCounter++] = queriedObject;
					assertEquals('At least one data object should have been returned.', true, queriedObject.length > 0, queriedObject);
					onComplete();
				}, function(error) {
					fail('Request error: ' + error);
					onComplete();
				});
			}));
			
			var onError = function(error) {
				console.debug('Publishing failed. Error:', error);
				throw 'Failed to publish test data object.'; 
			};
			
			dataHandler.publishDataObject(dataObject, testSpaceId, function(receivedDataObject) {
				console.debug('First object published.');
			}, onError);
		};
		
		tests['SpacesSDK.DataHandler.queryDataObjectsBySpaces'] = function(onComplete) {
			dataHandler.addDataObjectListener(new SpacesSDK.DataObjectListener('mylistener', function(receivedDataObject, spaceId) {
				console.debug('Received object on space ' + spaceId + '.');
				
				var now = new Date();
				var filters = [
					new SpacesSDK.filter.PublisherFilter(connectionHandler.getCurrentUser().getBareJID()),
					new SpacesSDK.filter.PeriodFilter(new Date(now.getTime() - 5000))
				];
				dataHandler.queryDataObjectsBySpaces([testSpaceId], filters, function(queriedObject) {
					console.debug('Received query result, stored as SpacesSDKTest.testObjects[' + testCounter + '].');
					testObjects[testCounter++] = queriedObject;
					assertEquals('At least one data object should have been returned.', true, queriedObject.length > 0, queriedObject);
					onComplete();
				}, function(error) {
					fail('Request error: ' + error);
					onComplete();
				});
			}));
			
			var onError = function(error) {
				console.debug('Publishing failed. Error:', error);
				throw 'Failed to publish test data object.'; 
			};
			
			dataHandler.publishDataObject(dataObject, testSpaceId, function(receivedDataObject) {
				console.debug('First object published.');
			}, onError);
		};
		
		tests['SpacesSDK.DataHandler.deleteDataObject'] = function(onComplete) {
			dataHandler.addDataObjectListener(new SpacesSDK.DataObjectListener('mylistener', function(receivedDataObject, spaceId) {
				console.debug('Received object on space ' + spaceId + '.');
				
				dataHandler.deleteDataObject(receivedDataObject.getId(), function(isDeleted) {
					assertEquals('No object was deleted.', true, isDeleted);
					onComplete();
				}, function(error) {
					fail('Request error: ' + error);
					onComplete();
				});
			}));
			
			var onError = function(error) {
				console.debug('Publishing failed. Error:', error);
				throw 'Failed to publish test data object.'; 
			};
			
			dataHandler.publishDataObject(dataObject, testSpaceId, function(receivedDataObject) {
				console.debug('First object published.');
			}, onError);
		};
		
		tests['SpacesSDK.DataHandler.deleteDataObjects'] = function(onComplete) {
			var dataObjectReceivedIds = [];
			dataHandler.addDataObjectListener(new SpacesSDK.DataObjectListener('mylistener', function(receivedDataObject, spaceId) {
				console.debug('Received object on space ' + spaceId + '.');
				dataObjectReceivedIds.push(receivedDataObject.getId());
				if (dataObjectReceivedIds.length == 2) {
					dataHandler.deleteDataObjects(dataObjectReceivedIds, function(numberOfDeletedObjects) {
						assertEquals('Wrong number of data objects have been deleted.', 2, numberOfDeletedObjects);
						onComplete();
					}, function(error) {
						fail('Request error: ' + error);
						onComplete();
					});
				}
			}));
			
			var onError = function(error) {
				console.debug('Publishing failed. Error:', error);
				throw 'Failed to publish test data object.'; 
			};
			
			dataHandler.publishDataObject(dataObject, testSpaceId, function(receivedDataObject) {
				console.debug('First object published.');
				dataHandler.publishDataObject(dataObject, testSpaceId, function(receivedDataObject) {
					console.debug('Second object published.');
				}, onError);
			}, onError);
		};
		
		tests['SpacesSDK.DataHandler.retrieveDataObjects'] = function(onComplete) {
			dataHandler.addDataObjectListener(new SpacesSDK.DataObjectListener('mylistener', function(receivedDataObject, spaceId) {
				console.debug('Received object on space ' + spaceId + '.');
				
				var cachedObjects = dataHandler.retrieveDataObjects(testSpaceId);
				console.debug('Data object cache for space ' + spaceId + ': SpacesSDKTest.testObjects[' + testCounter + '].');
				testObjects[testCounter++] = cachedObjects;
				
				var foundInCachedObjects = false;
				for (var i = 0; i < cachedObjects.length; i++) {
					if (cachedObjects[i].getId() == receivedDataObject.getId()) {
						foundInCachedObjects = true;
					}
				}
				assertEquals('Data object was not found in cache.', true, foundInCachedObjects, cachedObjects);
				onComplete();
			}));
			
			var onError = function(error) {
				console.debug('Publishing failed. Error:', error);
				throw 'Failed to publish test data object.'; 
			};
			
			dataHandler.publishDataObject(dataObject, testSpaceId, function(receivedDataObject) {
				console.debug('First object published.');
			}, onError);
		};
		
		return {
			'tests' : tests,
			'init' : init,
			'destroy' : destroy
		};
	};
	
	
	testSuites['SpaceHandlerTests'] = function() {
		var tests = {};
		var connectionHandler, spaceHandler;
		var testSpaceId = PROPERTIES.data.users.user01.id;
		
		var init = function(onComplete) {
			var connectionStatusHandler = function(newStatus) {
				console.debug('Connection status changed: ' + newStatus);
				switch (newStatus) {
					case SpacesSDK.ConnectionStatus.ONLINE:
						spaceHandler = new SpacesSDK.SpaceHandler(connectionHandler);
						console.debug('SpaceHandler initialized.');
						onComplete();
						break;
					case SpacesSDK.ConnectionStatus.ERROR:
						console.error('Failed to establish XMPP connection. Test aborted.');
						onComplete();
						break;
					default:
						break;
				}
			};
			
			var conConfigBuilder = new SpacesSDK.ConnectionConfigurationBuilder(PROPERTIES.xmpp.domain, PROPERTIES.xmpp.appId);
			var conConfig = conConfigBuilder.build();
			connectionHandler = new SpacesSDK.ConnectionHandler(PROPERTIES.data.users.user01.id, PROPERTIES.data.users.user01.password, conConfig, PROPERTIES.xmpp.service);
			
			connectionHandler.addConnectionStatusListener(new SpacesSDK.ConnectionStatusListener('testlistener', connectionStatusHandler));
			
			connectionHandler.connect();
		};
		
		var destroy = function(onComplete) {
			connectionHandler.disconnect();
			onComplete();
		};
		
		tests['SpacesSDK.SpaceHandler.configureSpace'] = function(onComplete) {
			var newSpaceName = 'Private Space ' + (new Date()).getTime();
			
			spaceHandler.getSpace(testSpaceId, function(space) {
				var spaceConfig = space.generateSpaceConfiguration();
				spaceConfig.setName(newSpaceName);
				spaceHandler.configureSpace(testSpaceId, spaceConfig, function(configuredSpace) {
					console.debug('Space configured.');
					assertEquals('Space name is not configured properly.', newSpaceName, configuredSpace.getName(), configuredSpace);
					onComplete();
				}, function(error) {
					fail('Failed to configure space. Error: ', error);					
					onComplete();
				});
			}, function(error) {
				fail('Failed to retrieve space. Error:', error);
				onComplete();
			});
			
		};
		
		
		return {
			'tests' : tests,
			'init' : init,
			'destroy' : destroy
		};
	};
	
	var run = function(testSuite, testName) {
		console.info('=== INITIALIZING: ' + testName + ' ===');
		testSuite.init(function() {
			console.info('--- PERFORMING TEST ---');
			try {
				testSuite.tests[testName](function() {
					console.info('--- CLOSING TEST ---');
					testSuite.destroy(function() {
						console.info('--- FINISHED ---');
					});
				});
			} catch (e) {
				console.warn('Test failed by '+ e.name + ' in ' + e.fileName + '(' + e.lineNumber + '): ' + e.message);
				console.info('--- FINISHED TEST ---');
			}
		});
	};

	var runAll = function () {
		for (var suiteName in testSuites) {
			var testSuite = new testSuites[suiteName]();
			for (var testName in testSuite.tests) {
				run(testSuite, testName);
			}
		}
	};
	
	var runSuite = function(testSuite, testNames) {
		if (testNames) {
			for (var i = 0; i < testNames.length; i++) {
				run(testSuite, testNames[i]);
			}
		} else {
			for (var testName in testSuite.tests) {
				run(testSuite, testName);
			}
		}
	};
	
	var modules = {
		'runAll' : runAll,
		'runSuite' : runSuite,
		'testObjects': testObjects,
		'testSuites' : testSuites
	};
	
	return modules;
})();

var remainingTestSuites = [];
for (var suiteName in SpacesSDKTest.testSuites) {
	remainingTestSuites.push(new SpacesSDKTest.testSuites[suiteName]());
}
var currentTestSuite = remainingTestSuites.pop();
var remainingTests = [];
for (var testName in currentTestSuite.tests) {
	remainingTests.push(testName);
}
var currentTest = remainingTests.pop();

function printTestInfo() {
	var testDiv = document.createElement('div');
	var nameSpan = document.createElement('span');
	nameSpan.setAttribute('style', 'width: 500px; display: inline-block;');
	nameSpan.textContent = currentTest;
	testDiv.appendChild(nameSpan);
	var runButton = document.createElement('button');
	runButton.setAttribute('onclick', 'runTest()');
	runButton.textContent = 'Run';
	testDiv.appendChild(runButton);
	document.getElementById('tests').appendChild(testDiv);	
}

function runTest() {
	SpacesSDKTest.runSuite(currentTestSuite, [currentTest]);
	if (remainingTests.length == 0) {
		if (remainingTestSuites.length == 0) {
			done();
			return;
		}
		currentTestSuite = remainingTestSuites.pop();
		for (var testName in currentTestSuite.tests) {
			remainingTests.push(testName);
		}
	}
	currentTest = remainingTests.pop();
	printTestInfo();
}

function done() {
	var doneDiv = document.createElement('div');
	doneDiv.textContent = 'Done';
	document.getElementById('tests').appendChild(doneDiv);
}

window.onload = function() {
	printTestInfo();
};
