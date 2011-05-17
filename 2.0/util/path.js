KISSY.add("KISSY.sns.path",function(S){
    
    var D = S.DOM,
        E = S.Event,
        Path;

	/**
	 * @class ����·����ַ����������ʱ��Ҫ��URIͳһ��Դ��ַ
	 * @memberOf SNS
	 * @author ����
	 */

    Path = {

          /**
           * @lends SNS.Path.prototype
           */
     
		   /**
		    * ��ȡ API �� URI
            * @function
            * @name getApiURI
            * @memberOf SNS.util.Path#
            * @param {String} [config.api] Ҫƴ�ӵ� URI Ƭ��
            * @param {Boolean} [config.useCache] �Ƿ�ʹ�û���
            * @param {Boolean} [config.ignoreToken] �Ƿ񲻼� Token
		    */
			getApiURI : function(api,useCache,ignoreToken) {
				var that = this;

                if (!(api.substr(0, 7) === "http://" || api.substr(0, 8) === "https://") && api.indexOf(":") > 0) {
					
					//��һ��ð������λ�ã�
					var semPos = api.indexOf(":");
					
                    //��ȡӦ�ö�Ӧ��ַ
                    var apiServer = that.getServerPath(api);
                    if (apiServer !== "") {
						api = (apiServer + api.substr(semPos + 1)).replace(/assets\.taobaocdn\.com/, 'a.tbcdn.cn');
					}
				}

                //��ʹ�û��棬����ʴ���
				if (!useCache) {
					api = that.addStamp(api);
				}
       
                //���Token
				if (!ignoreToken) {	
                   api = that.addToken(api);
				}

                //api��ʽ��
				var newApi=S.substitute(api, {
                    serverHost : that.getHost().server,
                    cdnHost: that.getHost().cdn
				});

				return newApi;
			},

            /**
             * ��ȡapp��������ַ��Ӧ��
             * @function
             * @name getServerPath
             * @memberOf SNS.util.Path#
             * @param { String } uri ��Դ·����ַ
             */
            getServerPath : function(uri) {
               var uriServers = {
                    assets   : "http://assets.{cdnHost}/p/sns/1.0",
                    assetsV  : "http://assets.{cdnHost}/apps",
                    portal   : "http://jianghu.{serverHost}",
                    app      : "http://app.jianghu.{serverHost}",
                    comment  : "http://comment.jianghu.{serverHost}",
                    poke     : "http://poke.jianghu.{serverHost}",
                    share    : "http://share.jianghu.{serverHost}",
                    blog     : "http://blog.jianghu.{serverHost}",
                    fx       : "http://fx.{serverHost}",
                    checkCode: "http://comment.jianghu.{serverHost}/json/get_comment_check_code.htm",
                    feedCheckCode: "http://jianghu.{serverHost}/json/get_feed_comment_check_code.htm"
               };

               var serverPath = uriServers[uri.substr(0, uri.indexOf(":"))] || "";

               return serverPath;

            },
            
            /**
             * ��ȡ������
             * @function
             * @name getHost
             * @memberOf SNS.util.Path#
             */
            getHost : function() {

              var hostname = location.hostname,
                  serverHost = 'taobao.com',
                  cdnHost = 'taobaocdn.com';

              if(S.sns.domain.get(2) !== 'taobao.com') {
                serverHost = cdnHost = 'daily.taobao.net'; 
              }

              return {server:serverHost,cdn:cdnHost};

            },

			/**
			 * ���ʱ���
             * @function
             * @name addStamp
             * @memberOf SNS.util.Path#
			 * @param { String } url ���ӵ�ַ
			 */
			addStamp:function(url) {
				var that = this;
				return that.buildURI(url, "t=" + new Date().getTime());
			},

            /**
             * ���_tb_tokenͳһ��
             * @function
             * @name addToken
             * @memberOf SNS.util.Path#
             * @param { String } url ���ӵ�ַ
             */
            addToken:function(url){
               var that = this,
                   tokens,
                   i,
                   newUrl,
                   elToken = D.get("#Jianghu_tb_token");

                   if (elToken) {
                       tokens = elToken.getElementsByTagName("INPUT");
                       for(i = 0;i < tokens.length;i++){
                           newUrl = that.buildURI(url, [tokens[i].name, encodeURIComponent(tokens[i].value)].join("="));
                       }
                   }

                   return newUrl;
            },
			
			/**
			 * ƴ�� URI���Զ��жϵ�һ�����Ƿ��� ?����������� & ���ӣ�
			 * ������ ? ���ӵ�һ���ֺ͵ڶ����֣��������־��� & ����;
             * @function
             * @name buildURI
             * @memberOf SNS.util.Path#
			 */
			buildURI : function() {
				
				//ת�ɲ�������ʽ;
				var args = Array.prototype.slice.call(arguments);	
				if (args.length < 2) {
					return args[0] || "";
				}

				//shift()������ɾ������ĵ�һ��;
				var uri = args.shift();	 
				uri += uri.indexOf("?") > 0 ? "&" : "?";

				//������滻���������������ظ���&���ţ����磺comment&&type=xx...
				return uri + args.join("&").replace(/&+/g, "&");	
			},

           /**
            * ����Token
            * @function
            * @name setToken
            * @memberOf SNS.util.Path#
            * @param { String } token ͳһ��
            * @param { Function } callback ���óɹ���ص�����
            */
           setToken : function(token,callback) {
             var that = this;
             token && that.createToken(token);
             callback && callback();
           },

           /**
            * ����Token
            * @function
            * @name createToken
            * @memberOf SNS.util.Path#
            * @param { String } token ͳһ��
            */
            createToken : function(token) {
                var tokenStr = token || "",
                tokenArr = tokenStr.split("="),
                tokenDiv = D.get('#Jianghu_tb_token'),
                input;
                if(!tokenDiv) {
                    tokenDiv = D.create('<div>');
                    D.attr(tokenDiv,'id','Jianghu_tb_token');
                    D.html(tokenDiv,'<input type="hidden" />');
                    D.append(tokenDiv,document.body);
                }
                if (tokenStr && tokenArr.length === 2) {
                    input = D.children(tokenDiv)[0];
                    input.name = tokenArr[0];
                    input.value = tokenArr[1];
                }
               
           },

           /**
            * ��ȡToken
            * @function
            * @name getToken
            * @memberOf SNS.util.Path#
            */
           getToken : function() {
             var that = this,
                 apiToken = 'comment:/json/token.htm';

             S.getScript(that.buildURI(that.getApiURI(apiToken),'callback=SNS.sys.Helper.setToken'),function(){},'gbk');
           }
     
    };

    S.namespace('KISSY.sns').path = Path;

});
