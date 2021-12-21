$(document).ready(function(){
    var form = $(document).find('form[data-form]');
    f = document.querySelector('form[data-form]');
    t = document.querySelector('form[data-form] button[type=submit]');
    i = FormValidation.formValidation(f,{
        plugins: {
            declarative: new FormValidation.plugins.Declarative({
                html5Input:true,prefix:'data-fv-'
            }),
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
              rowSelector: ".fv-row",
            })
        },
    });
    form.submit(function(e){
        var method = form.attr('method');
        e.preventDefault();
        t.setAttribute("data-kt-indicator", "on");
                  t.disabled = !0;
        i.validate().then(function (i) {
            if("Valid" == i){
            $.ajax({  
                url:window.location.href,  
                type: method ? method : 'POST',  
                dataType:'json',  
                data: form.serialize(),  
                success:function(response){                 
                    if(response.error === 1){
                        Swal.fire({
                            text: response.message,
                            icon: 'error',
                            buttonsStyling: !1,
                            confirmButtonText: "Đồng ý",
                            customClass: { confirmButton: "btn btn-primary" },
                        });                    
                    }
                    else{                    
                        Swal.fire({
                            text: response.message,
                            icon: 'success',
                            buttonsStyling: !1,
                            confirmButtonText: "Đồng ý",
                            customClass: { confirmButton: "btn btn-primary" },

                        }).then(function(){
                            if(response.redirect){
                            window.location = response.redirect;
                            }
                            else{
                                window.location.reload();
                            }
                        });     
                    }
                    t.removeAttribute("data-kt-indicator", "on");
                    t.disabled = !1;
                },  
                error:function(response){  
                    Swal.fire({
                        text: response.message ? response.message : 'Có lỗi, xin thử lại',
                        icon: "error",
                        buttonsStyling: !1,
                        confirmButtonText: "Ok, got it!",
                        customClass: { confirmButton: "btn btn-primary" },
                    });
                    t.removeAttribute("data-kt-indicator", "on");
                  t.disabled = !1;
                }  
            });  
        }else{
            Swal.fire({
                text: 'Có lỗi xảy ra, vui lòng thử lại',
                icon: "error",
                buttonsStyling: !1,
                confirmButtonText: "Ok, got it!",
                customClass: { confirmButton: "btn btn-primary" },
              }
            )
            t.removeAttribute("data-kt-indicator", "on");
            t.disabled = !1;
        }
        })
        
    });
    
    $(document).on('click','*[data-request]',function(e){
        var req_click = $(this);
        e.preventDefault();
        const method = req_click.data('method');
        var params = req_click.data('params').split(',');
        var form = $('<form>');
        for(i = 0;i<params.length;i++){
            var p = params[i].split(':');
            form.append('<input name="'+p[0]+'" value="'+p[1]+'" />');
        }
        var data = form.serialize();
        req_click.attr('disabled','disabled');
        const confirm = req_click.attr('data-confirm');
        if(typeof confirm !== 'undefined' && confirm !== false){
            Swal.fire({
                text: req_click.data('confirm'),
                icon: "warning",
                buttonsStyling: !1,
                customClass: { confirmButton: "btn btn-primary",cancelButton:"btn btn-outline-default active" },
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Huỷ",
                closeOnConfirm: false,
                closeOnCancel: false 
              }
            ).then(function(action){
                if (action.isConfirmed) {
                  pushAjax(method,data);
                } 
              })
        }
        else{
            pushAjax(method,data);
        }
        req_click.removeAttr('disabled');
        
    });
    Dropzone.autoDiscover = false;

    let myDropzone = new Dropzone("#my-form");
    myDropzone.on("addedfile", file => {
    console.log(`File added: ${file.name}`);
    });
    });
function pushAjax(method,data){
    $.ajax({  
        url:window.location.href,  
        type: method ? method : 'POST',    
        data: data,  
        dataType:'json', 
        success:function(response){                 
            if(response.error === 1){
                Swal.fire({
                    text: response.message,
                    icon: 'error',
                    buttonsStyling: !1,
                    confirmButtonText: "Đồng ý",
                    customClass: { confirmButton: "btn btn-primary" },
                });                    
            }
            else{                    
                Swal.fire({
                    text: response.message,
                    icon: 'success',
                    buttonsStyling: !1,
                    confirmButtonText: "Đồng ý",
                    customClass: { confirmButton: "btn btn-primary" },

                }).then(function(){
                    if(response.redirect){
                    window.location = response.redirect;
                    }
                    else{
                        window.location.reload();
                    }
                });     
            }
            
        },  
        error:function(response){  
            Swal.fire({
                text: response.message ? response.message : 'Có lỗi, xin thử lại',
                icon: "error",
                buttonsStyling: !1,
                confirmButtonText: "Ok, got it!",
                customClass: { confirmButton: "btn btn-primary" },
            });
            
        }  
    });  
}
function getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}