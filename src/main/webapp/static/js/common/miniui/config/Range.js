mini.Range = function() {
	mini.Range.superclass.constructor.call(this);
}
mini.extend(mini.Range, mini.ValidatorBase, {
	startElConfig		: {},
	endElConfig			: {},
	formField			: true,
	_errorIconEl		: null,
	vtype				: "",
	elType				: "textbox",
	label				: ["从", "至"],
	businessInfo		: ["", ""],// 业务信息，如得分范围
	elWidth				: 100,
	_errorIconEl		: null,
	allowEquals			: false,// 是否允许相等
	uiCls				: "mini-range",
	set					: function(kv) {
		if (!mini.isNull(kv.startElConfig)) {
			this.startElConfig = mini.decode(kv.startElConfig);
			delete kv.startElConfig;
		}

		if (!mini.isNull(kv.endElConfig)) {
			this.endElConfig = mini.decode(kv.endElConfig);
			delete kv.endElConfig;
		}

		if (!mini.isNull(kv.businessInfo)) {
			this.businessInfo = mini.decode(kv.businessInfo);
			delete kv.businessInfo;
		}

		if (!mini.isNull(kv.label)) {
			this.label = mini.decode(kv.label);
			delete kv.label;
		}

		mini.Range.superclass.set.call(this, kv);

		this.startElConfig.type = this.elType;
		this.startElConfig.vtype = this.vtype;
		this.startElConfig.required = this.required;
		this.startElConfig.errorMode = "none";
		this.startElConfig.width = this.elWidth;
		this.startElConfig.name = this.startElConfig.name || "0";

		this.endElConfig.type = this.elType;
		this.endElConfig.vtype = this.vtype;
		this.endElConfig.required = this.required;
		this.endElConfig.errorMode = "none";
		this.endElConfig.width = this.elWidth;
		this.endElConfig.name = this.endElConfig.name || "1";

		this._initEl();

		return this;
	},
	_create				: function() {
		this.el = document.createElement("div");
		this.el.className = this.uiCls;
	},
	_initEl				: function() {
		this.el.innerHTML = "";

		this.startLabel = document.createElement("label");
		this.startLabel.innerHTML = this.label[0];
		this.el.appendChild(this.startLabel);

		this.startCmp = mini.create(this.startElConfig);
		this.startCmp.on("validation", this.__OnValidationStart, this);
		this.el.appendChild(this.startCmp.getEl());

		this.endLabel = document.createElement("label");
		this.endLabel.innerHTML = this.label[1];
		this.el.appendChild(this.endLabel);

		this.endCmp = mini.create(this.endElConfig);
		this.endCmp.on("validation", this.__OnValidationEnd, this);
		this.el.appendChild(this.endCmp.getEl());
	},
	doLayout			: function() {
		mini.Range.superclass.doLayout.call(this);

		if (this.startCmp) {
			this.startCmp.doLayout();
		}

		if (this.endCmp) {
			this.endCmp.doLayout();
		}
	},
	destroy				: function(removeEl) {
		if (this.startCmp) {
			mini.clearEvent(this.startCmp);
			this.startCmp = null;
		}
		if (this.endCmp) {
			mini.clearEvent(this.endCmp);
			this.endCmp = null;
		}
		this.startLabel = null;
		this.endLabel = null;
		mini.Range.superclass.destroy.call(this, removeEl);
	},
	setValidate			: function(e) {
		this.validCmp = null;

		this.errorText = e.errorText;
		// 更新是否通过验证开关
		this.setIsValid(e.isValid);
		// 返回验证是否通过
		return this.isValid();
	},
	__OnValidationStart	: function(e) {
		if (e.isValid) {
			var endValue = this.endCmp.getValue();
			if (mini.isNull(endValue) || endValue === "")
				e.isValid = true;
			else if (mini.isNull(e.value) || e.value === "")
				e.isValid = true;
			else if (this.elType == 'textbox') {
				if (this.allowEquals && parseFloat(e.value) > parseFloat(endValue)) {
					e.errorText = this.businessInfo[1] + "必须大于等于" + this.businessInfo[0];
					e.isValid = false;
				} else if (!this.allowEquals && parseFloat(e.value) >= parseFloat(endValue)) {
					e.errorText = this.businessInfo[1] + "必须大于" + this.businessInfo[0];
					e.isValid = false;
				}
			}
		}
		if (e.isValid && this.validCmp != this.endCmp) {
			this.validCmp = this.startCmp;
			e.isValid = this.endCmp.validate();
			e.errorText = this.endCmp.getErrorText();
		}
		this.fire("validation", e);
		this.setValidate(e);
	},
	__OnValidationEnd	: function(e) {
		if (e.isValid) {
			var startValue = this.startCmp.getValue();
			if (mini.isNull(startValue) || startValue === "")
				e.isValid = true;
			else if (mini.isNull(e.value) || e.value === "")
				e.isValid = true;
			else if (this.elType == 'textbox') {
				if (this.allowEquals && parseFloat(e.value) < parseFloat(startValue)) {
					e.errorText = this.businessInfo[1] + "必须大于等于" + this.businessInfo[0];
					e.isValid = false;
				} else if (!this.allowEquals && parseFloat(e.value) <= parseFloat(startValue)) {
					e.errorText = this.businessInfo[1] + "必须大于" + this.businessInfo[0];
					e.isValid = false;
				}
			}
		}
		if (e.isValid && this.validCmp != this.startCmp) {
			this.validCmp = this.endCmp;
			e.isValid = this.startCmp.validate();
			e.errorText = this.startCmp.getErrorText();
		}
		this.fire("validation", e);
		this.setValidate(e);
	},
	getValue			: function() {
		return [this.startCmp.getValue(), this.endCmp.getValue()];
	},
	getFormValue		: function() {
		var valueObj = {};
		valueObj[this.startElConfig.name] = this.startCmp.getValue();
		valueObj[this.endElConfig.name] = this.endCmp.getValue();
		return valueObj;
	},
	setValue			: function(value) {
		if (!value) {
			value = ["", ""];
		}
		if (mini.isArray(value)) {
			this.startCmp.setValue(value[0]);
			this.endCmp.setValue(value[1]);
		} else if ($.type(value) == "object") {
			this.startCmp.setValue(value[this.startElConfig.name]);
			this.endCmp.setValue(value[this.endElConfig.name]);
		} else if ($.type(value) == "string") {
			var values = value.split(",");
			this.startCmp.setValue(values[0]);
			this.endCmp.setValue(values[1]);
		}

	},
	setAllowEquals		: function(allowEquals) {
		this.allowEquals = allowEquals;
	},
	getErrorIconEl		: function() {
		if (!this._errorIconEl) {
			this._errorIconEl = mini.append(this.el, '<span class="mini-errorIcon"></span>');
			this.startCmp.setWidth(this.startCmp.getWidth() - 9);
			this.endCmp.setWidth(this.endCmp.getWidth() - 9);
		}
		return this._errorIconEl;
	},
	_RemoveErrorIcon	: function() {
		if (this._errorIconEl) {
			var el = this._errorIconEl;
			jQuery(el).remove();
			this.startCmp.setWidth(this.startCmp.getWidth() + 9);
			this.endCmp.setWidth(this.endCmp.getWidth() + 9);
		}
		this._errorIconEl = null;
	},
	getAttrs			: function(el) {
		var attrs = mini.Range.superclass.getAttrs.call(this, el);
		mini._ParseString(el, attrs, ["startElConfig", "endElConfig", "elType", "vtype", "label", "businessInfo"]);
		mini._ParseInt(el, attrs, ["elWidth"]);
		mini._ParseBool(el, attrs, ["allowEquals"]);
		return attrs;
	}
});
mini.regClass(mini.Range, 'range');