/*
 * ߴ��ת��
 * ���� new SNS.widget.MicroblogForward({�����б�})
 * @author bofei
 * @date 2010.8.8
 */

(function() {
    var Dom = YAHOO.util.Dom, Event = YAHOO.util.Event, Helper = SNS.sys.Helper, Lang = YAHOO.lang;
    //html ģ��
    var htmlString = '<div class="microblog-sub">' +
    '<div class="header">ת�����ҵ�ߴ��</div>' +
    '<div class="content">' +
    ' <div class="blog">ת��{wbcontent}</div>' +
    '<div class="reply">' +
    ' <div class="title"><a class="sns-icon icon-insert-face">����</a><span class="num">����������<em class="num-value">210</em>��</span></div>' +
    '<div class="sns-nf">' +
    '<p class="txt"> <textarea  class="f-txt J_Suggest" name="content">{fwbcontent}</textarea></p>' +
    '<div >{wbcomment}</div>' +
    '<div>{fwbcomment}</div>' +
    '</div>' +
    ' </div>' +
    '<div class="act skin-blue">' +
    '<span class="btn"><a href="#" class="confirm">ȷ&nbsp;��</a></span><a href="#" class="cancle">ȡ&nbsp;��</a>' +
    '</div>' +
    ' </div>' +
    '</div>';

    /*
    * @class  ߴ��ת��
    */
    var MicroblogForward = function(config) {
        //��Ҫ������̨�Ĳ���
        this.config = {
            // ߴ��id
            wbid: '',
            //ߴ���û�id
            wbuserid: '',
            // ߴ���û�nick
            wbnick: '',
            // ߴ������
            wbcontent: '',
            // ת������
            publishType: 1,
            from: 2,//���
            //ҳ����Ҫ��ʾ�Ĳ���
            // ΢����ʵ����
            wbrealname: '',
            //ԭ���û���ʵ����
            fwbrealname: '',
            // ԭ���û�id
            fwbuserid: '',

            // ԭ��id
            fwbid: null,
            // ԭ������
            fwbcontent: '',
            ttype: 1,//ֻ��ԭ΢��
            //ttype:2 ��ת����΢��
            maxlength: '210',
            fid: '',
            ffid: '',
            sourceType: '',
            txt: '˳��˵��ʲô��...',
            //url
            fowardURL: 'http://t.{serverHost}/weibo/addWeiboResult.htm?event_submit_do_publish_weibo=1&action=weibo/weiboAction',
            postMBCommentURL: 'http://comment.jianghu.{serverHost}/json/publish_comment.htm?action=comment/commentAction&event_submit_do_publish_comment_batch=true',
            //ת���ɹ��Ƿ�Ҫˢ��ҳ��
            refresh: false,
            //�Է���ת��
            apptype: null,
            oapptype: null,
            // Ӧ������ 9Ϊߴ�� 8Ϊ�Է���
            type: 9,
            btnchecked: false,
            //�û�ʵ�ʵ�������Ϣ
            userinput: ''
        };
        this.init(config);
    }
    MicroblogForward.prototype = {

        /*
         * @constructs
         */
        init: function(config) {
            this._config(config);
            this._setup();
            this._on();


        },
        _config: function(config) {
            this.config = YAHOO.lang.merge(this.config, config || {});
        },
        // ���ò��� ����������
        _setup: function() {
            var isChecked = this.config.btnchecked ? 'checked' : '';
            var data = {
                wbcontent: this.config.wbcontent || '',
                wbcomment: '<p class="input"><input name="sendmsg"  class="sendmsg" type="checkbox" ' + isChecked + '/>ͬʱ��Ϊ��' + this.config.wbrealname + '�����۷���</p>',
                wbrealname: '',

                fwbcontent: this.config.txt,

                fwbcomment: ''
            };
            if (this.config.userinput !== '') {
                data.fwbcontent = this.config.userinput;
            }
            if (this.config.ttype == 2) {
                data.fwbcontent = ' //@' + this.config.wbnick + ':' + this.config.fwbcontent;
                if (this.config.wbuserid != this.config.fwbuserid)data.fwbcomment = '<p class="input"><input name="osendmsg"  class="osendmsg" type="checkbox" ' + isChecked + '/>ͬʱ��Ϊ��' + this.config.fwbrealname + '�����۷���</p>';
            }
            var html = YAHOO.lang.substitute(htmlString, data);

            this.panel = SNS.sys.snsCenterPanel(html, {
                width: '398px',
                hideHandleTop: '10px',
                hideHandleRight: '10px',
                fixed: false
            });
            var self = this, content = self.panel.content,

            textarea = Dom.getElementsByClassName('f-txt', 'textarea', content)[0]

            // ��ʼ����������
            new SNS.widget.MicroSuggest({
                root: this.panel.content,
                minHeight: 60,
                callback: function() {
                    self.showNum();
                }
            });
            // ����textarea�ĳ���
            Helper.addMaxLenSupport(this.panel.content, 210, 'f-txt');


        },
        //���ù��λ�ú���
        setCaretPosition: function setCaretPosition(ctrl, pos) {
            setTimeout(function() {
                if (ctrl.setSelectionRange)
                {
                    ctrl.focus();
                    ctrl.setSelectionRange(pos, pos);
                }
                else if (ctrl.createTextRange) {
                    var range = ctrl.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                }
            }, 50);
        },



        //����textarea ����
        _length: function() {

        },
        //����һ��΢������
        postMBComment: function(parms,callback) {
            var self = this;
            var newParms = {
                feed_id: null,
                targetKey: null,
                type_id: 9,
                content: null,
                //  proUserId:null,
                recUserId: null
            }

            new SNS.sys.BasicDataSource({
                url: Helper.getApiURI(self.config.postMBCommentURL),
                parms: Lang.merge(newParms, parms || {}),
                success: callback
            }).iframeProxy();

        },
        // ����¼�
        _on: function() {
            var self = this, content = self.panel.content,
            num = Dom.getElementsByClassName('num-value', 'em', this.content)[0],
            textarea = Dom.getElementsByClassName('f-txt', 'textarea', content)[0],
            sendmsg = Dom.getElementsByClassName('sendmsg', 'input', content)[0],
            osendmsg = Dom.getElementsByClassName('osendmsg', 'input', content)[0],
            cancle = Dom.getElementsByClassName('cancle', 'a', content)[0],
            confirm = Dom.getElementsByClassName('confirm', 'a', content)[0],
            face = Dom.getElementsByClassName('icon-insert-face', 'a', content)[0];

            Helper.fixCursorPosition(textarea);

            textarea.style.overflow = 'hidden';

            if (this.config.ttype == 2) {
                this.setCaretPosition(textarea, 0);

                self.showNum();

            }

            else {

                textarea.blur();
                Event.on(textarea, 'focus', function() {

                    this.clearTxt();
                },this, true);

                Event.on(textarea, 'blur', function() {

                    this.recoverTxt();
                },this, true);

            }
            Event.on(textarea, 'keyup', function() {
                self.showNum();

            });
            Event.on(cancle, 'click', function(e) {
                Event.preventDefault(e);
                self.panel.hide();
            },this, true);

            Event.on(confirm, 'click', function(e) {
                Event.preventDefault(e);
                var sendmsg = Dom.getElementsByClassName('sendmsg', 'input', content)[0],
                osendmsg = Dom.getElementsByClassName('osendmsg', 'input', content)[0];

                this.clearTxt();

                var parms = {
                    tId: this.config.wbid,
                    tUserId: this.config.wbuserid,
                    content: textarea.value,
                    publishType: this.config.publishType,
                    from: this.config.from,
                    //�Է���ת��
                    apptype: this.config.apptype,
                    oapptype: this.config.oapptype
                };


                //ת��ת����
                if (sendmsg && sendmsg.checked)parms.sendmsg = 'true';
                if (osendmsg && osendmsg.checked) {
                    parms.osendmsg = 'true';
                    parms.oUserId = this.config.fwbuserid;
                    parms.oWeiBoId = this.config.fwbid;
                }
                self.config.content = textarea.value;
                self.request(parms);
            },this, true);
            //��ӱ����¼�
            Event.on(face, 'click', function(e) {
                var el = Event.getTarget(e);
                SNS.app.Components.get('FaceSelector').showDialog({
                    elTrigger: face,
                    callback: function(data) {
                        self.clearTxt();
                        if (textarea.value.length >= 210)return;
                        Helper.recoverCursorPos(textarea);
                        Helper.insertText(textarea, data.faceId);
                        Dom.setAttribute(textarea, 'data-lastcursor', '');
                        self.clearTxt();
                        var n = 210 - textarea.value.length;
                        if (n < 0)n = 0;
                        num.innerHTML = n;
                    }
                });
            },this, true);
        },
        clearTxt: function() {
            var self = this, content = self.panel.content,
            textarea = Dom.getElementsByClassName('f-txt', 'textarea', content)[0];
            if (textarea.value == this.config.txt) {
                textarea.value = '';
            }
        },
        showNum: function() {
            var self = this, content = self.panel.content,
            num = Dom.getElementsByClassName('num-value', 'em', this.content)[0],
            textarea = Dom.getElementsByClassName('f-txt', 'textarea', content)[0];
            var n = 210 - textarea.value.length;
            if (n < 0)n = 0;
            num.innerHTML = n;
        },
        recoverTxt: function() {
            var self = this, content = self.panel.content,
            textarea = Dom.getElementsByClassName('f-txt', 'textarea', content)[0];
            if (Lang.trim(textarea.value) == '') {
                textarea.value = this.config.txt;
            }
        },


        request: function(parms) {
            var self = this, content = self.panel.content,
            num = Dom.getElementsByClassName('num-value', 'em', this.content)[0],
            textarea = Dom.getElementsByClassName('f-txt', 'textarea', content)[0],
            sendmsg = Dom.getElementsByClassName('sendmsg', 'input', content)[0],
            osendmsg = Dom.getElementsByClassName('osendmsg', 'input', content)[0];

            // ����¼״̬��û��¼ֱ����ʾ��¼��
            if (!Helper.checkAndShowLogin({
                callback: function() {
                    textarea.focus();
                }
            })) {
                // ���� IE6 ���ı����п����޷���ȡ����� bug

                return;
            }

            var createSuccessPanel = function(msg) {
                var html = '<div>ת���ɹ�.</div>'
                new SNS.sys.Popup({
                    title: 'С��ʾ',
                    content: html,
                    type: 'success',
                    onShow: function() {
                        var that = this;
                        setTimeout(function() {
                            that.hide();
                        }, 4000);
                    }
                });
            }
            var createFailurePanel = function(msg) {
                new SNS.sys.Popup({
                    title: 'С��ʾ',
                    content: msg,
                    type: 'error'
                });
            //var panel=Helper.showMessage(msg);

            }
            var callbackCommentSuccess = function(response,o) {


                if (o.status == '1') {
                    createSuccessPanel();
                }
            //   else if(o.status=="0")createFailurePanel(o.message)
            }
            var commentParms = {


                type_id: self.config.type,
                content: self.config.content,
                sourceType: self.config.sourceType,
                // �Է���
                apptype: self.config.apptype,
                oapptype: self.config.oapptype
            };
            // ת��ת����
            if (sendmsg && sendmsg.checked) {

                commentParms.feed_id = self.config.fid;
                commentParms.targetKey = self.config.wbid;
                commentParms.recUserId = self.config.wbuserid;



            }

            if (osendmsg && osendmsg.checked) {


                commentParms.f_feed_id = self.config.ffid;
                commentParms. f_targetKey = self.config.fwbid;
                commentParms.f_recUserId = self.config.fwbuserid;

            }

            if (self.config.oapptype && self.config.oapptype == '12030820') {
                commentParms.f_type_id = 8;
                commentParms.sourceType = 0;
            }

            var commentCallback = function(html,data) {
                if (!data.msg)data.msg = '';
                if (data && data.status && data.status == '2') {

                    var content = '<div class="sns-nf">' +
                    '<div id="J_FollowCheckCodeMsg" style="color:red;margin-bottom:20px;">' + data.msg + '</div>' +
                    '<span>��֤�룺</span>' +
                    '<input type="text" maxlength="4" id="J_FollowCheckCode" class="f-txt" style="width:50px"/>' +
                    '<img id="J_FollowCheckCodeImg" style="vertical-align:middle" width="100" src="' + SNS.sys.Helper.getApiURI(data.uri) + '"/>' +
                    '(�����ִ�Сд) &nbsp;' +
                    '<a href="#" id="J_FollowCheckCodeChange">��һ��</a>' +
                    '</div>';
                    var checkCode, change, img;
                    var checkpanel = SNS.sys.snsDialog({
                        width: '400px',
                        className: 'checkCode',
                        title: '������������֤��:',
                        height: '167px',
                        content: content,
                        confirmBtn: function() {
                            var checkCode = Dom.get('J_FollowCheckCode');
                            var msg = Dom.get('J_FollowCheckCodeMsg');
                            var newQueryParam = commentParms;
                            newQueryParam['TPL_checkcode'] = checkCode.value;
                                self.postMBComment(newQueryParam, commentCallback);
                            checkpanel.hide();
                        }

                    });
                    checkCode = Dom.get('J_FollowCheckCode');
                    change = Dom.get('J_FollowCheckCodeChange');
                    img = Dom.get('J_FollowCheckCodeImg');

                    Event.on(change, 'click', function(e) {
                        Event.stopEvent(e);
                        img.src = SNS.sys.Helper.getApiURI(data.uri);
                    });

                }
                else {
                    createSuccessPanel();
                }

            }


            new SNS.sys.BasicDataSource({
                url: Helper.getApiURI(this.config.fowardURL),
                parms: parms,
                success: function(data) {
                    if (data.status == 1) {
                        self.panel.hide();
                        // if( SNS.widget.feed.Controler.instance)SNS.widget.feed.Controler.instance.reload();
                        //   createSuccessPanel();
                        if ((sendmsg && sendmsg.checked) || (osendmsg && osendmsg.checked)) {
                            self.postMBComment(commentParms, commentCallback);
                        } else createSuccessPanel();
                    }
                    else if (data.status == 2) {
                        createFailurePanel(data.msg);
                    }
                    else {
                        if (!Helper.checkAndShowLogin()) {
                            return;
                        }
                    }
                }
            }).iframeProxy();
        }

    };

    SNS.widget.MicroblogForward = MicroblogForward;

})();
