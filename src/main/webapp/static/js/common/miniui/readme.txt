版本日期：2013-07-17
miniUI升级（潘正锋）：
修改内容
1、datagrid组件：修改列分组合并的规则，将原来“后面列的合并依据是前面列”修改为“后面列的合并依据为前面合并过的列”。
2、treeselect组件：解决getCheckedNodes取值不准确：通过setValue或者默认value配置等方式赋值时，无法获取到正确的结果的问题。
3、win.open组件：由于各个项目组对于url的处理五花八门，对open进行了增强，现在支持所有url方式,并按照webfaster的特点，做了定制。
4、radiobuttonlist，checkboxlist组件：当点击（非文字）时，无法正常显示选中效果。
5、treegrid组件：将拖拽范围缩小到配置treecolumn的那一列。
平台升级（赵美丹）:
1、解决spinner的按钮显示不全问题
2、去除平台多余的汉化配置（公司级SUI中已有）
------------------------------------------------------------------------------------------

版本日期：2013-07-12
miniUI升级（潘正锋）：
修改内容：

1、window组件：修复在ie6下，遮罩层无法随着窗口扩大而扩大的问题。
2、tree,treegrid组件：修复在调用filter后文件夹图标不正确，以及filter后无法拖拽的问题。
3、window组件：修复window窗口可以无限向下拖动的问题。
4、mini.open:为了解决江苏项目弹出窗口的问题，open方法增加配置参数currentWindow，默认为false,当为true时，窗口会在当前页面打开，默认会在外层页面打开,用方法为：
   mini.open({
            url: "http://www.baidu.com",  注意，如果未全路径的话，一定要包含http:
            currentWindow: true,
            title: "window", width: 600, height: 360,
            onload: function () {
               
            },
            ondestroy: function (action) {

               
            }
           });

功能扩展
1、tree组件：增加isRoot(node)的方法,参数为节点，里的根节点表示虚拟跟节点（真正的根节点）。

平台升级（赵美丹）:
1、解决IE6下datagrid仅2列，且一列为图片时，点击排序时列头变窄的问题
------------------------------------------------------------------------------------------

版本日期：2013-07-08
miniUI升级（潘正锋）：
1、页面遮罩层：修改在页面内容非常多，存在纵向滚动条时，mini.mask（）无法将整个页面遮住，可视区域以外的区域未遮罩的问题。
2、DataGrid：修改行编辑的情况下，若手动切换某个combobox的值，监听其valuechanged，在处理函数中调用commitEditRow，SUI报错的问题。
3、treeselect组件：解决getSelectedNode取值不准确：通过setValue或者默认value配置等方式赋值时，无法获取到正确的结果的问题。
4、dataGrid组件：修复在ie下，DataGrid中无数据时会出现半条黑线的问题。
5、combobox：修复当刚进入页面就执行select方法后，下拉列表中的选中项没有被选中的问题。
6、tree,treegrid：解决节点拖动过程中，点击右键，浮动信息不消失的问题。
7、validate:解决vtype=float校验不够准确的问题，。
8、treegrid：解决拖动节点到页面右边框后，提示框中文字换行的问题。
9、tree,treegird:解决节点为第一个并且有父节点时，没有上连接线的问题。
10、treegird：拖动非叶子节点下的节点，且该非叶子节点下只有一个子节点，子节点被拖走后，遗留下children属性，导致会生成一个空    行（ie8兼容模式下）。
11、修复combobox,treeselect,datepicker组件beforeshowpopup事件触发2遍的问题。
12、datagrid组件，将onload事件移到渲染完全完成后触发，以免在布局未完成前调用其他组件的布局后出错,同时将之前所加的layoutload事件删除掉。
13、buttonedit,combobox,treeselect,lookup组件，当emptyText不为空时，鼠标移动到按钮上方，形态不正确。
14、datagrid组件，没有数据，而且有滚动条时，滚动条只剩下1像素。


功能扩展：

1、增加mini.removeChildUI（el,delAll）方法，来删除指定dom元素内的所有miniUI组件，el为dom对象或者dom的id属性，delAll表示：在删除组件的同时是否删除其他dom，默认为false。

平台升级（赵美丹）：
1、修改联动代码，解决多级联动时url参数不准确的问题（当数据刚好有重叠时，显示异常）
2、ComboBox组件：解决有默认值时，进入修改页面赋值异常问题
3、ComboBox组件：解决DataGrid行编辑时，手动切换combobox的值，监听其valuechanged，在处理函数中调用commitEditRow，SUI报错的问题
------------------------------------------------------------------------------------------


版本日期2013-06-25

miniUI升级（潘正锋）：
修改问题：
1、tree,treegrid组件拖拽时，只会显示“Node1”,修改为提示层显示内容改为被拖拽的节点名称。
2、tree组件，解决ondragstart无效的问题,并修改ondragstart触发的时机，将原先点击节点就触发改为拖动时再触发。
3、tree组件，修改beforedrop中设置e.cancel = true后任然会触发drop事件的问题。
4、tree组件，修复当拖拽鼠标超出本页面后，再回来继续拖节点，第一次的提示框会任然存在，这样多次拖动后会有多个提示框存在。
5、tree组件，修复当拖动鼠标，选中树上的多个节点文字，然后拖动鼠标（不要拖动节点），页面报错（e.dragNode为空）的错误。
6、window组件，修复window最大化之后，关闭，再打前调用setWidth无效的问题。
7、tooltip组件，解决因为文本太大而造成显示速度慢的问题，解决当文本大时会导致页面出现滚动条的问题。
8、button组件， 按钮的可用状态和不可用状态颜色区分不是很抢眼，所以修改不可用按钮的颜色变浅。
功能扩展：
1、tree组件，在drop事件和beforeDrop事件中增加参数dropParentNode，表示拖拽后，被拖拽节点的新父节点，结构如下
    {
        sender: Object,         //树对象
        dragNode: Object,         //拖拽的节点
        dropNode: Object,         //目标投放节点
        dragAction: String，        //投放方式：add/after/before
        dropParentNode，新增属性，表示拖拽后，被拖拽节点的新父节点
     }

