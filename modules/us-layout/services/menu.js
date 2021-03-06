/* global title */
'use strict';

angular.module('usLayout').service('Menu', [
	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};
		
		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};
		
		// Add menu item object
		this.addMenuItem = function(menuId, itemOptions) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);
			
			this.prepareItem(menuId, itemOptions);
			
			// Return the menu object
			return this.menus[menuId];
		};
		
		// Add menu item object
		this.addMenuItems = function(menuId, itemsOptions) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);
			
			if (itemsOptions.length > 0) {
				for (var i = 0; i < itemsOptions.length; i++) {
					this.prepareItem(menuId, itemsOptions[i]);
				}
			}
			
			return this.menus[menuId];
		};
		
		this.prepareItem = function(menuId, itemOptions) {
			var key = itemOptions.itemKey.split('.');
			// console.log(key);
			var element = this.menus[menuId];
			if (key.length > 0) {
				for (var i = 0; i < key.length; i++) {
					// console.log('Chave: ' + key[i]);
					if (element.items.length > 0) {
						for (var j = 0; j < element.items.length; j++) {
							// console.log(element.items[j].id + ' != ' + key[i])
							if (element.items[j].id != key[i]) {
								// console.log(key.length + ' =y= ' +  (i+1))
								if (key.length == (i+1)) {
									itemOptions["id"] = key[i];
									element.items.push(this.prepareOptions(menuId, itemOptions));
									break;
								}
							} else {
								// console.log(key.length + ' =x= ' + (i+1));
								if (key.length == (i+1)) {
									console.log("O menu " + key[i+1] + " esta duplicado!");
									break;
								} else {
									element = element.items[j];
								}
							}
						}
					} else {
						if (key.length === i+1) {
							itemOptions["id"] = key[i];
							element.items.push(this.prepareOptions(menuId, itemOptions));
							break;
						}
					}
				}
			}
		};
		
		this.prepareOptions = function(id, options) {
			// prepares and validates the parameters
			return {
					id: options.id,
					title: options.title,
					link: options.link,
					icon: ((options.icon === null || typeof options.icon === 'undefined') ? '' : options.icon),
					itemClass: ((options.class === null || typeof options.class === 'undefined') ? '' : options.class),
					isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[id].isPublic : options.isPublic),
					roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[id].roles : options.roles),
					position: options.position || 0,
					items: [],
					shouldRender: shouldRender
			};
		}
		
		this.addMenu('topbar');
		this.addMenu('navbar');
	}
]);
