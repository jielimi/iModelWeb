"use strict";
//  Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Notifications */
const geometry_core_1 = require("@bentley/geometry-core");
const IModelApp_1 = require("@bentley/imodeljs-frontend/lib/IModelApp");
const bentleyjs_core_1 = require("@bentley/bentleyjs-core");
/** Describes the type and behavior of a [[NotifyMessageDetails]]. */
var OutputMessageType;
(function (OutputMessageType) {
    /** Temporary messagebox that displays at the bottom of the screen. */
    OutputMessageType[OutputMessageType["Toast"] = 0] = "Toast";
    OutputMessageType[OutputMessageType["Pointer"] = 1] = "Pointer";
    OutputMessageType[OutputMessageType["Sticky"] = 2] = "Sticky";
    OutputMessageType[OutputMessageType["InputField"] = 3] = "InputField";
    /** Modal message box. */
    OutputMessageType[OutputMessageType["Alert"] = 4] = "Alert";
})(OutputMessageType || {});
/** Classifies a [[NotifyMessageDetails]] by its level of importance. */
var OutputMessagePriority;
(function (OutputMessagePriority) {
    OutputMessagePriority[OutputMessagePriority["None"] = 0] = "None";
    OutputMessagePriority[OutputMessagePriority["Error"] = 10] = "Error";
    OutputMessagePriority[OutputMessagePriority["Warning"] = 11] = "Warning";
    OutputMessagePriority[OutputMessagePriority["Info"] = 12] = "Info";
    OutputMessagePriority[OutputMessagePriority["Debug"] = 13] = "Debug";
    OutputMessagePriority[OutputMessagePriority["Fatal"] = 17] = "Fatal";
})(OutputMessagePriority || {});
/** Describes the alert behavior of a [[NotifyMessageDetails]]. */
var OutputMessageAlert;
(function (OutputMessageAlert) {
    OutputMessageAlert[OutputMessageAlert["None"] = 0] = "None";
    OutputMessageAlert[OutputMessageAlert["Dialog"] = 1] = "Dialog";
    OutputMessageAlert[OutputMessageAlert["Balloon"] = 2] = "Balloon";
})(OutputMessageAlert || ({}));
/** Relative Position for setPointerTypeDetails */
var RelativePosition;
(function (RelativePosition) {
    RelativePosition[RelativePosition["Left"] = 0] = "Left";
    RelativePosition[RelativePosition["Top"] = 1] = "Top";
    RelativePosition[RelativePosition["Right"] = 2] = "Right";
    RelativePosition[RelativePosition["Bottom"] = 3] = "Bottom";
    RelativePosition[RelativePosition["TopLeft"] = 4] = "TopLeft";
    RelativePosition[RelativePosition["TopRight"] = 5] = "TopRight";
    RelativePosition[RelativePosition["BottomLeft"] = 6] = "BottomLeft";
    RelativePosition[RelativePosition["BottomRight"] = 7] = "BottomRight";
})(RelativePosition || ({}));
/** Reason for ending the activity message via endActivityMessage */
var ActivityMessageEndReason;
(function (ActivityMessageEndReason) {
    ActivityMessageEndReason[ActivityMessageEndReason["Completed"] = 0] = "Completed";
    ActivityMessageEndReason[ActivityMessageEndReason["Cancelled"] = 1] = "Cancelled";
})(ActivityMessageEndReason || ({}));
/** Describes the set of buttons displayed in a messagebox opened using [[NotificationManager.openMessageBox]]. */
var MessageBoxType;
(function (MessageBoxType) {
    MessageBoxType[MessageBoxType["OkCancel"] = 0] = "OkCancel";
    MessageBoxType[MessageBoxType["Ok"] = 1] = "Ok";
    MessageBoxType[MessageBoxType["LargeOk"] = 2] = "LargeOk";
    MessageBoxType[MessageBoxType["MediumAlert"] = 3] = "MediumAlert";
    MessageBoxType[MessageBoxType["YesNoCancel"] = 4] = "YesNoCancel";
    MessageBoxType[MessageBoxType["YesNo"] = 5] = "YesNo";
})(MessageBoxType || ({}));
/** Describes the icon displayed in a messagebox opened using [[NotificationManager.openMessageBox]]. */
var MessageBoxIconType;
(function (MessageBoxIconType) {
    MessageBoxIconType[MessageBoxIconType["NoSymbol"] = 0] = "NoSymbol";
    MessageBoxIconType[MessageBoxIconType["Information"] = 1] = "Information";
    MessageBoxIconType[MessageBoxIconType["Question"] = 2] = "Question";
    MessageBoxIconType[MessageBoxIconType["Warning"] = 3] = "Warning";
    MessageBoxIconType[MessageBoxIconType["Critical"] = 4] = "Critical";
})(MessageBoxIconType || ({}));
/** Describes the possible return values produced when the user clicks a button in a messagebox opened using [[NotificationManager.openMessageBox]]. */
var MessageBoxValue;
(function (MessageBoxValue) {
    MessageBoxValue[MessageBoxValue["Apply"] = 1] = "Apply";
    MessageBoxValue[MessageBoxValue["Reset"] = 2] = "Reset";
    MessageBoxValue[MessageBoxValue["Ok"] = 3] = "Ok";
    MessageBoxValue[MessageBoxValue["Cancel"] = 4] = "Cancel";
    MessageBoxValue[MessageBoxValue["Default"] = 5] = "Default";
    MessageBoxValue[MessageBoxValue["Yes"] = 6] = "Yes";
    MessageBoxValue[MessageBoxValue["No"] = 7] = "No";
    MessageBoxValue[MessageBoxValue["Retry"] = 8] = "Retry";
    MessageBoxValue[MessageBoxValue["Stop"] = 9] = "Stop";
    MessageBoxValue[MessageBoxValue["Help"] = 10] = "Help";
    MessageBoxValue[MessageBoxValue["YesToAll"] = 11] = "YesToAll";
    MessageBoxValue[MessageBoxValue["NoToAll"] = 12] = "NoToAll";
})(MessageBoxValue || ({}));
/** Describes a message to be displayed to the user. */
class NotifyMessageDetails {
    /** Constructor
     *  @param priority        The priority this message should be accorded by the NotificationManager.
     *  @param briefMsg        A short message that conveys the simplest explanation of the issue.
     *  @param detailedMsg     A comprehensive message that explains the issue in detail and potentially offers a solution.
     *  @param msgType         The type of message.
     *  @param openAlert       Whether an alert box should be displayed or not, and if so what kind.
     */
    constructor(priority, briefMessage, detailedMessage, msgType = 0 /* Toast */, openAlert = 0 /* None */) {
        this.priority = priority;
        this.briefMessage = briefMessage;
        this.detailedMessage = detailedMessage;
        this.msgType = msgType;
        this.openAlert = openAlert;
        this.displayTime = bentleyjs_core_1.BeDuration.fromSeconds(3.5);
        this.relativePosition = 5 /* TopRight */;
    }
    /** Set OutputMessageType.Pointer message details.
     * @param viewport            Viewport over which to display the Pointer type message.
     * @param displayPoint        Point at which to display the Pointer type message.
     * @param relativePosition    Position relative to displayPoint at which to display the Pointer type message.
     */
    setPointerTypeDetails(viewport, displayPoint, relativePosition = 5 /* TopRight */) {
        this.viewport = viewport;
        this.displayPoint = geometry_core_1.Point2d.fromJSON(displayPoint);
        this.relativePosition = relativePosition;
    }
}
// exports.NotifyMessageDetails = NotifyMessageDetails;
export {NotifyMessageDetails, ActivityMessageDetails, NotificationManager}
/**
 * Specifies the details of an activity message to be displayed to the user.
 */
