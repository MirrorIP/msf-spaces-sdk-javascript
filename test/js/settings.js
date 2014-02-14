var PROPERTIES = {
	xmpp: {
		domain: 'localhost',
		service: 'http://127.0.0.1:7070/http-bind/',
		appId: 'spacessdkjs'
	},
	msf: {
		spacesService: {
			subdomain: 'spaces',
			version: '0.6.1'
		},
		persistenceService: {
			subdomain: 'persistence'
		}
	},
	params: {
		timeout: 2000
	},
	data: {
		spaces: {
			teamSpace: {
				name: '[TESTING]',
				id: 'team#19'
			},
			orgaSpace: {
				id: 'orga#7'
			}
		},
		users: {
			user01: {
				id: 'system.test.01',
				password: 'system.test.01#mirror'
			},
			user02: {
				id: 'system.test.02',
				password: 'system.test.02#mirror'
			},
			user03: {
				id: 'system.test.03',
				password: 'system.test.03#mirror'
			}
		}
	}
	
};
