// 设置jquery的默认参数
$.ajaxSetup( {
	cache	: false
})

/**
 * 全局变量，用于设置mini 调试模式。
 */
mini_debugger = true;

/** ------------------ 联动树/下拉列表, 关联配置 ---------------------------- */
if (mini) {
	mini.Relations = {
		map				: {},
		/**
		 * 主动方改变
		 */
		onchange		: function(sender) {
			if (sender && sender.id) {
				var depend = this.map[sender.id];
				if (depend) {
					for (var id in depend) {
						var o = depend[id];
						o = mini.get(o);
						if (!o || o.destroyed === true) {
							continue;
						}
						// 支持树, 下拉列表
						if (!o.onRelatedChange) {
							o.onRelatedChange = mini.Relations.onRelatedChange;
						}
						// 触发被动方改变的事件
						o.onRelatedChange();
					}
				}
			}
		},
		add				: function(sender) {
			var depends = sender.relations;
			if (!depends || depends.length <= 0) {
				return;
			}
			var ids = depends.split(",");
			var depend = this.map[ids[ids.length - 1]];
			if (!depend) {
				depend = {};
				this.map[ids[ids.length - 1]] = depend;
			}
			depend[sender.id] = sender;
		},
		/**
		 * 改变被动方的URL
		 */
		onRelatedChange	: function(control) {
			// 获取依赖对象的value
			var depends = this.getRelations();
			var ids = depends.split(",");
			var buf = [];
			var index = 0;
			for (var i = 0; i < ids.length; i++) {
				var o = mini.get(ids[i]);
				// 依赖对象为空时, 不加载数据
				if (!o || !o.getValue()) {
					continue;
				}
				index++;
				buf.push(o.getValue());
			}
			if (index < ids.length) {// 主动控件部分为空时不加载数据
				this.setData([]);
				this.setValue('');
				return;
			}
			// param参数间隔符是";", 参考GetPubInfoOfDB.java
			var param = buf.join(";");

			// 替换RUL中的param参数
			var url = this.getUrl2 ? this.getUrl2() : null;
			if (!url) {
				url = this.getUrl();
			}
			var startIndex = url.indexOf("&param");
			if (startIndex != -1) {
				var endIndex = url.indexOf("&", startIndex + 1);
				if (endIndex == -1) {
					url = url.substring(0, startIndex);
				} else {
					url = url.substring(0, startIndex) + url.substring(endIndex, url.length);
				}
			}
			url = url + "&param=" + param;
			this.load(url);
		}
	};

	/**
	 * 子父互斥, 只允许选中父结点, 或子结点 sender: Object, //树对象 node: Object, //节点对象 isLeaf: Boolean, checked: Boolean, //Check状态
	 * cancel: false
	 */
	mini.checkedOnlyPorC = function(e) {
		// 已经选中的不受限
		if (e.checked) {
			return;
		}
		var tree = e.sender.tree;
		var node = e.node;
		// 如果父结点已选中, 不允许选中本结点
		var parentNode = tree.getParentNode(node);
		if (parentNode) {
			if (parentNode.checked) {
				e.cancel = true;
				return;
			}
		}

		// 叶子结点没有子结点
		if (!e.isLeaf) {
			// 如果子结点已选中, 不允许选中本结点
			var subNodes = tree.getChildNodes(node);
			for (var i = 0; i < subNodes.length; i++) {
				if (subNodes[i].checked) {
					e.cancel = true;
					return;
				}
			}
		}
	}
}

