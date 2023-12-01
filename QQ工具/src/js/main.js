importClass(android.content.Intent);
importClass(android.net.Uri)
importClass(android.os.PowerManager)
importPackage(android.widget)
importPackage(android.graphics)

/**
 * 常用JS变量:
 * agentEvent = 代理模式下自动点击模块
 * acEvent= 无障碍模式下自动点击模块
 * device = 设备信息模块
 * file = 文件处理模块
 * http = HTTP网络请求模块
 * shell = shell命令模块
 * thread= 多线程模块
 * image = 图色查找模块
 * utils= 工具类模块
 * global = 全局快捷方式模块
 * 常用java变量：
 *  context : Android的Context对象
 *  javaLoader : java的类加载器对象
 * 导入Java类或者包：
 *  importClass(类名) = 导入java类
 *      例如: importClass(java.io.File) 导入java的 File 类
 *  importPackage(包名) =导入java包名下的所有类
 *      例如: importPackage(java.util) 导入java.util下的类
 *
 */
/**
 * 打开app
 */
function openApp() {
    let num = 0;
    while (!has(pkg("com.tencent.mobileqq"))) {
        num++
        if (num > 10) {
            num = 0
            back()
            sleep(1000)
        }
        logd("打开APP")
        if (has(text("系统设置更新"))) {
            clickText("稍后")
            sleep(1000)
        }
        // 打开app
        utils.openApp("com.tencent.mobileqq");
        logd("等待3秒")
        sleep(3000);
    }
}

/**
 * 打开app
 */
function openAppwx() {
    let num = 0;
    while (!has(pkg("com.tencent.mm"))) {
        num++
        if (num > 10) {
            num = 0
            back()
            sleep(1000)
        }
        logd("打开APP")
        // 打开app
        utils.openApp("com.tencent.mm");
        logd("等待1秒")
        sleep(1000);
    }
}

/**
 * 检测当前页面
 */
function testIngPage() {
    logd("检测页面")
    let isHaveFlow2 = id("com.tencent.mobileqq:id/swk").desc("更多");
    if (has(isHaveFlow2)) {
        back()
        sleep(500)
    }

    let isHaveFlow = text("消息");
    // 首页
    let isHome = text("联系人");

    if (has(text("重新登录"))) {
        logd("检测到重新登录等待2分钟重新登录");
        sleep(1000 * 60 * 2)
        clickText("重新登录")
        sleep(1000)
    }
    if (has(isHaveFlow) && has(isHome)) {
        logd("目前在首页");
        return "首页"
    }

}

function 找到(select, data, num) {
    if (!num) {
        // 默认5次
        num = 5
    }
    for (let i = 0; i < num; i++) {
        if (has(select(data))) {
            logd('找到' + data)
            return true
        }
        logd('找不到:' + data + "间隔0.3秒：" + (i + 1) + "次")
        sleep(300)
    }
    return false
}

function 找到name(qqName, num) {
    if (!num) {
        // 默认5次
        num = 5
    }
    for (let i = 0; i < num; i++) {
        if (id("com.tencent.mobileqq:id/tv_name").text(qqName).getOneNodeInfo(500)) {
            logd('找到' + qqName)
            return true
        }
        logd('找不到:' + qqName + "间隔0.3秒：" + (i + 1) + "次")
        sleep(300)
    }
    return false
}


