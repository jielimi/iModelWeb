import { NotificationManager, MessageBoxValue, IModelApp } from "@bentley/imodeljs-frontend";
import ToolTip from "tooltip.js";

export class Notifications extends NotificationManager {
    outputPrompt(prompt) {
        console.log("prompt", prompt);
    }
    outputMessage(message) {
        console.log("message", message.detailedMessage);
    }
    async openMessageBox(_mbType, message, _icon) {
        const rootDiv = document.getElementById("root");
        if (!rootDiv) {
            return MessageBoxValue.Cancel;
        }
        const dialog = IModelApp.makeHTMLElement("dialog", {
            parent: rootDiv,
            className: "notification-messagebox"
        });
        const span = IModelApp.makeHTMLElement("span", {
            parent: dialog,
            className: "notification-messageboxtext"
        });
        if (typeof message === "string") {
            span.innerHTML = message;
        }
        else {
            span.appendChild(message);
        }
        const button = IModelApp.makeHTMLElement("button", {
            parent: dialog,
            className: "notification-messageboxbutton"
        });
        button.innerHTML = "Ok";
        const promise = new Promise((resolve, _rej) => {
            button.addEventListener("click", () => {
                dialog.close();
                rootDiv.removeChild(dialog);
                resolve(MessageBoxValue.Ok);
            });
        });
        dialog.showModal();
        return promise;
    }
    get isToolTipSupported() {
        return true;
    }
    get isToolTipOpen() {
        return undefined !== this._toolTip;
    }
    clearToolTip() {
        if (!this.isToolTipOpen) {
            return;
        }
        this._toolTip.dispose();
        this._el.removeChild(this._tooltipDiv);
        this._toolTip = undefined;
        this._el = undefined;
        this._tooltipDiv = undefined;
    }
    _showToolTip(el, message, pt, options) {
        this.clearToolTip();
        let wrapped;
        if (typeof message === "string") {
            wrapped = document.createElement("div");
            wrapped.innerHTML = message;
        }
        else {
            wrapped = message;
        }
        wrapped.style.backgroundColor = "rgba(255,246,143,1)";
        wrapped.style.padding = "8px 12px";
        wrapped.style.borderRadius = "4px";
        wrapped.style.fontSize = "12px";
        wrapped.style.color = "black";
        

        if (undefined === pt) {
            const rect = el.getBoundingClientRect();
            pt = { x: rect.width / 2, y: rect.height / 2 };
        }
        const location = IModelApp.makeHTMLElement("div", { parent: el });
        const height = 20;
        const width = 20;
        
        location.style.position = "absolute";
        location.style.top = pt.y - height / 2 + "px";
        location.style.left = pt.x - width / 2 + "px";
        location.style.width = width + "px";
        location.style.height = height + "px";
        this._el = el;
        this._tooltipDiv = location;
        this._toolTip = new ToolTip(location, {
            trigger: "manual",
            html: true,
            placement: options && options.placement
                ? options.placement
                : "right-start",
            title: message
        });
        this._toolTip.show();
    }
}