/** ------------------ DataGrid---------------------------- */
if (mini.DataGrid) {
	mini.DataGrid.prototype.miniSetColumns = mini.DataGrid.prototype.setColumns;
	mini.DataGrid.prototype.miniGetAttrs = mini.DataGrid.prototype.getAttrs;
	mini.DataGrid.prototype.mini_createPager = mini.DataGrid.prototype._createPager;
	mini.DataGrid.prototype.mini_initEvents = mini.DataGrid.prototype._initEvents;
	mini.DataGrid.prototype.mini_doUpdateBody = mini.DataGrid.prototype._doUpdateBody;
	mini.DataGrid.prototype.miniDoLayout = mini.DataGrid.prototype.doLayout;
	mini.DataGrid.prototype.mini_OnCellBeginEdit = mini.DataGrid.prototype._OnCellBeginEdit;
    mini.DataGrid.prototype.mini_OnDrawCell = mini.DataGrid.prototype._OnDrawCell;
    mini.DataGrid.prototype.miniBeginEditRow = mini.DataGrid.prototype.beginEditRow;
	mini.copyTo(mini.DataGrid.prototype, {
		width					: "100%",
		height					: "100%",
		showFooter				: false,
		allowResize				: false,
		showModified			: false,
		allowUnselect			: true,
		editorHeight			: 21,// 单元格editor高度，解决textarea撑开行高度问题
        showEditHotTrack        : false,//是否高亮显示可编辑单元格
		_initEvents				: function() {
			this.mini_initEvents();
			mini._BindEvents(function() {
					mini.on(this._headerEl, 'mousemove', this.__OnHeaderCellMouseMove, this);
					mini.on(this._headerEl, 'mouseout', this.__OnHeaderCellMouseOut, this);
				}, this);
		},
		getAttrs				: function(el) {
			var attrs = this.miniGetAttrs(el);
			mini._ParseInt(el, attrs, ["editorHeight"]);
            mini._ParseBool(el, attrs, ["showEditHotTrack"]);
			return attrs;
		},
		doLayout				: function() {
			if (!this.canLayout())
				return;
			if (this.isFitColumns()) {
				var hiddenY = jQuery(this._bodyEl).css("overflow-y") == "hidden";
				var headerTable = this._headerInnerEl.firstChild, bodyTable = this._bodyInnerEl.firstChild;
				var headerTopTds = headerTable.rows[0].cells;
				var bodyTopTds = bodyTable.rows[0].cells;

				var bodyScrollHeight = this._bodyEl.scrollHeight;
				var bodyClientHeight = this._bodyEl.clientHeight;

				var w = this.getWidth(true);// grid宽度
				if (!hiddenY && bodyClientHeight < bodyScrollHeight && !this.isAutoHeight()) {
					w = parseInt(w - 17);
				}
				var totalWidth = 0;// 可改变列宽的列总宽度
				var cols = 0;
				var columns = this.getBottomColumns();
				function getResizeWidth(column, index, parentColumn) {
					if (!column.allowResize || column.width.indexOf("%") == -1) {
						w = w - parseInt(column.width);
					} else {
						totalWidth += parseInt(column.width);
						cols++;
					}
				}
				this.eachColumns( {
					columns	: columns
				}, getResizeWidth, this);

				if (w < cols * 80) {
					w = cols * 80;
				}
				function setColumnBox(column, index, parentColumn) {
					if (column.allowResize && column.width.indexOf("%") != -1) {
						headerTopTds[index].style.width = Math.floor(w * parseInt(column.width) / totalWidth) + "px";
						bodyTopTds[index].style.width = Math.floor(w * parseInt(column.width) / totalWidth) + "px";
					} else {
						headerTopTds[index].style.width = parseInt(column.width) + "px";
						bodyTopTds[index].style.width = parseInt(column.width) + "px";
					}
				}
				this.eachColumns( {
					columns	: columns
				}, setColumnBox, this);
			}
			this.miniDoLayout();
		},
		/**
		 * 当column.allowResize为false时该列按实际宽度显示
		 * 
		 * @author 赵美丹
		 */
		setColumns				: function(value) {
			this.miniSetColumns(value);

			function setColumnBox(column, index, parentColumn) {
				// 解决textarea撑开行高度问题
				if (column.editor) {
					column.editor.height = this.editorHeight;
				}
			}
			this.eachColumns(this, setColumnBox, this);

		},
		_createPager			: function() {
			this.mini_createPager();
			// 解决编辑页面重置时清空pagesize的问题
			if (!this.showFooter) {
				this.pager.sizeCombo.un("valuechanged", this.pager.__OnPageSelectChanged, this.pager);
			}
		},
		/**
		 * 扩展对textarea的支持
		 */
		_OnCellClick			: function(e) {
			this.fire("cellClick", e);
			var dg = e.sender;
			if (dg.allowCellEdit && dg.allowCellSelect) {
				return;
			}

			var editor = this.getCellEditor(e.column, e.record);
			if (editor && editor.setHeight && editor.type == "textarea" && (editor.getHeight() < 22)) {
				var cellEl = this._getCellEl(e.record, e.column);
				var cellElChildNodes = cellEl.childNodes;
				var isPlainText = cellElChildNodes.length > 0 && 
						cellElChildNodes[0].nodeType == 3

				if (editor.enabled == false) {
					return;
				}

				if (isPlainText) {
					editor.setValue($(cellEl).html());
					$(cellEl).html('');
				}
    
				var cellBox = this.getCellBox(e.record, e.column);
                var paddings = mini_getPaddings(cellEl);
				cellBox.x = cellBox.x + paddings.left;
				cellBox.y = cellBox.y - paddings.top;
				cellBox.width = cellBox.width - paddings.left - paddings.right;

				var _editWrap = this._getEditWrap(cellBox, cellEl);
				mini.un(this._editWrap, "keydown", this.___OnEditControlKeyDown, this);

				this._editWrap.style.zIndex = mini.getMaxZIndex();
				editor.render(this._editWrap);
				setTimeout(function() {
						editor.focus();
						if (editor.selectText)
							editor.selectText();
					}, 10);
				if (editor.setVisible)
					editor.setVisible(true);

				var cellHeight = editor.getHeight();
				$(editor).data("data", {
					"cellHeight"	: cellHeight,
					"cellId"		: this._createCellId(e.record, e.column)
				});
				if (editor.minHeight && cellHeight < editor.minHeight) {
					editor.setHeight(editor.minHeight);
				}
				
				//editor.on('blur', this.__onEditorBlur, editor);
				// 修复 textarea 没有正确解绑bulr事件 2013-10-12 guxb
				var self = this;
				var callEditBlur = function () {
					self.__onEditorBlur(editor);
					mini.un(editor._textEl, 'blur', callEditBlur, self);
					mini.un(self.el, 'mousewheel', callMouseWheel, self);
				}

				// 修复表格textarea编辑状态下 鼠标滚轮滚动 textarea漂浮的bug 2013-10-12 guxb
				var callMouseWheel = function () {
					self.__onEditorBlur(editor);
					mini.un(self.el, 'mousewheel', callMouseWheel, self);
					mini.un(editor._textEl, 'blur', callEditBlur, self);
				}

				mini.on(this.el, 'mousewheel', callMouseWheel, self);
				mini.on(editor._textEl, 'blur', callEditBlur, this);
			}
        },
		/**
		 * 扩展对textarea的支持
		 */
		_OnCellKeyUp			: function(e) {
			if (e.htmlEvent.keyCode == 9) {
				this._OnCellClick(e);
			}
		},
		/**
		 * 扩展对textarea的支持
		 */
		__onEditorBlur			: function(editor) {
			var value = editor._textEl.value;
			if (value.length > editor.maxLength) {
				editor._textEl.value = value.substring(0, editor.maxLength);
				editor.setValue(editor._textEl.value);
		 	}

			var $editor = $(editor);
			var data = $editor.data("data");
			this._editWrap.style.display = "none";

			var cellEl = document.getElementById(data.cellId);
			cellEl.innerHTML = "";
			cellEl.appendChild(editor.el);

			editor.setHeight(data.cellHeight);
		},

		_OnCellBeginEdit : function(record, column, editor) {
			var editorStyle = (editor && editor.style && editor.style.toLowerCase()) || '';
			var reg = /height\s*:\s*(\d{1,})px/;
			var matched;
			var res = mini.DataGrid.prototype.mini_OnCellBeginEdit.apply(this, arguments);

			if (editorStyle && (matched = editorStyle.match(reg))) {
				editor.setHeight(matched[1]);
			}

			return res;
		},
		/**
		 * 扩展列头显示不全时显示title
		 */
		__OnHeaderCellMouseMove	: function(e) {
			var headerCell = mini.findParent(e.target, "mini-grid-headerCell");
			if (headerCell) {
				if (headerCell.firstChild.scrollWidth > headerCell.clientWidth) {
					var s = headerCell.innerText || headerCell.textContent || "";
					headerCell.title = s.trim();
				} else {
					headerCell.title = "";
				}
			}
		},
		/**
		 * 扩展列头显示不全时显示title--解决title长时间停留后消失，此时移出再移入不显示title的问题
		 */
		__OnHeaderCellMouseOut	: function(e) {
			var headerCell = mini.findParent(e.target, "mini-grid-headerCell");
			if (headerCell) {
				headerCell.title = "";
			}
		},
		/**
		 * 获取表格区域可见的最后一条记录的高度
		 * 
		 * @return {number} 当存在滚动条时返回0
		 */
		getClientLastRowHeight	: function(e) {
			var bodyHeight = $(this._bodyEl).height();
			var tableHeight = $(this._bodyInnerEl.firstChild).height();

			var rowHeight = 0;
			var _rowBox = this.getRowBox(0);
			if (_rowBox) {
				rowHeight = _rowBox.height;
			}

			// 浏览器未计算边框
			if (rowHeight % 2 == 0) {
				rowHeight = rowHeight + 1;
			}
			if ((bodyHeight + rowHeight) < tableHeight) {
				return 0;
			} else if (bodyHeight < tableHeight) {
				return rowHeight + bodyHeight - tableHeight;
			}
			if (tableHeight < rowHeight) {
				return tableHeight;
			}
			return rowHeight;
		},
		getBodyEl				: function() {
			return this._bodyEl;
		},
		beginEdit				: function() {
			if (!this.allowCellEdit) {// 行编辑模式
				var scope = this;
				this._allowLayout = false;
				this.findRows(function(row) {
						scope.beginEditRow(row);
					});
				this._allowLayout = true;
				this.doLayout();
			}
		},
		/**
		 * 重写该方法
		 * 
		 * @param hasUnEditCol
		 *            是否包括不可编辑列的数据
		 * @param hasUnEditRow
		 *            是否包括不可编辑行的数据
		 */
		getEditData				: function(hasUnEditCol, hasUnEditRow) {
			var data = [];
			for (var i = 0, l = this.data.length; i < l; i++) {
				var row = this.data[i];
				if (row._editing == true) {
					var rowData = this.getEditRowData(i, hasUnEditCol);
					rowData._index = i;

					data.push(rowData);
				} else if (hasUnEditRow) {
					data.push(row);
				}
			}
			return data;
		},
		_doUpdateBody			: function() {
			mini.DataGrid.prototype.mini_doUpdateBody.call(this);
			// 扩展事件，解决拖动列时行详情无法显示的问题 赵美丹 2013-04-18
			this.fire("updatebody");
		},
        /**
         * 扩展单元格编辑时高亮显示可编辑单元格
         */
        _OnDrawCell : function (record, column, rowIndex, columnIndex) {
            var e = this.mini_OnDrawCell(record, column, rowIndex, columnIndex);
            //扩展单元格编辑时高亮显示可编辑单元格
            if(this.showEditHotTrack && column.editor){
                if(this.allowCellEdit){
                    e.cellCls = e.cellCls + " mini-grid-editCell-hotTrack";
                }
            }
            return e;
        },
        /**
         * 扩展行编辑时高亮显示可编辑单元格
         */
        beginEditRow: function (row) {
            this.miniBeginEditRow(row);
            //扩展行编辑时高亮显示可编辑单元格
            if(this.showEditHotTrack){
                var rowEl = this._getRowEl(row);
                $(".mini-grid-cellEdit", rowEl).addClass("mini-grid-editCell-hotTrack");
            }
        }
	});
}

