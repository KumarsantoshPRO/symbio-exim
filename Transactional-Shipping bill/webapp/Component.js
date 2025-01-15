/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "zmg/pro/exim/transactionalshippingbill/exim/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("zmg.pro.exim.transactionalshippingbill.exim.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                var jQueryScriptZip = document.createElement('script');
                jQueryScriptZip.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.0/jszip.js');
                document.head.appendChild(jQueryScriptZip);
    
                var jQueryScript = document.createElement('script');
                jQueryScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.0/xlsx.js');
                document.head.appendChild(jQueryScript);

                var jQueryScriptDash = document.createElement('script');
                jQueryScriptDash.setAttribute('src', 'https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js');
                document.head.appendChild(jQueryScriptDash);
                
            }
        });
    }
);