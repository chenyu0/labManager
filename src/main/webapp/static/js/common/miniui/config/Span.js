mini.Span = function() {
	mini.Span.superclass.constructor.call(this);
}
mini.extend(mini.Span, mini.ValidatorBase, {
	name				: "",
	defaultValue		: "",
	value				: "",
	vtype				: "",
	formField			: true,
	showValue			: true,
	_errorIconEl		: null,
	uiCls				: "mini-span",
	_create				: function() {
		this.el = document.createElement("span");
		this.el.className = "mini-span";
		this.contentEl = document.createElement("span");
		this.contentEl.className = "mini-span-content";
		mini.append(this.el, this.contentEl);
	},
	_initEvents			: function() {
		this.on("validation", this.__OnValidation, this);
	},
	__OnValidation		: function(e) {

		if (e.isValid == false)
			return;
		mini._ValidateVType(this.vtype, e.value, e, this);
	},
	doUpdate			: function() {
		if (this.required) {
			this.addCls(this._requiredCls);
		} else {
			this.removeCls(this._requiredCls);
		}
	},
	getValue			: function() {
		return this.value;
	},
	getFormValue		: function() {
		value = this.value;
		if (value === null || value === undefined)
			value = "";
		return String(value);
	},
	setValue			: function(value) {
		var val = this.value;
		this.value = value;
		if (!mini.isEquals(value, val)) {
			this._RemoveErrorIcon();
			if (this.showValue) {
				if (value) {
					mini.addClass(this.el, "mini-span-show");
				} else {
					mini.removeClass(this.el, "mini-span-show");
				}
				this.contentEl.innerHTML = value;
			}
			this.validate();
		}
	},
	setVtype			: function(value) {
		this.vtype = value;
	},
	getVtype			: function() {
		return this.vtype;
	},
	getErrorIconEl		: function() {
		if (!this._errorIconEl) {
			this._errorIconEl = mini.append(this.el, '<span class="mini-errorIcon"></span>');
		}
		return this._errorIconEl;
	},
	_RemoveErrorIcon	: function() {
		if (this._errorIconEl) {
			var el = this._errorIconEl;
			jQuery(el).remove();
		}
		this._errorIconEl = null;
	},
	getAttrs			: function(el) {
		var attrs = mini.Span.superclass.getAttrs.call(this, el);
		mini._ParseString(el, attrs, ["value", "defaultValue", "vtype"]);
		mini._ParseBool(el, attrs, ["showValue"]);

		return attrs;
	}
});
mini.regClass(mini.Span, 'span');