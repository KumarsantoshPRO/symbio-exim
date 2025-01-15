sap.ui.define(
  [
    "./BaseController",
    "sap/m/library"
  ],
  function (BaseController, library) {
    "use strict";

    var ButtonType = library.ButtonType,
      PlacementType = library.PlacementType;

    return BaseController.extend("warehousemanagement.controller.App", {
      onInit: function () {
        // this.getRouter().navTo("Home");
      },
      onItemSelect: function (oEvent) {
        var sKey = oEvent.getParameter('item').getKey();
      if(sKey === "Home" ||  sKey === "RouteView1"){
        this.getRouter().navTo(sKey);
      }else{
        this.getRouter().navTo("PageUnderDevelopment");
      }
      
      },








      onSideNavButtonPress: function () {
        var oToolPage = this.byId("toolPage");
        var bSideExpanded = oToolPage.getSideExpanded();

        this._setToggleButtonTooltip(bSideExpanded);

        oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
      },

      _setToggleButtonTooltip: function (bLarge) {
        var oToggleButton = this.byId('sideNavigationToggleButton');
        if (bLarge) {
          oToggleButton.setTooltip('Large Size Navigation');
        } else {
          oToggleButton.setTooltip('Small Size Navigation');
        }
      }
    });
  }
);
