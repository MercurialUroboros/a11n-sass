function reportIn(e) {
    var a = this.lastListenerInfo[this.lastListenerInfo.length - 1];
    console.log("report in", a);
}
Element.prototype.realAddEventListener = Element.prototype.addEventListener;
Element.prototype.addEventListener = function (a, b, c) {
    this.realAddEventListener(a, reportIn, c);
    this.realAddEventListener(a, b, c);
    if (!this.lastListenerInfo) {
        this.lastListenerInfo = [];
    }
    this.lastListenerInfo.push({ a: a, b: b, c: c });
};
