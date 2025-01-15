sap.ui.define([
	"sap/ui/test/Opa5",
	"./arrangements/Startup",
	"./NavigationJourney"
], function (Opa5, Startup) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Startup(),
		viewNamespace: "zpro.sk.mittalcoin.exim.bill.of.entry.billofentry.view.",
		autoWait: true
	});
});