class ActivityMessageDetails {
    /**
     * @param showProgressBar         Indicates whether to show the progress bar in the activity message dialog.
     * @param showPercentInMessage    Indicates whether to show the percentage complete in the activity message text.
     * @param supportsCancellation    Indicates whether to show the Cancel button, giving the user the ability to cancel the operation.
     * @param showDialogInitially     Indicates whether to show the activity message dialog initially. User can click status bar to open it.
     */
    constructor(showProgressBar, showPercentInMessage, supportsCancellation, showDialogInitially = true) {
        this.showProgressBar = showProgressBar;
        this.showPercentInMessage = showPercentInMessage;
        this.supportsCancellation = supportsCancellation;
        this.showDialogInitially = showDialogInitially;
        this.wasCancelled = false;
    }
    /** Called from NotificationAdmin when the user cancels the activity. */
    onActivityCancelled() { this.wasCancelled = true; }
    /** Called from NotificationAdmin when the activity completes successfully. */
    onActivityCompleted() { this.wasCancelled = false; }
}
// exports.ActivityMessageDetails = ActivityMessageDetails;
/**
 * The NotificationManager controls the interaction with the user for prompts, error messages, and alert dialogs.
 * Implementations of the NotificationManager may present the information in different ways. For example, in
 * non-interactive sessions, these messages may be saved to a log file or simply discarded.
 */