function 检测消息自动回复() {
    // 找到首页点击消息
    let isWhile = true
    let msgList = []
    while (isWhile) {
        openApp()

        // 检测页面
        let page = testIngPage()
        if (page == "首页") { 
            // 刷新时间
            date = timeFormat("yyyy-MM-dd");
            removeNodeFlag(0);
            let dyhomeMsgNumId = "com.tencent.mobileqq:id/khc"
            // 检测当前消息数量
            let nodeNum = id(dyhomeMsgNumId).getOneNodeInfo(3000)
            if (nodeNum) {
                // logd(JSON.stringify(nodeNum));
                logd("当前存在消息:" + nodeNum.text)
                // 定位到消息
                //回到最上边
                let obj = 找到坐标(id, "com.tencent.mobileqq:id/nt4")
                if (obj.x) {
                    doubleClickPoint(obj.x, obj.y)
                    sleep(100)
                }else{
                    continue
                }
                // 双击下面的消息红点
                let dataXXy=找到坐标2(nodeNum.parent())
                clickPoint(dataXXy.x,dataXXy.y)
                sleep(50)
                logd("定位到消息")
                sleep(500)
                // 抓取群新消息
                let dyListMsgUnId = "com.tencent.mobileqq:id/ym8"
                // 找到未读信息
                let state = 找到(id, dyListMsgUnId)
                if (!state) {
                   clickPoint(dataXXy.x,dataXXy.y)
                    sleep(500)
                    continue
                }
                logd("打开聊天框")
                // 打开聊天框
                let node = id(dyListMsgUnId).getOneNodeInfo(1000)
                if (node) {
                    if (!node.text) {
                        continue
                    }
                    let nodep = node.parent()
                    if (nodep) {
                        nodep.click()
                    }
                }
                let isHaveFlow2 = id("com.tencent.mobileqq:id/swk").desc("更多");
                if (has(isHaveFlow2)) {
                    back()
                    sleep(500)
                    continue
                }

                sleep(500)
                // 判断是否进入群聊
                if(!找到(id,"com.tencent.mobileqq:id/wa1")){
                    continue;
                }
                logd("判断当前是否存在关键字")
                // 判断当前是否存在关键字
                let sendState=false
                let qunName;
                let msg;
                let node2 = id("com.tencent.mobileqq:id/xqu").getOneNodeInfo(3000)
                if (node2) {
                    let objdata=node2
                    qunName=objdata.text
                    logd("群名称:" + objdata.text)
                    let qqName = readConfigString("qqName");
                    if(objdata.text==qqName){
                        continue
                    }
                    msg = "群名称:" + objdata.text
                }
                for (let i = 0; i < keywords.length; i++) {
                    let keyword = '.*' + keywords[i] + '.*'
                    let data =
                        textMatch(keyword).checked(false)
                            .id("com.tencent.mobileqq:id/jnr")
                            .clz("android.widget.TextView");
                    if (has(data)) {
                        logd("找到关键字:" + keyword);
                        // 发送关键字给微信号并且记录名称
                        let nodekeyword = textMatch(keyword).getOneNodeInfo(3000)
                        if (!nodekeyword) {
                            continue;
                        }
                        if (nodekeyword) {
                            logd("匹配消息:" + nodekeyword.text)
                            msg =msg + "----关键字消息:" + nodekeyword.text;
                            try {
                                let x = nodekeyword.parent().parent().parent().previousSiblings()[0];
                                let nameText = x.child(0).child(1)
                                if (nameText) {
                                    logd("用户名称:" + nameText.text)
                                    msg = msg + "----用户名称:" + nameText.text
                                } else {
                                    nameText = x.child(0).child(0)
                                    msg = msg + "----用户名称:" + nameText.text
                                }
                            } catch (e) {
                                logd("用户名称:获取用户名出错")
                                msg = msg + "----用户名称:获取用户名出错"
                            }
                            logd(msg)

                        }
                        // 验证是否保存过
                        if (msgList.indexOf(msg) !== -1) {
                            logd("已存在:" + msgList)
                            continue;
                        }
                        msgList.push(msg)
                        发送信息(msg)
                        sendState=true
                        break;
                    }
                }
                // 没有合格信息的时候签到
                // 判断今日是否签到群
                let qundata=date+qunName
                if(!sendState){
                    // 没有关键字判断是否签到
                    // 二 : 随机签到
                    let function2 = readConfigString("function2")
                    if (function2 == "true") {
                        // 每日签到一次
                        if (qunList.indexOf(qundata) == -1) {
                            if(群签到()){
                                returnId("com.tencent.mobileqq:id/wa1")
                            }
                            qunList.push(qundata)
                        }else{
                            logd(qundata+"已签到")
                        }
                    }
                    // 三 : 群修改名片
                    let function3 = readConfigString("function3")
                    if (function3 == "true") {
                        群修改名片()
                    }
                }

            } else {
                logd("没有消息暂停2秒:")
                clickText("消息")
                sleep(2000)
                continue;
            }

        } else {
            back()
            sleep(1000)
        }
    }

}
let qunList=[]
let date = timeFormat("yyyy-MM-dd");
function returnId(idData) {
    let num = 0
    while (!has(id(idData))) {
        if (num++ >= 2) {
            break
        }
        back()
        sleep(1000)
    }
}

