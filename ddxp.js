/*
app叮咚买菜
ck获取：打开app,翻翻乐玩一次,领取即可
每个脚本需要单独抓包,有冲突
[MITM]
hostname = farm.api.ddxq.mobi
[task_local]
10 0 8 * * * https://raw.githubusercontent.com/justplayscript/ddxp/main/ddxp.js, tag=叮咚买菜签到, enabled=true
[rewrite_local] 
https://farm.api.ddxq.mobi/api/v2/task/achieve url script-request-header https://raw.githubusercontent.com/justplayscript/ddxp/main/ddxp.js
*/

const $ = new Env('叮咚整合签到');
const dr = "@"
let ddxpurlArr = [],
    ddxphdArr = [],
    ddxpcount = ''
let time = Math.round(Date.now() / 1000)
let ddxpurl = $.getdata('ddxpurl')
let ddxphd = $.getdata('ddxphd')
let fflNum = +($.getval('ddxpffl') || "10")
!(async () => {
    if (typeof $request !== "undefined") {
        await ddxpck()
    } else {
        ddxpurlArr = ($.getdata('ddxpurl') || "").split(dr)
        ddxphdArr = ($.getdata('ddxphd') || "").split(dr)

        console.log(`------------- 共${ddxphdArr.length}个账号-------------\n`)
        for (let i = 0; i < ddxphdArr.length; i++) {
            if (ddxphdArr[i]) {
                getUrl(ddxpurlArr[i])
                ddxphd = ddxphdArr[i];

                $.index = i + 1;
                console.log(`\n开始【叮咚浇水${$.index}】`)
                await $.wait(10000);
                await ddxpyt1();
                await $.wait(10000);
                await ddxpyt2();
                await $.wait(10000);
                for (let j = 0; j < fflNum; j++) {
                    await ddxffl();
                    await $.wait(10000);
                }
                await $.wait(50000);
                await ddxlook();
                await $.wait(50000);
                await ddxlook2();
                await $.wait(10000);
                await ddxTaskLog();
                await $.wait(10000);
                await ddxlookend();
                await $.wait(10000);
                await ddxlookend2();
                await $.wait(10000);
                await ddxpgettask();
                await $.wait(10000);
                await ddxgyqd1();
                await $.wait(10000);
                await ddxgyqd2();
                await $.wait(50000);
                await ddxgylook();
                await $.wait(10000);
                await ddxgylookend();
                await ddxTaskLog();
                await $.wait(10000);
                await dousertasklog()
            }
        }
    }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

//抓包ck
function ddxpck() {
    if ($request.url.indexOf("task/achieve?") > -1) {
        if ($request.url.indexOf("&uid=") > -1) {
            const ddxpurl = $request.url
            if (ddxpurl) {
                let v = $.getdata(`ddxpurl`) || ""
                if (v == "")
                    v = ddxpurl
                else
                    v += dr + ddxpurl
                $.setdata(v, `ddxpurl`)
            }
            $.log(ddxpurl)
            const ddxphd = $request.headers.cookie
            if (ddxphd) {
                let v = $.getdata(`ddxphd`) || ""
                if (v == "")
                    v = ddxphd
                else
                    v += dr + ddxphd
                $.setdata(v, `ddxphd`)
            }
            $.log(ddxphd)
            $.msg($.name, "", `叮咚ck获取成功`)
        }
    }
}

/**
 * 共用header
 */
function pubHeader() {
    return {
        'accept': '*/*',
        'cookie': ddxphd,
        'accept-language': 'zh-cn',
        'user-agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 xzone/9.35.1 station_id/${station_id}`,
        'accept-encoding': 'gzip, deflate, br'
    }
}

uid = ""
latitude = ""
longitude = ""
station_id = ""
userTaskLogId = ""
userTasks = []

function getUrl(ddxpurl) {
    let url = ddxpurl.split("?")
    let ddxpurls = url[url.length - 1].split("&")
    let sendInfo = {}
    for (const val of ddxpurls) {
        let vals = val.split("&")
        for (const val1 of vals) {
            let kv = val1.split("=")
            sendInfo[kv[0]] = kv[1]
        }
    }
    uid = sendInfo["uid"]
    latitude = sendInfo["latitude"]
    longitude = sendInfo["longitude"]
    station_id = sendInfo["station_id"]
}

//鱼塘签到1
function ddxpyt1(timeout = 0) {
    return new Promise((resolve) => {
        let header = pubHeader()
        header["origin"] = "https://game.m.ddxq.mobi"
        header["referer"] = "https://game.m.ddxq.mobi/index.html"
        let url = {
            url: `https://farm.api.ddxq.mobi/api/v2/task/achieve?api_version=9.1.0&app_client_id=1&station_id=${station_id}&native_version=&app_version=9.35.1&uid=${uid}&latitude=${latitude}&longitude=${longitude}&gameId=1&taskCode=CONTINUOUS_SIGN`,
            headers: header,
        }

        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log('\n鱼塘签到1: ' + result.msg)
                } else {
                    console.log(result)
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

//鱼塘签到2
function ddxpyt2(timeout = 0) {
    return new Promise((resolve) => {
        let header = pubHeader()
        header["origin"] = "https://game.m.ddxq.mobi"
        header["referer"] = "https://game.m.ddxq.mobi/index.html"
        let url = {
            url: `https://farm.api.ddxq.mobi/api/v2/task/achieve?api_version=9.1.0&app_client_id=1&station_id=${station_id}&native_version=&app_version=9.35.1&uid=${uid}&latitude=${latitude}&longitude=${longitude}&gameId=1&taskCode=DAILY_SIGN`,
            headers: header,
        }

        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log('\n鱼塘签到2: ' + result.msg)
                } else {
                    console.log(result)
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

//鱼塘翻牌
function ddxffl(timeout = 0) {
    return new Promise((resolve) => {
        let header = pubHeader()
        header["origin"] = "https://activity.m.ddxq.mobi"
        header["Connection"] = "keep-alive"
        header["referer"] = 'https://activity.m.ddxq.mobi/'
        header["DDMC-GAME-TID"] = '1'
        let url = {
            url: `https://farm.api.ddxq.mobi/api/v2/lucky-draw-activity/draw?api_version=9.7.3&app_version=1.0.0&app_client_id=3&station_id=${station_id}&native_version=9.35.1&city_number=1103&latitude=${latitude}&longitude=${longitude}&gameId=1`,
            headers: header,
        }

        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log('\n鱼塘翻牌: ' + result.data.chosen.rewardText)
                } else {
                    console.log(result)
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

//获取所有TaskLog
function ddxTaskLog(timeout = 0) {
    userTaskLogId = ""
    return new Promise((resolve) => {
        let header = pubHeader()
        header["origin"] = "https://game.m.ddxq.mobi"
        header["referer"] = "https://game.m.ddxq.mobi/index.html"
        let url = {
            url: `https://farm.api.ddxq.mobi/api/v2/task/list?api_version=9.1.0&app_client_id=1&station_id=${station_id}&native_version=&app_version=9.35.1&uid=${uid}&latitude=${latitude}&longitude=${longitude}&gameId=1&cityCode=1103`,
            headers: header,
        }

        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log('\n鱼塘任务列表: ' + result.msg)
                    userTasks = result.data.userTasks
                } else {
                    console.log(result)
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}



//处理userTASKLOG的鱼食
async function dousertasklog(timeout = 0) {
    userTaskLogId = ""
    if (userTasks != null) {
        for (const task of userTasks) {
            //翻牌
            if (task.userTaskLogId != null && task.buttonStatus != 'FINISHED') {
                await $.wait(10000);
                userTaskLogId = task.userTaskLogId
                new Promise((resolve) => {
                    let header = pubHeader()
                    header["origin"] = "https://game.m.ddxq.mobi"
                    header["referer"] = "https://game.m.ddxq.mobi/index.html"
                    let url = {
                        url: `https://farm.api.ddxq.mobi/api/v2/task/reward?api_version=9.1.0&app_client_id=1&station_id=${station_id}&native_version=&app_version=9.35.1&uid=${uid}&latitude=${latitude}&longitude=${longitude}&gameId=1&userTaskLogId=${userTaskLogId}`,
                        headers: header,
                    }

                    $.get(url, async (err, resp, data) => {
                        try {
                            const result = JSON.parse(data)
                            if (result.code == 0) {
                                console.log('\n'+task.taskName+': ' + result.msg)
                            } else {
                                console.log(result)
                            }
                        } catch (e) {
                            //$.logErr(e, resp);
                        } finally {
                            resolve()
                        }
                    }, timeout)
                })
            }
        }
    }
}

//鱼塘观看商品
function ddxlook(timeout = 0) {
    userTaskLogId = ""
    return new Promise((resolve) => {
        let header = pubHeader()
        header["origin"] = "https://cms.api.ddxq.mobi"
        header["ddmc-game-tid"] = "1"
        header["referer"] = `https://cms.api.ddxq.mobi/cms-service/client/page/v1/getPageInfo?uuid=${uid}&themeColor=72b1ff&hideShare=true&gameTask=BROWSE_GOODS&s=mine_farm_new&native_city_number=1103`
        let url = {
            url: `https://farm.api.ddxq.mobi/api/v2/task/achieve?latitude=${latitude}&longitude=${longitude}&env=PE&station_id=${station_id}&city_number=1103&api_version=9.28.0&app_client_id=3&native_version=9.35.1&h5_source=&page_type=2&gameId=1&taskCode=BROWSE_GOODS`,
            headers: header,
        }

        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log('\n鱼塘浏览30秒: ' + result.msg)
                    if (result.data) userTaskLogId = result.data.userTaskLogId
                    console.log('\nuserTaskLogId: ' + userTaskLogId)
                } else {
                    console.log(result)
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

//鱼塘观看商品领取
function ddxlookend(timeout = 0) {
    userTaskLogId = ""
    if (userTasks != null) {
        for (const task of userTasks) {
            if (task.taskCode == "BROWSE_GOODS") {
                userTaskLogId = task.userTaskLogId
            }
        }
    }
    return new Promise((resolve) => {
        let header = pubHeader()
        header["origin"] = "https://cms.api.ddxq.mobi"
        header["ddmc-game-tid"] = "1"
        header["referer"] = `https://cms.api.ddxq.mobi/cms-service/client/page/v1/getPageInfo?uuid=${uid}&themeColor=72b1ff&hideShare=true&gameTask=BROWSE_GOODS&s=mine_farm_new&native_city_number=1103`
        let url = {
            url: `https://farm.api.ddxq.mobi/api/v2/task/reward?api_version=9.1.0&app_client_id=1&station_id=${station_id}&native_version=&app_version=9.35.1&uid=${uid}&latitude=${latitude}&longitude=${longitude}&gameId=1&userTaskLogId=${userTaskLogId}`,
            headers: header,
        }

        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log('\n鱼塘浏览30秒: ' + result.msg)
                } else {
                    console.log(result)
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

//鱼塘观看商品
function ddxlook2(timeout = 0) {
    userTaskLogId = ""
    return new Promise((resolve) => {
        let header = pubHeader()
        header["origin"] = "https://cms.api.ddxq.mobi"
        header["ddmc-game-tid"] = "1"
        header["referer"] = `https://cms.api.ddxq.mobi/cms-service/client/page/v1/getPageInfo?uuid=${uid}&themeColor=72b1ff&hideShare=true&gameTask=BROWSE_GOODS2S&s=mine_farm_new&native_city_number=1103`
        let url = {
            url: `https://farm.api.ddxq.mobi/api/v2/task/achieve?latitude=${latitude}&longitude=${longitude}&env=PE&station_id=${station_id}&city_number=1103&api_version=9.28.0&app_client_id=3&native_version=9.35.1&h5_source=&page_type=2&gameId=1&taskCode=BROWSE_GOODS2`,
            headers: header,
        }

        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log('\n鱼塘浏览30秒: ' + result.msg)
                    if (result.data) userTaskLogId = result.data.userTaskLogId
                    console.log('\nuserTaskLogId: ' + userTaskLogId)
                } else {
                    console.log(result)
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

//鱼塘观看商品领取
function ddxlookend2(timeout = 0) {
    userTaskLogId = ""
    if (userTasks != null) {
        for (const task of userTasks) {
            if (task.taskCode == "BROWSE_GOODS2") {
                userTaskLogId = task.userTaskLogId
            }
        }
    }
    return new Promise((resolve) => {
        let header = pubHeader()
        header["origin"] = "https://game.m.ddxq.mobi"
        header["ddmc-game-tid"] = "1"
        header["referer"] = `https://game.m.ddxq.mobi/index.html`
        let url = {
            url: `https://farm.api.ddxq.mobi/api/v2/task/reward?api_version=9.1.0&app_client_id=1&station_id=${station_id}&native_version=&app_version=9.35.3&uid=${uid}&latitude=${latitude}&longitude=${longitude}&gameId=1&userTaskLogId=${userTaskLogId}`,
            headers: header,
        }

        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log('\n鱼塘浏览拼团活动得饲料: ' + result.msg)
                } else {
                    console.log(result)
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

//领取鱼塘下单任务
function ddxpgettask(timeout = 0) {
    return new Promise((resolve) => {
        let header = pubHeader()
        header["origin"] = "https://game.m.ddxq.mobi"
        header["referer"] = `https://game.m.ddxq.mobi/index.html`
        let url = {
            url: `https://farm.api.ddxq.mobi/api/v2/task/receive?api_version=9.1.0&app_client_id=1&station_id=${station_id}&native_version=&app_version=9.37.0&uid=${uid}&latitude=${latitude}&longitude=${longitude}&gameId=1&taskCode=ANY_ORDER`,
            headers: header,
        }

        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log('\n领取下单任务: ' + result.msg)
                } else {
                    console.log(result)
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

//果园签到1
function ddxgyqd1(timeout = 0) {
    return new Promise((resolve) => {
        let header = pubHeader()
        header["host"] = "farm.api.ddxq.mobi"
        header["origin"] = "https://orchard-m.ddxq.mobi"
        header["connection"] = "keep-alive"
        header["ddmc-game-tid"] = "2"
        header["referer"] = "https://orchard-m.ddxq.mobi/?is_nav_hide=true&isResetAudio=true&s=mine_orchard"
        let url = {
            url: `https://farm.api.ddxq.mobi/api/v2/task/achieve?api_version=9.1.0&app_client_id=1&station_id=${station_id}&native_version=&uid=${uid}&latitude=${latitude}&longitude=${longitude}&taskCode=CONTINUOUS_SIGN`,
            headers: header,
        }

        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log('\n果园签到1: ' + result.msg)
                } else {
                    console.log(result)
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

//果园签到2
function ddxgyqd2(timeout = 0) {
    return new Promise((resolve) => {
        let header = pubHeader()
        header["host"] = "farm.api.ddxq.mobi"
        header["origin"] = "https://orchard-m.ddxq.mobi"
        header["connection"] = "keep-alive"
        header["DDMC-GAME-TID"] = "2"
        header["referer"] = "https://orchard-m.ddxq.mobi/?is_nav_hide=true&isResetAudio=true&s=mine_orchard"
        let url = {
            url: `https://farm.api.ddxq.mobi/api/v2/task/achieve?api_version=9.1.0&app_client_id=1&station_id=${station_id}&native_version=&uid=${uid}&latitude=${latitude}&longitude=${longitude}&taskCode=DAILY_SIGN`,
            headers: header,
        }

        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log('\n果园签到2: ' + result.msg)
                } else {
                    console.log(result)
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

//果园观看商品
function ddxgylook(timeout = 0) {
    userTaskLogId = ""
    return new Promise((resolve) => {
        let header = pubHeader()
        header["host"] = "farm.api.ddxq.mobi"
        header["origin"] = "https://cms.api.ddxq.mobi"
        header["DDMC-GAME-TID"] = "2"
        header["referer"] = `https://cms.api.ddxq.mobi/cms-service/client/page/v1/getPageInfo?uuid=${uid}&themeColor=e7fbd6&hideShare=true&gameTask=BROWSE_GOODS&s=mine_orchard&native_city_number=1103`
        let url = {
            url: `https://farm.api.ddxq.mobi/api/v2/task/achieve?latitude=${latitude}&longitude=${longitude}&env=PE&station_id=${station_id}&city_number=1103&api_version=9.28.0&app_client_id=3&native_version=9.35.1&h5_source=&page_type=2&gameId=2&taskCode=BROWSE_GOODS&`,
            headers: header,
        }

        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log('\n果园观看商品: ' + result.msg)
                    if (result.data) userTaskLogId = result.data.userTaskLogId
                    console.log('\nuserTaskLogId: ' + userTaskLogId)
                } else {
                    console.log(result)
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

//果园观看商品后领取
function ddxgylookend(timeout = 0) {
    return new Promise((resolve) => {
        let header = pubHeader()
        header["host"] = "farm.api.ddxq.mobi"
        header["origin"] = "https://orchard-m.ddxq.mobi"
        header["Connection"] = "keep-alive"
        header["DDMC-GAME-TID"] = "2"
        header["Referer"] = `https://orchard-m.ddxq.mobi/?is_nav_hide=true&isResetAudio=true&s=mine_orchard`
        let url = {
            url: `https://farm.api.ddxq.mobi/api/v2/task/reward?api_version=9.1.0&app_client_id=1&station_id=${station_id}&native_version=&uid=${uid}&latitude=${latitude}&longitude=${longitude}&userTaskLogId=${userTaskLogId}`,
            headers: header,
        }

        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 0) {
                    console.log('\n果园观看商品后领取: ' + result.msg)
                } else {
                    console.log(result)
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

function Env(t, e) {
    class s {
        constructor(t) {
            this.env = t
        }

        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            } : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }

        get(t) {
            return this.send.call(this.env, t)
        }

        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }

    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
        }

        isNode() {
            return "undefined" != typeof module && !!module.exports
        }

        isQuanX() {
            return "undefined" != typeof $task
        }

        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }

        isLoon() {
            return "undefined" != typeof $loon
        }

        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }

        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }

        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t))
            } catch {
            }
            return s
        }

        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }

        getScript(t) {
            return new Promise(e => {
                this.get({
                    url: t
                }, (t, s, i) => e(i))
            })
        }

        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), a = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {
                        script_text: t,
                        mock_type: "cron",
                        timeout: r
                    },
                    headers: {
                        "X-Key": o,
                        Accept: "*/*"
                    }
                };
                this.post(a, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }

        loaddata() {
            if (!this.isNode()) return {};
            {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i) return {};
                {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }

        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }

        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i)
                if (r = Object(r)[t], void 0 === r) return s;
            return r
        }

        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }

        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e
                } catch (t) {
                    e = ""
                }
            }
            return e
        }

        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i),
                    h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }

        getval(t) {
            if (this.isNode()) {
                return process.env[t]
            } else {
                return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
            }
        }

        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }

        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }

        get(t, e = (() => {
        })) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                    }
                } catch (t) {
                    this.logErr(t)
                }
            }).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => {
                const {
                    message: s,
                    response: i
                } = t;
                e(s, i, i && i.body)
            }))
        }

        post(t, e = (() => {
        })) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            });
            else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t));
            else if (this.isNode()) {
                this.initGotEnv(t);
                const {
                    url: s,
                    ...i
                } = t;
                this.got.post(s, i).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body)
                })
            }
        }

        time(t) {
            let e = {
                "M+": (new Date).getMonth() + 1,
                "d+": (new Date).getDate(),
                "H+": (new Date).getHours(),
                "m+": (new Date).getMinutes(),
                "s+": (new Date).getSeconds(),
                "q+": Math.floor(((new Date).getMonth() + 3) / 3),
                S: (new Date).getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
            return t
        }

        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                    "open-url": t
                } : this.isSurge() ? {
                    url: t
                } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return {
                            openUrl: e,
                            mediaUrl: s
                        }
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return {
                            "open-url": e,
                            "media-url": s
                        }
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {
                            url: e
                        }
                    }
                }
            };
            this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
            let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
            h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
        }

        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }

        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
        }

        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }

        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}
