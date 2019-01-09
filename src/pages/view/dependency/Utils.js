"use strict";
/*---------------------------------------------------------------------------------------------
|  $Copyright: (c) 2018 Bentley Systems, Incorporated. All rights reserved. $
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
// show status in the output HTML
function showStatus(string1, string2) {
    let outString = string1;
    if (string2)
        outString = outString.concat(" ", string2);
    document.getElementById("showstatus").innerHTML = outString;
}
exports.showStatus = showStatus;
//# sourceMappingURL=Utils.js.map