function 找到坐标(type, data) {
    var selectors = type(data).getOneNodeInfo(10000);
    if (selectors) {
        sleep(1000);
        var result = selectors.bounds;
        let centerX = result.left + (result.right - result.left) / 2+ (result.right - result.left) * 0.2;
        let centerY = result.top + (result.bottom - result.top) / 2;
        logd(JSON.stringify({x: centerX, y: centerY}));
        return {x: centerX || 0, y: centerY || 0};
    } else {
        return {x: false, y: false};
    }
}
function 找到坐标2( data) {
    var selectors = data;
    if (selectors) {
        sleep(1000);
        var result = selectors.bounds;
        let centerX = result.left + (result.right - result.left) / 2;
        let centerY = result.top + (result.bottom - result.top) / 2;
        logd(JSON.stringify({x: centerX, y: centerY}));
        return {x: centerX || 0, y: centerY || 0};
    } else {
        return {x: false, y: false};
    }
}

function 发送信息(msg) {
    let isWhile = true
    while (isWhile) {
        openApp()
        // 关闭弹窗
        if (has(id("com.tencent.mobileqq:id/az7"))) {
            click(id("com.tencent.mobileqq:id/az7"))
        }
        // 检测页面
        let page = testIngPage()
        if (page == "首页") {
            // 找到(text,"搜索")
            let obj = 找到坐标(id, "com.tencent.mobileqq:id/nt4")
            if (obj.x) {
                doubleClickPoint(obj.x, obj.y)
                sleep(100)
            }else{
                continue
            }
            sleep(1000)
            // 点击搜索
            click(id("com.tencent.mobileqq:id/vr_"))
            sleep(1000)
            let qqName = readConfigString("qqName");
            // 用历史记录
            找到name(qqName, 10)
            clickText(qqName)
            sleep(1000)
            找到(clz, "android.widget.EditText")
            // 发送信息
            var selectors = clz("android.widget.EditText");
            if (selectors) {
                var result = inputText(selectors, msg);
                if (result) {
                    logd("输入成功");
                }
                sleep(300)
                click(text("发送"))
                sleep(300)
                isWhile = false
                break
            }
        } else {
            back()
            sleep(1000)
        }
    }

}

function main() {

    //如果自动化服务正常
    if (!autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }
    // 监测音量上键停止脚本
    thread.execAsync(function () {
        //监听无障碍节点事件
        observeEvent("key-down", function (key, data) {
            // 检查是否点击音量上
            const event = JSON.parse(data);
            if (event.keyCode === 24) {
                logd("结束运行");
                exit();
            }
        });
        while (true) {
            sleep(1000);
        }
    });
    // 申请权限
    initAuto()
    logd("开始执行脚本...")
    let function1 = readConfigString("function1")
    if (function1 == "true") {
        检测消息自动回复()
    }


}

