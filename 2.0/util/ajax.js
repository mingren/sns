/**
 * sns.js
 * @author         bofei
 * @changelog      ver 1.0 @ 2010-9-25    Initialize release
 */

SNS("SNS.ajax",function(S){
    var K = KISSY, Helper= SNS.sys.Helper;
    var rurl = /^(\w+:)?\/\/([^\/?#]+)/;
    var PROXYNAME="crossdomain.htm",PROXYID="J_Crossdomain";
    /**
     * <ul>
     * <li>��ͬ��������Connectֱ�ӵ���YAHOO.util.YAHOO.util.Connect������Դ;</li>
     * <li>������������Connect ����ͨһ��id Ϊ��J_StaticIframeProxy����iframe��ȡ�������Ŀ¼�µĴ����ļ�
     * static_iframe_proxy.html������domain���һ�£�����iframe�е�YAHOO.util.YAHOO.util.Connect
     * ��������<li>
     * <li>����������������ϵ����ʹ��jsonp��������</li>
     * </ul>
     * @name Ajax
     * @memberOf SNS
     * @class Connect���YAHOO.util.YAHOO.util.Connect�����˷�װ���������˿������������
     * @param url {String} Ҫ������Դ��url��ַ
     * @param c {Object} ������Ϣ
     *  <ul>
     *     <li>method: ��string�����󷽷�:"GET"��"POST",��ʹ��JSONPʱֻ��ʹ�á�GET������</li>
     *     <li>use: {string}��������ķ�ʽ��Connect֧�����֣��ֱ���ԭ����XHR��xhr��,ͨ��iframe����(iframe),��JSONP(jsonp)</li>
     *     <li>success:{function}����ɹ�ʱ�Ļص�����</li>
     *     <li>failure:{function} ����ʧ��ʱ�Ļص�������ע��jsonp����������ص�</li>
     *     <li>data:{string}���͵�����</li>
     *  </ul>
     *  @example <p>new SNS.Ajax(u,c).send()</p><p>SNS.request(u,c)</p> <a href="../../examples/util/ajax.html">demo</a>
     */
    var Ajax=function(url,c){
        
        this._apply({
            method:"post",
            url:url
        },c);
        this.c= KISSY.merge(c,{
            url:url
        });
        this.c.method=this.c.method?this.c.method:"post";
      

    }

    Ajax.prototype=
    /**
     * @lends SNS.Ajax.prototype
     */
    {

        /**
         * �Զ��жϿ��򣬷�������
         *
         * @function
         * @param url {String} Ҫ������Դ��url��ַ
         * @param c {Object} ������Ϣ
         */
        send:function(url,c){
            this._apply(c,{
                url:url
            });
            if(!this.c.url) return this;
            if(!this.c.use)  this.c.use=this._autoCheck(this.c.url);



            switch(this.c.use){
                case "xhr" :
                    this._YUIRequest();
                    break;
                case "iframe":
                    this._iframeRequest();
                    break;
                case "jsonp":
                    this._JSONPRequest();
                    break;
            }

            return this;
        },
       
        /**
         * ���ݿ��������ѡ������ʽ
         */
        _autoCheck:function(url){
            var use="xhr",p,l=location,pa,ha,ps,hs;
            p = rurl.exec(url);
            if(p){
                if( p[1] !== l.protocol || p[2] !== l.host){
                    use="jsonp";
                    if( p[1] === l.protocol){
                        pa=p[2].split(".");
                        ha=l.host.split(".");
                        ps=pa[pa.length-2]+pa[pa.length-1];
                        hs=ha[ha.length-2]+ha[ha.length-1];
                        if(ps==hs)use="iframe";
                    }
                }else use="xhr";
            }
            return use;
        },

        _apply:function(){
            var a=arguments, l=a.length;
            this.c=this.c?this.c:{}
            for(var i=0;i<l;i++){
                for(var p in a[i]){
                    if(a[i][p])this.c[p]=a[i][p];
                }
            }
        },

        _YUIRequest:function(){
            var self=this;
            var callback={
                success:function(data){
                  
                    if(self.c.dataType=="json")data=K.JSON.parse(data.responseText);
                    if(self.c.success)  self.c.success(data, self.c)
                },
                failure:function(data){
                    if(self.c.dataType=="json")data=K.JSON.parse(data.responseText);
                    if(self.c.failure) self.c.failure(data, self.c)
                }
            };
            var data=K.param(this.c.data);
            YAHOO.util.Connect.asyncRequest(this.c.method,this.c.url,callback,data);

        },

        _dataToString:function(data){
            var s="";
            for(var p in data){
                if(data[p]!=null)s+=p+"="+encodeURIComponent(data[p])+"&";
                if(s.length>0)s=s.substring(0,s.length-1);
                return s;
            }
        },
        _iframeRequest:function(){
            Ajax.setDomain();
         

   
            var    iframe = K.DOM.create('<iframe class="crossdomain" frameborder="0" width="0" height="0"  src=""></iframe>');
               

            var parts = rurl.exec(this.c.url);
            var self=this;
            var send=function(){
               
                K.log("ready send"+iframe)
                var callback={
                    success:function(data){
                        K.log("request successs:"+self.c.url);
                      /*  if(iframe){
                            K.DOM.remove(iframe);
                           K.log("delde iframe")
                        }
                     */
                        if(self.c.dataType=="json")data=K.JSON.parse(data.responseText);

                        if(self.c.success)self.c.success(data, self.c)
                    },
                    failure:function(data){
                        K.log("request failuree :"+self.c.url);
                      //  if(iframe)   K.DOM.remove(iframe)
                        if(self.c.dataType=="json")data=K.JSON.parse(data.responseText);
                        if(self.c.failure)self.c.failure(data, self.c)
                    }
                };

                
                var data=K.param(self.c.data);


               if(iframe&&iframe.contentWindow&& iframe.contentWindow.YAHOO) iframe.contentWindow.YAHOO.util.Connect.asyncRequest(self.c.method,self.c.url,callback,data);
            }
            // ��iframe������ɺ�������
            //�ο���http://www.planabc.net/2009/09/22/iframe_onload/
            if (iframe.attachEvent){
                iframe.attachEvent("onload", send);
            } else {
                iframe.onload = send;
            }
            //��ȡ������Դ��iframe�����ļ�
            iframe.src=parts[0]+"/"+PROXYNAME;
            K.DOM.append(iframe, document.body);
            

        },
        _JSONPRequest:function(){

            var script,timer,self=this;
            var index=++SNS._JSONP.counter;
            SNS._JSONP['c' + index] = function(json){
                if(timer){
                    window.clearTimeout(timer);
                    timer=null;
                }
                self.c.success.call(self,json, self.c);
                if(script&&script.parentNode)script.parentNode.removeChild(script);
            }

            var parms=KISSY.param(this.c.data);
            KISSY.log("_JSONPRequest before"+this.c.url);
            var src = this._buildUrl(this.c.url,parms+"&callback=SNS._JSONP.c"+ index);
            KISSY.log("_JSONPRequest after"+src);

            script=document.createElement("script");
            document.body.insertBefore(script,document.body.firstChild);
            window.setTimeout(function(){
                script.setAttribute("type","text/javascript");
                script.src=src;
            },1);
            timer=this._timeOut(script,this.c.timeout);
            return script;

        },

        _timeOut:function(requestObject,timeout,callback){

            var time=timeout?timeout:5000;
            var timer=window.setTimeout(function(){
                if(requestObject&&requestObject.parentNode)  requestObject.parentNode.removeChild(requestObject);
                if(callback)callback();
            },time);
            return timer;
        },

        _buildUrl:function(url,parms){
            url += url.indexOf("?") > 0 ? "&" : "?";
            return url+parms;

        }

    
    };

    if (!SNS._JSONP) {
        SNS._JSONP = {};
        SNS._JSONP.counter=0;
    }

    Ajax.setDomain= function(){
       
        var _hostname = window.location.hostname.toString();
        var _hosts = _hostname.split(".");
        var _len = _hosts.length;
        //��������
        if(_len>2){
            try{
                document.domain= _hosts[_len-2]+"."+_hosts[_len-1];
            }catch(e){
                KISSY.log("set Domain error")
            }
        }
        K.log("setDomain:"+document.domain)
        return document.domain;
    };

    S.Ajax=Ajax;


    //�ṩһЩ���ķ��������ڵ���
    /**
     * �Զ��жϿ��򣬷�������
     * @name request
     * @memberOf SNS#
     * @function
     */
    S.request=function(url,config){
       
        return new Ajax(url,config).send();
    };

    /**
     * ʹ��jsonp�ķ�ʽ������Դ
     * @name jsonp
     * @memberOf SNS#
     * @function
     */
    
    S.jsonp=function(url,config){
        config.use="jsonp"
        return new Ajax(url,config).send();
    };


})

