# iOS_frida_trace
​在iOS逆向中，使用frida脚本追踪app某个操作执行了哪些方法，快速定位到相关的类和方法，提高逆向效率。

本文所使用的脚本源于网络(原始地址：https://github.com/0xdea/frida-scripts/blob/master/raptor_frida_ios_trace.js)
原脚本的打印信息不够直观醒目，经过修改后得到很大提高。下面以一个简单的项目为例，展示追踪效果。


1、测试环境：
(1)越狱iOS设备，并安装frida插件
(2)MacOS系统，安装frida环境

2、测试过程：
(1)手机通过usb连接电脑
(2)开启终端，输入命令，强制启动app并加载js文件：

frida -U -f cn.hahaha.TestFrida --no-pause -l /Users/xxxxx/fridaTest/frida_trace_ios.js 
