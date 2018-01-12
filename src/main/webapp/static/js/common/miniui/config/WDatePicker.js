mini.WDatePicker = function() {
	mini.WDatePicker.superclass.constructor.call(this);
	this.calendarOpts = {};
}
mini.extend(mini.WDatePicker, mini.ButtonEdit, {
	calendarOpts	: {},

	uiCls			: "mini-wdatepicker",
	set				: function(kv) {
		if (typeof kv == 'string') {
			return this;
		}
		if (kv.has && $.type(kv.has) == 'string') {
			kv.has = mini.decode(kv.has);
		}
		if (kv.disabledDates && $.type(kv.disabledDates) == 'string') {
			kv.disabledDates = mini.decode(kv.disabledDates);
		}
		if (kv.disabledDays && $.type(kv.disabledDays) == 'string') {
			kv.disabledDays = mini.decode(kv.disabledDays);
		}

		var scope = this;
		this.calendarOpts.onpickedFn = kv.onpicked;
		this.calendarOpts.onpicked = function(dp) {
			var value = dp.cal.getNewDateStr();
			scope.setValue(value);
			if (scope.calendarOpts.onpickedFn) {
				scope.calendarOpts.onpickedFn(dp);
			}
		}

		this.calendarOpts.onclearedFn = kv.oncleared;
		this.calendarOpts.oncleared = function() {
			scope.setValue("");
			if (scope.calendarOpts.onclearedFn) {
				scope.calendarOpts.onclearedFn(dp);
			}
		}

		delete kv.onpicked;
		delete kv.oncleared;

		this.calendarOpts.readOnly = !kv.allowInput;
		mini.copyTo(this.calendarOpts, kv);
		mini.WDatePicker.superclass.set.call(this, kv);
		return this;
	},
	_OnButtonClick	: function(htmlEvent) {
		if (this.enabled == false) {
			return;
		}

		var e = {
			htmlEvent	: htmlEvent,
			cancel		: false
		};
		this.fire("beforebuttonclick", e);
		if (e.cancel == true) {
			return;
		}
		this.showCalendar();

		this.fire("buttonclick", e);
	},
	__OnFocus		: function(e) {
		if (this.enabled == false) {
			return;
		}

		mini.WDatePicker.superclass.__OnFocus.call(this, e);
		this.showCalendar();
	},
	showCalendar	: function() {
		WdatePicker(this.calendarOpts);
	},
	_ParseFunction	: function(el, config, attrs) {
		for (var i = 0, l = attrs.length; i < l; i++) {
			var property = attrs[i];

			var value = mini.getAttr(el, property);
			if (value) {
				config[property] = eval(value);
			}
		}
	},
	setValue		: function(value) {
		mini.WDatePicker.superclass.setValue.call(this, value);
		this.setText(value);
	},
	getAttrs		: function(el) {
		var attrs = mini.WDatePicker.superclass.getAttrs.call(this, el);

		mini._ParseString(el, attrs, ["skin", "dateFmt", "realDateFmt", "realTimeFmt", "realFullFmt", "minDate",
					"maxDate", "startDate", "specialDates", "specialDays", "disabledDates", "disabledDays", "errMsg",
					"quickSel", "has"]);
		this._ParseFunction(el, attrs, ["onpicking", "onpicked", "onclearing", "oncleared", "ychanging", "ychanged",
					"Mchanging", "Mchanged", "dchanging", "dchanged", "Hchanging", "Hchanged", "mchanging", "mchanged",
					"schanging", "schanged"]);

		mini._ParseBool(el, attrs, ["$crossFrame", "$preLoad", "doubleCalendar", "enableKeyboard", "enableInputMask",
					"autoUpdateOnChanged", "alwaysUseStartDate", "isShowWeek", "highLineWeekDay", "isShowClear",
					"isShowToday", "isShowOK", "isShowOthers", "readOnly", "autoPickDate", "qsEnabled", "autoShowQS",
					"opposite"]);
		mini._ParseInt(el, attrs, ["errDealMode"]);

		return attrs;
	}
});

mini.regClass(mini.WDatePicker, 'wdatepicker');