/** ------------------ _ColumnSplitter---------------------------- */
if (mini._ColumnSplitter) {
	mini._ColumnSplitter.prototype.mini_OnDragStop = mini._ColumnSplitter.prototype._OnDragStop;
	mini.copyTo(mini._ColumnSplitter.prototype, {
		_OnDragStop	: function(drag) {
			this.mini_OnDragStop(drag);

			// 扩展宽度为百分比的列可以调整列宽
			var grid = this.grid;
			var box = mini.getBox(this._dragProxy);
			var column = this.splitterColumn;
			var columnWidth = parseInt(column.width);
			if (columnWidth + "%" == column.width) {
				var width = grid.getColumnWidth(column);
				var w = parseInt(columnWidth / width * box.width);
				grid.setColumnWidth(column, box.width);
			}
		}
	});
}
/** ------------------ Tree---------------------------- */
if (mini.Pager) {
	mini.copyTo(mini.Pager.prototype, {
		showReloadButton	: false
	})
}
/** ------------------ Tree---------------------------- */
if (mini.Tree) {
	mini.Tree.prototype.mini_initEvents = mini.Tree.prototype._initEvents;
	mini.Tree.prototype.miniGetAttrs = mini.Tree.prototype.getAttrs;
	mini.Tree.prototype.mini_OnNodeMouseDown = mini.Tree.prototype._OnNodeMouseDown;
	mini.Tree.prototype.mini_OnNodeClick = mini.Tree.prototype._OnNodeClick;
	mini.Tree.prototype.mini_doCheckNode = mini.Tree.prototype._doCheckNode;
	mini.copyTo(mini.Tree.prototype, {
		showTreeIcon			: true,
		resultAsTree			: false,
		/**
		 * 选中/取消选中子节点时是否影响父节点
		 * 
		 * @author zhaomd
		 */
		recursiveParent			: false,
		/**
		 * 选中/取消选中父节点时是否影响子节点
		 * 
		 * @author zhaomd
		 */
		recursiveChild			: false,
		/**
		 * 是否允许父节点选中
		 * 
		 * @author zhaomd
		 */
		allowParentSelect		: true,
		allowAnim				: false,
		getAttrs				: function(el) {
			var attrs = mini.Tree.prototype.miniGetAttrs.call(this, el);
			mini._ParseBool(el, attrs, ["allowParentSelect"]);

			return attrs;
		},
		_ajaxOption				: {
			async	: true,
			type	: "get"
		},
		_initEvents				: function() {
			this.mini_initEvents();
			this.on("nodeClick", this.__OnNodeClick, this);
		},
		/**
		 * 重写setMultiSelect方法：用户体验优化--点击树节点与点击checkbox效果相同（原：必须点击checkbox才可以选中或取消）
		 */
		__OnNodeClick			: function(e) {
			var checkboxEl = this._getCheckBoxEl(e.node);
			if (checkboxEl) {
				checkboxEl.click();
			}
		},
		_OnNodeClick			: function(node, htmlEvent) {
			// 扩展allowParentSelect，是否允许父节点选中
			if (!this.allowParentSelect && !this.isLeaf(node)) {
				return;
			}
			this.mini_OnNodeClick(node, htmlEvent);
		},
		_OnNodeMouseDown		: function(node, htmlEvent) {
			// 扩展allowParentSelect，是否允许父节点选中
			if (!this.allowParentSelect && !this.isLeaf(node)) {
				return;
			}
			this.mini_OnNodeMouseDown(node, htmlEvent);
		},
		setAllowParentSelect	: function(value) {
			this.allowParentSelect = value;
		},
		setRecursiveParent		: function(value) {
			this.recursiveParent = value;
		},
		setRecursiveChild		: function(value) {
			this.recursiveChild = value;
		},
		_doCheckNode			: function(node, checked, checkRecursive) {
			mini.Tree.prototype.mini_doCheckNode.call(this, node, checked, checkRecursive);
			// 扩展recursiveParent(选子联动父)和recursiveChild(选父联动子)
			var _ckNodes = [];
			// 选子联动父
			if (this.recursiveParent) {
				var ans = this.getAncestors(node);
				ans.reverse();
				for (var i = 0, l = ans.length; i < l; i++) {
					var pnode = ans[i];
					var childNodes = this.getChildNodes(pnode);
					var checkAll = true, hasCheck = false;
					for (var ii = 0, ll = childNodes.length; ii < ll; ii++) {
						var cnode = childNodes[ii];
						if (this.isCheckedNode(cnode)) {
							hasCheck = true;
						} else {
							checkAll = false;
						}
					}
					if (checkAll) {
						pnode.checked = true;
						pnode._indeterminate = false;
					} else {
						pnode.checked = false;
						pnode._indeterminate = hasCheck;
					}
					_ckNodes.push(pnode);
				}
			}
			// 选父联动子
			if (this.recursiveChild) {
				this.cascadeChild(node, function(cnode) {
						cnode.checked = checked;
						cnode._indeterminate = false;
						_ckNodes.push(cnode);
					}, this);
			}
			for (var i = 0, l = _ckNodes.length; i < l; i++) {
				var ckNode = _ckNodes[i];
				var checkEl = this._getCheckBoxEl(ckNode);
				if (checkEl) {
					if (ckNode.checked) {
						checkEl.indeterminate = false;
						checkEl.checked = true;
					} else {
						checkEl.indeterminate = ckNode._indeterminate;
						checkEl.checked = false;
					}
				}
			}
		},
		/**
		 * 获取树节点的最大层级
		 */
		getMaxLevel				: function() {
			var level = 0;
			this.cascadeChild(this.root, function(n, i, p) {
					level = Math.max(level, n._level);
				}, this);
			return level;
		}
	});
}
/** ------------------ TreeGrid---------------------------- */
if (mini.TreeGrid) {
	mini.copyTo(mini.TreeGrid.prototype, {
		width			: "100%",
		height			: "100%",
		showTreeIcon	: true,
		resultAsTree	: false,
		allowResize		: false,
		_ajaxOption		: {
			async	: true,
			type	: "get"
		},
		leafIcon		: "mini-tree-folder"
	});
}
/** ------------------ ButtonEdit---------------------------- */
if (mini.ButtonEdit) {
	mini.ButtonEdit.prototype.miniGetAttrs = mini.ButtonEdit.prototype.getAttrs;
	mini.ButtonEdit.prototype.miniSet = mini.ButtonEdit.prototype.set;
	mini.copyTo(mini.ButtonEdit.prototype, {
		width			: "100%",
		emptyText		: "-请选择-",
		/**
		 * 按钮文字
		 * 
		 * @author 赵美丹
		 */
		buttonText		: "",
		getAttrs		: function(el) {
			var attrs = mini.ButtonEdit.prototype.miniGetAttrs.call(this, el);
			mini._ParseString(el, attrs, ["buttonText"]);

			return attrs;
		},
		/**
		 * 扩展按钮文字
		 * 
		 * @author 赵美丹
		 */
		set				: function(kv) {
			var buttonText = kv.buttonText;
			delete kv.buttonText;
			mini.ButtonEdit.prototype.miniSet.call(this, kv);
			if (buttonText) {
				this.setButtonText(buttonText);
			}
		},
		setButtonText	: function(value) {
			this.buttonText = value;
			$(this._buttonEl).empty().html(this.buttonText);
		}
	});
}
/** ------------------ ButtonEdit---------------------------- */
if (mini.FileUpload) {
	mini.copyTo(mini.FileUpload.prototype, {
		width		: "100%",
		showClose	: false,
		flashUrl	: '/daie/scripts/swf/swfupload.swf'
	});
}
/** ------------------ Splitter---------------------------- */
if (mini.Splitter) {
	mini.copyTo(mini.Splitter.prototype, {
		width	: "100%",
		height	: "100%"
	});
}
/** ------------------ PopupEdit---------------------------- */
if (mini.PopupEdit) {
	mini.copyTo(mini.PopupEdit.prototype, {
		width	: "100%"
	});
}
/** ------------------ PopupEdit---------------------------- */
if (mini.WDatePicker) {
	mini.copyTo(mini.WDatePicker.prototype, {
		width		: "100%",
		showClose	: false
	});
}
/** ------------------ ListControl---------------------------- */
if (mini.ListControl) {
	mini.ListControl.prototype.mini_initEvents = mini.ListControl.prototype._initEvents;
	mini.copyTo(mini.ListControl.prototype, {
		_initEvents		: function() {
			mini.ListControl.prototype.mini_initEvents.call(this);
			this.on("beforeload", mini.ListControl.prototype.__OnBeforeLoad, this);
		},
		/**
		 * 修改为异步请求
		 */
		__OnBeforeLoad	: function(e) {
			e.async = true;
		}
	});
}
/** ------------------ ListBox---------------------------- */
if (mini.ListBox) {
	mini.copyTo(mini.ListBox.prototype, {
		nullItemText	: "-请选择-",
		width			: "100%",
		height			: "100%",
		delimiter		: ", "
	});
}
/** ------------------ ComboBox---------------------------- */
if (mini.ComboBox) {
	mini.ComboBox.prototype.mini__createPopup = mini.ComboBox.prototype._createPopup;
	mini.ComboBox.prototype.mini_setData = mini.ComboBox.prototype.setData;
	mini.ComboBox.prototype.miniGetAttrs = mini.ComboBox.prototype.getAttrs;
	mini.ComboBox.prototype.miniSetValue = mini.ComboBox.prototype.setValue;
	mini.ComboBox.prototype.miniSet = mini.ComboBox.prototype.set;
	mini.copyTo(mini.ComboBox.prototype, {
		width				: "100%",
		selectFirst			: true,// 当showNullItem为false时有效
		showClose			: false,
		valueFromSelect		: true,
		emptyText			: "-请选择-",
		set					: function(kv) {
			this._value = kv.value;// 用于保存初始value（解决listbox未加载完时执行setValue，this.value被清空的问题）
			this.miniSet(kv);
		},
		getAttrs			: function(el) {
			var attrs = this.miniGetAttrs(el);
			mini._ParseString(el, attrs, ["relations", "url2"]);
			mini._ParseBool(el, attrs, ["selectFirst"]);

			return attrs;
		},
		getRelations		: function() {
			return this.relations;
		},
		setRelations		: function(value) {
			this.relations = value;
			mini.Relations.add(this);
		},
		getUrl2				: function() {
			return this.url2;
		},
		setUrl2				: function(value) {
			this.url2 = value;
		},
		__OnItemLoad		: function() {
			this.data = this._listbox.data;
			if (!this.showNullItem
					&& this.selectFirst
					&& (typeof this._value == "undefined" && this.value === '' || (typeof this._value != "undefined" && this._value === ""))
					&& this.data.length > 0) {
				this.setValue(this.data[0][this.valueField]);
				this.defaultValue = this.data[0][this.valueField];
			} else {
				if (typeof this._value != "undefined") {
					this.setValue(this._value);
				} else {
					this.setValue(this.value);
				}
				delete this._value;
			}
		},
		/**
		 * 修改为异步请求
		 */
		__OnItemBeforeLoad	: function(e) {
			e.async = true;
		},
		_createPopup		: function() {
			this.mini__createPopup();

			this._listbox.on("load", this.__OnItemLoad, this);
			this._listbox.on("beforeload", this.__OnItemBeforeLoad, this);
		},
		setData				: function(data) {
			this.mini_setData(data);
			if (this.name != "pagesize" && !this.showNullItem && this.selectFirst && this.value === '') {
				if (this.data.length > 0) {
					this.setValue(this.data[0][this.valueField]);
					this.defaultValue = this.data[0][this.valueField];
				}
			}
		},
		setValue			: function(value) {
			this._value = value;
			this.miniSetValue(value);

			if (!this.valueFromSelect && this._textEl) {
				var text = this.getText();
				if (value !== ''
						&& (text === '' || (this.showNullItem && mini.isEquals(text, this._listbox.getNullItemText())))) {
					this.setText(this.getValue());
				}
			}
		},
		getTextByValue		: function(records) {
			return this._listbox.getValueAndText(records)[1];
		}
	});
}