2、datagrid组件，当有多列合并单元格时，每列只是把相同的值的单元格合并，无法做到后面的合并列在前面列的基础上进行合并，增加了dependMerge = false配置，默认为false,表示不关联合并，当配置为true后，多列的合并会建立关联。
平台升级（赵美丹）：
1.将icons下的自定义图标由icons.css修改至blue下

------------------------------------------------------------------------------------------
版本日期2013-06-20

平台升级（赵美丹）：
1.打开debug模式
2.解决combobox联动时无法正常赋值的问题（修改页面）
3.解决2级以上的联动无法正常赋值的问题（修改页面）
------------------------------------------------------------------------------------------

版本日期 2013-06-20


miniUI升级（潘正锋）：
1、buttonEdit及子类，包括treeSelect,combobox,TimeSpinner,PopupEdit等输入框后面带选择按钮的控件，增加showToolTip=true配置项，来配置当内容超出时是否显示提示层，默认为显示。
2、修复tooltip组件只在能ie下工作的问题，新增对火狐的支持。
3、修复datagrid中数据位空时，在页面重新布局后，会出现空行的问题。
4、修复combobox,treeselect,lookup组件定义width=100%的情况下无法对齐。(注：该问题仍遗留一个缺陷，当组件的所有上级都没有border的情况下IE8中仍存在对不齐的情况，已提交技术规划部)
5、修复listbox在IE6，IE7、IE8兼容模式下重新布局后出现横向滚动条的问题
平台升级（赵美丹）：
1.ButtonEdit扩展showToolTip，默认为true,去除WdatePicker的showTip配置，改为统一使用showToolTip
2.调整plugin.css中项目自定义组件的css至blue/skin.css中
3.调整miniui.css、plugin.css、icons.css的编码为utf-8
4.解决combobox联动时被动combobox无法自动清空value的问题（唐文林）
5.解决combobox联动时无法使用url2的问题（唐文林）
6.解决联动时当主动值为空时不会自动清空被动的data和value（唐文林）
------------------------------------------------------------------------------------------

版本号：1.6.000
发布日期：2014-06-06
----------------------------------------------------------------------------------
MiniUI

修改内容：
1、buttonedit：当输入框失去焦点后，required=true校验也没激活。
2、buttonedit：当编辑框在表格使用时，当值较长时，弹出的tip框位置和大小不正确。
3、datagrid:单元格编辑时，editor为combobox时，若同一列的不同单元格editor的data不一致，则非默认data的editor选中值后，失去焦点，此时单元格值显示为空，原因是它始终取得是默认的那个data。
4、mini.prompt:输入框改为miniui的风格，这样可以使所有输入框的风格统一。
新增功能：
1、datagrid：新增pagechanged事件，在翻页时触发。
-------------------------------------------------------------------------------------
版本号：1.6.001
发布日期：2014-06-25
----------------------------------------------------------------------------------
MiniUI

修改内容：
1、buttonedit：当输入框失去焦点后，required=true校验也没激活。
2、buttonedit：当编辑框在表格使用时，当值较长时，弹出的tip框位置和大小不正确。
3、datagrid:单元格编辑时，editor为combobox时，若同一列的不同单元格editor的data不一致，则非默认data的editor选中值后，失去焦点，此时单元格值显示为空，原因是它始终取得是默认的那个data。
4、mini.prompt:输入框改为miniui的风格，这样可以使所有输入框的风格统一。
5、Form组件：getData(format,deep,all);增加all参数，默认为false,为true时会取得html原始的<input type=hidden的值。
6、treeselect:修复在c#中关闭页面时报js错误（对象为空）。
7、datapicker:修复在c#中日期选择后，关闭选择框是js报错（对象为空）。
8、combobox：支持根据valueField匹配。
9、fileupload:修复因为第一次上次文件大小错误后，导致后续的上传失败。
10、treeselect:在自定义showQueryToolBar后，再配置showQueryToolBar不起作用。
11、treeselect:增加drawnode事件。
12、fileupload:解决setPostParam后，后台无法获取参数的问题。
13、textbox:初始化value时，不触发valuechanged事件。
14、treeselect：在allowInput=true时，选择查询出来的结果，无法选择（选择后为空）。
15、treeselect：解决在配置中data="obj",无效的问题。
16、combobox：假如data是后面set的，而且valueFromSelect=true时，设置value后，text永远是空。
17、tree:当节点折叠时，调用节点的disable方法，将折叠下的子节点disable后，然后展开，这些节点将无法变为enable。
18、fileupload:增加usequerystring配置，改配置可以addPostParam的参数是放在url中还是打包在上传文件中，默认为false。
19、mini.messageBox:增加判断，消除在回调函数中关闭页面后，对象不存在的问题。


新增功能：
1、datagrid：新增pagechanged事件，在翻页时触发。
2、datagrid：新增beforeselect,beforedeselect事件。
3、datagrid：在原有的select，deselect ，selectAll ，deselectAll ，clearSelect ，selects ，deselects方法中增加fireEvent(boolean)参数，来控制是否触发event。
   上面2和3的新功能的作用在http://192.168.60.102:8080/sui//demo-api/demo/datagrid/multiselect-professional.html中有充分的体现。



-------------------------------------------------------------------------------------
Store

修改内容：
无

新增功能：
无




