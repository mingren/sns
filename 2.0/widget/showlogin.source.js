/**
 * showlogin.js
 * @author qiaofu<amdgigabyte#gmail.com>
 *
 * ������½�򣬲������ڵ�һ�����ܽӴ�
 * ϣ���û����õ�ʱ��SNS.widget.showlogin(id,fn);
 * id�Ǹ������һ��id
 * fn�Ǵ�������ϵĻص�
 */
(function() {
    var K = KISSY,
        D = K.DOM,
        doc = document,
        E = K.Event;
        //����Ҫ����js��ҳ�����󴴽�һ������
            //Ŀǰ��ʽ�����css����css�ļ���
        if (!D.get('#J_login')) {

            if (location.host.indexOf('taobao.com') !== -1) {
                var iframeurl = 'https://login.taobao.com/member/login.jhtml?style=miniall';
            } else {
                var iframeurl = 'https://login.daily.taobao.net/member/login.jhtml?style=miniall';
            }

            var htmlString = '<div class="popup-login" style="display:none;">';
                htmlString += '<iframe id="J_loginiframe"';
                htmlString += ' width="354" height="285" frameborder="0"';
                htmlString += 'scrolling="no" src="#"';
                htmlString += ' data-src="' + iframeurl + '"></iframe>';
                htmlString += '<s class="clo-btn">x</s>';
                htmlString += '</div>';
            var theLoginDiv = D.create(htmlString);
            //���뵽dom����
            D.append('body', theLoginDiv);
        }

        function _showLoginPopup(hook, fn) {
            if (!hook) {
                //���hook������ô��ʹ��Ĭ�ϵ�hook
                //�������hookԼ������class=J_LoginPopup
                hook = 'J_LoginPopup';
            }

            K.use('uibase,overlay', function(S) {
                var Align = S.UIBase.Align;
                if (!S.one(theLoginDiv)) return;

                var loginPop = new S.Overlay({
                    srcNode: S.one(theLoginDiv),
                    width: 354,
                    height: 285,
                    align: {
                        node: null,
                        points: [Align.CC, Align.CC],
                        offset: [0, 0]
                    },
                    mask: true
                });

                loginPop.on('show', function() {
                    var clo_btn = S.get('.clo-btn');
                    //��¼�������mini��¼��ȥ��
                    //����Ӧ�߶ȣ�����Ҫ�Ե�¼��
                    //�趨�߶ȣ����û�и߶ȣ�mini
                    //��¼�ᷴ��������xclient
                    //�����Ȱ�mini��¼��iframe��
                    //srcд��data-src��������ʾ��ʱ��
                    //�ٰ�src���ϡ�
                    //����Ҫע����ǻ᲻���л��������
                    var theSrc = D.attr('#J_loginiframe', 'data-src');
                    D.attr('#J_loginiframe', 'src', theSrc);
                    E.on(clo_btn, 'click', function() {
                        loginPop.hide();
                    });
                });
                //bind show events
                E.on('body', 'click', function(e) {
                    if (!D.hasClass(e.target, 'J_Loginpopup')) {return;}
                    e.preventDefault();
                    loginPop.show();
                });
                //reg LoginSuccess to window
                function LoginSuccess() {
                    loginPop.hide();
                    //��a��ʧ֮��ִ�лص�
                    if (K.isFunction(fn)) {
                        fn();
                    }
                }
                loginPopup = LoginSuccess;
                //loginPopup������ⲿҳ�����
                //����Ҫ�Ѹ���Ĺر��¼�ע�ᵽwindow����
            });
        }
    SNS.widget.showLogin = _showLoginPopup;
})();