/** ------------------ TreeSelect---------------------------- */
/**
 * 增加配置项 一个树组件需要传递多个字段值时, 可以设置valueFields和valueFormat. 1. 多值字段valueFields, 如:valueFields="DM,MC,JC,PID" 2.
 * 值格式valueFormat, 如:valueFormat="json" 或 valueFormat="|", 默认值是"json"
 * 
 * @author 陈云明
 */
if (mini.TreeSelect) {
	mini.TreeSelect.prototype.miniGetAttrs = mini.TreeSelect.prototype.getAttrs;
	mini.TreeSelect.prototype.miniGetFormValue = mini.TreeSelect.prototype.getFormValue;
	mini.TreeSelect.prototype.miniSetValue = mini.TreeSelect.prototype.setValue;
	mini.TreeSelect.prototype.mini_createPopup = mini.TreeSelect.prototype._createPopup;
	mini.TreeSelect.prototype.miniSet = mini.TreeSelect.prototype.set;
	mini.TreeSelect.prototype.mini_createQueryToolBar = mini.TreeSelect.prototype._createQueryToolBar;
	mini.TreeSelect.prototype.mini_destroyQueryToolBar = mini.TreeSelect.prototype._destroyQueryToolBar;
	mini.copyTo(mini.TreeSelect.prototype, {
		width					: "100%",
		popupWidth				: "100%",
		popupMinWidth			: 250,
		showQueryToolBar		: true,
		showRecursiveCbx		: false,
		hasClear				: true,
		valueFormat				: "json",
		emptyText				: "-请选择-",
		delimiter				: ", ",
		popupHeight				: 300,
		popupMaxHeight			: 300,
		popupMinHeight			: 200,
		/**
		 * value是否必须在tree数据内
		 * 
		 * @type Boolean
		 * @default true
		 */
		valueFromSelect			: true,
		/**
		 * 是否允许父节点选中
		 * 
		 * @author zhaomd
		 */
		allowParentSelect		: true,
		defaultText				: "",
		set						: function(kv) {
			this._value = kv.value;// 用于保存初始value（解决tree未加载完时执行setValue，this.value被清空的问题）

			// 扩展leafIcon
			var leafIcon = kv.leafIcon;
			delete kv.leafIcon;
			if (!mini.isNull(leafIcon)) {
				this.setLeafIcon(leafIcon);
			}

			this.miniSet(kv);
			if (!mini.isNull(this.emptyText)) {
				this._doEmpty();
			}
			if (!mini.isNull(this.text)) {
				this.defaultText = this.text;
			}
		},
		__OnTreeLoad			: function() {
			if (this.recursiveCbx && this.multiSelect && this.showRecursiveCbx) {
				var maxLevel = this.tree.getMaxLevel();
				if (maxLevel > 2) {
					this.recursiveCbx.show();
				} else {
					this.recursiveCbx.hide();
				}
			}
			if (this._value) {
				this.setValue(this._value);
			} else {
				this.setValue(this.value);
			}
			delete this._value;
		},
		_createPopup			: function() {
			this.mini_createPopup();
			this.tree.on("load", this.__OnTreeLoad, this);
		},
		getAttrs				: function(el) {
			var attrs = this.miniGetAttrs(el);
			mini._ParseString(el, attrs, ["valueFields", "valueFormat", "relations", "emptyText", "url2", "leafIcon"]);
			mini._ParseBool(el, attrs, ["valueFromSelect", "allowParentSelect", "showRecursiveCbx"]);

			return attrs;
		},
		setLeafIcon				: function(leafIcon) {
			// 首先如果没有创建弹出层，则先创建之。
			this.getPopup();
			this.tree.setLeafIcon(leafIcon);
			this.leafIcon = this.tree.leafIcon;
		},
		setValueFields			: function(value) {
			this.valueFields = value;
		},
		/**
		 * 值格式, 支持json;
		 */
		setValueFormat			: function(value) {
			this.valueFormat = value;
		},
		getRelations			: function() {
			return this.relations;
		},
		setRelations			: function(value) {
			this.relations = value;
			mini.Relations.add(this);
		},
		getUrl2					: function() {
			return this.url2;
		},
		setUrl2					: function(value) {
			this.url2 = value;
		},
		/**
		 * 返回三种格式的数据 普通值格式分为单值或多值, 单值如:11301031300; 多值如:11301031300,11301031400 json值格式分为单值或多值,
		 * 单值如:{"DM":"000000000000","MC":"国家税务总局","JC":"0","PID":"-1"}, 多值如:[{...},{},...] 分隔符格式分为单值或多值,
		 * 单值如:000000000000,国家税务总局,0,-1 多值如:000000000000,国家税务总局,0,-1;...
		 */
		getFormValue			: function() {
			/**
			 * 单个node的格式处理, 将node转换成form需要的值格式
			 * 
			 * @param node
			 * @param fields
			 * @param format
			 * @returns 两种: 1. json对象{}; 2. 有分隔符的字符串
			 */
			function getNodeValue(node, fields, format) {
				if (format && format != "json") {
					// 分隔符方式
					var buf = [];
					if (fields.length > 0) {
						buf.push(node[fields[0]]);
					}
					for (var i = 1; i < fields.length; i++) {
						var k = fields[i];
						buf.push(node[k]);
					}
					return buf.join(format);
				} else {
					// 默认返回json格式
					var o = {};
					for (var i = 0; i < fields.length; i++) {
						var k = fields[i];
						o[k] = node[k];
					}
					return o;
				}
			};
			if (this.valueFields) {
				// 值字段列表采用,分隔
				var fields = this.valueFields.split(",");
				var obj;

				if (this.multiSelect) {
					// 多选
					obj = [];
					var nodes = this.tree.getNodesByValue(this.value);
					for (var i = 0; i < nodes.length; i++) {
						var node = nodes[i];
						obj.push(getNodeValue(node, fields, this.valueFormat));
					}
					// 分隔符方式的多值间隔符为
					if (this.valueFormat && this.valueFormat != "json") {
						obj = obj.join(this.delimiter);
					}
				} else {

					// 单选
					var node = this.tree.getNode(this.value);
					if (node) {
						obj = getNodeValue(node, fields, this.valueFormat);
					}
				}

				if (mini.isNull(obj))
					return "";
                // 返回字符串, json对象也要转换成json字符串格式
				return mini.encode(obj);
			} else {
				return this.miniGetFormValue();
			}
		},
		setText					: function(value) {
			mini.TreeSelect.superclass.setText.call(this, value);
			this.defaultText = value;
		},
		setValue				: function(value) {
			this._value = value;
			if (this.valueFields && value) {
				if (this.valueFormat && this.valueFormat != "json") {
					// 分隔符方式, 查找valueField的位置, 采用miniUI默认方式
				} else {
					// json格式
					try {
						var obj = mini.decode(value);
						if (this.multiSelect && obj.length >= 0) {
							// 多值方式
							var array = obj;
							var buf = [];
							for (var i = 0; i < array.length; i++) {
								var o = array[i];
								if (o && o[this.valueField]) {
									buf.push(o[this.valueField]);
								}
							}
							value = buf.join(this.delimiter);
						} else {
							// 单值方式
							if (obj && obj[this.valueField]) {
								value = obj[this.valueField];
							}
						}
					} catch (e) {
						// 不做处理
					}
				}
			}
			// 扩展valueFromSelect
			if (!this.valueFromSelect && value !== "") {
				var vts = this.tree.getValueAndText(value);
				if (vts[1] === "" || vts[1].split(this.delimiter).length < value.split(this.delimiter).length) {
					var v = this.value;
					this.value = value;

					this._valueEl.value = value;

					this.setText(this.defaultText);

					if (!mini.isEquals(this.value, v)) {
						this.tree.setValue(this.value);
						this._OnValueChanged();
					}
					return;
				}
			}
			this.miniSetValue(value);
		},
		/**
		 * 重写setMultiSelect方法：用户体验优化--点击树节点与点击checkbox效果相同（原：必须点击checkbox才可以选中或取消）
		 */
		setMultiSelect			: function(value) {
			if (this.multiSelect != value) {
				this.multiSelect = value;
				this.tree.setShowCheckBox(value);
				this.tree.setAllowSelect(value);
				this.tree.setEnableHotTrack(value);
				if (!this.multiSelect) {
					this.recursiveCbx.hide();
				}
			}
		},
		setAllowParentSelect	: function(value) {
			if (this.allowParentSelect != value) {
				this.allowParentSelect = value;
				this.tree.setAllowParentSelect(value);
			}
		},
		setShowRecursiveCbx		: function(value) {
			if (this.showRecursiveCbx != value) {
				this.showRecursiveCbx = value;
			}
		},
		_createQueryToolBar		: function() {
			this.mini_createQueryToolBar();
			// 联动选择checkbox
			if (this.showQueryToolBar && this.queryToolbar && !this.recursiveCbx) {
				this.recursiveCbx = new mini.CheckBox();
				this.recursiveCbx.setText("联动");
				this.recursiveCbx.render(this.queryToolbar.el);
				this.recursiveCbx.on("checkedchanged", this._onRecursiveChanged, this);
				if (!this.multiSelect || !this.showRecursiveCbx) {
					this.recursiveCbx.hide();
				}
				this.popup.on("Close", function() {
						this.recursiveCbx.setChecked(false);
					}, this);
			}

			// 扩展关闭按钮
			if (this.showQueryToolBar && this.queryToolbar && !this.closeButton) {
				this.closeButton = new mini.Button();
				this.closeButton.setIconCls("icon-popup-close");
				this.closeButton.setPlain(true);
				this.closeButton.render(this.queryToolbar.el);
				this.closeButton.onClick(this._onClose, this);

			}
			this.on("showpopup", function() {
					var w = this.queryToolbar.getWidth();
					if (this.recursiveCbx.isDisplay()) {
						w = w - 46;
					}
					this.queryInput.setWidth(w - 82);
				});
		},
		_destroyQueryToolBar	: function(removeEl) {
			if (this.closeButton) {
				mini.clearEvent(this.closeButton);
				this.closeButton.destroy(removeEl);
				this.closeButton = null;
			}
			if (this.recursiveCbx) {
				mini.clearEvent(this.recursiveCbx);
				this.recursiveCbx.destroy(removeEl);
				this.recursiveCbx = null;
			}
			this.mini_destroyQueryToolBar(removeEl);
		},
		_onClose				: function() {
			this.hidePopup();
		},
		_onRecursiveChanged		: function(e) {
			this.tree.setRecursiveParent(false);
			if (e.checked) {
				this.tree.setRecursiveChild(true);
			} else {
				this.tree.setRecursiveChild(false);
			}
		}
	});
}

