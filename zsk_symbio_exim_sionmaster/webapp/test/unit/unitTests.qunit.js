/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"zprosksymbioeximsion/zsk_symbio_exim_sionmaster/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});