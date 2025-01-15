sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Menu",
    "sap/m/MenuItem",
    "sap/m/table/columnmenu/Menu",
    "sap/m/table/columnmenu/ActionItem",
    "sap/m/ToolbarSpacer",
    "sap/ui/thirdparty/jquery",
    "sap/ui/Device",
    "sap/ui/core/date/UI5Date",
    'sap/m/p13n/Engine',
    'sap/m/p13n/SelectionController',
    'sap/m/p13n/SortController',
    'sap/m/p13n/GroupController',
    'sap/m/p13n/MetadataHelper',
    'sap/ui/model/Sorter',
    'sap/ui/core/library',
    'sap/m/table/ColumnWidthController',
    'sap/m/p13n/FilterController',
    'sap/ui/export/Spreadsheet',
    "sap/ui/export/library",
    "sap/ui/core/format/DateFormat"

],
    function (Controller, Fragment, JSONModel, Filter, FilterOperator, MenuM, MenuItemM, ColumnMenu, ActionItem, ToolbarSpacer, jQuery, Device, UI5Dat, Engine, SelectionController, SortController, GroupController, MetadataHelper, Sorter, CoreLibrary, ColumnWidthController, FilterController, Spreadsheet, exportLibrary, DateFormat) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        return Controller.extend("zmg.pro.exim.transactionalshippingbill.exim.controller.View1", {
            onInit: function () {
                this.getCallForTable([]);

                // this.associateHeaderMenus();

                this._registerForP13n();
            },

            _registerForP13n: function () {
                const oTable = this.byId("table");

                this.oMetadataHelper = new MetadataHelper([{
                    key: "idClmShipBill",
                    label: "Shipping Bill No",
                    path: "ZshippingBillNo"
                },
                {
                    key: "idClmDocNo",
                    label: "Invoice Document",
                    path: "ZinvoiceDocument"
                },
                {
                    key: "idClmPortOfLoading",
                    label: "Port Of Loading",
                    path: "ZportOfLoading"
                },
                {
                    key: "idClmCHA",
                    label: "CHA",
                    path: "Zcha"
                },
                {
                    key: "idClmCustomer",
                    label: "Customer",
                    path: "Zcustomer"
                }, {
                    key: "idClmLETDate",
                    label: "LET Export Date",
                    path: "ZletExportDate"
                }, {

                    key: "idClmSchemes",
                    label: "Schemes",
                    path: "Zschemes"
                }, {

                    key: "idClmEPCG",
                    label: "EPCG",
                    path: "Zepcg"
                }, {

                    key: "idClmLOC",
                    label: "Location",
                    path: "Zloc"
                }, {

                    key: "idClmShipBillStatus",
                    label: "Shipping Bill Status",
                    path: "ZshippingBillStatus"
                }




                ]);
                this._mIntialWidth = {
                    "idClmShipBill": "8rem",
                    "idClmDocNo": "8rem",
                    "idClmPortOfLoading": "8rem",
                    "idClmCHA": "06rem",
                    "idClmCustomer": "8rem",
                    "idClmLETDate": "8rem",
                    "idClmSchemes": "6rem",
                    "idClmEPCG": "4rem",
                    "idClmLOC": "8rem",
                    "idClmShipBillStatus": "10rem"
                };
                Engine.getInstance().register(oTable, {
                    helper: this.oMetadataHelper,
                    controller: {
                        Columns: new SelectionController({
                            targetAggregation: "columns",
                            control: oTable
                        }),
                        Sorter: new SortController({
                            control: oTable
                        }),
                        Groups: new GroupController({
                            control: oTable
                        }),
                        ColumnWidth: new ColumnWidthController({
                            control: oTable
                        }),
                        Filter: new FilterController({
                            control: oTable
                        })
                    }
                });

                Engine.getInstance().attachStateChange(this.handleStateChange.bind(this));
            },

            openPersoDialog: function (oEvt) {
                this._openPersoDialog(["Columns", "Sorter", "Groups", "Filter"], oEvt.getSource());
            },

            _openPersoDialog: function (aPanels, oSource) {
                var oTable = this.byId("table");

                Engine.getInstance().show(oTable, aPanels, {
                    contentHeight: aPanels.length > 1 ? "50rem" : "35rem",
                    contentWidth: aPanels.length > 1 ? "45rem" : "32rem",
                    source: oSource || oTable
                });
            },
            openPersoDialog: function (oEvt) {
                const oTable = this.byId("table");

                Engine.getInstance().show(oTable, ["Columns", "Sorter", "Groups", "Filter"], {
                    contentHeight: "35rem",
                    contentWidth: "32rem",
                    source: oEvt.getSource()
                });
            },

            onColumnHeaderItemPress: function (oEvt) {
                const oTable = this.byId("table");

                // const sPanel = oEvt.getSource().getIcon().indexOf("sort") >= 0 ? "Sorter" : "Columns";
                var sPanel;
                // "Columns", "Sorter", "Groups", "Filter"

                if (oEvt.getSource().getIcon().indexOf("sort") >= 0) {
                    sPanel = "Sorter"
                } else if (oEvt.getSource().getIcon().indexOf("columns") >= 0) {
                    sPanel = "Columns"
                } else if (oEvt.getSource().getIcon().indexOf("groups") >= 0) {
                    sPanel = "Groups"
                } else if (oEvt.getSource().getIcon().indexOf("filter") >= 0) {
                    sPanel = "Filter"
                }

                Engine.getInstance().show(oTable, [sPanel], {
                    contentHeight: "35rem",
                    contentWidth: "32rem",
                    source: oTable
                });
            },

            onSort: function (oEvt) {
                const oTable = this.byId("table");
                const sAffectedProperty = this._getKey(oEvt.getParameter("column"));
                const sSortOrder = oEvt.getParameter("sortOrder");

                //Apply the state programatically on sorting through the column menu
                //1) Retrieve the current personalization state
                Engine.getInstance().retrieveState(oTable).then(function (oState) {

                    //2) Modify the existing personalization state --> clear all sorters before
                    oState.Sorter.forEach(function (oSorter) {
                        oSorter.sorted = false;
                    });
                    oState.Sorter.push({
                        key: sAffectedProperty,
                        descending: sSortOrder === CoreLibrary.SortOrder.Descending
                    });

                    //3) Apply the modified personalization state to persist it in the VariantManagement
                    Engine.getInstance().applyState(oTable, oState);
                });
            },

            onColumnMove: function (oEvt) {
                const oTable = this.byId("table");
                const oAffectedColumn = oEvt.getParameter("column");
                const iNewPos = oEvt.getParameter("newPos");
                const sKey = this._getKey(oAffectedColumn);
                oEvt.preventDefault();

                Engine.getInstance().retrieveState(oTable).then(function (oState) {

                    const oCol = oState.Columns.find(function (oColumn) {
                        return oColumn.key === sKey;
                    }) || {
                        key: sKey
                    };
                    oCol.position = iNewPos;

                    Engine.getInstance().applyState(oTable, {
                        Columns: [oCol]
                    });
                });
            },

            _getKey: function (oControl) {
                return this.getView().getLocalId(oControl.getId());
            },

            handleStateChange: function (oEvt) {
                const oTable = this.byId("table");
                const oState = oEvt.getParameter("state");

                if (!oState) {
                    return;
                }

                oTable.getColumns().forEach(function (oColumn) {

                    const sKey = this._getKey(oColumn);
                    const sColumnWidth = oState.ColumnWidth[sKey];

                    oColumn.setWidth(sColumnWidth || this._mIntialWidth[sKey]);

                    oColumn.setVisible(false);
                    oColumn.setSortOrder(CoreLibrary.SortOrder.None);
                }.bind(this));

                oState.Columns.forEach(function (oProp, iIndex) {
                    const oCol = this.byId(oProp.key);
                    oCol.setVisible(true);

                    oTable.removeColumn(oCol);
                    oTable.insertColumn(oCol, iIndex);
                }.bind(this));

                const aSorter = [];
                oState.Sorter.forEach(function (oSorter) {
                    const oColumn = this.byId(oSorter.key);
                    /** @deprecated As of version 1.120 */
                    oColumn.setSorted(true);
                    oColumn.setSortOrder(oSorter.descending ? CoreLibrary.SortOrder.Descending : CoreLibrary.SortOrder.Ascending);
                    aSorter.push(new Sorter(this.oMetadataHelper.getProperty(oSorter.key).path, oSorter.descending));
                }.bind(this));
                oTable.getBinding("rows").sort(aSorter);
            },

            onColumnResize: function (oEvt) {
                const oColumn = oEvt.getParameter("column");
                const sWidth = oEvt.getParameter("width");
                const oTable = this.byId("table");

                const oColumnState = {};
                oColumnState[this._getKey(oColumn)] = sWidth;

                Engine.getInstance().applyState(oTable, {
                    ColumnWidth: oColumnState
                });
            },




            associateHeaderMenus: function () {
                this.oMenu = new ColumnMenu();
                // this.byId("idClmShipBill").setHeaderMenu(this.oMenu.getId());
                // this.byId("idClmShipBill").setHeaderMenu(this.oMenu.getId());

                this.oCustomMenu = new ColumnMenu({
                    items: [
                        new ActionItem({
                            label: "Sort",
                            icon: "sap-icon://sort",
                            press: [function (oEvent) {
                                this.onQuantitySort(oEvent);
                            }, this]
                        }), new ActionItem({
                            label: "Filter",
                            icon: "sap-icon://filter",
                            press: [function (oEvent) {
                                this.onQuantityCustomItemSelect(oEvent);
                            }, this]
                        }), new ActionItem({
                            label: "Group",
                            icon: "sap-icon://group-2",
                            press: [function (oEvent) {
                                this.onQuantityCustomItemSelect(oEvent);
                            }, this]
                        }), new ActionItem({
                            label: "Columns",
                            icon: "sap-icon://table-column",
                            press: [function (oEvent) {
                                this.onQuantityCustomItemSelect(oEvent);
                            }, this]
                        })
                    ]
                });
                this.byId("idClmShipBill").setHeaderMenu(this.oCustomMenu.getId());
            },

            // On Click of search
            onSearch: function () {

                var nShipping_Number = this.getView().byId("idInpF4_SBNumber").getValue()
                var aFilters = [];
                var oFilter = new Filter(
                    [new Filter("ZshippingBillNo", FilterOperator.EQ, nShipping_Number)],
                    false
                );

                aFilters.push(oFilter);
                if (nShipping_Number) {
                    this.getCallForTable(aFilters);
                } else {
                    this.getCallForTable([]);
                }

            },

            // On Click of clear
            onClearFilters: function () {
                this.getView().byId("idInpF4_SBNumber").setValue();
                this.getView().byId("idInpF4_InvoiceNumber").setValue();
                this.getView().byId("idDP_CreatedDate").setValue();

            },
            // getViewSettingsDialog: function (sDialogFragmentName) {
            //     var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];

            //     if (!pDialog) {
            //         pDialog = Fragment.load({
            //             id: this.getView().getId(),
            //             name: sDialogFragmentName,
            //             controller: this,
            //         }).then(function (oDialog) {
            //             if (Device.system.desktop) {
            //                 oDialog.addStyleClass("sapUiSizeCompact");
            //             }
            //             return oDialog;
            //         });
            //         this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
            //     }
            //     return pDialog;
            // },
            // // On shipping bill F4
            // onShippingBillHelp: function () {
            //     this.getViewSettingsDialog(
            //         "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_shippingBill"
            //     ).then(function (oViewSettingsDialog) {
            //         oViewSettingsDialog.open();
            //     });
            // },
            //Shipping Number on Value Help(F4)
            onShippingBillHelp: function () {
                if (!this.ShippingNumber) {
                    this.ShippingNumber = sap.ui.xmlfragment(
                        "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_shippingBill",
                        this
                    );
                    this.getView().addDependent(this.ShippingNumber);
                    this._InvoiceNumberTemp = sap.ui
                        .getCore()
                        .byId("idSLShippingBillValueHelp")
                        .clone();
                }


                sap.ui.getCore().byId("idSDShippingBillF4").bindAggregation("items", {
                    path: "/ZRC_SHIP_BILL_HEAD",
                    template: this._InvoiceNumberTemp,
                });

                this.ShippingNumber.open();
            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_shippingBillNumber: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var sPath = "/ZRC_SHIP_BILL_HEAD";
                var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));
                var aFilters = [];
                var oFilter = new Filter(
                    [new Filter("ZshippingBillNo", FilterOperator.Contains, sValue)],
                    false
                );

                aFilters.push(oFilter);
                oSelectDialog.bindAggregation("items", {
                    path: sPath,
                    filters: aFilters,
                    template: this._InvoiceNumberTemp,
                });
            },

            // on Value Help - Confirm
            onValueHelpConfirm_shippingBillNumber: function (oEvent) {


                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getProperty("title");

                this
                    .getView()
                    .byId("idInpF4_SBNumber").setValue(sSelectedValue);
            },

            // Get call for Table entries
            getCallForTable: function (aFilters) {

                // this.sDate = this.getView().byId("idDP_CreatedDate").getValue();

                var sPath = "/ZRC_SHIP_BILL_HEAD"
                var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                var oModelForHeader = new sap.ui.model.odata.ODataModel(
                    sService,
                    true
                );



                this.getView().setBusy(true);
                oModelForHeader.read(sPath, {
                    filters: aFilters,
                    success: function (Data) {
                        var aDataForHeaderTable;
                        this.getView().setModel(new JSONModel(aDataForHeaderTable), "oModelForTable")

                        if (this.sDate) {
                            var aItems = [];
                            var nTemp = 0;

                            var sDateFromFE =
                                new Date(this.sDate).getDate().toString() +
                                new Date(this.sDate).getMonth().toString() +
                                new Date(this.sDate).getFullYear().toString();
                            for (let index = 0; index < Data.results.length; index++) {
                                var sDateFromBE =
                                    new Date(Data.results[index].ZletExportDate).getDate().toString() +
                                    new Date(Data.results[index].ZletExportDate).getMonth().toString() +
                                    new Date(Data.results[index].ZletExportDate).getFullYear().toString();
                                if (sDateFromBE === sDateFromFE) {
                                    aItems.push(Data.results[index]);
                                    nTemp = 1;
                                }
                            }

                            if (nTemp === 1) {
                                Data.results = aItems;
                            } else {
                                Data.results = [];
                            }
                        }
                        this.getView().getModel("oModelForTable").setData(Data.results);
                        var heading = "Transactional-Shipping Bill";
                        if (Number(Data.results.length) > 0) {
                            heading = "Transactional-Shipping Bill(" + Data.results.length + ")"
                            this.getView().byId("title").setText(heading);
                        } else {

                            this.getView().byId("title").setText(heading);
                        }


                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            // On Add new
            onAddNew: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("shippingBill_Details", {
                    billNo: "null"
                });
            },

            // On Delete row
            onDeletePress: function (oEvent) {

                var shippingBillNo = oEvent.getParameter('row').getAggregation('cells')[0].getText();
                // ZRC_SHIP_BILL_HEAD('000000001')


                var sPath = "/ZRC_SHIP_BILL_HEAD('" + shippingBillNo + "')";
                var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                var oModelForHeader = new sap.ui.model.odata.ODataModel(
                    sService,
                    true
                );

                if (shippingBillNo) {
                    this.getView().setBusy(true);
                    oModelForHeader.read(sPath, {
                        success: function (Data) {
                            Data.Loezk = 'X';
                            sap.m.MessageBox.error("Delete shipping bill  " + shippingBillNo + "?", {
                                actions: ["Delete", sap.m.MessageBox.Action.CLOSE],
                                emphasizedAction: "Delete",
                                onClose: function (sAction) {
                                    if (sAction === "Delete") {

                                        oModelForHeader.update(sPath, Data, {
                                            success: function (smessage) {
                                                sap.m.MessageToast.show("Object Deleted");
                                                this.getCallForTable([]);
                                                this.getView().setBusy(false);
                                            }.bind(this),
                                            error: function (sError) {
                                                this.getView().setBusy(false);
                                            }.bind(this)
                                        });
                                    }
                                }.bind(this)
                            });

                        }.bind(this),
                        error: function (oError) {
                            this.getView().setBusy(false);

                        }.bind(this)
                    });

                }



            },

            // On click of table row
            onRowsDataChange: function () {

            },
            onShowDetails: function (oEvent) {

                var sPathClickedItem
                if (oEvent.getParameter('rowContext')) {
                    sPathClickedItem = oEvent.getParameter('rowContext').sPath
                } else {
                    sPathClickedItem = oEvent.getParameter('row').getRowBindingContext().sPath
                }
                var selectedRowBillNo = this.getView().getModel('oModelForTable').getContext(sPathClickedItem).getProperty("ZshippingBillNo");
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("shippingBill_Details", {
                    billNo: selectedRowBillNo
                });

                // }
            },

            // Excel Export



            onExport: function () {
                var aCols, oSettings;
                aCols = this.createColumnConfig();

                var sheetDetails = "Shipping Bill Details(" + DateFormat.getDateTimeInstance({ pattern: "MMM dd, yyyy hh:mm:ss" }).format(new Date()) + ")";

                var aData = this.getView().getModel("oModelForTable").getData();
                oSettings = {
                    workbook: {
                        columns: aCols, wrap: true,
                        context: {
                            application: "Shipping Bill Details",
                            title: sheetDetails,
                            sheetName: "Shipping Bill Details",
                        },
                    },
                    dataSource: aData,
                    fileName: sheetDetails
                };
                var oSpreadsheet = new Spreadsheet(oSettings);
                oSpreadsheet.build().finally(function () {
                    debugger;
                    oSheet.destroy();
                });
            },

            createColumnConfig: function () {
                return [
                    {
                        label: 'Shipping Bill No',
                        property: 'ZshippingBillNo'
                    },
                    {
                        label: 'Invoice Document',
                        property: 'ZinvoiceDocument'
                    },
                    {
                        label: 'Port Of Loading',
                        property: 'ZportOfLoading'
                    }
                ];
            }

        });
    });