/** ------------------ TextBox---------------------------- */
if (mini.TextBox) {
	mini.TextBox.prototype.miniFocus = mini.TextBox.prototype.focus;
	mini.copyTo(mini.TextBox.prototype, {
		width	: "100%",
		focus	: function() {
			if (this.enabled == false) {
				return;
			}
			var scope = this;
			setTimeout(function() {
					mini.TextBox.prototype.miniFocus.call(scope);
					// 解决IE7下需focus两遍才可获取焦点的问题 赵美丹 2013-04-26
					try {
						scope._textEl.focus();
					} catch (e) {
					}
				}, 10)
		}
	});
}
/** ------------------ TextArea---------------------------- */
if (mini.TextArea) {
	mini.copyTo(mini.TextArea.prototype, {
		width	: "100%"
	});
}
/** ------------------ Password---------------------------- */
if (mini.Password) {
	mini.copyTo(mini.Password.prototype, {
		width	: "100%"
	});
}
/** ------------------ Layout---------------------------- */
if (mini.Layout) {
	mini.Layout.prototype.mini_createRegion = mini.Layout.prototype._createRegion;
	mini.Layout.prototype.miniDoLayout = mini.Layout.prototype.doLayout;
	mini.copyTo(mini.Layout.prototype, {
		_createRegion	: function(options) {
			options = options || {};
			if (!options.showSplit) {
				options.showSplit = false;
			}
			if (!options.showHeader) {
				options.showHeader = false;
			}
			return this.mini_createRegion(options);
		},
		doLayout		: function() {
			this.miniDoLayout();
			var w = mini.getWidth(this.el, true);
			var regions = this.regions.clone();
			for (var i = 0, l = regions.length; i < l; i++) {
				var region = regions[i];
				if (!region.expanded && region.region == 'north' && region.showHeader) {
					// 解决header收起时proxy的宽度与header宽度不一致的问题 赵美丹 2012-11-27
					mini.setWidth(region._proxy, w - 20);
				}
			}
		}
	});
}
/** ------------------ OutlookBar---------------------------- */
if (mini.OutlookBar) {
	mini.OutlookBar.prototype.mini_tryToggleGroup = mini.OutlookBar.prototype._tryToggleGroup;
    mini.OutlookBar.prototype.miniGetAttrs = mini.OutlookBar.prototype.getAttrs;
    mini.OutlookBar.prototype.miniParseGroups = mini.OutlookBar.prototype.parseGroups;
    mini.OutlookBar.prototype.mini__OnClick = mini.OutlookBar.prototype.__OnClick;
    mini.OutlookBar.prototype.miniDoUpdate = mini.OutlookBar.prototype.doUpdate;
    mini.OutlookBar.prototype.miniCollapseGroup = mini.OutlookBar.prototype.collapseGroup;
	mini.copyTo(mini.OutlookBar.prototype, {
		allowAnim		: false,
        showMaxButton   : false,//是否显示最大化/还原按钮
        _currMaxButton  : "mini-tools-max",//当前最大化/还原按钮
        doUpdate        : function () {
            mini.OutlookBar.prototype.miniDoUpdate.call(this);
            this.setShowMaxButton(this.showMaxButton);
        },
        getAttrs        : function(el) {
            var attrs = mini.OutlookBar.prototype.miniGetAttrs.call(this, el);
            mini._ParseBool(el, attrs, ["showMaxButton"]);

            return attrs;
        },
        parseGroups: function (nodes) {
            var groups = mini.OutlookBar.prototype.miniParseGroups.call(this, nodes);
            for (var i = 0, l = nodes.length; i < l; i++) {
	            var node = nodes[i];
	            mini._ParseBool(node, group[i],["showMaxButton"]);
	        }
            return groups;
        },
		_tryToggleGroup	: function(group) {
			group = this.getGroup(group);
			if (group.showCollapseButton) {
				// 当enabled为false时点击header不再收起/展开
				this.mini_tryToggleGroup(group);
			}
		},
        /**
         * 扩展最大化/还原按钮
         */
        __OnClick: function (e) {
            if (this._inAniming) return;
            //扩展最大化/还原按钮
            if(mini.hasClass(e.target, "mini-tools-max")){
                mini.OutlookBar.prototype.___maxGroup.call(this, e);
            }else if(mini.hasClass(e.target, "mini-tools-restore")){
                mini.OutlookBar.prototype.___restoreGroup.call(this, e);
            }else{
                mini.OutlookBar.prototype.mini__OnClick.call(this, e);
            }
        },
        ___maxGroup : function(e){
            this._currMaxButton = "mini-tools-restore";
            this._allowLayout = false;
            $(e.target).addClass("mini-tools-restore").removeClass("mini-tools-max");
            var group = this._getGroupByEvent(e);
            this.expandGroup(group);
            for (var i = 0, l = this.groups.length; i < l; i++) {
                if(group._id != this.groups[i]._id){
                    this.hideGroup(this.groups[i]);
                }
            }
            this._allowLayout = true;
            this.doLayout();
        },
        ___restoreGroup : function(e, group){
            this._currMaxButton = "mini-tools-max";
            this._allowLayout = false;
            if(group){
                $(".mini-tools-restore", group.el).addClass("mini-tools-max").removeClass("mini-tools-restore");
            }else{
                $(e.target).addClass("mini-tools-max").removeClass("mini-tools-restore");
            }
            var group = group || this._getGroupByEvent(e);
            for (var i = 0, l = this.groups.length; i < l; i++) {
                if(group._id != this.groups[i]._id){
                    this.showGroup(this.groups[i]);
                }
            }
            this._allowLayout = true;
            this.doLayout();
        },
        collapseGroup: function (group) {
            mini.OutlookBar.prototype.miniCollapseGroup.call(this, group);
            var activeGroup = this.getActiveGroup();
            if(this.showMaxButton && $(".mini-tools-restore", group.el).length>0 && activeGroup == null){
                mini.OutlookBar.prototype.___restoreGroup.call(this, null, group);
            }
        },
        setShowMaxButton : function(showMaxButton){
            this.showMaxButton = showMaxButton;
            if(this.showMaxButton){
                for (var i = 0, l = this.groups.length; i < l; i++) {
                    var group = this.groups[i];
                    var groupEl = group._el;
                    var headerEl = groupEl.firstChild;
                    if(group.showMaxButton != false){
                        $(".mini-tools", headerEl).append('<span class="'+this._currMaxButton+'"></span>');
                    }
                }
                this.doLayout();;
            }else{
                $(".mini-tools-max, .mini-tools-restore").remove();
            }
        },
        getShowMaxButton : function(){
            return this.showMaxButton;
        }
	});
}
/** ------------------ OutlookTree---------------------------- */
if (mini.OutlookTree) {
    mini.copyTo(mini.OutlookTree.prototype, {
        _currMaxButton  : "mini-tools-max",//当前最大化/还原按钮
        /**
         * 扩展最大化/还原按钮
         */
         __OnClick : function (e) {
            mini.OutlookTree.superclass.__OnClick.call(this, e);
         },
         setShowMaxButton : function(showMaxButton){
            mini.OutlookTree.superclass.setShowMaxButton.call(this, showMaxButton);
         },
         getShowMaxButton : function(){
            return mini.OutlookTree.superclass.getShowMaxButton.call(this);
         },
         collapseGroup: function (group) {
            mini.OutlookTree.superclass.collapseGroup.call(this, group);
        },
         doUpdate : function () {
            mini.OutlookTree.superclass.doUpdate.call(this);
         }
    })
}
/** ------------------ mini._setMap---------------------------- */
if (mini._setMap) {
	mini.mini_setMap = mini._setMap;
	mini._setMap = function(name, value, obj) {
		// 去除value前后空格
		if ($.type(value) == 'string') {
			value = value.trim();
		}
		mini.mini_setMap(name, value, obj);
	}
}
/** ------------------ mini._ValidateVType---------------------------- */
if (mini._ValidateVType) {
	mini.mini_ValidateVType = mini._ValidateVType;
	mini._ValidateVType = function(vtype, value, e, scope) {
		// 去除value前后空格
		if ($.type(value) == 'string') {
			value = value.trim();
		}
		mini.mini_ValidateVType(vtype, value, e, scope);
	}
}
/** ------------------ mini.VTypes---------------------------- */
if (mini.VTypes) {
	mini.copyTo(mini.VTypes, {
		letterNumberErrorText	: "请输入数字或字母",
		letter_NumberErrorText	: "请输入数字、字母、下划线",
		numberErrorText			: "请输入数字",
		noSpaceErrorText		: "不能输入空白字符",
		lengthErrorText			: "请输入{0}个字符",
		zbMcErrorText			: "请输入汉字、数字、字母、下划线或括号",
		/**
		 * 仅允许输入字母和数字
		 */
		letterNumber			: function(v, args) {
			if (mini.isNull(v) || v === "")
				return true;
			var re = new RegExp("^[0-9a-zA-Z]+$");
			return re.test(v);
		},
		/**
		 * 仅允许输入字母、数字、下划线
		 */
		letter_Number			: function(v, args) {
			if (mini.isNull(v) || v === "")
				return true;
			var re = new RegExp("^[0-9a-zA-Z\_]+$");
			return re.test(v);
		},
		/**
		 * 仅允许输入数字
		 */
		number					: function(v, args) {
			if (mini.isNull(v) || v === "")
				return true;
			var re = new RegExp("^(-?\\d+)(\\.\\d+)?$");
			return re.test(v);
		},
		/**
		 * 不允许输入空白字符
		 */
		noSpace					: function(v, args) {
			if (mini.isNull(v) || v === "")
				return true;
			var re = new RegExp("\\s+");
			return !re.test(v);
		},
		/**
		 * 允许的值长度
		 */
		length					: function(v, args) {
			if (mini.isNull(v) || v === "")
				return true;
			var n = parseInt(args);
			if (isNaN(n))
				return true;
			if (v.length == n)
				return true;
			else
				return false;
		},
		/**
		 * 指标名称专用：允许输入汉字、字母、数字、下划线、括号
		 */
		zbMc					: function(v, args) {
			if (mini.isNull(v) || v === "")
				return true;
			var re = new RegExp("^[0-9a-zA-Z_\u4e00-\u9fa5\(\)]+$");
			return re.test(v);
		}

	});
}
if (mini) {
	mini.dataClone = function(data) {
		if ($.type(data) == 'array') {
			data = mini.encode(data);
			return mini.decode(data);
		}
		return $.extend(true, {}, data);
	}
}
if (mini) {
	mini.decode = function(json) {
		if (json === "" || json === null || json === undefined)
			return json;

		return eval('(' + json + ')');
	}
}