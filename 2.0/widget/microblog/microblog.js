/*
 * ߴ�ᷢ�����
 * @author bofei
 * @date 2010.8.8
 */

SNS.add("MicroBlog-v2",function(){


    var Y=YAHOO,Dom=Y.util.Dom,Event=Y.util.Event,Helper=SNS.sys.Helper, text="�����Եı���˵����";
    var limitLength = 210;
    var allowedExtends = 'JPG|GIF|PNG|JPEG|BMP';
    var url=Helper.getApiURI("http://t.{serverHost}/weibo/addWeiboResult.htm",true,true);
    var proxy=Helper.getApiURI("http://t.{serverHost}/proxy.htm",true,true);
    var html= '<div class="tips">�㻹��������<em class="num">210</em>����</div>'+
    '<div class="wrap">'+
    '<div class="sub-tips"><i></i><p>Ctrl+Enter���Կ��ٷ���</p></div>'+

    '<div class="arr"></div>'+
    '<div   class="error-msg"><span class="arrow"></span><p class="error">ͬ������ֻ��ʾ32����������</p></div>'+
    '<form class="form" action="'+url+'"  enctype="multipart/form-data" method="post" target="hidden_frame">'+
    ' <div class="sns-nf"><textarea maxlength="210" name="content" class="f-area" >�����Եı���˵����</textarea></div>'+
    '<div class="act ">'+
  
    ' <span class="sns-icon icon-insert-face">����</span>'+
    ' <span  class="sns-icon icon-insert-img">ͼƬ</span>'+
    ' <span class="upload"><input name="fileData" class="input-upload"  type="file"/></span>'+
    ' <span class="file" style="display:none">�ϴ���<em class="file-name"></em> <a class="sns-icon icon-del" href="#">&nbsp;</a></span>'+
    ' <span class="rsync"><input id="rsyncBox" name="rsyncBox" class="rsync-box" type="checkbox"><label for="rsyncBox">����Ϊ��������ǩ��</label></span>'+
    ' <span class="skin-red">'+
    '<input type="hidden" class="syncTag" name="syncTag" />'+
    '<input type="hidden" name="event_submit_do_publish_weibo" value="anything"/>'+
    '<input type="hidden" name="action" value="weibo/weiboAction"/>'+
    '<input type="hidden" class="from-type" name="type" value="2"/>'+
    '<div class="hiddentoken" style="display:none"></div>'+
    ' <a class="submit" href="#" >�� ��</a>'+
    '<div class="hidden" ></div>'+
    ' </span>'+
    ' </div>'+
    ' </form>'+
    '<iframe name="hidden_frame" class="hidden-frame"  style="display: none;" src="'+proxy+'"></iframe>'+
    ' </div>';

  // ������� ����domain
    var _domain = function() {
        var _hostname = window.location.hostname.toString();
        var _hosts = _hostname.split(".");
        var _len = _hosts.length;
        if(_len>2) {
            return _hosts[_len-2]+"."+_hosts[_len-1];
        }
        return _hostname;
    };

    document.domain = _domain();



    /*
     * @class 
     */
    var MicroBlog=function(config){

        this.config={
            container:"J_MicroBlog"
        }
        this._config(config);
        this._init();
    }
    MicroBlog.prototype={
        _config:function(config){
            this.config=YAHOO.lang.merge(this.config,config||{});
        },
        _init:function(){
           

            this.container=Dom.get(this.config.container);
            if(!this.container)return;
            this._inject(this.container);
            this.content=Dom.get(this.config.container);
            this._createCallback();
            this._attach();
            new SNS.widget.MicroSuggest({
                autoHeight:false,
                root:this.container,
                className:"f-area"
            })
        },

        // ��Ⱦhtml
        _inject:function(id){
            var container=Dom.get(id);
            if(container)container.innerHTML=html;
            var type=Dom.getElementsByClassName("from-type","input",container)[0];
    
            type.value=this.config.type?this.config.type:2;
        },

        //����token
        _setToken:function(){
            var token=Dom.get("Jianghu_tb_token");
            if(token){
                this._get("hiddentoken","div").innerHTML= token.innerHTML;
            }
        },

        _attach:function(){
            var self=this,uploadInput=Dom.getElementsByClassName("input-upload","input",this.container)[0],textarea=this._get("f-area", "textarea");
            textarea._value=textarea.value;
            if (this.config.defaultText) {
                textarea.value = this.config.defaultText;
            }
            var submit=this._get("submit","a");
            var subTips=this._get("sub-tips","div");
            var btn=this._get("skin-red","span");


            //��������¼�


            Event.on(this.content,"click",function(e){
           
                var target=Event.getTarget(e);
                switch(target.className){
                    case  "sns-icon icon-del":
                            Event.preventDefault(e);
                        if(!confirm('ȷ��ɾ��ͼƬ��?')){
                            return;
                        }
                        this._resetImage();
                        break;
                  
                }
            },this,true);

            Event.on(btn,"click",function(e){
                Event.stopEvent(e);
                this.submitData();
            },this,true)




          

            Helper.addMaxLenSupport(this.content,210,"f-area",function(){
                self.showNum();
            })
            var timer=null
            Event.on(submit,"mouseover",function(e){
               if(!Dom.isAncestor(this,Event.getRelatedTarget(e))){
                      subTips.style.display="block";
               }
               
            },submit,true)
            Event.on(submit,"mouseout",function(e) {
              
                if(!Dom.isAncestor(this,Event.getRelatedTarget(e))){
                      subTips.style.display="none";
               }
            },this,true)

            Event.on(textarea, "focus", function(e) {

                if(this.value == this._value) this.value="";
            },textarea,true);
            Event.on(textarea, "blur", function(e) {
                if(this.value=="") this.value=this._value;
            },textarea,true);

            Event.on(textarea, "keydown", function(e) {
                if(e.keyCode==9) return false;
            });
       
            Event.on(textarea, "keyup", function(e) {
                var event= Event.getEvent(e);
                       
                var keycode=Event.getCharCode(e);
                if(keycode==13&&event.ctrlKey){
                    self.submitData();
                    return;
                }
                var desc=this.value;
                
                var rsync=Dom.getElementsByClassName("rsync-box","input")[0];
                if(desc.length > limitLength){
                    this.value=desc.substring(0,limitLength);
                }
              
                var desc =  this.value.trim();

                self._checkRsync();

                if(desc.length >= limitLength ) {
                    self._showTips("210����");
                    return;
                }else if(desc.length < limitLength  ){
                    self._hideTips();
                }

                if(desc.length >= 32 ) {
                    self._showTips("ͬ������ֻ��ʾ32����������");
                    return;
                }else if(desc.length < 32  ){
                    self._hideTips();
                }

             
            },textarea,true);

            Event.on(uploadInput,"change",this._showUploadFileName,this,true);

            this._fillFace();

        },
        clearTxt:function(){
            var  textarea=this._get("f-area", "textarea");
            if(textarea.value == text) textarea.value="";
        },
        _showUploadFileName:function(){

            var   textarea=this._get("f-area", "textarea");
            var self=this, uploadInput=Dom.getElementsByClassName("input-upload","input",this.container)[0], file=this._get("file","span"),fileTag=this._get("file-name","em");
            if(fileTag){

                var path =  uploadInput.value;
                if(path == "") return true;
                var extendIndex = path.lastIndexOf('.');
                if(extendIndex < 0 || allowedExtends.indexOf( path.substring(extendIndex + 1).toUpperCase() ) < 0){
                
                    file.style.display="none";
                  
                    self._resetImage();
                
                    //  SNS.sys.Helper.showMessage("<div style=>�ϴ���ʽ����ȷ,ͼƬ˵��ֻ֧��jpg��bmp��png��gif��jpeg��ʽ.</div>");



                    //��ʾ�ɹ�
                    var popupMsg = new SNS.sys.Popup({
                        title : "С��ʾ",
                        type : "error",
                        content : '�ϴ���ʽ����ȷ,ͼƬ˵��ֻ֧��jpg��bmp��png��gif��jpeg��ʽ.',
                        autoShow : false,
                        hideMask : true,
                        buttons : [{
                            text: "ȷ��",
                            func : function() {
                                this.hide();
                            }
                        }]
                    });



                popupMsg.show();

                return false;
            }
            else{

                //����ļ�����,�Ȼ�����һ��б�ܣ�ͨ��б��ȡ�����ֵ��ie���ļ��Ǵ�����·���ġ�
                var indexNew = uploadInput.value.lastIndexOf("\\") + 1;
                var title = uploadInput.value;
                if(indexNew > 0 ) {
                    title = uploadInput.value.substring(indexNew);
                }

                //���ļ������ֽ��н�ȡ���������ֳ��ȳ������ơ�
                indexNew = title.lastIndexOf(".") + 1;
                if(indexNew > 0 && title.length > 8) {
                    fileTag.innerHTML = '...' + title.substring(title.length - 8);
                }
                //���û�г������ƣ���ʾ�����ļ����ơ�
                else{
                    fileTag.innerHTML = title;
                }

                fileTag.style.display="";
                file.style.display="";
                var rsync=Dom.getElementsByClassName("rsync-box","input")[0];
                    
                rsync.checked = false;

                self._hasUpload=true;

            }
            self.clearTxt();
            self._checkRsync();
        }
    },
    _resetText:function(){
        this._get("f-area", "textarea").value=text;
    },
    _resetImage:function(){
        var  result=Dom.getElementsByClassName("upload","span",this.container)[0];
        result.innerHTML='<input name="fileData" class="input-upload"  type="file"/>';
        var input=Dom.getElementsByClassName("input-upload","input",result)[0];

        this._get("file","span").style.display="none";
        Event.on(input,"change",this._showUploadFileName,this,true);
        this._hasUpload=false;
        this._checkRsync();


    },
    _resetRsync:function(){
        this._get("rsync-box","input").checked=false;
          

    },
    _checkRsync:function(){
        var result=true;
        var text=this._get("f-area", "textarea");
        var check=this._get("rsync-box","input");
            
        if(this._hasUpload||this._checkFace()||text.value.length>32){
            result= false;
        }
        //alert(text.value.length);
        //alert(result)
        if(result==true&&check.disabled){
            check.disabled=false;
        }
        else if(result==false){
            check.disabled=true;
            
        }
          
    },
    _clearData:function(){
        this._resetText();
        this._resetImage();
        this._resetRsync();
        this._hideTips();
         
    },
    //��ȡ������ڵ�
    _get:function(className,tag,root){
        if(!root)root=this.content
        var key="_"+className+"_"+tag;
        var result=this[key];
        if(!result){
            result=Dom.getElementsByClassName(className,tag,root)[0];
            this[key]=result;
        }
        return result;
    },
    _fillFace:function(){
        var self=this,textarea=this._get("f-area", "textarea"),faceHandle=this._get("icon-insert-face", "span");
        Helper.fixCursorPosition(textarea);
        Event.on(faceHandle, "click", function(e) {
            var el = Event.getTarget(e);
            SNS.app.Components.get("FaceSelector").showDialog({
                elTrigger : faceHandle,
                callback : function(data) {
                    if(textarea.value.length>=210)return;
                    Helper.recoverCursorPos(textarea);
                    self.clearTxt();
                    Helper.insertText(textarea, data.faceId);
                     Dom.setAttribute(textarea,"data-lastcursor","");
             
                       
                    window.setTimeout(function(){
                        self.showNum();
                        self._checkRsync();
                    }, 100)
                }
            });
        },this,true);

    },
    showNum:function(){
        var  num=this._get("num", "em");
        var   textarea=this._get("f-area", "textarea");
        var desc =  textarea.value;
        var n=210-desc.length;
        if(n<0)n=0;
        num.innerHTML=n;
    },
    _checkFace:function(){
        var result=false;
        var faces = SNS.app.Components.get("FaceSelector").getAllFaces(),
      
         
        re = null;

        if (faces.length > 0) {
            var reStr = [];
            for (var i = 0; i < faces.length; ++i) {
                reStr[reStr.length] = "\\" + faces[i].code.split("").join("\\");
            }

            re = new RegExp(reStr.join("|"), "g");
                
            var cannotSyncSign = re.test(this._get("f-area", "textarea").value);

               
            result= cannotSyncSign;


        }
          
        return result;
         
 

    },
    _showTips:function(msg){
        var c=this._get("error-msg","div");
        this._get("error","p").innerHTML=msg;
        c.style.display="block";



    },
    _hideTips:function(){
        var c=this._get("error-msg","div");
        this._get("error","p").innerHTML="";
        c.style.display="none";

    },
    _createCallback:function(){
        var self=this;
        SNS.app._Microblog_callback = function(data) {//��׽��̨�����ķ�����Ϣ

            //D.get("loading").style.display="none";
               
                
            if(data.status==1){
                self._clearData();

                if(self.config.onSuccess) self.config.onSuccess(data);
            }
            else if(data.status==2){
                Helper.showMessage(data.msg);
            }
            else {
                if (!Helper.checkAndShowLogin()) {
                    return;
                }
            }


        }

    },


    submitData:function(){
         this._get("f-area", "textarea").blur();
        var self=this;

        // ����¼״̬��û��¼ֱ����ʾ��¼��
        if (!Helper.checkAndShowLogin({
            autoCallback:true
        })) {
            // ���� IE6 ���ı����п����޷���ȡ����� bug

            return;
        }
        this.clearTxt();
        var desc =  this._get("f-area", "textarea").value.trim();

        var form= this._get("form", "form");

        var file =Dom.getElementsByClassName("input-upload","input",this.container)[0].value;

        if((desc =="" || desc==text) && file=="" ){
            SNS.sys.Helper.showMessage("�������������.");
            this.value=text;
            return false;
        }
        else if(desc.trim().length > limitLength){
            SNS.sys.Helper.showMessage("̫����~ߴ������ݲ��ܳ���210����.");
            return false;
        }
        if(this._get("rsync-box","input").checked){
            this._get("syncTag","input").value="true";
        }
        else{
            this._get("syncTag","input").value="false";
        }
        this._setToken();

       
       
        this._get("form", "form").submit();
        window.setTimeout(function(){self._get("num", "em").innerHTML="210";},500);
        
    }
}
SNS.widget.MicroBlog=MicroBlog;
});