class NotificationManager {
    constructor() {
        this.toolTipLocation = new geometry_core_1.Point2d();
    }
    /** Output a prompt, given an i18n key. */
    outputPromptByKey(key) { this.outputPrompt(IModelApp_1.IModelApp.i18n.translate(key)); }
    /** Output a localized prompt to the user. A 'prompt' indicates an action the user should take to proceed.
     * @param _prompt The localized string with the prompt message.
     */
    outputPrompt(_prompt) { }
    /** Output a message and/or alert to the user. */
    outputMessage(_message) { }
    /** Output a MessageBox and wait for response from the user.
     * @param _mbType       The MessageBox type.
     * @param _message      The message to display.
     * @param _icon         The MessageBox icon type.
     * @return the response from the user.
     */
    async openMessageBox(_mbType, _message, _icon) { return Promise.resolve(3 /* Ok */); }
    /**
     * Set up for activity messages.
     * @param _details  The activity message details.
     * @return true if the message was displayed, false if an invalid priority is specified.
     */
    setupActivityMessage(_details) { return true; }
    /**
     * Output an activity message to the user.
     * @param _messageText The message text.
     * @param _percentComplete The percentage of completion.
     * @return true if the message was displayed, false if the message could not be displayed.
     */
    outputActivityMessage(_messageText, _percentComplete) { return true; }
    /**
     * End an activity message.
     * @param _reason The reason for the end of the Activity Message.
     * @return true if the message was ended successfully, false if the activityMessage could not be ended.
     */
    endActivityMessage(_reason) { return true; }
    /** Return true if _showTooltip has an implemention and will display a tooltip. */
    get isToolTipSupported() { return false; }
    /** Return true if the tooltip is currently open. */
    get isToolTipOpen() { return false; }
    /** Implement to display a tooltip message at the specified location. */
    _showToolTip(_htmlElement, _message, _location, _options) { }
    /** Show a tooltip window. Saves tooltip location for AccuSnap to test if cursor has moved far enough away to close tooltip.
     * @param htmlElement The HTMLElement that that anchors the toolTip.
     * @param message What to display inside the ToolTip. String may include HTML.
     * @param location An optional location, relative to the origin of _htmlElement, for the ToolTip. If undefined, center of _htmlElement
     * @param options Options that supply additional information about how the ToolTip should function.
     */
    openToolTip(_htmlElement, message, location, options) {
        this.toolTipLocation.setFrom(location);
        this._showToolTip(_htmlElement, message, location, options);
    }
    /** Clear the tooltip if it is currently open. */
    clearToolTip() { }
    /** Close message created with [[OutputMessageType.Pointer]]. */
    closePointerMessage() { }
}
// exports.NotificationManager = NotificationManager;
//# sourceMappingURL=NotificationManager.js.map