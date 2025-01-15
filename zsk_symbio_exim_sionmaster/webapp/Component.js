sap.ui.define([
    "sap/ui/core/UIComponent",
    "zpro/sk/symbio/exim/sion/zsksymbioeximsionmaster/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("zpro.sk.symbio.exim.sion.zsksymbioeximsionmaster.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

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
});