function switchLivec() {
    let width = device.getScreenWidth();
    let height = device.getScreenHeight();
    toast("模拟手指随机上滑")
    var touch1 = MultiPoint
        .get()
        .action(0).x(width * 0.8).y(height * 0.65).pointer(1).delay(150)
        .next()
        .action(0).x(width * 0.5).y(height * 0.65).pointer(1).delay(150)
        .next()
        .action(0).x(width * 0.3).y(height * 0.65).pointer(1).delay(150)
        .next()
        .action(0).x(width * 0.1).y(height * 0.7).pointer(1).delay(150)

    var x = multiTouch(touch1, null, null, 500);
    sleep(500)
}

function 群签到() {
    if(!找到(desc, "加号")){
        return false
    }
    click(desc("加号"))
    sleep(500)
    找到(text, "图片")
    if(!找到(text, "打卡",1)){
        switchLivec()
        sleep(500)
    }
    找到(text, "打卡")
    clickText("打卡")
    sleep(500)
    找到(text, "立即打卡")
    clickText("立即打卡")
    sleep(500)
    return true
}

function 群修改名片() {
    click(id("com.tencent.mobileqq:id/wa1"))
    sleep(500)
    找到(text, "我的本群昵称")
    if(!找到(text, "我的本群昵称")){
        return false
    }
    let newName = readConfigString("newName");
    let state = 找到(text, newName)
    if (state) {
        return true
    }
    clickText("我的本群昵称")
    找到(clz,"android.widget.EditText")
    var selectors = clz("android.widget.EditText");
    if (selectors) {
        var result = inputText(selectors, newName);
        if (result) {
            logd("输入成功");
        }
        sleep(300)
        click(id("com.tencent.mobileqq:id/r4f"))
        sleep(300)
    }
}

/**
 * 申请权限
 */
function initAuto() {
    // 启停控制位置
    requestFloatViewPermission(1000);
    // 日志
    showLogWindow();
    showCtrlWindow();
    // 保持屏幕常亮
    device.keepScreenOn();
    // 开启后台运行
    device.keepAwake(PowerManager.SCREEN_DIM_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP);
    // 停止回调
    setStopCallback(function () {
        closeLogWindow();
        device.vibrate(5000);
        sleep(5000)
        device.cancelKeepingAwake();
        // 关闭自动化
        // closeEnv(false);
    });
}

function autoServiceStart(time) {
    for (var i = 0; i < time; i++) {
        if (isServiceOk()) {
            return true;
        }
        var started = startEnv();
        logd("第" + (i + 1) + "次启动服务结果: " + started);
        if (isServiceOk()) {
            return true;
        }
    }
    return isServiceOk();
}

function test() {
    let sendState=false
    let msgList=[]
    let qunName;
    let msg;
    let node2 = id("com.tencent.mobileqq:id/xqu").getOneNodeInfo(3000)
    if (node2) {
        let objdata=node2
        qunName=objdata.text
        logd("群名称:" + objdata.text)
        let qqName = readConfigString("qqName");
        if(objdata.text==qqName){
            // continue
        }
        msg = "群名称:" + objdata.text
    }

    exit()
}

/**
 * 关键字匹配
 * @type {string[]}
 */
let textarea2 = readConfigString("textarea2");
// 转换数组
let keywords = textarea2.split(/[(\r\n)\r\n]+/);
keywords.forEach((item, index) => {
    if (!item) {
        keywords.splice(index, 1); //删除空项
    }
});

// test()
try {
    setExceptionCallback(function (msg) {
        logd(" 异常停止消息: " + msg);
    });
    var s = setSaveLogEx(
        true,
        "/sdcard/脚本文件/脚本日志/",
        1024 * 1024,
        timeFormat("yyyy-MM-dd HH:mm:ss") + "log"
    );
    main();
} catch (e) {
    logd(e);
    let errfilepath = "/sdcard/脚本文件/脚本日志/err.txt"
    var data = new Date() + ":" + e;
    if (!file.exists(errfilepath)) {
        file.create(errfilepath);
    }
    file.appendLine(data, errfilepath);
}
